# University FAQ Chatbot UI

## Overview
This is a React-based user interface for the University FAQ Chatbot system. The application provides an interactive chat interface, FAQ management system, and analytics dashboard for tracking user queries.

## Features
- Interactive Chat Interface
- FAQ Management Dashboard
- Category-based Analytics
- Quick Reply System
- Real-time Search
- User Feedback System

## Tech Stack
- React 18
- Tailwind CSS
- Lucide React Icons
- Recharts for Analytics
- Modern UI Components

## Prerequisites
```bash
Node.js >= 14.0.0
npm >= 6.14.0
```

## Installation

1. Clone the repository:
```bash
git clone [<your-repository-url>](https://github.com/zmehta2/university-chatbot-ui.git)
cd university-faq-chatbot-ui
```

2. Install dependencies:
```bash
npm install
```

3. Install additional required packages:
```bash
npm install recharts lucide-react
```

## Project Structure
```
src/
  ├── components/
  │   ├── ChatAnalytics.jsx    # ChatBot
  │   ├── FAQDashboard.jsx     # FAQ management interface
  │   ├── AnalyticsView.jsx    # Analytics dashboard
  │   ├── Login.jsx            # Login/Logout Handling
  ├── App.jsx                  # Main application component
  ├── context/
  │   ├── AuthContext.js       # To Handle User roles 
  ├── index.js                 # Entry point
```

## Key Components

### App.jsx
- Main application container
- Handles chat functionality
- Manages user authentication
- Routes between different views

### FAQDashboard.jsx
- CRUD operations for FAQs
- Category management
- Search functionality
- Filtering capabilities

### ChatAnalytics.jsx
- Visualizes chat statistics
- Category distribution chart
- User interaction metrics

## API Integration

### Endpoints Used
```javascript
// Chat Endpoints
POST /api/university/chat-logs
GET /api/university/chat-logs/user/{userId}

// FAQ Endpoints
GET /api/university/faqs
POST /api/university/faqs
PUT /api/university/faqs/{id}
DELETE /api/university/faqs/{id}

// Category Endpoints
GET /api/university/categories
GET /api/university/quick-replies
```

## Running the Application

1. Start the development server:
```bash
npm start
```

2. Access the application:
```
http://localhost:3000
```

## Features Implementation

### Chat Interface
- Real-time message updates
- User/Bot message distinction
- Message history
- Quick replies
- Search functionality

### FAQ Management
- Create, Read, Update, Delete FAQs
- Category-based organization
- Search and filter capabilities
- Bulk operations

### Analytics Dashboard
- Pie chart for category distribution
- Question frequency analysis
- User interaction metrics

## Styling
- Tailwind CSS for responsive design
- Custom components following design system
- Consistent color scheme and typography

## Authentication
- Admin/User role separation
- Protected routes
- Session management

## Environment Variables
Create a `.env` file in the root directory:
```
REACT_APP_API_URL=http://localhost:9090/api
```

## Scripts
```json
{
  "start": "react-scripts start",
  "build": "react-scripts build",
  "test": "react-scripts test",
  "eject": "react-scripts eject"
}
```

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Common Issues and Solutions

### Recharts Integration
If facing issues with Recharts:
```bash
npm install recharts --save --force
```

### API Connection
Ensure backend server is running on port 9090 before starting the UI application.

### CORS Issues
Backend should have CORS configured for localhost:3000.

## Future Enhancements for live project
- Real-time chat updates
- Advanced analytics features
- Multi-language support
- Dark mode implementation

## Performance Considerations
- Lazy loading of components
- Optimized re-renders
- Efficient state management
- API response caching

## Testing
```bash
npm test
```

## Build for Production
```bash
npm run build
```

## License
This project is licensed under the MIT License - see the LICENSE.md file for details.
