import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ParallaxProvider } from "./system/ParallaxField";
import Nav from "./system/Nav";
import Cursor from "./system/Cursor";
import PageTransition from "./system/PageTransition";
import Home from "./pages/Home";
import Archive from "./pages/Archive";
import ArchiveFile from "./pages/ArchiveFile";
import Operations from "./pages/Operations";
import Contract from "./pages/Contract";
import Plugins from "./pages/Plugins";

function Shell() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="kvn-shell">
      <div className="kvn-atmosphere" />
      <span className="kvn-hud-mark tl" />
      <span className="kvn-hud-mark tr" />
      <span className="kvn-hud-mark bl" />
      <span className="kvn-hud-mark br" />

      <Cursor />
      <Nav />
      <PageTransition />

      <main key={location.pathname}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/archive/:slug" element={<ArchiveFile />} />
          <Route path="/operations" element={<Operations />} />
          <Route path="/contract" element={<Contract />} />
          <Route path="/plugins" element={<Plugins />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ParallaxProvider>
        <Shell />
      </ParallaxProvider>
    </BrowserRouter>
  );
}
