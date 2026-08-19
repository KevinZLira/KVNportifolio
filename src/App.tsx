import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { SystemProvider, useSystem } from "./state/SystemContext";
import { TransitionProvider } from "./state/TransitionContext";
import BootSequence from "./components/Boot/BootSequence";
import CustomCursor from "./components/Cursor/CustomCursor";
import SystemBar from "./components/System/SystemBar";
import NavOverlay from "./components/System/NavOverlay";
import SystemToaster from "./components/System/SystemToaster";
import RandomEvents from "./components/System/RandomEvents";
import ScrollHUD from "./components/System/ScrollHUD";
import Home from "./pages/Home";
import ProjectPage from "./pages/ProjectPage";
import "./App.css";

function AppShell() {
  const { systemState, enterSystem } = useSystem();
  const [navOpen, setNavOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setNavOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (systemState === "BOOT") {
    return <BootSequence onEnter={enterSystem} />;
  }

  return (
    <div className="app-shell">
      <CustomCursor />
      <SystemBar onMenu={() => setNavOpen((v) => !v)} />
      <NavOverlay open={navOpen} onClose={() => setNavOpen(false)} />
      <SystemToaster />
      <RandomEvents />
      {location.pathname === "/" && <ScrollHUD />}

      <main className="app-main" key={location.pathname}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work" element={<Home />} />
          <Route path="/work/:slug" element={<ProjectPage />} />
        </Routes>
      </main>

      <div className="crt-layer crt-scanlines" />
      <div className="crt-layer crt-vignette" />
      <div className="crt-layer crt-grain" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <SystemProvider>
        <TransitionProvider>
          <AppShell />
        </TransitionProvider>
      </SystemProvider>
    </BrowserRouter>
  );
}
