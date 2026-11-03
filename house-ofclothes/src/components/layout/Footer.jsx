import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 py-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white font-black text-lg">
                H
              </span>
              <span className="font-bold text-zinc-900 dark:text-white tracking-tight">
                HOUSE OF CLOTHES
              </span>
            </div>
            <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              Modern fashion meets high-end comfort. Crafted for timeless elegance, sustainable style, and everyday confidence.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-3">
              Shop Collections
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/products?category=smartphones" className="hover:text-rose-500">
                  Featured Arrivals
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-rose-500">
                  All Collections
                </Link>
              </li>
              <li>
                <Link to="/products?sort=price_asc" className="hover:text-rose-500">
                  Affordable Chic
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-3">
              Account & Help
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/cart" className="hover:text-rose-500">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-rose-500">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-rose-500">
                  Track Orders
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-3">
              Customer Support
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">
              Have questions? Our support team is online 24/7.
            </p>
            <p className="text-xs font-semibold text-rose-500">
              support@houseofclothes.com
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-zinc-100 dark:border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400">
          <p>© {new Date().getFullYear()} House of Clothes. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Premium Fashion Experience</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
