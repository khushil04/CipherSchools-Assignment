const express = require('express');
const router = express.Router();
const {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  updateFile,
  addFile,
  deleteFile,
  duplicateProject
} = require('../controllers/projectController');

// Validation middleware
const validateProject = (req, res, next) => {
  const { name, files } = req.body;
  
  if (!name || name.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Project name is required'
    });
  }
  
  if (files && !Array.isArray(files)) {
    return res.status(400).json({
      success: false,
      message: 'Files must be an array'
    });
  }
  
  next();
};

// Rate limiting middleware (basic implementation)
const rateLimit = (req, res, next) => {
  // In production, use express-rate-limit package
  next();
};

// GET /api/projects - Get all projects
router.get('/', rateLimit, getAllProjects);

// GET /api/projects/:id - Get single project
router.get('/:id', rateLimit, getProject);

// POST /api/projects - Create new project
router.post('/', rateLimit, validateProject, createProject);

// PUT /api/projects/:id - Update project
router.put('/:id', rateLimit, updateProject);

// DELETE /api/projects/:id - Delete project
router.delete('/:id', rateLimit, deleteProject);

// POST /api/projects/:id/files - Add file to project
router.post('/:id/files', rateLimit, addFile);

// PUT /api/projects/:id/files - Update file content
router.put('/:id/files', rateLimit, updateFile);

// DELETE /api/projects/:id/files - Delete file from project
router.delete('/:id/files', rateLimit, deleteFile);

// POST /api/projects/:id/duplicate - Duplicate project
router.post('/:id/duplicate', rateLimit, duplicateProject);

module.exports = router;
