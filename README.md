# Deepstack Scanner

![Deepstack Scanner Banner](https://via.placeholder.com/1200x300.png?text=DEEPSTACK+SCANNER)

Deepstack Scanner (also known as SiteForge Recon API) is an advanced web reconnaissance and analysis tool designed with a sleek, cyberpunk-inspired hacker aesthetic. It allows users to scan websites to uncover their underlying technology stacks, check IP addresses, scan open ports, and perform DNS lookups.

## 🚀 Features

- **Tech Stack Analyzer**: Input a URL to discover the technologies, frameworks, CMS, and servers powering the site (powered by Wappalyzer).
- **IP Checker**: Quickly resolve domain names to their corresponding IP addresses.
- **Port Scanner**: Concurrently scan common ports (e.g., 21, 22, 80, 443, 8080) to identify open services.
- **DNS Lookup**: Retrieve basic DNS records (hostname, aliases, associated IPs) for any given target.
- **User Authentication**: Secure your searches and dashboard with Supabase Auth integration.
- **Dark Neon Interface**: A fully responsive, modern React UI featuring 3D backgrounds, glitch text effects, and smooth Framer Motion animations.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript & Vite
- **Styling**: Tailwind CSS, custom vanilla CSS (neon effects)
- **Animations**: Framer Motion
- **Authentication**: Supabase Auth

### Backend
- **Framework**: FastAPI (Python)
- **Engine**: python-Wappalyzer
- **Concurrency**: `concurrent.futures` for fast port scanning
- **Database**: Supabase PostgreSQL

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- Docker & Docker Compose (optional, for containerized deployment)
- A Supabase account and project (for Auth and Database features)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/deepstack-scanner.git
cd deepstack-scanner
```

### 2. Environment Variables
You will need to configure environment variables for both the frontend and backend.

**Backend (`backend/.env`):**
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_or_service_key
```

**Frontend (`frontend/.env`):**
```env
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Running Locally (Without Docker)

**Start the Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Start the Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### 4. Running with Docker Compose
If you prefer running both services in containers:
```bash
docker-compose up --build
```
The frontend will be available at `http://localhost:5173` and the backend API at `http://localhost:8000`.

## 📂 Project Structure

```
deepstack-scanner/
├── backend/                # Python FastAPI Backend
│   ├── main.py             # API routes and logic
│   ├── Dockerfile          # Backend container configuration
│   └── requirements.txt    # Python dependencies
├── frontend/               # React Vite Frontend
│   ├── src/
│   │   ├── components/     # UI Components (ScannerForm, ToolsDashboard, etc.)
│   │   ├── lib/            # Supabase client setup
│   │   ├── App.tsx         # Main application routing & views
│   │   └── index.css       # Global styles & neon themes
│   ├── Dockerfile          # Frontend container configuration
│   └── package.json        # Node dependencies
└── docker-compose.yml      # Orchestrates frontend & backend containers
```

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/deepstack-scanner/issues).

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
