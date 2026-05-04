export const portfolioLayouts = {
  default: {
    section: 'py-24',
    inner: 'max-w-6xl',
    grid: 'md:grid-cols-2',
    gap: 'gap-8',
    cardPadding: 'p-6',
  },
  standard: {
    section: 'py-24',
    inner: 'max-w-6xl',
    grid: 'md:grid-cols-2',
    gap: 'gap-8',
    cardPadding: 'p-6',
  },
  compact: {
    section: 'py-14',
    inner: 'max-w-5xl',
    grid: 'md:grid-cols-2 lg:grid-cols-3',
    gap: 'gap-4',
    cardPadding: 'p-4',
  },
  grid: {
    section: 'py-20',
    inner: 'max-w-7xl',
    grid: 'md:grid-cols-2 lg:grid-cols-3',
    gap: 'gap-6',
    cardPadding: 'p-5',
  },
};

export function getPortfolioLayout(layoutStyle = 'default') {
  return portfolioLayouts[layoutStyle] || portfolioLayouts.default;
}
