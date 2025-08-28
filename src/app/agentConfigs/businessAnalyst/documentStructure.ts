export interface DocumentChapter {
  id: string;
  title: string;
  responsibleAgent: string;
  isCompleted: boolean;
  subChapters?: DocumentChapter[];
}

export const documentStructure: DocumentChapter[] = [
  {
    id: '1',
    title: '1. Popis požadavku',
    responsibleAgent: '',
    isCompleted: false,
    subChapters: [
      {
        id: '1.1',
        title: '1.1 Základní popis business požadavku',
        responsibleAgent: 'Concept Analyst',
        isCompleted: false
      },
      {
        id: '1.2',
        title: '1.2 Důvody a cíle požadavku',
        responsibleAgent: 'Business Architect',
        isCompleted: false
      },
      {
        id: '1.3',
        title: '1.3 Co není součástí požadavku',
        responsibleAgent: 'Scope Architect',
        isCompleted: false
      }
    ]
  },
  {
    id: '2',
    title: '2. AS-IS Stav',
    responsibleAgent: '',
    isCompleted: false,
    subChapters: [
      {
        id: '2.1',
        title: '2.1 Popis AS-IS stavu',
        responsibleAgent: 'Business Architect',
        isCompleted: false
      }
    ]
  },
  {
    id: '3',
    title: '3. TO-BE Stav',
    responsibleAgent: '',
    isCompleted: false,
    subChapters: [
      {
        id: '3.1',
        title: '3.1 Popis TO-BE stavu',
        responsibleAgent: 'Design Architect',
        isCompleted: false
      },
      {
        id: '3.2',
        title: '3.2 Vizualizace navrhovaných změn',
        responsibleAgent: 'Design Architect + Impact Analyst',
        isCompleted: false
      },
      {
        id: '3.3',
        title: '3.3 Analýza požadavků na business data',
        responsibleAgent: 'Data Analyst',
        isCompleted: false
      },
      {
        id: '3.4',
        title: '3.4 Business nefunkční požadavky',
        responsibleAgent: 'Non-functional Analyst',
        isCompleted: false
      }
    ]
  },
  {
    id: '4',
    title: '4. Akceptační kritéria',
    responsibleAgent: 'Quality Analyst',
    isCompleted: false
  }
];

// Helper function to get completion status
export function getDocumentCompletionStatus(): { completed: number; total: number } {
  let completed = 0;
  let total = 0;

  const countChapters = (chapters: DocumentChapter[]) => {
    chapters.forEach(chapter => {
      if (chapter.responsibleAgent) {
        total++;
        if (chapter.isCompleted) completed++;
      }
      if (chapter.subChapters) {
        countChapters(chapter.subChapters);
      }
    });
  };

  countChapters(documentStructure);
  return { completed, total };
}

// Helper function to update chapter status
export function updateChapterStatus(chapterId: string, isCompleted: boolean): void {
  const updateChapter = (chapters: DocumentChapter[]): boolean => {
    for (const chapter of chapters) {
      if (chapter.id === chapterId) {
        chapter.isCompleted = isCompleted;
        return true;
      }
      if (chapter.subChapters) {
        if (updateChapter(chapter.subChapters)) {
          // Update parent chapter status based on subchapters
          chapter.isCompleted = chapter.subChapters.every(sub => 
            !sub.responsibleAgent || sub.isCompleted
          );
          return true;
        }
      }
    }
    return false;
  };

  updateChapter(documentStructure);
}

// Helper to get status by agent name
export function getChaptersByAgent(agentName: string): DocumentChapter[] {
  const chapters: DocumentChapter[] = [];
  
  const findChapters = (chapterList: DocumentChapter[]) => {
    chapterList.forEach(chapter => {
      if (chapter.responsibleAgent?.includes(agentName)) {
        chapters.push(chapter);
      }
      if (chapter.subChapters) {
        findChapters(chapter.subChapters);
      }
    });
  };

  findChapters(documentStructure);
  return chapters;
}