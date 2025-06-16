import { Document, User } from '../types';

export const users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: '👨‍💻',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: '👩‍🎨',
  },
];

export const documents: Document[] = [
  {
    id: '1',
    title: 'Welcome to Your Workspace',
    content: `# Welcome to Your Workspace 🎉

Welcome to your new document editor! This is a Notion-like interface built with modern web technologies.

## Getting Started

Here are some things you can do:

- **Create new documents** using the sidebar
- **Edit content** with our rich text editor
- **Organize your thoughts** with headers, lists, and more
- **Use markdown** for quick formatting

## Features

### Rich Text Editing
- Headers (H1, H2, H3)
- **Bold** and *italic* text
- \`Inline code\` and code blocks
- > Blockquotes for emphasis
- Lists (ordered and unordered)

### Collaboration Ready
- Multiple user support
- Real-time editing capabilities
- Document sharing and permissions

## What's Next?

Start creating your first document and explore all the features available. Happy writing! ✍️

---

*Last updated: ${new Date().toLocaleDateString()}*`,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date(),
    authorId: '1',
    isPublic: false,
    emoji: '🎉',
  },
  {
    id: '2',
    title: 'Project Planning',
    content: `# Project Planning 📋

## Overview
This document outlines our project planning process and methodologies.

### Goals
1. Define project scope
2. Identify key stakeholders
3. Create timeline and milestones
4. Allocate resources effectively

### Timeline
- **Week 1-2**: Requirements gathering
- **Week 3-4**: Design and architecture
- **Week 5-8**: Development phase
- **Week 9-10**: Testing and deployment

## Resources Needed
- Development team (3-4 developers)
- Design team (1-2 designers)
- Project manager
- Quality assurance team

### Budget Considerations
Initial budget estimate: $50,000 - $75,000

## Next Steps
- [ ] Finalize requirements
- [ ] Assign team members
- [ ] Set up project management tools
- [ ] Begin development phase`,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date(),
    authorId: '1',
    isPublic: true,
    emoji: '📋',
  },
  {
    id: '3',
    title: 'Meeting Notes',
    content: `# Team Meeting Notes 📝

**Date:** ${new Date().toLocaleDateString()}  
**Attendees:** John Doe, Jane Smith, Alex Johnson  
**Duration:** 1 hour

## Agenda Items

### 1. Project Status Update
- Current progress: 65% complete
- Blockers: API integration delays
- Timeline: Still on track for next week

### 2. Technical Discussions
- Database migration completed successfully
- New authentication system implemented
- Performance improvements identified

### 3. Action Items
- [ ] John: Complete API documentation
- [ ] Jane: Finalize UI designs
- [ ] Alex: Set up monitoring system

## Decisions Made
1. Move to weekly sprint cycles
2. Implement code review process
3. Schedule client demo for Friday

## Next Meeting
**Date:** Next Monday at 10:00 AM  
**Location:** Conference Room A`,
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date(),
    authorId: '2',
    isPublic: false,
    emoji: '📝',
  },
];