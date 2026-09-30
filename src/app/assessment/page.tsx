'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, CheckCircle, XCircle, RefreshCw, Award, BookOpen } from 'lucide-react';
import { useLang } from '@/context/LanguageContext';
import { ASSESSMENT_QUESTIONS, TRAINING_MODULES } from '@/data/modules';
import { saveAssessmentAttempt } from '@/lib/storage';
import type { AssessmentQuestion } from '@/types';

const PASS_THRESHOLD = 70;

interface QuizState {
  questions: AssessmentQuestion[];
  answers: (number | null)[];
  submitted: boolean[];
  currentIndex: number;
  finished: boolean;
}

type Phase = 'select' | 'quiz' | 'results';

export default function AssessmentPage() {
  const { lang, t } = useLang();
  const [phase, setPhase] = useState<Phase>('select');
  const [selectedModuleId, setSelectedModuleId] = useState<string>('fire-extinguisher');
  const [quiz, setQuiz] = useState<QuizState | null>(null);

  const startQuiz = (moduleId: string) => {
    const questions = ASSESSMENT_QUESTIONS.filter(q => q.moduleId === moduleId);
    setQuiz({
      questions,
      answers: Array(questions.length).fill(null),
      submitted: Array(questions.length).fill(false),
      currentIndex: 0,
      finished: false,
    });
    setPhase('quiz');
  };

  const selectAnswer = (qIdx: number, optIdx: number) => {
    if (!quiz || quiz.submitted[qIdx]) return;
    setQuiz(prev => {
      if (!prev) return prev;
      const answers = [...prev.answers];
      answers[qIdx] = optIdx;
      return { ...prev, answers };
    });
  };

  const submitAnswer = () => {
    if (!quiz) return;
    const qIdx = quiz.currentIndex;
    setQuiz(prev => {
      if (!prev) return prev;
      const submitted = [...prev.submitted];
      submitted[qIdx] = true;
      return { ...prev, submitted };
    });
  };

  const nextQuestion = () => {
    if (!quiz) return;
    if (quiz.currentIndex + 1 >= quiz.questions.length) {
      // Finish
      const score = calculateScore(quiz);
      const passed = score >= PASS_THRESHOLD;
      const attempt = {
        id: `assess_${Date.now()}`,
        moduleId: selectedModuleId,
        timestamp: Date.now(),
        answers: quiz.answers.map(a => a ?? -1),
        score,
        passed,
        timeSpent: 0,
      };
      saveAssessmentAttempt(selectedModuleId, attempt);
      setQuiz(prev => prev ? { ...prev, finished: true } : prev);
      setPhase('results');
    } else {
      setQuiz(prev => prev ? { ...prev, currentIndex: prev.currentIndex + 1 } : prev);
    }
  };

  const calculateScore = (q: QuizState): number => {
    const correct = q.questions.filter((question, i) => q.answers[i] === question.correctIndex).length;
    return Math.round((correct / q.questions.length) * 100);
  };

  const restart = () => {
    setQuiz(null);
    setPhase('select');
  };

  if (phase === 'select') {
    return (
      <div style={{ minHeight: 'calc(100vh - 64px)', background: '#0a0e1a' }}>
        <div style={{ background: '#0f1629', borderBottom: '1px solid #1e2d4a', padding: '48px 0 40px' }}>
          <div className="container">
            <span className="badge badge-amber" style={{ marginBottom: 14 }}>Knowledge Test</span>
            <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 900, color: '#f1f5f9', marginBottom: 10 }}>
              {t('assessment_title')}
            </h1>
            <p style={{ color: '#64748b', fontSize: '1rem' }}>{t('assessment_subtitle')}</p>
          </div>
        </div>

        <div className="container" style={{ padding: '48px 20px' }}>
          <div style={{ maxWidth: 680, margin: '0 auto' }}>
            {/* Pass threshold notice */}
            <div style={{ padding: '14px 18px', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 12, marginBottom: 32, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Award size={18} color="#60a5fa" />
              <div>
                <span style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '0.9rem' }}>
                  {lang === 'en' ? 'Passing Score: 70%' : 'उत्तीर्णांक: 70%'}
                </span>
                <span style={{ color: '#64748b', fontSize: '0.8rem', marginLeft: 12 }}>
                  {lang === 'en' ? '· 5 questions per module' : '· प्रति मॉड्यूल 5 प्रश्न'}
                </span>
              </div>
            </div>

            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: '#f1f5f9', marginBottom: 20 }}>
              {lang === 'en' ? 'Select a Module' : 'एक मॉड्यूल चुनें'}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 32 }}>
              {TRAINING_MODULES.map(m => (
                <div
                  key={m.id}
                  onClick={() => setSelectedModuleId(m.id)}
                  style={{
                    padding: '18px 22px', borderRadius: 14, cursor: 'pointer',
                    background: selectedModuleId === m.id ? 'rgba(249,115,22,0.08)' : '#141c2e',
                    border: `1px solid ${selectedModuleId === m.id ? 'rgba(249,115,22,0.35)' : '#1e2d4a'}`,
                    display: 'flex', alignItems: 'center', gap: 16, transition: 'all 0.2s',
                  }}
                >
                  <span style={{ fontSize: 28 }}>{m.thumbnail}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '0.95rem' }}>
                      {lang === 'en' ? m.title : m.titleHi}
                    </div>
                    <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: 3 }}>
                      5 {lang === 'en' ? 'questions · ' : 'प्रश्न · '}{m.difficulty}
                    </div>
                  </div>
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%',
                    border: `2px solid ${selectedModuleId === m.id ? '#f97316' : '#2a3f6b'}`,
                    background: selectedModuleId === m.id ? '#f97316' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {selectedModuleId === m.id && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => startQuiz(selectedModuleId)}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem' }}
            >
              <BookOpen size={18} />
              {lang === 'en' ? 'Start Assessment' : 'मूल्यांकन शुरू करें'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'quiz' && quiz) {
    const q = quiz.questions[quiz.currentIndex];
    const selectedAnswer = quiz.answers[quiz.currentIndex];
    const submitted = quiz.submitted[quiz.currentIndex];
    const isCorrect = submitted && selectedAnswer === q.correctIndex;
    const isWrong = submitted && selectedAnswer !== q.correctIndex && selectedAnswer !== null;

    const options = lang === 'en' ? q.options : q.optionsHi;
    const progressPct = ((quiz.currentIndex + (submitted ? 1 : 0)) / quiz.questions.length) * 100;

    return (
      <div style={{ minHeight: 'calc(100vh - 64px)', background: '#0a0e1a' }}>
        <div style={{ background: '#0f1629', borderBottom: '1px solid #1e2d4a', padding: '20px 0' }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button onClick={restart} className="btn-ghost">
                <ChevronLeft size={18} /> {t('back')}
              </button>
              <div style={{ width: 1, height: 20, background: '#1e2d4a' }} />
              <h1 style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9', fontFamily: 'Space Grotesk, sans-serif' }}>
                {t('assessment_title')}
              </h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: '#64748b', fontSize: '0.85rem' }}>
                {t('question')} {quiz.currentIndex + 1} / {quiz.questions.length}
              </span>
            </div>
          </div>
        </div>

        <div className="container" style={{ padding: '40px 20px' }}>
          <div style={{ maxWidth: 700, margin: '0 auto' }}>
            {/* Progress */}
            <div className="progress-bar" style={{ marginBottom: 32, height: 4 }}>
              <div className="progress-fill-blue" style={{ width: `${progressPct}%` }} />
            </div>

            {/* Question card */}
            <div className="card" style={{ padding: 32, marginBottom: 20 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
                {t('question')} {quiz.currentIndex + 1}
              </div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f1f5f9', lineHeight: 1.5, marginBottom: 28, fontFamily: 'Space Grotesk, sans-serif' }}>
                {lang === 'en' ? q.question : q.questionHi}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {options.map((opt, i) => {
                  const isSelected = selectedAnswer === i;
                  const isAnswerCorrect = submitted && i === q.correctIndex;
                  const isAnswerWrong = submitted && isSelected && i !== q.correctIndex;

                  let bg = '#141c2e';
                  let border = '#1e2d4a';
                  let color = '#94a3b8';
                  let icon = null;

                  if (isAnswerCorrect) { bg = 'rgba(16,185,129,0.1)'; border = 'rgba(16,185,129,0.4)'; color = '#10b981'; icon = <CheckCircle size={18} color="#10b981" />; }
                  else if (isAnswerWrong) { bg = 'rgba(239,68,68,0.1)'; border = 'rgba(239,68,68,0.4)'; color = '#f87171'; icon = <XCircle size={18} color="#ef4444" />; }
                  else if (isSelected && !submitted) { bg = 'rgba(59,130,246,0.1)'; border = 'rgba(59,130,246,0.4)'; color = '#60a5fa'; }

                  return (
                    <button
                      key={i}
                      onClick={() => selectAnswer(quiz.currentIndex, i)}
                      disabled={submitted}
                      style={{
                        width: '100%', padding: '14px 18px', borderRadius: 12, cursor: submitted ? 'default' : 'pointer',
                        background: bg, border: `1px solid ${border}`, color,
                        fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', textAlign: 'left',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                        transition: 'all 0.2s',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{
                          width: 28, height: 28, borderRadius: '50%', border: `1px solid ${border}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                          fontSize: '0.8rem', fontWeight: 700, background: isSelected && !submitted ? 'rgba(59,130,246,0.2)' : 'transparent',
                        }}>
                          {String.fromCharCode(65 + i)}
                        </span>
                        {opt}
                      </div>
                      {icon}
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {submitted && (
                <div style={{
                  marginTop: 20, padding: '14px 18px',
                  background: isCorrect ? 'rgba(16,185,129,0.07)' : 'rgba(239,68,68,0.07)',
                  border: `1px solid ${isCorrect ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
                  borderRadius: 12,
                }}>
                  <div style={{ fontWeight: 700, color: isCorrect ? '#10b981' : '#f87171', marginBottom: 8, fontSize: '0.9rem' }}>
                    {isCorrect ? `✓ ${t('correct')}!` : `✗ ${t('incorrect')}`}
                  </div>
                  <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.7 }}>
                    <strong style={{ color: '#f1f5f9' }}>{t('explanation')}:</strong>{' '}
                    {lang === 'en' ? q.explanation : q.explanationHi}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              {!submitted ? (
                <button
                  onClick={submitAnswer}
                  disabled={selectedAnswer === null}
                  className="btn-primary"
                  style={{ opacity: selectedAnswer === null ? 0.5 : 1, cursor: selectedAnswer === null ? 'not-allowed' : 'pointer' }}
                >
                  {t('submit_answer')}
                </button>
              ) : (
                <button onClick={nextQuestion} className="btn-primary">
                  {quiz.currentIndex + 1 >= quiz.questions.length ? t('finish') : t('next_question')} →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'results' && quiz) {
    const score = calculateScore(quiz);
    const passed = score >= PASS_THRESHOLD;
    const correctCount = quiz.questions.filter((q, i) => quiz.answers[i] === q.correctIndex).length;
    const module = TRAINING_MODULES.find(m => m.id === selectedModuleId);

    return (
      <div style={{ minHeight: 'calc(100vh - 64px)', background: '#0a0e1a' }}>
        <div className="container" style={{ padding: '60px 20px' }}>
          <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
            {/* Score circle */}
            <div style={{
              width: 140, height: 140, borderRadius: '50%', margin: '0 auto 32px',
              background: passed ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
              border: `4px solid ${passed ? '#10b981' : '#ef4444'}`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2.5rem', fontWeight: 900, color: passed ? '#10b981' : '#f87171', lineHeight: 1 }}>
                {score}%
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 4 }}>
                {t('score')}
              </div>
            </div>

            <div style={{ fontSize: '2rem', marginBottom: 12 }}>
              {passed ? '🏆' : '📚'}
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, color: passed ? '#10b981' : '#f87171', marginBottom: 10, fontFamily: 'Space Grotesk, sans-serif' }}>
              {passed ? t('passed') : t('failed')}
            </h1>
            <p style={{ color: '#94a3b8', marginBottom: 32 }}>
              {passed
                ? lang === 'en' ? `You answered ${correctCount}/${quiz.questions.length} questions correctly.` : `आपने ${correctCount}/${quiz.questions.length} प्रश्नों के सही उत्तर दिए।`
                : lang === 'en' ? `You answered ${correctCount}/${quiz.questions.length} correctly. You need ${PASS_THRESHOLD}% to pass.` : `आपने ${correctCount}/${quiz.questions.length} सही उत्तर दिए। उत्तीर्ण होने के लिए ${PASS_THRESHOLD}% चाहिए।`
              }
            </p>

            {/* Per-question summary */}
            <div style={{ textAlign: 'left', marginBottom: 32 }}>
              {quiz.questions.map((q, i) => {
                const correct = quiz.answers[i] === q.correctIndex;
                return (
                  <div key={q.id} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 0',
                    borderBottom: i < quiz.questions.length - 1 ? '1px solid #1e2d4a' : 'none',
                  }}>
                    {correct ? <CheckCircle size={18} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} /> : <XCircle size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />}
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: 4 }}>
                        Q{i + 1}: {lang === 'en' ? q.question : q.questionHi}
                      </div>
                      {!correct && (
                        <div style={{ fontSize: '0.75rem', color: '#10b981' }}>
                          ✓ {lang === 'en' ? q.options[q.correctIndex] : q.optionsHi[q.correctIndex]}
                        </div>
                      )}
                    </div>
                    <span style={{ color: correct ? '#10b981' : '#f87171', fontWeight: 700, fontSize: '0.8rem' }}>
                      {correct ? '+1' : '0'}
                    </span>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => startQuiz(selectedModuleId)} className="btn-primary">
                <RefreshCw size={16} /> {t('retry')}
              </button>
              <Link href="/dashboard" className="btn-secondary">
                📊 {lang === 'en' ? 'View Dashboard' : 'डैशबोर्ड देखें'}
              </Link>
              <button onClick={restart} className="btn-ghost">
                {lang === 'en' ? 'Try Another Module' : 'दूसरा मॉड्यूल आज़माएं'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
