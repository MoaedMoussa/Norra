import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Youtube, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 mt-24 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#14110E] text-[#F8F5EE] inline-flex items-center justify-center text-[14px]" style={{ fontFamily: 'Fraunces, serif' }}>N</span>
            <span className="font-medium text-[20px]" style={{ fontFamily: 'Fraunces, serif', letterSpacing: '-0.02em' }}>Norra</span>
          </div>
          <p className="mt-4 text-[14px] text-neutral-600 max-w-md leading-relaxed">A small studio building calm Notion templates that help you run your work and your life with intention.</p>
          <div className="flex gap-2 mt-5">
            <a href="#" className="w-9 h-9 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-white transition"><Twitter size={16} /></a>
            <a href="#" className="w-9 h-9 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-white transition"><Youtube size={16} /></a>
            <a href="#" className="w-9 h-9 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-white transition"><Instagram size={16} /></a>
          </div>
        </div>
        <div>
          <h4 className="text-[13px] font-semibold uppercase tracking-wider text-neutral-500 mb-4">Templates</h4>
          <ul className="space-y-2.5 text-[14px]">
            <li><Link to="/templates/notion-second-brain" className="text-neutral-700 hover:text-black">Second Brain</Link></li>
            <li><Link to="/templates/notion-finance-tracker" className="text-neutral-700 hover:text-black">Finance Tracker</Link></li>
            <li><Link to="/templates/notion-life-planner" className="text-neutral-700 hover:text-black">Life Planner</Link></li>
            <li><Link to="/templates/notion-creator-system" className="text-neutral-700 hover:text-black">Creator System</Link></li>
            <li><Link to="/templates/notion-complete-bundle" className="text-neutral-700 hover:text-black">Complete Bundle</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-[13px] font-semibold uppercase tracking-wider text-neutral-500 mb-4">Company</h4>
          <ul className="space-y-2.5 text-[14px]">
            <li><Link to="/compare" className="text-neutral-700 hover:text-black">Compare</Link></li>
            <li><Link to="/tutorials" className="text-neutral-700 hover:text-black">Tutorials</Link></li>
            <li><Link to="/tools" className="text-neutral-700 hover:text-black">Free Tools</Link></li>
            <li><a href="#" className="text-neutral-700 hover:text-black">Affiliate</a></li>
            <li><a href="#" className="text-neutral-700 hover:text-black">Support</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-[13px] text-neutral-500">
          <div>© 2026 Norra Studio. Made with care.</div>
          <div className="flex gap-6"><a href="#" className="hover:text-neutral-800">Terms</a><a href="#" className="hover:text-neutral-800">Privacy</a><a href="#" className="hover:text-neutral-800">Refunds</a></div>
        </div>
      </div>
    </footer>
  );
}
