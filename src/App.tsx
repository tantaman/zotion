import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import { Document, User } from './types';
import { documents, users } from './data/data';

function App() {
  const [currentUser] = useState<User>(users[0]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (documents.length > 0) {
      setSelectedDocument(documents[0]);
    }
  }, []);

  return (
    <div className="flex h-screen bg-white">
      <Sidebar
        documents={documents}
        selectedDocument={selectedDocument}
        onSelectDocument={setSelectedDocument}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        currentUser={currentUser}
      />
      <main className={`flex-1 transition-all duration-300 ${
        sidebarOpen ? 'ml-64' : 'ml-0'
      }`}>
        {selectedDocument ? (
          <Editor
            document={selectedDocument}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            sidebarOpen={sidebarOpen}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Select a document to start editing</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;