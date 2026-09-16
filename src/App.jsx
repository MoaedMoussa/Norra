import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { ToastContainer } from './hooks/use-toast';
import DynamicSEO from './components/DynamicSEO';
import WelcomeModal from './components/WelcomeModal';
import NotificationManager from './components/NotificationManager';
import InstallPWA from './components/InstallPWA';
import AdBanner from './components/AdBanner';
import Footer from './components/Footer';

// Layout & Pages
import DashboardLayout from './components/DashboardLayout';
const Landing = React.lazy(() => import('./pages/Landing'));
const MatchDetail = React.lazy(() => import('./pages/MatchDetail'));
const Preferences = React.lazy(() => import('./pages/Preferences'));
const Terms = React.lazy(() => import('./pages/Terms'));
const OtherSports = React.lazy(() => import('./pages/OtherSports'));
const Search = React.lazy(() => import('./pages/Search'));
const TeamDetail = React.lazy(() => import('./pages/TeamDetail'));
const PlayerDetail = React.lazy(() => import('./pages/PlayerDetail'));
const KnowledgeBase = React.lazy(() => import('./pages/KnowledgeBase'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

// Skeleton fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="w-8 h-8 border-4 border-sports-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <ThemeProvider>
      <HelmetProvider>
        <CartProvider>
          <BrowserRouter>
            <NotificationManager />
            <InstallPWA />
            <DynamicSEO />
            <ScrollToTop />
            <WelcomeModal />
            <React.Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Responsive Grid Layout Foundation */}
                <Route element={<DashboardLayout />}>
                  <Route path="/" element={<Landing />} />
                  <Route path="/match/:id" element={<MatchDetail />} />
                  <Route path="/preferences" element={<Preferences />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/team/:id" element={<TeamDetail />} />
                  <Route path="/player/:id" element={<PlayerDetail />} />
                  <Route path="/knowledge-base" element={<KnowledgeBase />} />
                  <Route path="/sport/:sport" element={<OtherSports />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
                <Route path="/terms" element={<Terms />} />
              </Routes>
            </React.Suspense>
            <AdBanner />
            <Footer />
            <ToastContainer />
          </BrowserRouter>
        </CartProvider>
      </HelmetProvider>
    </ThemeProvider>
  );
}
