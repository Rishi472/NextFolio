export const portfolioPalettes = {
  default: {
    primary: '#4f46e5',
    secondary: '#7c3aed',
    accent: '#06b6d4',
    soft: '#eef2ff',
    text: '#4f46e5',
  },
  blue: {
    primary: '#2563eb',
    secondary: '#0891b2',
    accent: '#38bdf8',
    soft: '#eff6ff',
    text: '#2563eb',
  },
  purple: {
    primary: '#7c3aed',
    secondary: '#c026d3',
    accent: '#c4b5fd',
    soft: '#f5f3ff',
    text: '#7c3aed',
  },
  green: {
    primary: '#059669',
    secondary: '#0f766e',
    accent: '#34d399',
    soft: '#ecfdf5',
    text: '#059669',
  },
  rose: {
    primary: '#e11d48',
    secondary: '#be123c',
    accent: '#fb7185',
    soft: '#fff1f2',
    text: '#e11d48',
  },
};

export function getPortfolioPalette(colorPalette = 'default') {
  return portfolioPalettes[colorPalette] || portfolioPalettes.default;
}

export function portfolioPaletteVars(colorPalette) {
  const palette = getPortfolioPalette(colorPalette);

  return {
    '--portfolio-primary': palette.primary,
    '--portfolio-secondary': palette.secondary,
    '--portfolio-accent': palette.accent,
    '--portfolio-soft': palette.soft,
    '--portfolio-text': palette.text,
  };
}
