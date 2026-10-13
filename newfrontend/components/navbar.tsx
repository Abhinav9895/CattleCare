'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Leaf } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: '/', label: 'Home' },
    { href: '/scanner', label: 'Disease Scanner' },
    { href: '/diseases', label: 'Disease Library' },
    { href: '/vaccination', label: 'Vaccination Guide' },
    { href: '/pregnancy', label: 'Pregnancy Monitor' },
    { href: '/chatbot', label: 'AI Vet' },
    { href: '/vet-finder', label: 'Find Vets' },
  ];

  return (
    <nav className="bg-gradient-to-r from-card via-card to-card border-b border-primary/20 shadow-md sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity group">
            <div className="bg-gradient-to-br from-primary to-primary-light rounded-xl p-2.5 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all">
              <Leaf className="w-6 h-6 text-primary-foreground animate-pulse-soft" />
            </div>
            <span className="font-bold text-lg text-primary hidden sm:inline">CattleCare AI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-foreground hover:bg-gradient-to-r hover:from-primary/15 hover:to-primary-light/10 hover:text-primary rounded-lg transition-all hover:shadow-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2 text-sm font-medium text-foreground hover:bg-primary/10 hover:text-primary rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
