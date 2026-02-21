import React from "react";
import { Mail, MapPin, Github, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-900 text-white py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-bold mb-4">Ryan Stefan</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              Fixing tech problems that cost businesses customers. Performance, email, SEO, and custom development.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.linkedin.com/in/ryan-stefan-austin/"
                className="text-zinc-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://github.com/dashw00d"
                className="text-zinc-400 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://x.com/dashwizzle"
                className="text-zinc-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <nav aria-label="Footer navigation">
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#home" className="text-zinc-400 hover:text-white transition-colors">Home</a>
                </li>
                <li>
                  <a href="#problems" className="text-zinc-400 hover:text-white transition-colors">Problems</a>
                </li>
                <li>
                  <a href="#services" className="text-zinc-400 hover:text-white transition-colors">Services</a>
                </li>
                <li>
                  <a href="#examples" className="text-zinc-400 hover:text-white transition-colors">Examples</a>
                </li>
                <li>
                <a href="#contact-form" className="text-zinc-400 hover:text-white transition-colors">Contact</a>
                </li>
              </ul>
            </nav>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>Performance Optimization</li>
              <li>Email Deliverability</li>
              <li>Lead Tracking & CRM</li>
              <li>SEO & Technical Fixes</li>
              <li>Custom Web Apps</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Get In Touch</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-zinc-400">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <a href="mailto:ryan@dashwood.net" className="hover:text-white transition-colors break-all">
                  ryan@dashwood.net
                </a>
              </div>
              <div className="flex items-center gap-2 text-zinc-400">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>Houston, TX • Working nationwide</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-800 mt-12 pt-8 text-center text-sm text-zinc-500">
          <p>&copy; {currentYear} Ryan Stefan. All rights reserved.</p>
          <p className="mt-2">
            <a href="/privacy" className="text-zinc-500 hover:text-zinc-400 transition-colors">Privacy Policy</a>
            {" • "}
            <a href="/terms" className="text-zinc-500 hover:text-zinc-400 transition-colors">Terms of Service</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
