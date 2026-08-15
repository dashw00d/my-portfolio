# syntax=docker/dockerfile:1.7

FROM node:20-alpine AS deps
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

FROM deps AS builder
COPY . .
ENV STATIC_EXPORT=true
# API routes and SSR pages cannot be statically exported. Production serves
# HTML from `out/` and handles POST /api/contact in static-server.mjs.
RUN rm -rf pages/api \
    && rm -f pages/sitemap.xml.ts pages/robots.txt.ts \
    && node scripts/write-seo-files.mjs \
    && npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000 \
    HOST=0.0.0.0 \
    STATIC_ROOT=/app/out \
    NEXT_TELEMETRY_DISABLED=1

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001 \
    && npm install --omit=dev nodemailer@6.10.1 \
    && rm -rf /root/.npm

COPY --from=builder /app/out ./out
COPY docker/static-server.mjs ./static-server.mjs

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=20s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:3000/').then((r)=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "static-server.mjs"]
