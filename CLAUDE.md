# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is an ELO-Tailored Chess Coaching Application - a personalized chess analysis tool that provides skill-appropriate move explanations and coaching insights. Unlike traditional chess engines that give "perfect" moves, this application provides explanations and suggestions tailored to the user's ELO rating, focusing on fundamentally sound moves and concepts that players at their skill level can understand and implement.

## Product Requirements

### MVP Features
- **User ELO Setup**: Users input their current chess rating (500-2000 range initially)
- **PGN Import**: Upload and import PGN files containing chess games
- **Game Navigation**: Step-by-step navigation through games from start to finish
- **Interactive Chess Board**: Visual representation of game positions with move highlighting
- **ELO-Tailored Move Explanations**: Detailed explanations for each move that are appropriate for the user's skill level
- **Basic Analysis Dashboard**: Overview of common improvement areas based on ELO bracket

### Future Enhancements
- **Machine Learning Integration**: AI agent trained on games at varying ELOs for more sophisticated analysis
- **Advanced Coaching Features**: Personalized training recommendations, weakness identification
- **Game Database**: Store and organize analyzed games with progress tracking
- **User Accounts**: Save ELO progress, game history, and learning analytics
- **Multiple Game Formats**: Support for FEN, algebraic notation, and other chess formats
- **Community Features**: Share analysis, get feedback from coaches/peers
- **Opening/Endgame Libraries**: ELO-appropriate opening and endgame guidance

## Technical Requirements

### Core Functionality
- PGN file parsing and validation
- Chess game logic and move validation
- Interactive chess board rendering
- **ELO-Based Analysis Engine**: Rule-based system for generating skill-appropriate explanations
- **Move Explanation System**: Natural language explanations for chess moves and concepts
- Game state management with analysis overlay
- File upload handling
- User ELO management and persistence
- Responsive design for desktop and mobile

### Performance
- Fast PGN parsing for large files
- Smooth game navigation with analysis overlay
- Optimized board rendering with explanation popups
- Efficient analysis engine for real-time move explanations
- Client-side caching for repeated analysis

## Technology Stack

### Frontend
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS for modern, responsive design
- **Chess Logic**: chess.js library for game logic and PGN parsing
- **Board Component**: react-chessboard for interactive chess board
- **State Management**: Zustand for ELO settings and game state
- **HTTP Client**: Axios for API communication

### Backend (MVP)
- **Runtime**: Node.js with Express
- **Database**: PostgreSQL for ELO analysis rules and user data
- **Cache**: Redis for analysis result caching
- **Chess Engine**: Stockfish for position evaluation
- **Analysis Engine**: Custom rule-based system for ELO-tailored explanations

### Development Tools
- **Package Manager**: npm
- **Code Quality**: ESLint + Prettier
- **Testing**: Vitest + React Testing Library (Frontend), Jest (Backend)
- **Type Checking**: TypeScript strict mode
- **API Testing**: Supertest for backend API testing

### Future Enhancements
- **Machine Learning**: Python/TensorFlow for ELO-based move prediction
- **Authentication**: JWT-based auth system
- **File Storage**: Cloud storage for PGN files and analysis results

## Architecture

### Frontend Architecture
```
src/
├── components/          # Reusable UI components
│   ├── ChessBoard/     # Interactive chess board with analysis overlay
│   ├── GameNavigation/ # Game control buttons and move list
│   ├── PGNUpload/      # File upload interface
│   ├── ELOSetup/       # User ELO rating input component
│   ├── AnalysisPanel/  # Move explanations and coaching insights
│   └── common/         # Shared UI components
├── hooks/              # Custom React hooks
├── services/           # Business logic and API calls
│   ├── pgnParser.ts    # PGN file parsing logic
│   ├── gameService.ts  # Game state management
│   ├── analysisService.ts # API calls to analysis engine
│   └── fileService.ts  # File handling utilities
├── stores/             # Zustand state management
│   ├── gameStore.ts    # Game state and navigation
│   └── userStore.ts    # User ELO and preferences
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── App.tsx            # Main application component
```

### Backend Architecture
```
server/
├── routes/             # API endpoints
│   ├── analysis.ts     # Game analysis endpoints
│   ├── games.ts        # PGN upload and game management
│   └── user.ts         # User ELO management
├── services/           # Business logic
│   ├── analysisEngine.ts # ELO-tailored analysis logic
│   ├── chessEngine.ts  # Stockfish integration
│   └── gameProcessor.ts # PGN processing and validation
├── models/             # Database models
│   ├── User.ts         # User and ELO data
│   ├── Game.ts         # Game and analysis data
│   └── AnalysisRule.ts # ELO-based analysis rules
├── utils/              # Utility functions
└── server.ts           # Express server setup
```

### Data Flow
1. User sets ELO rating via ELOSetup component
2. User uploads PGN file via PGNUpload component
3. Backend processes PGN and generates ELO-tailored analysis
4. Frontend receives analysis data and renders explanations
5. User navigates through moves with contextual coaching insights
6. AnalysisPanel displays move explanations appropriate for user's ELO

## Key Components

### ChessBoard Component
- Interactive chess board with piece movement animation
- Position highlighting and move indicators with analysis overlay
- Responsive design for different screen sizes
- Integration with chess.js for move validation
- Visual indicators for good/bad moves based on ELO analysis

### AnalysisPanel Component
- **ELO-Tailored Move Explanations**: Natural language explanations appropriate for user's skill level
- **Coaching Insights**: Contextual advice on chess principles and tactics
- **Alternative Move Suggestions**: Better moves with explanations of why they're better
- **Learning Focus Areas**: Highlighted concepts the user should focus on at their ELO

### ELOSetup Component
- User ELO rating input (500-2000 range)
- ELO bracket explanation and examples
- Settings persistence across sessions
- Option to adjust ELO as skills improve

### GameNavigation Component
- Move list display with current move highlighting
- Navigation controls (first, previous, next, last)
- Move input for direct position jumping
- Game information display (players, date, result)
- Analysis toggle for each move

### PGNUpload Component
- Drag-and-drop file upload interface
- File validation and error handling
- Progress indicator for large files
- Game preview before analysis

### AnalysisEngine (Backend)
- **Rule-Based ELO Analysis**: Core logic for generating skill-appropriate explanations
- **Move Categorization**: Classify moves as tactics, strategy, blunders, etc.
- **Explanation Generation**: Create natural language coaching explanations
- **ELO-Specific Focus**: Emphasize concepts relevant to user's skill level
  - 800-1200: Basic tactics, piece development, center control
  - 1200-1600: Pattern recognition, tactical combinations, endgame basics
  - 1600-2000: Advanced tactics, positional understanding, strategic planning

## Development Commands

### Frontend Setup
```bash
npm create vite@latest client -- --template react-ts
cd client
npm install
npm install chess.js react-chessboard zustand axios
npm install -D @types/chess.js
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Backend Setup
```bash
mkdir server && cd server
npm init -y
npm install express cors helmet morgan
npm install chess.js stockfish
npm install pg redis
npm install -D @types/node @types/express @types/cors
npm install -D typescript ts-node nodemon
npm install -D jest @types/jest supertest @types/supertest
npx tsc --init
```

### Development
```bash
# Frontend (from client directory)
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler

# Backend (from server directory)
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
```

### Testing
```bash
# Frontend
npm run test         # Run unit tests
npm run test:coverage # Run tests with coverage

# Backend
npm run test         # Run backend tests
npm run test:watch   # Run tests in watch mode
```

## Development Notes
- **ELO-First Approach**: Every feature should consider how it adapts to different skill levels
- **Rule-Based MVP**: Start with rule-based analysis before implementing ML features
- **"Building Habits" Philosophy**: Focus on fundamental concepts and progressive skill building
- **Clean Architecture**: Separate analysis logic from UI for easy testing and iteration
- **Performance Focus**: Optimize for real-time analysis feedback and smooth navigation
- **User-Centered Design**: Explanations should feel like a patient chess coach, not a computer
- **Accessibility**: Ensure the app works for users with disabilities
- **Testing Strategy**: Extensive testing of analysis engine with different ELO scenarios
- **Error Handling**: Graceful handling of invalid PGN files and analysis failures

## Analysis Engine Rules (MVP)

### ELO 800-1200 Focus Areas
- **Opening Principles**: Control center with e4/d4, develop knights before bishops
- **Basic Tactics**: Pins, forks, skewers, discovered attacks
- **Piece Safety**: Don't hang pieces, protect attacked pieces
- **King Safety**: Castle early, keep king protected
- **Basic Endgames**: King and pawn vs king, basic checkmate patterns

### ELO 1200-1600 Focus Areas
- **Opening Development**: Complete development before attacking
- **Tactical Patterns**: Back rank mate, double attacks, deflection
- **Piece Coordination**: Pieces working together, weak squares
- **Pawn Structure**: Pawn chains, isolated pawns, passed pawns
- **Endgame Principles**: Opposition, triangulation, basic rook endgames

### ELO 1600-2000 Focus Areas
- **Strategic Planning**: Long-term goals, piece placement improvement
- **Advanced Tactics**: Combinations, sacrifices, positional tactics
- **Positional Understanding**: Weak squares, piece activity, space advantage
- **Complex Endgames**: Rook and pawn endgames, minor piece endgames
- **Time Management**: Efficient calculation, candidate moves