import { Mail, MapPin, Phone } from 'lucide-react';
import { useResumeStore, useUIStore } from '../../store';
import { getPortfolioLayout } from './layoutTokens';
import { portfolioPaletteVars } from './paletteTokens';
import { EMPTY_PORTFOLIO_MESSAGE, formatRange, hasPortfolioData, normalizeResumeForPortfolio } from './resumeThemeData';

export default function PortfolioThemeMinimal() {
  const resumeData = useResumeStore((state) => state.resumeData || state);
  const colorPalette = useUIStore((state) => state.colorPalette);
  const layoutStyle = useUIStore((state) => state.layoutStyle);
  const layout = getPortfolioLayout(layoutStyle);
  const resume = normalizeResumeForPortfolio(resumeData);

  if (!hasPortfolioData(resume)) {
    return (
      <div className="min-h-full bg-white flex items-center justify-center p-6 text-center text-gray-500">
        <p className="text-lg">{EMPTY_PORTFOLIO_MESSAGE}</p>
      </div>
    );
  }

  return (
    <main className="min-h-full bg-white text-slate-900" style={portfolioPaletteVars(colorPalette)}>
      <section className={`px-6 ${layoutStyle === 'compact' ? 'py-10' : 'py-16'} ${layout.inner} mx-auto`}>
        <p className="text-sm font-semibold text-[var(--portfolio-text)] uppercase tracking-widest">Portfolio</p>
        <h1 className="mt-3 text-5xl font-bold">{resume.name}</h1>
        {resume.summary && <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{resume.summary}</p>}

        <div className="mt-8 flex flex-wrap gap-4 text-sm text-slate-600">
          {resume.email && <span className="inline-flex items-center gap-2"><Mail className="w-4 h-4" /> {resume.email}</span>}
          {resume.phone && <span className="inline-flex items-center gap-2"><Phone className="w-4 h-4" /> {resume.phone}</span>}
          {resume.location && <span className="inline-flex items-center gap-2"><MapPin className="w-4 h-4" /> {resume.location}</span>}
        </div>
      </section>

      {resume.skills.length > 0 && (
        <section className={`px-6 ${layoutStyle === 'compact' ? 'py-8' : 'py-12'} ${layout.inner} mx-auto border-t border-slate-200`}>
          <h2 className="text-2xl font-bold">Skills</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {resume.skills.map((skill) => (
              <span key={skill} className="rounded-full border border-slate-200 px-3 py-1 text-sm">{skill}</span>
            ))}
          </div>
        </section>
      )}

      {resume.projects.length > 0 && (
        <section id="projects" className={`px-6 ${layoutStyle === 'compact' ? 'py-8' : 'py-12'} ${layout.inner} mx-auto border-t border-slate-200`}>
          <h2 className="text-2xl font-bold">Projects</h2>
          <div className={`mt-6 grid ${layout.grid} ${layout.gap}`}>
            {resume.projects.map((project) => (
              <article 
                key={project.id} 
                className={`rounded-lg border border-slate-200 ${layout.cardPadding} cursor-pointer hover:shadow-lg transition-shadow`}
                onClick={() => {
                  if (project.githubLink) {
                    window.open(project.githubLink, '_blank');
                  } else if (project.demoLink) {
                    window.open(project.demoLink, '_blank');
                  } else if (project.link) {
                    window.open(project.link, '_blank');
                  }
                }}
              >
                <h3 className="font-bold">{project.title}</h3>
                {project.description && <p className="mt-2 text-sm text-slate-600">{project.description}</p>}
                {project.link && <a className="mt-4 inline-block text-sm font-semibold text-[var(--portfolio-text)]" href={project.link} target="_blank" rel="noreferrer">View project</a>}
              </article>
            ))}
          </div>
        </section>
      )}

      {resume.experience.length > 0 && (
        <section className={`px-6 ${layoutStyle === 'compact' ? 'py-8' : 'py-12'} ${layout.inner} mx-auto border-t border-slate-200`}>
          <h2 className="text-2xl font-bold">Experience</h2>
          <div className="mt-6 space-y-5">
            {resume.experience.map((item) => (
              <article key={item.id}>
                <h3 className="font-bold">{item.title}{item.company ? `, ${item.company}` : ''}</h3>
                {formatRange(item) && <p className="text-sm text-slate-500">{formatRange(item)}</p>}
                {item.description && <p className="mt-2 text-sm text-slate-600">{item.description}</p>}
              </article>
            ))}
          </div>
        </section>
      )}

      {resume.education.length > 0 && (
        <section className={`px-6 ${layoutStyle === 'compact' ? 'py-8' : 'py-12'} ${layout.inner} mx-auto border-t border-slate-200`}>
          <h2 className="text-2xl font-bold">Education</h2>
          <div className="mt-6 space-y-5">
            {resume.education.map((item) => (
              <article key={item.id}>
                <h3 className="font-bold">{item.school || item.degree}</h3>
                {[item.degree, item.timeline, item.result].filter(Boolean).map((detail) => (
                  <p key={detail} className="text-sm text-slate-500">{detail}</p>
                ))}
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
