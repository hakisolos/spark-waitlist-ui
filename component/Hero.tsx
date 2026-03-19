import { ArrowRight } from "@/app/items";

function HeroSection() {
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        width: "100%",
      }}
    >
      {/* Full-width hero image background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('https://files.catbox.moe/ggqvym.png')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
          filter: "blur(6px)",
          transform: "scale(1.05)",
          zIndex: 0,
        }}
      />

      {/* Dark overlay for text legibility */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(6,4,18,0.72) 0%, rgba(6,4,18,0.52) 40%, rgba(6,4,18,0.78) 100%)",
          zIndex: 1,
        }}
      />

      {/* Content */}
      <section
        className="page-section hero-sec"
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          paddingTop: "clamp(80px, 14vw, 160px)",
          paddingBottom: "clamp(80px, 14vw, 160px)",
        }}
      >
        {/* Badge — purple-tinted border + glowing dot */}
        <div
          style={{
            marginBottom: 20,
            background: "rgba(109,77,255,0.12)",
            border: "1px solid rgba(139,101,255,0.35)",
            color: "#c4b0ff",
            letterSpacing: "0.08em",
            fontSize: "0.72rem",
            fontWeight: 600,
            textTransform: "uppercase",
            padding: "6px 14px",
            borderRadius: 999,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#a78bfa",
              boxShadow: "0 0 6px 2px rgba(167,139,250,0.6)",
              display: "inline-block",
            }}
          />
          Early access — now open
        </div>

        <h1
          style={{
            fontFamily: "'Geist', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(2.4rem, 5.5vw, 4rem)",
            lineHeight: 1.06,
            letterSpacing: "-0.04em",
            maxWidth: 720,
            margin: "0 auto 14px",
            color: "#ffffff",
          }}
        >
          Instant databases
          <br />
          for developers
        </h1>

        <p
          style={{
            color: "rgba(196,176,255,0.80)",
            fontSize: ".975rem",
            fontWeight: 400,
            maxWidth: 460,
            margin: "0 auto 40px",
            lineHeight: 1.7,
          }}
        >
          Spin up isolated database instances in seconds. No infrastructure
          overhead. Connect, query, and scale without the ops burden.
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <a
            href="#waitlist"
            className="spark-btn"
            style={{
              textDecoration: "none",
              padding: "11px 26px",
              fontSize: ".9rem",
              fontWeight: 600,
              background: "linear-gradient(135deg, #7c5cfc 0%, #9b6dff 100%)",
              color: "#ffffff",
              border: "1px solid rgba(167,139,250,0.4)",
              borderRadius: 10,
              boxShadow:
                "0 0 24px rgba(124,92,252,0.45), inset 0 1px 0 rgba(255,255,255,0.12)",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              transition: "box-shadow 0.2s, transform 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                "0 0 36px rgba(124,92,252,0.65), inset 0 1px 0 rgba(255,255,255,0.15)";
              (e.currentTarget as HTMLAnchorElement).style.transform =
                "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                "0 0 24px rgba(124,92,252,0.45), inset 0 1px 0 rgba(255,255,255,0.12)";
              (e.currentTarget as HTMLAnchorElement).style.transform =
                "translateY(0)";
            }}
          >
            Request early access <ArrowRight />
          </a>
        </div>
      </section>
    </div>
  );
}

export default HeroSection;