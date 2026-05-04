const clean = (value) => (typeof value === 'string' ? value.trim() : '');

const DEGREE_PREFIXES = [
  ['sr. sec.', 'Senior Secondary'],
  ['sr sec', 'Senior Secondary'],
  ['senior secondary', 'Senior Secondary'],
  ['higher secondary', 'Higher Secondary'],
  ['intermediate', 'Intermediate'],
  ['secondary', 'Secondary'],
  ['matriculation', 'Matriculation'],
  ['high school', 'High School'],
  ['class xii', 'Class XII'],
  ['class 12', 'Class XII'],
  ['class x', 'Class X'],
  ['class 10', 'Class X'],
];

function tidyJoinedSchool(value) {
  return clean(value).replace(/\b(University|College|Institute|School|Academy)([A-Z][a-z])/g, '$1 $2');
}

function extractTimeline(value) {
  return clean(value).match(/((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s+)?(?:19|20)\d{2}\s*(?:-|to)\s*(?:((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s+)?(?:19|20)\d{2}|Present|Current)/i)?.[0] ||
    clean(value).match(/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s+(?:19|20)\d{2}/i)?.[0] ||
    clean(value).match(/\b(?:19|20)\d{2}\b/)?.[0] ||
    '';
}

function stripTimelineAndResult(value) {
  return clean(value)
    .replace(/((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s+)?(?:19|20)\d{2}\s*(?:-|to)\s*(?:((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s+)?(?:19|20)\d{2}|Present|Current)/ig, '')
    .replace(/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s+(?:19|20)\d{2}/ig, '')
    .replace(/\b(CGPA|GPA)\s*[:-]?\s*\d+(?:\.\d+)?(?:\s*\/\s*\d+(?:\.\d+)?)?/ig, '')
    .replace(/\b\d+(?:\.\d+)?\s*(?:%|percent|percentage)\b/ig, '')
    .replace(/\s+/g, ' ')
    .replace(/^[-,|\s]+|[-,|\s]+$/g, '');
}

function splitDegreeFromSchool(school, degree) {
  let normalizedSchool = tidyJoinedSchool(school);
  let normalizedDegree = stripTimelineAndResult(degree);

  if (!normalizedDegree && normalizedSchool) {
    const compactSchool = normalizedSchool.toLowerCase().replace(/\s+/g, ' ');
    const match = DEGREE_PREFIXES.find(([prefix]) => compactSchool.startsWith(prefix));

    if (match) {
      const [prefix, label] = match;
      normalizedDegree = label;
      normalizedSchool = normalizedSchool.slice(prefix.length).replace(/^[\s,.-]+/, '');
    }
  }

  if (!normalizedDegree && /\bSchool\b/i.test(normalizedSchool)) {
    normalizedDegree = 'Secondary';
  }

  return { school: normalizedSchool, degree: normalizedDegree };
}

export function normalizeEducationItem(item = {}) {
  const parsed = splitDegreeFromSchool(
    item.school || item.institution || item.university || item.college || item.institute,
    item.degree || item.qualification || item.program || item.course
  );
  const timeline = clean(
    item.timeline ||
      item.duration ||
      item.graduationDate ||
      item.date ||
      item.year ||
      extractTimeline(item.degree || item.qualification || item.program || item.course) ||
      [item.startDate || item.start || item.from, item.endDate || item.end || item.to].filter(Boolean).join(' - ')
  );
  const result = clean(item.result || item.gpa || item.cgpa || item.percentage || item.percent || item.grade || item.score);

  return {
    school: parsed.school,
    degree: parsed.degree,
    timeline,
    result,
    hasDisplayData: Boolean(parsed.school || parsed.degree || timeline || result),
  };
}

export function educationTitle(item = {}) {
  const education = normalizeEducationItem(item);
  return education.school || education.degree;
}

export function educationDetails(item = {}) {
  const education = normalizeEducationItem(item);
  return [education.degree, education.timeline, education.result].filter(Boolean);
}

export function educationDisplay(item = {}) {
  const education = normalizeEducationItem(item);
  return {
    title: education.school || education.degree,
    degree: education.school ? education.degree : '',
    timeline: education.timeline,
    result: education.result,
    hasDisplayData: education.hasDisplayData,
  };
}
