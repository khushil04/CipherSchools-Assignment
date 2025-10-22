import React, { useState, useEffect } from 'react';
import { SandpackProvider, SandpackPreview, SandpackLayout } from '@codesandbox/sandpack-react';
import { RefreshCw, ExternalLink, Maximize2 } from 'lucide-react';

const PreviewPane = ({ projectFiles, activeFile }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);

  // Convert project files to Sandpack files format
  const getSandpackFiles = () => {
    const files = {};
    
    const processFiles = (fileList, basePath = '') => {
      fileList.forEach(file => {
        if (file.type === 'file') {
          const filePath = basePath ? `${basePath}/${file.name}` : file.name;
          files[`/${filePath}`] = {
            code: file.content || '',
            readOnly: false
          };
        } else if (file.children) {
          processFiles(file.children, basePath ? `${basePath}/${file.name}` : file.name);
        }
      });
    };
    
    processFiles(projectFiles);
    return files;
  };

  const getMainFile = () => {
    // Look for common entry points
    const entryPoints = ['src/index.js', 'src/index.tsx', 'src/App.js', 'src/App.tsx', 'index.js', 'index.tsx'];
    
    for (const entryPoint of entryPoints) {
      const file = findFileByPath(projectFiles, entryPoint);
      if (file) {
        return `/${entryPoint}`;
      }
    }
    
    // Fallback to first JS/TS file
    const jsFiles = projectFiles.filter(file => 
      file.type === 'file' && 
      (file.name.endsWith('.js') || file.name.endsWith('.jsx') || file.name.endsWith('.ts') || file.name.endsWith('.tsx'))
    );
    
    if (jsFiles.length > 0) {
      return `/${jsFiles[0].path}`;
    }
    
    return '/src/App.js';
  };

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

  const handleRefresh = () => {
    setIsLoading(true);
    setPreviewKey(prev => prev + 1);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleOpenInNewTab = () => {
    // This would open the preview in a new tab
    // For now, we'll just show an alert
    alert('Opening in new tab feature coming soon!');
  };

  const sandpackFiles = getSandpackFiles();
  const mainFile = getMainFile();

  // Add default HTML if not present
  if (!sandpackFiles['/public/index.html']) {
    sandpackFiles['/public/index.html'] = {
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>React App</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>`,
      readOnly: false
    };
  }

  return (
    <div className="preview-pane">
      <div className="preview-header">
        <div className="preview-title">
          <h3>Preview</h3>
          <span className="preview-status">Live</span>
        </div>
        <div className="preview-actions">
          <button
            onClick={handleRefresh}
            className="action-btn"
            disabled={isLoading}
            title="Refresh preview"
          >
            <RefreshCw size={16} className={isLoading ? 'spinning' : ''} />
          </button>
          <button
            onClick={handleOpenInNewTab}
            className="action-btn"
            title="Open in new tab"
          >
            <ExternalLink size={16} />
          </button>
          <button
            className="action-btn"
            title="Maximize preview"
          >
            <Maximize2 size={16} />
          </button>
        </div>
      </div>
      
      <div className="preview-container">
        {Object.keys(sandpackFiles).length > 0 ? (
          <SandpackProvider
            key={previewKey}
            template="react"
            files={sandpackFiles}
            options={{
              showNavigator: false,
              showRefreshButton: false,
              showOpenInCodeSandbox: false,
              bundlerURL: "https://bundler.ecmascript.org/",
              startRoute: "/",
              logLevel: "error",
              initMode: "lazy",
              recompileMode: "delayed",
              recompileDelay: 300
            }}
            customSetup={{
              dependencies: {
                "react": "^18.0.0",
                "react-dom": "^18.0.0"
              }
            }}
          >
            <SandpackLayout>
              <SandpackPreview
                showOpenInCodeSandbox={false}
                showRefreshButton={false}
                showNavigator={false}
                style={{
                  height: '100%',
                  border: 'none'
                }}
              />
            </SandpackLayout>
          </SandpackProvider>
        ) : (
          <div className="no-preview">
            <h3>No files to preview</h3>
            <p>Create some files to see the live preview</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewPane;
