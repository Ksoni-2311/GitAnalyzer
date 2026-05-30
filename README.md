# GitHub Profile Analyzer API

A Node.js + Express.js backend service that analyzes GitHub user profiles using the GitHub Public API and stores useful insights in a MySQL database.

## Features

- Fetch public GitHub profile data by username
- Analyze repositories and generate insights
- Store analyzed data in MySQL
- Retrieve all analyzed profiles
- Retrieve a single analyzed profile
- Update existing profile analysis
- GitHub user validation before analysis
- AI-generated profile summary (Optional)

---

## Tech Stack

- Node.js
- Express.js
- MySQL
- GitHub REST API
- Axios
- dotenv

## Project Structure

```bash
github-profile-analyzer/
│
├── config/
│   └── db.js                  # MySQL database connection
│
├── middleware/
│   └── github.middleware.js   # GitHub user validation middleware
│
├── routes/
│   └── github.api.routes.js   # API routes
│
├── utils/
│   ├── ai.summary.js          # AI summary generation
│   └── grok.ai.summary.js     # Groq AI integration
│
├── .env                       # Environment variables
├── .gitignore
├── package.json
├── package-lock.json
└── server.js                  # Application entry point
```

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/your-username/github-profile-analyzer.git

cd github-profile-analyzer
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Environment Variables

Create a `.env` file in the root directory.

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=github_analyzer
GROQ_API_KEY=your_groq_api_key
GITHUB_TOKEN=your_github_token
```

> GitHub Token is optional but recommended to avoid rate limits.

---

## Database Setup

Create a MySQL database:

```sql
CREATE DATABASE github_analyzer;
```

Use the following table:

```sql
CREATE TABLE github_profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    github_id BIGINT UNIQUE,
    username VARCHAR(255) UNIQUE,
    name VARCHAR(255),
    bio TEXT,
    avatar_url TEXT,
    profile_url TEXT,
    public_repos INT,
    followers INT,
    following INT,
    account_created_at DATETIME,
    total_stars INT DEFAULT 0,
    most_starred_repo VARCHAR(255),
    most_used_language VARCHAR(100),
    analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Running the Application

Development mode:

```bash
npm run dev
```


Server will run at:

```txt
http://localhost:5000
```

---
## API Endpoints

### 1. Analyze a GitHub Profile

Fetches data from the GitHub API, generates insights and an AI summary, then stores the analysis in MySQL.

```http
GET /api/v1/analyze/:username
```

Example:

```http
GET /api/v1/analyze/octocat
```

---

### 2. Get All Analyzed Profiles

Returns all stored GitHub profile analyses.

```http
GET /api/v1/allprofile
```

Example:

```http
GET /api/v1/allprofile
```

---

### 3. Get a Single Analyzed Profile

Returns the stored analysis for a specific GitHub username.

```http
GET /api/v1/profile/:username
```

Example:

```http
GET /api/v1/profile/ksoni-2311
```

---

### 4. Health Check Route

Used to verify that the API routes are working correctly.

```http
GET /api/v1/
```

Example:

```http
GET /api/v1/
```

Response:

```json
{
  "message": "routes working"
}
```

---

## Example Response

```json
{
  "success": true,
  "message": "Profile analyzed successfully",
  "data": {
    "username": "octocat",
    "followers": 10500,
    "publicRepos": 8,
    "totalStars": 250,
    "totalForks": 80,
    "topLanguage": "JavaScript",
    "profileScore": 100,
    "aiSummary": "Octocat is an active GitHub developer primarily working with JavaScript and has received significant community engagement."
  }
}
```

---

## Deployment

The backend service is deployed on Render and publicly accessible.

### Live API

https://gitanalyzer.onrender.com

### Available Routes

| Method | Endpoint | Description |
|----------|----------|-------------|
| GET | `/api/v1/analyze/:username` | Analyze and store a GitHub profile |
| GET | `/api/v1/allprofile` | Fetch all analyzed profiles |
| GET | `/api/v1/profile/:username` | Fetch a specific analyzed profile |
| GET | `/api/v1/` | Health check route |

### Quick Links

- Analyze Profile:
  https://gitanalyzer.onrender.com/api/v1/analyze/ksoni-2311

- Get All Profiles:
  https://gitanalyzer.onrender.com/api/v1/allprofile

- Get Single Profile:
  https://gitanalyzer.onrender.com/api/v1/profile/ksoni-2311

- Health Check:
  https://gitanalyzer.onrender.com/api/v1/

---

## Author

Keshav Soni

GitHub:
https://github.com/Ksoni-2311
