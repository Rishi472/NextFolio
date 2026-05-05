import { create } from 'zustand';
import { API_URL } from '../lib/api';

const readStoredJson = (key) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

const writeStoredJson = (key, value) => {
  if (value) {
    localStorage.setItem(key, JSON.stringify(value));
  } else {
    localStorage.removeItem(key);
  }
};

const storedToken = localStorage.getItem('nextfolio_token');
const storedUser = readStoredJson('nextfolio_user');
const hasStoredAuth = Boolean(storedToken && storedUser);

if (!hasStoredAuth) {
  localStorage.removeItem('nextfolio_token');
  localStorage.removeItem('nextfolio_user');
}

const emptyResumeData = {
  personal: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    summary: '',
    profileImage: '',
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  achievements: [],
  certifications: [],
};

/**
 * Normalize a single project into the standard schema.
 * Handles legacy formats (plain string descriptions, flat link fields) and
 * auto-converts long paragraph descriptions into bullet points.
 */
const normalizeProject = (proj) => {
  if (!proj || typeof proj !== 'object') return null;

  const title = (proj.title || proj.name || '').trim();
  const date = (proj.date || proj.timeline || '').trim();
  const type = (proj.type || '').trim();
  const demoLink = (proj.demoLink || proj.demo || proj.link || '').trim();
  const githubLink = (proj.githubLink || proj.github || '').trim();

  // Technologies: accept array or comma-separated string
  let technologies = [];
  if (Array.isArray(proj.technologies)) {
    technologies = proj.technologies.map((t) => (typeof t === 'string' ? t.trim() : '')).filter(Boolean);
  } else if (typeof proj.technologies === 'string' && proj.technologies.trim()) {
    technologies = proj.technologies.split(',').map((t) => t.trim()).filter(Boolean);
  }

  // Bullet points: accept array or auto-split from description
  let bulletPoints = [];
  if (Array.isArray(proj.bulletPoints)) {
    bulletPoints = proj.bulletPoints.map((b) => (typeof b === 'string' ? b.trim() : '')).filter(Boolean);
  }

  let description = (proj.description || proj.summary || '').trim();

  // Auto-convert long descriptions into bullet points if none exist
  if (bulletPoints.length === 0 && description) {
    // Check if description contains bullet-like markers
    const bulletRegex = /(?:^|\n)\s*[-*•]\s*/;
    if (bulletRegex.test(description)) {
      const parts = description.split(/\n\s*[-*•]\s*/).map((s) => s.trim()).filter(Boolean);
      // First part before any bullet may be the actual description
      if (parts.length > 1) {
        const firstPart = parts[0];
        // If first part looks like a sentence (short, no verb-start), keep as description
        if (firstPart.length < 120 && !firstPart.startsWith('-')) {
          description = firstPart;
          bulletPoints = parts.slice(1);
        } else {
          description = '';
          bulletPoints = parts;
        }
      }
    } else if (description.length > 150) {
      // Split long paragraph into sentences as bullet points
      const sentences = description.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 10);
      if (sentences.length > 1) {
        description = '';
        bulletPoints = sentences.map((s) => s.replace(/^\s*[-*•]\s*/, '').trim());
      }
    }
  }

  return { title, date, type, technologies, description, bulletPoints, demoLink, githubLink };
};

const normalizeParsedResume = (parsed = {}, current = emptyResumeData) => {
  const personal = parsed.personal || parsed.personalInfo || {};

  const rawProjects = Array.isArray(parsed.projects) ? parsed.projects : [];
  const normalizedProjects = rawProjects.map(normalizeProject).filter(Boolean);

  return {
    ...current,
    personal: {
      ...current.personal,
      ...personal,
      fullName: personal.fullName || personal.name || current.personal.fullName || '',
    },
    experience: Array.isArray(parsed.experience) ? parsed.experience : [],
    education: Array.isArray(parsed.education) ? parsed.education : [],
    skills: Array.isArray(parsed.skills)
      ? parsed.skills.map((skill) => (typeof skill === 'string' ? skill : skill.name)).filter(Boolean)
      : [],
    projects: normalizedProjects,
    achievements: Array.isArray(parsed.achievements) ? parsed.achievements : [],
    certifications: Array.isArray(parsed.certifications) ? parsed.certifications : [],
  };
};

export const useResumeStore = create((set, get) => ({
  token: hasStoredAuth ? storedToken : null,
  user: hasStoredAuth ? storedUser : null,
  isSaving: false,
  parseResumeError: '',
  targetJobDescription: '',
  missingKeywords: [],
  setTargetJobDescription: (desc) => set({ targetJobDescription: desc }),
  setToken: (token) => {
    if (token) localStorage.setItem('nextfolio_token', token);
    else localStorage.removeItem('nextfolio_token');
    set({ token });
  },
  setUser: (user) => {
    writeStoredJson('nextfolio_user', user);
    set({ user });
  },
  setAuth: ({ token, user }) => {
    if (token) localStorage.setItem('nextfolio_token', token);
    else localStorage.removeItem('nextfolio_token');
    writeStoredJson('nextfolio_user', user);
    set({ token: token || null, user: user || null });
  },
  logout: () => {
    localStorage.removeItem('nextfolio_token');
    localStorage.removeItem('nextfolio_user');
    set({ token: null, user: null });
  },
  
  resumeData: emptyResumeData,

  setResumeData: (data) => set({ resumeData: data }),
  
  updatePersonal: (personal) => set((state) => ({ resumeData: { ...state.resumeData, personal } })),
  addExperience: (experience) => set((state) => ({ resumeData: { ...state.resumeData, experience: [...state.resumeData.experience, experience] } })),
  updateExperience: (index, experience) => set((state) => {
    const newExperience = [...state.resumeData.experience];
    newExperience[index] = experience;
    return { resumeData: { ...state.resumeData, experience: newExperience } };
  }),
  removeExperience: (index) => set((state) => ({ resumeData: { ...state.resumeData, experience: state.resumeData.experience.filter((_, i) => i !== index) } })),
  addEducation: (education) => set((state) => ({ resumeData: { ...state.resumeData, education: [...state.resumeData.education, education] } })),
  updateEducation: (index, education) => set((state) => {
    const newEducation = [...state.resumeData.education];
    newEducation[index] = education;
    return { resumeData: { ...state.resumeData, education: newEducation } };
  }),
  removeEducation: (index) => set((state) => ({ resumeData: { ...state.resumeData, education: state.resumeData.education.filter((_, i) => i !== index) } })),
  addSkill: (skill) => set((state) => ({ resumeData: { ...state.resumeData, skills: [...state.resumeData.skills, skill] } })),
  removeSkill: (index) => set((state) => ({ resumeData: { ...state.resumeData, skills: state.resumeData.skills.filter((_, i) => i !== index) } })),
  addProject: (project) => set((state) => ({ resumeData: { ...state.resumeData, projects: [...state.resumeData.projects, project] } })),
  updateProject: (index, project) => set((state) => {
    const newProjects = [...state.resumeData.projects];
    newProjects[index] = project;
    return { resumeData: { ...state.resumeData, projects: newProjects } };
  }),
  removeProject: (index) => set((state) => ({ resumeData: { ...state.resumeData, projects: state.resumeData.projects.filter((_, i) => i !== index) } })),
  addAchievement: (achievement) => set((state) => ({ resumeData: { ...state.resumeData, achievements: [...state.resumeData.achievements, achievement] } })),
  updateAchievement: (index, achievement) => set((state) => {
    const newAchievements = [...state.resumeData.achievements];
    newAchievements[index] = achievement;
    return { resumeData: { ...state.resumeData, achievements: newAchievements } };
  }),
  removeAchievement: (index) => set((state) => ({ resumeData: { ...state.resumeData, achievements: state.resumeData.achievements.filter((_, i) => i !== index) } })),
  addCertification: (certification) => set((state) => ({ resumeData: { ...state.resumeData, certifications: [...state.resumeData.certifications, certification] } })),
  updateCertification: (index, certification) => set((state) => {
    const newCertifications = [...state.resumeData.certifications];
    newCertifications[index] = certification;
    return { resumeData: { ...state.resumeData, certifications: newCertifications } };
  }),
  removeCertification: (index) => set((state) => ({ resumeData: { ...state.resumeData, certifications: state.resumeData.certifications.filter((_, i) => i !== index) } })),

  // API Integration: Parse Resume
  parseResume: async (file) => {
    const { token, user, targetJobDescription } = get();
    set({ parseResumeError: '' });

    if (!token || !user) {
      set({ parseResumeError: 'Log in or sign up before uploading a resume.' });
      return false;
    }
    
    const formData = new FormData();
    formData.append('resume', file);
    
    try {
      const res = await fetch(`${API_URL}/ai/parse`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      const result = await res.json().catch(() => ({}));
      
      if (!res.ok) {
        const message = result.error || result.message || `Parse API error: ${res.status} ${res.statusText}`;
        console.error(message);
        set({ parseResumeError: message });
        return false;
      }

      console.log('Parse result:', result);
      
      if (result.error) {
        console.error('Parse error from server:', result.error);
        set({ parseResumeError: result.error });
        return false;
      }
      
      if (result.data) {
        // Hydrate state
        const parsed = result.data;
        const newResumeData = normalizeParsedResume(parsed, get().resumeData);
        console.log('Updated resume data:', newResumeData);
        set({ resumeData: newResumeData });
        
        // ML Keyword Optimization
        if (targetJobDescription) {
          try {
            const optRes = await fetch(`${API_URL}/ai/optimize`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify({ skills: newResumeData.skills, targetJobDescription })
            });
            if (optRes.ok) {
              const optData = await optRes.json();
              set({ missingKeywords: optData.data || [] });
            }
          } catch (e) {
            console.error('Failed to optimize keywords', e);
            set({ missingKeywords: [] });
          }
        } else {
          set({ missingKeywords: [] });
        }
        
        return true;
      } else {
        console.error('No data in parse result:', result);
        set({ parseResumeError: result.message || 'No resume data was returned by the parser.' });
        return false;
      }
    } catch (error) {
      console.error("Parse error", error);
      set({ parseResumeError: error.message || 'Failed to parse resume.' });
      return false;
    }
  },

  optimizeBio: async () => {
    let { token, user, resumeData, updatePersonal } = get();
    if (!token || !user) return false;
    
    try {
      const res = await fetch(`${API_URL}/ai/optimize-bio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ resumeData })
      });
      if (res.ok) {
        const result = await res.json();
        if (result.data) {
          updatePersonal({ ...resumeData.personal, summary: result.data });
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Optimize bio error", error);
      return false;
    }
  },

  // API Integration: Save to DB
  saveToDatabase: async () => {
    let { token, user, resumeData } = get();
    if (!token || !user) return;
    
    set({ isSaving: true });
    try {
      // Save personal info
      await fetch(`${API_URL}/resume/personal`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(resumeData.personal)
      });
      // We would also save experience, education, etc. recursively here in a real app
      // For brevity, we just simulate the API success
      setTimeout(() => set({ isSaving: false }), 500);
    } catch (e) {
      set({ isSaving: false });
      console.error("Save error", e);
    }
  }
}));

export const useUIStore = create((set) => ({
  activeTab: 'personal',
  sidebarOpen: true,
  theme: 'default',
  colorPalette: 'blue',
  layoutStyle: 'default',
  showATSModal: false,
  showAuthModal: false,
  showPublishModal: false,
  previewMode: 'resume',
  setActiveTab: (activeTab) => set({ activeTab }),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  setTheme: (theme) => set({ theme }),
  setColorPalette: (colorPalette) => set({ colorPalette }),
  setLayoutStyle: (layoutStyle) => set({ layoutStyle }),
  setShowATSModal: (showATSModal) => set({ showATSModal }),
  setShowAuthModal: (showAuthModal) => set({ showAuthModal }),
  setShowPublishModal: (showPublishModal) => set({ showPublishModal }),
  setPreviewMode: (previewMode) => set({ previewMode }),
}));
