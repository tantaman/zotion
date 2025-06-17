import React, {useState} from 'react';
import {Menu, Share, MoreHorizontal, Star} from 'lucide-react';
import {MilkdownEditor} from './MilkdownEditor';
import {DocId} from '../../zero/schema';
import {useQuery, useZero} from '@rocicorp/zero/react';
import {doc, docBody} from '../../zero/queries';
import {useCachedProp} from '../hooks/cachedProp';
import {updateDoc, updateDocBody} from '../../zero/mutators';

interface EditorProps {
  documentId: DocId;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

const Editor: React.FC<EditorProps> = ({
  documentId,
  onToggleSidebar,
  sidebarOpen,
}) => {
  const zero = useZero();
  const [body] = useQuery(docBody(documentId));
  const [document] = useQuery(doc(documentId));

  // CUT: Having to save the body off into `useState` is annoying.
  // We need to somehow sync it from the DB state...
  // CUT: this filter to keep last state is annoying in order to prevent a flicker.
  // A cache is also possible but we don't want to keep the query open, just delay removing the current content
  // until the new content is ready.
  const [content, setContent, contentDirty] = useCachedProp(
    body?.content ?? '',
    v => !!v,
  );
  const [title, setTitle, titleDirty] = useCachedProp(
    document?.title ?? '',
    v => !!v,
  );
  const isSaved = !contentDirty && !titleDirty;
  const [contentSaveHandle, setContentSaveHandle] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);
  const [titleSaveHandle, setTitleSaveHandle] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);

    if (contentSaveHandle != null) {
      clearTimeout(contentSaveHandle);
    }

    setContentSaveHandle(
      setTimeout(() => {
        updateDocBody(zero, {
          documentId: documentId,
          content: newContent,
        });
      }, 2000),
    );
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);

    if (titleSaveHandle != null) {
      clearTimeout(titleSaveHandle);
    }

    setTitleSaveHandle(
      setTimeout(() => {
        updateDoc(zero, {
          id: documentId,
          title: newTitle,
        });
      }, 2000),
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2">
            <span className="text-2xl">{document?.emoji || '📄'}</span>
            <div>
              <input
                type="text"
                value={title}
                onChange={e => handleTitleChange(e.target.value)}
                className="w-fit text-lg font-semibold bg-transparent border-none outline-none focus:bg-gray-50 px-2 py-1 rounded"
                placeholder="Untitled"
                style={{width: `${title.length}ch`, minWidth: '40ch'}}
              />
              <div className="flex items-center space-x-2 text-xs text-gray-500 px-2">
                <span>
                  Last edited{' '}
                  {new Date(document?.modified ?? 0).toLocaleDateString()}
                </span>
                {!isSaved && (
                  <span className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                    <span>Saving...</span>
                  </span>
                )}
                {isSaved && <span className="text-green-600">Saved</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Star className="w-5 h-5" />
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Share className="w-4 h-4 inline mr-2" />
            Share
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        {/* CUT: Content set to content from the db so we only refresh the markdown on db content change.
        This is still ass since it requires re-creating the entire doc on any event coming out of the db.
        We need a different way to sync collaborative text.
        1. Local edits are already applied to the document model so we do not need to re-incorporate them
        2. Remote edits should result in surgical changes
        */}
        <MilkdownEditor
          content={body?.content ?? content}
          handleContentChange={handleContentChange}
        />
      </div>
    </div>
  );
};

export default Editor;
