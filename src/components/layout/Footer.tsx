'use client';
import Link from 'next/link';
import { Shield, Mail, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      background: '#0a0e1a',
      borderTop: '1px solid #1e2d4a',
      padding: '60px 0 32px',
    }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 48 }}>
          {/* Brand */}
          <div style={{ gridColumn: '1 / -1', maxWidth: 300 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 9,
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
              }}>⛏️</div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: '#f1f5f9' }}>
                AR-VOCATIONAL
              </div>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.7 }}>
              AR-based vocational training for industrial workers in mining, steel, and mica sectors. 
              SIH 2026 Problem Statement 26041.
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <span className="badge badge-orange">SIH 2026</span>
              <span className="badge badge-blue">Free & Open</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>
              Platform
            </div>
            {[
              { href: '/', label: 'Home' },
              { href: '/training', label: 'Training Library' },
              { href: '/simulator/fire-extinguisher', label: 'Fire Extinguisher Sim' },
              { href: '/simulator/mining-hazards', label: 'Mining Hazard Sim' },
              { href: '/assessment', label: 'Assessments' },
              { href: '/dashboard', label: 'Dashboard' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                style={{ display: 'block', color: '#64748b', textDecoration: 'none', fontSize: '0.875rem', marginBottom: 10, transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#94a3b8')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Safety */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>
              Training Areas
            </div>
            {['Fire Safety', 'Mining Safety', 'Emergency Evacuation', 'Industrial Safety', 'PPE Training', 'Hazard Identification'].map(label => (
              <div key={label} style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: 10 }}>{label}</div>
            ))}
          </div>

          {/* Disclaimer */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>
              Disclaimer
            </div>
            <p style={{ color: '#64748b', fontSize: '0.8rem', lineHeight: 1.7 }}>
              This simulator is for educational demonstration purposes only. It does not replace professional 
              safety training, certification, or qualified instruction.
            </p>
            <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(249,115,22,0.07)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#f97316', fontSize: '0.8rem', fontWeight: 600 }}>
                <Shield size={13} /> Safety First
              </div>
              <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: 4 }}>
                Always follow certified safety protocols.
              </div>
            </div>
          </div>
        </div>

        <div className="divider" />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ color: '#475569', fontSize: '0.8rem' }}>
            © 2026 AR-VOCATIONAL · Built for SIH 2026 Problem Statement 26041
          </div>
          <div style={{ color: '#475569', fontSize: '0.8rem' }}>
            Technologies: Next.js · Three.js · React Three Fiber · TypeScript
          </div>
        </div>
      </div>
    </footer>
  );
}
