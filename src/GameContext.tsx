import React, { createContext, useContext, useState, useEffect } from 'react';
import type { GameState, NPC, Information, StoryPoint, Location } from './types';

interface GameContextType {
  gameState: GameState;
  addNPC: (npc: Omit<NPC, 'id'>) => void;
  updateNPC: (id: string, npc: Partial<NPC>) => void;
  deleteNPC: (id: string) => void;
  addInformation: (info: Omit<Information, 'id'>) => void;
  updateInformation: (id: string, info: Partial<Information>) => void;
  deleteInformation: (id: string) => void;
  addStoryPoint: (story: Omit<StoryPoint, 'id'>) => void;
  updateStoryPoint: (id: string, story: Partial<StoryPoint>) => void;
  deleteStoryPoint: (id: string) => void;
  addLocation: (location: Omit<Location, 'id'>) => void;
  updateLocation: (id: string, location: Partial<Location>) => void;
  deleteLocation: (id: string) => void;
  setActiveNPC: (id: string | null) => void;
  setActiveLocation: (id: string | null) => void;
  assignInformationToNPC: (npcId: string, infoId: string) => void;
  unassignInformationFromNPC: (npcId: string, infoId: string) => void;
  randomizeInformation: (infoIds: string[]) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const STORAGE_KEY = 'ttrpg-npc-game-state';

const defaultGameState: GameState = {
  npcs: [],
  information: [],
  storyPoints: [],
  locations: [],
  activeNPC: null,
  activeLocation: null,
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultGameState;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const addNPC = (npc: Omit<NPC, 'id'>) => {
    setGameState(prev => ({
      ...prev,
      npcs: [...prev.npcs, { ...npc, id: generateId() }],
    }));
  };

  const updateNPC = (id: string, updates: Partial<NPC>) => {
    setGameState(prev => ({
      ...prev,
      npcs: prev.npcs.map(npc => npc.id === id ? { ...npc, ...updates } : npc),
    }));
  };

  const deleteNPC = (id: string) => {
    setGameState(prev => ({
      ...prev,
      npcs: prev.npcs.filter(npc => npc.id !== id),
    }));
  };

  const addInformation = (info: Omit<Information, 'id'>) => {
    setGameState(prev => ({
      ...prev,
      information: [...prev.information, { ...info, id: generateId() }],
    }));
  };

  const updateInformation = (id: string, updates: Partial<Information>) => {
    setGameState(prev => ({
      ...prev,
      information: prev.information.map(info => info.id === id ? { ...info, ...updates } : info),
    }));
  };

  const deleteInformation = (id: string) => {
    setGameState(prev => ({
      ...prev,
      information: prev.information.filter(info => info.id !== id),
      npcs: prev.npcs.map(npc => ({
        ...npc,
        assignedInformation: npc.assignedInformation.filter(infoId => infoId !== id),
      })),
    }));
  };

  const addStoryPoint = (story: Omit<StoryPoint, 'id'>) => {
    setGameState(prev => ({
      ...prev,
      storyPoints: [...prev.storyPoints, { ...story, id: generateId() }],
    }));
  };

  const updateStoryPoint = (id: string, updates: Partial<StoryPoint>) => {
    setGameState(prev => ({
      ...prev,
      storyPoints: prev.storyPoints.map(sp => sp.id === id ? { ...sp, ...updates } : sp),
    }));
  };

  const deleteStoryPoint = (id: string) => {
    setGameState(prev => ({
      ...prev,
      storyPoints: prev.storyPoints.filter(sp => sp.id !== id),
    }));
  };

  const addLocation = (location: Omit<Location, 'id'>) => {
    setGameState(prev => ({
      ...prev,
      locations: [...prev.locations, { ...location, id: generateId() }],
    }));
  };

  const updateLocation = (id: string, updates: Partial<Location>) => {
    setGameState(prev => ({
      ...prev,
      locations: prev.locations.map(loc => loc.id === id ? { ...loc, ...updates } : loc),
    }));
  };

  const deleteLocation = (id: string) => {
    setGameState(prev => ({
      ...prev,
      locations: prev.locations.filter(loc => loc.id !== id),
    }));
  };

  const setActiveNPC = (id: string | null) => {
    setGameState(prev => ({ ...prev, activeNPC: id }));
  };

  const setActiveLocation = (id: string | null) => {
    setGameState(prev => ({ ...prev, activeLocation: id }));
  };

  const assignInformationToNPC = (npcId: string, infoId: string) => {
    setGameState(prev => ({
      ...prev,
      npcs: prev.npcs.map(npc =>
        npc.id === npcId && !npc.assignedInformation.includes(infoId)
          ? { ...npc, assignedInformation: [...npc.assignedInformation, infoId] }
          : npc
      ),
    }));
  };

  const unassignInformationFromNPC = (npcId: string, infoId: string) => {
    setGameState(prev => ({
      ...prev,
      npcs: prev.npcs.map(npc =>
        npc.id === npcId
          ? { ...npc, assignedInformation: npc.assignedInformation.filter(id => id !== infoId) }
          : npc
      ),
    }));
  };

  const randomizeInformation = (infoIds: string[]) => {
    setGameState(prev => {
      const availableNPCs = [...prev.npcs];
      const shuffledNPCs = availableNPCs.sort(() => Math.random() - 0.5);

      const updatedNPCs = prev.npcs.map(npc => ({
        ...npc,
        assignedInformation: npc.assignedInformation.filter(id => !infoIds.includes(id)),
      }));

      infoIds.forEach((infoId, index) => {
        const npcIndex = index % shuffledNPCs.length;
        const npcId = shuffledNPCs[npcIndex].id;
        const npcToUpdate = updatedNPCs.find(n => n.id === npcId);
        if (npcToUpdate && !npcToUpdate.assignedInformation.includes(infoId)) {
          npcToUpdate.assignedInformation.push(infoId);
        }
      });

      return { ...prev, npcs: updatedNPCs };
    });
  };

  const value: GameContextType = {
    gameState,
    addNPC,
    updateNPC,
    deleteNPC,
    addInformation,
    updateInformation,
    deleteInformation,
    addStoryPoint,
    updateStoryPoint,
    deleteStoryPoint,
    addLocation,
    updateLocation,
    deleteLocation,
    setActiveNPC,
    setActiveLocation,
    assignInformationToNPC,
    unassignInformationFromNPC,
    randomizeInformation,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};
