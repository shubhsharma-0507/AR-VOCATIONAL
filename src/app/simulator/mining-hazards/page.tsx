'use client';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, RotateCcw, AlertTriangle, CheckCircle, XCircle, Target } from 'lucide-react';
import { useLang } from '@/context/LanguageContext';
import { markSimulationComplete } from '@/lib/storage';

const MiningScene3D = dynamic(() => import('@/components/simulator/MiningScene3D'), {
  ssr: false,
  loading: () => (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f1629', borderRadius: 16 }}>
      <div style={{ textAlign: 'center', color: '#64748b' }}>
        <div style={{ fontSize: 36, marginBottom: 10 }}>⛏️</div>
        <div>Loading mining environment...</div>
      </div>
    </div>
  ),
});

export interface HazardDef {
  id: string;
  emoji: string;
  label: string;
  labelHi: string;
  description: string;
  descriptionHi: string;
  isHazard: boolean;
  position: [number, number, number];
  color: string;
}

export const HAZARDS: HazardDef[] = [
  {
    id: 'falling_rock',
    emoji: '🪨',
    label: 'Unstable Rock Face',
    labelHi: 'अस्थिर चट्टान',
    description: 'Unsupported rock face with visible cracks — risk of collapse.',
    descriptionHi: 'दिखाई देने वाली दरारों के साथ असमर्थित चट्टान — ढहने का खतरा।',
    isHazard: true,
    position: [-2.5, 0.5, -1],
    color: '#ef4444',
  },
  {
    id: 'missing_ppe',
    emoji: '⛑️',
    label: 'Worker Without PPE',
    labelHi: 'PPE के बिना श्रमिक',
    description: 'Worker not wearing a hard hat or safety boots in a mandatory zone.',
    descriptionHi: 'अनिवार्य क्षेत्र में हार्ड हैट या सुरक्षा जूते नहीं पहने हुए श्रमिक।',
    isHazard: true,
    position: [2.5, 0.2, 0],
    color: '#f97316',
  },
  {
    id: 'electrical_hazard',
    emoji: '⚡',
    label: 'Exposed Wiring',
    labelHi: 'खुली बिजली की तार',
    description: 'Unsafe electrical wiring exposed in a wet underground environment.',
    descriptionHi: 'गीले भूमिगत वातावरण में असुरक्षित बिजली की तार उजागर।',
    isHazard: true,
    position: [1.5, 0, 1.5],
    color: '#f59e0b',
  },
  {
    id: 'blocked_exit',
    emoji: '🚧',
    label: 'Blocked Evacuation Route',
    labelHi: 'अवरुद्ध निकासी मार्ग',
    description: 'Emergency exit blocked by equipment — violates safety regulations.',
    descriptionHi: 'उपकरण द्वारा अवरुद्ध आपातकालीन निकास — सुरक्षा नियमों का उल्लंघन।',
    isHazard: true,
    position: [-2.5, 0.2, 1.5],
    color: '#8b5cf6',
  },
  {
    id: 'unsafe_zone',
    emoji: '⚠️',
    label: 'Unmarked Hazard Zone',
    labelHi: 'अचिह्नित खतरा क्षेत्र',
    description: 'Blast zone with no warning signs or barriers.',
    descriptionHi: 'कोई चेतावनी संकेत या बाधाओं के बिना विस्फोट क्षेत्र।',
    isHazard: true,
    position: [0, 0.2, -2],
    color: '#ef4444',
  },
  {
    id: 'safe_equipment',
    emoji: '🦺',
    label: 'Safety Equipment Station',
    labelHi: 'सुरक्षा उपकरण स्टेशन',
    description: 'Properly maintained PPE station — not a hazard.',
    descriptionHi: 'ठीक से रखरखाव किया गया PPE स्टेशन — खतरा नहीं।',
    isHazard: false,
    position: [0, 0.2, 1.5],
    color: '#10b981',
  },
  {
    id: 'safe_sign',
    emoji: '✅',
    label: 'Safety Signage',
    labelHi: 'सुरक्षा संकेत',
    description: 'Properly posted safety signs and instructions — not a hazard.',
    descriptionHi: 'ठीक से पोस्ट किए गए सुरक्षा संकेत और निर्देश — खतरा नहीं।',
    isHazard: false,
    position: [2.5, 0.5, -1.5],
    color: '#10b981',
  },
];

export default function MiningHazardsPage() {
  const { lang, t } = useLang();
  const [identified, setIdentified] = useState<Set<string>>(new Set());
  const [wrongClicks, setWrongClicks] = useState<Set<string>>(new Set());
  const [lastFeedback, setLastFeedback] = useState<{ id: string; correct: boolean; msg: string } | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [startTime] = useState(Date.now());
  const [mistakes, setMistakes] = useState(0);

  const hazards = HAZARDS.filter(h => h.isHazard);
  const totalHazards = hazards.length;
  const score = Math.round((identified.size / totalHazards) * 100);

  const handleHazardClick = (hazard: HazardDef) => {
    if (identified.has(hazard.id) || wrongClicks.has(hazard.id) || isComplete) return;

    if (hazard.isHazard) {
      setIdentified(prev => {
        const next = new Set([...prev, hazard.id]);
        if (next.size === totalHazards) {
          setTimeout(() => setIsComplete(true), 800);
          markSimulationComplete('mining-hazards', {
            id: `sim_${Date.now()}`,
            moduleId: 'mining-hazards',
            timestamp: Date.now(),
            stepsCompleted: totalHazards,
            totalSteps: totalHazards,
            completed: true,
            timeSpent: Math.round((Date.now() - startTime) / 1000),
            mistakes,
          });
        }
        return next;
      });
      setLastFeedback({ id: hazard.id, correct: true, msg: `✓ ${lang === 'en' ? hazard.label : hazard.labelHi}: ${lang === 'en' ? hazard.description : hazard.descriptionHi}` });
    } else {
      setMistakes(m => m + 1);
      setWrongClicks(prev => new Set([...prev, hazard.id]));
      setLastFeedback({ id: hazard.id, correct: false, msg: `✗ ${lang === 'en' ? hazard.label : hazard.labelHi}: ${lang === 'en' ? hazard.description : hazard.descriptionHi}` });
    }
    setTimeout(() => setLastFeedback(null), 3000);
  };

  const handleRestart = () => {
    setIdentified(new Set());
    setWrongClicks(new Set());
    setLastFeedback(null);
    setIsComplete(false);
    setMistakes(0);
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', background: '#0a0e1a' }}>
      {/* Header */}
      <div style={{ background: '#0f1629', borderBottom: '1px solid #1e2d4a', padding: '20px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/training" className="btn-ghost" style={{ padding: '6px 10px' }}>
              <ChevronLeft size={18} /> {t('back')}
            </Link>
            <div style={{ width: 1, height: 20, background: '#1e2d4a' }} />
            <span style={{ fontSize: 22 }}>⛏️</span>
            <div>
              <h1 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f1f5f9', fontFamily: 'Space Grotesk, sans-serif', lineHeight: 1 }}>
                {lang === 'en' ? 'Mining Hazard Identification' : 'खनन खतरा पहचान'}
              </h1>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>
                {lang === 'en' ? 'Click all hazards in the scene' : 'दृश्य में सभी खतरों पर क्लिक करें'}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Target size={14} color="#f59e0b" />
              <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: '0.9rem' }}>
                {identified.size}/{totalHazards} {lang === 'en' ? 'Found' : 'मिले'}
              </span>
            </div>
            <button onClick={handleRestart} className="btn-ghost" style={{ fontSize: '0.8rem' }}>
              <RotateCcw size={14} /> {t('sim_restart')}
            </button>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{ background: 'rgba(245,158,11,0.07)', borderBottom: '1px solid rgba(245,158,11,0.15)', padding: '10px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertTriangle size={14} color="#f59e0b" />
          <p style={{ color: '#94a3b8', fontSize: '0.78rem' }}>{t('sim_disclaimer')}</p>
        </div>
      </div>

      <div className="container" style={{ padding: '28px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, alignItems: 'start' }}>
          {/* 3D Scene */}
          <div style={{ position: 'relative', height: 520, borderRadius: 16, overflow: 'hidden', border: '1px solid #1e2d4a', background: '#0f1629' }}>
            {isComplete ? (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
                <div style={{ fontSize: 60 }}>🏆</div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.8rem', fontWeight: 800, color: '#10b981' }}>
                  {lang === 'en' ? 'All Hazards Found!' : 'सभी खतरे मिल गए!'}
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#f97316', fontFamily: 'Space Grotesk, sans-serif' }}>
                  Score: {score}%
                </div>
              </div>
            ) : (
              <MiningScene3D
                hazards={HAZARDS}
                identified={identified}
                wrongClicks={wrongClicks}
                onHazardClick={handleHazardClick}
              />
            )}

            {/* Feedback toast */}
            {lastFeedback && (
              <div style={{
                position: 'absolute', bottom: 16, left: 16, right: 16,
                padding: '12px 16px', borderRadius: 12,
                background: lastFeedback.correct ? 'rgba(16,185,129,0.92)' : 'rgba(239,68,68,0.92)',
                color: 'white', fontSize: '0.85rem', fontWeight: 500,
                display: 'flex', alignItems: 'flex-start', gap: 8,
                animation: 'fadeIn 0.2s ease',
              }}>
                {lastFeedback.correct ? <CheckCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} /> : <XCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />}
                <span>{lastFeedback.msg}</span>
              </div>
            )}
          </div>

          {/* Side panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Score bar */}
            <div className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ color: '#64748b', fontSize: '0.85rem' }}>{lang === 'en' ? 'Hazards Found' : 'मिले खतरे'}</span>
                <span style={{ fontWeight: 700, color: '#f97316', fontSize: '0.9rem' }}>{identified.size} / {totalHazards}</span>
              </div>
              <div className="progress-bar" style={{ marginBottom: 10 }}>
                <div className="progress-fill" style={{ width: `${(identified.size / totalHazards) * 100}%` }} />
              </div>
              {mistakes > 0 && (
                <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                  ⚠️ {mistakes} {lang === 'en' ? 'wrong selection(s)' : 'गलत चुनाव'}
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="card" style={{ padding: 20 }}>
              <div style={{ fontWeight: 700, color: '#f1f5f9', marginBottom: 12, fontSize: '0.9rem', fontFamily: 'Space Grotesk, sans-serif' }}>
                {lang === 'en' ? '📋 Instructions' : '📋 निर्देश'}
              </div>
              <p style={{ color: '#64748b', fontSize: '0.8rem', lineHeight: 1.7, marginBottom: 12 }}>
                {lang === 'en'
                  ? 'Click on objects in the 3D scene that represent safety hazards. Not all objects are hazards — some are safe!'
                  : '3D दृश्य में उन वस्तुओं पर क्लिक करें जो सुरक्षा खतरों का प्रतिनिधित्व करती हैं। सभी वस्तुएं खतरे नहीं हैं — कुछ सुरक्षित हैं!'}
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: '#10b981' }}>
                  <CheckCircle size={12} /> {lang === 'en' ? 'Hazard = correct' : 'खतरा = सही'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: '#ef4444' }}>
                  <XCircle size={12} /> {lang === 'en' ? 'Safe = incorrect' : 'सुरक्षित = गलत'}
                </div>
              </div>
            </div>

            {/* Hazard checklist */}
            <div className="card" style={{ padding: 20 }}>
              <div style={{ fontWeight: 700, color: '#f1f5f9', marginBottom: 14, fontSize: '0.9rem', fontFamily: 'Space Grotesk, sans-serif' }}>
                {lang === 'en' ? 'Hazard Checklist' : 'खतरा चेकलिस्ट'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {hazards.map(h => {
                  const found = identified.has(h.id);
                  return (
                    <div
                      key={h.id}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '10px 12px', borderRadius: 10,
                        background: found ? 'rgba(16,185,129,0.08)' : 'rgba(26,35,64,0.5)',
                        border: `1px solid ${found ? 'rgba(16,185,129,0.2)' : '#1e2d4a'}`,
                        transition: 'all 0.3s',
                      }}
                    >
                      <span style={{ fontSize: 20 }}>{h.emoji}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.82rem', color: found ? '#10b981' : '#94a3b8' }}>
                          {lang === 'en' ? h.label : h.labelHi}
                        </div>
                        {found && (
                          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 2 }}>
                            {lang === 'en' ? h.description : h.descriptionHi}
                          </div>
                        )}
                      </div>
                      {found ? <CheckCircle size={16} color="#10b981" /> : (
                        <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid #1e2d4a' }} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Completion */}
            {isComplete && (
              <div style={{ padding: 20, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 16 }}>
                <div style={{ fontWeight: 700, color: '#10b981', marginBottom: 14, fontFamily: 'Space Grotesk, sans-serif' }}>
                  🎉 {lang === 'en' ? 'Complete!' : 'पूर्ण!'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <Link href="/assessment" className="btn-primary" style={{ justifyContent: 'center' }}>
                    📝 {lang === 'en' ? 'Take Assessment' : 'मूल्यांकन लें'}
                  </Link>
                  <button onClick={handleRestart} className="btn-secondary" style={{ justifyContent: 'center' }}>
                    <RotateCcw size={14} /> {t('sim_restart')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .container > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
