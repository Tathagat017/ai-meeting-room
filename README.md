# AI Meetings To-Do App

A modern task management application that can parse natural language text and meeting transcripts to create structured tasks. The app supports voice recording, audio file uploads, and intelligent task parsing with timezone awareness (IST).

![image](https://github.com/user-attachments/assets/c23338fe-57c9-422a-8f43-7dfe8ebd8644)

![image](https://github.com/user-attachments/assets/de8119f0-f54a-4b57-af34-ad9e6b22e81c)

![image](https://github.com/user-attachments/assets/fb783e88-f92e-490f-a09d-276552aea14d)

## Features

### Task Management

- Create tasks using natural language input
- Parse meeting transcripts to extract multiple tasks
- Automatic assignee, due date, and priority detection
- Drag-and-drop task reordering
- Task status tracking (complete/incomplete)
- Task deletion with confirmation
- Priority levels (P1-P4) with color coding

### Audio & Transcription

- Live audio recording for task creation
- Audio file upload support (WAV, MP3, MPEG, WebM)
- Automatic transcription of audio to text
- Maximum 5-minute recording duration
- 10MB file size limit for uploads

### Date & Time Handling

- Smart date parsing (today, tomorrow, next week, etc.)
- Time zone aware (IST - Indian Standard Time)
- Flexible time format support (12/24 hour)
- Relative time understanding (morning, afternoon, evening, night)
- Special time markers (EOD, EOW, End of month, etc.)

### User Interface

- Modern, responsive design
- Glass-morphism UI effects
- Helpful tooltips for date/time formats
- Real-time notifications for actions
- Loading states and error handling
- Search functionality for tasks

## Tech Stack

### Frontend

- React.js
- MobX for state management
- Mantine UI component library
- FontAwesome icons
- DND Kit for drag-and-drop
- TypeScript

### Backend

- Node.js
- Express.js
- OpenAI API for natural language processing

### DATABASE - database.json local file for saving data/editing (./backend/database.json) as project not to be deployed.

## Environment Setup

1. Clone the repository:

```bash
git clone - https://github.com/Tathagat017/ai-meeting-room.git
cd ai-meetings-to-do
```

2. Create environment files:

## Backend .env ( inside backend folder )

For backend (./backend/.env):

```
PORT=8080
OPENAI_API_KEY=your_openai_api_key
```

## Frontend .env ( inside frontend folder )

For frontend (./frontend/.env):

```
VITE_API_BASE_URL=http://localhost:8080 //port 8080 for backened server
```

## Installation

### Backend Setup

```bash
cd backend
npm install
```

Required dependencies will be installed:

- express
- openai
- dotenv
- cors
- body-parser
- and other development dependencies

### Frontend Setup

```bash
cd frontend
npm install
```

Required dependencies will be installed:

- react
- @mantine/core
- @mantine/hooks
- @mantine/notifications
- mobx
- mobx-react-lite
- @dnd-kit/core
- @dnd-kit/sortable
- @fortawesome/react-fontawesome
- typescript
- and other development dependencies

## Running the Application

### Start the Backend Server

````bash
cd backend
npm run dev


The backend server will start on http://localhost:8080

### Start the Frontend Development Server

```bash
cd frontend
npm run dev
````

The frontend development server must communicate with the backend on port 8080

## API Endpoints

The backend provides the following API endpoints:

- `POST /api/tasks/parse` - Parse single task from text
- `POST /api/tasks/parse-transcript` - Parse multiple tasks from transcript
- `POST /api/tasks` - Create a new task
- `GET /api/tasks` - Get all tasks
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `POST /api/audio/transcribe` - Transcribe audio to text

## Usage Examples

### Creating a Task

Enter natural language text like:

- "Ram must finish heron project by today night 9:30pm"
- "Aman needs to complete the landing page by tomorrow afternoon"
- "High priority task for Priya to review code by EOD"

### Recording Meeting Minutes

1. Click the microphone icon to start recording
2. Speak your meeting minutes
3. Stop recording to automatically transcribe
4. Review and accept/reject extracted tasks

### Uploading Audio Files

1. Click the upload icon
2. Select an audio file (WAV, MP3, MPEG, WebM)
3. Wait for transcription
4. Review and accept/reject extracted tasks

## License

This project is licensed under the MIT License - see the LICENSE file for details.
