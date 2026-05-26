# API Endpoints Specification

## 1. Authentication (`/api/auth`)
- `POST /register`: Create new account.
- `POST /login`: Authenticate user and return JWT.
- `POST /logout`: Invalidate session.
- `GET /me`: Get current authenticated user profile.

## 2. Profiles (`/api/users`)
- `GET /:id`: Get user profile.
- `PATCH /:id`: Update profile info (bio, profile pic, cover).
- `GET /:id/friends`: List user's friends.
- `GET /suggestions`: Get friend suggestions based on mutuals/AI.

## 3. Feed & Posts (`/api/posts`)
- `GET /feed`: Get personalized algorithmic feed (Gemini-powered).
- `POST /`: Create new post (multi-media support).
- `GET /:id`: Get specific post.
- `PATCH /:id`: Edit post.
- `DELETE /:id`: Remove post.
- `POST /:id/react`: Add/update reaction (Like, Love, etc.).
- `POST /:id/share`: Share post to own feed.

## 4. Comments (`/api/comments`)
- `GET /post/:postId`: Get comments for a post.
- `POST /post/:postId`: Add comment.
- `PATCH /:id`: Edit comment.
- `DELETE /:id`: Delete comment.

## 5. Messenger (`/api/chat`)
- `GET /conversations`: List active chats.
- `GET /conversations/:id/messages`: Get message history.
- `POST /conversations/:id/messages`: Send message.

## 6. Notifications (`/api/notifications`)
- `GET /`: Get current user notifications.
- `PATCH /:id/read`: Mark as read.

## 7. AI Services (`/api/ai`)
- `POST /moderation`: Content safety check.
- `GET /recommendations`: Get AI-suggested content.
- `POST /summarize`: Summarize long threads/groups.
