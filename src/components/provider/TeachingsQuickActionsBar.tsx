import { Box, Button, Chip, Stack, Tooltip, Typography } from '@mui/material';
import { ArrowRight, BookOpen, Flag, Send } from 'lucide-react';
import { teachingsQuickActions, type TeachingsQuickActionKey } from '@/navigation/teachingsQuickActions';

type TeachingsQuickActionsBarProps = {
  activeAction?: TeachingsQuickActionKey | null;
  loadingAction?: TeachingsQuickActionKey | null;
  canContinueEditing?: boolean;
  onContinueEditing: () => void;
  onCreateTeaching: () => void;
  onReview: () => void;
  onPublish: () => void;
};

function actionMeta() {
  const byKey = new Map(
    teachingsQuickActions.map((item) => [
      item.key,
      {
        ...item,
        label:
          item.key === 'create-teaching' ? 'Create' :
          item.key === 'continue-editing' ? 'Continue Editing' :
          item.label,
      },
    ]),
  );

  const orderedKeys: TeachingsQuickActionKey[] = ['create-teaching', 'review', 'publish', 'continue-editing'];
  return orderedKeys.map((key) => {
    const item = byKey.get(key)!;
    return {
    ...item,
    icon:
      item.key === 'continue-editing' ? <ArrowRight size={16} /> :
      item.key === 'create-teaching' ? <BookOpen size={16} /> :
      item.key === 'review' ? <Flag size={16} /> :
      <Send size={16} />,
    primary: item.key === 'create-teaching',
    };
  });
}

export function TeachingsQuickActionsBar({
  activeAction,
  loadingAction,
  canContinueEditing = true,
  onContinueEditing,
  onCreateTeaching,
  onReview,
  onPublish,
}: TeachingsQuickActionsBarProps) {
  const actions = actionMeta();

  const onClickByKey: Record<TeachingsQuickActionKey, () => void> = {
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
          const isDisabled =
            Boolean(loadingAction) || (action.key === 'continue-editing' && !canContinueEditing);

          return (
            <Tooltip key={action.key} title={`${action.hint} (${action.shortcut})`} arrow>
              <Button
                type="button"
                onClick={onClickByKey[action.key]}
                disabled={isDisabled}
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
                      ? 'var(--fh-ink)'
                      : 'var(--fh-line)',
                  color: action.primary ? '#ffffff' : isActive ? '#ffffff' : 'var(--fh-ink)',
                  background: action.primary
                    ? 'linear-gradient(90deg, #16244c 0%, #1f2f63 100%)'
                    : isActive
                      ? 'color-mix(in srgb, var(--fh-ink) 86%, #ffffff 14%)'
                      : 'var(--fh-surface-bg)',
                  boxShadow: action.primary
                    ? '0 12px 24px -14px rgba(22,36,76,0.85)'
                    : isActive
                      ? '0 10px 20px -16px rgba(15,23,42,0.65)'
                      : 'none',
                  '&:hover': {
                    borderColor: action.primary ? 'transparent' : 'color-mix(in srgb, var(--fh-ink) 35%, var(--fh-line) 65%)',
                    background: action.primary
                      ? 'linear-gradient(90deg, #111c3b 0%, #1b2854 100%)'
                      : isActive
                        ? 'color-mix(in srgb, var(--fh-ink) 90%, #ffffff 10%)'
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
