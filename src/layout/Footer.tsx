import React from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  XIcon,
} from "lucide-react";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-6 w-6 text-magazine-purple" />
              <span className="text-xl font-bold bg-gradient-to-r from-magazine-purple to-magazine-blue bg-clip-text text-transparent">
                MagSub
              </span>
            </div>
            <p className="text-gray-600 text-sm">
              Your gateway to the best magazine subscriptions worldwide.
              Discover, subscribe, and enjoy.
            </p>
            <div className="flex space-x-4 mt-4">
              <a
                href="#"
                className="text-gray-400 hover:text-magazine-purple transition-colors"
              >
                <FacebookIcon className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-magazine-purple transition-colors"
              >
                <XIcon className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-magazine-purple transition-colors"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-magazine-purple transition-colors text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/magazines"
                  className="text-gray-600 hover:text-magazine-purple transition-colors text-sm"
                >
                  Magazines
                </Link>
              </li>
              <li>
                <Link
                  to="/plans"
                  className="text-gray-600 hover:text-magazine-purple transition-colors text-sm"
                >
                  Plans
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-magazine-purple transition-colors text-sm"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-magazine-purple transition-colors text-sm"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-magazine-purple transition-colors text-sm"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-magazine-purple transition-colors text-sm"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Newsletter</h3>
            <p className="text-gray-600 text-sm mb-4">
              Subscribe to our newsletter to get updates on new magazines and
              exclusive offers.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-3 py-2 text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-magazine-purple focus:border-magazine-purple flex-grow"
              />
              <button className="bg-magazine-purple text-white px-3 py-2 text-sm rounded-r-md hover:bg-magazine-darkpurple transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-10 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            © {currentYear} MagSub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
