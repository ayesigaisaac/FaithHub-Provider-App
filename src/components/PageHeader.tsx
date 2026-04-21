import React from 'react';
import { Box, IconButton, Menu, MenuItem, Stack, Typography } from '@mui/material';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import {
  Bell,
  CalendarClock,
  Clapperboard,
  Film,
  HandCoins,
  HeartHandshake,
  MonitorPlay,
  Radio,
  Share2,
  Users,
  Video,
  type LucideIcon,
} from 'lucide-react';

export type PageHeaderProps = {
  pageTitle: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  rightContent?: React.ReactNode;
  className?: string;
  mobileViewType?: 'menu' | 'inline-right' | 'hide';
  mobileHideBadge?: boolean;
};

const HEADER_ICON_BY_TITLE: Record<string, LucideIcon> = {
  'Live Builder': Video,
  'Live Studio': Clapperboard,
  'Stream to Platforms': Share2,
  'Audience Notifications': Bell,
  'Channels & Contact Manager': Users,
  'Post-live Publishing': Film,
  'Replays & Clips': MonitorPlay,
  'Events Manager': CalendarClock,
  'Donations & Funds': HandCoins,
  'Charity Crowdfunding Workbench': HeartHandshake,
  'Live Schedule': Radio,
};

export function PageHeader({
  pageTitle,
  icon,
  badge,
  rightContent,
  className = '',
  mobileViewType = 'menu',
  mobileHideBadge = false,
}: PageHeaderProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const Icon = HEADER_ICON_BY_TITLE[pageTitle];
  const titleIcon = icon ?? (Icon ? <Icon size={22} /> : null);

  return (
    <Box className={className} sx={{ borderBottom: '1px solid rgba(15,23,42,0.08)', bgcolor: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2} px={{ xs: 2, md: 3 }} py={2}>
        <Stack direction="row" alignItems="center" gap={1.5} minWidth={0}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2.5,
              flexShrink: 0,
              display: 'grid',
              placeItems: 'center',
              bgcolor: '#10b981',
              color: '#fff',
            }}
          >
            {titleIcon}
          </Box>
          <Typography
            noWrap
            sx={{
              fontWeight: 900,
              letterSpacing: '-0.03em',
              lineHeight: 1.04,
              color: 'text.primary',
              fontSize: { xs: '28px', sm: '34px', lg: '40px' },
            }}
          >
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
