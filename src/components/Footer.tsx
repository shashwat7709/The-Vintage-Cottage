import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebook } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#46392d] text-[#F5F1EA] py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="font-serif text-xl mb-4">The Vintage Cottage</h3>
            <p className="text-[#F5F1EA]/70 mb-6">
              Curating timeless elegance through carefully selected vintage and antique pieces.
            </p>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-xl font-serif mb-4">Contact Us</h3>
            <address className="not-italic">
              <p>123 Heritage Lane</p>
              <p>Vintage District, VD 12345</p>
              <p className="mt-2">Phone: +91 8668945632</p>
              <p>Email: info@vintagecottage.com</p>
            </address>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-serif mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-[#F5F1EA]/80 transition-colors">Home</Link></li>
              <li><Link to="/shop" className="hover:text-[#F5F1EA]/80 transition-colors">Shop</Link></li>
              <li><Link to="/about" className="hover:text-[#F5F1EA]/80 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-[#F5F1EA]/80 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-serif mb-4">Stay Updated</h3>
            <p className="mb-4">Subscribe to our newsletter for updates on new arrivals and special offers.</p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-md bg-[#F5F1EA] text-[#46392d] placeholder-[#46392d]/60"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#F5F1EA] text-[#46392d] rounded-md hover:bg-[#F5F1EA]/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-serif text-xl mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/the_vintage_cottagee/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-[#F5F1EA]/20 flex items-center justify-center text-[#F5F1EA]/70 hover:bg-[#F5F1EA]/20 transition-all duration-300"
                aria-label="Instagram"
              >
                <span className="sr-only">Instagram</span>
                <FaInstagram size={24} />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-[#F5F1EA]/20 flex items-center justify-center text-[#F5F1EA]/70 hover:bg-[#F5F1EA]/20 transition-all duration-300"
                aria-label="Facebook"
              >
                <span className="sr-only">Facebook</span>
                <FaFacebook size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#F5F1EA]/20 text-center">
          <p>&copy; {currentYear} The Vintage Cottage. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
