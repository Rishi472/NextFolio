import express from 'express';
import { PersonalInfo, Experience, Education, Project, Skill, User } from '../models/index.js';
import { authMiddleware } from './auth.js';

const router = express.Router();

// Apply auth middleware to all resume routes
router.use(authMiddleware);

// GET full resume
router.get('/', async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [PersonalInfo, Experience, Education, Project, Skill]
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update Personal Info
router.put('/personal', async (req, res) => {
  try {
    const [info, created] = await PersonalInfo.findOrCreate({
      where: { UserId: req.user.id },
      defaults: req.body
    });
    
    if (!created) {
      await info.update(req.body);
    }
    res.json(info);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update Config
router.put('/config', async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    const { theme, colorPalette, layoutStyle } = req.body;
    await user.update({ theme, colorPalette, layoutStyle });
    res.json({ theme: user.theme, colorPalette: user.colorPalette, layoutStyle: user.layoutStyle });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// CRUD for Experience
router.post('/experience', async (req, res) => {
  try {
    const exp = await Experience.create({ ...req.body, UserId: req.user.id });
    res.status(201).json(exp);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/experience/:id', async (req, res) => {
  try {
    const exp = await Experience.findOne({ where: { id: req.params.id, UserId: req.user.id } });
    if (!exp) return res.status(404).json({ message: 'Not found' });
    await exp.update(req.body);
    res.json(exp);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/experience/:id', async (req, res) => {
  try {
    const deleted = await Experience.destroy({ where: { id: req.params.id, UserId: req.user.id } });
    res.json({ deleted });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// CRUD for Education
router.post('/education', async (req, res) => {
  try {
    const edu = await Education.create({ ...req.body, UserId: req.user.id });
    res.status(201).json(edu);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/education/:id', async (req, res) => {
  try {
    const deleted = await Education.destroy({ where: { id: req.params.id, UserId: req.user.id } });
    res.json({ deleted });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// CRUD for Project
router.post('/project', async (req, res) => {
  try {
    const proj = await Project.create({ ...req.body, UserId: req.user.id });
    res.status(201).json(proj);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/project/:id', async (req, res) => {
  try {
    const deleted = await Project.destroy({ where: { id: req.params.id, UserId: req.user.id } });
    res.json({ deleted });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// CRUD for Skill
router.post('/skill', async (req, res) => {
  try {
    const skill = await Skill.create({ ...req.body, UserId: req.user.id });
    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/skill/:id', async (req, res) => {
  try {
    const deleted = await Skill.destroy({ where: { id: req.params.id, UserId: req.user.id } });
    res.json({ deleted });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
