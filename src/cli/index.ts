#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { listBackups, restoreBackup, getConfigDir } from './storage.js';

const program = new Command();

program
  .name('claude')
  .description('CLI tool for Claude Code - TTRPG NPC Manager & The Crucible Writing System')
  .version('0.0.0');

// Teleport command - restore a specific session
program
  .command('teleport')
  .alias('tp')
  .description('Teleport to a specific backup session')
  .argument('<session-id>', 'The session/backup ID to restore')
  .action(async (sessionId: string) => {
    try {
      console.log(chalk.blue(`\n🔮 Teleporting to session: ${sessionId}...`));

      await restoreBackup(sessionId);

      console.log(chalk.green('✓ Successfully restored session!'));
      console.log(chalk.gray(`\nData location: ${getConfigDir()}`));
    } catch (error) {
      console.error(chalk.red(`✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`));
      process.exit(1);
    }
  });

// Option 2: Support --teleport flag
program
  .option('--teleport <session-id>', 'Teleport to a specific session')
  .action((options) => {
    if (options.teleport) {
      // Execute teleport command
      restoreBackup(options.teleport)
        .then(() => {
          console.log(chalk.green(`✓ Successfully teleported to session: ${options.teleport}`));
          console.log(chalk.gray(`\nData location: ${getConfigDir()}`));
        })
        .catch((error) => {
          console.error(chalk.red(`✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`));
          process.exit(1);
        });
    }
  });

// List sessions command
program
  .command('sessions')
  .alias('ls')
  .description('List all available backup sessions')
  .action(async () => {
    try {
      const backups = await listBackups();

      if (backups.length === 0) {
        console.log(chalk.yellow('\n⚠ No backup sessions found'));
        console.log(chalk.gray(`Data location: ${getConfigDir()}\n`));
        return;
      }

      console.log(chalk.blue('\n📚 Available Sessions:\n'));

      backups.forEach((backup, index) => {
        const timestamp = new Date(backup.timestamp).toLocaleString();
        const note = backup.note ? chalk.gray(` - ${backup.note}`) : '';

        console.log(`${chalk.cyan((index + 1).toString().padStart(2, ' '))}. ${chalk.green(backup.id)}`);
        console.log(`    ${chalk.gray(timestamp)}${note}\n`);
      });

      console.log(chalk.gray(`Total: ${backups.length} session(s)`));
      console.log(chalk.gray(`Data location: ${getConfigDir()}\n`));
    } catch (error) {
      console.error(chalk.red(`✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`));
      process.exit(1);
    }
  });

// Info command - show configuration info
program
  .command('info')
  .description('Show configuration and data location')
  .action(() => {
    console.log(chalk.blue('\n📋 Claude Code Configuration:\n'));
    console.log(`${chalk.cyan('Data Directory:')} ${chalk.gray(getConfigDir())}`);
    console.log(chalk.gray('\nThis directory contains:'));
    console.log(chalk.gray('  • crucible-project.json - The Crucible writing projects'));
    console.log(chalk.gray('  • game-state.json - TTRPG NPC Manager data\n'));
  });

// Parse arguments
program.parse(process.argv);

// If no arguments provided, show help
if (process.argv.length === 2) {
  program.help();
}
