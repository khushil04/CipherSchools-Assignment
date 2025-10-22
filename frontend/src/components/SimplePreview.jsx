import React, { useState, useEffect } from 'react';
import { RefreshCw, ExternalLink, Maximize2, AlertCircle } from 'lucide-react';

const SimplePreview = ({ projectFiles, activeFile }) => {
  const [previewContent, setPreviewContent] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    generatePreview();
  }, [projectFiles, activeFile]);

  const generatePreview = () => {
    setIsLoading(true);
    setError(null);

    try {
      // Find the main React component
      const appFile = findFileByPath(projectFiles, 'src/App.js') || 
                     findFileByPath(projectFiles, 'src/App.jsx') ||
                     findFileByPath(projectFiles, 'App.js');
      
      if (!appFile) {
        setError('No App.js file found. Please create a React component.');
        setIsLoading(false);
        return;
      }

      // Create a simple HTML preview
      const htmlContent = createHTMLPreview(appFile.content, projectFiles);
      setPreviewContent(htmlContent);
    } catch (err) {
      setError(`Preview Error: ${err.message}`);
    }
    
    setIsLoading(false);
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

  const createHTMLPreview = (appContent, files) => {
    // Extract the component name and JSX
    const componentMatch = appContent.match(/function\s+(\w+)\s*\([^)]*\)\s*{([\s\S]*?)}/);
    if (!componentMatch) {
      throw new Error('Could not parse React component');
    }

    const componentName = componentMatch[1];
    const componentJSX = componentMatch[2];

    // Create a simple HTML structure
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>React Preview</title>
        <style>
          body {
            margin: 0;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            background-color: #f5f5f5;
          }
          .preview-container {
            background: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            max-width: 800px;
            margin: 0 auto;
          }
          .preview-header {
            background: #007acc;
            color: white;
            padding: 10px 20px;
            margin: -20px -20px 20px -20px;
            border-radius: 8px 8px 0 0;
            font-weight: 600;
          }
          .code-preview {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 4px;
            padding: 15px;
            margin: 20px 0;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 14px;
            line-height: 1.5;
            overflow-x: auto;
          }
          .component-name {
            color: #007acc;
            font-weight: 600;
          }
          .jsx-content {
            color: #333;
            white-space: pre-wrap;
          }
        </style>
      </head>
      <body>
        <div class="preview-container">
          <div class="preview-header">
            React Component Preview
          </div>
          <div class="code-preview">
            <div class="component-name">${componentName}</div>
            <div class="jsx-content">${componentJSX}</div>
          </div>
          <p><strong>Note:</strong> This is a simplified preview. For full React rendering, use the Sandpack integration.</p>
        </div>
      </body>
      </html>
    `;
  };

  const handleRefresh = () => {
    generatePreview();
  };

  const handleOpenInNewTab = () => {
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(previewContent);
      newWindow.document.close();
    }
  };

  return (
    <div className="preview-pane">
      <div className="preview-header">
        <div className="preview-title">
          <h3>Preview</h3>
          <span className="preview-status">Simple</span>
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
        {error ? (
          <div className="preview-error">
            <AlertCircle size={24} />
            <h4>Preview Error</h4>
            <p>{error}</p>
            <button onClick={handleRefresh} className="retry-btn">
              Try Again
            </button>
          </div>
        ) : (
          <iframe
            srcDoc={previewContent}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: '4px'
            }}
            title="React Preview"
          />
        )}
      </div>
    </div>
  );
};

export default SimplePreview;
