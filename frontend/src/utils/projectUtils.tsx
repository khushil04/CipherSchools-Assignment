// Utility functions for file structure manipulation

export const addFile = (projectFiles, parentPath, fileName, content = '', isFolder = false) => {
  const newFile = {
    id: Date.now().toString(),
    name: fileName,
    type: isFolder ? 'folder' : 'file',
    content: content,
    children: isFolder ? [] : null,
    path: parentPath ? `${parentPath}/${fileName}` : fileName
  };

  if (!parentPath) {
    return [...projectFiles, newFile];
  }

  const updateFiles = (files) => {
    return files.map(file => {
      if (file.path === parentPath && file.type === 'folder') {
        return {
          ...file,
          children: [...(file.children || []), newFile]
        };
      }
      if (file.children) {
        return {
          ...file,
          children: updateFiles(file.children)
        };
      }
      return file;
    });
  };

  return updateFiles(projectFiles);
};

export const deleteFile = (projectFiles, filePath) => {
  const removeFromFiles = (files) => {
    return files.filter(file => {
      if (file.path === filePath) {
        return false;
      }
      if (file.children) {
        file.children = removeFromFiles(file.children);
      }
      return true;
    });
  };

  return removeFromFiles(projectFiles);
};

export const renameFile = (projectFiles, filePath, newName) => {
  const updateInFiles = (files) => {
    return files.map(file => {
      if (file.path === filePath) {
        const pathParts = filePath.split('/');
        pathParts[pathParts.length - 1] = newName;
        return {
          ...file,
          name: newName,
          path: pathParts.join('/')
        };
      }
      if (file.children) {
        return {
          ...file,
          children: updateInFiles(file.children)
        };
      }
      return file;
    });
  };

  return updateInFiles(projectFiles);
};

export const findFileByPath = (projectFiles, filePath) => {
  const searchInFiles = (files) => {
    for (const file of files) {
      if (file.path === filePath) {
        return file;
      }
      if (file.children) {
        const found = searchInFiles(file.children);
        if (found) return found;
      }
    }
    return null;
  };

  return searchInFiles(projectFiles);
};

export const getFileExtension = (fileName) => {
  const parts = fileName.split('.');
  return parts.length > 1 ? parts[parts.length - 1] : '';
};

export const getLanguageFromExtension = (extension) => {
  const languageMap = {
    'js': 'javascript',
    'jsx': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    'html': 'html',
    'css': 'css',
    'scss': 'scss',
    'sass': 'sass',
    'json': 'json',
    'md': 'markdown',
    'py': 'python',
    'java': 'java',
    'cpp': 'cpp',
    'c': 'c',
    'php': 'php',
    'rb': 'ruby',
    'go': 'go',
    'rs': 'rust',
    'xml': 'xml',
    'yaml': 'yaml',
    'yml': 'yaml'
  };
  
  return languageMap[extension.toLowerCase()] || 'plaintext';
};

export const createDefaultProject = () => {
  return [
    {
      id: '1',
      name: 'src',
      type: 'folder',
      path: 'src',
      children: [
        {
          id: '2',
          name: 'App.js',
          type: 'file',
          path: 'src/App.js',
          content: `import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to CipherStudio</h1>
        <p>Start editing to see live changes!</p>
      </header>
    </div>
  );
}

export default App;`
        },
        {
          id: '3',
          name: 'App.css',
          type: 'file',
          path: 'src/App.css',
          content: `.App {
  text-align: center;
}

.App-header {
  background-color: #282c34;
  padding: 20px;
  color: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
}`
        },
        {
          id: '4',
          name: 'index.js',
          type: 'file',
          path: 'src/index.js',
          content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`
        }
      ]
    },
    {
      id: '5',
      name: 'package.json',
      type: 'file',
      path: 'package.json',
      content: `{
  "name": "my-react-app",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}`
    }
  ];
};
