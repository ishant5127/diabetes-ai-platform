import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { BackgroundEffects } from "./components/layout/BackgroundEffects";
import { Footer } from "./components/layout/Footer";
import { Navbar } from "./components/layout/Navbar";
import { Analytics } from "./pages/Analytics";
import { Assessment } from "./pages/Assessment";
import { Dashboard } from "./pages/Dashboard";
import { History } from "./pages/History";

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col relative text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
        {/* Animated background ambient lights & cybernetic grid */}
        <BackgroundEffects />

        {/* Top Glass Navigation Bar */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/history" element={<History />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </main>

        {/* Bottom Educational Footer */}
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
