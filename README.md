# Real-Time Polling API

A comprehensive backend service for real-time polling applications built with modern technologies. This project demonstrates proficiency in Node.js, Express, PostgreSQL, Prisma ORM, and WebSocket implementation for live vote counting and result broadcasting.

## 🚀 Features

- **Real-time Polling**: Create polls and receive live vote updates via WebSocket
- **User Management**: User registration and authentication with bcrypt password hashing
- **Poll Management**: Create, retrieve, and update polls with multiple options
- **Vote System**: One vote per user per poll with real-time result broadcasting
- **RESTful API**: Complete CRUD operations for all entities
- **WebSocket Integration**: Live updates using Socket.IO with room-based communication
- **Database Design**: Proper relational schema with Prisma ORM
- **Input Validation**: Zod schema validation for all endpoints
- **Error Handling**: Comprehensive error handling and status codes
- **Frontend Interface**: Built-in web interface for testing and demonstration

## 🛠 Tech Stack

- **Backend**: Node.js 18+ with Express.js
- **Database**: PostgreSQL 13+
- **ORM**: Prisma with TypeScript
- **Real-time**: Socket.IO for WebSocket communication
- **Validation**: Zod for input validation
- **Security**: bcryptjs for password hashing
- **Language**: TypeScript for type safety

## 📋 Prerequisites

- **Node.js** 18.0 or higher
- **PostgreSQL** 13.0 or higher
- **npm** or **yarn** package manager

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd Voting
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the project root:
```env
# Database Configuration
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/move37_polling?schema=public"

# Server Configuration
PORT=4000
CLIENT_ORIGIN=http://localhost:4000

# Optional: Environment
NODE_ENV=development
```

### 4. Database Setup
```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Optional: Open Prisma Studio to inspect data
npx prisma studio
```

### 5. Start the Application
```bash
# Development mode with hot reload
npm run dev

# Production build
npm run build
npm start
```

The server will start at `http://localhost:4000`

### 6. Access the Application
- **Web Interface**: `http://localhost:4000/`
- **API Health Check**: `http://localhost:4000/health`
- **API Documentation**: See API section below

## 📚 API Documentation

Base URL: `http://localhost:4000`

### Health Check
```http
GET /health
```
**Response:**
```json
{
  "status": "ok"
}
```

### Users

#### Create User
```http
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```
**Response (201):**
```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2025-09-14T10:00:00.000Z"
}
```

#### Get All Users
```http
GET /api/users
```
**Response:**
```json
[
  {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2025-09-14T10:00:00.000Z"
  }
]
```

#### Get User by ID
```http
GET /api/users/:id
```
**Response:**
```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2025-09-14T10:00:00.000Z"
}
```

### Polls

#### Create Poll
```http
POST /api/polls
Content-Type: application/json

{
  "question": "What's your favorite programming language?",
  "isPublished": true,
  "creatorId": "user-uuid",
  "options": ["JavaScript", "Python", "Java", "Go"]
}
```
**Response (201):**
```json
{
  "id": "poll-uuid",
  "question": "What's your favorite programming language?",
  "isPublished": true,
  "creatorId": "user-uuid",
  "createdAt": "2025-09-14T10:00:00.000Z",
  "updatedAt": "2025-09-14T10:00:00.000Z",
  "options": [
    {
      "id": "option-uuid-1",
      "text": "JavaScript",
      "pollId": "poll-uuid"
    },
    {
      "id": "option-uuid-2",
      "text": "Python",
      "pollId": "poll-uuid"
    }
  ]
}
```

#### Get All Polls
```http
GET /api/polls
```
**Response:**
```json
[
  {
    "id": "poll-uuid",
    "question": "What's your favorite programming language?",
    "isPublished": true,
    "creatorId": "user-uuid",
    "createdAt": "2025-09-14T10:00:00.000Z",
    "updatedAt": "2025-09-14T10:00:00.000Z",
    "options": [...],
    "creator": {
      "id": "user-uuid",
      "name": "John Doe"
    }
  }
]
```

#### Get Poll by ID
```http
GET /api/polls/:id
```
**Response:**
```json
{
  "id": "poll-uuid",
  "question": "What's your favorite programming language?",
  "isPublished": true,
  "creatorId": "user-uuid",
  "createdAt": "2025-09-14T10:00:00.000Z",
  "updatedAt": "2025-09-14T10:00:00.000Z",
  "options": [...],
  "creator": {
    "id": "user-uuid",
    "name": "John Doe"
  }
}
```

#### Get Poll Results
```http
GET /api/polls/:id/results
```
**Response:**
```json
{
  "pollId": "poll-uuid",
  "question": "What's your favorite programming language?",
  "options": [
    {
      "id": "option-uuid-1",
      "text": "JavaScript",
      "votes": 15
    },
    {
      "id": "option-uuid-2",
      "text": "Python",
      "votes": 12
    }
  ]
}
```

#### Update Poll
```http
PATCH /api/polls/:id
Content-Type: application/json

{
  "isPublished": true,
  "question": "Updated question"
}
```

### Votes

#### Cast Vote
```http
POST /api/votes
Content-Type: application/json

{
  "userId": "user-uuid",
  "pollOptionId": "option-uuid"
}
```
**Response (201):**
```json
{
  "id": "vote-uuid",
  "userId": "user-uuid",
  "pollOptionId": "option-uuid",
  "createdAt": "2025-09-14T10:00:00.000Z"
}
```

**Vote Constraints:**
- One vote per user per poll (enforced in application logic)
- Unique constraint on `(userId, pollOptionId)` at database level
- Returns 409 Conflict if user already voted on the poll

## 🔌 Real-time WebSocket Integration

The application uses Socket.IO for real-time communication, enabling live vote count updates across all connected clients.

### Connection
```javascript
const socket = io('http://localhost:4000');
```

### Room Management (Optional Enhancement)
- **Room Format**: `poll:<pollId>`
- **Purpose**: More efficient broadcasting to specific poll viewers
- **Implementation**: Clients can join/leave poll rooms for better performance
- **Note**: This is an enhancement - the core requirement works without rooms

### Server Events

#### Live Poll Results
```javascript
socket.on('poll:results', (data) => {
  console.log('Live results:', data);
  // data: { pollId, options: [{ id, text, votes }] }
});
```
**Triggered**: When any user casts a vote on the poll
**Payload**:
```json
{
  "pollId": "poll-uuid",
  "options": [
    {
      "id": "option-uuid-1",
      "text": "JavaScript",
      "votes": 15
    },
    {
      "id": "option-uuid-2", 
      "text": "Python",
      "votes": 12
    }
  ]
}
```

### Real-time Flow
1. **Client Connection**: Client connects to Socket.IO server
2. **Room Subscription** (Optional): Client emits `poll:join` with poll ID for better performance
3. **Vote Casting**: User casts vote via REST API (`POST /api/votes`)
4. **Server Processing**: Server processes vote and aggregates results
5. **Broadcast**: Server emits `poll:results` to poll room (or all clients)
6. **Live Update**: Connected clients receive updated vote counts instantly

**Core Requirement**: Broadcasting results when votes are cast ✅
**Enhancement**: Room-based broadcasting for better performance 🔧

### Implementation Architecture

#### Server Setup (`src/server.ts`)
- Creates Socket.IO server with CORS configuration
- Integrates with Express HTTP server
- Registers real-time event handlers

#### Real-time Handler (`src/ws/realtime.ts`)
- **`registerRealtime()`**: Sets up Socket.IO server
- **`broadcastPollResults()`**: Emits live results to all connected clients

#### Vote Broadcasting (`src/routes/votes.ts`)
- After vote creation, aggregates current vote counts for the poll
- Broadcasts updated results to all connected clients
- Ensures real-time updates for all connected viewers

### Example Usage
```javascript
// Connect to server
const socket = io('http://localhost:4000');

// Listen for live results
socket.on('poll:results', (data) => {
  // Update UI with new vote counts
  updatePollResults(data.pollId, data.options);
});
```

## 🗄️ Database Schema (Prisma)

The application uses a well-designed relational database schema with proper relationships and constraints.

### Entity Relationships
- **User** (1) → **Poll** (N): One user can create many polls
- **Poll** (1) → **PollOption** (N): One poll can have many options
- **User** (N) ↔ **PollOption** (N): Many-to-many through Vote join table

### Models

#### User Model
```prisma
model User {
  id           String  @id @default(uuid())
  name         String
  email        String  @unique
  passwordHash String
  polls        Poll[]
  votes        Vote[]
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

#### Poll Model
```prisma
model Poll {
  id          String       @id @default(uuid())
  question    String
  isPublished Boolean      @default(false)
  creator     User         @relation(fields: [creatorId], references: [id], onDelete: Cascade)
  creatorId   String
  options     PollOption[]
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}
```

#### PollOption Model
```prisma
model PollOption {
  id       String  @id @default(uuid())
  text     String
  poll     Poll    @relation(fields: [pollId], references: [id], onDelete: Cascade)
  pollId   String
  votes    Vote[]
}
```

#### Vote Model (Join Table)
```prisma
model Vote {
  id            String      @id @default(uuid())
  user          User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId        String
  pollOption    PollOption  @relation(fields: [pollOptionId], references: [id], onDelete: Cascade)
  pollOptionId  String
  createdAt     DateTime    @default(now())

  @@unique([userId, pollOptionId], name: "one_vote_per_option")
}
```

### Key Constraints
- **Unique Email**: `User.email` must be unique
- **Vote Constraint**: `(userId, pollOptionId)` combination must be unique
- **Cascading Deletes**: Proper cleanup when parent records are deleted
  - User deletion → Polls deletion → Options deletion → Votes deletion

## 🧪 Testing the Application

### Using the Web Interface
1. Open `http://localhost:4000/` in your browser
2. View all polls with real-time vote counts
3. Cast votes using the API endpoints below

### API Testing with curl

#### Create a User
```bash
curl -X POST http://localhost:4000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

#### Create a Poll
```bash
curl -X POST http://localhost:4000/api/polls \
  -H "Content-Type: application/json" \
  -d '{"question":"Best programming language?","isPublished":true,"creatorId":"USER_ID","options":["JavaScript","Python","Java"]}'
```

#### Cast a Vote
```bash
curl -X POST http://localhost:4000/api/votes \
  -H "Content-Type: application/json" \
  -d '{"userId":"USER_ID","pollOptionId":"OPTION_ID"}'
```

### WebSocket Testing
```javascript
// In browser console or Node.js
const socket = io('http://localhost:4000');

// Listen for live results
socket.on('poll:results', (data) => {
  console.log('Live results:', data);
});
```

## 📁 Project Structure

```
Voting/
├── src/
│   ├── routes/
│   │   ├── users.ts      # User CRUD operations
│   │   ├── polls.ts      # Poll CRUD operations
│   │   └── votes.ts      # Vote operations with real-time broadcasting
│   ├── ws/
│   │   └── realtime.ts   # WebSocket event handlers
│   ├── services/
│   │   └── prisma.ts     # Prisma client configuration
│   └── server.ts         # Express server setup
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── migrations/       # Database migrations
├── index.html            # Frontend interface
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start development server with hot reload

# Production
npm run build           # Build TypeScript to JavaScript
npm start              # Start production server

# Database
npm run prisma:generate # Generate Prisma client
npm run prisma:migrate  # Run database migrations
npm run prisma:studio   # Open Prisma Studio
```

## 🚨 Error Handling

The application includes comprehensive error handling:

- **Validation Errors**: Zod schema validation with detailed error messages
- **Database Errors**: Proper handling of unique constraint violations
- **HTTP Status Codes**: Appropriate status codes for different scenarios
- **WebSocket Errors**: Graceful handling of connection issues

### Common Error Responses

#### Validation Error (400)
```json
{
  "error": {
    "fieldErrors": {
      "email": ["Invalid email format"]
    }
  }
}
```

#### Conflict Error (409)
```json
{
  "error": "User already voted on this poll"
}
```

#### Not Found Error (404)
```json
{
  "error": "Poll not found"
}
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds for secure password storage
- **Input Validation**: Zod schemas prevent malicious input
- **CORS Configuration**: Configurable cross-origin resource sharing
- **SQL Injection Protection**: Prisma ORM prevents SQL injection attacks
- **UUID Primary Keys**: Non-sequential IDs prevent enumeration attacks

## 📝 Additional Notes

- **No Authentication Flow**: This challenge focuses on backend architecture, not authentication
- **CORS Configuration**: Set `CLIENT_ORIGIN` environment variable for production
- **Database Visualization**: Use `npx prisma studio` to inspect and manage data
- **Real-time Updates**: WebSocket connections automatically handle reconnection
- **Scalability**: Room-based architecture supports multiple concurrent polls

## 🤝 Contributing

This project demonstrates:

- Clean, maintainable TypeScript code
- Proper separation of concerns
- Comprehensive error handling
- Real-time communication patterns
- Database design best practices
- RESTful API design principles


