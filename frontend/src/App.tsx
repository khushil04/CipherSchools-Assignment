import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { useProjectStorage } from './hooks/useProjectStorage';
import FileExplorer from './components/FileExplorer';
import EditorPane from './components/EditorPane';
import PreviewPane from './components/PreviewPane';
import SimplePreview from './components/SimplePreview';
import Topbar from './components/Topbar';
import './App.css';

function App() {
  const {
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
  } = useProjectStorage();

  const [useSimplePreview, setUseSimplePreview] = useState(false);

  return (
    <AuthProvider>
      <div className="app">
        <Topbar
          projectFiles={projectFiles}
          setProjectFiles={setProjectFiles}
          activeFile={activeFile}
          setActiveFile={setActiveFile}
          projectId={projectId}
          isAutoSave={isAutoSave}
          setIsAutoSave={setIsAutoSave}
          lastSaved={lastSaved}
          saveProject={saveProject}
          loadProject={loadProject}
          createNewProject={createNewProject}
          exportProject={exportProject}
          importProject={importProject}
          getSavedProjects={getSavedProjects}
          deleteProject={deleteProject}
          useSimplePreview={useSimplePreview}
          setUseSimplePreview={setUseSimplePreview}
        />
        
        <div className="main-content">
          <div className="sidebar">
            <FileExplorer
              projectFiles={projectFiles}
              setProjectFiles={setProjectFiles}
              activeFile={activeFile}
              setActiveFile={setActiveFile}
            />
          </div>
          
          <div className="editor-section">
            <EditorPane
              activeFile={activeFile}
              projectFiles={projectFiles}
              setProjectFiles={setProjectFiles}
            />
          </div>
          
          <div className="preview-section">
            {useSimplePreview ? (
              <SimplePreview
                projectFiles={projectFiles}
                activeFile={activeFile}
              />
            ) : (
              <PreviewPane
                projectFiles={projectFiles}
                activeFile={activeFile}
              />
            )}
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
