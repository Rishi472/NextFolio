import { ArrowLeft, Bot, FileText, Globe2, Palette, ShieldCheck, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/NextFolioLogo.png';

const FEATURES = [
  {
    title: 'Resume Builder',
    description: 'Create structured resume sections for personal info, bio, skills, education, experience, projects, achievements, and certifications.',
    Icon: FileText,
  },
  {
    title: 'AI Assistance',
    description: 'Use smart resume parsing and guided suggestions to fill details faster while keeping the final content editable.',
    Icon: Bot,
  },
  {
    title: 'Portfolio Themes',
    description: 'Turn resume data into polished portfolio layouts, including the Modern theme and CLI-style portfolio preview.',
    Icon: Palette,
  },
  {
    title: 'ATS Resume',
    description: 'Generate an ATS-friendly resume and review improvement suggestions before exporting.',
    Icon: ShieldCheck,
  },
  {
    title: 'Publish Portfolio',
    description: 'Create a shareable portfolio link from the information already added in the builder.',
    Icon: Globe2,
  },
  {
    title: 'Live Preview',
    description: 'See resume and portfolio changes immediately while editing, so the final result stays easy to refine.',
    Icon: Sparkles,
  },
];

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-gradient-subtle text-slate-900">
      <header className="border-b border-indigo-100 bg-white/80 px-6 py-4 shadow-soft-sm backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-indigo-50 hover:text-indigo-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Builder
          </button>
          <div className="group relative" tabIndex={0} aria-label="NextFolio logo">
            <img
              src={logo}
              alt="Nextfolio"
              className="h-12 w-44 rounded-xl bg-white object-cover p-1 shadow-sm"
            />
            <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 px-3 py-2 text-xs font-bold uppercase tracking-wide text-white opacity-0 shadow-xl shadow-indigo-500/30 ring-1 ring-white/40 transition-opacity duration-200 group-hover:opacity-100 group-focus:opacity-100">
              BUILD TODAY. IMPRESS TOMORROW.
            </span>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-indigo-600">About NextFolio</p>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight text-slate-950 md:text-6xl">
            Build your resume and portfolio from one focused workspace.
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            NextFolio helps students and professionals turn their resume details into an ATS-friendly resume, a live portfolio preview, and a publishable web profile without rewriting the same information again and again.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {FEATURES.map(({ title, description, Icon }) => (
            <article key={title} className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-soft-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25">
                <Icon className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-xl font-bold text-slate-950">{title}</h2>
              <p className="mt-3 leading-7 text-slate-600">{description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
