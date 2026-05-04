import { normalizeEducationItem } from '../../utils/education';

export const EMPTY_PORTFOLIO_MESSAGE = 'Please create your resume first to view portfolio';

const clean = (value) => (typeof value === 'string' ? value.trim() : '');

const list = (value) => (Array.isArray(value) ? value.filter(Boolean) : []);

export function normalizeResumeForPortfolio(resumeData = {}) {
  const personal = resumeData.personal || {};
  const name = clean(resumeData.name) || clean(personal.fullName) || clean(personal.name);
  const email = clean(resumeData.email) || clean(personal.email);
  const phone = clean(resumeData.phone) || clean(personal.phone);
  const location = clean(resumeData.location) || clean(personal.location);
  const summary = clean(resumeData.summary) || clean(personal.summary);

  return {
    name,
    email,
    phone,
    location,
    summary,
    linkedin: clean(personal.linkedin || resumeData.linkedin),
    github: clean(personal.github || resumeData.github),
    skills: list(resumeData.skills).map((skill) => (typeof skill === 'string' ? skill : clean(skill.name))).filter(Boolean),
    projects: list(resumeData.projects).map((project, index) => ({
      id: project.id || index + 1,
      title: clean(project.title || project.name) || `Project ${index + 1}`,
      description: clean(project.description || project.summary),
      link: clean(project.link || project.demoLink || project.githubLink || project.url),
      date: clean(project.date || project.timeline),
    })),
    experience: list(resumeData.experience).map((item, index) => ({
      id: item.id || index + 1,
      title: clean(item.jobTitle || item.title || item.role || item.position) || `Experience ${index + 1}`,
      company: clean(item.company || item.organization || item.employer),
      description: clean(item.description || item.summary),
      startDate: clean(item.startDate || item.start || item.from),
      endDate: clean(item.endDate || item.end || item.to),
    })),
    education: list(resumeData.education)
      .map((item, index) => ({
        id: item.id || index + 1,
        ...normalizeEducationItem(item),
      }))
      .filter((item) => item.hasDisplayData),
  };
}

export function hasPortfolioData(resume) {
  return Boolean(
    resume.name ||
      resume.email ||
      resume.phone ||
      resume.location ||
      resume.summary ||
      resume.skills.length ||
      resume.projects.length ||
      resume.experience.length ||
      resume.education.length
  );
}

export function formatRange(item) {
  if (item.startDate && item.endDate) return `${item.startDate} - ${item.endDate}`;
  return item.startDate || item.endDate || '';
}
