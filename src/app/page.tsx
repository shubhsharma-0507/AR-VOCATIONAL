'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useLang } from '@/context/LanguageContext';
import {
  Flame, Shield, Cpu, Wifi, Award, Users, ArrowRight,
  CheckCircle, Play, Zap, BookOpen, Target, TrendingUp, Star
} from 'lucide-react';

const HeroCanvas = dynamic(() => import('@/components/3d/HeroCanvas'), {
  ssr: false,
  loading: () => (
    <div style={{
      width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(15,22,41,0.5)', borderRadius: 20, border: '1px solid #1e2d4a',
    }}>
      <div style={{ textAlign: 'center', color: '#64748b' }}>
        <div style={{ fontSize: 40, marginBottom: 12, animation: 'spin 2s linear infinite', display: 'inline-block' }}>⚙️</div>
        <div style={{ fontSize: '0.9rem' }}>Loading 3D Scene...</div>
      </div>
    </div>
  ),
});

const FEATURES = [
  { icon: Cpu, title: 'Interactive 3D Simulations', titleHi: 'इंटरैक्टिव 3D सिमुलेशन', desc: 'Browser-based 3D environments with real-time physics and interaction for hands-on learning.', descHi: 'हाथों-हाथ सीखने के लिए वास्तविक समय भौतिकी और इंटरेक्शन के साथ ब्राउज़र-आधारित 3D वातावरण।', color: '#3b82f6' },
  { icon: Shield, title: 'Safe Practice Environment', titleHi: 'सुरक्षित अभ्यास वातावरण', desc: 'Practice hazardous scenarios without real-world risk. Mistakes teach — they never endanger.', descHi: 'वास्तविक जोखिम के बिना खतरनाक परिदृश्यों का अभ्यास करें। गलतियाँ सिखाती हैं — वे कभी खतरे में नहीं डालतीं।', color: '#10b981' },
  { icon: Flame, title: 'Multi-Scenario Training', titleHi: 'बहु-परिदृश्य प्रशिक्षण', desc: 'Fire safety, mining hazards, emergency evacuation, and industrial PPE — all in one platform.', descHi: 'अग्नि सुरक्षा, खनन खतरे, आपातकालीन निकासी, और औद्योगिक PPE — सब एक प्लेटफॉर्म पर।', color: '#f97316' },
  { icon: Wifi, title: 'Offline & Mobile Ready', titleHi: 'ऑफलाइन और मोबाइल तैयार', desc: 'Works on Android smartphones. No internet required once loaded. Perfect for remote sites.', descHi: 'Android स्मार्टफोन पर काम करता है। लोड होने के बाद कोई इंटरनेट आवश्यक नहीं। दूरस्थ साइटों के लिए परफेक्ट।', color: '#8b5cf6' },
  { icon: Award, title: 'Assessment & Certification', titleHi: 'मूल्यांकन और प्रमाणन', desc: 'Scored assessments with instant feedback. Earn certificates upon successful completion.', descHi: 'तत्काल फीडबैक के साथ स्कोर किए गए मूल्यांकन। सफल समापन पर प्रमाणपत्र अर्जित करें।', color: '#f59e0b' },
  { icon: Users, title: 'English & Hindi', titleHi: 'अंग्रेजी और हिन्दी', desc: 'Full bilingual support so every worker can learn in their preferred language.', descHi: 'पूर्ण द्विभाषी समर्थन ताकि हर कार्यकर्ता अपनी पसंदीदा भाषा में सीख सके।', color: '#06b6d4' },
];

const MODULES = [
  { id: 'fire-extinguisher', emoji: '🧯', title: 'Fire Extinguisher', titleHi: 'अग्निशामक यंत्र', category: 'Fire Safety', categoryHi: 'अग्नि सुरक्षा', diff: 'Beginner', color: '#ef4444', href: '/simulator/fire-extinguisher' },
  { id: 'mining-hazards', emoji: '⛏️', title: 'Mining Hazards', titleHi: 'खनन खतरे', category: 'Mining', categoryHi: 'खनन', diff: 'Intermediate', color: '#f59e0b', href: '/simulator/mining-hazards' },
  { id: 'emergency', emoji: '🚨', title: 'Emergency Evacuation', titleHi: 'आपातकालीन निकासी', category: 'Emergency', categoryHi: 'आपातकाल', diff: 'Beginner', color: '#3b82f6', href: '/training' },
  { id: 'industrial', emoji: '🏭', title: 'Industrial Safety', titleHi: 'औद्योगिक सुरक्षा', category: 'General Safety', categoryHi: 'सामान्य सुरक्षा', diff: 'Intermediate', color: '#8b5cf6', href: '/training' },
];

const HOW_IT_WORKS = [
  { step: 1, icon: BookOpen, title: 'Choose a Module', titleHi: 'एक मॉड्यूल चुनें', desc: 'Browse the training library and select your module based on your role.', descHi: 'प्रशिक्षण पुस्तकालय ब्राउज़ करें और अपनी भूमिका के आधार पर अपना मॉड्यूल चुनें।', color: '#3b82f6' },
  { step: 2, icon: Play, title: 'Enter the Simulation', titleHi: 'सिमुलेशन में प्रवेश करें', desc: 'Interact with the 3D environment. Follow step-by-step instructions.', descHi: '3D वातावरण के साथ इंटरैक्ट करें। चरण-दर-चरण निर्देशों का पालन करें।', color: '#f97316' },
  { step: 3, icon: Target, title: 'Get Instant Feedback', titleHi: 'तत्काल फीडबैक पाएं', desc: 'Every action gives immediate feedback with explanations. Learn from mistakes safely.', descHi: 'प्रत्येक कार्रवाई स्पष्टीकरण के साथ तत्काल फीडबैक देती है। सुरक्षित रूप से गलतियों से सीखें।', color: '#10b981' },
  { step: 4, icon: Award, title: 'Earn Your Certificate', titleHi: 'अपना प्रमाणपत्र अर्जित करें', desc: 'Pass the assessment and earn your digital completion certificate.', descHi: 'मूल्यांकन पास करें और अपना डिजिटल समापन प्रमाणपत्र अर्जित करें।', color: '#f59e0b' },
];

const IMPACT = [
  { value: '40%', label: 'Reduction in Training Costs', labelHi: 'प्रशिक्षण लागत में कमी', icon: TrendingUp, color: '#10b981' },
  { value: '3×', label: 'Faster Skill Acquisition', labelHi: 'तेज कौशल अधिग्रहण', icon: Zap, color: '#f97316' },
  { value: '95%', label: 'Trainee Satisfaction Rate', labelHi: 'प्रशिक्षु संतुष्टि दर', icon: Star, color: '#f59e0b' },
  { value: '100%', label: 'Zero Physical Risk', labelHi: 'शून्य शारीरिक जोखिम', icon: Shield, color: '#3b82f6' },
];

export default function HomePage() {
  const { lang, t } = useLang();

  return (
    <div>
      {/* HERO */}
      <section className="hero-grid" style={{ minHeight: 'calc(100vh - 64px)', position: 'relative', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        {/* Radial glow */}
        <div style={{
          position: 'absolute', top: '20%', left: '10%', width: 600, height: 600,
          background: 'radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: '30%', right: '5%', width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />

        <div className="container" style={{ width: '100%', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center', padding: '60px 0' }}>
            {/* Text */}
            <div className="animate-fade-in-up">
              <div style={{ marginBottom: 20 }}>
                <span className="badge badge-orange" style={{ fontSize: '0.7rem' }}>
                  🏆 {t('hero_badge')}
                </span>
              </div>

              <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: 20 }}>
                <span className="gradient-text-orange">{t('hero_headline')}</span>
                <br />
                <span style={{ color: '#f1f5f9' }}>{t('hero_headline2')}</span>
              </h1>

              <p style={{ fontSize: '1.1rem', color: '#94a3b8', lineHeight: 1.7, marginBottom: 32, maxWidth: 480 }}>
                {t('hero_subtext')}
              </p>

              {/* Key points */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 36 }}>
                {[
                  lang === 'en' ? '🧯 Interactive Fire Extinguisher Training' : '🧯 इंटरैक्टिव अग्निशामक प्रशिक्षण',
                  lang === 'en' ? '⛏️ Mining Hazard Identification' : '⛏️ खनन खतरा पहचान',
                  lang === 'en' ? '📊 Real-Time Progress & Assessment' : '📊 वास्तविक समय प्रगति और मूल्यांकन',
                ].map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <CheckCircle size={16} color="#10b981" />
                    <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{item}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <Link href="/training" className="btn-primary" style={{ fontSize: '1rem', padding: '14px 28px' }}>
                  <Flame size={18} /> {t('hero_cta_primary')}
                </Link>
                <Link href="/simulator/fire-extinguisher" className="btn-secondary" style={{ fontSize: '1rem', padding: '14px 28px' }}>
                  <Play size={16} /> {t('hero_cta_secondary')}
                </Link>
              </div>

              {/* Stats row */}
              <div style={{ display: 'flex', gap: 32, marginTop: 40 }}>
                {[
                  { val: '4+', label: lang === 'en' ? 'Modules' : 'मॉड्यूल' },
                  { val: '20+', label: lang === 'en' ? 'Questions' : 'प्रश्न' },
                  { val: '2', label: lang === 'en' ? 'Languages' : 'भाषाएं' },
                ].map(({ val, label }) => (
                  <div key={label}>
                    <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.8rem', fontWeight: 800, color: '#f97316' }}>{val}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3D Canvas */}
            <div style={{ height: 480, position: 'relative' }} className="animate-fade-in">
              {/* AR badge overlay */}
              <div style={{
                position: 'absolute', top: 16, right: 16, zIndex: 10,
                padding: '6px 12px', borderRadius: 20,
                background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)',
                color: '#22d3ee', fontSize: '0.75rem', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22d3ee', animation: 'pulse 1.5s infinite' }} />
                {lang === 'en' ? '3D Live Preview' : '3D लाइव प्रीव्यू'}
              </div>
              <HeroCanvas />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, color: '#475569', fontSize: '0.75rem' }}>
          <div style={{ animation: 'float 2s ease-in-out infinite', fontSize: 20 }}>↓</div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section" style={{ background: '#0f1629' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <span className="badge badge-blue" style={{ marginBottom: 16 }}>Platform Features</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 800, color: '#f1f5f9', marginBottom: 12 }}>
              {t('features_title')}
            </h2>
            <p style={{ color: '#64748b', maxWidth: 560, margin: '0 auto', fontSize: '1rem' }}>
              {lang === 'en'
                ? 'Built for industrial workers on Android smartphones. No headset required.'
                : 'Android स्मार्टफोन पर औद्योगिक श्रमिकों के लिए निर्मित। कोई हेडसेट आवश्यक नहीं।'}
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {FEATURES.map(({ icon: Icon, title, titleHi, desc, descHi, color }) => (
              <div key={title} className="card" style={{ padding: 28 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12, marginBottom: 18,
                  background: `${color}18`, border: `1px solid ${color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={22} color={color} />
                </div>
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.05rem', color: '#f1f5f9', marginBottom: 10 }}>
                  {lang === 'en' ? title : titleHi}
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.7 }}>
                  {lang === 'en' ? desc : descHi}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRAINING MODULES */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 48 }}>
            <div>
              <span className="badge badge-orange" style={{ marginBottom: 12 }}>Interactive Simulations</span>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 800, color: '#f1f5f9' }}>
                {t('modules_title')}
              </h2>
            </div>
            <Link href="/training" className="btn-ghost" style={{ color: '#f97316' }}>
              {t('view_all')} <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {MODULES.map(({ id, emoji, title, titleHi, category, categoryHi, diff, color, href }) => (
              <Link key={id} href={href} style={{ textDecoration: 'none' }}>
                <div className="card-accent" style={{ padding: 28, cursor: 'pointer', height: '100%' }}>
                  <div style={{ fontSize: 48, marginBottom: 18 }}>{emoji}</div>
                  <div style={{ marginBottom: 10 }}>
                    <span style={{
                      fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
                      color, background: `${color}18`, border: `1px solid ${color}30`,
                      padding: '3px 8px', borderRadius: 20,
                    }}>
                      {lang === 'en' ? category : categoryHi}
                    </span>
                  </div>
                  <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#f1f5f9', marginBottom: 8 }}>
                    {lang === 'en' ? title : titleHi}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{diff}</span>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 4,
                      color, fontSize: '0.8rem', fontWeight: 600,
                    }}>
                      {lang === 'en' ? 'Start' : 'शुरू करें'} <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section" style={{ background: '#0f1629' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <span className="badge badge-green" style={{ marginBottom: 16 }}>Simple Process</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 800, color: '#f1f5f9' }}>
              {t('how_it_works')}
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24, position: 'relative' }}>
            {HOW_IT_WORKS.map(({ step, icon: Icon, title, titleHi, desc, descHi, color }, idx) => (
              <div key={step} style={{ textAlign: 'center', padding: 28 }}>
                <div style={{ position: 'relative', marginBottom: 24, display: 'inline-block' }}>
                  <div style={{
                    width: 72, height: 72, borderRadius: '50%',
                    background: `${color}15`, border: `2px solid ${color}40`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto',
                  }}>
                    <Icon size={28} color={color} />
                  </div>
                  <div style={{
                    position: 'absolute', top: -4, right: -4, width: 24, height: 24,
                    borderRadius: '50%', background: color, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: 'white',
                  }}>
                    {step}
                  </div>
                </div>
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#f1f5f9', marginBottom: 10 }}>
                  {lang === 'en' ? title : titleHi}
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.7 }}>
                  {lang === 'en' ? desc : descHi}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IMPACT */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <span className="badge badge-amber" style={{ marginBottom: 16 }}>Proven Results</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 800, color: '#f1f5f9' }}>
              {t('impact_title')}
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            {IMPACT.map(({ value, label, labelHi, icon: Icon, color }) => (
              <div key={label} className="card" style={{ padding: 36, textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 900, fontFamily: 'Space Grotesk, sans-serif', color, marginBottom: 8, lineHeight: 1 }}>
                  {value}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#64748b', fontSize: '0.875rem' }}>
                  <Icon size={14} color={color} />
                  {lang === 'en' ? label : labelHi}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OFFLINE & ACCESSIBILITY */}
      <section className="section" style={{ background: '#0f1629' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
            <div>
              <span className="badge badge-purple" style={{ marginBottom: 16 }}>Accessibility First</span>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 800, color: '#f1f5f9', marginBottom: 16 }}>
                {lang === 'en' ? 'Built for Remote Industrial Sites' : 'दूरस्थ औद्योगिक साइटों के लिए निर्मित'}
              </h2>
              <p style={{ color: '#94a3b8', lineHeight: 1.8, marginBottom: 28 }}>
                {lang === 'en'
                  ? 'AR-VOCATIONAL works on basic Android smartphones without internet connectivity. Designed for mining sites, steel plants, and mica factories where connectivity may be limited.'
                  : 'AR-VOCATIONAL इंटरनेट कनेक्टिविटी के बिना बुनियादी Android स्मार्टफोन पर काम करता है। खनन साइटों, स्टील प्लांट और अभ्रक कारखानों के लिए डिज़ाइन किया गया है जहां कनेक्टिविटी सीमित हो सकती है।'}
              </p>
              {[
                lang === 'en' ? '📱 Works on Android 8+ smartphones' : '📱 Android 8+ स्मार्टफोन पर काम करता है',
                lang === 'en' ? '🌐 Hindi & English interface' : '🌐 हिंदी और अंग्रेजी इंटरफेस',
                lang === 'en' ? '🔋 Lightweight, fast performance' : '🔋 हल्का, तेज प्रदर्शन',
                lang === 'en' ? '📊 Progress saved locally' : '📊 प्रगति स्थानीय रूप से सहेजी गई',
              ].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>{item}</div>
                </div>
              ))}
              <Link href="/training" className="btn-primary" style={{ marginTop: 16 }}>
                {t('hero_cta_primary')} <ArrowRight size={16} />
              </Link>
            </div>
            <div style={{
              padding: 32, background: '#141c2e', borderRadius: 20, border: '1px solid #1e2d4a',
            }}>
              <div style={{ marginBottom: 24, color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>
                Device Compatibility
              </div>
              {[
                { device: 'Android Smartphone', icon: '📱', support: '100%', color: '#10b981' },
                { device: 'Desktop Browser', icon: '💻', support: '100%', color: '#10b981' },
                { device: 'iPad / Tablet', icon: '📊', support: '100%', color: '#10b981' },
                { device: 'AR Headset (WebXR)', icon: '🥽', support: 'Optional', color: '#f59e0b' },
              ].map(({ device, icon, support, color }) => (
                <div key={device} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #1e2d4a' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 20 }}>{icon}</span>
                    <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{device}</span>
                  </div>
                  <span style={{ color, fontSize: '0.85rem', fontWeight: 600 }}>{support}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="section">
        <div className="container">
          <div style={{
            textAlign: 'center', padding: '64px 40px',
            background: 'linear-gradient(135deg, rgba(249,115,22,0.1) 0%, rgba(59,130,246,0.08) 100%)',
            border: '1px solid rgba(249,115,22,0.2)', borderRadius: 24,
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: -80, right: -80, width: 300, height: 300,
              background: 'radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)',
              borderRadius: '50%', pointerEvents: 'none',
            }} />
            <span className="badge badge-orange" style={{ marginBottom: 20 }}>🚀 Start Now — Free</span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#f1f5f9', marginBottom: 16 }}>
              {lang === 'en' ? 'Ready to Train Safely?' : 'सुरक्षित प्रशिक्षण के लिए तैयार हैं?'}
            </h2>
            <p style={{ color: '#94a3b8', marginBottom: 32, fontSize: '1.05rem', maxWidth: 500, margin: '0 auto 32px' }}>
              {lang === 'en'
                ? 'Join the future of industrial safety training. No registration required to get started.'
                : 'औद्योगिक सुरक्षा प्रशिक्षण के भविष्य में शामिल हों। शुरू करने के लिए कोई पंजीकरण आवश्यक नहीं।'}
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/simulator/fire-extinguisher" className="btn-primary" style={{ fontSize: '1rem', padding: '14px 32px' }}>
                <Flame size={18} /> {lang === 'en' ? 'Fire Extinguisher Sim' : 'अग्निशामक सिम'}
              </Link>
              <Link href="/simulator/mining-hazards" className="btn-secondary" style={{ fontSize: '1rem', padding: '14px 32px' }}>
                ⛏️ {lang === 'en' ? 'Mining Hazards Sim' : 'खनन खतरे सिम'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @media (max-width: 768px) {
          section > div > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
