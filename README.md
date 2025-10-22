# CipherStudio

A full-stack web application that provides an online code editor with live preview capabilities, built for modern web development.

## 🚀 Features

### Frontend Features
- **File Explorer**: Create, delete, rename files and folders with a tree-like interface
- **Code Editor**: Monaco Editor integration with syntax highlighting for multiple languages
- **Live Preview**: Real-time React rendering using Sandpack
- **Project Management**: Save, load, export, and import projects
- **Theme Support**: Dark and light theme switching
- **Auto-save**: Automatic project saving with configurable intervals
- **Responsive Design**: Works on desktop and mobile devices

### Backend Features
- **RESTful API**: Complete CRUD operations for projects
- **MongoDB Integration**: Persistent storage with Mongoose ODM
- **Security**: Helmet.js for security headers, CORS configuration
- **Rate Limiting**: API rate limiting to prevent abuse
- **File Management**: Server-side file operations and validation
- **Project Versioning**: Automatic version tracking and timestamps

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Monaco Editor** - Code editor
- **Sandpack** - Live preview and bundling
- **Lucide React** - Icons
- **CSS Variables** - Theming system

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Helmet.js** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger

## 📁 Project Structure

```
CipherSchools/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FileExplorer.jsx      # File tree component
│   │   │   ├── EditorPane.jsx        # Monaco editor
│   │   │   ├── PreviewPane.jsx       # Live preview
│   │   │   └── Topbar.jsx            # Navigation and controls
│   │   ├── hooks/
│   │   │   └── useProjectStorage.js  # Project state management
│   │   ├── utils/
│   │   │   └── projectUtils.js       # File manipulation utilities
│   │   ├── App.tsx                   # Main application
│   │   └── App.css                   # Global styles
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # Database connection
│   │   ├── models/
│   │   │   └── Project.js            # Project schema
│   │   ├── controllers/
│   │   │   └── projectController.js   # API logic
│   │   ├── routes/
│   │   │   └── projects.js           # API routes
│   │   └── index.js                  # Server entry point
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CipherSchools
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../backend
   npm install
   ```

4. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp env.example .env
   
   # Edit .env with your configuration
   MONGODB_URI=mongodb://localhost:27017/cipherstudio
   PORT=5000
   FRONTEND_URL=http://localhost:5173
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   Server will run on http://localhost:5000

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```
   Application will run on http://localhost:5173

3. **Open your browser**
   Navigate to http://localhost:5173 to see the application

## 📖 Usage

### Creating a New Project
1. Click the "New" button in the topbar
2. Start adding files using the file explorer
3. The project auto-saves every 2 seconds (configurable)

### File Management
- **Create files**: Click the "+" button next to folders
- **Rename files**: Click the edit icon next to any file
- **Delete files**: Click the trash icon next to any file
- **Create folders**: Add a "/" at the end of the filename

### Code Editing
- Select any file from the file explorer
- Start coding with full syntax highlighting
- Changes are automatically reflected in the preview

### Project Persistence
- **Save**: Manual save using the Save button
- **Load**: Load previously saved projects
- **Export**: Download project as JSON
- **Import**: Upload and load project JSON files

## 🔧 API Endpoints

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Files
- `POST /api/projects/:id/files` - Add file to project
- `PUT /api/projects/:id/files` - Update file content
- `DELETE /api/projects/:id/files` - Delete file from project

### Utilities
- `POST /api/projects/:id/duplicate` - Duplicate project
- `GET /health` - Health check

## 🎨 Customization

### Themes
The application supports both dark and light themes. You can:
- Toggle themes using the theme button in the topbar
- Customize colors by modifying CSS variables in `App.css`

### Editor Settings
- Font size
- Tab size
- Auto-save interval
- Language-specific settings

## 🚀 Deployment

### Frontend Deployment
```bash
cd frontend
npm run build
# Deploy the dist/ folder to your hosting service
```

### Backend Deployment
```bash
cd backend
npm start
# Deploy to your server (Heroku, DigitalOcean, AWS, etc.)
```

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
FRONTEND_URL=https://your-frontend-domain.com
PORT=5000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Code editor
- [Sandpack](https://sandpack.codesandbox.io/) - Live preview
- [CodeSandbox](https://codesandbox.io/) - Inspiration
- [React](https://reactjs.org/) - UI framework
- [Express.js](https://expressjs.com/) - Backend framework
