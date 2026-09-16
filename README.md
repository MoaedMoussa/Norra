# Norra Scores

> **Norra Scores** is a modern, blazing-fast football (soccer) application providing real-time live scores, comprehensive match details, dynamic standings, and breaking news.

Built with performance and user experience in mind, Norra offers a seamless interface across all devices and acts as a fully-featured Progressive Web App (PWA).

## 🚀 Features

- **Live & Real-Time Updates**: Instant score updates via WebSockets, ensuring you never miss a goal.
- **Comprehensive Match Coverage**: Detailed statistics, lineups, head-to-head records, and play-by-play timelines.
- **Personalized Experience**: Save your favorite teams and leagues. Your preferences directly influence your feed.
- **Smart Push Notifications**: Custom score alerts for your favorite teams and high-stakes matches.
- **Dynamic Standings & Analytics**: Interactive league tables, form guides, and trend charts.
- **Offline-Ready (PWA)**: Installable on iOS/Android/Desktop with service worker caching for offline access.
- **Dark Mode Optimized**: Beautiful, high-contrast UI tailored for both light and dark viewing environments.

## 🛠 Tech Stack

**Frontend Architecture:**
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router (v6)
- **State/Data Fetching**: SWR (Stale-While-Revalidate) & React Context
- **Animations**: Framer Motion
- **Icons**: Lucide React

**Backend & Infrastructure:**
- **Server**: Node.js + Express
- **Real-time**: Socket.io
- **Database/Auth**: Firebase (Firestore) & Firebase Cloud Messaging (FCM)
- **Deployment**: Google Cloud Run / Docker

## 📂 Project Structure

```text
├── public/                 # Static assets (icons, manifest, etc.)
├── scripts/                # Build and deployment scripts (e.g., sitemap generation)
├── server.ts               # Express backend & WebSocket server entry point
└── src/
    ├── api/                # API client and request handlers
    ├── components/         # Reusable UI components (HeroMatch, StandingsView, etc.)
    ├── context/            # React Context providers (Auth, Theme)
    ├── data/               # Static datasets and mocks (Leagues configuration)
    ├── hooks/              # Custom React hooks (useLiveMatches, useNews, etc.)
    ├── pages/              # Route level components (Landing, MatchDetail, etc.)
    └── utils/              # Helper functions and formatters
```

## 💻 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/norra-scores.git
   cd norra-scores
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Copy the example environment file and fill in your Firebase / API keys:
   ```bash
   cp .env.example .env
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   The application will start concurrently (Vite dev server + Express backend) at `http://localhost:3000`.

### Building for Production

To build the application for production deployment:
```bash
npm run build
```
This generates the optimized static files in the `/dist` folder, compiles the server bundle, and automatically generates the `sitemap.xml`.

You can preview the production build using:
```bash
npm run start
```

## 🤝 Contributing

Contributions are always welcome! Whether it's reporting a bug, suggesting a feature, or submitting a pull request, your input helps make Norra better.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
