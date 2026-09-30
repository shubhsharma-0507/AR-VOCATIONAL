// Core types for AR-VOCATIONAL

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type ModuleCategory = 'Fire Safety' | 'Mining' | 'Emergency' | 'General Safety';
export type Language = 'en' | 'hi';

export interface TrainingModule {
  id: string;
  title: string;
  titleHi: string;
  category: ModuleCategory;
  difficulty: Difficulty;
  duration: number; // minutes
  description: string;
  descriptionHi: string;
  route: string;
  completed: boolean;
  progress: number; // 0-100
  thumbnail: string; // emoji or icon
  tags: string[];
}

export interface SimulationStep {
  id: number;
  instruction: string;
  instructionHi: string;
  hint?: string;
  hintHi?: string;
  action: string; // what the user needs to do
  isCompleted: boolean;
}

export interface AssessmentQuestion {
  id: string;
  moduleId: string;
  question: string;
  questionHi: string;
  options: string[];
  optionsHi: string[];
  correctIndex: number;
  explanation: string;
  explanationHi: string;
}

export interface AssessmentAttempt {
  id: string;
  moduleId: string;
  timestamp: number;
  answers: number[]; // index of selected option per question
  score: number; // 0-100
  passed: boolean;
  timeSpent: number; // seconds
}

export interface SimulationAttempt {
  id: string;
  moduleId: string;
  timestamp: number;
  stepsCompleted: number;
  totalSteps: number;
  completed: boolean;
  timeSpent: number;
  mistakes: number;
}

export interface UserProgress {
  moduleId: string;
  completionPercentage: number;
  lastAccessed: number;
  completed: boolean;
  assessmentScores: number[];
  simulationAttempts: SimulationAttempt[];
  assessmentAttempts: AssessmentAttempt[];
}

export interface DashboardStats {
  totalModules: number;
  completedModules: number;
  inProgressModules: number;
  averageScore: number;
  totalTimeSpent: number; // minutes
  recentActivity: ActivityItem[];
  streakDays: number;
}

export interface ActivityItem {
  id: string;
  type: 'simulation' | 'assessment' | 'module_start';
  moduleId: string;
  moduleName: string;
  timestamp: number;
  score?: number;
  completed?: boolean;
}

export interface HazardItem {
  id: string;
  label: string;
  labelHi: string;
  description: string;
  descriptionHi: string;
  isHazard: boolean;
  position: [number, number, number];
  color: string;
}
