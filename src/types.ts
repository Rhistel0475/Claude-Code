export interface NPC {
  id: string;
  name: string;
  role: string;
  location: string;
  description: string;
  assignedInformation: string[]; // IDs of information pieces
}

export interface Information {
  id: string;
  title: string;
  content: string;
  isRevealed: boolean;
  category?: string; // e.g., "main quest", "side quest", "lore"
}

export interface StoryPoint {
  id: string;
  title: string;
  description: string;
  relatedInformation: string[]; // IDs of related information
}

export interface Location {
  id: string;
  name: string;
  description: string;
  commonNPCs: string[]; // IDs of NPCs typically found here
}

export interface GameState {
  npcs: NPC[];
  information: Information[];
  storyPoints: StoryPoint[];
  locations: Location[];
  activeNPC: string | null;
  activeLocation: string | null;
}
