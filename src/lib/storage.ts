// Local storage utility for persisting user progress
import { UserProgress, AssessmentAttempt, SimulationAttempt, ActivityItem } from '@/types';

const STORAGE_KEYS = {
  PROGRESS: 'arv_progress',
  ACTIVITY: 'arv_activity',
  LANGUAGE: 'arv_language',
  SETTINGS: 'arv_settings',
} as const;

// Safe localStorage wrapper (handles SSR)
const storage = {
  get: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    try { return localStorage.getItem(key); } catch { return null; }
  },
  set: (key: string, value: string): void => {
    if (typeof window === 'undefined') return;
    try { localStorage.setItem(key, value); } catch { /* ignore */ }
  },
  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    try { localStorage.removeItem(key); } catch { /* ignore */ }
  },
};

// Progress management
export function getAllProgress(): Record<string, UserProgress> {
  const raw = storage.get(STORAGE_KEYS.PROGRESS);
  if (!raw) return {};
  try { return JSON.parse(raw); } catch { return {}; }
}

export function getModuleProgress(moduleId: string): UserProgress {
  const all = getAllProgress();
  return all[moduleId] ?? {
    moduleId,
    completionPercentage: 0,
    lastAccessed: 0,
    completed: false,
    assessmentScores: [],
    simulationAttempts: [],
    assessmentAttempts: [],
  };
}

export function saveModuleProgress(progress: UserProgress): void {
  const all = getAllProgress();
  all[progress.moduleId] = { ...progress, lastAccessed: Date.now() };
  storage.set(STORAGE_KEYS.PROGRESS, JSON.stringify(all));
}

export function markSimulationComplete(moduleId: string, attempt: SimulationAttempt): void {
  const progress = getModuleProgress(moduleId);
  progress.simulationAttempts = [...progress.simulationAttempts, attempt];
  if (attempt.completed) {
    progress.completionPercentage = Math.max(progress.completionPercentage, 50);
  }
  saveModuleProgress(progress);
  addActivity({
    id: `sim_${Date.now()}`,
    type: 'simulation',
    moduleId,
    moduleName: moduleId,
    timestamp: Date.now(),
    completed: attempt.completed,
  });
}

export function saveAssessmentAttempt(moduleId: string, attempt: AssessmentAttempt): void {
  const progress = getModuleProgress(moduleId);
  progress.assessmentAttempts = [...progress.assessmentAttempts, attempt];
  progress.assessmentScores = [...progress.assessmentScores, attempt.score];
  if (attempt.passed) {
    progress.completionPercentage = 100;
    progress.completed = true;
  } else {
    progress.completionPercentage = Math.max(progress.completionPercentage, 25);
  }
  saveModuleProgress(progress);
  addActivity({
    id: `assess_${Date.now()}`,
    type: 'assessment',
    moduleId,
    moduleName: moduleId,
    timestamp: Date.now(),
    score: attempt.score,
    completed: attempt.passed,
  });
}

export function startModule(moduleId: string): void {
  const progress = getModuleProgress(moduleId);
  if (progress.completionPercentage === 0) {
    progress.completionPercentage = 5;
  }
  saveModuleProgress(progress);
  addActivity({
    id: `start_${Date.now()}`,
    type: 'module_start',
    moduleId,
    moduleName: moduleId,
    timestamp: Date.now(),
  });
}

// Activity feed
function addActivity(item: ActivityItem): void {
  const raw = storage.get(STORAGE_KEYS.ACTIVITY);
  let activities: ActivityItem[] = [];
  try { activities = raw ? JSON.parse(raw) : []; } catch { activities = []; }
  activities = [item, ...activities].slice(0, 20); // keep last 20
  storage.set(STORAGE_KEYS.ACTIVITY, JSON.stringify(activities));
}

export function getRecentActivity(): ActivityItem[] {
  const raw = storage.get(STORAGE_KEYS.ACTIVITY);
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}

// Dashboard statistics
export function getDashboardStats() {
  const all = getAllProgress();
  const entries = Object.values(all);
  const totalModules = 4;
  const completedModules = entries.filter(p => p.completed).length;
  const inProgressModules = entries.filter(p => p.completionPercentage > 0 && !p.completed).length;
  const allScores = entries.flatMap(p => p.assessmentScores);
  const averageScore = allScores.length > 0
    ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
    : 0;
  const recentActivity = getRecentActivity();
  return {
    totalModules,
    completedModules,
    inProgressModules,
    averageScore,
    totalTimeSpent: 0,
    recentActivity,
    streakDays: 0,
    overallProgress: Math.round(
      entries.reduce((sum, p) => sum + p.completionPercentage, 0) / totalModules
    ),
  };
}

// Language
export function getLanguage(): 'en' | 'hi' {
  return (storage.get(STORAGE_KEYS.LANGUAGE) as 'en' | 'hi') ?? 'en';
}

export function setLanguage(lang: 'en' | 'hi'): void {
  storage.set(STORAGE_KEYS.LANGUAGE, lang);
}
