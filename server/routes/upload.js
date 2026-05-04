import express from 'express';
import multer from 'multer';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { User, PersonalInfo, Experience, Education, Project, Skill } from '../models/index.js';
import { authMiddleware } from './auth.js';
import pdfParse from 'pdf-parse';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype === 'text/plain') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF or text resume files are allowed'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Parse resume from PDF
router.post('/parse-resume', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const resumeText = req.file.mimetype === 'application/pdf'
      ? (await pdfParse(req.file.buffer)).text
      : req.file.buffer.toString('utf8');

    if (!resumeText.trim()) {
      return res.status(422).json({ message: 'No readable text found in uploaded resume' });
    }

    // Call Python parser to extract structured data
    const pythonProcess = spawn('python', ['-u', path.join(__dirname, '../services/ai_parser.py')]);
    
    let output = '';
    let error = '';

    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      error += data.toString();
    });

    pythonProcess.stdin.write(resumeText);
    pythonProcess.stdin.end();

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error('Python error:', error);
        return res.status(500).json({ message: 'Error parsing resume', error });
      }

      try {
        const parsedData = JSON.parse(output);
        if (parsedData.error) {
          return res.status(500).json({ message: 'Error from Python parser', error: parsedData.error });
        }
        res.json({
          success: true,
          data: parsedData.data,
          message: 'Resume parsed successfully'
        });
      } catch (parseError) {
        res.status(500).json({ message: 'Error parsing resume output', error: parseError.message });
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Save parsed resume data to database
router.post('/save-resume-data', authMiddleware, async (req, res) => {
  try {
    const { personalInfo, experience, education, skills, projects } = req.body;
    const userId = req.user.id;

    // Save personal info
    if (personalInfo) {
      const [info] = await PersonalInfo.findOrCreate({
        where: { UserId: userId },
        defaults: { UserId: userId, ...personalInfo }
      });
      if (info) {
        await info.update(personalInfo);
      }
    }

    // Clear and save experiences
    if (experience && Array.isArray(experience)) {
      await Experience.destroy({ where: { UserId: userId } });
      for (const exp of experience) {
        await Experience.create({ UserId: userId, ...exp });
      }
    }

    // Clear and save education
    if (education && Array.isArray(education)) {
      await Education.destroy({ where: { UserId: userId } });
      for (const edu of education) {
        await Education.create({ UserId: userId, ...edu });
      }
    }

    // Clear and save skills
    if (skills && Array.isArray(skills)) {
      await Skill.destroy({ where: { UserId: userId } });
      for (const skill of skills) {
        await Skill.create({ UserId: userId, ...skill });
      }
    }

    // Clear and save projects
    if (projects && Array.isArray(projects)) {
      await Project.destroy({ where: { UserId: userId } });
      for (const project of projects) {
        await Project.create({ UserId: userId, ...project });
      }
    }

    res.json({
      success: true,
      message: 'Resume data saved successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get parsed resume structure
router.get('/resume-status', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [PersonalInfo, Experience, Education, Project, Skill]
    });

    const hasData = {
      personalInfo: !!user.PersonalInfo,
      experience: user.Experiences && user.Experiences.length > 0,
      education: user.Educations && user.Educations.length > 0,
      skills: user.Skills && user.Skills.length > 0,
      projects: user.Projects && user.Projects.length > 0
    };

    res.json({ hasData, complete: Object.values(hasData).filter(v => v).length });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
