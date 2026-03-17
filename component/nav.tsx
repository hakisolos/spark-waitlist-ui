function Nav() {
  return (
    <nav className="spark-nav">
      <div style={{ display:"flex",alignItems:"center",gap:8 }}>
        <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="7" fill="rgba(99,102,241,.12)"/>
          <path d="M18 4L8 18H15L14 28L24 14H17L18 4Z" fill="#6366F1"/>
        </svg>
        <span style={{ fontFamily:"'Geist',sans-serif",fontWeight:700,fontSize:"1.05rem",letterSpacing:"-0.03em" }}>SparkDB</span>
      </div>
      <div className="nav-links" style={{ display:"flex",gap:26 }}>
        {["Powered by nikka tech"].map(l => (
          <a key={l} href="" style={{ color:"#64748B",fontSize:".85rem",fontWeight:500,textDecoration:"none",transition:"color .15s" }}
            onMouseEnter={e => (e.currentTarget.style.color="#E2E8F0")}
            onMouseLeave={e => (e.currentTarget.style.color="#64748B")}>{l}</a>
        ))}
      </div>
      <a href="#waitlist" className="spark-btn" style={{ textDecoration:"none",padding:"7px 16px",fontSize:".82rem" }}>
        Join waitlist
      </a>
    </nav>
  );
}

export default Nav