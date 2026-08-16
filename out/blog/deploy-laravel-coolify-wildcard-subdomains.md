---
title: "How to Deploy Laravel on Coolify with Wildcard Subdomains (Complete Guide)"
description: "Learn how to configure Coolify, Traefik, and Cloudflare to deploy a Laravel multi-tenant app with automatic wildcard SSL certificates and subdomain routing."
author: "Ryan Dashwood"
date: "2025-10-12"
tags: ["Laravel", "Coolify", "DevOps", "Self-Hosted", "Traefik", "SSL", "Multi-Tenant"]
featured: true
---

# How to Deploy Laravel on Coolify with Wildcard Subdomains (Complete Guide)

**Stuck trying to get `client1.yourdomain.com` and `client2.yourdomain.com` working with automatic SSL on Coolify?** You're not alone.

After wrestling with **CapRover**, **Traefik configurations**, and countless SSL certificate errors, I finally cracked the code for deploying Laravel apps with **wildcard subdomain routing** on Coolify — a self-hosted alternative to Heroku and Vercel.

This guide will walk you through everything: **Cloudflare DNS challenge**, **Traefik wildcard certificates**, **Laravel subdomain routing**, and why ditching **Nixpacks** for a custom **Dockerfile** saved my sanity.

By the end, you'll have a production-ready setup perfect for **multi-tenant SaaS**, **client portals**, or any app where each user gets their own subdomain.

---

## 🎯 What You'll Learn

- Why Coolify's default SSL setup fails with wildcard domains
- How to configure Traefik to use Cloudflare's DNS-01 challenge
- Setting up proper Laravel subdomain routing
- Why `php artisan serve` breaks everything (and what to use instead)
- Complete Traefik labels for wildcard + root domain routing
- Troubleshooting common SSL and redirect issues

---

## 🧱 The Problem: Why Wildcard Subdomains Are Tricky

**Coolify is amazing** — it's open-source, self-hosted, and makes deploying apps dead simple. But there's a catch with wildcard subdomains:

By default, Coolify tries to generate individual SSL certificates for each subdomain using Let's Encrypt's **HTTP-01 challenge**. This works fine if you have 5-10 known subdomains, but falls apart when you need:

- **Dynamic subdomains** (e.g., `{tenant}.yourdomain.com`)
- **Hundreds of potential subdomains**
- **Wildcard SSL certificates** that cover `*.yourdomain.com`

The solution? Switch to **DNS-01 challenge** with Cloudflare and configure Traefik (Coolify's reverse proxy) to handle wildcard routing.

---

## ⚙️ Prerequisites

Before we dive in, make sure you have:

- ✅ A **domain managed in Cloudflare** (e.g., `homeforged.com`)
- ✅ A **Cloudflare API Token** with these permissions:
  - `Zone > DNS > Edit`
  - `Zone > Zone > Read`
- ✅ A **Coolify server** up and running ([Installation guide](https://coolify.io/docs/installation))
- ✅ A **Laravel app** with subdomain routing configured:

```php
// routes/web.php
Route::domain('{subdomain}.homeforged.com')->group(function () {
    Route::get('/', [SubdomainController::class, 'index']);
    Route::get('/dashboard', [SubdomainController::class, 'dashboard']);
});
```

💡 **Pro tip**: Test your subdomain logic locally first using Laravel Valet or by editing `/etc/hosts`.

---

## 🌐 Step 1: Configure Cloudflare DNS

First, we need to ensure **all subdomains** resolve to your Coolify server.

### Add a Wildcard A Record

1. Log into your **Cloudflare dashboard**
2. Select your domain (e.g., `homeforged.com`)
3. Navigate to **DNS → Records**
4. Click **Add record** and configure:

```
Type: A
Name: *
IPv4: <your-coolify-server-IP>
Proxy Status: DNS Only (⚠️ gray cloud, NOT orange)
TTL: Auto
```

⚠️ **Important**: The proxy status must be **DNS Only** (gray cloud). If it's proxied (orange), Cloudflare will intercept requests and break SSL validation.

### Verify DNS Propagation

```bash
dig test.homeforged.com +short
# Should return: your.server.ip.address

dig another-test.homeforged.com +short
# Should also return: your.server.ip.address
```

If both return your server's IP, you're golden. If not, wait a few minutes for DNS to propagate.

---

## 🧩 Step 2: Configure Coolify's Wildcard Domain

1. In your **Coolify dashboard**, navigate to:
   - **Servers** → **[Your Server]** → **Configuration**
2. Find the **Wildcard Domain** field
3. Enter your root domain: `homeforged.com` (⚠️ **no asterisk**, no `www`)
4. **Save changes**

This tells Coolify: *"Hey, I'm managing subdomains under this domain, so expect them."*

---

## 🛡 Step 3: Enable Wildcard SSL with Traefik & Cloudflare

Here's where the magic happens. By default, Coolify's Traefik uses **HTTP-01 challenge**, which can't issue wildcard certificates. We'll switch to **DNS-01 challenge** using Cloudflare.

### Get Your Cloudflare API Token

1. Go to [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Click **Create Token**
3. Use the **Edit zone DNS** template
4. Set **Zone Resources** to your domain
5. Copy the token (you'll only see it once!)

### Edit Traefik Configuration

SSH into your Coolify server and edit the Traefik config:

```bash
cd /data/coolify/proxy
nano docker-compose.yml
```

Find the `traefik` service and modify it:

```yaml
services:
  traefik:
    image: traefik:v3.0
    container_name: coolify-proxy
    restart: unless-stopped

    environment:
      - CF_DNS_API_TOKEN=your_cloudflare_token_here

    command:
      - '--api.dashboard=true'
      - '--providers.docker=true'
      - '--providers.docker.exposedbydefault=false'
      - '--entrypoints.http.address=:80'
      - '--entrypoints.https.address=:443'

      # 🔥 DNS Challenge Configuration
      - '--certificatesresolvers.letsencrypt.acme.dnschallenge=true'
      - '--certificatesresolvers.letsencrypt.acme.dnschallenge.provider=cloudflare'
      - '--certificatesresolvers.letsencrypt.acme.dnschallenge.delaybeforecheck=0'
      - '--certificatesresolvers.letsencrypt.acme.email=your-email@example.com'
      - '--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json'

    labels:
      # 🌟 Wildcard Certificate Request
      - traefik.http.routers.traefik.tls.certresolver=letsencrypt
      - traefik.http.routers.traefik.tls.domains[0].main=homeforged.com
      - traefik.http.routers.traefik.tls.domains[0].sans=*.homeforged.com

    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./letsencrypt:/letsencrypt

    ports:
      - "80:80"
      - "443:443"

    networks:
      - coolify
```

### Apply Changes

```bash
docker compose down
docker compose up -d
```

### Monitor Certificate Generation

```bash
docker logs coolify-proxy -f
```

Look for lines like:
```
time="2025-10-12T..." level=info msg="Generating certificate for domain: *.homeforged.com"
time="2025-10-12T..." level=info msg="Challenge succeeded"
```

🎉 **Boom!** You now have a wildcard SSL certificate that covers both `homeforged.com` and `*.homeforged.com`.

---

## 📦 Step 4: Ditch Nixpacks, Use a Custom Dockerfile

Here's where I wasted hours: **Coolify's default Nixpacks buildpack uses `php artisan serve`** for Laravel apps.

This breaks in production because:
- `artisan serve` is a development server
- It doesn't play nice with reverse proxies
- It can't handle the load of a real app

### Create a Production-Ready Dockerfile

In your Laravel project root, create a `Dockerfile`:

```dockerfile
FROM php:8.3-fpm

# Set working directory
WORKDIR /var/www/html

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    zip \
    libzip-dev \
    nginx \
    supervisor \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd pdo pdo_mysql zip exif pcntl bcmath opcache

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- \
    --install-dir=/usr/local/bin --filename=composer

# Copy application files
COPY . .

# Install dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Set permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/sites-available/default

# Copy Supervisor configuration
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expose port
EXPOSE 8000

# Start services
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
```

### Create Nginx Configuration

Create `nginx.conf` in your project root:

```nginx
server {
    listen 8000;
    server_name _;
    root /var/www/html/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass 127.0.0.1:9000;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

### Create Supervisor Configuration

Create `supervisord.conf`:

```ini
[supervisord]
nodaemon=true
user=root
logfile=/var/log/supervisor/supervisord.log
pidfile=/var/run/supervisord.pid

[program:php-fpm]
command=/usr/local/sbin/php-fpm --nodaemonize
autostart=true
autorestart=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0

[program:nginx]
command=/usr/sbin/nginx -g "daemon off;"
autostart=true
autorestart=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0
```

### Update Coolify to Use Dockerfile

1. In Coolify, go to your **Laravel service**
2. Click **Edit** → **Build Pack**
3. Select **Dockerfile** (instead of Nixpacks)
4. Set **Port**: `8000`
5. Save and redeploy

---

## 🏷 Step 5: Configure Traefik Labels for Wildcard Routing

Now we need to tell Traefik how to route traffic to your Laravel app.

In Coolify:
1. Go to your **Laravel service**
2. Click **Edit** → **Advanced** → **Labels**
3. Replace with these labels:

```yaml
# Enable Traefik
traefik.enable=true

# Gzip compression
traefik.http.middlewares.gzip.compress=true

# HTTPS redirect middleware
traefik.http.middlewares.redirect-to-https.redirectscheme.scheme=https

# HTTP → HTTPS redirect for wildcard subdomains
traefik.http.routers.http-wildcard.entryPoints=http
traefik.http.routers.http-wildcard.rule=HostRegexp(`{subdomain:[a-z0-9-]+}.homeforged.com`)
traefik.http.routers.http-wildcard.middlewares=redirect-to-https

# HTTPS wildcard subdomain router
traefik.http.routers.https-wildcard.entryPoints=https
traefik.http.routers.https-wildcard.rule=HostRegexp(`{subdomain:[a-z0-9-]+}.homeforged.com`)
traefik.http.routers.https-wildcard.tls.certresolver=letsencrypt
traefik.http.routers.https-wildcard.tls=true
traefik.http.routers.https-wildcard.middlewares=gzip
traefik.http.services.https-wildcard.loadbalancer.server.port=8000

# HTTP → HTTPS redirect for root domain
traefik.http.routers.http-root.entryPoints=http
traefik.http.routers.http-root.rule=Host(`homeforged.com`)
traefik.http.routers.http-root.middlewares=redirect-to-https

# HTTPS root domain router
traefik.http.routers.https-root.entryPoints=https
traefik.http.routers.https-root.rule=Host(`homeforged.com`)
traefik.http.routers.https-root.tls.certresolver=letsencrypt
traefik.http.routers.https-root.tls=true
traefik.http.routers.https-root.middlewares=gzip
traefik.http.services.https-root.loadbalancer.server.port=8000
```

### Redeploy

Click **Redeploy** in Coolify and wait for the build to complete.

---

## 🔍 Step 6: Test Your Setup

### Test Root Domain

```bash
curl -I https://homeforged.com
```

Should return `200 OK` with a valid SSL certificate.

### Test Wildcard Subdomains

```bash
curl -I https://test.homeforged.com
curl -I https://client1.homeforged.com
curl -I https://anything.homeforged.com
```

All should return `200 OK` with the same wildcard SSL certificate.

### Check Certificate Details

```bash
echo | openssl s_client -servername test.homeforged.com -connect test.homeforged.com:443 2>/dev/null | openssl x509 -noout -text | grep DNS
```

Should show:
```
DNS:homeforged.com, DNS:*.homeforged.com
```

### Test in Browser

Open multiple subdomains in your browser:
- `https://homeforged.com`
- `https://app.homeforged.com`
- `https://client1.homeforged.com`

All should work with valid HTTPS and no certificate warnings.

---

## 🧰 Troubleshooting Common Issues

### ❌ SSL Certificate Won't Generate

**Symptoms**: ERR_SSL_VERSION_OR_CIPHER_MISMATCH or certificate errors

**Fix**:
1. Check Traefik logs: `docker logs coolify-proxy -f`
2. Verify Cloudflare token has correct permissions
3. Delete old certificate and retry:
   ```bash
   rm /data/coolify/proxy/letsencrypt/acme.json
   docker restart coolify-proxy
   ```

### 🔁 Too Many Redirects

**Symptoms**: Browser shows "ERR_TOO_MANY_REDIRECTS"

**Fix**:
1. Check your Laravel `.env` file:
   ```env
   APP_URL=https://homeforged.com  # No subdomain here!
   ```
2. Remove any HTTPS redirect middleware from Laravel (Traefik handles this)
3. Verify your Traefik labels don't have duplicate redirect rules

### 🕸 DNS Not Resolving

**Symptoms**: "This site can't be reached"

**Fix**:
1. Verify wildcard A record in Cloudflare
2. Check DNS propagation:
   ```bash
   dig test.homeforged.com @8.8.8.8 +short
   ```
3. Ensure DNS record is **not proxied** (gray cloud, not orange)

### ⚠️ Let's Encrypt Rate Limits

**Symptoms**: Certificate generation fails with "too many certificates"

**Fix**: Use staging server while testing:
```yaml
- '--certificatesresolvers.letsencrypt.acme.caserver=https://acme-staging-v02.api.letsencrypt.org/directory'
```

Once working, switch back to production:
```yaml
- '--certificatesresolvers.letsencrypt.acme.caserver=https://acme-v02.api.letsencrypt.org/directory'
```

### 🐌 Subdomain Routing Not Working in Laravel

**Symptoms**: All subdomains show the same content

**Fix**: Verify your route definition:
```php
// ❌ Wrong
Route::get('/', function () {
    return view('welcome');
});

// ✅ Correct
Route::domain('{subdomain}.homeforged.com')->group(function () {
    Route::get('/', function ($subdomain) {
        return "You're on: {$subdomain}";
    });
});
```

---

## 📊 Performance Tips

Now that your wildcard subdomain setup is working, here are some optimizations:

### 1. Enable OPcache

Add to your `Dockerfile`:
```dockerfile
RUN echo "opcache.enable=1" >> /usr/local/etc/php/conf.d/opcache.ini && \
    echo "opcache.memory_consumption=256" >> /usr/local/etc/php/conf.d/opcache.ini && \
    echo "opcache.max_accelerated_files=20000" >> /usr/local/etc/php/conf.d/opcache.ini
```

### 2. Add Redis for Sessions

```bash
# In Coolify, add a Redis service
# Then update Laravel .env:
SESSION_DRIVER=redis
CACHE_DRIVER=redis
REDIS_HOST=your-redis-container-name
```

### 3. Enable Gzip Compression

Already included in our Traefik labels! But verify with:
```bash
curl -I -H "Accept-Encoding: gzip" https://homeforged.com
```

Should show `Content-Encoding: gzip`.

---

## 🎯 Use Cases: What Can You Build?

This setup unlocks powerful multi-tenant architecture:

### 1. **SaaS with Custom Client Subdomains**
```
acmecorp.yourapp.com → client dashboard
initech.yourapp.com → different client
```

### 2. **White-Label Solutions**
```
brand1.yourplatform.com → custom branding
brand2.yourplatform.com → different theme
```

### 3. **Regional/Language Variants**
```
us.yoursite.com → USD, English
uk.yoursite.com → GBP, English
de.yoursite.com → EUR, German
```

### 4. **Development/Staging Environments**
```
dev.yourapp.com → latest dev build
staging.yourapp.com → QA environment
demo.yourapp.com → demo for clients
```

---

## ✅ Final Checklist

Before going to production, verify:

- [ ] Wildcard SSL certificate is valid and auto-renewing
- [ ] All subdomains resolve correctly via DNS
- [ ] HTTP automatically redirects to HTTPS
- [ ] Laravel subdomain routing works correctly
- [ ] Environment variables are production-ready
- [ ] Database backups are configured
- [ ] Monitoring/logging is set up (Sentry, LogRocket, etc.)
- [ ] Rate limiting is configured in Laravel
- [ ] Queue workers are running (if using jobs)

---

## 🚀 Conclusion

You now have a **production-ready Laravel deployment** on Coolify with:

✅ **Automatic wildcard SSL** via Let's Encrypt & Cloudflare
✅ **Dynamic subdomain routing** for multi-tenant apps
✅ **Proper production setup** with Nginx + PHP-FPM
✅ **Self-hosted infrastructure** (no monthly Heroku bills!)

This setup has been battle-tested with real traffic and scales beautifully. No more SSL headaches, no more certificate renewal failures, and best of all — **you own and control everything**.

---

## 💬 Questions or Stuck?

If you hit a roadblock or have questions about this setup, feel free to reach out:

- 🐦 Twitter: [@ryandashwood](https://twitter.com/ryandashwood)
- 💼 LinkedIn: [Ryan Dashwood](https://linkedin.com/in/ryandashwood)
- 🌐 Website: [dashwood.net](https://dashwood.net)

Found this guide helpful? **Share it with other Laravel developers** struggling with Coolify subdomain setups!

---

## 📚 Related Resources

- [Coolify Official Documentation](https://coolify.io/docs)
- [Traefik Wildcard Certificate Guide](https://doc.traefik.io/traefik/https/acme/)
- [Laravel Subdomain Routing Docs](https://laravel.com/docs/routing#route-group-subdomain-routing)
- [Cloudflare DNS API Documentation](https://developers.cloudflare.com/api/operations/dns-records-for-a-zone-list-dns-records)

---

*Last updated: October 12, 2025*
