# 🤖 Company Brochure AI

> **Turn any publicly accessible company website into a professional company brochure using Web Scraping, FastAPI, and Large Language Models.**

Company Brochure AI is an AI-powered web application that takes a company's website URL, extracts meaningful information from the website, and transforms that information into a structured and professional company brochure.

The project was built not only as an application, but also as a hands-on learning project to understand how modern **LLM-powered applications are designed, connected, secured, and deployed**.

---

## 🌐 What Does This Project Do?

Imagine you want to quickly understand a company.

Normally, you may need to:

- Open the company's website
- Read multiple pages
- Find the company's services
- Understand its target customers
- Identify its industries
- Find contact information
- Manually summarize everything

Company Brochure AI automates this process.

You simply provide:

```text
https://example.com
```

The application:

```text
Company Website
       ↓
Web Scraping
       ↓
HTML Processing
       ↓
Clean Text
       ↓
LLM Analysis
       ↓
Structured Company Brochure
       ↓
Display in Web Interface
```

---

# ✨ Key Features

### 🔗 1. Website URL Input

Users can enter a publicly accessible company website URL.

Example:

```text
https://www.microsoft.com
```

The application accepts the URL and sends it to the backend for processing.

---

### 🕷️ 2. Website Scraping

The backend retrieves the webpage using Python's `requests` library.

BeautifulSoup is then used to parse the HTML.

Unnecessary elements such as:

- `<script>`
- `<style>`
- `<nav>`
- `<footer>`

are removed before extracting the meaningful textual content.

This produces cleaner information for the LLM.

---

### 🧠 3. AI-Powered Brochure Generation

The cleaned website content is passed to an LLM through the Groq API.

The model analyzes the company information and generates a structured brochure containing:

1. Company Name
2. Company Overview
3. Products and Services
4. Industries Served
5. Key Features or Strengths
6. Target Customers
7. Contact Information

The prompt also instructs the model:

> **Do not invent information. Only use information present in the provided company content.**

This helps reduce hallucination and keeps the generated brochure grounded in the scraped website content.

---

### ⚡ 4. FastAPI Backend

FastAPI acts as the application's backend API.

The main endpoint is:

```text
POST /generate
```

The frontend sends:

```json
{
  "url": "https://example.com"
}
```

The backend processes the request and returns:

```json
{
  "success": true,
  "brochure": "Generated company brochure..."
}
```

---

### 🎨 5. Simple Web Interface

The frontend provides a clean interface where users can:

1. Enter a company URL
2. Click **Generate Brochure**
3. Wait while the application processes the website
4. Read the generated brochure

The frontend is built using:

- HTML
- CSS
- JavaScript

No complicated frontend framework is required for this version.

---

# 🏗️ System Architecture

```text
                         USER
                          │
                          ▼
              ┌──────────────────────┐
              │      FRONTEND        │
              │   HTML + CSS + JS    │
              └──────────┬───────────┘
                         │
                         │ POST /generate
                         ▼
              ┌──────────────────────┐
              │       FASTAPI        │
              │       BACKEND        │
              └──────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │    WEB SCRAPER       │
              │ requests +           │
              │ BeautifulSoup        │
              └──────────┬───────────┘
                         │
                         ▼
                  Clean Website Text
                         │
                         ▼
              ┌──────────────────────┐
              │      LLM LAYER       │
              │      Groq API        │
              └──────────┬───────────┘
                         │
                         ▼
                Generated Brochure
                         │
                         ▼
              ┌──────────────────────┐
              │       FRONTEND       │
              │   Display Result     │
              └──────────────────────┘
```

---

# 🛠️ Technology Stack

## Frontend

- HTML5
- CSS3
- JavaScript
- Fetch API

## Backend

- Python
- FastAPI
- Uvicorn

## Web Scraping

- Requests
- BeautifulSoup4

## Artificial Intelligence

- Groq API
- Large Language Model
- Prompt Engineering

## Environment & Security

- Python dotenv
- Environment variables
- `.env`
- `.gitignore`

## Development Tools

- Antigravity
- uv
- Git
- GitHub

---

# 📁 Project Structure

```text
company-brochure-generator/
│
├── backend/
│   │
│   ├── main.py
│   ├── scraper.py
│   ├── llm.py
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   │
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── .gitignore
└── README.md
```

---

# 🔍 How the Backend Works

The backend is divided into separate responsibilities.

## `main.py`

This is the FastAPI application.

It:

- Creates the API
- Receives the website URL
- Calls the scraper
- Sends scraped information to the LLM
- Returns the generated brochure

Main endpoint:

```text
POST /generate
```

---

## `scraper.py`

This file is responsible for website extraction.

The main function is:

```python
scrape_website(url)
```

It:

1. Sends an HTTP request to the website
2. Receives the HTML
3. Parses it using BeautifulSoup
4. Removes unnecessary HTML elements
5. Extracts readable text
6. Returns the cleaned text

---

## `llm.py`

This file handles communication with the LLM.

The main function is:

```python
generate_brochure(company_text)
```

It:

1. Receives cleaned company information
2. Creates a structured prompt
3. Sends the prompt to Groq
4. Receives the model response
5. Extracts the generated brochure
6. Returns it to FastAPI

---

# 🔐 API Key Security

The Groq API key is **not hardcoded into the application**.

Instead, it is stored in an environment variable:

```env
GROQ_API_KEY=your_secret_key
```

The application loads the key using:

```python
os.getenv("GROQ_API_KEY")
```

The `.env` file is excluded from Git using:

```gitignore
.env
```

This prevents the secret API key from being accidentally committed to GitHub.

---

# 🔄 From Ollama to Groq

An important part of this project was moving from a locally hosted LLM to a cloud-based LLM API.

### Initial architecture

```text
Frontend
   ↓
FastAPI
   ↓
Ollama
   ↓
Local LLM
```

This worked on my computer but created a problem for deployment.

If another person opened the website, they could not access the Ollama instance running on my laptop.

### Production-oriented architecture

The project was changed to:

```text
Frontend
   ↓
FastAPI
   ↓
Groq API
   ↓
Cloud LLM
```

This makes the application suitable for public deployment.

---

# 🌍 Deployment Architecture

The project is designed to be deployed using:

### Frontend

**Vercel**

```text
Frontend
   ↓
Vercel
```

### Backend

**Render**

```text
FastAPI
   ↓
Render
```

### LLM

**Groq**

```text
Render
   ↓
Groq API
```

The complete production flow becomes:

```text
                 INTERNET
                    │
                    ▼
          ┌──────────────────┐
          │      VERCEL      │
          │    Frontend      │
          └────────┬─────────┘
                   │
                   │ HTTPS
                   ▼
          ┌──────────────────┐
          │     RENDER       │
          │    FastAPI       │
          └────────┬─────────┘
                   │
                   ▼
          ┌──────────────────┐
          │      GROQ        │
          │     LLM API      │
          └──────────────────┘
```

This means a user only needs a browser.

They do **not** need:

- Python
- Ollama
- the project source code
- any local model
- any API key

---

# 👥 How Can Other People Use This?

The application can be useful for anyone who wants a quick structured understanding of a company.

### 👨‍💼 Recruiters

Recruiters can quickly understand a company or organization from its website.

### 📊 Business Researchers

Researchers can convert company websites into structured summaries.

### 💼 Sales Teams

Sales teams can use the generated information as a starting point for company research.

### 🚀 Startup Founders

Founders can quickly create an initial company overview for presentations, research, or internal documentation.

### 🎓 Students

Students can use it to understand companies while researching:

- internships
- jobs
- organizations
- industries
- competitors

### 🔎 General Users

Anyone who wants a quick overview of a publicly accessible company website can use the application.

---

# 🎯 Why I Built This Project

I built Company Brochure AI as a practical project to move beyond simply learning individual AI/ML concepts.

Instead of only studying:

- Python
- APIs
- Machine Learning
- LLMs
- Prompt Engineering
- Web Scraping

I wanted to understand how these technologies work **together inside a real application**.

The goal was to go from:

```text
"I know the concept"
```

to:

```text
"I can build an application using the concept."
```

---

# 🧠 What I Learned From This Project

This project helped me understand several important concepts that are difficult to fully understand through theory alone.

## 1. How LLM Applications Actually Work

I learned that an LLM application is not simply:

```text
Prompt → Answer
```

A real application involves:

```text
User Input
     ↓
Data Collection
     ↓
Data Cleaning
     ↓
Prompt Construction
     ↓
LLM
     ↓
Response Processing
     ↓
Application Output
```

This changed my understanding of practical LLM engineering.

---

# 2. Prompt Engineering

I learned how to construct prompts that give the model:

- a role
- a clear task
- required output sections
- constraints
- source information

For example, instead of simply asking:

```text
Tell me about this company.
```

the application provides structured instructions such as:

```text
Create a professional company brochure containing:

1. Company Name
2. Company Overview
3. Products and Services
...
```

I also learned why constraints such as:

```text
Do not invent information.
```

are important when building applications that depend on external information.

---

# 3. Understanding APIs

I learned how different components communicate through APIs.

For example:

```text
Frontend
   ↓ API request
FastAPI
   ↓
Groq API
   ↓
LLM response
   ↓
FastAPI
   ↓
Frontend
```

I learned the difference between:

- GET requests
- POST requests
- JSON
- request bodies
- API endpoints
- API responses
- HTTP status codes

---

# 4. Backend Development

Before this project, backend development could feel abstract.

This project helped me understand the responsibility of a backend.

The backend acts as the bridge between:

```text
User Interface
      ↕
Application Logic
      ↕
External Services
```

I learned how FastAPI receives requests, validates data, calls Python functions, handles errors, and returns JSON responses.

---

# 5. Web Scraping

I learned how websites are represented as HTML and how applications can extract useful information from that HTML.

I learned the basic pipeline:

```text
URL
 ↓
HTTP Request
 ↓
HTML
 ↓
BeautifulSoup
 ↓
HTML Elements
 ↓
Clean Text
```

I also learned why raw HTML should not simply be passed directly to an LLM.

Cleaning unnecessary elements reduces noise and makes the information more useful.

---

# 6. Local LLM vs Cloud LLM

One of the most valuable lessons was understanding the difference between local and cloud model execution.

### Local model

```text
My Computer
   ↓
Ollama
   ↓
LLM
```

Advantages:

- Runs locally
- No external API request
- Useful for experimentation

But it is difficult to expose directly as a public application.

### Cloud API

```text
Backend
   ↓
Internet
   ↓
LLM API
```

This is much more suitable for production deployment.

Understanding this distinction helped me think about AI applications from an **engineering and deployment perspective**, not just a model perspective.

---

# 7. Environment Variables and Secrets

I learned why API keys should never be written directly inside source code.

Instead:

```text
.env
 ↓
GROQ_API_KEY
 ↓
Python
```

And:

```text
.env
 ↓
.gitignore
 ↓
NOT uploaded to GitHub
```

This taught me an important real-world software engineering practice:

> **Code can be public; secrets should not be.**

---

# 8. Frontend–Backend Communication

I learned how JavaScript communicates with a Python backend using the Fetch API.

The frontend sends:

```javascript
fetch("/generate", {
    method: "POST",
    ...
})
```

The backend receives the request.

Then:

```text
Frontend
   ↓
JSON
   ↓
FastAPI
   ↓
Python processing
   ↓
JSON response
   ↓
Frontend
```

This helped me understand how frontend and backend applications communicate in real-world web applications.

---

# 9. CORS

I also learned why a browser can block requests when frontend and backend are running on different origins.

For example:

```text
Frontend:
localhost:5500

Backend:
localhost:8000
```

These are different origins.

FastAPI therefore needs CORS configuration to allow the frontend to communicate with it.

This was an important practical lesson because the backend could work perfectly while the frontend still failed to communicate with it.

---

# 10. Debugging Real Applications

One of the biggest lessons was debugging.

I encountered problems involving:

- Python packages
- Ollama connectivity
- function names
- frontend/backend communication
- CORS
- environment variables
- API keys
- local development servers
- deployment configuration

Instead of treating errors as something separate from development, I learned that debugging is an essential part of software engineering.

---

# 11. Deployment Thinking

Initially, my focus was:

> "Can I make the application work on my laptop?"

After this project, I started thinking:

> "Can another person open a URL and use my application without installing anything?"

That led me to understand:

```text
Development
    ↓
GitHub
    ↓
Backend Deployment
    ↓
Frontend Deployment
    ↓
Environment Variables
    ↓
Public Application
```

This is one of the biggest differences between simply building a project and building an application that other people can actually use.

---

# 🚀 What This Project Taught Me About LLM Engineering

This project gave me practical exposure to an end-to-end LLM application pipeline:

```text
                    LLM APPLICATION
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
    Data Layer        LLM Layer       Application Layer
        │                 │                 │
   Web Scraping      Prompting          FastAPI
   HTML Parsing      Model API          Frontend
   Text Cleaning     Constraints        JSON
                                      Deployment
```

I learned that building an LLM application requires much more than knowing how to call a model.

It requires understanding:

- data
- preprocessing
- prompts
- APIs
- application logic
- security
- frontend/backend communication
- error handling
- deployment

---

# 📈 My Learning Journey Through This Project

This project represents a progression from individual concepts to an integrated system.

### Before the project

I was learning concepts individually:

```text
Python
ML
AI
APIs
LLMs
Web Development
```

### During the project

I connected them:

```text
Python
  +
Web Scraping
  +
FastAPI
  +
LLM
  +
Frontend
  +
API Security
  +
Deployment
```

### After the project

I can now understand an application as a complete system:

```text
Problem
   ↓
Data
   ↓
Processing
   ↓
Model
   ↓
Backend
   ↓
Frontend
   ↓
Security
   ↓
Deployment
   ↓
Real Users
```

This is the biggest value I gained from the project.

---

# 🧪 Current Limitations

This project is intentionally a simple first version.

Some websites may not work correctly because they can:

- block automated requests
- require JavaScript rendering
- require authentication
- use anti-bot protection
- provide very little textual content

The current scraper primarily works with publicly accessible HTML content.

---

# 🔮 Future Improvements

There are many ways this project can be extended.

### Better Web Extraction

Add support for:

- multiple website pages
- sitemap crawling
- JavaScript-rendered websites
- smarter content extraction

### Better LLM Output

Generate:

- company logo
- company tagline
- formatted sections
- key statistics
- company timeline
- competitive analysis

### Document Generation

Allow users to download:

```text
PDF
DOCX
Markdown
```

brochures.

### RAG

A future version could use:

```text
Website
 ↓
Chunking
 ↓
Embeddings
 ↓
Vector Database
 ↓
Retrieval
 ↓
LLM
```

This would allow the system to retrieve the most relevant information instead of sending all scraped content directly to the model.

### Multi-Agent Architecture

The application could eventually use different AI agents for:

```text
Research Agent
      ↓
Content Agent
      ↓
Fact Checking Agent
      ↓
Brochure Agent
```

### Authentication

Add user accounts so users can save their generated brochures.

### History

Allow users to view previously generated brochures.

---

# 🛡️ Responsible Usage

The application is intended for publicly accessible company information.

Users should avoid submitting:

- private websites
- login-protected pages
- confidential information
- personal information without permission

The generated brochure should be treated as an AI-assisted summary rather than an authoritative source.

---

# ⚙️ Running the Project Locally

## 1. Clone the repository

```bash
git clone https://github.com/LalithaJanneti/company-brochure-generator.git
```

```bash
cd company-brochure-generator
```

---

## 2. Install backend dependencies

```bash
cd backend
```

```bash
uv sync
```

Or:

```bash
pip install -r requirements.txt
```

---

## 3. Configure the API key

Create:

```text
backend/.env
```

Add:

```env
GROQ_API_KEY=your_groq_api_key
```

---

## 4. Start the backend

```bash
uv run uvicorn main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

Swagger API documentation:

```text
http://127.0.0.1:8000/docs
```

---

## 5. Start the frontend

Open another terminal:

```bash
cd frontend
```

Run:

```bash
uv run python -m http.server 5500
```

Open:

```text
http://127.0.0.1:5500
```

---

# 💡 Example Workflow

Enter:

```text
https://www.example.com
```

Click:

```text
Generate Brochure
```

The application performs:

```text
URL
 ↓
Website Request
 ↓
HTML
 ↓
BeautifulSoup
 ↓
Clean Text
 ↓
Prompt
 ↓
Groq LLM
 ↓
Company Brochure
```

---

# 🎯 Project Goals

The project was built with three major goals:

### 1. Build

Create a working AI-powered application.

### 2. Learn

Understand how web applications, APIs, LLMs, scraping, security, and deployment work together.

### 3. Deploy

Move from a local prototype toward an application that can be accessed by real users through a public URL.

---

# 🌟 Final Takeaway

Company Brochure AI started as a simple idea:

> **"Give an AI a company website and get a brochure."**

But building it taught me something much bigger.

I learned that an AI application is not just a model.

It is a system.

```text
                 REAL AI APPLICATION
                         │
        ┌────────────────┼────────────────┐
        │                │                │
      DATA              AI            SOFTWARE
        │                │                │
     Scraping         Prompting       FastAPI
     Cleaning         LLM API         Frontend
     Processing       Constraints     APIs
                                      Security
                                      Deployment
```

Through this project, I moved from **learning AI/LLM concepts theoretically** to actually integrating them into a complete application.

The most important lesson I gained is:

> **Learning becomes much more meaningful when concepts are connected to a real problem and turned into something people can actually use.**

---

## 👩‍💻 Built By

**Lalitha Janneti**

B.Tech Computer Science & Engineering

Interested in:

- Artificial Intelligence
- Machine Learning
- LLM Engineering
- Generative AI
- Full-Stack Development
- AI-powered Applications

---

## ⭐ If You Find This Project Interesting

Feel free to explore the project, try the application, and experiment with different publicly accessible company websites.

---

**Built with curiosity, experimentation, and a lot of debugging. 🚀**