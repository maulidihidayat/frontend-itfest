"use client";
import Link from "next/link";
import { FaDiscord, FaGithub, FaTwitter } from "react-icons/fa";
import { RiFacebookFill } from "react-icons/ri";
import Image from "next/image";
export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Utama",
      links: [
        { name: "Home", href: "#home" },
        { name: "Fitur", href: "#features" },
        { name: "Testimoni", href: "#testimonial" },
        { name: "FAQ", href: "#faq" },
      ],
    },
    {
      title: "Komunitas",
      links: [
        { name: "Tentang Kami", href: "#about" },
        { name: "Blog", href: "#blog" },
        { name: "Karir", href: "#careers" },
        { name: "Kontak", href: "#contact" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Dokumentasi", href: "#docs" },
        { name: "Pusat Bantuan", href: "#help" },
        { name: "Privacy Policy", href: "#privacy" },
        { name: "Terms of Service", href: "#terms" },
      ],
    },
  ];

  const socialLinks = [
    {
      icon: <FaGithub className="w-5 h-5" />,
      href: "https://github.com/ifalfahri/imphnen-lp",
      label: "GitHub",
    },
    {
      icon: <FaTwitter className="w-5 h-5 text-sky-400" />,
      href: "https://twitter.com",
      label: "Twitter",
    },
    {
      icon: <FaDiscord className="w-5 h-5 text-indigo-500" />,
      href: "https://discord.com",
      label: "Discord",
    },
    {
      icon: <RiFacebookFill className="w-5 h-5 text-blue-600" />,
      href: "https://facebook.com/groups/programmerhandal",
      label: "Facebook",
    },
  ];

  return (
    <footer className="w-full border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 transition-colors duration-500">
      <div className="container mx-auto px-4 py-12 md:px-10">
        <div className="flex flex-col items-start justify-between gap-12 space-y-8 md:flex-row md:space-y-0">
          {/* Logo and Tagline */}
          <div className="flex flex-col space-y-4">
            <Link href="/" className="flex items-center">
              <Image src="/mind.png" alt="logo" width={170} height={200} />
            </Link>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">
              Slide keren tanpa ribet, langsung dari dokumenmu.
            </p>
            <div className="flex space-x-4 mt-4">
              {socialLinks.map((social, idx) => (
                <Link
                  key={`social-${idx}`}
                  href={social.href}
                  aria-label={social.label}
                  className="text-gray-600 hover:rotate-10 hover:scale-125 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-all duration-200"
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section, idx) => (
            <div key={`footer-section-${idx}`} className="flex flex-col space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {section.title}
              </h3>
              <ul className="flex flex-col space-y-2">
                {section.links.map((link, linkIdx) => (
                  <li key={`footer-link-${idx}-${linkIdx}`}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-10 flex flex-col items-center justify-between border-t border-gray-200 pt-6 dark:border-gray-700 md:flex-row">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            &copy; {currentYear} MINDSSLIDE AI Made by{" "}
            <Link
              className="text-sky-400 dark:text-blue-400 hover:underline"
              href="https://ifal.me"
              target="_blank"
              rel="noopener noreferrer"
            >
              Anti BurnOut Team
            </Link>
            . All rights reserved.
          </p>
        </div>

        {/* Full Width Watermark */}
        <div className="mx-auto h-full w-full overflow-hidden relative">
          <h1 className="absolute left-0 bottom-0 text-[14.7vw] font-extrabold tracking-tighter text-gray-200 dark:text-white/5 select-none pointer-events-none">
            MINDSSLIDE.AI
          </h1>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
