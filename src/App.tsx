import {useState} from 'react';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import {useQuery} from '@rocicorp/zero/react';
import {allDocTitles, user, workspace} from '../zero/queries';
import {DocId, UserId, WorkspaceId} from '../zero/schema';

function App({
  workspaceId,
  userId,
}: {
  workspaceId: WorkspaceId;
  userId: UserId;
}) {
  const [documents] = useQuery(allDocTitles(workspaceId));
  const [currentUser] = useQuery(user(userId), userId != null);
  const [currentWorkspace] = useQuery(workspace(workspaceId));
  // CUT: this is a problem for managing selected document state since the
  // content of the doc can change. E.g., title changes and this object is wrong.
  // That will not update the doc saved off into state here.
  // Instead we save off doc id rather than doc object.
  const [selectedDocumentId, setSelectedDocumentId] = useState<DocId | null>(
    null,
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!currentUser || !currentWorkspace) {
    return null;
  }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar
        documents={documents}
        selectedDocument={selectedDocumentId}
        onSelectDocument={setSelectedDocumentId}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        currentUser={currentUser}
        currentWorkspace={currentWorkspace}
      />
      <main
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-0'
        }`}
      >
        {selectedDocumentId ? (
          <Editor
            documentId={selectedDocumentId}
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
