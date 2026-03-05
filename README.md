<div align="center">

<img src="https://img.shields.io/badge/AI%20CLUB-OIST-blueviolet?style=for-the-badge&logo=openai&logoColor=white" alt="AI Club OIST" />

# AI Club OIST - Official Website

### *Where Artificial Intelligence Meets Curiosity*

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-aiclub--oist.vercel.app-22c55e?style=for-the-badge)](https://aiclub-oist.vercel.app)
[![GitHub Repo](https://img.shields.io/badge/GitHub-madhavansingh%2Faiclub--oist-181717?style=for-the-badge&logo=github)](https://github.com/madhavansingh/aiclub-oist)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Vite](https://img.shields.io/badge/Built%20with-Vite-646cff?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![JavaScript](https://img.shields.io/badge/JavaScript-52.7%25-f7df1e?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS](https://img.shields.io/badge/CSS-33.8%25-1572b6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)

---

> **"Building the next generation of AI thinkers, one project at a time."**
>
> The official website for the **AI Club at OIST (Oriental Institute of Science and Technology)** — a student-led community dedicated to exploring, learning, and innovating in the field of Artificial Intelligence and Machine Learning.

</div>

---

## 📋 Table of Contents

- [✨ Overview](#-overview)
- [🔥 Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [⚡ Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running Locally](#running-locally)
  - [Building for Production](#building-for-production)
- [🚀 Deployment](#-deployment)
- [🧑‍💻 Contributing](#-contributing)
- [👥 Team](#-team)
- [📄 License](#-license)
- [📬 Contact](#-contact)

---

## ✨ Overview

The **AI Club OIST Website** is the central digital hub for the college's AI Club — a platform designed to showcase club activities, introduce team members, highlight events, and inspire students to dive deep into the world of Artificial Intelligence.

This project is a modern, fast, and responsive **Single Page Application (SPA)** built using **Vite + JavaScript**, deployed continuously via **Vercel** with every push to the `main` branch.

Whether you're a curious freshman just getting started with Python or a senior researcher working on neural networks — this website is your gateway into the AI Club community at OIST.

---

## 🔥 Features

- ⚡ **Blazing Fast** — Powered by Vite for near-instant hot module reloading and optimized production builds
- 📱 **Fully Responsive** — Seamlessly adapts to all screen sizes: mobile, tablet, and desktop
- 🧑‍🤝‍🧑 **Team Showcase** — Meet the members of the AI Club with photos, roles, and bios
- 📅 **Events Section** — Stay up to date with workshops, hackathons, and seminars organized by the club
- 🎨 **Modern UI/UX** — Clean, minimal, and visually appealing interface built with custom CSS
- 🌐 **Live Deployment** — Auto-deployed to Vercel on every commit pushed to the `main` branch
- 🔗 **SEO-Friendly** — Proper meta tags and semantic HTML for optimal discoverability
- 🧩 **Modular Codebase** — Well-organized source structure under `src/` for easy maintenance and feature additions

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | Vanilla JavaScript (ES6+) | Core application logic |
| **Build Tool** | [Vite](https://vitejs.dev/) | Development server & production bundler |
| **Styling** | Custom CSS3 | Responsive layouts & animations |
| **Markup** | HTML5 | Semantic structure |
| **Templating** | XSLT | XML/data transformations |
| **Package Manager** | npm | Dependency management |
| **Deployment** | [Vercel](https://vercel.com) | Hosting & CI/CD |
| **Version Control** | Git + GitHub | Source control |

### Language Breakdown

```
JavaScript  ████████████████████░░░░░░░░░░  52.7%
CSS         █████████████░░░░░░░░░░░░░░░░░  33.8%
XSLT        ███░░░░░░░░░░░░░░░░░░░░░░░░░░░   7.0%
HTML        ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░   6.5%
```

---

## 📁 Project Structure

```
aiclub-oist/
│
├── 📂 src/                        # Main source code
│   ├── 📂 assets/                 # Static assets (images, fonts, icons)
│   ├── 📂 components/             # Reusable UI components
│   ├── 📂 styles/                 # CSS stylesheets
│   └── 📄 main.js                 # Application entry point
│
├── 📂 public/                     # Public static files (served as-is)
│   └── 🖼️  (team member images & icons)
│
├── 📂 dist/                       # Production build output (auto-generated)
│
├── 📂 skizophonic-nuxt/           # Legacy/experimental Nuxt variant
│
├── 📂 node_modules/               # npm dependencies (not tracked in git)
│
├── 📄 index.html                  # Root HTML entry point
├── 📄 vite.config.js              # Vite configuration
├── 📄 vercel.json                 # Vercel deployment configuration
├── 📄 package.json                # Project metadata & npm scripts
├── 📄 package-lock.json           # Locked dependency tree
└── 📄 README.md                   # You are here 📍
```

---

## ⚡ Getting Started

Follow these steps to get a local copy of the project up and running on your machine.

### Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** `>= 16.x` — [Download here](https://nodejs.org/)
- **npm** `>= 7.x` — Comes bundled with Node.js
- **Git** — [Download here](https://git-scm.com/)

Verify your installations:

```bash
node --version    # Should output v16.x.x or higher
npm --version     # Should output 7.x.x or higher
git --version     # Should output git version x.x.x
```

---

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/madhavansingh/aiclub-oist.git
```

**2. Navigate into the project directory**

```bash
cd aiclub-oist
```

**3. Install all dependencies**

```bash
npm install
```

> This will install all packages listed in `package.json` including Vite and any other project dependencies.

---

### Running Locally

Start the Vite development server with hot module replacement (HMR):

```bash
npm run dev
```

You should see output similar to:

```
  VITE v4.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open your browser and visit **[http://localhost:5173](http://localhost:5173)** to view the website locally.

> 💡 **Tip:** Any changes you make to the source files will instantly reflect in the browser thanks to Vite's HMR — no manual refresh needed.

---

### Building for Production

To generate an optimized, minified production build:

```bash
npm run build
```

The output will be placed in the `dist/` directory. You can preview the production build locally with:

```bash
npm run preview
```

This spins up a local static server serving the `dist/` folder, mimicking exactly what Vercel deploys in production.

---

## 🚀 Deployment

This project is deployed automatically on **[Vercel](https://vercel.com)** via GitHub integration.

### How it Works

Every time a commit is pushed to the `main` branch:

1. **Vercel detects the push** via GitHub webhook
2. **Vercel runs the build command** (`npm run build`)
3. **The `dist/` output is served** on the CDN globally
4. **The live site is updated** at [https://aiclub-oist.vercel.app](https://aiclub-oist.vercel.app) within seconds

### Deployment Configuration

The `vercel.json` file at the root of the project defines deployment settings such as routing rules and build overrides. Vite-specific configurations are handled in `vite.config.js`.

### Manual Deploy (Vercel CLI)

If you'd like to deploy a preview manually:

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy a preview
vercel

# Deploy to production
vercel --prod
```

---

## 🧑‍💻 Contributing

Contributions are welcome from all AI Club members and open-source enthusiasts! Here's how to get involved:

### Step-by-Step Guide

**1. Fork the repository**

Click the **Fork** button at the top-right of the [GitHub repo page](https://github.com/madhavansingh/aiclub-oist).

**2. Create a new branch**

```bash
git checkout -b feature/your-feature-name
```

Use a descriptive branch name like `feature/add-events-section` or `fix/mobile-nav-bug`.

**3. Make your changes**

Edit the source code, add features, fix bugs, or update content. Keep your commits focused and atomic.

**4. Commit your changes**

```bash
git add .
git commit -m "feat: add events section with upcoming workshops"
```

> Follow [Conventional Commits](https://www.conventionalcommits.org/) for clean commit messages:
> - `feat:` — new feature
> - `fix:` — bug fix
> - `docs:` — documentation update
> - `style:` — formatting, no logic change
> - `refactor:` — code restructuring
> - `chore:` — maintenance tasks

**5. Push to your fork**

```bash
git push origin feature/your-feature-name
```

**6. Open a Pull Request**

Go to the original repo and open a Pull Request from your fork's branch. Add a clear description of what your PR does and why.

### Code Standards

- Write clean, readable, and well-commented JavaScript
- Keep CSS organized by component/section
- Test on both mobile and desktop before submitting
- Do not commit `node_modules/` or `dist/` directories

---

## 👥 Team

This website was built and is maintained by the members of **AI Club OIST**.

| Role | Contributor |
|---|---|
| **Lead Developer & Maintainer** | [@madhavansingh](https://github.com/madhavansingh) — Madhavan Singh Parihar |

> Want to see your name here? [Contribute](#-contributing) to the project!

---

## 📄 License

This project is currently **private** and maintained by the AI Club at OIST. All rights reserved by the respective contributors.

If you'd like to use parts of this codebase for your own college club website, please reach out to the maintainer for permission.

---

## 📬 Contact

Have questions, suggestions, or want to join the AI Club?

- 🌐 **Website:** [https://aiclub-oist.vercel.app](https://aiclub-oist.vercel.app)
- 💻 **GitHub:** [https://github.com/madhavansingh/aiclub-oist](https://github.com/madhavansingh/aiclub-oist)
- 🏫 **Institution:** Oriental Institute of Science and Technology (OIST)

---

<div align="center">


*Empowering students to build the future with Artificial Intelligence.*


</div>
