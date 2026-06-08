const ignoredRollupWarnings = new Set(['MODULE_LEVEL_DIRECTIVE', 'SOURCEMAP_ERROR']);

export function filterKnownBuildWarnings(warning, defaultHandler) {
  if (ignoredRollupWarnings.has(warning.code)) {
    return;
  }

  defaultHandler(warning);
}
