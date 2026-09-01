import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { SystemProvider, useSystem } from "./state/SystemContext";
import { TransitionProvider } from "./state/TransitionContext";
import BootSequence from "./components/Boot/BootSequence";
import CustomCursor from "./components/Cursor/CustomCursor";
import SystemBar from "./components/System/SystemBar";
import BackgroundMusic from "./components/System/BackgroundMusic";
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
  const booting = systemState === "BOOT";

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setNavOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* Mounted at all times, even during BOOT — so the real page (assets,
          fonts, the Hero's background video, GSAP/ScrollTrigger setup) is
          already loaded and running by the time the user enters, instead of
          cold-starting the moment BootSequence exits. `inert` keeps it
          non-interactive and hidden from assistive tech while booting;
          BootSequence's own opaque full-screen layer keeps it hidden
          visually. Hero-mode entrance animations gate on systemState
          themselves so they still play fresh on entry rather than firing
          while hidden. */}
      <div className="app-shell" inert={booting}>
        <CustomCursor />
        <BackgroundMusic />
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

      {booting && <BootSequence onEnter={enterSystem} />}
    </>
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
