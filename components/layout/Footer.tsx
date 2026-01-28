import Link from 'next/link';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { Github, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const menuItems = [
    { href: '/', label: 'Dashboard' },
    { href: '/flood-map', label: 'Flood Map' },
    { href: '/warning', label: 'Warnings' },
    { href: '/sensor-data', label: 'Sensor Data' },
    { href: '/report-flood', label: 'Report Flood' },
  ];

  return (
    <footer className="bg-background text-foreground/60 border-t mt-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description Section */}

          <div className="md:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Image
                src="/apple-icon.png"
                alt="RisqMap Logo"
                width={32}
                height={32}
                className="rounded-md"
              />
              <span className="text-2xl font-bold text-foreground">
                RisqMap
              </span>
            </Link>
            <p className="mt-2 text-sm">
              Integrated Early Warning System and Flood Information.
            </p>
          </div>

          {/* Navigation Section */}
          <div className="md:col-span-1">
            <h3 className="font-semibold text-foreground">Navigation</h3>
            <ul className="mt-4 space-y-2">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us Section */}
          <div className="md:col-span-1">
            <h3 className="font-semibold text-foreground">Contact Us</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>Email: support@risqmap.com</li>
              <li>Phone: </li>
              <li>Address: United States</li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div className="md:col-span-1">
            <h3 className="font-semibold text-foreground">Follow Us</h3>
            <div className="flex mt-4 space-x-4">
              <a
                href="https://github.com/risqmap"
                className="hover:text-foreground transition-colors"
              >
                <Github size={20} />
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                <Twitter size={20} />
              </a>
              <a
                href="https://www.linkedin.com/company/risqmap"
                className="hover:text-foreground transition-colors"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-border" />

        <div className="text-center text-sm">
          <p>&copy; {currentYear} RisqMap. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
