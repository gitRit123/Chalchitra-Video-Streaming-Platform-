# Chalchitra

A practical, YouTube-inspired video platform with Node/Express backend and React + MUI frontend.

## Key Features
- Upload, list, watch videos with thumbnails
- Search and trending pages
- Authentication (register/login)
- Role-based access: admin or user
- Admin/Owner can delete videos; delete button on watch page
- Comments and likes/dislikes
- Subscriptions (stubbed endpoint)
- Profile page for logged-in user
- Landing opens to Home with a prompt to continue as guest or login
- Light/Dark themes

## Roles and Permissions
- user: can browse, search, watch, like, comment, upload
- admin: all user abilities plus delete any video
- Owner of a video can delete their own video as well

## API Highlights
- Auth
  - POST /api/auth/register (optionally pass adminCode to register as admin if configured)
  - POST /api/auth/login -> returns JWT token
  - GET /api/auth/me -> current user profile (requires Authorization: Bearer <token>)
- Videos
  - GET /api/videos (list)
  - GET /api/videos/:id (details)
  - POST /api/videos (create; auth required)
  - POST /api/videos/:id/views (increment)
  - POST /api/videos/:id/like (auth required)
  - DELETE /api/videos/:id (auth required; admin or owner)

## Getting started

### Prerequisites
- Node.js 18+
- MongoDB running and available via connection string

### Backend Setup
1. cd backend
2. Create .env with:
   - PORT=5000
   - MONGO_URI=...
   - JWT_SECRET=...
   - ADMIN_EMAILS=comma,separated,admin@yourdomain.com
   - ADMIN_INVITE_CODE=optional-secret-code
3. npm install
4. npm run dev

### Frontend Setup
1. cd frontend
2. Create .env:
   - REACT_APP_API_URL=http://localhost:5000
3. npm install
4. npm start

### Default UX
- Visiting "/" loads Home and shows a gate dialog if you are not logged in, offering Continue as guest or Login.
- When logged in, open the Profile page from the top bar.
- Admins or owners see a Delete button on the video watch page.

## Notes
- File deletion attempts to remove uploaded files stored under backend/uploads when the DB record is deleted.
- Styling is inspired by YouTube using MUI components; adjust theme in src/theme.js.

## License
MIT
<<<<<<< HEAD
=======
**
>>>>>>> 05968b16cec44b4e7720f387e70368a7bf153063
