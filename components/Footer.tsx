import React from "react";
import Link from "@/components/Link";
import { Github, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-900 text-white py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-bold mb-4">Ryan Stefan</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              Solo product engineer building automation systems, modernizing legacy stacks, and shipping practical AI tooling.
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
                  <Link href="/#home" className="text-zinc-400 hover:text-white transition-colors">Home</Link>
                </li>
                <li>
                  <Link href="/#problems" className="text-zinc-400 hover:text-white transition-colors">Problems</Link>
                </li>
                <li>
                  <Link href="/#services" className="text-zinc-400 hover:text-white transition-colors">Services</Link>
                </li>
                <li>
                  <Link href="/#examples" className="text-zinc-400 hover:text-white transition-colors">Examples</Link>
                </li>
                <li>
                  <Link href="/blog" className="text-zinc-400 hover:text-white transition-colors">Blog</Link>
                </li>
                <li>
                  <Link href="/projects" className="text-zinc-400 hover:text-white transition-colors">Projects</Link>
                </li>
                <li>
                  <Link href="/#contact-form" className="text-zinc-400 hover:text-white transition-colors">Contact</Link>
                </li>
              </ul>
            </nav>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Focus Areas</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>Legacy PHP to Laravel modernization</li>
              <li>AI agent and workflow automation</li>
              <li>Data pipelines and crawler infrastructure</li>
              <li>Production debugging and hardening</li>
              <li>Performance and delivery reliability</li>
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
                <Phone className="h-4 w-4 flex-shrink-0" />
                <a href="tel:+17372059226" className="hover:text-white transition-colors">
                  (737) 205-9226
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
          <p className="leading-relaxed">
            &copy; {currentYear} Ryan Stefan · Houston, TX ·{" "}
            <a href="tel:+17372059226" className="hover:text-zinc-300 transition-colors">
              (737) 205-9226
            </a>{" "}
            ·{" "}
            <a href="mailto:ryan@dashwood.net" className="hover:text-zinc-300 transition-colors">
              ryan@dashwood.net
            </a>
          </p>
          <p className="mt-3 leading-relaxed">
            <Link href="/privacy-policy" className="hover:text-zinc-300 transition-colors">
              Privacy Policy
            </Link>{" "}
            ·{" "}
            <Link href="/terms-of-service" className="hover:text-zinc-300 transition-colors">
              Terms of Service
            </Link>{" "}
            ·{" "}
            <Link href="/refund-cancellation-policy" className="hover:text-zinc-300 transition-colors">
              Refund &amp; Cancellation Policy
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
