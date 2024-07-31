import Link from "next/link";
import { ExternalLinkIcon } from "lucide-react";

const currentYear = new Date().getFullYear();

function Footer() {
  return (
    <footer className="w-full bg-neutral-100 dark:bg-neutral-900 flex flex-col items-center py-2">
      <div className="md:flex-row flex-col gap-5 flex">
        <div className="container md:mx-auto md:px-6">
          <h2 className="text-black dark:text-white text-lg font-semibold text-left">
            Quick Links
          </h2>
          <ul className="text-left">
            <li>
              <Link
                href="/about"
                className="text-neutral-800 dark:text-neutral-400 hover:text-neutral-200 dark:hover:text-neutral-100"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/services"
                className="text-neutral-800 dark:text-neutral-400 hover:text-neutral-200 dark:hover:text-neutral-100"
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-neutral-800 dark:text-neutral-400 hover:text-neutral-200 dark:hover:text-neutral-100"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div className="container md:mx-auto md:px-6">
          <h2 className="text-black dark:text-white text-lg font-semibold text-left">
            Need a website?
          </h2>
          <p className="text-neutral-800 dark:text-neutral-100 text-left">
            We can help! Contact Kaden Frisk for a free consultation.
          </p>
          <div className="flex flex-row text-blue-600 hover:text-blue-300">
            <Link href="https://kadenfrisk.com/" target="_blank">
              Kaden Frisk Website
            </Link>
            <ExternalLinkIcon className="w-4 h-4 my-auto" />
          </div>
        </div>
      </div>
      <div className="container md:mx-auto md:px-6 py-8 text-center">
        <p className="text-black dark:text-neutral-100 text-sm">
          &copy; 1987-{currentYear}{" "}
          <span className="font-bold">The Photo Store.</span> All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
