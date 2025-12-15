# 🎲 TTRPG NPC Manager

A dynamic web application designed to assist Dungeon Masters (DMs) in managing non-player characters (NPCs) and story information during tabletop role-playing game sessions.

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

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## 📝 License

This project is open source and available under the MIT License.

## 🎲 Happy Gaming!

May your dice roll high and your NPCs be memorable!
