import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Youtube, Instagram } from 'lucide-react';

const Footer = () => (
  <footer className="bg-[#172337] text-gray-300 mt-8">
    <div className="page-container py-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 pb-8 border-b border-gray-600">
        <div>
          <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-3">About</h4>
          <ul className="space-y-2 text-sm">
            {['Contact Us', 'About Us', 'Careers', 'Flipkart Stories', 'Press'].map(l => (
              <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-3">Help</h4>
          <ul className="space-y-2 text-sm">
            {['Payments', 'Shipping', 'Cancellation & Returns', 'FAQ', 'Report Infringement'].map(l => (
              <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-3">Policy</h4>
          <ul className="space-y-2 text-sm">
            {['Return Policy', 'Terms Of Use', 'Security', 'Privacy', 'Sitemap', 'EPR Compliance'].map(l => (
              <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-3">Social</h4>
          <div className="flex flex-col gap-2">
            {[
              { icon: <Facebook size={16} />, label: 'Facebook' },
              { icon: <Twitter size={16} />, label: 'Twitter' },
              { icon: <Youtube size={16} />, label: 'YouTube' },
              { icon: <Instagram size={16} />, label: 'Instagram' },
            ].map(({ icon, label }) => (
              <a key={label} href="#" className="flex items-center gap-2 text-sm hover:text-white transition-colors">
                {icon} {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
        {/* <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
          <span className="flex items-center gap-2">
            <span>🏠</span> <strong className="text-white">Registered Office Address:</strong>
          </span>
          <span>Buildings Alyssa, Begonia & Clove, Embassy Tech Village, Bengaluru, 560103</span>
        </div> */}
        <p className="text-sm text-gray-500">© 2024 Flipkart Clone. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
