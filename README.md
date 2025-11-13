# Web3 DApp Platform

Secure encrypted notes application with bounty board, Lumia Passport authentication, and Telegram task verification.

## Features

- 🔐 Lumia Passport authentication (Account Abstraction)
- 🔒 Client-side AES-GCM encryption for notes
- 📝 Full CRUD operations for notes
- 🎯 Bounty Board with task verification
- � Telegram task verification via tasks-verifiers SDK
- 🏆 User scoring and leaderboard system
- 🎨 Modern UI with Tailwind CSS
- 🔑 Wallet-derived encryption keys

## Tech Stack

### Frontend
- React + TypeScript + Vite
- @lumiapassport/ui-kit
- TanStack Query
- Tailwind CSS
- Axios
- Web Crypto API

### Backend
- NestJS + TypeScript
- @lumiapassport/core
- tasks-verifiers (Telegram verification)
- Prisma ORM
- PostgreSQL
- Class Validator

## Project Structure

```
├── client/                 # Frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── NotesList.tsx
│   │   │   ├── NoteCard.tsx
│   │   │   ├── NoteForm.tsx
│   │   │   └── BountyBoard.tsx
│   │   ├── hooks/         # Custom hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useNotes.ts
│   │   │   └── useTasks.ts
│   │   ├── lib/           # API & encryption utilities
│   │   └── main.tsx       # App entry point
│   └── package.json
│
└── server/                # Backend application
    ├── src/
    │   ├── auth/          # Authentication module
    │   ├── notes/         # Notes CRUD module
    │   ├── tasks/         # Tasks & verification module
    │   ├── prisma/        # Database service
    │   └── main.ts        # Server entry point
    ├── prisma/
    │   ├── schema.prisma  # Database schema
    │   └── seed.ts        # Sample tasks seeder
    └── package.json
```

## Setup Instructions

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Lumia Passport Project ID

### 1. Database Setup

Create a PostgreSQL database:

```bash
createdb notes_db
```

Or use existing PostgreSQL instance and update connection string.

### 2. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
```

Edit `server/.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/notes_db?schema=public"
LUMIA_PROJECT_ID="your-lumia-project-id"
PORT=3001
```

Run database migrations:

```bash
npx prisma migrate dev --name init
```

Seed sample tasks:

```bash
npx ts-node prisma/seed.ts
```

Start the server:

```bash
npm run start:dev
```

Server will run on `http://localhost:3001`

### 3. Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
```

Edit `client/.env`:

```env
VITE_API_URL=http://localhost:3001
VITE_LUMIA_PROJECT_ID="your-lumia-project-id"
```

Start the development server:

```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## Usage

### Notes Feature
1. Open `http://localhost:5173` in your browser
2. Click "Connect Wallet" to authenticate with Lumia Passport
3. Choose authentication method (Email, Passkey, Telegram, or Wallet)
4. Click "Notes" tab
5. Create, edit, and delete encrypted notes
6. Notes are automatically encrypted/decrypted using your wallet address

### Bounty Board Feature
1. After connecting wallet, click "Bounty Board" tab
2. View available tasks with reward points
3. Click "Verify Task" to complete a task
4. System verifies task completion via Telegram
5. Upon successful verification, points are awarded
6. View your total score and completed tasks count

## API Endpoints

### Authentication
- `POST /api/auth/verify-session` - Verify Lumia Passport session

### Notes
- `GET /api/notes` - Get all user notes
- `GET /api/notes/:id` - Get specific note
- `POST /api/notes` - Create new note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

### Tasks & Bounty Board
- `GET /api/tasks` - Get all available tasks
- `GET /api/tasks/:id` - Get specific task
- `POST /api/tasks` - Create new task (admin)
- `POST /api/tasks/:id/verify` - Verify task completion
- `GET /api/tasks/user/score` - Get user score and completed tasks
- `GET /api/tasks/leaderboard/top` - Get top users leaderboard

All protected endpoints require `Authorization: Bearer <session-token>` header.

## Security Features

### Client-Side Encryption
- Notes content is encrypted before sending to server
- Uses AES-GCM with 256-bit keys
- Keys derived from wallet address (SHA-256)
- Encryption/decryption happens in browser only

### Authentication
- Session verification via @lumiapassport/core
- Wallet ownership validation
- Token-based authorization
- Per-user data isolation

### Task Verification
- Telegram task verification via tasks-verifiers SDK
- One-time verification per user per task
- Points awarded only after successful verification
- Prevents duplicate completions

## Database Schema

```prisma
model User {
  id            String     @id @default(uuid())
  walletAddress String     @unique
  score         Int        @default(0)
  createdAt     DateTime   @default(now())
  notes         Note[]
  userTasks     UserTask[]
}

model Note {
  id        String   @id @default(uuid())
  userId    String
  title     String
  content   String   @db.Text
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(...)
}

model Task {
  id             String     @id @default(uuid())
  title          String
  description    String     @db.Text
  telegramTaskId String
  rewardPoints   Int
  createdAt      DateTime   @default(now())
  userTasks      UserTask[]
}

model UserTask {
  id          String    @id @default(uuid())
  userId      String
  taskId      String
  verified    Boolean   @default(false)
  completedAt DateTime?
  createdAt   DateTime  @default(now())
  user        User      @relation(...)
  task        Task      @relation(...)
  
  @@unique([userId, taskId])
}
```

## Development

### Backend
```bash
cd server
npm run start:dev     # Development mode with hot reload
npm run build         # Production build
npm run start:prod    # Production mode
```

### Frontend
```bash
cd client
npm run dev           # Development server
npm run build         # Production build
npm run preview       # Preview production build
```

## Troubleshooting

### Database connection issues
- Verify PostgreSQL is running
- Check DATABASE_URL in server/.env
- Ensure database exists: `createdb notes_db`

### Authentication issues
- Verify LUMIA_PROJECT_ID is set in both .env files
- Check if Project ID is valid in Lumia Dashboard
- Clear browser localStorage if stuck

### Task verification issues
- Ensure tasks-verifiers SDK is properly installed
- Check telegramTaskId format in database
- Verify wallet address matches Telegram account

### CORS errors
- Ensure frontend URL matches in server/src/main.ts
- Default: `http://localhost:5173`

## License

MIT



### 1. Database Setup## Deployment



Create a PostgreSQL database:When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.



```bashIf you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

createdb notes_db

``````bash

$ npm install -g @nestjs/mau

Or use existing PostgreSQL instance and update connection string.$ mau deploy

```

### 2. Backend Setup

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

```bash

cd server## Resources



# Install dependenciesCheck out a few resources that may come in handy when working with NestJS:

npm install

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.

# Configure environment variables- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).

cp .env.example .env- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).

```- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.

- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).

Edit `server/.env`:- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).

- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).

```env- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

DATABASE_URL="postgresql://user:password@localhost:5432/notes_db?schema=public"

LUMIA_PROJECT_ID="your-lumia-project-id"## Support

PORT=3001

```Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).



Run database migrations:## Stay in touch



```bash- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)

npx prisma migrate dev --name init- Website - [https://nestjs.com](https://nestjs.com/)

```- Twitter - [@nestframework](https://twitter.com/nestframework)



Start the server:## License



```bashNest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

npm run start:dev
```

Server will run on `http://localhost:3001`

### 3. Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
```

Edit `client/.env`:

```env
VITE_API_URL=http://localhost:3001
VITE_LUMIA_PROJECT_ID="your-lumia-project-id"
```

Start the development server:

```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## Usage

1. Open `http://localhost:5173` in your browser
2. Click "Connect Wallet" to authenticate with Lumia Passport
3. Choose authentication method (Email, Passkey, Telegram, or Wallet)
4. Once connected, create, edit, and delete encrypted notes
5. Notes are automatically encrypted/decrypted using your wallet address

## API Endpoints

### Authentication
- `POST /api/auth/verify-session` - Verify Lumia Passport session

### Notes
- `GET /api/notes` - Get all user notes
- `GET /api/notes/:id` - Get specific note
- `POST /api/notes` - Create new note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

All notes endpoints require `Authorization: Bearer <session-token>` header.

## Security Features

### Client-Side Encryption
- Notes content is encrypted before sending to server
- Uses AES-GCM with 256-bit keys
- Keys derived from wallet address (SHA-256)
- Encryption/decryption happens in browser only

### Authentication
- Session verification via @lumiapassport/core
- Wallet ownership validation
- Token-based authorization
- Per-user data isolation

## Database Schema

```prisma
model User {
  id            String   @id @default(uuid())
  walletAddress String   @unique
  createdAt     DateTime @default(now())
  notes         Note[]
}

model Note {
  id        String   @id @default(uuid())
  userId    String
  title     String
  content   String   @db.Text
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(...)
}
```

## Development

### Backend
```bash
cd server
npm run start:dev     # Development mode with hot reload
npm run build         # Production build
npm run start:prod    # Production mode
```

### Frontend
```bash
cd client
npm run dev           # Development server
npm run build         # Production build
npm run preview       # Preview production build
```

## Troubleshooting

### Database connection issues
- Verify PostgreSQL is running
- Check DATABASE_URL in server/.env
- Ensure database exists: `createdb notes_db`

### Authentication issues
- Verify LUMIA_PROJECT_ID is set in both .env files
- Check if Project ID is valid in Lumia Dashboard
- Clear browser localStorage if stuck

### CORS errors
- Ensure frontend URL matches in server/src/main.ts
- Default: `http://localhost:5173`

## License

MIT
