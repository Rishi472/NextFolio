import express from 'express';
import multer from 'multer';
import pdf from 'pdf-parse';
import { authMiddleware } from './auth.js';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post('/parse', authMiddleware, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    let extractedText = '';
    
    // Parse PDF
    if (req.file.mimetype === 'application/pdf') {
      const data = await pdf(req.file.buffer);
      extractedText = data.text;
    } else {
      // Fallback for docx or plain text
      extractedText = req.file.buffer.toString('utf8');
    }

    // Call Python AI Parser
    const pythonScriptPath = path.join(__dirname, '../services/ai_parser.py');
    const pythonProcess = spawn('python', ['-u', pythonScriptPath]);
    
    let pythonOutput = '';
    let pythonError = '';

    pythonProcess.stdout.on('data', (data) => {
      pythonOutput += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      pythonError += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error('Python Script Error (stderr):', pythonError);
        console.error('Python Script Output (stdout):', pythonOutput);
        return res.status(500).json({ message: 'Error in Python parsing logic', error: pythonError || pythonOutput });
      }
      try {
        const result = JSON.parse(pythonOutput);
        if (result.error) {
          console.error('Python Parser returned error JSON:', result.error);
          return res.status(500).json({ message: 'Error from Python parser', error: result.error });
        }
        return res.json({ message: 'Parsed and sanitized successfully (via Python)', data: result.data });
      } catch (e) {
        console.error('JSON Parse Error:', e, 'Output was:', pythonOutput);
        return res.status(500).json({ message: 'Error parsing Python output', error: e.message });
      }
    });

    // Send extractedText to stdin
    pythonProcess.stdin.write(extractedText);
    pythonProcess.stdin.end();

  } catch (error) {
    console.error('--- UPLOAD PARSE ERROR ---');
    console.error('Error message:', error.message);
    console.error('Stack trace:', error.stack);
    console.error('--------------------------');
    res.status(500).json({ message: 'Server error during parsing', error: error.message });
  }
});

router.post('/ats-score', authMiddleware, (req, res) => {
  try {
    const resumeData = req.body.resumeData;
    if (!resumeData) return res.status(400).json({ message: 'No resume data provided' });

    const pythonScriptPath = path.join(__dirname, '../services/ats_scorer.py');
    const pythonProcess = spawn('python', ['-u', pythonScriptPath]);
    
    let pythonOutput = '';
    let pythonError = '';

    pythonProcess.stdout.on('data', (data) => {
      pythonOutput += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      pythonError += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error('Python Script Error:', pythonError);
        return res.status(500).json({ message: 'Error in Python ATS scoring logic', error: pythonError });
      }
      try {
        const result = JSON.parse(pythonOutput);
        if (result.error) {
          return res.status(500).json({ message: 'Error from Python ATS scorer', error: result.error });
        }
        return res.json({ message: 'Scored successfully (via Python)', data: result.data });
      } catch (e) {
        console.error('JSON Parse Error:', e, 'Output was:', pythonOutput);
        return res.status(500).json({ message: 'Error parsing Python output', error: e.message });
      }
    });

    pythonProcess.stdin.write(JSON.stringify(resumeData));
    pythonProcess.stdin.end();

  } catch (error) {
    res.status(500).json({ message: 'Server error during scoring', error: error.message });
  }
});

router.post('/optimize', authMiddleware, (req, res) => {
  try {
    const { skills, targetJobDescription } = req.body;
    if (!targetJobDescription) {
      return res.json({ message: 'No job description provided', data: [] });
    }

    const pythonScriptPath = path.join(__dirname, '../services/keyword_optimizer.py');
    const pythonProcess = spawn('python', ['-u', pythonScriptPath]);
    
    let pythonOutput = '';
    let pythonError = '';

    pythonProcess.stdout.on('data', (data) => {
      pythonOutput += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      pythonError += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error('Python Script Error:', pythonError);
        return res.status(500).json({ message: 'Error in Python optimizer logic', error: pythonError });
      }
      try {
        const result = JSON.parse(pythonOutput);
        if (result.error) {
          return res.status(500).json({ message: 'Error from Python optimizer', error: result.error });
        }
        return res.json({ message: 'Optimized successfully (via Python)', data: result.data });
      } catch (e) {
        console.error('JSON Parse Error:', e, 'Output was:', pythonOutput);
        return res.status(500).json({ message: 'Error parsing Python output', error: e.message });
      }
    });

    pythonProcess.stdin.write(JSON.stringify({ skills: skills || [], targetJobDescription }));
    pythonProcess.stdin.end();

  } catch (error) {
    res.status(500).json({ message: 'Server error during optimization', error: error.message });
  }
});

router.post('/optimize-bio', authMiddleware, (req, res) => {
  try {
    const { resumeData } = req.body;
    if (!resumeData) {
      return res.status(400).json({ message: 'No resume data provided' });
    }

    const pythonScriptPath = path.join(__dirname, '../services/bio_optimizer.py');
    const pythonProcess = spawn('python', ['-u', pythonScriptPath]);
    
    let pythonOutput = '';
    let pythonError = '';

    pythonProcess.stdout.on('data', (data) => {
      pythonOutput += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      pythonError += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error('Python Script Error:', pythonError);
        return res.status(500).json({ message: 'Error in Python bio optimizer', error: pythonError });
      }
      try {
        const result = JSON.parse(pythonOutput);
        if (result.error) {
          return res.status(500).json({ message: 'Error from Python optimizer', error: result.error });
        }
        return res.json({ message: 'Bio optimized successfully', data: result.data });
      } catch (e) {
        console.error('JSON Parse Error:', e, 'Output was:', pythonOutput);
        return res.status(500).json({ message: 'Error parsing Python output', error: e.message });
      }
    });

    pythonProcess.stdin.write(JSON.stringify(resumeData));
    pythonProcess.stdin.end();

  } catch (error) {
    res.status(500).json({ message: 'Server error during bio optimization', error: error.message });
  }
});

export default router;
