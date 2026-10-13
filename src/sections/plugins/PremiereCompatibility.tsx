
export default function PremiereCompatibility({ note = "Compatível com as últimas versões. Guia de instalação para Mac e Windows incluído." }: { note?: string }) {
  return <div className="lp-container plugin-video-compat"><div className="lp-compat"><span>Pr</span><p>FEITO PARA ADOBE PREMIERE PRO<small>{note}</small></p></div></div>;
}
