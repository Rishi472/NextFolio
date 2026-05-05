import express from 'express';
import puppeteer from 'puppeteer';
import { User, PersonalInfo, Experience, Education, Project, Skill } from '../models/index.js';
import { authMiddleware } from './auth.js';

const router = express.Router();

const cleanText = (value) => (typeof value === 'string' ? value.trim() : '');

const withHttps = (value, baseUrl = '') => {
  const text = cleanText(value);
  if (!text) return '';
  if (/^https?:\/\//i.test(text)) return text;
  if (text.includes('.')) return `https://${text}`;
  return `${baseUrl}${text.replace(/^@/, '')}`;
};

const displayUrl = (value) => cleanText(value).replace(/^https?:\/\/(www\.)?/i, '');

const phoneHref = (phone) => {
  const dialable = cleanText(phone).replace(/[^\d+]/g, '');
  return dialable ? `tel:${dialable}` : '';
};

const contactLink = (label, value, href) => {
  if (!value || !href) return '';
  return `<a href="${href}" title="${label}">${value}</a>`;
};

// Helper to format text with newlines or bullet points into an HTML list
const formatBullets = (text) => {
  if (!text) return '';
  let lines = [];
  // Some parsers mash text but keep the bullet character
  if (text.includes('•')) {
    lines = text.split('•').map(l => l.trim()).filter(l => l.length > 0);
  } else {
    lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  }
  
  if (lines.length === 0) return '';
  return `<ul class="resume-list">${lines.map(line => `<li><span class="bullet-text">${line.replace(/^[•-]\s*/, '')}</span></li>`).join('')}</ul>`;
};

// Helper to clean up squashed text if title is missing
const sanitizeProject = (proj) => {
  let { title = '', description = '', link = '', date = '' } = proj;
  const bulletDescription = Array.isArray(proj.bulletPoints)
    ? proj.bulletPoints.map(cleanText).filter(Boolean).join('\n')
    : '';

  description = cleanText(description || proj.summary) || bulletDescription;
  link = cleanText(link || proj.demoLink || proj.githubLink || proj.github || proj.url);
  date = cleanText(date || proj.timeline);

  if (!title && description) {
    // Attempt to parse out title and date from squashed string
    const match = description.match(/^(.*?)(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{4}(.*)$/i);
    if (match) {
      title = match[1].trim();
      date = match[2] + description.substring(match[1].length + match[2].length, match[1].length + match[2].length + 5).trim();
      description = match[3].trim();
    } else {
      const words = description.split(' ');
      if (words.length > 5) {
        title = words.slice(0, 4).join(' ');
        description = words.slice(4).join(' ');
      }
    }
  }
  return { title, description, link, date };
};

const sanitizeEducation = (edu) => {
  let { school = '', degree = '', graduationDate = '' } = edu;
  if (school && !degree && !graduationDate) {
    const match = school.match(/(.*?)(B\s*Tech|M\s*Tech|B\.?S\.?|B\.?A\.?|Master|Bachelor)(.*)/i);
    if (match) {
      school = match[1].trim();
      degree = match[2] + match[3].trim();
    }
  }
  return { school, degree, graduationDate };
};

// Helper to generate ATS-friendly HTML
const generateATSHTML = (resumeData, email) => {
  const { personal = {}, experience = [], education = [], projects = [], skills = [] } = resumeData;
  
  const emailValue = personal.email || email;
  const linkedinHref = withHttps(personal.linkedin, 'https://www.linkedin.com/in/');
  const githubHref = withHttps(personal.github, 'https://github.com/');

  // Format contact info separated by |
  const contactItems = [
    contactLink('Call phone number', personal.phone, phoneHref(personal.phone)),
    contactLink('Send email', emailValue, emailValue ? `mailto:${emailValue}` : ''),
    contactLink('Visit LinkedIn profile', personal.linkedin ? displayUrl(personal.linkedin) : '', linkedinHref),
    contactLink('Visit GitHub profile', personal.github ? displayUrl(personal.github) : '', githubHref)
  ].filter(Boolean);
  
  const contactHTML = contactItems.join(' <span class="sep">|</span> ');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>${personal.fullName || 'Resume'}</title>
      <style>
        * {
          box-sizing: border-box;
        }
        body { 
          font-family: Arial, Helvetica, sans-serif; 
          font-size: 10pt; 
          line-height: 1.15; 
          color: #000; 
          margin: 0; 
          padding: 0; 
        }
        .header {
          text-align: center;
          margin-bottom: 8pt;
        }
        h1 { 
          font-size: 24pt; 
          font-weight: bold; 
          margin: 0 0 2pt 0; 
          color: #000; 
        }
        .contact-info { 
          font-size: 9pt; 
          color: #000; 
        }
        .contact-info a {
          color: #000;
          text-decoration: none;
        }
        .sep {
          margin: 0 3pt;
        }
        h2 { 
          font-size: 12pt; 
          font-weight: bold; 
          text-transform: uppercase; 
          margin: 12pt 0 4pt 0; 
          border-bottom: 1pt solid #000; 
          padding-bottom: 2pt; 
          color: #000; 
        }
        .section-content { 
          margin-bottom: 8pt; 
        }
        
        .item-container {
          margin-bottom: 6pt;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 2pt;
        }
        td {
          padding: 0;
          vertical-align: top;
        }
        .td-left {
          text-align: left;
        }
        .td-right {
          text-align: right;
        }
        .item-title { font-weight: bold; font-size: 10pt; }
        .item-date { font-weight: normal; font-size: 10pt; }
        .item-subtitle { font-style: italic; font-size: 10pt; }
        .item-right-sub { font-style: italic; font-size: 10pt; }
        
        p.summary { 
          margin: 0; 
          text-align: justify; 
        }
        
        ul.resume-list { 
          margin: 2pt 0 0 0; 
          padding-left: 14pt; 
        }
        ul.resume-list li { 
          margin-bottom: 1pt; 
          text-align: justify;
        }
        .bullet-text {
          font-size: 10pt;
        }
        
        .skills-container { 
          margin-top: 2pt; 
        }
        .skills-container ul {
          list-style-type: none;
          padding-left: 0;
          margin: 0;
        }
        .skills-container li {
          margin-bottom: 2pt;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${personal.fullName || 'First Last'}</h1>
        <div class="contact-info">
          ${contactHTML}
        </div>
      </div>

      ${personal.summary ? `
      <h2>Summary</h2>
      <div class="section-content">
        <p class="summary">${personal.summary}</p>
      </div>
      ` : ''}

      ${skills.length > 0 ? `
      <h2>Technical Skills</h2>
      <div class="section-content skills-container">
        <ul>
          <li><strong>Skills</strong>: ${skills.join(', ')}</li>
        </ul>
      </div>
      ` : ''}

      ${projects.length > 0 ? `
      <h2>Projects</h2>
      <div class="section-content">
        ${projects.map(rawProj => {
          const proj = sanitizeProject(rawProj);
          return `
          <div class="item-container">
            <table>
              <tr>
                <td class="td-left item-title">${proj.title || ''}</td>
                <td class="td-right item-date">${proj.date || ''}</td>
              </tr>
              ${proj.link ? `
              <tr>
                <td class="td-left item-subtitle"><a href="${proj.link}" style="color: #000; text-decoration: none;">${proj.link}</a></td>
                <td class="td-right item-right-sub"></td>
              </tr>` : ''}
            </table>
            ${formatBullets(proj.description)}
          </div>
          `;
        }).join('')}
      </div>
      ` : ''}

      ${experience.length > 0 ? `
      <h2>Experience</h2>
      <div class="section-content">
        ${experience.map(exp => `
          <div class="item-container">
            <table>
              <tr>
                <td class="td-left item-title">${exp.jobTitle || ''}</td>
                <td class="td-right item-date">${exp.startDate ? `${exp.startDate} – ${exp.endDate || 'Present'}` : ''}</td>
              </tr>
              ${exp.company ? `
              <tr>
                <td class="td-left item-subtitle">${exp.company}</td>
                <td class="td-right item-right-sub"></td>
              </tr>` : ''}
            </table>
            ${formatBullets(exp.description)}
          </div>
        `).join('')}
      </div>
      ` : ''}

      ${education.length > 0 ? `
      <h2>Education</h2>
      <div class="section-content">
        ${education.map(rawEdu => {
          const edu = sanitizeEducation(rawEdu);
          return `
          <div class="item-container">
            <table>
              <tr>
                <td class="td-left item-title">${edu.school || ''}</td>
                <td class="td-right item-date"></td>
              </tr>
              ${(edu.degree || edu.graduationDate) ? `
              <tr>
                <td class="td-left item-subtitle">${edu.degree || ''}</td>
                <td class="td-right item-right-sub">${edu.graduationDate || ''}</td>
              </tr>` : ''}
            </table>
          </div>
          `;
        }).join('')}
      </div>
      ` : ''}
    </body>
    </html>
  `;
};

router.post('/ats-resume', authMiddleware, async (req, res) => {
  let browser;
  try {
    const { resumeData } = req.body;
    if (!resumeData) return res.status(400).json({ message: 'No resume data provided' });
    
    // We only need the user's email as a fallback if it's not in the resumeData
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const htmlContent = generateATSHTML(resumeData, user.email);

    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });
    
    const pdfUint8Array = await page.pdf({
      format: 'Letter',
      margin: { top: '0.5in', right: '0.5in', bottom: '0.5in', left: '0.5in' },
      printBackground: true
    });

    await browser.close();
    
    const pdfBuffer = Buffer.from(pdfUint8Array);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=ATS_Resume.pdf',
      'Content-Length': pdfBuffer.length
    });

    res.end(pdfBuffer);
  } catch (error) {
    if (browser) await browser.close().catch(() => {});
    console.error('ATS resume generation failed:', error);
    res.status(500).json({ message: 'Failed to generate ATS Resume PDF', error: error.message });
  }
});

export default router;
