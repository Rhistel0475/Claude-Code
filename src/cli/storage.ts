import fs from 'fs-extra';
import path from 'path';
import { homedir } from 'os';
import type { CrucibleProject, ProjectBackup } from '../crucibleTypes.js';
import type { GameState } from '../types.js';

// Storage paths
const CONFIG_DIR = path.join(homedir(), '.claude-code');
const CRUCIBLE_DATA_FILE = path.join(CONFIG_DIR, 'crucible-project.json');
const GAME_DATA_FILE = path.join(CONFIG_DIR, 'game-state.json');

/**
 * Ensures the configuration directory exists
 */
async function ensureConfigDir(): Promise<void> {
  await fs.ensureDir(CONFIG_DIR);
}

/**
 * Loads the Crucible project from disk
 */
export async function loadCrucibleProject(): Promise<CrucibleProject | null> {
  try {
    await ensureConfigDir();

    if (await fs.pathExists(CRUCIBLE_DATA_FILE)) {
      const data = await fs.readJSON(CRUCIBLE_DATA_FILE);
      return data as CrucibleProject;
    }

    return null;
  } catch (error) {
    console.error('Error loading Crucible project:', error);
    return null;
  }
}

/**
 * Saves the Crucible project to disk
 */
export async function saveCrucibleProject(project: CrucibleProject): Promise<void> {
  try {
    await ensureConfigDir();
    await fs.writeJSON(CRUCIBLE_DATA_FILE, project, { spaces: 2 });
  } catch (error) {
    console.error('Error saving Crucible project:', error);
    throw error;
  }
}

/**
 * Loads the game state from disk
 */
export async function loadGameState(): Promise<GameState | null> {
  try {
    await ensureConfigDir();

    if (await fs.pathExists(GAME_DATA_FILE)) {
      const data = await fs.readJSON(GAME_DATA_FILE);
      return data as GameState;
    }

    return null;
  } catch (error) {
    console.error('Error loading game state:', error);
    return null;
  }
}

/**
 * Saves the game state to disk
 */
export async function saveGameState(state: GameState): Promise<void> {
  try {
    await ensureConfigDir();
    await fs.writeJSON(GAME_DATA_FILE, state, { spaces: 2 });
  } catch (error) {
    console.error('Error saving game state:', error);
    throw error;
  }
}

/**
 * Lists all available backup sessions
 */
export async function listBackups(): Promise<ProjectBackup[]> {
  const project = await loadCrucibleProject();

  if (!project || !project.backups) {
    return [];
  }

  // Sort backups by timestamp (newest first)
  return [...project.backups].sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

/**
 * Restores a backup by ID
 */
export async function restoreBackup(sessionId: string): Promise<boolean> {
  const project = await loadCrucibleProject();

  if (!project || !project.backups) {
    throw new Error('No project data found');
  }

  const backup = project.backups.find(b => b.id === sessionId);

  if (!backup) {
    throw new Error(`Session '${sessionId}' not found`);
  }

  try {
    // Parse the backup data
    const restoredProject: CrucibleProject = JSON.parse(backup.projectData);

    // Preserve the current backups array (don't overwrite it with the backup's version)
    restoredProject.backups = project.backups;

    // Save the restored project
    await saveCrucibleProject(restoredProject);

    return true;
  } catch (error) {
    console.error('Error restoring backup:', error);
    throw new Error(`Failed to restore session: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Gets the configuration directory path
 */
export function getConfigDir(): string {
  return CONFIG_DIR;
}
