export interface FinancialGoal {
  id: string;
  name: string;
  type: 'buyCar' | 'buyHouse' | 'travel' | 'emergencyFund' | 'investment' | 'other';
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  status: 'active' | 'completed' | 'delayed' | 'no_progress';
  createdAt: string;
  updatedAt: string;
  icon?: string;
  color?: string;
}

export interface GoalAnalytics {
  closestGoal: FinancialGoal | null;
  hardestGoal: FinancialGoal | null;
  fastestGrowingGoal: FinancialGoal | null;
  monthlyRequired: number;
  predictionProgress: number;
}

export interface GoalMilestone {
  id: string;
  goalId: string;
  percentage: number;
  achievedAt: string;
  amount: number;
}

export interface GoalInsight {
  currentPaceCompletion: string;
  priorityGoal: FinancialGoal | null;
  aheadGoals: FinancialGoal[];
  delayedGoals: FinancialGoal[];
}

export interface CreateGoalForm {
  name: string;
  type: 'buyCar' | 'buyHouse' | 'travel' | 'emergencyFund' | 'investment' | 'other';
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}

export interface GoalProgress {
  percentage: number;
  remainingAmount: number;
  monthlyRequired: number;
  estimatedCompletion: string;
  isOnTrack: boolean;
}
