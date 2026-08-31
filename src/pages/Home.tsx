import { Link } from "react-router-dom";
import { ParallaxLayer } from "../system/ParallaxField";
import StatusLabel from "../system/StatusLabel";
import { projects } from "../data/projects";
import "./Home.css";

export default function Home() {
  return (
    <div className="home">
      <ParallaxLayer depth={0.06} className="home__field home__field--far">
        <span className="home__corner-text home__corner-text--tl">SYSTEM ONLINE</span>
        <span className="home__corner-text home__corner-text--tr">2026</span>
      </ParallaxLayer>

      <div className="home__hero">
        <ParallaxLayer depth={0.14} className="home__wordmark-wrap">
          <h1 className="home__wordmark">KVN</h1>
        </ParallaxLayer>

        <ParallaxLayer depth={0.2}>
          <p className="home__role">
            INDEPENDENT<br />
            CREATIVE<br />
            OPERATOR
          </p>
        </ParallaxLayer>

        <ParallaxLayer depth={0.26} className="home__disciplines">
          <span>DESIGN</span>
          <span className="home__slash">/</span>
          <span>MOTION</span>
          <span className="home__slash">/</span>
          <span>VIDEO</span>
        </ParallaxLayer>

        <Link to="/archive" className="home__cta">
          <span className="home__cta-bracket">[</span>
          ENTER ARCHIVE
          <span className="home__cta-bracket">]</span>
        </Link>
      </div>

      <ParallaxLayer depth={0.08} className="home__field home__field--foot">
        <StatusLabel status="available" label="AVAILABLE FOR CONTRACT" />
        <span className="home__foot-index">
          FILE_INDEX · {String(projects.length).padStart(3, "0")}
        </span>
      </ParallaxLayer>
    </div>
  );
}
