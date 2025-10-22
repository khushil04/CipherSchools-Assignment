import React, { useState } from 'react';
import { 
  Save, 
  FolderOpen, 
  Download, 
  Upload, 
  Plus, 
  Settings, 
  Sun, 
  Moon,
  Play,
  Square,
  LogIn,
  LogOut,
  User
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

const Topbar = ({
  projectFiles,
  setProjectFiles,
  activeFile,
  setActiveFile,
  projectId,
  isAutoSave,
  setIsAutoSave,
  lastSaved,
  saveProject,
  loadProject,
  createNewProject,
  exportProject,
  importProject,
  getSavedProjects,
  deleteProject,
  useSimplePreview,
  setUseSimplePreview
}) => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showProjectMenu, setShowProjectMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [savedProjects, setSavedProjects] = useState([]);

  const handleSave = () => {
    saveProject();
  };

  const handleNewProject = () => {
    if (window.confirm('Create a new project? Current changes will be lost.')) {
      createNewProject();
    }
  };

  const handleExport = () => {
    exportProject();
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      importProject(file);
    }
  };

  const handleLoadProject = (projectId) => {
    loadProject(projectId);
    setShowProjectMenu(false);
  };

  const handleDeleteProject = (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteProject(projectId);
      setSavedProjects(getSavedProjects());
    }
  };

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', isDarkTheme ? 'light' : 'dark');
  };

  const openProjectMenu = () => {
    setSavedProjects(getSavedProjects());
    setShowProjectMenu(!showProjectMenu);
  };

  const formatLastSaved = () => {
    if (!lastSaved) return 'Never saved';
    const now = new Date();
    const diff = now - lastSaved;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const handleLogout = async () => {
    await logout();
    setShowProfileMenu(false);
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    if (firstName && lastName) {
      return (firstName[0] + lastName[0]).toUpperCase();
    }
    return (user.username || user.email || 'U')[0].toUpperCase();
  };

  return (
    <div className="topbar">
      <div className="topbar-left">
        <div className="logo">
          <h2>CipherStudio</h2>
        </div>
        
        <div className="project-actions">
          <button
            onClick={handleNewProject}
            className="btn btn-primary"
            title="New Project"
          >
            <Plus size={16} />
            New
          </button>
          
          <div className="project-menu">
            <button
              onClick={openProjectMenu}
              className="btn btn-secondary"
              title="Load Project"
            >
              <FolderOpen size={16} />
              Load
            </button>
            
            {showProjectMenu && (
              <div className="project-dropdown">
                <div className="dropdown-header">
                  <h4>Saved Projects</h4>
                </div>
                {savedProjects.length > 0 ? (
                  savedProjects.map(project => (
                    <div key={project.id} className="project-item">
                      <div
                        className="project-info"
                        onClick={() => handleLoadProject(project.id)}
                      >
                        <span className="project-name">{project.name}</span>
                        <span className="project-date">
                          {new Date(project.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="delete-project-btn"
                        title="Delete project"
                      >
                        ×
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="no-projects">No saved projects</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="topbar-center">
        <div className="file-info">
          {activeFile && (
            <span className="current-file">
              {activeFile.name}
            </span>
          )}
        </div>
      </div>

      <div className="topbar-right">
        <div className="status-info">
          {isAutoSave && (
            <span className="auto-save-indicator">
              Auto-save: {formatLastSaved()}
            </span>
          )}
        </div>
        
        <div className="toolbar-actions">
          <button
            onClick={handleSave}
            className="btn btn-secondary"
            title="Save Project"
          >
            <Save size={16} />
            Save
          </button>
          
          <div className="import-export">
            <label className="btn btn-secondary" title="Import Project">
              <Upload size={16} />
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                style={{ display: 'none' }}
              />
            </label>
            
            <button
              onClick={handleExport}
              className="btn btn-secondary"
              title="Export Project"
            >
              <Download size={16} />
              Export
            </button>
          </div>
          
          <button
            onClick={toggleTheme}
            className="btn btn-icon"
            title={`Switch to ${isDarkTheme ? 'light' : 'dark'} theme`}
          >
            {isDarkTheme ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          
          <button
            onClick={() => setUseSimplePreview(!useSimplePreview)}
            className={`btn btn-icon ${useSimplePreview ? 'active' : ''}`}
            title={`Switch to ${useSimplePreview ? 'Sandpack' : 'Simple'} preview`}
          >
            {useSimplePreview ? <Play size={16} /> : <Square size={16} />}
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="btn btn-icon"
            title="Settings"
          >
            <Settings size={16} />
          </button>

          {/* Authentication Section */}
          {isAuthenticated ? (
            <div className="user-section">
              <div
                className="user-profile"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <div className="user-avatar">
                  {getUserInitials()}
                </div>
                <div className="user-info">
                  <div className="user-name">
                    {user.firstName && user.lastName 
                      ? `${user.firstName} ${user.lastName}`
                      : user.username
                    }
                  </div>
                  <div className="user-email">{user.email}</div>
                </div>
              </div>

              {showProfileMenu && (
                <div className="profile-dropdown">
                  <div className="profile-item">
                    <User size={16} />
                    Profile
                  </div>
                  <div className="profile-item">
                    <Settings size={16} />
                    Settings
                  </div>
                  <div className="profile-item danger" onClick={handleLogout}>
                    <LogOut size={16} />
                    Logout
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="btn btn-primary"
              title="Sign In"
            >
              <LogIn size={16} />
              Sign In
            </button>
          )}
        </div>
      </div>

      {showSettings && (
        <div className="settings-modal">
          <div className="settings-content">
            <h3>Settings</h3>
            
            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={isAutoSave}
                  onChange={(e) => setIsAutoSave(e.target.checked)}
                />
                Auto-save
              </label>
              <p>Automatically save your project every 2 seconds</p>
            </div>
            
            <div className="setting-item">
              <label>
                Theme
                <select
                  value={isDarkTheme ? 'dark' : 'light'}
                  onChange={(e) => setIsDarkTheme(e.target.value === 'dark')}
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </label>
            </div>
            
            <button
              onClick={() => setShowSettings(false)}
              className="btn btn-primary"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};

export default Topbar;
