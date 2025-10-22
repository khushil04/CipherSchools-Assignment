import React, { useState, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import { getLanguageFromExtension, getFileExtension } from '../utils/projectUtils';
import LanguageSelector from './LanguageSelector';
import '../styles/EditorPane.css';

const EditorPane = ({ 
  activeFile, 
  projectFiles, 
  setProjectFiles 
}) => {
  const [editorContent, setEditorContent] = useState('');
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');

  useEffect(() => {
    if (activeFile) {
      setEditorContent(activeFile.content || '');
      // Set language based on file extension
      const fileExtension = getFileExtension(activeFile.name);
      const language = getLanguageFromExtension(fileExtension);
      setSelectedLanguage(language || 'javascript');
    } else {
      setEditorContent('');
    }
  }, [activeFile]);

  const handleEditorChange = (value) => {
    setEditorContent(value);
    
    // Update the file content in project files
    if (activeFile) {
      const updateFileContent = (files) => {
        return files.map(file => {
          if (file.path === activeFile.path) {
            return { ...file, content: value };
          }
          if (file.children) {
            return {
              ...file,
              children: updateFileContent(file.children)
            };
          }
          return file;
        });
      };
      
      setProjectFiles(prev => updateFileContent(prev));
    }
  };

  const getLanguage = () => {
    if (!activeFile) return 'plaintext';
    const extension = getFileExtension(activeFile.name);
    return getLanguageFromExtension(extension);
  };

  const getEditorTheme = () => {
    // You can implement theme switching here
    return 'vs-dark';
  };

  const handleLanguageChange = (languageId) => {
    setSelectedLanguage(languageId);
  };

  if (!activeFile) {
    return (
      <div className="editor-pane no-file">
        <div className="no-file-message">
          <h3>No file selected</h3>
          <p>Select a file from the file explorer to start editing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="editor-pane">
      <div className="editor-header">
        <div className="file-info">
          <span className="file-name">{activeFile.name}</span>
          <span className="file-path">{activeFile.path}</span>
        </div>
        <div className="editor-actions">
          <LanguageSelector 
            onSelectLanguage={handleLanguageChange} 
            selectedLanguage={selectedLanguage} 
          />
          <span className="language-badge">{getLanguage()}</span>
        </div>
      </div>
      
      <div className="editor-container">
        <Editor
          height="100%"
          language={selectedLanguage}
          theme={getEditorTheme()}
          value={editorContent}
          onChange={handleEditorChange}
          onMount={() => setIsEditorReady(true)}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            wordWrap: 'on',
            folding: true,
            bracketPairColorization: { enabled: true },
            guides: {
              bracketPairs: true,
              indentation: true
            }
          }}
        />
      </div>
    </div>
  );
};

export default EditorPane;
