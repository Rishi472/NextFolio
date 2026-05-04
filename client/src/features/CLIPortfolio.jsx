import { useEffect, useMemo, useRef, useState } from 'react';
import { useResumeStore } from '../store';
import { educationDisplay } from '../utils/education';

const EMPTY_RESUME_MESSAGE = 'Please create your resume first to view portfolio';

const COMMANDS = [
  ['show_resume', 'Display resume summary, experience, education, and projects'],
  ['show_projects', 'Display projects from your resume data'],
  ['show_skills', 'Display skills from your resume data'],
  ['show_contact', 'Display contact details from your resume data'],
  ['ask_aryan <question>', 'Answer from your resume data only'],
  ['clear', 'Clear terminal output'],
];

function valueOrBlank(value) {
  return typeof value === 'string' ? value.trim() : value || '';
}

function listFrom(value) {
  if (!Array.isArray(value)) return [];
  return value.filter((item) => {
    if (typeof item === 'string') return item.trim();
    return item && Object.values(item).some((entry) => valueOrBlank(entry));
  });
}

function normalizeResumeData(source = {}) {
  const personal = source.personal || {};

  return {
    name: valueOrBlank(source.name || personal.fullName || personal.name),
    email: valueOrBlank(source.email || personal.email),
    phone: valueOrBlank(source.phone || personal.phone),
    location: valueOrBlank(source.location || personal.location),
    summary: valueOrBlank(source.summary || personal.summary),
    skills: listFrom(source.skills)
      .map((skill) => (typeof skill === 'string' ? skill.trim() : valueOrBlank(skill.name || skill.label || skill.title)))
      .filter(Boolean),
    projects: listFrom(source.projects),
    experience: listFrom(source.experience),
    education: listFrom(source.education),
  };
}

function hasResumeData(data) {
  return Boolean(
    data.name ||
      data.email ||
      data.phone ||
      data.location ||
      data.summary ||
      data.skills.length ||
      data.projects.length ||
      data.experience.length ||
      data.education.length
  );
}

function line(label, value) {
  return value ? `${label}: ${value}` : '';
}

function formatDateRange(item) {
  const start = valueOrBlank(item.startDate || item.start || item.from);
  const end = valueOrBlank(item.endDate || item.end || item.to);
  const duration = valueOrBlank(item.duration || item.dates || item.date);

  if (duration) return duration;
  if (start && end) return `${start} - ${end}`;
  return start || end;
}

function formatExperience(item, index) {
  const role = valueOrBlank(item.jobTitle || item.title || item.role || item.position);
  const company = valueOrBlank(item.company || item.organization || item.employer);
  const dates = formatDateRange(item);
  const description = valueOrBlank(item.description || item.summary);
  const heading = [role || `Experience ${index + 1}`, company && `at ${company}`].filter(Boolean).join(' ');

  return [`${index + 1}. ${heading}`, dates && `   ${dates}`, description && `   ${description}`]
    .filter(Boolean)
    .join('\n');
}

function formatEducation(item, index) {
  const education = educationDisplay(item);
  if (!education.title) return '';

  return [`${index + 1}. ${education.title}`, ...[education.degree, education.timeline, education.result].filter(Boolean).map((detail) => `   ${detail}`)]
    .filter(Boolean)
    .join('\n');
}

function formatProject(item, index) {
  const title = valueOrBlank(item.title || item.name);
  const description = valueOrBlank(item.description || item.summary);
  const date = valueOrBlank(item.date || item.timeline);
  const type = valueOrBlank(item.type);
  const demoLink = valueOrBlank(item.demoLink || item.demo || item.link || item.url);
  const githubLink = valueOrBlank(item.githubLink || item.github);

  // Technologies
  let techStr = '';
  if (Array.isArray(item.technologies) && item.technologies.length > 0) {
    techStr = item.technologies.join(', ');
  }

  // Bullet points
  const bullets = Array.isArray(item.bulletPoints) ? item.bulletPoints.filter(Boolean) : [];

  const lines = [
    `${index + 1}. ${title || `Project ${index + 1}`}${type ? ` (${type})` : ''}`,
    date && `   ${date}`,
    techStr && `   Technologies: ${techStr}`,
    description && `   ${description}`,
    ...bullets.map((bp) => `   - ${bp}`),
    demoLink && `   Demo: ${demoLink}`,
    githubLink && `   GitHub: ${githubLink}`,
  ];

  return lines.filter(Boolean).join('\n');
}

function buildResumeOutput(data) {
  return [
    data.name && `# ${data.name}`,
    data.summary && `\nSUMMARY\n${data.summary}`,
    data.experience.length &&
      `\nEXPERIENCE\n${data.experience.map(formatExperience).join('\n\n')}`,
    data.education.length && `\nEDUCATION\n${data.education.map(formatEducation).join('\n\n')}`,
    data.projects.length && `\nPROJECTS\n${data.projects.map(formatProject).join('\n\n')}`,
    data.skills.length && `\nSKILLS\n${data.skills.map((skill) => (typeof skill === 'string' ? skill : skill.name)).filter(Boolean).join(', ')}`,
  ]
    .filter(Boolean)
    .join('\n');
}

function answerFromResume(question, data) {
  const q = question.toLowerCase();

  if (!question.trim()) {
    return 'Ask a question after the command. Example: ask_aryan skills';
  }

  if (q.includes('skill') || q.includes('technology') || q.includes('stack')) {
    return data.skills.length ? `Skills: ${data.skills.join(', ')}` : 'No skills have been added yet.';
  }

  if (q.includes('project')) {
    return data.projects.length ? data.projects.map(formatProject).join('\n\n') : 'No projects have been added yet.';
  }

  if (q.includes('experience') || q.includes('work') || q.includes('job')) {
    return data.experience.length ? data.experience.map(formatExperience).join('\n\n') : 'No experience has been added yet.';
  }

  if (q.includes('education') || q.includes('school') || q.includes('degree')) {
    return data.education.length ? data.education.map(formatEducation).join('\n\n') : 'No education has been added yet.';
  }

  if (q.includes('contact') || q.includes('email') || q.includes('phone')) {
    return [line('Name', data.name), line('Email', data.email), line('Phone', data.phone), line('Location', data.location)]
      .filter(Boolean)
      .join('\n');
  }

  if (q.includes('summary') || q.includes('about') || q.includes('bio')) {
    return data.summary || 'No summary has been added yet.';
  }

  return buildResumeOutput(data) || EMPTY_RESUME_MESSAGE;
}

export default function CLIPortfolio() {
  const resumeData = useResumeStore((state) => state.resumeData || state);
  const normalizedResume = useMemo(() => normalizeResumeData(resumeData), [resumeData]);
  const hasData = hasResumeData(normalizedResume);
  const [history, setHistory] = useState([
    { type: 'system', content: 'NextFolio CLI portfolio' },
    { type: 'system', content: 'Type "help" to see available commands.' },
  ]);
  const [input, setInput] = useState('');
  const terminalEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [history]);

  const pushEntries = (...entries) => {
    setHistory((current) => [...current, ...entries]);
  };

  const runCommand = (rawCommand) => {
    const command = rawCommand.trim();
    const normalizedCommand = command.toLowerCase();
    const [baseCommand, ...args] = normalizedCommand.split(/\s+/);
    const question = command.split(/\s+/).slice(1).join(' ');

    if (!command) return;

    if (baseCommand === 'clear') {
      setHistory([]);
      return;
    }

    const nextEntries = [{ type: 'user', content: `$ ${command}` }];

    if (baseCommand === 'help' || baseCommand === 'hint') {
      nextEntries.push({
        type: 'system',
        content: ['Available commands:', ...COMMANDS.map(([name, description]) => `  ${name.padEnd(22)} ${description}`)].join('\n'),
      });
      pushEntries(...nextEntries);
      return;
    }

    if (!hasData) {
      nextEntries.push({ type: 'error', content: EMPTY_RESUME_MESSAGE });
      pushEntries(...nextEntries);
      return;
    }

    switch (baseCommand) {
      case 'show_resume':
        nextEntries.push({ type: 'data', content: buildResumeOutput(normalizedResume) });
        break;
      case 'show_projects':
        nextEntries.push({
          type: 'data',
          content: normalizedResume.projects.length
            ? `PROJECTS\n${normalizedResume.projects.map(formatProject).join('\n\n')}`
            : 'No projects have been added yet.',
        });
        break;
      case 'show_skills':
        nextEntries.push({
          type: 'data',
          content: normalizedResume.skills.length
            ? `SKILLS\n${normalizedResume.skills.join('\n')}`
            : 'No skills have been added yet.',
        });
        break;
      case 'show_contact':
        nextEntries.push({
          type: 'data',
          content: [
            'CONTACT',
            line('Name', normalizedResume.name),
            line('Email', normalizedResume.email),
            line('Phone', normalizedResume.phone),
            line('Location', normalizedResume.location),
          ]
            .filter(Boolean)
            .join('\n'),
        });
        break;
      case 'ask_aryan':
      case 'ask_ai':
        nextEntries.push({ type: 'data', content: answerFromResume(args.length ? question : '', normalizedResume) });
        break;
      default:
        nextEntries.push({
          type: 'error',
          content: `Command not found: ${command}. Type "help" for available commands.`,
        });
    }

    pushEntries(...nextEntries);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    runCommand(input);
    setInput('');
  };

  return (
    <div
      className="h-full w-full bg-black text-emerald-400 font-mono text-sm flex flex-col"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex-1 overflow-y-auto p-5 space-y-2">
        {history.map((entry, index) => (
          <pre
            key={`${entry.type}-${index}`}
            className={`whitespace-pre-wrap break-words leading-relaxed ${
              entry.type === 'user'
                ? 'text-cyan-300'
                : entry.type === 'error'
                  ? 'text-red-400'
                  : entry.type === 'system'
                    ? 'text-slate-400'
                    : 'text-emerald-400'
            }`}
          >
            {entry.content}
          </pre>
        ))}
        <div ref={terminalEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-emerald-500/20 px-5 py-4">
        <span className="text-cyan-300">$</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-white outline-none border-none font-mono"
          autoFocus
          autoComplete="off"
          spellCheck="false"
          aria-label="CLI command"
        />
      </form>
    </div>
  );
}
