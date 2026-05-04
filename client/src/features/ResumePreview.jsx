import { useResumeStore } from '../store';
import Badge from '../components/Badge';
import { educationDisplay } from '../utils/education';

export default function ResumePreview() {
  const { resumeData } = useResumeStore();
  const hasResumeData = Boolean(
    resumeData.personal.fullName ||
      resumeData.personal.email ||
      resumeData.personal.phone ||
      resumeData.personal.location ||
      resumeData.personal.summary ||
      resumeData.experience.length ||
      resumeData.education.length ||
      resumeData.skills.length ||
      resumeData.projects.length
  );

  return (
    <div className="space-y-6 p-6 bg-white rounded-2xl shadow-soft-lg">
      {!hasResumeData && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">Please create your resume first to view portfolio</p>
        </div>
      )}

      {/* Header */}
      {hasResumeData && <div className="text-center border-b-2 border-indigo-200 pb-6">
        <h1 className="text-4xl font-bold gradient-text mb-2">
          {resumeData.personal.fullName}
        </h1>
        <div className="flex justify-center gap-4 flex-wrap text-sm text-gray-600">
          {resumeData.personal.email && (
            <span>{resumeData.personal.email}</span>
          )}
          {resumeData.personal.phone && (
            <span>•</span>
          )}
          {resumeData.personal.phone && (
            <span>{resumeData.personal.phone}</span>
          )}
          {resumeData.personal.location && (
            <span>•</span>
          )}
          {resumeData.personal.location && (
            <span>{resumeData.personal.location}</span>
          )}
        </div>
      </div>}

      {/* Summary */}
      {resumeData.personal.summary && (
        <div>
          <h2 className="text-lg font-bold text-indigo-600 mb-2 uppercase tracking-wide">
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {resumeData.personal.summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {resumeData.experience.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-indigo-600 mb-3 uppercase tracking-wide">
            Work Experience
          </h2>
          <div className="space-y-4">
            {resumeData.experience.map((exp, idx) => (
              <div key={idx} className="border-l-4 border-indigo-600 pl-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{exp.jobTitle}</h3>
                    <p className="text-indigo-600 font-semibold">{exp.company}</p>
                  </div>
                  <p className="text-sm text-gray-500">
                    {exp.startDate} – {exp.endDate}
                  </p>
                </div>
                <p className="text-gray-700 mt-2 text-sm leading-relaxed">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {resumeData.education.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-indigo-600 mb-3 uppercase tracking-wide">
            Education
          </h2>
          <div className="space-y-3">
            {resumeData.education.map((edu, idx) => {
              const education = educationDisplay(edu);
              return education.title && (
                <div key={idx} className="border-l-4 border-purple-600 pl-4">
                  <h3 className="font-bold text-slate-900">{education.title}</h3>
                  {[education.degree, education.timeline, education.result].filter(Boolean).map((detail) => (
                    <p key={detail} className="text-sm text-gray-500">{detail}</p>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Skills */}
      {resumeData.skills.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-indigo-600 mb-3 uppercase tracking-wide">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.map((skill, idx) => (
              <Badge key={idx} variant="primary">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Projects - ATS-friendly structured layout */}
      {resumeData.projects.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-indigo-600 mb-3 uppercase tracking-wide">
            Projects
          </h2>
          <div className="space-y-4">
            {resumeData.projects.map((proj, idx) => (
              <div key={idx} className="border-l-4 border-purple-600 pl-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-slate-900">{proj.title}</h3>
                  {proj.date && (
                    <span className="text-sm text-gray-500 whitespace-nowrap ml-4">{proj.date}</span>
                  )}
                </div>
                {proj.type && (
                  <p className="text-sm text-purple-600 font-medium">{proj.type}</p>
                )}
                {proj.technologies && proj.technologies.length > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-semibold">Technologies:</span> {proj.technologies.join(', ')}
                  </p>
                )}
                {proj.description && (
                  <p className="text-gray-700 text-sm mt-1 leading-relaxed">{proj.description}</p>
                )}
                {proj.bulletPoints && proj.bulletPoints.length > 0 && (
                  <ul className="mt-1.5 space-y-0.5">
                    {proj.bulletPoints.map((bp, i) => (
                      <li key={i} className="text-gray-700 text-sm flex gap-2">
                        <span className="text-purple-400 shrink-0">•</span>
                        <span>{bp}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
