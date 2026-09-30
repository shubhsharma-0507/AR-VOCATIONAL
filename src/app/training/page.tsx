'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, Clock, ChevronRight, CheckCircle, BookOpen, Star } from 'lucide-react';
import { useLang } from '@/context/LanguageContext';
import { TRAINING_MODULES } from '@/data/modules';
import { getModuleProgress } from '@/lib/storage';
import type { ModuleCategory, UserProgress } from '@/types';

const CATEGORIES: { value: ModuleCategory | 'all'; label: string; labelHi: string }[] = [
  { value: 'all', label: 'All Modules', labelHi: 'सभी मॉड्यूल' },
  { value: 'Fire Safety', label: 'Fire Safety', labelHi: 'अग्नि सुरक्षा' },
  { value: 'Mining', label: 'Mining', labelHi: 'खनन' },
  { value: 'Emergency', label: 'Emergency', labelHi: 'आपातकाल' },
  { value: 'General Safety', label: 'General Safety', labelHi: 'सामान्य सुरक्षा' },
];

const DIFF_COLOR: Record<string, string> = {
  'Beginner': '#10b981',
  'Intermediate': '#f59e0b',
  'Advanced': '#ef4444',
};

const CATEGORY_COLOR: Record<string, string> = {
  'Fire Safety': '#ef4444',
  'Mining': '#f59e0b',
  'Emergency': '#3b82f6',
  'General Safety': '#8b5cf6',
};

export default function TrainingPage() {
  const { lang, t } = useLang();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<ModuleCategory | 'all'>('all');
  const [progress, setProgress] = useState<Record<string, UserProgress>>({});

  useEffect(() => {
    const p: Record<string, UserProgress> = {};
    TRAINING_MODULES.forEach(m => { p[m.id] = getModuleProgress(m.id); });
    setProgress(p);
  }, []);

  const filtered = TRAINING_MODULES.filter(m => {
    const matchSearch = search === '' ||
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.titleHi.includes(search) ||
      m.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'all' || m.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div>
      {/* Header */}
      <div style={{ background: '#0f1629', borderBottom: '1px solid #1e2d4a', padding: '48px 0 0' }}>
        <div className="container">
          <div style={{ marginBottom: 8 }}>
            <span className="badge badge-blue">{lang === 'en' ? 'Industrial Safety Training' : 'औद्योगिक सुरक्षा प्रशिक्षण'}</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 900, color: '#f1f5f9', marginBottom: 10 }}>
            {t('training_title')}
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: 600 }}>{t('training_subtitle')}</p>

          {/* Search + filter bar */}
          <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap', paddingBottom: 28 }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
              <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                type="text"
                className="input-field"
                placeholder={t('search_placeholder')}
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: 42 }}
              />
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {CATEGORIES.map(({ value, label, labelHi }) => (
                <button
                  key={value}
                  onClick={() => setActiveCategory(value)}
                  className="tab-btn"
                  style={{
                    background: activeCategory === value ? 'rgba(249,115,22,0.12)' : 'transparent',
                    color: activeCategory === value ? '#f97316' : '#64748b',
                    border: activeCategory === value ? '1px solid rgba(249,115,22,0.3)' : '1px solid #1e2d4a',
                  }}
                >
                  {lang === 'en' ? label : labelHi}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Module grid */}
      <div className="container" style={{ padding: '40px 20px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <p style={{ color: '#64748b', fontSize: '1rem' }}>
              {lang === 'en' ? 'No modules found. Try a different search.' : 'कोई मॉड्यूल नहीं मिला। अलग खोज आज़माएं।'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {filtered.map(m => {
              const p = progress[m.id];
              const pct = p?.completionPercentage ?? 0;
              const done = p?.completed ?? false;
              const catColor = CATEGORY_COLOR[m.category] ?? '#64748b';

              return (
                <div key={m.id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  {/* Card header stripe */}
                  <div style={{
                    height: 6,
                    background: `linear-gradient(90deg, ${catColor}, ${catColor}80)`,
                  }} />

                  <div style={{ padding: 28, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Top row */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                      <span style={{ fontSize: 40 }}>{m.thumbnail}</span>
                      {done && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#10b981', fontSize: '0.8rem', fontWeight: 600 }}>
                          <CheckCircle size={16} /> {t('completed')}
                        </div>
                      )}
                    </div>

                    {/* Badges row */}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: catColor, background: `${catColor}15`, border: `1px solid ${catColor}30`, padding: '3px 8px', borderRadius: 20 }}>
                        {lang === 'en' ? m.category : ({ 'Fire Safety': 'अग्नि सुरक्षा', 'Mining': 'खनन', 'Emergency': 'आपातकाल', 'General Safety': 'सामान्य सुरक्षा' }[m.category])}
                      </span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: DIFF_COLOR[m.difficulty], background: `${DIFF_COLOR[m.difficulty]}15`, border: `1px solid ${DIFF_COLOR[m.difficulty]}30`, padding: '3px 8px', borderRadius: 20 }}>
                        {m.difficulty}
                      </span>
                    </div>

                    <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#f1f5f9', marginBottom: 10 }}>
                      {lang === 'en' ? m.title : m.titleHi}
                    </h3>
                    <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.7, flex: 1, marginBottom: 20 }}>
                      {lang === 'en' ? m.description : m.descriptionHi}
                    </p>

                    {/* Meta */}
                    <div style={{ display: 'flex', gap: 16, marginBottom: 18 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: '0.8rem' }}>
                        <Clock size={13} /> {m.duration} {t('minutes')}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: '0.8rem' }}>
                        <BookOpen size={13} /> {lang === 'en' ? 'Interactive' : 'इंटरैक्टिव'}
                      </div>
                    </div>

                    {/* Progress */}
                    {pct > 0 && (
                      <div style={{ marginBottom: 18 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{t('progress')}</span>
                          <span style={{ fontSize: '0.75rem', color: '#f97316', fontWeight: 600 }}>{pct}%</span>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )}

                    {/* Action button */}
                    <Link
                      href={m.route}
                      className="btn-primary"
                      style={{ width: '100%', justifyContent: 'center', padding: '11px 20px' }}
                    >
                      {done ? '🔁 ' + (lang === 'en' ? 'Retry' : 'पुनः प्रयास') : pct > 0 ? t('continue_training') : t('start_training')}
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Also show assessment link */}
        <div style={{
          marginTop: 48, padding: '28px 32px',
          background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(6,182,212,0.05))',
          border: '1px solid rgba(59,130,246,0.2)', borderRadius: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Star size={18} color="#f59e0b" />
              <span style={{ fontWeight: 700, color: '#f1f5f9', fontFamily: 'Space Grotesk, sans-serif' }}>
                {lang === 'en' ? 'Ready to Test Your Knowledge?' : 'अपना ज्ञान परखने के लिए तैयार हैं?'}
              </span>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
              {lang === 'en' ? 'Take a module assessment and earn your certificate.' : 'एक मॉड्यूल मूल्यांकन लें और अपना प्रमाणपत्र अर्जित करें।'}
            </p>
          </div>
          <Link href="/assessment" className="btn-secondary">
            {lang === 'en' ? 'Go to Assessment' : 'मूल्यांकन पर जाएं'} <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
