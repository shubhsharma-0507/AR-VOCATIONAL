'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle, Clock, TrendingUp, Award, BookOpen, Flame,
  RotateCcw, ChevronRight, BarChart3, Target, Star
} from 'lucide-react';
import { useLang } from '@/context/LanguageContext';
import { getDashboardStats, getModuleProgress } from '@/lib/storage';
import { TRAINING_MODULES } from '@/data/modules';

const MODULE_COLOR: Record<string, string> = {
  'fire-extinguisher': '#ef4444',
  'mining-hazards': '#f59e0b',
  'emergency-evacuation': '#3b82f6',
  'industrial-safety': '#8b5cf6',
};

export default function DashboardPage() {
  const { lang, t } = useLang();
  const [stats, setStats] = useState<ReturnType<typeof getDashboardStats> | null>(null);
  const [moduleProgress, setModuleProgress] = useState<Record<string, { pct: number; done: boolean; score: number | null }>>({});

  useEffect(() => {
    const s = getDashboardStats();
    setStats(s);
    const mp: Record<string, { pct: number; done: boolean; score: number | null }> = {};
    TRAINING_MODULES.forEach(m => {
      const p = getModuleProgress(m.id);
      const lastScore = p.assessmentScores.length > 0 ? p.assessmentScores[p.assessmentScores.length - 1] : null;
      mp[m.id] = { pct: p.completionPercentage, done: p.completed, score: lastScore };
    });
    setModuleProgress(mp);
  }, []);

  if (!stats) {
    return (
      <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#64748b' }}>{t('loading')}</div>
      </div>
    );
  }

  const PASS_THRESHOLD = 70;
  const overallPct = stats.overallProgress;
  const certEligible = stats.completedModules >= 2 && stats.averageScore >= PASS_THRESHOLD;

  const statCards = [
    { icon: CheckCircle, label: t('modules_completed'), value: `${stats.completedModules}/${stats.totalModules}`, color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)' },
    { icon: TrendingUp, label: t('in_progress'), value: stats.inProgressModules, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)' },
    { icon: Target, label: t('avg_score'), value: stats.averageScore > 0 ? `${stats.averageScore}%` : '—', color: '#f97316', bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.2)' },
    { icon: BarChart3, label: t('overall_progress'), value: `${overallPct}%`, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.2)' },
  ];

  // Find recommended module (first not completed or lowest progress)
  const recommended = TRAINING_MODULES.find(m => {
    const p = moduleProgress[m.id];
    return !p?.done;
  }) ?? TRAINING_MODULES[0];

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', background: '#0a0e1a' }}>
      {/* Header */}
      <div style={{ background: '#0f1629', borderBottom: '1px solid #1e2d4a', padding: '40px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <span className="badge badge-blue" style={{ marginBottom: 12 }}>Training Progress</span>
              <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 900, color: '#f1f5f9', marginBottom: 8 }}>
                {t('dashboard_title')}
              </h1>
              <p style={{ color: '#64748b' }}>{t('dashboard_subtitle')}</p>
            </div>
            {certEligible && (
              <div style={{
                padding: '16px 22px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 14,
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <Award size={28} color="#f59e0b" />
                <div>
                  <div style={{ color: '#fbbf24', fontWeight: 700, fontSize: '0.9rem' }}>{t('certificate_eligible')}</div>
                  <div style={{ color: '#64748b', fontSize: '0.78rem' }}>
                    {lang === 'en' ? 'You meet the requirements!' : 'आप आवश्यकताओं को पूरा करते हैं!'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '36px 20px' }}>
        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
          {statCards.map(({ icon: Icon, label, value, color, bg, border }) => (
            <div key={label} style={{ padding: '24px', background: bg, border: `1px solid ${border}`, borderRadius: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <Icon size={18} color={color} />
                <span style={{ color: '#64748b', fontSize: '0.8rem' }}>{label}</span>
              </div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2rem', fontWeight: 900, color }}>
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* Overall progress bar */}
        <div className="card" style={{ padding: 24, marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: '#f1f5f9', fontSize: '1rem' }}>
              {t('overall_progress')}
            </h2>
            <span style={{ fontWeight: 800, color: '#f97316', fontFamily: 'Space Grotesk, sans-serif' }}>{overallPct}%</span>
          </div>
          <div className="progress-bar" style={{ height: 10 }}>
            <div className="progress-fill" style={{ width: `${overallPct}%` }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, color: '#64748b', fontSize: '0.75rem' }}>
            <span>{lang === 'en' ? '0% — Beginner' : '0% — शुरुआती'}</span>
            <span>{lang === 'en' ? '100% — Certified' : '100% — प्रमाणित'}</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
          {/* Module progress list */}
          <div>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: '#f1f5f9', marginBottom: 16, fontSize: '1.05rem' }}>
              {t('modules_title')}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {TRAINING_MODULES.map(m => {
                const p = moduleProgress[m.id] ?? { pct: 0, done: false, score: null };
                const color = MODULE_COLOR[m.id] ?? '#64748b';
                return (
                  <div key={m.id} className="card" style={{ padding: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
                      <span style={{ fontSize: 26, flexShrink: 0 }}>{m.thumbnail}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '0.9rem' }}>
                            {lang === 'en' ? m.title : m.titleHi}
                          </span>
                          {p.done ? (
                            <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>✓ {t('completed')}</span>
                          ) : p.pct > 0 ? (
                            <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>{lang === 'en' ? 'In Progress' : 'जारी'}</span>
                          ) : (
                            <span className="badge" style={{ fontSize: '0.65rem', background: '#1e2d4a', color: '#64748b', border: '1px solid #1e2d4a' }}>{lang === 'en' ? 'Not Started' : 'शुरू नहीं'}</span>
                          )}
                        </div>
                        {p.score !== null && (
                          <div style={{ color: p.score >= 70 ? '#10b981' : '#f87171', fontSize: '0.78rem', marginTop: 4 }}>
                            {lang === 'en' ? 'Last Score:' : 'अंतिम स्कोर:'} {p.score}%
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${p.pct}%`, background: `linear-gradient(90deg, ${color}, ${color}80)` }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                      <span style={{ color: '#64748b', fontSize: '0.75rem' }}>{p.pct}%</span>
                      <Link href={m.route} style={{
                        display: 'flex', alignItems: 'center', gap: 4, color, fontSize: '0.78rem', fontWeight: 600, textDecoration: 'none',
                      }}>
                        {p.done ? (lang === 'en' ? 'Retry' : 'पुनः') : p.pct > 0 ? t('continue_training') : t('start_training')}
                        <ChevronRight size={12} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Recommended */}
            <div style={{
              padding: 24, background: 'rgba(249,115,22,0.07)', border: '1px solid rgba(249,115,22,0.18)', borderRadius: 16,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <Star size={16} color="#f97316" />
                <span style={{ color: '#f97316', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {t('recommended')}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: 32 }}>{recommended.thumbnail}</span>
                <div>
                  <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '0.95rem' }}>
                    {lang === 'en' ? recommended.title : recommended.titleHi}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '0.78rem', marginTop: 3 }}>
                    {recommended.difficulty} · {recommended.duration} {t('minutes')}
                  </div>
                </div>
              </div>
              <Link href={recommended.route} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '10px 16px', fontSize: '0.875rem' }}>
                <Flame size={14} /> {t('start_training')}
              </Link>
            </div>

            {/* Recent activity */}
            <div className="card" style={{ padding: 22 }}>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: '#f1f5f9', marginBottom: 16, fontSize: '0.95rem' }}>
                {t('recent_activity')}
              </h3>
              {stats.recentActivity.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px 0', color: '#475569' }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>📋</div>
                  <p style={{ fontSize: '0.875rem' }}>{t('no_activity')}</p>
                  <Link href="/training" className="btn-primary" style={{ marginTop: 14, fontSize: '0.85rem', padding: '9px 18px', display: 'inline-flex' }}>
                    {t('start_training')}
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {stats.recentActivity.slice(0, 5).map(activity => {
                    const module = TRAINING_MODULES.find(m => m.id === activity.moduleId);
                    const timeAgo = formatTimeAgo(activity.timestamp);
                    return (
                      <div key={activity.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #1e2d4a' }}>
                        <span style={{ fontSize: 20 }}>{module?.thumbnail ?? '📋'}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ color: '#94a3b8', fontSize: '0.82rem', fontWeight: 500 }}>
                            {activity.type === 'simulation' && (lang === 'en' ? 'Simulation' : 'सिमुलेशन')}
                            {activity.type === 'assessment' && (lang === 'en' ? 'Assessment' : 'मूल्यांकन')}
                            {activity.type === 'module_start' && (lang === 'en' ? 'Started' : 'शुरू')}
                            {' · '}{lang === 'en' ? module?.title : module?.titleHi ?? activity.moduleId}
                          </div>
                          <div style={{ color: '#475569', fontSize: '0.73rem', marginTop: 2 }}>{timeAgo}</div>
                        </div>
                        {activity.score !== undefined && (
                          <span style={{ color: activity.score >= 70 ? '#10b981' : '#f87171', fontWeight: 700, fontSize: '0.82rem' }}>
                            {activity.score}%
                          </span>
                        )}
                        {activity.completed && activity.type !== 'assessment' && (
                          <CheckCircle size={14} color="#10b981" />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick actions */}
            <div className="card" style={{ padding: 22 }}>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: '#f1f5f9', marginBottom: 16, fontSize: '0.95rem' }}>
                {lang === 'en' ? 'Quick Actions' : 'त्वरित कार्रवाई'}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { href: '/simulator/fire-extinguisher', icon: '🧯', label: lang === 'en' ? 'Fire Extinguisher Sim' : 'अग्निशामक सिम' },
                  { href: '/simulator/mining-hazards', icon: '⛏️', label: lang === 'en' ? 'Mining Hazards Sim' : 'खनन खतरे सिम' },
                  { href: '/assessment', icon: '📝', label: lang === 'en' ? 'Take Assessment' : 'मूल्यांकन लें' },
                ].map(({ href, icon, label }) => (
                  <Link key={href} href={href} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 10,
                    background: '#141c2e', border: '1px solid #1e2d4a', textDecoration: 'none',
                    color: '#94a3b8', fontSize: '0.875rem', transition: 'all 0.2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#2a3f6b'; e.currentTarget.style.color = '#f1f5f9'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e2d4a'; e.currentTarget.style.color = '#94a3b8'; }}
                  >
                    <span style={{ fontSize: 18 }}>{icon}</span>
                    {label}
                    <ChevronRight size={14} style={{ marginLeft: 'auto' }} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .container > div:last-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function formatTimeAgo(ts: number): string {
  const seconds = Math.floor((Date.now() - ts) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
