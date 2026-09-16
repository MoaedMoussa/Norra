import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Terms() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-sports-bg flex flex-col font-sans text-sports-text">
      <Helmet>
        <title>Terms of Service | Norra Scores</title>
      </Helmet>
      
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-12">
        <div className="bg-sports-surface border border-sports-border rounded-2xl p-8 md:p-12 shadow-xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-sports-text mb-2">Terms of Service</h1>
            <p className="text-sports-primary font-medium">Effective Date: October 2026</p>
          </div>

          <div className="space-y-8 text-sports-textMuted text-sm leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-sports-text mb-3">1. Inspired by the Beautiful Game</h2>
              <p>
                Welcome to NorraScores. We built this platform for the fans, the dreamers, and the tactical obsessive. 
                Our mission is to bring the heartbeat of global sports directly to your screen, with no friction and no delay. 
                By using NorraScores, you agree to these terms—designed to keep our community fair, fast, and focused on the game.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-sports-text mb-3">2. Data & Accuracy</h2>
              <p>
                We strive for split-second precision, pulling live data from some of the most reliable feeds in the world. 
                However, sports are unpredictable, and digital feeds can sometimes experience milliseconds of delay. 
                NorraScores provides data for informational and entertainment purposes only. We are not responsible for any 
                decisions made based on our live scores, predictive AI models, or standings calculations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-sports-text mb-3">3. The Norra AI Insights</h2>
              <p>
                Our proprietary Norra AI analyzes momentum, historical matchups, and live statistical pressure to generate 
                insights and narratives. These are algorithmic estimations meant to deepen your understanding of the match. 
                They do not constitute professional advice, betting guidance, or guaranteed outcomes. The magic of sports 
                is that anything can happen—our AI just tries to map the possibilities.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-sports-text mb-3">4. Respecting the Community</h2>
              <p>
                NorraScores is for everyone. Whether you're tracking the Champions League final or a third-division 
                relegation scrap, you are part of our global stadium. Do not attempt to scrape, DDoS, or reverse-engineer 
                our live feeds. We keep our platform fast for the fans—let's respect the digital pitch.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-sports-text mb-3">5. Intellectual Property</h2>
              <p>
                Team names, crests, and league logos remain the intellectual property of their respective owners. NorraScores 
                uses them under fair use for the sole purpose of identifying the teams playing. The NorraScores name, design, 
                and codebase are our own.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
