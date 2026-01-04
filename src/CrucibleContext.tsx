import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type {
  CrucibleProject,
  ProjectMetadata,
  Beat,
  ForgePoint,
  StrandMap,
  Character,
  MercyEntry,
  Chapter,
  PlanningDocument,
  ProjectBackup
} from './crucibleTypes';
import {
  MOVEMENTS,
  FORGE_POINTS_CONFIG
} from './crucibleTypes';

interface CrucibleContextType {
  project: CrucibleProject | null;
  saveStatus: 'saved' | 'saving' | 'error';
  lastSaved: Date | null;
  createNewProject: (metadata: ProjectMetadata) => void;
  updateMetadata: (metadata: Partial<ProjectMetadata>) => void;
  updateStrandMap: (type: 'quest' | 'fire' | 'constellation', strandMap: StrandMap) => void;
  updateBeat: (beatId: string, updates: Partial<Beat>) => void;
  updateForgePoint: (forgePointId: string, updates: Partial<ForgePoint>) => void;
  addCharacter: (character: Character) => void;
  updateCharacter: (characterId: string, updates: Partial<Character>) => void;
  deleteCharacter: (characterId: string) => void;
  addMercyEntry: (entry: MercyEntry) => void;
  updateMercyEntry: (entryId: string, updates: Partial<MercyEntry>) => void;
  deleteMercyEntry: (entryId: string) => void;
  addChapter: (chapter: Chapter) => void;
  updateChapter: (chapterId: string, updates: Partial<Chapter>) => void;
  deleteChapter: (chapterId: string) => void;
  addPlanningDoc: (doc: PlanningDocument) => void;
  updatePlanningDoc: (docId: string, updates: Partial<PlanningDocument>) => void;
  deletePlanningDoc: (docId: string) => void;
  createBackup: (note: string) => void;
  restoreBackup: (backupId: string) => void;
  deleteBackup: (backupId: string) => void;
  exportProject: () => string;
  importProject: (jsonData: string) => void;
  clearProject: () => void;
}

const CrucibleContext = createContext<CrucibleContextType | undefined>(undefined);

const STORAGE_KEY = 'crucible-project';

// Initialize default beats based on movements
const initializeBeats = (): Beat[] => {
  const beats: Beat[] = [];
  let beatNumber = 1;

  for (const movement of MOVEMENTS) {
    const [start, end] = movement.beatRange;
    const beatsInMovement = end - start + 1;

    for (let i = 0; i < beatsInMovement; i++) {
      const percentage = movement.percentage * (i + 1) / beatsInMovement;
      const isForgePoint = FORGE_POINTS_CONFIG.some(fp => fp.beatNumber === beatNumber);

      beats.push({
        id: `beat-${beatNumber}`,
        number: beatNumber,
        movement: movement.type,
        title: `Beat ${beatNumber}`,
        description: '',
        questStrand: '',
        fireStrand: '',
        constellationStrand: '',
        percentagePoint: percentage,
        isForgePoint
      });

      beatNumber++;
    }
  }

  return beats;
};

// Initialize default forge points
const initializeForgePoints = (): ForgePoint[] => {
  return FORGE_POINTS_CONFIG.map((config, index) => ({
    id: `forge-point-${index + 1}`,
    name: config.name,
    beatNumber: config.beatNumber,
    percentagePoint: config.percentage,
    description: config.description,
    questConvergence: '',
    fireConvergence: '',
    constellationConvergence: '',
    stakes: '',
    sacrifice: ''
  }));
};

export const CrucibleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [project, setProject] = useState<CrucibleProject | null>(null);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [tabId] = useState(() => `tab-${Date.now()}-${Math.random()}`);

  // Load project from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Convert date strings back to Date objects
        parsed.metadata.createdAt = new Date(parsed.metadata.createdAt);
        parsed.metadata.lastModified = new Date(parsed.metadata.lastModified);
        parsed.backups = parsed.backups.map((b: ProjectBackup) => ({
          ...b,
          timestamp: new Date(b.timestamp)
        }));
        setProject(parsed);
        setLastSaved(new Date(parsed.metadata.lastModified));
      } catch (error) {
        console.error('Error loading project:', error);
        setSaveStatus('error');
      }
    }
  }, []);

  // Save project to localStorage whenever it changes
  useEffect(() => {
    if (project) {
      setSaveStatus('saving');

      try {
        // Add debounce to prevent too many saves
        const timeoutId = setTimeout(() => {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
          localStorage.setItem('crucible-last-tab', tabId);
          setSaveStatus('saved');
          setLastSaved(new Date());
        }, 300);

        return () => clearTimeout(timeoutId);
      } catch (error) {
        console.error('Error saving project:', error);
        setSaveStatus('error');
      }
    }
  }, [project, tabId]);

  // Detect conflicts from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue && project) {
        const lastTab = localStorage.getItem('crucible-last-tab');
        if (lastTab !== tabId) {
          // Another tab made changes
          const shouldReload = confirm(
            'This project was modified in another tab. Would you like to reload to see the latest changes? (Unsaved changes in this tab will be lost)'
          );
          if (shouldReload) {
            window.location.reload();
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [project, tabId]);

  const createNewProject = (metadata: ProjectMetadata) => {
    const newProject: CrucibleProject = {
      metadata: {
        ...metadata,
        createdAt: new Date(),
        lastModified: new Date(),
        currentPhase: 'planning'
      },
      planningDocs: [],
      strandMaps: {
        quest: {
          type: 'quest',
          summary: '',
          arc: [],
          keyMoments: []
        },
        fire: {
          type: 'fire',
          summary: '',
          arc: [],
          keyMoments: []
        },
        constellation: {
          type: 'constellation',
          summary: '',
          arc: [],
          keyMoments: []
        }
      },
      beats: initializeBeats(),
      forgePoints: initializeForgePoints(),
      characters: [],
      mercyLedger: [],
      chapters: [],
      backups: []
    };

    setProject(newProject);
  };

  const updateMetadata = (updates: Partial<ProjectMetadata>) => {
    if (!project) return;
    setProject({
      ...project,
      metadata: {
        ...project.metadata,
        ...updates,
        lastModified: new Date()
      }
    });
  };

  const updateStrandMap = (type: 'quest' | 'fire' | 'constellation', strandMap: StrandMap) => {
    if (!project) return;
    setProject({
      ...project,
      strandMaps: {
        ...project.strandMaps,
        [type]: strandMap
      },
      metadata: {
        ...project.metadata,
        lastModified: new Date()
      }
    });
  };

  const updateBeat = (beatId: string, updates: Partial<Beat>) => {
    if (!project) return;
    setProject({
      ...project,
      beats: project.beats.map(beat =>
        beat.id === beatId ? { ...beat, ...updates } : beat
      ),
      metadata: {
        ...project.metadata,
        lastModified: new Date()
      }
    });
  };

  const updateForgePoint = (forgePointId: string, updates: Partial<ForgePoint>) => {
    if (!project) return;
    setProject({
      ...project,
      forgePoints: project.forgePoints.map(fp =>
        fp.id === forgePointId ? { ...fp, ...updates } : fp
      ),
      metadata: {
        ...project.metadata,
        lastModified: new Date()
      }
    });
  };

  const addCharacter = (character: Character) => {
    if (!project) return;
    setProject({
      ...project,
      characters: [...project.characters, character],
      metadata: {
        ...project.metadata,
        lastModified: new Date()
      }
    });
  };

  const updateCharacter = (characterId: string, updates: Partial<Character>) => {
    if (!project) return;
    setProject({
      ...project,
      characters: project.characters.map(char =>
        char.id === characterId ? { ...char, ...updates } : char
      ),
      metadata: {
        ...project.metadata,
        lastModified: new Date()
      }
    });
  };

  const deleteCharacter = (characterId: string) => {
    if (!project) return;
    setProject({
      ...project,
      characters: project.characters.filter(char => char.id !== characterId),
      metadata: {
        ...project.metadata,
        lastModified: new Date()
      }
    });
  };

  const addMercyEntry = (entry: MercyEntry) => {
    if (!project) return;
    setProject({
      ...project,
      mercyLedger: [...project.mercyLedger, entry],
      metadata: {
        ...project.metadata,
        lastModified: new Date()
      }
    });
  };

  const updateMercyEntry = (entryId: string, updates: Partial<MercyEntry>) => {
    if (!project) return;
    setProject({
      ...project,
      mercyLedger: project.mercyLedger.map(entry =>
        entry.id === entryId ? { ...entry, ...updates } : entry
      ),
      metadata: {
        ...project.metadata,
        lastModified: new Date()
      }
    });
  };

  const deleteMercyEntry = (entryId: string) => {
    if (!project) return;
    setProject({
      ...project,
      mercyLedger: project.mercyLedger.filter(entry => entry.id !== entryId),
      metadata: {
        ...project.metadata,
        lastModified: new Date()
      }
    });
  };

  const addChapter = (chapter: Chapter) => {
    if (!project) return;
    setProject({
      ...project,
      chapters: [...project.chapters, chapter].sort((a, b) => a.number - b.number),
      metadata: {
        ...project.metadata,
        lastModified: new Date()
      }
    });
  };

  const updateChapter = (chapterId: string, updates: Partial<Chapter>) => {
    if (!project) return;
    setProject({
      ...project,
      chapters: project.chapters.map(chapter =>
        chapter.id === chapterId ? { ...chapter, ...updates } : chapter
      ),
      metadata: {
        ...project.metadata,
        lastModified: new Date()
      }
    });
  };

  const deleteChapter = (chapterId: string) => {
    if (!project) return;
    setProject({
      ...project,
      chapters: project.chapters.filter(chapter => chapter.id !== chapterId),
      metadata: {
        ...project.metadata,
        lastModified: new Date()
      }
    });
  };

  const addPlanningDoc = (doc: PlanningDocument) => {
    if (!project) return;
    setProject({
      ...project,
      planningDocs: [...project.planningDocs, doc],
      metadata: {
        ...project.metadata,
        lastModified: new Date()
      }
    });
  };

  const updatePlanningDoc = (docId: string, updates: Partial<PlanningDocument>) => {
    if (!project) return;
    setProject({
      ...project,
      planningDocs: project.planningDocs.map(doc =>
        doc.id === docId ? { ...doc, ...updates, lastModified: new Date() } : doc
      ),
      metadata: {
        ...project.metadata,
        lastModified: new Date()
      }
    });
  };

  const deletePlanningDoc = (docId: string) => {
    if (!project) return;
    setProject({
      ...project,
      planningDocs: project.planningDocs.filter(doc => doc.id !== docId),
      metadata: {
        ...project.metadata,
        lastModified: new Date()
      }
    });
  };

  const createBackup = (note: string) => {
    if (!project) return;
    const backup: ProjectBackup = {
      id: `backup-${Date.now()}`,
      timestamp: new Date(),
      projectData: JSON.stringify(project),
      note
    };
    setProject({
      ...project,
      backups: [...project.backups, backup]
    });
  };

  const restoreBackup = (backupId: string) => {
    if (!project) return;
    const backup = project.backups.find(b => b.id === backupId);
    if (backup) {
      const restoredProject = JSON.parse(backup.projectData);
      setProject(restoredProject);
    }
  };

  const deleteBackup = (backupId: string) => {
    if (!project) return;
    setProject({
      ...project,
      backups: project.backups.filter(b => b.id !== backupId)
    });
  };

  const exportProject = (): string => {
    if (!project) return '';
    return JSON.stringify(project, null, 2);
  };

  const importProject = (jsonData: string) => {
    try {
      const imported = JSON.parse(jsonData);
      // Convert date strings back to Date objects
      imported.metadata.createdAt = new Date(imported.metadata.createdAt);
      imported.metadata.lastModified = new Date(imported.metadata.lastModified);
      imported.backups = imported.backups.map((b: ProjectBackup) => ({
        ...b,
        timestamp: new Date(b.timestamp)
      }));
      setProject(imported);
    } catch (error) {
      console.error('Error importing project:', error);
      throw new Error('Invalid project data');
    }
  };

  const clearProject = () => {
    setProject(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <CrucibleContext.Provider
      value={{
        project,
        saveStatus,
        lastSaved,
        createNewProject,
        updateMetadata,
        updateStrandMap,
        updateBeat,
        updateForgePoint,
        addCharacter,
        updateCharacter,
        deleteCharacter,
        addMercyEntry,
        updateMercyEntry,
        deleteMercyEntry,
        addChapter,
        updateChapter,
        deleteChapter,
        addPlanningDoc,
        updatePlanningDoc,
        deletePlanningDoc,
        createBackup,
        restoreBackup,
        deleteBackup,
        exportProject,
        importProject,
        clearProject
      }}
    >
      {children}
    </CrucibleContext.Provider>
  );
};

export const useCrucible = () => {
  const context = useContext(CrucibleContext);
  if (context === undefined) {
    throw new Error('useCrucible must be used within a CrucibleProvider');
  }
  return context;
};
