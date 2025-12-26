// The Crucible Writing System - Type Definitions

export type StrandType = 'quest' | 'fire' | 'constellation';

export type MovementType =
  | 'ignition'           // 10%
  | 'first-tempering'    // 20%
  | 'scattering'         // 25%
  | 'brightest-burning'  // 25%
  | 'final-forging'      // 15%
  | 'tempered-blade';    // 5%

export interface Beat {
  id: string;
  number: number; // 1-36
  movement: MovementType;
  title: string;
  description: string;
  questStrand: string;
  fireStrand: string;
  constellationStrand: string;
  percentagePoint: number; // Where this beat falls in the story
  isForgePoint: boolean;
}

export interface ForgePoint {
  id: string;
  name: string;
  beatNumber: number;
  percentagePoint: number;
  description: string;
  questConvergence: string;
  fireConvergence: string;
  constellationConvergence: string;
  stakes: string;
  sacrifice: string;
}

export interface StrandMap {
  type: StrandType;
  summary: string;
  arc: string[];
  keyMoments: {
    beatNumber: number;
    description: string;
  }[];
}

export interface Character {
  id: string;
  name: string;
  role: string;
  arc: string;
  relationships: {
    characterId: string;
    description: string;
  }[];
  darkMirror?: boolean; // Is this the antagonist/dark mirror?
}

export interface MercyEntry {
  id: string;
  beatNumber: number;
  compassionateAct: string;
  plantedAt: string; // Chapter/scene reference
  payoffAt?: string; // Where it pays off (usually climax)
  status: 'planted' | 'brewing' | 'paid-off';
}

export interface PlanningDocument {
  id: string;
  type: 'crucible-thesis' | 'quest-map' | 'fire-map' | 'constellation-map' |
        'forge-point' | 'dark-mirror' | 'constellation-bible' | 'mercy-ledger' | 'world-forge';
  title: string;
  content: string;
  lastModified: Date;
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  wordCount: number;
  targetWordCount: number;
  beats: number[]; // Which beats this chapter covers
  outline: string;
  prose: string;
  status: 'outlined' | 'drafting' | 'drafted' | 'revised' | 'final';
  notes: string;
}

export interface WordGoalTracking {
  dailyGoal: number;
  weeklyGoal: number;
  currentStreak: number;
  longestStreak: number;
  lastWriteDate: string; // ISO date string
  writingHistory: Array<{
    date: string; // ISO date string
    wordsWritten: number;
  }>;
}

export interface ProjectMetadata {
  title: string;
  author: string;
  genre: string;
  targetWordCount: number;
  premise: string;
  theme: string;
  createdAt: Date;
  lastModified: Date;
  currentPhase: 'planning' | 'outlining' | 'drafting' | 'editing';
  wordGoals?: WordGoalTracking;
}

export interface CrucibleProject {
  metadata: ProjectMetadata;
  planningDocs: PlanningDocument[];
  strandMaps: {
    quest: StrandMap;
    fire: StrandMap;
    constellation: StrandMap;
  };
  beats: Beat[];
  forgePoints: ForgePoint[];
  characters: Character[];
  mercyLedger: MercyEntry[];
  chapters: Chapter[];
  backups: ProjectBackup[];
}

export interface ProjectBackup {
  id: string;
  timestamp: Date;
  projectData: string; // JSON stringified project
  note: string;
}

// Movement configuration
export const MOVEMENTS: {
  type: MovementType;
  name: string;
  percentage: number;
  description: string;
  beatRange: [number, number];
}[] = [
  {
    type: 'ignition',
    name: 'Ignition',
    percentage: 10,
    description: 'Establish foundation',
    beatRange: [1, 6]
  },
  {
    type: 'first-tempering',
    name: 'First Tempering',
    percentage: 20,
    description: 'Development through adversity',
    beatRange: [7, 11]
  },
  {
    type: 'scattering',
    name: 'Scattering',
    percentage: 25,
    description: 'Expansion and fragmentation',
    beatRange: [12, 18]
  },
  {
    type: 'brightest-burning',
    name: 'Brightest Burning',
    percentage: 25,
    description: 'Mastery and convergence',
    beatRange: [19, 27]
  },
  {
    type: 'final-forging',
    name: 'Final Forging',
    percentage: 15,
    description: 'Crisis and transcendence',
    beatRange: [28, 33]
  },
  {
    type: 'tempered-blade',
    name: 'Tempered Blade (Coda)',
    percentage: 5,
    description: 'Resolution and revelation',
    beatRange: [34, 36]
  }
];

// Five Forge Points configuration
export const FORGE_POINTS_CONFIG: {
  name: string;
  beatNumber: number;
  percentage: number;
  description: string;
}[] = [
  {
    name: 'Ignition Forge',
    beatNumber: 6,
    percentage: 10,
    description: 'Threshold destruction; irreversible commitment'
  },
  {
    name: 'First Crucible',
    beatNumber: 11,
    percentage: 25,
    description: 'Crisis requiring sacrifice'
  },
  {
    name: 'Second Crucible',
    beatNumber: 21,
    percentage: 50,
    description: 'Escalated stakes and choice'
  },
  {
    name: 'Third Crucible',
    beatNumber: 28,
    percentage: 75,
    description: 'Deepest sacrifice before finale'
  },
  {
    name: 'Apex Willed Surrender',
    beatNumber: 33,
    percentage: 90,
    description: 'Voluntary essential surrender'
  }
];
