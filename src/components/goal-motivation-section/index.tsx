import { useTranslation } from 'react-i18next';

import {
  Box,
  Typography,
  Card,
  CardContent,
  useTheme,
  alpha,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import type { CreateGoalForm } from 'src/types/financial-goal';

interface GoalMotivationSectionProps {
  goalType: CreateGoalForm['type'];
  targetAmount: number;
}

export function GoalMotivationSection({ goalType, targetAmount }: GoalMotivationSectionProps) {
  const { t } = useTranslation('common');
  const theme = useTheme();

  const getMotivationContent = () => {
    switch (goalType) {
      case 'buyCar':
        return {
          quote: 'Chiếc xe không chỉ là phương tiện, mà là tự do.',
          projection: 'Với kế hoạch tiết kiệm này, bạn sẽ sớm sở hữu chiếc xe mơ ước.',
          suggestion: 'Hãy cắt giảm chi tiêu không cần thiết và tăng thêm thu nhập.'
        };
      case 'buyHouse':
        return {
          quote: 'Ngôi nhà là nơi tình yêu thương bắt đầu và kết thúc.',
          projection: 'Mỗi đồng tiết kiệm hôm nay là một viên gạch xây nên tổ ấm.',
          suggestion: 'Cân nhắc tài chính và tìm kiếm các lựa chọn vay vốn tốt nhất.'
        };
      case 'travel':
        return {
          quote: 'Du lịch không chỉ là đi, mà là trải nghiệm và khám phá.',
          projection: 'Hành trình tuyệt vời đang chờ bạn khám phá thế giới.',
          suggestion: 'Bắt đầu tư ngay hôm nay để có giá vé tốt nhất.'
        };
      case 'emergencyFund':
        return {
          quote: 'Quỹ khẩn cấp là sự an tâm tài chính cho tương lai.',
          projection: 'Bạn đang xây dựng một tấm khiên vững chắc cho gia đình.',
          suggestion: 'Duy trì quỹ khẩn cấp ít nhất 3-6 tháng chi tiêu.'
        };
      case 'investment':
        return {
          quote: 'Đầu tư hôm nay là sự tự do tài chính tomorrow.',
          projection: 'Sự thông minh của bạn hôm nay sẽ tạo nên giàu có ngày mai.',
          suggestion: 'Đa dạng hóa danh mục đầu tư và bắt đầu với số nhỏ.'
        };
      default:
        return {
          quote: 'Mục tiêu rõ ràng giúp định hướng và tạo động lực.',
          projection: 'Bạn đang từng bước tiến gần hơn đến ước mơ của mình.',
          suggestion: 'Chia nhỏ mục tiêu lớn thành các cột mốc dễ đạt.'
        };
    }
  };

  const motivation = getMotivationContent();

  return (
    <Card
      sx={{
        borderRadius: 3,
        background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.02)}, ${alpha(theme.palette.secondary.dark, 0.05)})`,
        border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          {t('financialGoals.createGoal.motivationQuote')}
        </Typography>

        {/* Quote */}
        <Box
          sx={{
            p: 2,
            borderRadius: 3,
            background: alpha(theme.palette.secondary.main, 0.05),
            borderLeft: `4px solid ${theme.palette.secondary.main}`,
            mb: 2,
          }}
        >
          <Typography variant="body1" sx={{ fontStyle: 'italic', color: 'text.secondary', lineHeight: 1.6 }}>
            💭 {motivation.quote}
          </Typography>
        </Box>

        {/* Future Projection */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Iconify 
              icon="solar:pen-bold" 
              width={20} 
              color={theme.palette.secondary.main}
              sx={{ mr: 2 }}
            />
            <Typography variant="body2" fontWeight={600} color="secondary.main">
              {t('financialGoals.createGoal.futureProjection')}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ pl: 5.5 }}>
            {motivation.projection}
          </Typography>
        </Box>

        {/* Saving Suggestion */}
        <Box
          sx={{
            p: 2,
            borderRadius: 3,
            background: alpha(theme.palette.success.main, 0.05),
            border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Iconify 
              icon="solar:check-circle-bold" 
              width={20} 
              color={theme.palette.success.main}
              sx={{ mr: 2 }}
            />
            <Typography variant="body2" fontWeight={600} color="success.main">
              {t('financialGoals.createGoal.savingSuggestion')}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ pl: 5.5 }}>
            {motivation.suggestion}
          </Typography>
        </Box>

        {/* Target Amount Reminder */}
        {targetAmount > 0 && (
          <Box
            sx={{
              p: 2,
              borderRadius: 3,
              background: alpha(theme.palette.info.main, 0.05),
              border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
              textAlign: 'center',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Mục tiêu của bạn: <strong>{targetAmount.toLocaleString('vi-VN')}₫</strong>
            </Typography>
            <Typography variant="caption" color="info.main" sx={{ mt: 1 }}>
              💡 Mỗi bước nhỏ đều quan trọng trên hành trình này!
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
