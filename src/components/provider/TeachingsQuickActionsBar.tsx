import { Box, Button, Chip, Stack, Tooltip, Typography } from '@mui/material';
import { ArrowRight, BookOpen, Flag, Send } from 'lucide-react';

type ActionKey = 'continue-editing' | 'create-teaching' | 'review' | 'publish';

type TeachingsQuickActionsBarProps = {
  continueLabel: string;
  activeAction?: ActionKey | null;
  loadingAction?: ActionKey | null;
  onContinueEditing: () => void;
  onCreateTeaching: () => void;
  onReview: () => void;
  onPublish: () => void;
};

function actionMeta(continueLabel: string) {
  return [
    {
      key: 'continue-editing' as const,
      label: continueLabel,
      hint: 'Open your current in-progress teaching',
      shortcut: 'G D',
      icon: <ArrowRight size={16} />,
      primary: true,
    },
    {
      key: 'create-teaching' as const,
      label: 'Create Teaching',
      hint: 'Start a new teaching draft',
      shortcut: 'C T',
      icon: <BookOpen size={16} />,
    },
    {
      key: 'review' as const,
      label: 'Review',
      hint: 'Open moderation and pending reviews',
      shortcut: 'G R',
      icon: <Flag size={16} />,
    },
    {
      key: 'publish' as const,
      label: 'Publish',
      hint: 'Go to publish-ready workflow',
      shortcut: 'G P',
      icon: <Send size={16} />,
    },
  ];
}

export function TeachingsQuickActionsBar({
  continueLabel,
  activeAction,
  loadingAction,
  onContinueEditing,
  onCreateTeaching,
  onReview,
  onPublish,
}: TeachingsQuickActionsBarProps) {
  const actions = actionMeta(continueLabel);

  const onClickByKey: Record<ActionKey, () => void> = {
    'continue-editing': onContinueEditing,
    'create-teaching': onCreateTeaching,
    review: onReview,
    publish: onPublish,
  };

  return (
    <Box
      sx={{
        borderRadius: '18px',
        border: '1px solid',
        borderColor: 'var(--fh-line)',
        bgcolor: 'var(--fh-surface)',
        px: { xs: 1.2, md: 1.6 },
        py: 1.15,
        boxShadow: '0 10px 24px -20px rgba(15, 23, 42, 0.45)',
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography sx={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', color: 'var(--fh-slate)' }}>
          QUICK ACTIONS
        </Typography>
        <Typography sx={{ fontSize: 11, color: 'var(--fh-slate)' }}>Decision-first workflow</Typography>
      </Stack>

      <Box
        sx={{
          display: 'flex',
          gap: 1,
          overflowX: { xs: 'auto', md: 'visible' },
          pb: { xs: 0.4, md: 0 },
          flexWrap: { xs: 'nowrap', md: 'wrap' },
          '&::-webkit-scrollbar': { height: 8 },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'var(--fh-line)',
            borderRadius: 99,
          },
        }}
      >
        {actions.map((action) => {
          const isActive = activeAction === action.key;
          const isLoading = loadingAction === action.key;

          return (
            <Tooltip key={action.key} title={`${action.hint} (${action.shortcut})`} arrow>
              <Button
                type="button"
                onClick={onClickByKey[action.key]}
                disabled={Boolean(loadingAction)}
                startIcon={action.icon}
                variant={action.primary ? 'contained' : isActive ? 'contained' : 'outlined'}
                sx={{
                  flexShrink: 0,
                  minHeight: action.primary ? 44 : 40,
                  px: action.primary ? 2.1 : 1.7,
                  borderRadius: 999,
                  textTransform: 'none',
                  fontSize: action.primary ? 13 : 12,
                  fontWeight: action.primary ? 800 : 700,
                  borderWidth: 1,
                  borderColor: action.primary
                    ? 'transparent'
                    : isActive
                      ? 'var(--fh-brand)'
                      : 'var(--fh-line)',
                  color: action.primary ? '#ffffff' : isActive ? '#ffffff' : 'var(--fh-ink)',
                  background: action.primary
                    ? 'linear-gradient(90deg, #03cd8c 0%, #0ea56f 100%)'
                    : isActive
                      ? 'color-mix(in srgb, var(--fh-brand) 88%, #0f172a 12%)'
                      : 'var(--fh-surface-bg)',
                  boxShadow: action.primary
                    ? '0 12px 24px -14px rgba(3,205,140,0.9)'
                    : isActive
                      ? '0 10px 20px -16px rgba(3,205,140,0.75)'
                      : 'none',
                  '&:hover': {
                    borderColor: action.primary ? 'transparent' : 'color-mix(in srgb, var(--fh-brand) 35%, var(--fh-line) 65%)',
                    background: action.primary
                      ? 'linear-gradient(90deg, #02b97f 0%, #0d915f 100%)'
                      : isActive
                        ? 'color-mix(in srgb, var(--fh-brand) 90%, #0f172a 10%)'
                        : 'var(--fh-surface)',
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                {isLoading ? 'Loading...' : action.label}
                <Chip
                  size="small"
                  label={action.shortcut}
                  sx={{
                    ml: 0.8,
                    height: 20,
                    borderRadius: 99,
                    fontSize: 10,
                    fontWeight: 700,
                    border: '1px solid',
                    borderColor: action.primary || isActive ? 'rgba(255,255,255,0.35)' : 'var(--fh-line)',
                    color: action.primary || isActive ? '#ffffff' : 'var(--fh-slate)',
                    bgcolor: action.primary || isActive ? 'rgba(255,255,255,0.12)' : 'var(--fh-surface)',
                  }}
                />
              </Button>
            </Tooltip>
          );
        })}
      </Box>
    </Box>
  );
}
