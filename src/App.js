import React, { useState, useEffect } from 'react';
import './App.css'; // Updated styling
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/cjs/styles/hljs'; // VS Code-like style
import { FaPencilAlt } from 'react-icons/fa'; // Pencil icon for Edit button

function App() {
  const [modules, setModules] = useState(() => {
    // Load modules from localStorage on mount, or use empty array if none exist
    const savedModules = localStorage.getItem('codeModules');
    return savedModules ? JSON.parse(savedModules) : [];
  });
  const [newModuleName, setNewModuleName] = useState(''); // For dynamic module names
  const [isAdding, setIsAdding] = useState(false); // For anti-spamming
  const [showModuleId, setShowModuleId] = useState(true); // Toggle for module ID visibility
  const [language, setLanguage] = useState('cpp'); // Default to C++ for highlighting

  // Save modules to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('codeModules', JSON.stringify(modules));
  }, [modules]);

  const addModule = () => {
    if (isAdding) return;

    setIsAdding(true);
    setModules([...modules, { 
      id: Date.now(), 
      code: '', 
      name: newModuleName || `Module ${Date.now()}`, // Use name or default to timestamp-based name
      isEditing: true // Start in editable mode by default
    }]);
    setNewModuleName(''); // Reset the name input

    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  const updateCodeInModule = (id, newCode) => {
    setModules(modules.map(module =>
      module.id === id ? { ...module, code: newCode } : module
    ));
  };

  const copyToClipboard = (code) => {
    // Preserve formatting with proper line breaks and indentation
    navigator.clipboard.writeText(code)
      .then(() => {
        alert("Code copied to clipboard with original formatting!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const deleteModule = (id) => {
    setModules(modules.filter(module => module.id !== id));
  };

  const toggleModuleId = () => {
    setShowModuleId(!showModuleId);
  };

  const toggleEditMode = (id) => {
    setModules(modules.map(module =>
      module.id === id ? { ...module, isEditing: !module.isEditing } : module
    ));
  };

  return (
    <div className="App">
      <h1>Code Cheatsheet</h1>
      <div className="controls">
        <input
          type="text"
          value={newModuleName}
          onChange={(e) => setNewModuleName(e.target.value)}
          placeholder="Enter module name..."
          className="name-input"
        />
        <button 
          onClick={addModule} 
          className={isAdding ? 'shaking' : ''}
          disabled={isAdding}
        >
          {isAdding ? 'Wait...' : 'Add Module'}
        </button>
        <button onClick={toggleModuleId}>
          {showModuleId ? 'Hide Module IDs' : 'Show Module IDs'}
        </button>
        <select 
          value={language} 
          onChange={(e) => setLanguage(e.target.value)} 
          className="language-select"
        >
          <option value="cpp">C++</option>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
        </select>
      </div>

      <div className="module-grid">
        {modules.map((module) => (
          <div key={module.id} className="module">
            <div className="module-header">
              <h2>{showModuleId ? `${module.name} (ID: ${module.id})` : module.name}</h2>
            </div>
            <div className="module-content">
              {module.isEditing ? (
                <>
                  <textarea
                    value={module.code}
                    onChange={(e) => updateCodeInModule(module.id, e.target.value)}
                    placeholder="Enter or edit code here..."
                    className="code-editor"
                    autoFocus
                  />
                  <button onClick={() => toggleEditMode(module.id)} className="edit-button">
                    <FaPencilAlt /> View
                  </button>
                </>
              ) : (
                <>
                  <SyntaxHighlighter language={language} style={vs2015} wrapLongLines showLineNumbers className="code-display">
                    {module.code}
                  </SyntaxHighlighter>
                  <button onClick={() => toggleEditMode(module.id)} className="edit-button">
                    <FaPencilAlt /> Edit
                  </button>
                </>
              )}
              <div className="button-group">
                <button onClick={() => copyToClipboard(module.code)}>
                  Copy to Clipboard
                </button>
                <button onClick={() => deleteModule(module.id)}>
                  Delete Module
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <footer className="footer">
        <div className="footer-content">
          <a href="https://github.com/your-username/your-repo" target="_blank" rel="noopener noreferrer" className="footer-link">
            GitHub Repo
          </a>
          <span className="footer-name">Camden Nystrom</span>
        </div>
      </footer>
    </div>
  );
}

export default App;