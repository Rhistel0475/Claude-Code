/**
 * Beat Templates for The Crucible Writing System
 *
 * Pre-written templates to help authors get started with each beat type.
 * Based on common narrative patterns across the six movements.
 */

export interface BeatTemplate {
  title: string;
  description: string;
  questStrand: string;
  fireStrand: string;
  constellationStrand: string;
}

/**
 * Get a template for a specific beat number
 */
export function getBeatTemplate(beatNumber: number): BeatTemplate | null {
  const templates: Record<number, BeatTemplate> = {
    // IGNITION (Beats 1-6, ~10%)
    1: {
      title: "Opening Image",
      description: "Establish the protagonist's ordinary world before change begins. Show their status quo, daily life, and the flaws or limitations they don't yet recognize.",
      questStrand: "Introduce the protagonist in their normal environment. What do they do? What do they want? What routine defines their current life?",
      fireStrand: "Show the protagonist's internal state - their beliefs, fears, or emotional wounds. What flaw or limitation will they need to overcome?",
      constellationStrand: "Introduce key relationships. Who matters to the protagonist? What dynamics define these connections?"
    },
    2: {
      title: "Hint of Change",
      description: "Something disrupts the ordinary world. Not yet the main catalyst, but a signal that change is coming.",
      questStrand: "A small event suggests the status quo won't last. What external force is building?",
      fireStrand: "The protagonist feels unease or curiosity. Something isn't quite right anymore.",
      constellationStrand: "Relationships show early strain or new connections begin to form."
    },
    6: {
      title: "Threshold Crossing",
      description: "The protagonist commits to the journey. There's no turning back to the old world.",
      questStrand: "The protagonist makes a choice or is forced into action. The quest officially begins.",
      fireStrand: "Internal commitment - even if reluctant, they accept that change is necessary.",
      constellationStrand: "Relationships shift as the protagonist steps into their new role."
    },

    // RISING ACTION (Beats 7-12, ~20%)
    7: {
      title: "New World Rules",
      description: "The protagonist learns how this new situation works. Introduce allies, enemies, and challenges.",
      questStrand: "Explore the new environment. What are the rules? Who are the players?",
      fireStrand: "The protagonist's old methods don't work here. They must adapt.",
      constellationStrand: "Form new alliances. Meet mentors, companions, or opponents."
    },
    12: {
      title: "First Major Test",
      description: "The protagonist faces a significant challenge that reveals their current limitations.",
      questStrand: "A major obstacle or enemy confronts them. Do they succeed or fail?",
      fireStrand: "The protagonist discovers what they lack - skill, wisdom, courage, etc.",
      constellationStrand: "Relationships are tested. Who stands with them? Who opposes?"
    },

    // COMPLICATION (Beats 13-18, ~20%)
    13: {
      title: "Deepening Stakes",
      description: "The quest becomes more complex. New information reveals greater scope or danger.",
      questStrand: "The mission expands. What they thought they understood was incomplete.",
      fireStrand: "Doubts emerge. Is the protagonist capable of this? Should they continue?",
      constellationStrand: "Relationships deepen. Trust builds or betrayals surface."
    },
    18: {
      title: "Point of No Return",
      description: "The protagonist is fully committed now. Retreat is no longer possible.",
      questStrand: "An event makes backing out impossible. The stakes become personal.",
      fireStrand: "The protagonist realizes they've changed. They can't go back to who they were.",
      constellationStrand: "Relationships force choices. Loyalties are declared."
    },

    // CRISIS (Beats 19-24, ~20%)
    19: {
      title: "Approaching Darkness",
      description: "The antagonist or opposing force reveals their full power. Things look grim.",
      questStrand: "The opposition shows their strength. The protagonist seems outmatched.",
      fireStrand: "Fear and doubt reach their peak. Can they really do this?",
      constellationStrand: "Relationships strain under pressure. Conflicts emerge among allies."
    },
    24: {
      title: "All Is Lost",
      description: "The lowest point. The protagonist has failed or lost what matters most.",
      questStrand: "The quest appears doomed. The external goal seems unreachable.",
      fireStrand: "The protagonist hits rock bottom emotionally. They face their deepest fear.",
      constellationStrand: "Relationships break or are tested to their limit. Isolation or betrayal."
    },

    // CONVERGENCE (Beats 25-30, ~20%)
    25: {
      title: "Dark Night of the Soul",
      description: "In the aftermath of failure, the protagonist confronts who they really are.",
      questStrand: "Survey the damage. What remains? What's truly at stake?",
      fireStrand: "Deep introspection. The protagonist must choose to give up or find new strength.",
      constellationStrand: "Others offer wisdom, support, or force the protagonist to see truth."
    },
    30: {
      title: "Rebirth and Preparation",
      description: "The protagonist rises with new understanding. They're ready for the final confrontation.",
      questStrand: "Formulate a new plan. Gather resources. Approach the final battle differently.",
      fireStrand: "Internal transformation is complete. The protagonist has become who they needed to be.",
      constellationStrand: "Reconcile or strengthen key relationships. Allies unite for the final push."
    },

    // RESOLUTION (Beats 31-36, ~10%)
    31: {
      title: "Final Approach",
      description: "The protagonist moves toward the climactic confrontation with purpose and clarity.",
      questStrand: "Begin the final assault, negotiation, or confrontation. The end is near.",
      fireStrand: "The protagonist carries their transformation forward. They're ready.",
      constellationStrand: "Final farewells, affirmations, or battle preparations with loved ones."
    },
    36: {
      title: "Closing Image",
      description: "Mirror of the opening. Show how the protagonist and their world have changed.",
      questStrand: "The external quest is complete. How has the world changed?",
      fireStrand: "The protagonist is transformed. Show who they've become.",
      constellationStrand: "Relationships reflect the journey. Who remains? How have connections evolved?"
    }
  };

  return templates[beatNumber] || null;
}

/**
 * Get template suggestions based on beat number when no specific template exists
 */
export function getGenericBeatGuidance(beatNumber: number): BeatTemplate {
  // Determine movement
  let movement = '';
  if (beatNumber <= 6) movement = 'Ignition';
  else if (beatNumber <= 12) movement = 'Rising Action';
  else if (beatNumber <= 18) movement = 'Complication';
  else if (beatNumber <= 24) movement = 'Crisis';
  else if (beatNumber <= 30) movement = 'Convergence';
  else movement = 'Resolution';

  return {
    title: `Beat ${beatNumber}`,
    description: `A beat in the ${movement} movement. Continue developing your story's progression through this phase.`,
    questStrand: "What happens in the external plot? What actions do characters take? What obstacles appear?",
    fireStrand: "How does the protagonist change internally? What do they learn, feel, or realize?",
    constellationStrand: "How do relationships evolve? What interactions matter? Who grows closer or further apart?"
  };
}

/**
 * Apply a template to a beat
 */
export function applyTemplate(beatNumber: number): BeatTemplate {
  const specificTemplate = getBeatTemplate(beatNumber);
  if (specificTemplate) {
    return specificTemplate;
  }
  return getGenericBeatGuidance(beatNumber);
}
