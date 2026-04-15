export const spacing = {
  compact: {
    pageX: 'px-4 md:px-5 lg:px-6',
    pageY: 'py-3 md:py-4',
    sectionGap: 'gap-4',
    stackGap: 'space-y-4',
    cardPadding: 'p-4',
    mui: {
      shellX: { xs: 1, md: 1.75 },
      shellY: { xs: 1, md: 1.5 },
      topbarToolbarMinHeight: 60,
      topbarHeaderY: 1.25,
      topbarHeaderX: { xs: 1.5, md: 2.25 },
      sidebarHeaderY: 1.5,
      sidebarBodyY: 0.5,
    },
  },
  normal: {
    pageX: 'px-6 md:px-8',
    pageY: 'py-4 md:py-6',
    sectionGap: 'gap-6',
    stackGap: 'space-y-6',
    cardPadding: 'p-6',
    mui: {
      shellX: { xs: 1.25, md: 2.5 },
      shellY: { xs: 1.25, md: 2.5 },
      topbarToolbarMinHeight: 68,
      topbarHeaderY: 2,
      topbarHeaderX: { xs: 2, md: 3 },
      sidebarHeaderY: 2,
      sidebarBodyY: 1,
    },
  },
} as const;

export type LayoutDensity = keyof typeof spacing;
