'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, Globe, Shield, Flame, LayoutDashboard, BookOpen, ClipboardList, ChevronDown } from 'lucide-react';
import { useLang } from '@/context/LanguageContext';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { lang, setLang, t } = useLang();
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: t('nav_home'), icon: Shield },
    { href: '/training', label: t('nav_training'), icon: BookOpen },
    { href: '/assessment', label: t('nav_assessment'), icon: ClipboardList },
    { href: '/dashboard', label: t('nav_dashboard'), icon: LayoutDashboard },
  ];

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(10,14,26,0.85)', backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(30,45,74,0.8)',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'linear-gradient(135deg, #f97316, #ea580c)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, boxShadow: '0 0 20px rgba(249,115,22,0.3)',
          }}>⛏️</div>
          <div>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.05rem', color: '#f1f5f9', lineHeight: 1 }}>
              AR-VOCATIONAL
            </div>
            <div style={{ fontSize: '0.65rem', color: '#f97316', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Safety Training Simulator
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="desktop-nav">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                padding: '8px 14px', borderRadius: 8,
                textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500,
                color: isActive(href) ? '#f97316' : '#94a3b8',
                background: isActive(href) ? 'rgba(249,115,22,0.1)' : 'transparent',
                border: isActive(href) ? '1px solid rgba(249,115,22,0.2)' : '1px solid transparent',
                transition: 'all 0.2s',
              }}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Language switcher */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 12px', borderRadius: 8,
                background: 'rgba(26,35,64,0.8)', border: '1px solid rgba(42,63,107,0.8)',
                color: '#94a3b8', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500,
                fontFamily: 'Inter, sans-serif',
              }}
            >
              <Globe size={14} />
              {lang === 'en' ? 'EN' : 'HI'}
              <ChevronDown size={12} />
            </button>
            {langOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                background: '#141c2e', border: '1px solid #1e2d4a', borderRadius: 10,
                overflow: 'hidden', zIndex: 200, minWidth: 130,
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              }}>
                {[
                  { code: 'en' as const, label: 'English', sublabel: 'English' },
                  { code: 'hi' as const, label: 'हिन्दी', sublabel: 'Hindi' },
                ].map(({ code, label, sublabel }) => (
                  <button
                    key={code}
                    onClick={() => { setLang(code); setLangOpen(false); }}
                    style={{
                      width: '100%', padding: '10px 14px', background: lang === code ? 'rgba(249,115,22,0.1)' : 'transparent',
                      border: 'none', color: lang === code ? '#f97316' : '#94a3b8',
                      textAlign: 'left', cursor: 'pointer', fontSize: '0.875rem',
                      fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', gap: 8,
                    }}
                  >
                    <span style={{ fontSize: '1rem' }}>{code === 'en' ? '🇬🇧' : '🇮🇳'}</span>
                    <div>
                      <div style={{ fontWeight: 600 }}>{label}</div>
                      <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>{sublabel}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* CTA */}
          <Link href="/training" className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
            <Flame size={14} /> {t('nav_start_training')}
          </Link>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 6 }}
            className="mobile-menu-btn"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          background: '#0f1629', borderTop: '1px solid #1e2d4a',
          padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 16px', borderRadius: 10, textDecoration: 'none',
                color: isActive(href) ? '#f97316' : '#94a3b8',
                background: isActive(href) ? 'rgba(249,115,22,0.08)' : 'transparent',
                fontSize: '0.9rem', fontWeight: 500,
              }}
            >
              <Icon size={16} /> {label}
            </Link>
          ))}
        </div>
      )}

      <style jsx>{`
        .desktop-nav { display: flex; }
        .mobile-menu-btn { display: none; }
        @media (max-width: 768px) {
          .desktop-nav { display: none; }
          .mobile-menu-btn { display: block; }
        }
      `}</style>
    </nav>
  );
}
