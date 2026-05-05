import { ExternalLink, Mail, ArrowRight, Phone, Code } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useResumeStore, useUIStore } from '../store';
import Button from '../components/Button';
import { portfolioPaletteVars } from './themes/paletteTokens';
import { getPortfolioLayout } from './themes/layoutTokens';
import { educationDisplay } from '../utils/education';

function findScrollParent(element) {
  let current = element?.parentElement;

  while (current) {
    const { overflowY } = window.getComputedStyle(current);
    if (/(auto|scroll)/.test(overflowY) && current.scrollHeight > current.clientHeight) {
      return current;
    }
    current = current.parentElement;
  }

  return null;
}

function scrollToHash(hash, root = document) {
  if (typeof document === 'undefined' || !hash?.startsWith('#')) return false;

  const target = root?.querySelector?.(hash) || document.getElementById(hash.slice(1));
  if (!target) return false;

  const scrollParent = findScrollParent(target);
  if (scrollParent) {
    const parentTop = scrollParent.getBoundingClientRect().top;
    const targetTop = target.getBoundingClientRect().top;
    scrollParent.scrollTo({
      top: scrollParent.scrollTop + targetTop - parentTop - 24,
      behavior: 'smooth',
    });
  } else {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  if (typeof window !== 'undefined') {
    window.history.replaceState(null, '', hash);
  }

  return true;
}

function profileUrl(value, baseUrl) {
  const profile = typeof value === 'string' ? value.trim() : '';
  if (!profile) return '';
  if (/^https?:\/\//i.test(profile)) return profile;
  if (profile.includes('.')) return `https://${profile}`;
  return `${baseUrl}${profile.replace(/^@/, '')}`;
}

function phoneHref(phone) {
  const dialable = typeof phone === 'string' ? phone.replace(/[^\d+]/g, '') : '';
  return dialable ? `tel:${dialable}` : '';
}

export default function PortfolioPreview() {
  const portfolioRef = useRef(null);
  const { resumeData } = useResumeStore();
  const colorPalette = useUIStore((state) => state.colorPalette);
  const layoutStyle = useUIStore((state) => state.layoutStyle);
  const layout = getPortfolioLayout(layoutStyle);
  const emailHref = resumeData.personal.email ? `mailto:${resumeData.personal.email}` : '#contact';
  const contactOptions = [
    resumeData.personal.phone && {
      href: phoneHref(resumeData.personal.phone),
      Icon: Phone,
      label: 'Mobile',
      value: resumeData.personal.phone,
    },
    resumeData.personal.github && {
      href: profileUrl(resumeData.personal.github, 'https://github.com/'),
      Icon: Code,
      label: 'GitHub',
      value: resumeData.personal.github,
      external: true,
    },
    resumeData.personal.linkedin && {
      href: profileUrl(resumeData.personal.linkedin, 'https://www.linkedin.com/in/'),
      Icon: ExternalLink,
      label: 'LinkedIn',
      value: resumeData.personal.linkedin,
      external: true,
    },
  ].filter((option) => option && option.href);
  const scrollToProjects = (event) => {
    event.preventDefault();
    scrollToHash('#projects', portfolioRef.current);
  };
  const hasResumeData = Boolean(
    resumeData.personal.fullName ||
      resumeData.personal.email ||
      resumeData.personal.phone ||
      resumeData.personal.summary ||
      resumeData.experience.length ||
      resumeData.education.length ||
      resumeData.skills.length ||
      resumeData.projects.length
  );

  useEffect(() => {
    if (typeof window === 'undefined' || !window.location.hash) return undefined;

    const frame = window.requestAnimationFrame(() => {
      scrollToHash(window.location.hash, portfolioRef.current);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [resumeData]);

  if (!hasResumeData) {
    return (
      <div className="min-h-full bg-brand-bg flex items-center justify-center p-6 text-center text-gray-500">
        <p className="text-lg">Please create your resume first to view portfolio</p>
      </div>
    );
  }

  return (
    <div ref={portfolioRef} className="min-h-screen bg-brand-bg overflow-hidden" style={portfolioPaletteVars(colorPalette)}>
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[linear-gradient(135deg,var(--portfolio-primary)_0%,var(--portfolio-accent)_50%,var(--portfolio-secondary)_100%)]">
        {/* Animated background blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float bg-[var(--portfolio-accent)]"></div>
        <div className="absolute top-40 right-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-2000 bg-[var(--portfolio-secondary)]"></div>
        
        <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            {resumeData.personal.fullName}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed max-w-2xl mx-auto">
            {resumeData.personal.summary}
          </p>
          
          <div className="flex justify-center gap-4 flex-wrap mb-12">
            <a href="#projects" onClick={scrollToProjects} className="no-underline">
              <Button variant="secondary" size="lg">
                View My Work <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
            <a href={emailHref} className="no-underline">
              <Button variant="ghost" size="lg" className="border-white text-white hover:bg-white/10">
                Get in Touch
              </Button>
            </a>
          </div>

          {/* Contact Info */}
          <div className="flex justify-center gap-6 flex-wrap">
            {resumeData.personal.email && (
              <a href={`mailto:${resumeData.personal.email}`} className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
                <span className="text-sm">{resumeData.personal.email}</span>
              </a>
            )}
            {resumeData.personal.phone && (
              <a href={`tel:${resumeData.personal.phone}`} className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                <Phone className="w-5 h-5" />
                <span className="text-sm">{resumeData.personal.phone}</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Experience Section */}
      {resumeData.experience.length > 0 && (
        <section className={`${layout.section} px-6 bg-white`}>
          <div className={`${layout.inner} mx-auto`}>
            <h2 className="text-4xl font-bold gradient-text mb-12">Experience</h2>
            <div className={`grid ${layout.grid} ${layout.gap}`}>
              {resumeData.experience.map((exp, idx) => (
                <div key={idx} className={`glass ${layout.cardPadding} hover:shadow-glass transition-all duration-300 hover:scale-105`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{exp.jobTitle}</h3>
                      <p className="text-[var(--portfolio-text)] font-semibold">{exp.company}</p>
                    </div>
                    <span className="text-xs bg-[var(--portfolio-soft)] text-[var(--portfolio-text)] px-3 py-1 rounded-full font-semibold">
                      {exp.startDate}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Skills Section */}
      {resumeData.skills.length > 0 && (
        <section className={`${layout.section} px-6 bg-[var(--portfolio-soft)]`}>
          <div className={`${layout.inner} mx-auto`}>
            <h2 className="text-4xl font-bold gradient-text mb-12">Skills & Expertise</h2>
            <div className={`grid grid-cols-2 ${layoutStyle === 'compact' ? 'md:grid-cols-4 lg:grid-cols-5' : 'md:grid-cols-3 lg:grid-cols-4'} ${layout.gap}`}>
              {resumeData.skills.map((skill, idx) => (
                <div
                  key={idx}
                  className={`glass ${layoutStyle === 'compact' ? 'p-3' : 'p-4'} text-center hover:shadow-glass transition-all duration-300 group cursor-pointer`}
                >
                  <p className="font-semibold text-slate-900 group-hover:gradient-text transition-all">
                    {skill}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects Section - Modern Cards */}
      {resumeData.projects.length > 0 && (
        <section id="projects" className={`${layout.section} px-6 bg-white`}>
          <div className={`${layout.inner} mx-auto`}>
            <h2 className="text-4xl font-bold gradient-text mb-12">Featured Projects</h2>
            <div className={`grid ${layout.grid} ${layout.gap}`}>
              {resumeData.projects.map((proj, idx) => (
                <div 
                  key={idx} 
                  className="group glass hover:shadow-glass transition-all duration-300 hover:scale-[1.02] overflow-hidden rounded-2xl flex flex-col cursor-pointer"
                  onClick={() => {
                    if (proj.githubLink) {
                      window.open(proj.githubLink, '_blank');
                    } else if (proj.demoLink) {
                      window.open(proj.demoLink, '_blank');
                    }
                  }}
                >
                  {/* Card header with gradient */}
                  <div className="relative bg-[linear-gradient(135deg,var(--portfolio-primary)_0%,var(--portfolio-accent)_100%)] p-6 pb-8">
                    <h3 className="text-xl font-bold text-white mb-1">{proj.title}</h3>
                    {proj.date && (
                      <span className="text-sm text-white/70">{proj.date}</span>
                    )}
                    {proj.type && (
                      <span className="ml-2 text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">{proj.type}</span>
                    )}
                  </div>

                  {/* Card body */}
                  <div className="p-6 pt-4 flex-1 flex flex-col">
                    {/* Tech stack badges */}
                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3 -mt-1">
                        {proj.technologies.map((tech, i) => (
                          <span key={i} className="text-xs bg-[var(--portfolio-soft)] text-[var(--portfolio-text)] px-2.5 py-1 rounded-full font-medium">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Description */}
                    {proj.description && (
                      <p className="text-gray-600 text-sm leading-relaxed mb-3">{proj.description}</p>
                    )}

                    {/* Bullet points */}
                    {proj.bulletPoints && proj.bulletPoints.length > 0 && (
                      <ul className="space-y-1 mb-4 flex-1">
                        {proj.bulletPoints.slice(0, 3).map((bp, i) => (
                          <li key={i} className="text-gray-600 text-sm flex gap-2">
                            <span className="text-[var(--portfolio-text)] shrink-0 mt-0.5">▸</span>
                            <span className="line-clamp-2">{bp}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-3 mt-auto pt-3 border-t border-gray-100">
                      {proj.demoLink && (
                        <a
                          href={proj.demoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--portfolio-text)] hover:opacity-80 transition-opacity"
                        >
                          <ExternalLink className="w-4 h-4" /> Live Demo
                        </a>
                      )}
                      {proj.githubLink && (
                        <a
                          href={proj.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-slate-900 transition-colors"
                        >
                          <Code className="w-4 h-4" /> Source
                        </a>
                      )}
                      {!proj.demoLink && !proj.githubLink && (
                        <span className="text-sm text-gray-400 italic">No links available</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Education Section */}
      {resumeData.education.length > 0 && (
        <section className={`${layout.section} px-6 bg-gradient-subtle`}>
          <div className={`${layout.inner} mx-auto`}>
            <h2 className="text-4xl font-bold gradient-text mb-12">Education</h2>
            <div className="space-y-4">
              {resumeData.education.map((edu, idx) => {
                const education = educationDisplay(edu);
                return education.title && (
                  <div key={idx} className={`glass ${layout.cardPadding} border-l-4 border-[var(--portfolio-secondary)]`}>
                    <h3 className="text-lg font-bold text-slate-900">{education.title}</h3>
                    {[education.degree, education.timeline, education.result].filter(Boolean).map((detail, detailIndex) => (
                      <p
                        key={detail}
                        className={detailIndex === 0 ? 'text-[var(--portfolio-secondary)] font-semibold' : 'text-gray-500 text-sm mt-1'}
                      >
                        {detail}
                      </p>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Achievements Section */}
      {resumeData.achievements && resumeData.achievements.length > 0 && (
        <section className={`${layout.section} px-6 bg-white`}>
          <div className={`${layout.inner} mx-auto`}>
            <h2 className="text-4xl font-bold gradient-text mb-12">Achievements & Awards</h2>
            <div className={`grid ${layout.grid} ${layout.gap}`}>
              {resumeData.achievements.map((achieve, idx) => (
                <div key={idx} className={`glass ${layout.cardPadding} hover:shadow-glass transition-all duration-300`}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-slate-900">{achieve.title}</h3>
                    {achieve.date && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-semibold">
                        {achieve.date}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{achieve.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Certifications Section */}
      {resumeData.certifications && resumeData.certifications.length > 0 && (
        <section className={`${layout.section} px-6 bg-[var(--portfolio-soft)]`}>
          <div className={`${layout.inner} mx-auto`}>
            <h2 className="text-4xl font-bold gradient-text mb-12">Certifications</h2>
            <div className={`grid ${layout.grid} ${layout.gap}`}>
              {resumeData.certifications.map((cert, idx) => (
                <div key={idx} className={`glass ${layout.cardPadding} border-t-4 border-emerald-500 hover:shadow-glass transition-all duration-300`}>
                  <h3 className="text-lg font-bold text-slate-900">{cert.name}</h3>
                  <p className="text-emerald-600 font-semibold mt-1">{cert.issuer}</p>
                  {cert.date && <p className="text-gray-500 text-sm mt-2">{cert.date}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section id="contact" className="py-24 px-6 bg-[linear-gradient(135deg,var(--portfolio-primary)_0%,var(--portfolio-secondary)_100%)] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
          <h2 className="text-5xl font-bold mb-6">Let's work together</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            I'm always interested in hearing about new projects and opportunities.
          </p>
          <a href={emailHref} className="inline-flex no-underline">
            <Button variant="secondary" size="lg">
              <Mail className="w-5 h-5 mr-2" />
              Get in Touch
            </Button>
          </a>
          {contactOptions.length > 0 && (
            <div className="mt-8 grid grid-cols-1 gap-3 text-left sm:grid-cols-3">
              {contactOptions.map(({ external, href, Icon, label, value }) => (
                <a
                  key={label}
                  href={href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white no-underline backdrop-blur transition hover:bg-white/20"
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="min-w-0">
                    <span className="block text-xs uppercase tracking-wide text-white/70">{label}</span>
                    <span className="block truncate text-sm font-semibold">{value}</span>
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-slate-900 text-white text-center">
        <p className="text-sm text-white/70">
          © {new Date().getFullYear()} {resumeData.personal.fullName}. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
