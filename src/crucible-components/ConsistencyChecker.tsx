import React, { useState, useMemo } from 'react';
import { useCrucible } from '../CrucibleContext';

type IssueType = 'error' | 'warning' | 'suggestion';

interface ConsistencyIssue {
  id: string;
  type: IssueType;
  category: 'character' | 'timeline' | 'plot' | 'world';
  title: string;
  description: string;
  locations: string[];
  autoFixable?: boolean;
}

const ConsistencyChecker: React.FC = () => {
  const { project } = useCrucible();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'character' | 'timeline' | 'plot' | 'world'>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<'all' | IssueType>('all');

  if (!project) return null;

  // Analyze project for consistency issues
  const issues = useMemo(() => {
    const foundIssues: ConsistencyIssue[] = [];

    // Character name consistency check
    const characterNames = new Map<string, string[]>();
    project.characters.forEach(char => {
      const nameLower = char.name.toLowerCase();
      if (!characterNames.has(nameLower)) {
        characterNames.set(nameLower, []);
      }
      characterNames.get(nameLower)?.push(char.name);
    });

    characterNames.forEach((variants, nameLower) => {
      if (variants.length > 1) {
        const uniqueVariants = [...new Set(variants)];
        if (uniqueVariants.length > 1) {
          foundIssues.push({
            id: `char-name-${nameLower}`,
            type: 'warning',
            category: 'character',
            title: 'Inconsistent Character Name',
            description: `Character name has multiple spellings: ${uniqueVariants.join(', ')}`,
            locations: ['Characters'],
            autoFixable: false
          });
        }
      }
    });

    // Check for characters without relationships
    project.characters.forEach(char => {
      if (char.relationships.length === 0) {
        foundIssues.push({
          id: `char-no-rel-${char.id}`,
          type: 'suggestion',
          category: 'character',
          title: 'Character Has No Relationships',
          description: `"${char.name}" has no defined relationships. Consider adding connections to other characters.`,
          locations: ['Characters'],
          autoFixable: false
        });
      }
    });

    // Check for characters without arcs
    project.characters.forEach(char => {
      if (!char.arc || char.arc.trim().length === 0) {
        foundIssues.push({
          id: `char-no-arc-${char.id}`,
          type: 'warning',
          category: 'character',
          title: 'Character Missing Arc',
          description: `"${char.name}" has no character arc defined. Character development is crucial for engaging stories.`,
          locations: ['Characters'],
          autoFixable: false
        });
      }
    });

    // Check for empty strands
    const strandsToCheck = ['quest', 'fire', 'constellation'] as const;
    strandsToCheck.forEach(strandType => {
      const strandMap = project.strandMaps[strandType];
      if (!strandMap.summary || strandMap.summary.trim().length === 0) {
        foundIssues.push({
          id: `strand-empty-${strandType}`,
          type: 'error',
          category: 'plot',
          title: `${strandType.charAt(0).toUpperCase() + strandType.slice(1)} Strand Not Defined`,
          description: `Your ${strandType} strand has no summary. All three strands are essential to the Crucible system.`,
          locations: ['Story Strands'],
          autoFixable: false
        });
      }
    });

    // Check for beats without content in all three strands
    project.beats.forEach(beat => {
      const hasQuest = beat.questStrand && beat.questStrand.trim().length > 0;
      const hasFire = beat.fireStrand && beat.fireStrand.trim().length > 0;
      const hasConstellation = beat.constellationStrand && beat.constellationStrand.trim().length > 0;

      if (!hasQuest && !hasFire && !hasConstellation) {
        foundIssues.push({
          id: `beat-empty-${beat.id}`,
          type: 'warning',
          category: 'plot',
          title: `Beat ${beat.number} is Empty`,
          description: `Beat ${beat.number} has no content in any strand. Each beat should advance at least one strand.`,
          locations: ['36 Beats'],
          autoFixable: false
        });
      } else if (!hasQuest || !hasFire || !hasConstellation) {
        const missing = [];
        if (!hasQuest) missing.push('Quest');
        if (!hasFire) missing.push('Fire');
        if (!hasConstellation) missing.push('Constellation');

        foundIssues.push({
          id: `beat-incomplete-${beat.id}`,
          type: 'suggestion',
          category: 'plot',
          title: `Beat ${beat.number} Missing Strands`,
          description: `Beat ${beat.number} is missing: ${missing.join(', ')}. Consider developing all three strands throughout your story.`,
          locations: ['36 Beats'],
          autoFixable: false
        });
      }
    });

    // Check for forge points without full convergence
    project.forgePoints.forEach((fp, index) => {
      const hasQuest = fp.questConvergence && fp.questConvergence.trim().length > 0;
      const hasFire = fp.fireConvergence && fp.fireConvergence.trim().length > 0;
      const hasConstellation = fp.constellationConvergence && fp.constellationConvergence.trim().length > 0;
      const hasStakes = fp.stakes && fp.stakes.trim().length > 0;
      const hasSacrifice = fp.sacrifice && fp.sacrifice.trim().length > 0;

      if (!hasQuest || !hasFire || !hasConstellation) {
        foundIssues.push({
          id: `fp-incomplete-${fp.id}`,
          type: 'error',
          category: 'plot',
          title: `Forge Point ${index + 1} Incomplete`,
          description: `"${fp.name}" is missing convergence descriptions. All three strands must converge at forge points.`,
          locations: ['Forge Points'],
          autoFixable: false
        });
      }

      if (!hasStakes) {
        foundIssues.push({
          id: `fp-no-stakes-${fp.id}`,
          type: 'warning',
          category: 'plot',
          title: `Forge Point ${index + 1} Missing Stakes`,
          description: `"${fp.name}" has no stakes defined. Stakes create tension and urgency.`,
          locations: ['Forge Points'],
          autoFixable: false
        });
      }

      if (!hasSacrifice) {
        foundIssues.push({
          id: `fp-no-sacrifice-${fp.id}`,
          type: 'warning',
          category: 'plot',
          title: `Forge Point ${index + 1} Missing Sacrifice`,
          description: `"${fp.name}" has no sacrifice defined. Meaningful choices require meaningful costs.`,
          locations: ['Forge Points'],
          autoFixable: false
        });
      }
    });

    // Check for mercy moments without payoff
    const plantedMercy = project.mercyLedger.filter(m => m.status === 'planted');
    if (plantedMercy.length > 5) {
      foundIssues.push({
        id: 'mercy-too-many-planted',
        type: 'warning',
        category: 'plot',
        title: 'Too Many Planted Mercy Moments',
        description: `You have ${plantedMercy.length} planted mercy moments. Consider advancing some to "brewing" or "paid off" to create emotional payoffs.`,
        locations: ['Mercy Engine'],
        autoFixable: false
      });
    }

    const brewingMercy = project.mercyLedger.filter(m => m.status === 'brewing');
    if (brewingMercy.length > 3) {
      foundIssues.push({
        id: 'mercy-too-many-brewing',
        type: 'suggestion',
        category: 'plot',
        title: 'Multiple Brewing Mercy Moments',
        description: `You have ${brewingMercy.length} brewing mercy moments. Make sure to pay them off before your story ends for maximum impact.`,
        locations: ['Mercy Engine'],
        autoFixable: false
      });
    }

    // Check for chapters without outlines
    project.chapters.forEach(chapter => {
      if (!chapter.outline || chapter.outline.trim().length === 0) {
        foundIssues.push({
          id: `chapter-no-outline-${chapter.id}`,
          type: 'suggestion',
          category: 'plot',
          title: `Chapter ${chapter.number} Missing Outline`,
          description: `"${chapter.title}" has no outline. Outlining helps maintain structure and pacing.`,
          locations: ['Chapters'],
          autoFixable: false
        });
      }
    });

    // Check for chapters far from target word count
    project.chapters.forEach(chapter => {
      if (chapter.wordCount > 0) {
        const percentOfTarget = (chapter.wordCount / chapter.targetWordCount) * 100;
        if (percentOfTarget > 150) {
          foundIssues.push({
            id: `chapter-too-long-${chapter.id}`,
            type: 'warning',
            category: 'plot',
            title: `Chapter ${chapter.number} Significantly Over Target`,
            description: `"${chapter.title}" is ${Math.round(percentOfTarget)}% of target length (${chapter.wordCount}/${chapter.targetWordCount} words). Consider splitting or trimming.`,
            locations: ['Chapters'],
            autoFixable: false
          });
        }
      }
    });

    // Check for unbalanced chapter distribution
    if (project.chapters.length > 0) {
      const chaptersWithProse = project.chapters.filter(ch => ch.prose && ch.prose.trim().length > 0);
      const percentComplete = (chaptersWithProse.length / project.chapters.length) * 100;

      if (percentComplete < 25 && project.metadata.currentPhase === 'drafting') {
        foundIssues.push({
          id: 'chapters-low-completion',
          type: 'suggestion',
          category: 'plot',
          title: 'Low Chapter Completion',
          description: `Only ${Math.round(percentComplete)}% of chapters have prose. Consider focusing on completing more chapters.`,
          locations: ['Overview', 'Chapters'],
          autoFixable: false
        });
      }
    }

    // Check for dark mirror relationships
    const hasDarkMirror = project.characters.some(c => c.darkMirror);
    if (!hasDarkMirror) {
      foundIssues.push({
        id: 'no-dark-mirror',
        type: 'suggestion',
        category: 'character',
        title: 'No Dark Mirror Character',
        description: 'Consider designating an antagonist as the protagonist\'s "Dark Mirror" - a character who represents what the hero could become.',
        locations: ['Characters'],
        autoFixable: false
      });
    }

    // Check for timeline consistency in chapters
    const chaptersWithBeats = project.chapters.filter(ch => ch.beats && ch.beats.length > 0);
    chaptersWithBeats.forEach(chapter => {
      if (chapter.beats.length > 0) {
        const sortedBeats = [...chapter.beats].sort((a, b) => a - b);
        const isSequential = sortedBeats.every((beat, idx, arr) =>
          idx === 0 || beat === arr[idx - 1] + 1
        );

        if (!isSequential) {
          foundIssues.push({
            id: `chapter-beats-nonsequential-${chapter.id}`,
            type: 'warning',
            category: 'timeline',
            title: `Chapter ${chapter.number} Has Non-Sequential Beats`,
            description: `"${chapter.title}" references beats ${sortedBeats.join(', ')}. Consider if these beats should be sequential or split across chapters.`,
            locations: ['Chapters'],
            autoFixable: false
          });
        }
      }
    });

    return foundIssues;
  }, [project]);

  // Filter issues
  const filteredIssues = issues.filter(issue => {
    if (selectedCategory !== 'all' && issue.category !== selectedCategory) return false;
    if (selectedSeverity !== 'all' && issue.type !== selectedSeverity) return false;
    return true;
  });

  // Count by type
  const errorCount = issues.filter(i => i.type === 'error').length;
  const warningCount = issues.filter(i => i.type === 'warning').length;
  const suggestionCount = issues.filter(i => i.type === 'suggestion').length;

  const getIssueIcon = (type: IssueType) => {
    switch (type) {
      case 'error': return '🔴';
      case 'warning': return '⚠️';
      case 'suggestion': return '💡';
    }
  };

  const getIssueColor = (type: IssueType) => {
    switch (type) {
      case 'error': return '#e74c3c';
      case 'warning': return '#f39c12';
      case 'suggestion': return '#3498db';
    }
  };

  return (
    <div className="consistency-checker">
      <div className="checker-header">
        <h1>Consistency Checker</h1>
        <p className="checker-subtitle">Automated analysis of your story structure and continuity</p>
      </div>

      <div className="checker-stats">
        <div className="stat-badge error">
          <span className="badge-icon">🔴</span>
          <span className="badge-count">{errorCount}</span>
          <span className="badge-label">Errors</span>
        </div>
        <div className="stat-badge warning">
          <span className="badge-icon">⚠️</span>
          <span className="badge-count">{warningCount}</span>
          <span className="badge-label">Warnings</span>
        </div>
        <div className="stat-badge suggestion">
          <span className="badge-icon">💡</span>
          <span className="badge-count">{suggestionCount}</span>
          <span className="badge-label">Suggestions</span>
        </div>
      </div>

      <div className="checker-filters">
        <div className="filter-group">
          <label>Category:</label>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value as any)}>
            <option value="all">All Categories</option>
            <option value="character">Character</option>
            <option value="timeline">Timeline</option>
            <option value="plot">Plot Structure</option>
            <option value="world">World Building</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Severity:</label>
          <select value={selectedSeverity} onChange={(e) => setSelectedSeverity(e.target.value as any)}>
            <option value="all">All Severities</option>
            <option value="error">Errors Only</option>
            <option value="warning">Warnings Only</option>
            <option value="suggestion">Suggestions Only</option>
          </select>
        </div>
      </div>

      <div className="issues-list">
        {filteredIssues.length === 0 ? (
          <div className="no-issues">
            <h3>✨ No Issues Found!</h3>
            <p>Your story structure looks consistent. Keep up the great work!</p>
          </div>
        ) : (
          filteredIssues.map(issue => (
            <div
              key={issue.id}
              className={`issue-card ${issue.type}`}
              style={{ borderLeftColor: getIssueColor(issue.type) }}
            >
              <div className="issue-header">
                <span className="issue-icon">{getIssueIcon(issue.type)}</span>
                <h3 className="issue-title">{issue.title}</h3>
                <span className="issue-category">{issue.category}</span>
              </div>
              <p className="issue-description">{issue.description}</p>
              <div className="issue-footer">
                <div className="issue-locations">
                  <strong>Found in:</strong> {issue.locations.join(', ')}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {filteredIssues.length > 0 && (
        <div className="checker-summary">
          <h3>Summary</h3>
          <p>
            Found <strong>{filteredIssues.length}</strong> issue{filteredIssues.length !== 1 ? 's' : ''}
            {selectedCategory !== 'all' && ` in ${selectedCategory}`}
            {selectedSeverity !== 'all' && ` (${selectedSeverity}s only)`}.
          </p>
          <p className="summary-tip">
            💡 <strong>Tip:</strong> Address errors first, then warnings, then consider suggestions to improve your story.
          </p>
        </div>
      )}
    </div>
  );
};

export default ConsistencyChecker;
