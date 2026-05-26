"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import { FaInstagram, FaTwitter, FaLinkedinIn, FaYoutube } from "react-icons/fa";

const footerLinks = {
  product: [
    { name: "Features", href: "#features" },
    { name: "Supported Cities", href: "#cities" },
    { name: "AI Planner", href: "#planner" },
    { name: "Pricing", href: "#" },
  ],
  company: [
    { name: "About Us", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Press", href: "#" },
  ],
  support: [
    { name: "Help Center", href: "#" },
    { name: "Contact Us", href: "#contact" },
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
  ],
};

const socialLinks = [
  { Icon: FaInstagram, href: "#", label: "Instagram" },
  { Icon: FaTwitter, href: "#", label: "Twitter" },
  { Icon: FaLinkedinIn, href: "#", label: "LinkedIn" },
  { Icon: FaYoutube, href: "#", label: "YouTube" },
];

export function Footer() {
  return (
    <footer id="contact" className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <Image
                src="/logo-yatrix.png"
                alt="Yatrix Logo"
                width={36}
                height={36}
                className="h-9 w-9 invert"
              />
              <span className="text-xl font-bold text-background">Yatrix</span>
            </Link>
            <p className="text-background/70 mb-6 max-w-xs">
              AI-powered travel planning for your favorite Indian cities. Plan smarter, travel better.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-background/70">
                <Mail className="h-4 w-4" />
                <span>hello@yatrix.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-background/70">
                <Phone className="h-4 w-4" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-background/70">
                <MapPin className="h-4 w-4" />
                <span>New Delhi, India</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-background mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/70 hover:text-background transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-background mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/70 hover:text-background transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-background mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/70 hover:text-background transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/10 py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-background/60">
            © {new Date().getFullYear()} Yatrix. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors"
                aria-label={social.label}
              >
                <social.Icon className="h-5 w-5 text-background/70" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}