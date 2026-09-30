'use client';
import dynamic from 'next/dynamic';
import { useState, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, RotateCcw, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import { useLang } from '@/context/LanguageContext';
import { markSimulationComplete } from '@/lib/storage';

const FireSim3D = dynamic(() => import('@/components/simulator/FireSim3D'), { ssr: false,
  loading: () => (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f1629', borderRadius: 16 }}>
      <div style={{ textAlign: 'center', color: '#64748b' }}>
        <div style={{ fontSize: 36, marginBottom: 10 }}>🔥</div>
        <div>Loading simulation...</div>
      </div>
    </div>
  ),
});

export const STEPS = [
  {
    id: 1,
    title: 'Locate the Extinguisher',
    titleHi: 'अग्निशामक यंत्र का पता लगाएं',
    instruction: 'Find and click the fire extinguisher (red cylinder) to pick it up.',
    instructionHi: 'अग्निशामक यंत्र (लाल सिलेंडर) को ढूंढें और उठाने के लिए क्लिक करें।',
    hint: 'The red extinguisher is on the right side of the scene.',
    hintHi: 'लाल अग्निशामक दृश्य के दाहिनी ओर है।',
    action: 'click_extinguisher',
  },
  {
    id: 2,
    title: 'Pull the Safety Pin',
    titleHi: 'सुरक्षा पिन खींचें',
    instruction: 'Click the safety pin to remove it. This unlocks the handle.',
    instructionHi: 'सुरक्षा पिन को हटाने के लिए क्लिक करें। यह हैंडल को अनलॉक करता है।',
    hint: 'The pin is shown highlighted in yellow. Pull = P in PASS.',
    hintHi: 'पिन पीले रंग में हाइलाइट दिखाई देता है। Pull = PASS में P।',
    action: 'click_pin',
  },
  {
    id: 3,
    title: 'Aim at the Base',
    titleHi: 'आधार पर लक्ष्य करें',
    instruction: 'Click at the BASE of the fire (bottom of the flames), not at the top.',
    instructionHi: 'आग के आधार (लपटों के नीचे) पर क्लिक करें, ऊपर नहीं।',
    hint: 'Aim = A in PASS. Target the glowing base circle.',
    hintHi: 'Aim = PASS में A। चमकते हुए आधार वृत्त को लक्ष्य करें।',
    action: 'click_fire_base',
  },
  {
    id: 4,
    title: 'Squeeze the Handle',
    titleHi: 'हैंडल दबाएं',
    instruction: 'Click the handle button to squeeze and release the extinguishing agent.',
    instructionHi: 'दबाने के लिए हैंडल बटन पर क्लिक करें और बुझाने वाला एजेंट छोड़ें।',
    hint: 'Squeeze = S in PASS. Hold steadily.',
    hintHi: 'Squeeze = PASS में S। स्थिरता से पकड़ें।',
    action: 'click_handle',
  },
  {
    id: 5,
    title: 'Sweep Side to Side',
    titleHi: 'एक तरफ से दूसरी तरफ झाड़ें',
    instruction: 'Click and drag left-to-right to sweep across the fire area until it is extinguished.',
    instructionHi: 'आग के क्षेत्र में झाड़ने के लिए बाएं से दाएं क्लिक और खींचें जब तक वह बुझ न जाए।',
    hint: 'Sweep = S in PASS. Move slowly left to right.',
    hintHi: 'Sweep = PASS में S। धीरे-धीरे बाएं से दाएं जाएं।',
    action: 'sweep',
  },
];

export default function FireExtinguisherPage() {
  const { lang, t } = useLang();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | null; msg: string }>({ type: null, msg: '' });
  const [mistakes, setMistakes] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [startTime] = useState(Date.now());
  const [showHint, setShowHint] = useState(false);

  const handleStepAction = useCallback((action: string, correct: boolean) => {
    if (correct) {
      const step = STEPS[currentStep];
      setCompletedSteps(prev => new Set([...prev, step.id]));
      setFeedback({ type: 'success', msg: t('sim_feedback_correct') });
      setShowHint(false);
      setTimeout(() => {
        setFeedback({ type: null, msg: '' });
        if (currentStep + 1 >= STEPS.length) {
          setIsComplete(true);
          markSimulationComplete('fire-extinguisher', {
            id: `sim_${Date.now()}`,
            moduleId: 'fire-extinguisher',
            timestamp: Date.now(),
            stepsCompleted: STEPS.length,
            totalSteps: STEPS.length,
            completed: true,
            timeSpent: Math.round((Date.now() - startTime) / 1000),
            mistakes,
          });
        } else {
          setCurrentStep(prev => prev + 1);
        }
      }, 1200);
    } else {
      setMistakes(m => m + 1);
      setFeedback({ type: 'error', msg: t('sim_feedback_incorrect') });
      setTimeout(() => setFeedback({ type: null, msg: '' }), 1500);
    }
  }, [currentStep, mistakes, startTime, t]);

  const handleRestart = () => {
    setCurrentStep(0);
    setCompletedSteps(new Set());
    setFeedback({ type: null, msg: '' });
    setMistakes(0);
    setIsComplete(false);
    setShowHint(false);
  };

  const step = STEPS[currentStep];

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
            <span style={{ fontSize: 22 }}>🧯</span>
            <div>
              <h1 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f1f5f9', fontFamily: 'Space Grotesk, sans-serif', lineHeight: 1 }}>
                {lang === 'en' ? 'Fire Extinguisher Simulation' : 'अग्निशामक यंत्र सिमुलेशन'}
              </h1>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>
                {lang === 'en' ? 'Interactive Training · PASS Technique' : 'इंटरैक्टिव प्रशिक्षण · PASS तकनीक'}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="badge badge-red" style={{ fontSize: '0.7rem' }}>Fire Safety</span>
            <button onClick={handleRestart} className="btn-ghost" style={{ fontSize: '0.8rem' }}>
              <RotateCcw size={14} /> {t('sim_restart')}
            </button>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{ background: 'rgba(249,115,22,0.07)', borderBottom: '1px solid rgba(249,115,22,0.15)', padding: '10px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertTriangle size={14} color="#f97316" />
          <p style={{ color: '#94a3b8', fontSize: '0.78rem' }}>{t('sim_disclaimer')}</p>
        </div>
      </div>

      <div className="container" style={{ padding: '28px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24, alignItems: 'start' }}>
          {/* 3D Canvas */}
          <div style={{ height: 520, borderRadius: 16, overflow: 'hidden', border: '1px solid #1e2d4a', position: 'relative', background: '#0f1629' }}>
            {!isComplete ? (
              <FireSim3D
                currentStep={currentStep}
                onAction={handleStepAction}
              />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
                <div style={{ fontSize: 60 }}>✅</div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.8rem', fontWeight: 800, color: '#10b981' }}>
                  {lang === 'en' ? 'Fire Extinguished!' : 'आग बुझा दी!'}
                </div>
                <div style={{ color: '#64748b', fontSize: '0.9rem' }}>
                  {lang === 'en' ? `Completed in ${STEPS.length} steps with ${mistakes} mistakes.` : `${STEPS.length} चरणों में ${mistakes} गलतियों के साथ पूर्ण।`}
                </div>
              </div>
            )}

            {/* Feedback overlay */}
            {feedback.type && (
              <div style={{
                position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
                padding: '10px 20px', borderRadius: 24,
                background: feedback.type === 'success' ? 'rgba(16,185,129,0.9)' : 'rgba(239,68,68,0.9)',
                color: 'white', fontWeight: 700, fontSize: '0.9rem',
                display: 'flex', alignItems: 'center', gap: 8,
                animation: 'fadeIn 0.2s ease',
              }}>
                {feedback.type === 'success' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                {feedback.msg}
              </div>
            )}
          </div>

          {/* Side panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Step tracker */}
            <div className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {t('sim_step')} {isComplete ? STEPS.length : currentStep + 1} {t('sim_of')} {STEPS.length}
                </div>
              </div>
              {/* Step pills */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                {STEPS.map((s, idx) => (
                  <div
                    key={s.id}
                    className={completedSteps.has(s.id) ? 'step-indicator step-done' : idx === currentStep && !isComplete ? 'step-indicator step-active' : 'step-indicator step-pending'}
                  >
                    {completedSteps.has(s.id) ? '✓' : idx + 1}
                  </div>
                ))}
              </div>
              {/* Progress bar */}
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${(completedSteps.size / STEPS.length) * 100}%` }} />
              </div>
            </div>

            {/* Current instruction */}
            {!isComplete && step && (
              <div className="card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#f97316' }}>
                    {lang === 'en' ? step.title : step.titleHi}
                  </h3>
                  <button
                    onClick={() => setShowHint(!showHint)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 4 }}
                    title="Show hint"
                  >
                    <Info size={16} />
                  </button>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 14 }}>
                  {lang === 'en' ? step.instruction : step.instructionHi}
                </p>
                {showHint && step.hint && (
                  <div style={{ padding: '10px 14px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 8, fontSize: '0.8rem', color: '#fbbf24' }}>
                    💡 {lang === 'en' ? step.hint : step.hintHi}
                  </div>
                )}
              </div>
            )}

            {/* Completion card */}
            {isComplete && (
              <div style={{ padding: 24, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 16 }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#10b981', marginBottom: 12, fontFamily: 'Space Grotesk, sans-serif' }}>
                  🎉 {lang === 'en' ? 'Simulation Complete!' : 'सिमुलेशन पूर्ण!'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: '#64748b' }}>{lang === 'en' ? 'Steps Completed' : 'पूर्ण चरण'}</span>
                    <span style={{ color: '#10b981', fontWeight: 600 }}>{STEPS.length}/{STEPS.length}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: '#64748b' }}>{lang === 'en' ? 'Mistakes' : 'गलतियाँ'}</span>
                    <span style={{ color: mistakes === 0 ? '#10b981' : '#f59e0b', fontWeight: 600 }}>{mistakes}</span>
                  </div>
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

            {/* PASS reminder */}
            <div className="card" style={{ padding: 20 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
                PASS Technique
              </div>
              {[
                { letter: 'P', word: 'Pull', wordHi: 'खींचें', desc: 'the safety pin', descHi: 'सुरक्षा पिन' },
                { letter: 'A', word: 'Aim', wordHi: 'लक्ष्य करें', desc: 'at the base of fire', descHi: 'आग के आधार पर' },
                { letter: 'S', word: 'Squeeze', wordHi: 'दबाएं', desc: 'the handle', descHi: 'हैंडल' },
                { letter: 'S', word: 'Sweep', wordHi: 'झाड़ें', desc: 'side to side', descHi: 'एक तरफ से दूसरी तरफ' },
              ].map(({ letter, word, wordHi, desc, descHi }, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0',
                    borderBottom: idx < 3 ? '1px solid #1e2d4a' : 'none',
                    opacity: completedSteps.has(idx + 1) ? 1 : 0.6,
                  }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: completedSteps.has(idx + 1) ? 'rgba(16,185,129,0.2)' : 'rgba(249,115,22,0.1)',
                    border: `1px solid ${completedSteps.has(idx + 1) ? 'rgba(16,185,129,0.4)' : 'rgba(249,115,22,0.2)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 900, fontSize: '1rem', color: completedSteps.has(idx + 1) ? '#10b981' : '#f97316',
                    flexShrink: 0,
                  }}>
                    {letter}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '0.875rem' }}>
                      {lang === 'en' ? word : wordHi}
                    </div>
                    <div style={{ color: '#64748b', fontSize: '0.75rem' }}>
                      {lang === 'en' ? desc : descHi}
                    </div>
                  </div>
                  {completedSteps.has(idx + 1) && <CheckCircle size={16} color="#10b981" style={{ marginLeft: 'auto' }} />}
                </div>
              ))}
            </div>

            {/* Mistake counter */}
            {mistakes > 0 && (
              <div style={{ padding: '12px 16px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertTriangle size={14} color="#f59e0b" />
                <span style={{ color: '#fbbf24', fontSize: '0.8rem' }}>
                  {mistakes} {lang === 'en' ? 'mistake(s). Use the hint button!' : 'गलती(याँ)। हिंट बटन उपयोग करें!'}
                </span>
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
