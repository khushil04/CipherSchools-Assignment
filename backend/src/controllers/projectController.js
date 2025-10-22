const Project = require('../models/Project');
const { nanoid } = require('nanoid/non-secure');

// Get all projects
const getAllProjects = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, isPublic } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    if (isPublic !== undefined) {
      query.isPublic = isPublic === 'true';
    }

    const projects = await Project.find(query)
      .select('name description tags isPublic lastModified version')
      .sort({ lastModified: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Project.countDocuments(query);

    res.json({
      success: true,
      data: projects,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching projects',
      error: error.message
    });
  }
};

// Get single project
const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching project',
      error: error.message
    });
  }
};

// Create new project
const createProject = async (req, res) => {
  try {
    const {
      name,
      description,
      files,
      settings,
      isPublic = false,
      tags = []
    } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Project name is required'
      });
    }

    const project = new Project({
      name,
      description,
      files: files || [],
      settings: settings || {},
      isPublic,
      tags
    });

    await project.save();

    res.status(201).json({
      success: true,
      data: project,
      message: 'Project created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating project',
      error: error.message
    });
  }
};

// Update project
const updateProject = async (req, res) => {
  try {
    const {
      name,
      description,
      files,
      settings,
      activeFile,
      isPublic,
      tags
    } = req.body;

    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Update fields if provided
    if (name !== undefined) project.name = name;
    if (description !== undefined) project.description = description;
    if (files !== undefined) project.files = files;
    if (settings !== undefined) project.settings = { ...project.settings, ...settings };
    if (activeFile !== undefined) project.activeFile = activeFile;
    if (isPublic !== undefined) project.isPublic = isPublic;
    if (tags !== undefined) project.tags = tags;

    await project.save();

    res.json({
      success: true,
      data: project,
      message: 'Project updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating project',
      error: error.message
    });
  }
};

// Delete project
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting project',
      error: error.message
    });
  }
};

// Update file content
const updateFile = async (req, res) => {
  try {
    const { filePath, content } = req.body;
    
    if (!filePath) {
      return res.status(400).json({
        success: false,
        message: 'File path is required'
      });
    }

    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const file = project.files.find(f => f.path === filePath);
    
    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    file.content = content || '';
    file.lastModified = new Date();
    
    await project.save();

    res.json({
      success: true,
      data: file,
      message: 'File updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating file',
      error: error.message
    });
  }
};

// Add file to project
const addFile = async (req, res) => {
  try {
    const { name, type, content, path, parentPath } = req.body;
    
    if (!name || !type || !path) {
      return res.status(400).json({
        success: false,
        message: 'Name, type, and path are required'
      });
    }

    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const newFile = {
      id: nanoid(),
      name,
      type,
      content: content || '',
      path,
      children: type === 'folder' ? [] : null
    };

    project.files.push(newFile);
    await project.save();

    res.status(201).json({
      success: true,
      data: newFile,
      message: 'File added successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding file',
      error: error.message
    });
  }
};

// Delete file from project
const deleteFile = async (req, res) => {
  try {
    const { filePath } = req.body;
    
    if (!filePath) {
      return res.status(400).json({
        success: false,
        message: 'File path is required'
      });
    }

    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const initialLength = project.files.length;
    project.files = project.files.filter(f => f.path !== filePath);
    
    if (project.files.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    await project.save();

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting file',
      error: error.message
    });
  }
};

// Duplicate project
const duplicateProject = async (req, res) => {
  try {
    const originalProject = await Project.findById(req.params.id);
    
    if (!originalProject) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const duplicatedProject = new Project({
      name: `${originalProject.name} (Copy)`,
      description: originalProject.description,
      files: originalProject.files,
      settings: originalProject.settings,
      isPublic: false,
      tags: originalProject.tags
    });

    await duplicatedProject.save();

    res.status(201).json({
      success: true,
      data: duplicatedProject,
      message: 'Project duplicated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error duplicating project',
      error: error.message
    });
  }
};

module.exports = {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  updateFile,
  addFile,
  deleteFile,
  duplicateProject
};
