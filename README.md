# Shadow Zone - Secure Collaborative Note-Taking App

A modern, secure collaborative note-taking application built with Node.js, Express, and MongoDB.

## Features

- 🔐 Secure Authentication System
  - JWT-based authentication
  - Email verification
  - Password reset functionality
  - Social login (Auth0, Google, GitHub)
  - Strong password requirements

- 🎨 Modern UI/UX
  - Clean and intuitive interface
  - Responsive design
  - Dark/Light mode support
  - Real-time collaboration

- 🛡️ Security Features
  - End-to-end encryption
  - XSS protection
  - CSRF protection
  - Rate limiting
  - Secure password storage

## Tech Stack

- **Frontend:**
  - HTML5
  - CSS3 (with modern features)
  - Vanilla JavaScript
  - Responsive Design

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB with Mongoose
  - JWT Authentication
  - Nodemailer

- **Security:**
  - Helmet.js
  - Express Rate Limit
  - MongoDB Sanitize
  - XSS Clean
  - CORS

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/shadow-zone.git
   cd shadow-zone
   ```

2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies (if any)
   cd ../frontend
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the variables with your configuration

4. Start the development server:
   ```bash
   # Start backend server
   cd backend
   npm start

   # Serve frontend (if needed)
   cd ../frontend
   npm start
   ```

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=your_mongodb_uri

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES=7

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email
SMTP_PASS=your_password
FROM_NAME=Shadow Zone
FROM_EMAIL=your_email

# OAuth Configuration
AUTH0_DOMAIN=your_auth0_domain
AUTH0_CLIENT_ID=your_auth0_client_id
AUTH0_CLIENT_SECRET=your_auth0_client_secret
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Your Name - your.email@example.com
Project Link: [https://github.com/yourusername/shadow-zone](https://github.com/yourusername/shadow-zone)
