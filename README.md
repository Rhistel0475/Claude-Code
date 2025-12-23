# 🎲 TTRPG NPC Manager & ⚒ The Crucible Writing System

A comprehensive web application featuring two powerful tools:
1. **TTRPG NPC Manager** - Assist Dungeon Masters in managing NPCs and story information
2. **The Crucible Writing System** - A 36-beat narrative framework for fantasy authors

Switch between modes using the toggle at the top of the application.

## 🎯 Core Features

### NPC Management
- **Create and manage NPCs** with customizable roles, locations, and descriptions
- **Edit or delete NPCs** as your campaign evolves
- Track which NPCs have access to which information

### Story Information System
- **Add plot points and information** that NPCs can reveal to players
- **Categorize information** (e.g., Main Quest, Side Quest, Lore)
- **Randomize information distribution** across NPCs for unpredictability
- Track which NPCs know which information

### Information Assignment
- **Manually assign information** to specific NPCs
- **View assigned vs. available information** in a clear two-panel interface
- **Remove information** from NPCs when needed

### NPC Interaction
- **Location-based NPC selection** - choose a location to see NPCs present there
- **Dynamic conversation interface** - players can ask questions and NPCs respond
- **Smart keyword matching** - NPCs reveal information based on relevant keywords in questions
- **DM Info Panel** - see what information the active NPC knows at a glance
- **Conversation logging** - track the dialogue between players and NPCs

### Data Persistence
- All data is automatically saved to browser local storage
- No server or database required
- Data persists between sessions

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Claude-Code
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

To create a production build:
```bash
npm run build
```

The built files will be in the `dist/` directory and can be served by any static file server.

## 📖 How to Use

### 1. Setting Up Your Campaign

#### Create NPCs
1. Navigate to the **NPC Roster** tab
2. Click **Add NPC**
3. Fill in the NPC details:
   - **Name**: The NPC's name (e.g., "Gareth Ironforge")
   - **Role**: Their occupation or role (e.g., "Blacksmith", "Tavern Owner")
   - **Location**: Where they're typically found (e.g., "The Rusty Anvil", "Market Square")
   - **Description**: Physical appearance, personality, etc.
4. Click **Add NPC** to save

#### Add Story Information
1. Navigate to the **Story Information** tab
2. Click **Add Information**
3. Fill in the information details:
   - **Title**: A brief title for the information
   - **Content**: The actual information NPCs can reveal
   - **Category** (optional): Organize information (e.g., "Main Quest", "Lore")
4. Click **Add Information** to save

### 2. Assigning Information to NPCs

#### Manual Assignment
1. Navigate to the **Assign Info** tab
2. Select an NPC from the dropdown
3. Browse available information on the right panel
4. Click **Assign** to give that information to the NPC
5. Click **Remove** to unassign information from the NPC

#### Random Assignment
1. Navigate to the **Story Information** tab
2. Check the boxes next to information pieces you want to randomize
3. Click **Randomize Selected**
4. The information will be randomly distributed among your NPCs

### 3. Running NPC Interactions

1. Navigate to the **NPC Interaction** tab
2. Select a location from the dropdown
3. Choose an NPC from the available NPCs at that location
4. The conversation interface will open with a greeting from the NPC
5. Type questions in the input box and click **Ask**
6. The NPC will respond based on:
   - Whether they have relevant information
   - Keyword matching between the question and their knowledge
7. Use the **DM Info Panel** to see what the NPC knows
8. Click **End Conversation** when done

### Example Workflow

1. **Create NPCs**:
   - "Mira Stoneheart" - Tavern Owner - "The Prancing Pony"
   - "Aldric the Wise" - Librarian - "City Archives"
   - "Gareth Ironforge" - Blacksmith - "The Rusty Anvil"

2. **Add Information**:
   - Title: "Missing Merchant"
   - Content: "A merchant named Tobias hasn't been seen in three days. His last known location was the old mill."
   - Category: "Main Quest"

3. **Assign Information**:
   - Assign "Missing Merchant" to Mira Stoneheart
   - Or use randomize to distribute among NPCs

4. **During Play**:
   - Players enter "The Prancing Pony"
   - Select Mira Stoneheart from the location
   - Player asks: "Have you heard anything unusual lately?"
   - Mira responds with information about the missing merchant

## 🎨 Features Explained

### Smart Keyword Matching
The NPC interaction system uses keyword matching to determine if an NPC should reveal information. When a player asks a question:
- The system extracts keywords from the question (words longer than 3 characters)
- It compares these keywords against the titles and content of information the NPC knows
- If there's a match, the NPC reveals that information
- If there's no match, the NPC gives a generic response

### Data Persistence
All your campaign data is automatically saved to your browser's local storage:
- NPCs and their details
- Story information and categories
- Information assignments
- Active selections

This means your data persists even if you close the browser, but:
- Data is tied to the specific browser and device
- Clearing browser data will delete your campaign
- Data is not synced across devices

## 🛠️ Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **CSS3** - Styling with modern flexbox/grid layouts
- **Local Storage API** - Data persistence

## 📁 Project Structure

```
src/
├── components/
│   ├── NPCManagement.tsx          # NPC roster management
│   ├── InformationManagement.tsx  # Story information management
│   ├── InformationAssignment.tsx  # Assign info to NPCs
│   └── NPCInteraction.tsx         # Interactive NPC conversations
├── types.ts                        # TypeScript type definitions
├── GameContext.tsx                 # Global state management
├── App.tsx                         # Main application component
├── App.css                         # Application styles
├── index.css                       # Global styles
└── main.tsx                        # Application entry point
```

## 🎮 Tips for Dungeon Masters

1. **Prepare Before Sessions**: Set up NPCs and information before your game session for smoother gameplay

2. **Use Categories**: Organize information with categories to keep track of main quests, side quests, and lore

3. **Randomize for Surprises**: Use the randomize feature to even surprise yourself with who knows what

4. **Multiple Locations**: Create NPCs in various locations so players can discover information from different sources

5. **Generic NPCs**: Create generic NPCs like "Guard", "Shopkeeper", "Patron" that can be reused in different locations

6. **Update Between Sessions**: Edit or add information as your campaign evolves

7. **Backup Your Data**: Since data is stored locally, consider periodically exporting your browser data or taking screenshots of your setup

---

## ⚒ The Crucible Writing System

A comprehensive narrative framework designed to guide fantasy authors through the complete novel-writing journey with a 36-beat structure and three interwoven story strands.

### 🌟 Core Concepts

#### Three Narrative Strands

1. **Quest Strand** (External) - The mission, burden, or objective driving the plot forward
2. **Fire Strand** (Internal) - The protagonist's inner transformation, power, or curse
3. **Constellation Strand** (Relationships) - The web of bonds, alliances, and community dynamics

#### Six Movements

| Movement | Coverage | Function | Beats |
|----------|----------|----------|-------|
| **Ignition** | 10% | Establish foundation | 1-6 |
| **First Tempering** | 20% | Development through adversity | 7-11 |
| **Scattering** | 25% | Expansion and fragmentation | 12-18 |
| **Brightest Burning** | 25% | Mastery and convergence | 19-27 |
| **Final Forging** | 15% | Crisis and transcendence | 28-33 |
| **Tempered Blade** | 5% | Resolution and revelation | 34-36 |

#### Five Forge Points

Critical convergence moments where all three strands collide at high-stakes junctures:

1. **Ignition Forge** (~10%, Beat 6) - Threshold destruction; irreversible commitment
2. **First Crucible** (~25%, Beat 11) - Crisis requiring sacrifice
3. **Second Crucible** (~50%, Beat 21) - Escalated stakes and choice
4. **Third Crucible** (~75%, Beat 28) - Deepest sacrifice before finale
5. **Apex Willed Surrender** (~90%, Beat 33) - Voluntary essential surrender

### 📚 Crucible Features

#### Project Management
- **Create new writing projects** with metadata (title, author, genre, target word count)
- **Track current phase**: Planning, Outlining, Drafting, or Editing
- **View project statistics**: word count progress, chapter status, character count

#### Story Strand Mapping
- **Map each strand** with summaries and arc progression
- **Define key moments** linked to specific beats
- **Track strand development** through your entire novel

#### 36-Beat Structure
- **Organize narrative** across six distinct movements
- **Detail each beat** with descriptions for all three strands
- **Visual movement selector** to navigate your story structure
- **Expandable beat cards** for detailed planning

#### Forge Points System
- **Plan five critical convergences** where all strands collide
- **Define stakes and sacrifices** for each forge point
- **Map convergences** for Quest, Fire, and Constellation strands

#### Planning Documents
Create and manage nine types of planning documents:
- Crucible Thesis
- Quest/Fire/Constellation Strand Maps
- Dark Mirror Profile (antagonist)
- Constellation Bible (character relationships)
- Mercy Ledger
- World Forge

#### Character Management
- **Create and track characters** with roles and arcs
- **Define relationships** between characters
- **Mark the Dark Mirror** (antagonist as protagonist's shadow)
- **Track character development** through the story

#### Mercy Engine
- **Plant compassionate acts** early in your story
- **Track where mercy moments** are planted and paid off
- **Manage status**: Planted, Brewing, or Paid Off
- **Link to specific beats** and chapters

#### Chapter Outline System
- **Create chapter-by-chapter outlines** with target word counts
- **Write prose directly** in the application
- **Track chapter status**: Outlined, Drafting, Drafted, Revised, Final
- **Monitor word count progress** per chapter
- **Add chapter notes** and research

#### Export & Backup
- **Export entire project** as JSON for safekeeping
- **Create timestamped backups** with notes
- **Restore from backups** if needed
- **View project statistics** at a glance

### 🎯 Using The Crucible System

#### 1. Create Your Project
1. Switch to **Crucible Writer** mode
2. Click "Create New Project"
3. Enter project details:
   - Title and author name
   - Genre (Epic Fantasy, Urban Fantasy, etc.)
   - Target word count (120,000-180,000 recommended)
   - Story premise and central theme

#### 2. Planning Phase
1. Navigate to **Story Strands** and map your Quest, Fire, and Constellation strands
2. Go to **36 Beats** and outline your story across six movements
3. Visit **Forge Points** to plan your five critical convergence moments
4. Use **Planning Docs** to create detailed planning documents
5. Add **Characters** and define relationships
6. Set up **Mercy Engine** entries for powerful payoffs

#### 3. Outlining Phase
1. Switch to **Chapters** tab
2. Create chapters and link them to specific beats
3. Write detailed outlines for each chapter
4. Set target word counts (3,000-4,000 words recommended)

#### 4. Drafting Phase
1. Write prose directly in chapter editor
2. Track word count automatically
3. Update chapter status as you progress
4. Reference your beat structure and planning docs

#### 5. Backup & Export
1. Create regular backups from **Export/Backup** tab
2. Export complete project as JSON
3. Restore from backups if needed

### 💡 Crucible Writing Tips

- **Start with the Crucible Thesis** to establish your core forging question
- **Map all three strands thoroughly** before detailed beat planning
- **Ensure Forge Points** genuinely converge all three strands
- **Plant mercy moments early** for maximum emotional impact
- **Reference the Dark Mirror** regularly to strengthen antagonist-protagonist dynamics
- **Use the Constellation Bible** to track complex relationship webs
- **Create regular backups** during each writing phase
- **Target 3,000-4,000 words per chapter** for epic fantasy pacing

### 📊 Recommended Project Structure

For a 120,000-word epic fantasy novel:
- **40-50 chapters** at 3,000-4,000 words each
- **36 beats** mapped across your story
- **5 Forge Points** at critical junctures
- **10-15 major characters** with defined relationships
- **5-10 mercy entries** for climactic payoffs

---

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## 📝 License

This project is open source and available under the MIT License.

## 🎲 Happy Gaming & Happy Writing! ⚒

May your dice roll high, your NPCs be memorable, and your stories be legendary!
