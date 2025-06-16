import React, { useEffect, useState } from "react";
import { Menu, Share, MoreHorizontal, Star } from "lucide-react";
import { Document } from "../types";
import { MilkdownEditor } from "./MilkdownEditor";

interface EditorProps {
  document: Document;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

const Editor: React.FC<EditorProps> = ({
  document,
  onToggleSidebar,
  sidebarOpen,
}) => {
  const [content, setContent] = useState(document.content);
  const [title, setTitle] = useState(document.title);
  const [isSaved, setIsSaved] = useState(true);

  useEffect(() => {
    setContent(document.content);
    setTitle(document.title);
  }, [document]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setIsSaved(false);

    // Simulate auto-save
    setTimeout(() => {
      setIsSaved(true);
    }, 2000);
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    setIsSaved(false);

    // Simulate auto-save
    setTimeout(() => {
      setIsSaved(true);
    }, 2000);
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
            <span className="text-2xl">{document.emoji || "📄"}</span>
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-fit text-lg font-semibold bg-transparent border-none outline-none focus:bg-gray-50 px-2 py-1 rounded"
                placeholder="Untitled"
                style={{ width: `${title.length}ch` }}
              />
              <div className="flex items-center space-x-2 text-xs text-gray-500 px-2">
                <span>
                  Last edited {document.updatedAt.toLocaleDateString()}
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
        <MilkdownEditor content={content} />
      </div>
    </div>
  );
};

export default Editor;
