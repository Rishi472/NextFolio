import { Plus, Trash2, Upload, Bot, AlertCircle, Pencil, ExternalLink, Code, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useResumeStore, useUIStore } from '../store';
import Button from '../components/Button';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import Card from '../components/Card';
import Badge from '../components/Badge';

export default function ResumeBuilder() {
  const {
    resumeData,
    updatePersonal,
    addExperience,
    removeExperience,
    addEducation,
    removeEducation,
    addSkill,
    removeSkill,
    addProject,
    removeProject,
    addAchievement,
    removeAchievement,
    addCertification,
    removeCertification,
    parseResume,
    saveToDatabase,
    isSaving,
    targetJobDescription,
    setTargetJobDescription,
    missingKeywords
  } = useResumeStore();

  const activeTab = useUIStore((state) => state.activeTab);
  const [isParsing, setIsParsing] = useState(false);
  const [isOptimizingBio, setIsOptimizingBio] = useState(false);
  const fileInputRef = useRef(null);

  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showAchievementForm, setShowAchievementForm] = useState(false);
  const [showCertificationForm, setShowCertificationForm] = useState(false);
  const [parseError, setParseError] = useState('');
  const hasResumeContent = Boolean(
    resumeData.personal.fullName ||
      resumeData.personal.email ||
      resumeData.personal.phone ||
      resumeData.personal.summary ||
      resumeData.experience.length ||
      resumeData.education.length ||
      resumeData.skills.length ||
      resumeData.projects.length ||
      resumeData.achievements.length ||
      resumeData.certifications.length
  );

  // Debounced auto-save
  useEffect(() => {
    const timer = setTimeout(() => {
      saveToDatabase();
    }, 2000);
    return () => clearTimeout(timer);
  }, [resumeData, saveToDatabase]);

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    updatePersonal({
      ...resumeData.personal,
      [name]: value,
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsParsing(true);
    setParseError('');
    const success = await parseResume(file);
    if (!success) {
      setParseError(useResumeStore.getState().parseResumeError || 'Failed to parse resume. Please check the file format and try again.');
    }
    setIsParsing(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* AI Upload Button - Prominently displayed */}
      <Card glassy className="p-4 border-2 border-indigo-200 border-dashed bg-indigo-50/50 flex flex-col items-center justify-center text-center relative overflow-hidden">
        {isSaving && <div className="absolute top-2 right-2 text-xs text-indigo-500 animate-pulse">Saving...</div>}
        <Bot className="w-8 h-8 text-indigo-600 mb-2" />
        <h3 className="font-bold text-brand-dark">Upload Your Resume</h3>
        <p className="text-sm text-gray-600 mb-4">Let our AI parse your data and auto-fill the forms.</p>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept=".pdf,.docx"
          onChange={handleFileChange}
        />
        
        <Button onClick={handleUploadButtonClick} disabled={isParsing} className="w-full flex justify-center items-center gap-2">
          {isParsing ? (
            <div className="flex space-x-1 items-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse-soft"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-pulse-soft animation-delay-200"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-pulse-soft animation-delay-400"></div>
              <span className="ml-2">Processing with AI...</span>
            </div>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              {hasResumeContent ? 'Replace Resume' : 'Upload Your Resume'}
            </>
          )}
        </Button>
        {parseError && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md flex gap-2 text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{parseError}</span>
          </div>
        )}
      </Card>

      <div className="flex-1 overflow-y-auto pr-2 pb-8">
        {/* Personal Section */}
        {activeTab === 'personal' && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-xl font-bold gradient-text">Personal Information</h3>
            <div className="space-y-4">
              <Input label="Full Name" name="fullName" value={resumeData.personal.fullName || ''} onChange={handlePersonalChange} placeholder="John Doe" />
              <Input label="Email" name="email" type="email" value={resumeData.personal.email || ''} onChange={handlePersonalChange} placeholder="john@example.com" />
              <Input label="Phone" name="phone" value={resumeData.personal.phone || ''} onChange={handlePersonalChange} placeholder="+1 (555) 123-4567" />
              <Input label="Location" name="location" value={resumeData.personal.location || ''} onChange={handlePersonalChange} placeholder="New York, NY" />
              <Input label="LinkedIn Profile" name="linkedin" value={resumeData.personal.linkedin || ''} onChange={handlePersonalChange} placeholder="linkedin.com/in/username" />
              <Input label="GitHub Profile" name="github" value={resumeData.personal.github || ''} onChange={handlePersonalChange} placeholder="github.com/username" />
            </div>
          </div>
        )}

        {/* Bio Section */}
        {activeTab === 'bio' && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold gradient-text">Professional Bio</h3>
                <Button 
                  size="sm" 
                  onClick={async () => {
                    setIsOptimizingBio(true);
                    await useResumeStore.getState().optimizeBio();
                    setIsOptimizingBio(false);
                  }} 
                  disabled={isOptimizingBio}
                  variant="primary"
                  className="flex items-center gap-2"
                >
                  <Bot className="w-4 h-4" /> {isOptimizingBio ? 'Optimizing...' : 'Optimize with AI'}
                </Button>
              </div>
              <Textarea
                label="Professional Summary"
                name="summary"
                value={resumeData.personal.summary || ''}
                onChange={handlePersonalChange}
                placeholder="Write a brief summary about yourself..."
                maxLength={600}
                showCount
                className="h-48"
              />
            </div>
          </div>
        )}

        {/* Skills Section */}
        {activeTab === 'skills' && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold gradient-text">Technical Skills</h3>
                <Button size="sm" onClick={() => setShowSkillForm(!showSkillForm)} variant="primary">
                  <Plus className="w-4 h-4" /> Add
                </Button>
              </div>

              {/* Target JD for Optimization */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <label className="text-sm font-semibold text-gray-700 mb-1 block">Target Job Description (Optional)</label>
                <textarea 
                  className="w-full text-sm p-2 border border-gray-200 rounded-md focus:ring-1 focus:ring-indigo-500"
                  rows="2"
                  placeholder="Paste JD here to identify missing keywords..."
                  value={targetJobDescription}
                  onChange={(e) => setTargetJobDescription(e.target.value)}
                />
              </div>

              {missingKeywords.length > 0 && (
                <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                  <h4 className="text-sm font-bold text-amber-800 flex items-center gap-1 mb-2">
                    <AlertCircle className="w-4 h-4" /> Missing Keywords detected!
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {missingKeywords.map(kw => (
                      <span key={kw} className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">{kw}</span>
                    ))}
                  </div>
                </div>
              )}

              {showSkillForm && (
                <SkillForm
                  onSubmit={(data) => {
                    addSkill(data.skill);
                    setShowSkillForm(false);
                  }}
                  onCancel={() => setShowSkillForm(false)}
                />
              )}

              <div className="flex flex-wrap gap-2">
                {resumeData.skills.map((skill, idx) => (
                  <Badge key={idx} variant="primary" closable onClose={() => removeSkill(idx)}>
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Experience Section */}
        {activeTab === 'experience' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold gradient-text">Work Experience</h3>
              <Button size="sm" onClick={() => setShowExperienceForm(!showExperienceForm)} variant="primary">
                <Plus className="w-4 h-4" /> Add
              </Button>
            </div>

            {showExperienceForm && (
              <Card className="p-4 bg-primary-50 space-y-3 border-2 border-primary-300">
                <ExperienceForm
                  onSubmit={(data) => {
                    addExperience(data);
                    setShowExperienceForm(false);
                  }}
                />
                <Button variant="ghost" onClick={() => setShowExperienceForm(false)}>
                  Cancel
                </Button>
              </Card>
            )}

            <div className="space-y-3">
              {resumeData.experience.map((exp, idx) => (
                <Card key={idx} className="p-4 border-l-4 border-primary-600">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-bold text-brand-dark">{exp.jobTitle}</h4>
                      <p className="text-sm text-gray-600">{exp.company}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {exp.startDate} - {exp.endDate}
                      </p>
                      <p className="text-sm text-brand-dark mt-2">{exp.description}</p>
                    </div>
                    <button onClick={() => removeExperience(idx)} className="text-red-500 hover:text-red-700 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Education Section */}
        {activeTab === 'education' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold gradient-text">Education</h3>
              <Button size="sm" onClick={() => setShowEducationForm(!showEducationForm)} variant="primary">
                <Plus className="w-4 h-4" /> Add
              </Button>
            </div>

            {showEducationForm && (
              <Card className="p-4 bg-primary-50 space-y-3 border-2 border-primary-300">
                <EducationForm
                  onSubmit={(data) => {
                    addEducation(data);
                    setShowEducationForm(false);
                  }}
                />
                <Button variant="ghost" onClick={() => setShowEducationForm(false)}>
                  Cancel
                </Button>
              </Card>
            )}

            <div className="space-y-3">
              {resumeData.education.map((edu, idx) => (
                <Card key={idx} className="p-4 border-l-4 border-secondary-600">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-brand-dark">{edu.degree}</h4>
                      <p className="text-sm text-gray-600">{edu.school}</p>
                      <p className="text-xs text-gray-500">{edu.graduationDate}</p>
                      {(edu.gpa || edu.percentage || edu.result) && (
                        <p className="text-xs text-gray-500">{edu.gpa || edu.percentage || edu.result}</p>
                      )}
                    </div>
                    <button onClick={() => removeEducation(idx)} className="text-red-500 hover:text-red-700 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Projects Section */}
        {activeTab === 'projects' && (
          <ProjectsSection
            projects={resumeData.projects}
            addProject={addProject}
            updateProject={useResumeStore.getState().updateProject}
            removeProject={removeProject}
          />
        )}

        {/* Achievements Section */}
        {activeTab === 'achievements' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold gradient-text">Achievements</h3>
              <Button size="sm" onClick={() => setShowAchievementForm(!showAchievementForm)} variant="primary">
                <Plus className="w-4 h-4" /> Add
              </Button>
            </div>

            {showAchievementForm && (
              <Card className="p-4 bg-primary-50 space-y-3 border-2 border-primary-300">
                <AchievementForm
                  onSubmit={(data) => {
                    addAchievement(data);
                    setShowAchievementForm(false);
                  }}
                />
                <Button variant="ghost" onClick={() => setShowAchievementForm(false)}>
                  Cancel
                </Button>
              </Card>
            )}

            <div className="space-y-3">
              {resumeData.achievements.map((achieve, idx) => (
                <Card key={idx} className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-bold text-brand-dark">{achieve.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{achieve.description}</p>
                      {achieve.date && <p className="text-xs text-gray-500 mt-1">{achieve.date}</p>}
                    </div>
                    <button onClick={() => removeAchievement(idx)} className="text-red-500 hover:text-red-700 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Certifications Section */}
        {activeTab === 'certifications' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold gradient-text">Certifications</h3>
              <Button size="sm" onClick={() => setShowCertificationForm(!showCertificationForm)} variant="primary">
                <Plus className="w-4 h-4" /> Add
              </Button>
            </div>

            {showCertificationForm && (
              <Card className="p-4 bg-primary-50 space-y-3 border-2 border-primary-300">
                <CertificationForm
                  onSubmit={(data) => {
                    addCertification(data);
                    setShowCertificationForm(false);
                  }}
                />
                <Button variant="ghost" onClick={() => setShowCertificationForm(false)}>
                  Cancel
                </Button>
              </Card>
            )}

            <div className="space-y-3">
              {resumeData.certifications.map((cert, idx) => (
                <Card key={idx} className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-bold text-brand-dark">{cert.name}</h4>
                      {cert.issuer && <p className="text-sm text-gray-600 mt-1">{cert.issuer}</p>}
                      {cert.date && <p className="text-xs text-gray-500 mt-1">{cert.date}</p>}
                    </div>
                    <button onClick={() => removeCertification(idx)} className="text-red-500 hover:text-red-700 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ExperienceForm({ onSubmit }) {
  const { register, handleSubmit, reset } = useForm();
  return (
    <form onSubmit={handleSubmit((data) => { onSubmit(data); reset(); })} className="space-y-3">
      <Input label="Job Title" {...register('jobTitle')} placeholder="Software Engineer" />
      <Input label="Company" {...register('company')} placeholder="Acme Corp" />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Start Date" {...register('startDate')} type="date" />
        <Input label="End Date" {...register('endDate')} type="date" />
      </div>
      <Textarea label="Description" {...register('description')} placeholder="Describe your responsibilities..." />
      <Button variant="primary" type="submit" className="w-full">Save Experience</Button>
    </form>
  );
}

function EducationForm({ onSubmit }) {
  const { register, handleSubmit, reset } = useForm();
  return (
    <form onSubmit={handleSubmit((data) => { onSubmit(data); reset(); })} className="space-y-3">
      <Input label="Degree" {...register('degree')} placeholder="Bachelor of Science" />
      <Input label="School" {...register('school')} placeholder="University Name" />
      <Input label="Timeline" {...register('graduationDate')} placeholder="2021 - 2025" />
      <Input label="GPA / Percentage (Optional)" {...register('result')} placeholder="8.7 CGPA or 82%" />
      <Button variant="primary" type="submit" className="w-full">Save Education</Button>
    </form>
  );
}

function SkillForm({ onSubmit, onCancel }) {
  const { register, handleSubmit, reset } = useForm();
  return (
    <form onSubmit={handleSubmit((data) => { onSubmit(data); reset(); })} className="space-y-3 p-4 bg-white rounded-lg border-2 border-primary-300">
      <Input label="Skill" {...register('skill')} placeholder="e.g., React, Python, Design" />
      <div className="flex gap-2">
        <Button variant="primary" type="submit" size="sm" className="flex-1">Add Skill</Button>
        <Button variant="ghost" type="button" size="sm" className="flex-1" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

function ProjectsSection({ projects, addProject, updateProject, removeProject }) {
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const handleAdd = (data) => {
    addProject(data);
    setShowForm(false);
  };

  const handleEdit = (idx) => {
    setEditIndex(idx);
    setShowForm(true);
  };

  const handleUpdate = (data) => {
    updateProject(editIndex, data);
    setEditIndex(null);
    setShowForm(false);
  };

  const handleCancel = () => {
    setEditIndex(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold gradient-text">Projects</h3>
        <Button size="sm" onClick={() => { setEditIndex(null); setShowForm(!showForm); }} variant="primary">
          <Plus className="w-4 h-4" /> Add Project
        </Button>
      </div>

      {showForm && (
        <Card className="p-5 bg-indigo-50/60 space-y-3 border-2 border-indigo-300">
          <h4 className="font-bold text-brand-dark text-lg">{editIndex !== null ? 'Edit Project' : 'New Project'}</h4>
          <ProjectForm
            defaultValues={editIndex !== null ? projects[editIndex] : undefined}
            onSubmit={editIndex !== null ? handleUpdate : handleAdd}
          />
          <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
        </Card>
      )}

      <div className="space-y-3">
        {projects.map((proj, idx) => (
          <Card key={idx} className="p-4 border-l-4 border-indigo-500">
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-brand-dark text-base">{proj.title || 'Untitled Project'}</h4>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  {proj.date && <span className="text-xs text-gray-500">{proj.date}</span>}
                  {proj.type && (
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">{proj.type}</span>
                  )}
                </div>

                {proj.technologies && proj.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {proj.technologies.map((tech, i) => (
                      <span key={i} className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">{tech}</span>
                    ))}
                  </div>
                )}

                {proj.description && <p className="text-sm text-gray-600 mt-2 leading-relaxed">{proj.description}</p>}

                {proj.bulletPoints && proj.bulletPoints.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {proj.bulletPoints.map((bp, i) => (
                      <li key={i} className="text-sm text-gray-600 flex gap-2">
                        <span className="text-indigo-400 mt-0.5 shrink-0">•</span>
                        <span>{bp}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="flex gap-3 mt-2">
                  {proj.demoLink && (
                    <a href={proj.demoLink} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" /> Demo
                    </a>
                  )}
                  {proj.githubLink && (
                    <a href={proj.githubLink} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-600 hover:underline flex items-center gap-1">
                      <Code className="w-3 h-3" /> GitHub
                    </a>
                  )}
                </div>
              </div>

              <div className="flex gap-1.5 shrink-0">
                <button onClick={() => handleEdit(idx)} className="p-1.5 text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => removeProject(idx)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ProjectForm({ onSubmit, defaultValues }) {
  const { register, handleSubmit, reset, setValue, watch } = useForm({ defaultValues: defaultValues || {} });
  const [techInput, setTechInput] = useState('');
  const [bulletInput, setBulletInput] = useState('');
  const technologies = watch('technologies') || [];
  const bulletPoints = watch('bulletPoints') || [];

  useEffect(() => {
    if (defaultValues) {
      Object.entries(defaultValues).forEach(([key, val]) => setValue(key, val));
    }
  }, [defaultValues, setValue]);

  const addTech = () => {
    const t = techInput.trim();
    if (t && !technologies.includes(t)) {
      setValue('technologies', [...technologies, t]);
      setTechInput('');
    }
  };

  const removeTech = (i) => setValue('technologies', technologies.filter((_, idx) => idx !== i));

  const addBullet = () => {
    const b = bulletInput.trim();
    if (b) {
      setValue('bulletPoints', [...bulletPoints, b]);
      setBulletInput('');
    }
  };

  const removeBullet = (i) => setValue('bulletPoints', bulletPoints.filter((_, idx) => idx !== i));

  return (
    <form onSubmit={handleSubmit((data) => { onSubmit(data); reset(); setTechInput(''); setBulletInput(''); })} className="space-y-3">
      <Input label="Project Title" {...register('title')} placeholder="My Awesome Project" />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Timeline / Date" {...register('date')} placeholder="Jan 2023 - Present" />
        <Input label="Project Type" {...register('type')} placeholder="Web App, Mobile, ML..." />
      </div>

      {/* Technologies */}
      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">Technologies</label>
        <div className="flex gap-2">
          <input
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }}
            className="flex-1 px-3 py-2 rounded-lg border-2 border-indigo-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-30 transition-all text-sm placeholder-gray-400"
            placeholder="e.g. React, Node.js..."
          />
          <button type="button" onClick={addTech} className="px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-semibold hover:bg-indigo-200 transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        {technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {technologies.map((tech, i) => (
              <span key={i} className="inline-flex items-center gap-1 text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-medium">
                {tech}
                <button type="button" onClick={() => removeTech(i)} className="hover:text-red-500"><X className="w-3 h-3" /></button>
              </span>
            ))}
          </div>
        )}
      </div>

      <Textarea label="Short Description" {...register('description')} placeholder="A brief overview of the project..." />

      {/* Bullet Points */}
      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">Key Highlights / Bullet Points</label>
        <div className="flex gap-2">
          <input
            value={bulletInput}
            onChange={(e) => setBulletInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addBullet(); } }}
            className="flex-1 px-3 py-2 rounded-lg border-2 border-indigo-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-30 transition-all text-sm placeholder-gray-400"
            placeholder="Built a real-time chat system..."
          />
          <button type="button" onClick={addBullet} className="px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-semibold hover:bg-indigo-200 transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        {bulletPoints.length > 0 && (
          <ul className="mt-2 space-y-1.5">
            {bulletPoints.map((bp, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700 bg-gray-50 px-3 py-1.5 rounded-lg">
                <span className="text-indigo-400 mt-0.5">•</span>
                <span className="flex-1">{bp}</span>
                <button type="button" onClick={() => removeBullet(i)} className="text-red-400 hover:text-red-600 shrink-0"><X className="w-3.5 h-3.5" /></button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input label="Demo Link" {...register('demoLink')} type="url" placeholder="https://demo.example.com" />
        <Input label="GitHub Link" {...register('githubLink')} type="url" placeholder="https://github.com/..." />
      </div>

      <Button variant="primary" type="submit" className="w-full">{defaultValues ? 'Update Project' : 'Save Project'}</Button>
    </form>
  );
}

function AchievementForm({ onSubmit }) {
  const { register, handleSubmit, reset } = useForm();
  return (
    <form onSubmit={handleSubmit((data) => { onSubmit(data); reset(); })} className="space-y-3">
      <Input label="Achievement Title" {...register('title')} placeholder="Employee of the Year" />
      <Input label="Date" {...register('date')} placeholder="2023" />
      <Textarea label="Description" {...register('description')} placeholder="Awarded for outstanding performance..." />
      <Button variant="primary" type="submit" className="w-full">Save Achievement</Button>
    </form>
  );
}

function CertificationForm({ onSubmit }) {
  const { register, handleSubmit, reset } = useForm();
  return (
    <form onSubmit={handleSubmit((data) => { onSubmit(data); reset(); })} className="space-y-3">
      <Input label="Certification Name" {...register('name')} placeholder="AWS Certified Solutions Architect" />
      <Input label="Issuer" {...register('issuer')} placeholder="Amazon Web Services" />
      <Input label="Date" {...register('date')} placeholder="Aug 2024" />
      <Button variant="primary" type="submit" className="w-full">Save Certification</Button>
    </form>
  );
}
