# Auth Service (Microservice)

A Node.js + Express authentication microservice with JWT authentication, deployed on Render.  
Supports user registration, login, and protected routes.

---

## Technologies Used
- Node.js
- Express.js
- MongoDB (Atlas)
- Mongoose
- JWT for authentication
- dotenv for environment variables
- Render for deployment

---

## Getting Started (Local Development)

### 1. Clone the repository
```bash
git clone <YOUR_REPO_URL>
cd auth-service
2. Install dependencies
bash
Copy code
npm install
3. Create a .env file
Add the following variables:

ini
Copy code
MONGO_URI=<Your MongoDB Atlas URI>
JWT_SECRET=<Your JWT secret>
PORT=5001   # Optional, defaults to 5001 for local
4. Start the server
bash
Copy code
npm run dev
Server will run on http://localhost:5001/

Root route / should return: "Auth Service API is running 🚀"

API Endpoints
Method	Endpoint	Description	Body / Headers
GET	/	Root route, check service status	None
POST	/api/auth/register	Register a new user	JSON body: { "name": "", "email": "", "password": "" }
POST	/api/auth/login	Login user	JSON body: { "email": "", "password": "" }
GET	/api/auth/profile	Protected route (get user info)	Header: Authorization: Bearer <JWT_TOKEN>

Deployment
Service deployed on Render:
https://auth-service-wazj.onrender.com
Environment variables must be set in Render dashboard: MONGO_URI, JWT_SECRET

Free Render instances may sleep → first request can take 10–30 seconds

Testing
Root Route:
GET https://auth-service-wazj.onrender.com/ → "Auth Service API is running 🚀"

Register User:
POST https://auth-service-wazj.onrender.com/api/auth/register with JSON body

Login User:
POST https://auth-service-wazj.onrender.com/api/auth/login → copy token

Protected Route:
GET https://auth-service-wazj.onrender.com/api/auth/profile with Header:

makefile
Copy code
Authorization: Bearer <JWT_TOKEN>
Recommended tools: Postman or Thunder Client
