<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white" alt="Socket.io" />
</div>

<br />

<div align="center">
  <img src="public/icon-512x512.png" alt="Norra Logo" width="100" height="100" />
  <h1 align="center">Norra Scores</h1>
  <p align="center">
    <strong>A modern, blazing-fast football (soccer) application.</strong>
    <br />
    Providing real-time live scores, comprehensive match details, dynamic standings, and breaking news.
    <br />
    <br />
    <a href="https://ais-pre-awoili2behgxputzxtr5bf-310667123643.europe-west2.run.app">View Demo</a>
    ·
    <a href="https://github.com/MoaedMoussa/norra-scores/issues">Report Bug</a>
    ·
    <a href="https://github.com/MoaedMoussa/norra-scores/issues">Request Feature</a>
  </p>
</div>

<br />

## 📖 About The Project

I built **Norra Scores** to provide a seamless, real-time football companion for fans around the world. Recognizing that many sports apps are cluttered with ads and slow to update, I focused on creating a clean, ad-free, and lightning-fast Progressive Web App (PWA) that delivers the data that matters most, the moment it happens.

From live match timelines to dynamic league tables, Norra offers an optimized viewing experience tailored for both desktop and mobile environments.

### ✨ Key Features

- ⚡ **Live & Real-Time Updates**: Instant score updates via WebSockets and an internal API proxy, ensuring you never miss a goal.
- 📊 **Comprehensive Match Coverage**: Detailed statistics, starting lineups, head-to-head records, and play-by-play timelines.
- 🏆 **Dynamic Standings & Analytics**: Interactive league tables, form guides, and trend analysis for top global leagues.
- 📰 **Breaking News Feed**: Curated, up-to-date football news tailored to your favorite leagues.
- 📱 **Offline-Ready (PWA)**: Installable on iOS/Android/Desktop with service worker caching for offline access.
- 🌓 **Dark Mode Optimized**: Beautiful, high-contrast UI tailored for both light and dark viewing environments.

---

## 💻 Tech Stack

- **Frontend**: [React 18](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State/Data Fetching**: [SWR](https://swr.vercel.app/) (Stale-While-Revalidate)
- **Backend & Proxy**: [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
- **Realtime**: [Socket.io](https://socket.io/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You need Node.js and npm installed on your local machine.
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. **Clone the repository**
   ```sh
   git clone https://github.com/MoaedMoussa/norra-scores.git
   ```

2. **Navigate to the directory**
   ```sh
   cd norra-scores
   ```

3. **Install NPM dependencies**
   ```sh
   npm install
   ```

4. **Environment Variables**
   Duplicate the `.env.example` file and rename it to `.env`.
   ```sh
   cp .env.example .env
   ```

5. **Start the development server**
   ```sh
   npm run dev
   ```
   *Note: The application uses a custom Node.js Express entry point (`server.ts`) that runs alongside the Vite dev server to handle API proxying and WebSockets.*

---

## ☁️ Deployment

This project is structured for easy deployment on platforms that support full-stack Node.js applications (like Google Cloud Run, Heroku, or Render).

To build the production-ready application (which compiles both the frontend Vite bundle and the backend Express server):

```sh
npm run build
```

You can preview the optimized production build locally with:

```sh
npm run start
```

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <p>Built with ❤️ by <a href="https://github.com/MoaedMoussa">Moussa</a></p>
</div>
