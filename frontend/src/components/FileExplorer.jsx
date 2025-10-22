import React, { useState } from 'react';
import { 
  File, 
  Folder, 
  FolderOpen, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X 
} from 'lucide-react';
import { addFile, deleteFile, renameFile } from '../utils/projectUtils';

const FileExplorer = ({ 
  projectFiles, 
  setProjectFiles, 
  activeFile, 
  setActiveFile 
}) => {
  const [expandedFolders, setExpandedFolders] = useState(new Set(['src']));
  const [editingFile, setEditingFile] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [showNewFileInput, setShowNewFileInput] = useState(null);
  const [newFileName, setNewFileName] = useState('');

  const toggleFolder = (folderPath) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderPath)) {
      newExpanded.delete(folderPath);
    } else {
      newExpanded.add(folderPath);
    }
    setExpandedFolders(newExpanded);
  };

  const handleFileClick = (file) => {
    if (file.type === 'file') {
      setActiveFile(file);
    } else {
      toggleFolder(file.path);
    }
  };

  const handleRename = (file) => {
    setEditingFile(file.path);
    setEditingName(file.name);
  };

  const confirmRename = () => {
    if (editingName.trim() && editingName !== editingFile) {
      setProjectFiles(prev => renameFile(prev, editingFile, editingName.trim()));
    }
    setEditingFile(null);
    setEditingName('');
  };

  const cancelRename = () => {
    setEditingFile(null);
    setEditingName('');
  };

  const handleDelete = (filePath) => {
    if (window.confirm('Are you sure you want to delete this file/folder?')) {
      setProjectFiles(prev => deleteFile(prev, filePath));
      if (activeFile?.path === filePath) {
        setActiveFile(null);
      }
    }
  };

  const handleNewFile = (parentPath = null) => {
    setShowNewFileInput(parentPath);
    setNewFileName('');
  };

  const confirmNewFile = () => {
    if (newFileName.trim()) {
      const isFolder = newFileName.endsWith('/');
      const fileName = isFolder ? newFileName.slice(0, -1) : newFileName;
      
      setProjectFiles(prev => addFile(prev, parentPath, fileName, '', isFolder));
      
      if (isFolder) {
        setExpandedFolders(prev => new Set([...prev, parentPath ? `${parentPath}/${fileName}` : fileName]));
      }
    }
    setShowNewFileInput(null);
    setNewFileName('');
  };

  const cancelNewFile = () => {
    setShowNewFileInput(null);
    setNewFileName('');
  };

  const renderFile = (file, depth = 0) => {
    const isExpanded = expandedFolders.has(file.path);
    const isActive = activeFile?.path === file.path;
    const isEditing = editingFile === file.path;
    const isShowingNewInput = showNewFileInput === file.path;

    return (
      <div key={file.id} style={{ marginLeft: `${depth * 16}px` }}>
        <div
          className={`file-item ${isActive ? 'active' : ''} ${file.type === 'folder' ? 'folder' : 'file'}`}
          onClick={() => handleFileClick(file)}
        >
          <div className="file-content">
            {file.type === 'folder' ? (
              isExpanded ? <FolderOpen size={16} /> : <Folder size={16} />
            ) : (
              <File size={16} />
            )}
            
            {isEditing ? (
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') confirmRename();
                  if (e.key === 'Escape') cancelRename();
                }}
                onBlur={confirmRename}
                autoFocus
                className="rename-input"
              />
            ) : (
              <span className="file-name">{file.name}</span>
            )}
          </div>
          
          <div className="file-actions">
            {!isEditing && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNewFile(file.path);
                  }}
                  className="action-btn"
                  title="New file/folder"
                >
                  <Plus size={14} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRename(file);
                  }}
                  className="action-btn"
                  title="Rename"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(file.path);
                  }}
                  className="action-btn delete"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </>
            )}
            {isEditing && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmRename();
                  }}
                  className="action-btn confirm"
                  title="Confirm"
                >
                  <Check size={14} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    cancelRename();
                  }}
                  className="action-btn cancel"
                  title="Cancel"
                >
                  <X size={14} />
                </button>
              </>
            )}
          </div>
        </div>

        {isShowingNewInput && (
          <div style={{ marginLeft: '16px', marginTop: '4px' }}>
            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') confirmNewFile();
                if (e.key === 'Escape') cancelNewFile();
              }}
              onBlur={confirmNewFile}
              placeholder="filename.js or foldername/"
              autoFocus
              className="new-file-input"
            />
            <div className="new-file-actions">
              <button onClick={confirmNewFile} className="action-btn confirm">
                <Check size={12} />
              </button>
              <button onClick={cancelNewFile} className="action-btn cancel">
                <X size={12} />
              </button>
            </div>
          </div>
        )}

        {file.type === 'folder' && isExpanded && file.children && (
          <div>
            {file.children.map(child => renderFile(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="file-explorer">
      <div className="file-explorer-header">
        <h3>Files</h3>
        <button
          onClick={() => handleNewFile()}
          className="new-file-btn"
          title="New file/folder"
        >
          <Plus size={16} />
        </button>
      </div>
      
      <div className="file-tree">
        {projectFiles.map(file => renderFile(file))}
      </div>
    </div>
  );
};

export default FileExplorer;
