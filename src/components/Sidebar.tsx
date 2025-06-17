import React, {useState} from 'react';
import {FileText, Plus, Search, Settings, X} from 'lucide-react';
import {Document, User as UserType} from '../../zero/schema';

interface SidebarProps {
  documents: Document[];
  selectedDocument: Document | null;
  onSelectDocument: (document: Document) => void;
  isOpen: boolean;
  onToggle: () => void;
  currentUser: UserType;
}

const Sidebar: React.FC<SidebarProps> = ({
  documents,
  selectedDocument,
  onSelectDocument,
  isOpen,
  onToggle,
  currentUser,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['documents']),
  );

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed left-0 top-0 h-full w-64 bg-notion-gray-50 border-r border-notion-gray-200 
        transform transition-transform duration-300 z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-notion-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              Z
            </div>
            <span className="font-semibold text-gray-900">Zero</span>
          </div>
          <button
            onClick={onToggle}
            className="p-1 hover:bg-notion-gray-200 rounded lg:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-notion-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 pb-4">
          {/* Quick Actions */}
          <div className="mb-6">
            <button className="w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-notion-gray-200 rounded-lg transition-colors">
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">New Document</span>
            </button>
          </div>

          {/* Documents Section */}
          <div className="mb-4">
            <button
              onClick={() => toggleSection('documents')}
              className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-notion-gray-200 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span className="text-sm font-medium">Documents</span>
              </div>
              <span className="text-xs text-gray-500">
                {filteredDocuments.length}
              </span>
            </button>

            {expandedSections.has('documents') && (
              <div className="mt-2 space-y-1">
                {filteredDocuments.map(doc => (
                  <button
                    key={doc.id}
                    onClick={() => onSelectDocument(doc)}
                    className={`w-full flex items-center space-x-2 px-3 py-2 text-left rounded-lg transition-colors ${
                      selectedDocument?.id === doc.id
                        ? 'bg-blue-100 text-blue-900'
                        : 'hover:bg-notion-gray-200 text-gray-700'
                    }`}
                  >
                    <span className="text-sm pl-3">{doc.emoji || '📄'}</span>
                    <span className="text-sm truncate flex-1">{doc.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-notion-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-sm">
              {currentUser.avatarUrl || currentUser.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {currentUser.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {currentUser.email}
              </p>
            </div>
            <button className="p-1 hover:bg-notion-gray-200 rounded">
              <Settings className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
