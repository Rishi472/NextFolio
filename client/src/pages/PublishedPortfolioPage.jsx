import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import PortfolioPreview from '../features/PortfolioPreview';
import PortfolioThemeModern from '../features/themes/PortfolioThemeModern';
import PortfolioThemeMinimal from '../features/themes/PortfolioThemeMinimal';
import { useResumeStore, useUIStore } from '../store';

const PORTFOLIO_THEMES = {
  default: PortfolioPreview,
  modern: PortfolioThemeModern,
  classic: PortfolioThemeMinimal,
};

function readPublishedSnapshot(slug) {
  try {
    const raw = localStorage.getItem(`nextfolio_published_${slug}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function PublishedPortfolioPage() {
  const { slug = '' } = useParams();
  const snapshot = useMemo(() => readPublishedSnapshot(slug), [slug]);
  const setResumeData = useResumeStore((state) => state.setResumeData);
  const setTheme = useUIStore((state) => state.setTheme);
  const setColorPalette = useUIStore((state) => state.setColorPalette);
  const setLayoutStyle = useUIStore((state) => state.setLayoutStyle);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!snapshot) {
      setReady(true);
      return;
    }

    setResumeData(snapshot.resumeData);
    setTheme(snapshot.theme || 'default');
    setColorPalette(snapshot.colorPalette || 'blue');
    setLayoutStyle(snapshot.layoutStyle || 'default');
    setReady(true);
  }, [snapshot, setColorPalette, setLayoutStyle, setResumeData, setTheme]);

  if (!snapshot) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-center text-white">
        <div>
          <h1 className="text-3xl font-bold">Portfolio Not Found</h1>
          <p className="mt-3 text-white/70">Publish the portfolio again to create a valid local link.</p>
        </div>
      </div>
    );
  }

  if (!ready) {
    return <div className="min-h-screen bg-slate-950" />;
  }

  const ActivePortfolioTheme = PORTFOLIO_THEMES[snapshot.theme] || PortfolioPreview;

  return <ActivePortfolioTheme />;
}
