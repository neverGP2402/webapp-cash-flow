import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Typography,
  Card,
  CardContent,
  Fab,
  Skeleton,
  Grid,
  useTheme,
  alpha,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { GoalHeroOverview } from 'src/components/goal-hero-overview';
import { GoalGrid } from 'src/components/goal-grid';
import { GoalAnalytics } from 'src/components/goal-analytics';
import { GoalTimeline } from 'src/components/goal-timeline';
import { GoalInsight } from 'src/components/goal-insight';
import { EmptyGoalState } from 'src/components/empty-goal-state';
import { CreateGoalDrawer } from 'src/components/create-goal-drawer';

import type { 
  FinancialGoal, 
  GoalAnalytics as GoalAnalyticsType,
  GoalMilestone,
  GoalInsight as GoalInsightType 
} from 'src/types/financial-goal';

// Mock data
const mockGoals: FinancialGoal[] = [
  {
    id: '1',
    name: 'Mua xe Honda CR-V',
    type: 'buyCar',
    targetAmount: 850000000,
    currentAmount: 425000000,
    deadline: '2024-12-31',
    status: 'active',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15',
    icon: 'solar:car-bold',
    color: '#FF6B6B'
  },
  {
    id: '2',
    name: 'Quỹ khẩn cấp 6 tháng',
    type: 'emergencyFund',
    targetAmount: 180000000,
    currentAmount: 180000000,
    deadline: '2024-06-30',
    status: 'completed',
    createdAt: '2024-01-01',
    updatedAt: '2024-06-30',
    icon: 'solar:shield-check-bold',
    color: '#4ECDC4'
  },
  {
    id: '3',
    name: 'Du lịch Nhật Bản',
    type: 'travel',
    targetAmount: 120000000,
    currentAmount: 80000000,
    deadline: '2024-08-15',
    status: 'active',
    createdAt: '2024-02-01',
    updatedAt: '2024-02-15',
    icon: 'solar:plane-bold',
    color: '#45B7D1'
  },
  {
    id: '4',
    name: 'Mua nhà chung cư',
    type: 'buyHouse',
    targetAmount: 2500000000,
    currentAmount: 250000000,
    deadline: '2026-12-31',
    status: 'delayed',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15',
    icon: 'solar:home-bold',
    color: '#96CEB4'
  },
  {
    id: '5',
    name: 'Đầu tư chứng khoán',
    type: 'investment',
    targetAmount: 500000000,
    currentAmount: 150000000,
    deadline: '2025-06-30',
    status: 'active',
    createdAt: '2024-03-01',
    updatedAt: '2024-03-15',
    icon: 'solar:chart-bold',
    color: '#FFEAA7'
  }
];

const mockMilestones: GoalMilestone[] = [
  {
    id: '1',
    goalId: '1',
    percentage: 25,
    achievedAt: '2024-03-01',
    amount: 212500000
  },
  {
    id: '2',
    goalId: '1',
    percentage: 50,
    achievedAt: '2024-06-15',
    amount: 425000000
  },
  {
    id: '3',
    goalId: '2',
    percentage: 100,
    achievedAt: '2024-06-30',
    amount: 180000000
  }
];

export default function FinancialGoalsPage() {
  const { t } = useTranslation('common');
  const theme = useTheme();
  
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [milestones, setMilestones] = useState<GoalMilestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'delayed'>('all');
  const [sortBy, setSortBy] = useState<'nearestCompletion' | 'highestAmount' | 'latestCreated' | 'progress'>('progress');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setGoals(mockGoals);
      setMilestones(mockMilestones);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredGoals = useMemo(() => {
    let filtered = goals;
    
    if (filter !== 'all') {
      filtered = filtered.filter(goal => goal.status === filter);
    }
    
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'nearestCompletion':
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        case 'highestAmount':
          return b.targetAmount - a.targetAmount;
        case 'latestCreated':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'progress':
          const progressA = (a.currentAmount / a.targetAmount) * 100;
          const progressB = (b.currentAmount / b.targetAmount) * 100;
          return progressB - progressA;
        default:
          return 0;
      }
    });
  }, [goals, filter, sortBy]);

  const analytics = useMemo((): GoalAnalyticsType => {
    const activeGoals = goals.filter(g => g.status === 'active');
    
    const closestGoal = activeGoals.reduce((closest, goal) => {
      const progress = (goal.currentAmount / goal.targetAmount) * 100;
      const closestProgress = closest ? (closest.currentAmount / closest.targetAmount) * 100 : 0;
      return progress > closestProgress ? goal : closest;
    }, null as FinancialGoal | null);

    const hardestGoal = activeGoals.reduce((hardest, goal) => {
      const remaining = goal.targetAmount - goal.currentAmount;
      const hardestRemaining = hardest ? hardest.targetAmount - hardest.currentAmount : 0;
      return remaining > hardestRemaining ? goal : hardest;
    }, null as FinancialGoal | null);

    const fastestGrowingGoal = activeGoals.reduce((fastest, goal) => {
      const daysSinceCreation = (Date.now() - new Date(goal.createdAt).getTime()) / (1000 * 60 * 60 * 24);
      const dailyRate = goal.currentAmount / daysSinceCreation;
      const fastestRate = fastest ? fastest.currentAmount / ((Date.now() - new Date(fastest.createdAt).getTime()) / (1000 * 60 * 60 * 24)) : 0;
      return dailyRate > fastestRate ? goal : fastest;
    }, null as FinancialGoal | null);

    const monthlyRequired = activeGoals.reduce((total, goal) => {
      const remaining = goal.targetAmount - goal.currentAmount;
      const monthsUntilDeadline = Math.max(1, (new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30));
      return total + (remaining / monthsUntilDeadline);
    }, 0);

    const predictionProgress = activeGoals.length > 0 
      ? activeGoals.reduce((sum, goal) => sum + (goal.currentAmount / goal.targetAmount) * 100, 0) / activeGoals.length
      : 0;

    return {
      closestGoal,
      hardestGoal,
      fastestGrowingGoal,
      monthlyRequired,
      predictionProgress
    };
  }, [goals]);

  const insights = useMemo((): GoalInsightType => {
    const activeGoals = goals.filter(g => g.status === 'active');
    const delayedGoals = goals.filter(g => g.status === 'delayed');
    const aheadGoals = activeGoals.filter(goal => {
      const expectedProgress = ((Date.now() - new Date(goal.createdAt).getTime()) / (new Date(goal.deadline).getTime() - new Date(goal.createdAt).getTime())) * 100;
      const actualProgress = (goal.currentAmount / goal.targetAmount) * 100;
      return actualProgress > expectedProgress;
    });

    const priorityGoal = delayedGoals.length > 0 ? delayedGoals[0] : 
                        aheadGoals.length === 0 && activeGoals.length > 0 ? activeGoals[0] : null;

    const avgCompletionTime = activeGoals.length > 0 
      ? activeGoals.reduce((sum, goal) => {
          const monthsToComplete = (goal.targetAmount - goal.currentAmount) / (goal.currentAmount / Math.max(1, (Date.now() - new Date(goal.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 30)));
          return sum + monthsToComplete;
        }, 0) / activeGoals.length
      : 0;

    const currentPaceCompletion = new Date(Date.now() + (avgCompletionTime * 30 * 24 * 60 * 60 * 1000)).toLocaleDateString('vi-VN');

    return {
      currentPaceCompletion,
      priorityGoal,
      aheadGoals,
      delayedGoals
    };
  }, [goals]);

  const handleCreateGoal = (newGoal: Omit<FinancialGoal, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    const goal: FinancialGoal = {
      ...newGoal,
      id: Date.now().toString(),
      status: newGoal.currentAmount >= newGoal.targetAmount ? 'completed' : 
              newGoal.currentAmount > 0 ? 'active' : 'no_progress',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setGoals(prev => [...prev, goal]);
    setCreateDrawerOpen(false);
  };

  if (loading) {
    return (
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' },
            gap: 3,
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Box key={item} sx={{ minWidth: { xs: '100%', sm: 300, lg: 350 } }}>
              <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 3 }} />
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* Hero Overview Section */}
      <GoalHeroOverview 
        goals={goals}
        totalTarget={goals.reduce((sum, goal) => sum + goal.targetAmount, 0)}
        totalSaved={goals.reduce((sum, goal) => sum + goal.currentAmount, 0)}
        activeCount={goals.filter(g => g.status === 'active').length}
      />

      {/* Empty State */}
      {goals.length === 0 ? (
        <EmptyGoalState onCreateGoal={() => setCreateDrawerOpen(true)} />
      ) : (
        <>
          {/* Analytics and Insights Section */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, 
            gap: 3, 
            mt: 3 
          }}>
            <Box>
              <GoalAnalytics analytics={analytics} />
            </Box>
            <Box>
              <GoalInsight insights={insights} />
            </Box>
          </Box>

          {/* Goals Grid */}
          <Box sx={{ mt: 4 }}>
            <GoalGrid 
              goals={filteredGoals}
              onEdit={(goal) => console.log('Edit goal:', goal)}
              onDelete={(goalId) => console.log('Delete goal:', goalId)}
            />
          </Box>

          {/* Timeline Section */}
          {milestones.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <GoalTimeline milestones={milestones} goals={goals} />
            </Box>
          )}
        </>
      )}

      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
          '&:hover': {
            background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
            boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.4)}`,
          }
        }}
        onClick={() => setCreateDrawerOpen(true)}
      >
        <Iconify icon="solar:check-circle-bold" width={24} />
      </Fab>

      {/* Create Goal Drawer */}
      <CreateGoalDrawer
        open={createDrawerOpen}
        onClose={() => setCreateDrawerOpen(false)}
        onSubmit={handleCreateGoal}
      />
    </Box>
  );
}
