import React from 'react';
import { Box, IconButton, Menu, MenuItem, Stack, Typography } from '@mui/material';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';

export type PageHeaderProps = {
  pageTitle: string;
  badge?: React.ReactNode;
  rightContent?: React.ReactNode;
  className?: string;
  mobileViewType?: 'menu' | 'inline-right' | 'hide';
  mobileHideBadge?: boolean;
};

export function PageHeader({
  pageTitle,
  badge,
  rightContent,
  className = '',
  mobileViewType = 'menu',
  mobileHideBadge = false,
}: PageHeaderProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  return (
    <Box className={className} sx={{ borderBottom: '1px solid rgba(15,23,42,0.08)', bgcolor: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2} px={{ xs: 2, md: 3 }} py={2}>
        <Stack direction="row" alignItems="center" gap={1.5} minWidth={0}>
          <Box
            component="img"
            src="/assets/logo.svg"
            alt="FaithHub"
            sx={{ width: 36, height: 36, borderRadius: 2.5, flexShrink: 0 }}
          />
          <Typography variant="h6" fontWeight={800} noWrap>
            {pageTitle}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" gap={1} sx={{ display: { xs: 'none', lg: 'flex' } }}>
          {badge}
          {rightContent}
        </Stack>

        <Box sx={{ display: { xs: 'flex', lg: 'none' }, alignItems: 'center', gap: 1 }}>
          {mobileViewType === 'inline-right' ? rightContent : null}
          {mobileViewType === 'menu' ? (
            <>
              <IconButton onClick={(event) => setAnchorEl(event.currentTarget)} size="small">
                <MoreHorizRoundedIcon />
              </IconButton>
              <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
                {badge && !mobileHideBadge ? <MenuItem disableRipple>{badge}</MenuItem> : null}
                {rightContent ? <MenuItem disableRipple>{rightContent}</MenuItem> : null}
              </Menu>
            </>
          ) : null}
        </Box>
      </Stack>
    </Box>
  );
}
