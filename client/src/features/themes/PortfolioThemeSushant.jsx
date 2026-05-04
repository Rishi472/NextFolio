import { ArrowUpRight, BriefcaseBusiness, Check, Copy, GraduationCap, Mail, MapPin, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useResumeStore } from '../../store';
import { useUIStore } from '../../store';
import { getPortfolioLayout } from './layoutTokens';
import { portfolioPaletteVars } from './paletteTokens';
import { EMPTY_PORTFOLIO_MESSAGE, formatRange, hasPortfolioData, normalizeResumeForPortfolio } from './resumeThemeData';

function MagicButton({ children, href, onClick }) {
  const content = (
    <span className="relative inline-flex h-12 min-w-48 overflow-hidden rounded-lg p-px focus:outline-none">
      <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,var(--portfolio-accent)_0%,var(--portfolio-primary)_50%,var(--portfolio-accent)_100%)]" />
      <span className="inline-flex h-full w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-6 text-sm font-medium text-white backdrop-blur-3xl">
        {children}
      </span>
    </span>
  );

  if (href) {
    return (
      <a href={href} onClick={onClick}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick}>
      {content}
    </button>
  );
}

function FloatingNav() {
  const items = [
    ['About', '#about'],
    ['Projects', '#projects'],
    ['Skills', '#skills'],
    ['Contact', '#contact'],
  ];

  return (
    <nav className="sticky top-4 z-30 mx-auto mb-8 flex w-fit max-w-[90vw] items-center gap-1 rounded-full border border-white/10 bg-slate-950/70 px-3 py-2 text-xs text-white/80 shadow-2xl backdrop-blur">
      {items.map(([label, href]) => (
        <a key={href} href={href} className="rounded-full px-3 py-1.5 hover:bg-white/10 hover:text-white">
          {label}
        </a>
      ))}
    </nav>
  );
}

function Hero({ resume }) {
  return (
    <section className="relative flex min-h-[86vh] items-center justify-center overflow-hidden rounded-b-[2rem]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,color-mix(in_srgb,var(--portfolio-secondary)_38%,transparent),transparent_28%),radial-gradient(circle_at_80%_20%,color-mix(in_srgb,var(--portfolio-primary)_28%,transparent),transparent_30%),linear-gradient(180deg,#050816_0%,#06091f_100%)]" />
      <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:44px_44px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_18%,#050816_72%)]" />

      <div className="relative z-10 flex max-w-5xl flex-col items-center px-6 text-center">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.45em] text-blue-100/80">
          Dynamic Nextfolio Theme
        </p>
        <h1 className="max-w-4xl text-4xl font-bold leading-tight text-white md:text-6xl lg:text-7xl">
          {resume.name}
        </h1>
        {resume.summary && (
          <p className="mt-6 max-w-3xl text-sm leading-7 text-slate-200 md:text-lg">
            {resume.summary}
          </p>
        )}
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <MagicButton href="#projects">
            Show my work <ArrowUpRight className="h-4 w-4" />
          </MagicButton>
          {resume.email && (
            <MagicButton href={`mailto:${resume.email}`}>
              Contact me <Mail className="h-4 w-4" />
            </MagicButton>
          )}
        </div>
      </div>
    </section>
  );
}

function BentoCard({ className = '', children }) {
  return (
    <div className={`relative overflow-hidden rounded-3xl border border-white/10 bg-[#10132e] p-6 shadow-2xl ${className}`}>
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_10%,rgba(203,172,249,0.35),transparent_28%),radial-gradient(circle_at_90%_70%,rgba(59,130,246,0.22),transparent_26%)]" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function AboutGrid({ resume, layoutStyle }) {
  const highlightedSkills = resume.skills.slice(0, 8);
  const currentProject = resume.projects[0];
  const isCompact = layoutStyle === 'compact';
  const isGrid = layoutStyle === 'grid';

  return (
    <section id="about" className={isCompact ? 'py-12' : 'py-20'}>
      <div className={`grid grid-cols-1 gap-4 md:grid-cols-6 ${isGrid ? 'lg:grid-cols-6' : 'lg:grid-cols-5'} ${isCompact ? 'lg:gap-4' : 'lg:gap-8'}`}>
        <BentoCard className={`md:col-span-6 ${isGrid ? 'lg:col-span-2' : 'lg:col-span-3'} ${isCompact ? 'min-h-[16rem]' : 'min-h-[24rem]'} flex items-end`}>
          <div>
            <p className="text-sm text-[#c1c2d3]">About</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-bold text-white md:text-4xl">
              {resume.summary || `${resume.name} builds thoughtful digital experiences.`}
            </h2>
          </div>
        </BentoCard>

        <BentoCard className={`md:col-span-3 lg:col-span-2 ${isCompact ? 'min-h-[12rem]' : 'min-h-[16rem]'}`}>
          <p className="text-sm text-[#c1c2d3]">Location</p>
          <div className="mt-6 flex items-center gap-3 text-2xl font-bold text-white">
            <MapPin className="h-7 w-7 text-[var(--portfolio-accent)]" />
            {resume.location || 'Available remotely'}
          </div>
        </BentoCard>

        <BentoCard className={`md:col-span-3 lg:col-span-2 ${isCompact ? 'min-h-[12rem]' : 'min-h-[16rem]'}`}>
          <p className="text-sm text-[#c1c2d3]">I constantly improve</p>
          <h2 className="mt-2 text-3xl font-bold text-white">My tech stack</h2>
          <div className="mt-6 grid grid-cols-2 gap-2">
            {highlightedSkills.length > 0 ? highlightedSkills.map((skill) => (
              <span key={skill} className="rounded-lg bg-[#161a31] px-3 py-2 text-center text-xs text-white/80 md:text-sm">
                {skill}
              </span>
            )) : (
              <span className="col-span-2 text-sm text-white/60">Skills will appear here after resume creation.</span>
            )}
          </div>
        </BentoCard>

        <BentoCard className="md:col-span-3 lg:col-span-2 min-h-[12rem]">
          <p className="text-sm text-[#c1c2d3]">Education</p>
          <h2 className="mt-3 text-2xl font-bold text-white">
            {resume.education[0]?.school || resume.education[0]?.degree}
          </h2>
          {[resume.education[0]?.degree, resume.education[0]?.timeline, resume.education[0]?.result].filter(Boolean).map((detail) => (
            <p key={detail} className="mt-2 text-white/70">{detail}</p>
          ))}
        </BentoCard>

        <BentoCard className={`${isGrid ? 'md:col-span-3 lg:col-span-2' : 'md:col-span-3'} ${isCompact ? 'min-h-[12rem]' : 'min-h-[16rem]'}`}>
          <p className="text-sm text-[#c1c2d3]">The inside scoop</p>
          <h2 className="mt-3 text-3xl font-bold text-white">
            {currentProject ? `Currently showcasing: ${currentProject.title}` : 'Projects will appear as users add them'}
          </h2>
          {currentProject?.description && <p className="mt-4 text-sm leading-6 text-white/70">{currentProject.description}</p>}
        </BentoCard>

        <BentoCard className="md:col-span-3 lg:col-span-2 min-h-[12rem] flex items-center justify-center text-center">
          {resume.email ? (
            <CopyEmail email={resume.email} />
          ) : (
            <p className="text-white/70">Add an email to enable contact actions.</p>
          )}
        </BentoCard>
      </div>
    </section>
  );
}

function CopyEmail({ email }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard?.writeText(email);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div>
      <h2 className="mb-5 text-2xl font-bold text-white">Do you want to start a project together?</h2>
      <MagicButton onClick={copy}>
        {copied ? 'Email copied' : 'Copy email'} {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </MagicButton>
    </div>
  );
}

function Projects({ projects, layout }) {
  if (!projects.length) return null;

  return (
    <section className={layout.section} id="projects">
      <h2 className="text-center text-4xl font-bold text-white md:text-5xl">
        A Small Section of <span className="text-[var(--portfolio-accent)]">Recent Projects</span>
      </h2>
      <div className={`mt-12 grid ${layout.grid} ${layout.gap}`}>
        {projects.map((project, index) => (
          <article key={project.id} className="group rounded-3xl border border-white/10 bg-[#10132e] p-5 shadow-2xl transition hover:-translate-y-1">
            <div className="relative mb-7 flex h-56 items-center justify-center overflow-hidden rounded-3xl bg-[radial-gradient(circle_at_50%_10%,rgba(203,172,249,0.42),transparent_32%),linear-gradient(135deg,#13162d,#06091f)]">
              <span className="text-7xl font-black text-white/10">{String(index + 1).padStart(2, '0')}</span>
            <Sparkles className="absolute right-7 top-7 h-7 w-7 text-[var(--portfolio-accent)]" />
            </div>
            <h3 className="text-2xl font-bold text-white">{project.title}</h3>
            {project.description && <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/70">{project.description}</p>}
            {project.link && (
              <a href={project.link} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--portfolio-accent)]">
                Check live site <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

function ExperienceAndSkills({ resume, layout }) {
  const cards = [
    ...resume.experience.map((item) => ({
      id: `experience-${item.id}`,
      icon: BriefcaseBusiness,
      title: item.title,
      desc: [item.company, formatRange(item), item.description].filter(Boolean).join(' | '),
    })),
    ...resume.education.map((item) => ({
      id: `education-${item.id}`,
      icon: GraduationCap,
      title: item.degree,
      desc: [item.school, item.timeline, item.result].filter(Boolean).join(' | '),
    })),
  ];

  if (!cards.length && !resume.skills.length) return null;

  return (
    <section className={layout.section} id="skills">
      <h2 className="text-center text-4xl font-bold text-white md:text-5xl">
        MY <span className="text-[var(--portfolio-accent)]">Skill Set</span>
      </h2>
      <div className={`mt-12 grid grid-cols-1 ${layout.grid} ${layout.gap}`}>
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.id} className="rounded-2xl border border-white/10 bg-[#10132e] p-px">
              <div className="rounded-2xl bg-[#06091f] p-6 md:p-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#161a31]">
                    <Icon className="h-7 w-7 text-[var(--portfolio-accent)]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white md:text-2xl">{card.title}</h3>
                    {card.desc && <p className="mt-2 text-sm leading-6 text-white/70">{card.desc}</p>}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Footer({ resume }) {
  return (
    <footer id="contact" className="pb-12 pt-16">
      <div className="flex flex-col items-center text-center">
        <h2 className="max-w-3xl text-4xl font-bold text-white md:text-5xl">
          Ready to take <span className="text-[var(--portfolio-accent)]">your</span> digital presence to the next level?
        </h2>
        <p className="my-6 max-w-2xl text-white/70">
          Reach out today and discuss opportunities, collaborations, or the next project.
        </p>
        {resume.email && (
          <MagicButton href={`mailto:${resume.email}`}>
            Let&apos;s get in touch <ArrowUpRight className="h-4 w-4" />
          </MagicButton>
        )}
      </div>
      <div className="mt-14 flex flex-col items-center justify-between gap-5 text-sm text-white/60 md:flex-row">
        <p>{resume.name ? `Copyright © ${new Date().getFullYear()} ${resume.name}` : ''}</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {resume.github && <a className="rounded-lg border border-white/10 bg-[#10132e] px-4 py-2 hover:text-white" href={resume.github} target="_blank" rel="noreferrer">GitHub</a>}
          {resume.linkedin && <a className="rounded-lg border border-white/10 bg-[#10132e] px-4 py-2 hover:text-white" href={resume.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
          {resume.email && <a className="rounded-lg border border-white/10 bg-[#10132e] px-4 py-2 hover:text-white" href={`mailto:${resume.email}`}>Email</a>}
        </div>
      </div>
    </footer>
  );
}

export default function PortfolioThemeSushant() {
  const resumeData = useResumeStore((state) => state.resumeData || state);
  const colorPalette = useUIStore((state) => state.colorPalette);
  const layoutStyle = useUIStore((state) => state.layoutStyle);
  const layout = getPortfolioLayout(layoutStyle);
  const resume = useMemo(() => normalizeResumeForPortfolio(resumeData), [resumeData]);

  if (!hasPortfolioData(resume)) {
    return (
      <div className="min-h-full bg-[#06091f] flex items-center justify-center p-6 text-center text-white/70">
        <p className="text-lg">{EMPTY_PORTFOLIO_MESSAGE}</p>
      </div>
    );
  }

  return (
    <main className="relative mx-auto flex min-h-full flex-col items-center overflow-hidden bg-[#06091f] px-5 text-white sm:px-10" style={portfolioPaletteVars(colorPalette)}>
      <div className={`w-full ${layout.inner}`}>
        <FloatingNav />
        <Hero resume={resume} />
        <AboutGrid resume={resume} layoutStyle={layoutStyle} />
        <Projects projects={resume.projects} layout={layout} />
        <ExperienceAndSkills resume={resume} layout={layout} />
        <Footer resume={resume} />
      </div>
    </main>
  );
}
