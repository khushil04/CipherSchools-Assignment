const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  projectSlug: {
    type: String,
    unique: true,
    index: true,
    required: true,
    trim: true,
    match: [/^[a-z0-9-]+$/, 'Project slug can only contain lowercase letters, numbers, and hyphens']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  rootFolderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
    default: null
  },
  files: [{
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['file', 'folder'],
      required: true
    },
    content: {
      type: String,
      default: ''
    },
    path: {
      type: String,
      required: true
    },
    children: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'File'
    }]
  }],
  activeFile: {
    type: String,
    default: null
  },
  settings: {
    framework: {
      type: String,
      default: 'react'
    },
    autoSave: {
      type: Boolean,
      default: true
    }
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  collaborators: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['viewer', 'editor', 'admin'],
      default: 'viewer'
    }
  }],
  lastModified: {
    type: Date,
    default: Date.now
  },
  version: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

// Index for better query performance
ProjectSchema.index({ name: 'text', description: 'text', tags: 'text' });
ProjectSchema.index({ userId: 1, createdAt: -1 });
ProjectSchema.index({ isPublic: 1, createdAt: -1 });

// Middleware to update lastModified on save
ProjectSchema.pre('save', function(next) {
  this.lastModified = new Date();
  this.version += 1;
  next();
});

// Virtual for project URL
ProjectSchema.virtual('url').get(function() {
  return `/api/projects/${this._id}`;
});

// Method to get project summary
ProjectSchema.methods.getSummary = function() {
  return {
    id: this._id,
    name: this.name,
    description: this.description,
    fileCount: this.files.length,
    lastModified: this.lastModified,
    isPublic: this.isPublic,
    tags: this.tags,
    version: this.version
  };
};

// Method to add file
ProjectSchema.methods.addFile = function(fileData) {
  this.files.push(fileData);
  return this.save();
};

// Method to update file
ProjectSchema.methods.updateFile = function(filePath, content) {
  const file = this.files.find(f => f.path === filePath);
  if (file) {
    file.content = content;
    file.lastModified = new Date();
    return this.save();
  }
  throw new Error('File not found');
};

// Method to delete file
ProjectSchema.methods.deleteFile = function(filePath) {
  this.files = this.files.filter(f => f.path !== filePath);
  return this.save();
};

module.exports = mongoose.model('Project', ProjectSchema);
