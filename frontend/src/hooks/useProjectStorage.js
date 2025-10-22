import { useState, useEffect, useCallback } from 'react';
import { createDefaultProject } from '../utils/projectUtils';

export const useProjectStorage = () => {
  const [projectFiles, setProjectFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [projectId, setProjectId] = useState(null);
  const [isAutoSave, setIsAutoSave] = useState(true);
  const [lastSaved, setLastSaved] = useState(null);

  // Initialize with default project if no project is loaded
  useEffect(() => {
    const savedProjectId = localStorage.getItem('currentProjectId');
    if (savedProjectId) {
      loadProject(savedProjectId);
    } else {
      const defaultProject = createDefaultProject();
      setProjectFiles(defaultProject);
      setActiveFile(defaultProject.find(file => file.name === 'App.js'));
    }
  }, []);

  // Auto-save functionality
  useEffect(() => {
    if (isAutoSave && projectFiles.length > 0) {
      const timeoutId = setTimeout(() => {
        if (projectId) {
          saveProject();
        }
      }, 2000); // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(timeoutId);
    }
  }, [projectFiles, isAutoSave, projectId]);

  const saveProject = useCallback(() => {
    if (!projectId) {
      const newProjectId = `project_${Date.now()}`;
      setProjectId(newProjectId);
    }

    const projectData = {
      id: projectId || `project_${Date.now()}`,
      name: `Project ${new Date().toLocaleDateString()}`,
      files: projectFiles,
      activeFile: activeFile?.path,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem(`project_${projectId || newProjectId}`, JSON.stringify(projectData));
    localStorage.setItem('currentProjectId', projectId || newProjectId);
    setLastSaved(new Date());
    
    return projectData;
  }, [projectFiles, activeFile, projectId]);

  const loadProject = useCallback((id) => {
    try {
      const savedProject = localStorage.getItem(`project_${id}`);
      if (savedProject) {
        const projectData = JSON.parse(savedProject);
        setProjectFiles(projectData.files || []);
        setProjectId(projectData.id);
        
        // Set active file if it exists
        if (projectData.activeFile) {
          const file = findFileByPath(projectData.files, projectData.activeFile);
          setActiveFile(file);
        }
        
        setLastSaved(new Date(projectData.updatedAt));
        return projectData;
      }
    } catch (error) {
      console.error('Error loading project:', error);
    }
    return null;
  }, []);

  const createNewProject = useCallback(() => {
    const defaultProject = createDefaultProject();
    setProjectFiles(defaultProject);
    setActiveFile(defaultProject.find(file => file.name === 'App.js'));
    setProjectId(null);
    setLastSaved(null);
  }, []);

  const exportProject = useCallback(() => {
    const projectData = {
      name: `Project ${new Date().toLocaleDateString()}`,
      files: projectFiles,
      exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(projectData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `project_${Date.now()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  }, [projectFiles]);

  const importProject = useCallback((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const projectData = JSON.parse(e.target.result);
        if (projectData.files) {
          setProjectFiles(projectData.files);
          setActiveFile(projectData.files.find(file => file.name === 'App.js'));
          setProjectId(null);
          setLastSaved(null);
        }
      } catch (error) {
        console.error('Error importing project:', error);
        alert('Invalid project file');
      }
    };
    reader.readAsText(file);
  }, []);

  const getSavedProjects = useCallback(() => {
    const projects = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('project_')) {
        try {
          const projectData = JSON.parse(localStorage.getItem(key));
          projects.push({
            id: projectData.id,
            name: projectData.name,
            updatedAt: projectData.updatedAt
          });
        } catch (error) {
          console.error('Error parsing project:', key, error);
        }
      }
    }
    return projects.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }, []);

  const deleteProject = useCallback((id) => {
    localStorage.removeItem(`project_${id}`);
    if (projectId === id) {
      createNewProject();
    }
  }, [projectId, createNewProject]);

  // Helper function to find file by path
  const findFileByPath = (files, path) => {
    for (const file of files) {
      if (file.path === path) {
        return file;
      }
      if (file.children) {
        const found = findFileByPath(file.children, path);
        if (found) return found;
      }
    }
    return null;
  };

  return {
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
    deleteProject
  };
};
