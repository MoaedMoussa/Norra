import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ChevronDown, ShoppingBag, Menu, X, BookOpen, Wallet, CalendarCheck, Sparkles, Briefcase, Building2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import SignInModal from './SignInModal';

const templateLinks = [
  { slug: 'notion-second-brain', name: 'Second Brain', desc: 'Organize your entire life', Icon: BookOpen },
  { slug: 'notion-finance-tracker', name: 'Finance Tracker', desc: 'Take control of money', Icon: Wallet },
  { slug: 'notion-life-planner', name: 'Life Planner', desc: 'Plan every day with intent', Icon: CalendarCheck },
  { slug: 'notion-creator-system', name: 'Creator System', desc: 'Grow your creator business', Icon: Sparkles },
  { slug: 'notion-freelance-system', name: 'Freelance System', desc: 'Run your freelance work', Icon: Briefcase },
  { slug: 'notion-business-system', name: 'Business System', desc: 'Operate your whole business', Icon: Building2 },
];

export default function Navbar() {
  const [dropdown, setDropdown] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const { count } = useCart();

  return (
    <>
      <div className="bg-[#0A0A0A] text-white text-[13px] text-center py-2.5 px-4">
        <Link to="/templates/notion-complete-bundle" className="hover:opacity-80 transition">
          <span className="text-[#F5C542] mr-1">✴✲</span> Get All Templates for $99 (80% OFF) <span className="mx-1">→</span> <span className="underline underline-offset-2">Unlock Complete Bundle</span>
        </Link>
      </div>

      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-neutral-200/70">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 h-[68px] flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center text-sm font-bold">P</div>
              <span className="font-semibold text-[17px] tracking-tight">PathPages</span>
            </Link>

            <nav className="hidden lg:flex items-center gap-8 text-[15px] text-neutral-800">
              <div
                className="relative"
                onMouseEnter={() => setDropdown(true)}
                onMouseLeave={() => setDropdown(false)}
              >
                <button className="flex items-center gap-1 hover:text-black transition">
                  Templates <ChevronDown size={16} className={`transition ${dropdown ? 'rotate-180' : ''}`} />
                </button>
                {dropdown && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3">
                    <div className="bg-white border border-neutral-200 rounded-2xl shadow-2xl p-3 w-[560px] grid grid-cols-2 gap-1 fade-in">
                      {templateLinks.map(({ slug, name, desc, Icon }) => (
                        <Link
                          key={slug}
                          to={`/templates/${slug}`}
                          className="flex items-start gap-3 p-3 rounded-xl hover:bg-neutral-50 transition"
                        >
                          <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0">
                            <Icon size={18} className="text-neutral-800" />
                          </div>
                          <div>
                            <div className="font-semibold text-[14px]">{name}</div>
                            <div className="text-[13px] text-neutral-500">{desc}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <NavLink to="/tutorials" className="hover:text-black transition">Tutorials</NavLink>
              <NavLink to="/tools" className="hover:text-black transition">Tools</NavLink>
              <NavLink to="/compare" className="hover:text-black transition">Compare</NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/cart" className="relative w-10 h-10 rounded-full hover:bg-neutral-100 flex items-center justify-center transition">
              <ShoppingBag size={18} />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#EF4444] text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold">{count}</span>
              )}
            </Link>
            <button onClick={() => setSignInOpen(true)} className="hidden sm:inline-block pp-btn-light px-4 py-2 text-[14px]">Sign In</button>
            <button className="lg:hidden w-10 h-10 flex items-center justify-center" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t border-neutral-200 bg-white">
            <div className="px-5 py-4 flex flex-col gap-1">
              {templateLinks.map(({ slug, name, Icon }) => (
                <Link key={slug} to={`/templates/${slug}`} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 py-2.5 text-[15px]">
                  <Icon size={18} className="text-neutral-500" /> {name}
                </Link>
              ))}
              <div className="h-px bg-neutral-200 my-2" />
              <Link to="/tutorials" onClick={() => setMobileOpen(false)} className="py-2 text-[15px]">Tutorials</Link>
              <Link to="/tools" onClick={() => setMobileOpen(false)} className="py-2 text-[15px]">Tools</Link>
              <Link to="/compare" onClick={() => setMobileOpen(false)} className="py-2 text-[15px]">Compare</Link>
              <button onClick={() => { setSignInOpen(true); setMobileOpen(false); }} className="pp-btn-light py-2.5 mt-2 text-[14px]">Sign In</button>
            </div>
          </div>
        )}
      </header>

      <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} />
    </>
  );
}
