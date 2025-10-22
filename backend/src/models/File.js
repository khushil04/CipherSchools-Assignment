const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
    default: null // null for root folder
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 255
  },
  type: {
    type: String,
    enum: ['folder', 'file'],
    required: true
  },
  // Only applicable for files
  s3Key: {
    type: String,
    default: null
  },
  language: {
    type: String,
    default: null // "javascript", "jsx", "css", etc.
  },
  sizeInBytes: {
    type: Number,
    default: 0 // file size
  }
}, {
  timestamps: true
});

// Index for better query performance
FileSchema.index({ projectId: 1, parentId: 1 });
FileSchema.index({ projectId: 1, name: 1 });
FileSchema.index({ type: 1 });

// Virtual for file path
FileSchema.virtual('path').get(function() {
  if (this.parentId) {
    return `${this.parentId.path}/${this.name}`;
  }
  return this.name;
});

// Method to get file info
FileSchema.methods.getFileInfo = function() {
  return {
    id: this._id,
    projectId: this.projectId,
    parentId: this.parentId,
    name: this.name,
    type: this.type,
    s3Key: this.s3Key,
    language: this.language,
    sizeInBytes: this.sizeInBytes,
    path: this.path,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

// Method to check if file is a folder
FileSchema.methods.isFolder = function() {
  return this.type === 'folder';
};

// Method to check if file is a file
FileSchema.methods.isFile = function() {
  return this.type === 'file';
};

// Static method to find files by project
FileSchema.statics.findByProject = function(projectId) {
  return this.find({ projectId: projectId });
};

// Static method to find files by parent
FileSchema.statics.findByParent = function(parentId) {
  return this.find({ parentId: parentId });
};

// Static method to find root files (no parent)
FileSchema.statics.findRootFiles = function(projectId) {
  return this.find({ projectId: projectId, parentId: null });
};

module.exports = mongoose.model('File', FileSchema);
