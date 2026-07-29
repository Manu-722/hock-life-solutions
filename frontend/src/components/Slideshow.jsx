import { useEffect, useState } from "react";

export default function Slideshow({ slides }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(() => setActive((a) => (a + 1) % slides.length), 4500);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (!slides.length) return null;

  return (
    <div className="slideshow">
      {slides.map((slide, i) => (
        <div key={slide.id} className={`slide ${i === active ? "active" : ""}`}>
          <img src={slide.image} alt={slide.title} />
          <div className="caption">
            <h2>{slide.title}</h2>
            {slide.subtitle && <p>{slide.subtitle}</p>}
          </div>
        </div>
      ))}
      <div className="dots">
        {slides.map((_, i) => (
          <span key={i} className={`dot ${i === active ? "active" : ""}`} onClick={() => setActive(i)} />
        ))}
      </div>
    </div>
  );
}
