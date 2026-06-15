import { useState, useEffect, useCallback } from "react";

// ╔═══════════════════════════════════════════════════════════════╗
// ║           TRACKA MASTER — MULTI-TENANT SYSTEM                ║
// ║   One app · One Supabase · Every client has private link     ║
// ║                                                               ║
// ║  HOW CLIENT LINKS WORK:                                       ║
// ║  Your app URL + ?client=five_star  → Five Star Restaurant    ║
// ║  Your app URL + ?client=hugeman    → Hugeman Come Ventures   ║
// ║  Your app URL + ?client=new_client → Any new client          ║
// ║                                                               ║
// ║  Each client sees ONLY their own login and data              ║
// ╚═══════════════════════════════════════════════════════════════╝

// ─────────────────────────────────────────────────────────────────
//  STEP 1: PASTE YOUR ONE SUPABASE PROJECT URL AND KEY HERE
// ─────────────────────────────────────────────────────────────────
const SB_URL = "https://saxtkbtmszkqstdoamvv.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNheHRrYnRtc3prcXN0ZG9hbXZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwNDU0MzAsImV4cCI6MjA5NjYyMTQzMH0.uXpzhMg_QJR1Ewj5OfFlAwStDrP0gvolCqBrDE1mIqE";

// ─────────────────────────────────────────────────────────────────
//  STEP 2: ADD CLIENTS HERE — one block per client
//  To add a new client: copy one block, change the details, done.
// ─────────────────────────────────────────────────────────────────
const CLIENTS = {

  // ── CLIENT 1: FIVE STAR RESTAURANT ─────────────────────────────
  five_star: {
    id:       "five_star",
    name:     "Five Star & Food Restaurant",
    address:  "Multi-Branch Fast Food · Anambra & Imo States",
    state:    "Anambra State",
    owner:    "Dcn Chinedu Akuesodu",
    phone:    "08033422500",
    logo:     "FS",
    branches: ["Okpanam","Market Square","Koka","Stock Exchange","Owerri Rd","Limca Rd Nkpor","Main Market","Awka","Enugu","Marian","Babangida"],
    expCats:  ["Rent","Utilities","Staff Salary","Gas & Fuel","Raw Materials","Packaging","Logistics","Maintenance","Generator","Miscellaneous"],
    theme: {
      primary: "#c9320a",
      dark:    "#7f1d1d",
      light:   "#fff7f5",
      mid:     "#ffe4e0",
      border:  "#fecaca",
      login:   "linear-gradient(135deg,#7f1d1d,#c9320a,#f59e0b)",
      logo:    "linear-gradient(135deg,#c9320a,#f59e0b)",
    },
  },

  // ── CLIENT 2: HUGEMAN COME VENTURES ─────────────────────────────
  hugeman: {
    id:       "hugeman",
    name:     "Hugeman Come Ventures Ltd",
    address:  "A5/98 God's Line, Marine Modern Market, Onitsha",
    state:    "Anambra State",
    owner:    "Dcn Chidiebere Eze",
    phone:    "08037907167",
    logo:     "HC",
    branches: ["Marine Market HQ", "Showroom 1", "Showroom 2"],
    expCats:  ["Rent","Utilities","Staff Salary","Logistics","Fabric Purchase","Tailoring","Transport","Miscellaneous"],
    theme: {
      primary: "#7c3aed",
      dark:    "#4c1d95",
      light:   "#faf5ff",
      mid:     "#ede9fe",
      border:  "#ddd6fe",
      login:   "linear-gradient(135deg,#4c1d95,#7c3aed,#a78bfa)",
      logo:    "linear-gradient(135deg,#7c3aed,#a78bfa)",
    },
  },

  // ── CLIENT 3: TRUST DIVINE ─────────────────────────────────────
  trust_divine: {
    id:       "trust_divine",
    name:     "Trust Divine Nig Ltd",
    address:  "C67 Tobacco Line 5, Main Market, Onitsha",
    state:    "Anambra State",
    owner:    "Dcn Paul Orji",
    phone:    "08033081409",
    logo:     "TD",
    branches: ["Christ Church Warehouse","Fegge Warehouse","Main Market"],
    expCats:  ["Rent","Utilities","Staff Salary","Logistics","Stock Purchase","Transport","Miscellaneous"],
    theme: {
      primary: "#16a34a",
      dark:    "#14532d",
      light:   "#f0fdf4",
      mid:     "#dcfce7",
      border:  "#bbf7d0",
      login:   "linear-gradient(135deg,#14532d,#16a34a,#4ade80)",
      logo:    "linear-gradient(135deg,#16a34a,#4ade80)",
    },
  },

  // ── CLIENT 4: CWIN AGRO ─────────────────────────────────────────
  cwin_agro: {
    id:       "cwin_agro",
    name:     "Cwin Agro Ventures",
    address:  "75 Limca Road, Obosi, Onitsha",
    state:    "Anambra State",
    owner:    "Godwin Chukwuma",
    phone:    "08060598873",
    logo:     "CA",
    branches: ["Obosi Main","Onitsha","Nnewi"],
    expCats:  ["Rent","Utilities","Staff Salary","Feed Purchase","Veterinary","Logistics","Transport","Miscellaneous"],
    theme: {
      primary: "#0369a1",
      dark:    "#0c4a6e",
      light:   "#f0f9ff",
      mid:     "#e0f2fe",
      border:  "#bae6fd",
      login:   "linear-gradient(135deg,#0c4a6e,#0369a1,#38bdf8)",
      logo:    "linear-gradient(135deg,#0369a1,#38bdf8)",
    },
  },

  // ── CLIENT 5: MR DON CLOTHING ───────────────────────────────────
  mr_don: {
    id:       "mr_don",
    name:     "Mr Don Clothing",
    address:  "Shop GEJ #53/55 Winners, Young Shall Grow Plaza, Main Market, Onitsha",
    state:    "Anambra State",
    owner:    "Mr Don Nwoye",
    phone:    "08060488518",
    logo:     "MD",
    branches: ["Head Office - GEJ","Branch - GFJ Lagos Line"],
    expCats:  ["Rent","Utilities","Staff Salary","Stock Purchase","Logistics","Transport","Packaging","Miscellaneous"],
    theme: {
      primary: "#b45309",
      dark:    "#78350f",
      light:   "#fffbeb",
      mid:     "#fef3c7",
      border:  "#fde68a",
      login:   "linear-gradient(135deg,#78350f,#b45309,#fbbf24)",
      logo:    "linear-gradient(135deg,#b45309,#fbbf24)",
    },
  },

  // ── ADD NEW CLIENT HERE ──────────────────────────────────────────
  // Copy one block above, change the details, save and redeploy.

};

// ─────────────────────────────────────────────────────────────────
//  PERMISSIONS — do not change this
// ─────────────────────────────────────────────────────────────────
const PERM = {
  owner:   { seeAll:true,  fin:true,  del:true,  exp:true,  stk:true,  usr:true  },
  manager: { seeAll:false, fin:false, del:false, exp:true,  stk:true,  usr:false },
  staff:   { seeAll:false, fin:false, del:false, exp:false, stk:false, usr:false },
};

// ─────────────────────────────────────────────────────────────────
//  SUPABASE — do not change this
// ─────────────────────────────────────────────────────────────────
async function dbCall(path, opts = {}) {
  const { headers: xh = {}, ...rest } = opts;
  try {
    const r = await fetch(`${SB_URL}/rest/v1/${path}`, {
      ...rest,
      headers: {
        apikey:          SB_KEY,
        Authorization:  `Bearer ${SB_KEY}`,
        "Content-Type": "application/json",
        Prefer:         "return=representation",
        ...xh,
      },
    });
    if (r.status === 204) return { data: [], error: null };
    const j = await r.json();
    return r.ok ? { data: j, error: null } : { data: null, error: j };
  } catch (e) {
    return { data: null, error: { message: e.message } };
  }
}

const db = {
  get:    (table, cid, q = "") => dbCall(`${table}?client_id=eq.${cid}${q ? "&"+q : ""}`),
  post:   (table, body)        => dbCall(table, { method: "POST",   body: JSON.stringify(body) }),
  patch:  (table, id, body)    => dbCall(`${table}?id=eq.${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  remove: (table, id)          => dbCall(`${table}?id=eq.${id}`, { method: "DELETE" }),
};

const fmt   = n  => "₦" + Number(n || 0).toLocaleString("en-NG");
const genId = () => Date.now() + "_" + Math.random().toString(36).slice(2, 6);
const tod   = () => new Date().toISOString().split("T")[0];

// ─────────────────────────────────────────────────────────────────
//  ICONS
// ─────────────────────────────────────────────────────────────────
const IC = {
  dashboard: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z",
  sales:     "M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96C5 16.1 6.1 17 7 17h11v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63H17c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0021.46 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z",
  expense:   "M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",
  stock:     "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z",
  credit:    "M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z",
  branch:    "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
  users:     "M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z",
  add:       "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z",
  close:     "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",
  alert:     "M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z",
  profit:    "M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z",
  check:     "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z",
  logout:    "M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z",
  delete:    "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z",
  pin:       "M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z",
  switch:    "M9 3L5 6.99h3V14h2V6.99h3L9 3zm7 14.01V10h-2v7.01h-3L15 21l4-3.99h-3z",
  refresh:   "M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z",
  disable:   "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15H9V8h2v9zm4 0h-2V8h2v9z",
  enable:    "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z",
  report:    "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z",
  receipt:   "M18 17H6v-2h12v2zm0-4H6v-2h12v2zm0-4H6V7h12v2zM3 22l1.5-1.5L6 22l1.5-1.5L9 22l1.5-1.5L12 22l1.5-1.5L15 22l1.5-1.5L18 22l1.5-1.5L21 22V2l-1.5 1.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2 7.5 3.5 6 2 4.5 3.5 3 2v20z",
  wa:        "M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.38 1.26 4.81L2.05 22l5.38-1.41c1.37.75 2.93 1.17 4.61 1.17 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.22 8.22 0 012.41 5.83c0 4.54-3.7 8.23-8.24 8.23-1.48 0-2.93-.39-4.19-1.15l-.3-.17-3.12.82.83-3.04-.2-.32a8.188 8.188 0 01-1.26-4.38c.01-4.54 3.7-8.24 8.25-8.24M8.53 7.33c-.16 0-.43.06-.66.31-.22.25-.87.86-.87 2.07 0 1.22.89 2.39 1 2.56.14.17 1.76 2.67 4.25 3.73.59.27 1.05.42 1.41.53.59.19 1.13.16 1.56.1.48-.07 1.46-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.16-.48-.27-.25-.14-1.47-.74-1.69-.82-.23-.08-.37-.12-.56.12-.16.25-.64.81-.78.97-.15.17-.29.19-.53.07-.26-.13-1.06-.39-2.02-1.25-.74-.66-1.23-1.49-1.38-1.74-.14-.25-.01-.39.11-.51.11-.11.27-.29.37-.44.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.11-.56-1.35-.77-1.84-.2-.48-.4-.42-.56-.43-.14 0-.3-.01-.47-.01z",
};

function Ic({ name, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d={IC[name] || ""} />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────
//  ROOT — reads ?client= from URL and loads that client directly
// ─────────────────────────────────────────────────────────────────
export default function App() {
  // localStorage keeps client identity when opened from home screen
  const p = new URLSearchParams(window.location.search);
  const fromUrl = p.get("client");
  if (fromUrl && CLIENTS[fromUrl]) {
    localStorage.setItem("tracka_client", fromUrl);
    window.history.replaceState({}, "", window.location.pathname);
  }
  const clientKey = fromUrl || localStorage.getItem("tracka_client");
  const client = CLIENTS[clientKey];

  const [user, setUser] = useState(null);

  // Unknown or missing client key → show error page
  if (!client) {
    return (
      <div style={{ minHeight:"100vh", background:"#0f172a", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"sans-serif" }}>
        <div style={{ textAlign:"center", color:"#fff" }}>
          <div style={{ fontSize:48, marginBottom:16 }}>🔒</div>
          <div style={{ fontSize:22, fontWeight:800, marginBottom:8 }}>Invalid Access Link</div>
          <div style={{ fontSize:14, color:"#64748b" }}>Contact your business administrator for the correct link.</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen client={client} onLogin={setUser} />;
  }

  return <MainApp client={client} user={user} onLogout={() => setUser(null)} />;
}

// ─────────────────────────────────────────────────────────────────
//  LOGIN SCREEN
// ─────────────────────────────────────────────────────────────────
function LoginScreen({ client, onLogin }) {
  const T = client.theme;
  const [users,   setUsers]   = useState([]);
  const [email,   setEmail]   = useState("");
  const [pin,     setPin]     = useState("");
  const [err,     setErr]     = useState("");
  const [loading, setLoading] = useState(true);
  const [dbOk,    setDbOk]    = useState(null);
  const [dbErr,   setDbErr]   = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await db.get("users", client.id, "order=name.asc");
        if (res.error) {
          setDbOk(false);
          setDbErr(res.error.message || JSON.stringify(res.error));
          setLoading(false);
          return;
        }
        setDbOk(true);
        const rows = Array.isArray(res.data) ? res.data : [];
        if (rows.length === 0) {
          // Seed default owner if no users exist
          const owner = {
            id: genId(), client_id: client.id, name: client.owner,
            role: "owner", branch: null, pin: "0000",
            email: client.id + "@tracka.ng", active: true,
          };
          await db.post("users", owner);
          setUsers([owner]);
        } else {
          setUsers(rows);
        }
      } catch (e) {
        setDbOk(false);
        setDbErr(e.message);
      }
      setLoading(false);
    })();
  }, [client.id]);

  const go = () => {
    const u = users.find(x =>
      x.email.toLowerCase() === email.toLowerCase().trim() && x.pin === pin.trim()
    );
    if (!u)        { setErr("Email or PIN incorrect."); return; }
    if (!u.active) { setErr("Account disabled. Contact owner."); return; }
    onLogin(u);
  };

  const inp = { width:"100%", background:T.light, border:`1px solid ${T.border}`, borderRadius:7, padding:"10px 12px", color:T.dark, fontSize:14, outline:"none", boxSizing:"border-box" };
  const lbl = { display:"block", fontSize:11, fontWeight:700, color:T.primary, marginBottom:5, textTransform:"uppercase", letterSpacing:.5 };

  return (
    <div style={{ minHeight:"100vh", background:T.login, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans','Segoe UI',sans-serif", padding:20 }}>
      <div style={{ background:"#fff", border:`1px solid ${T.border}`, borderRadius:20, padding:"40px 36px", width:"100%", maxWidth:400 }}>

        {/* Logo */}
        <div style={{ width:56, height:56, borderRadius:16, background:T.logo, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, fontWeight:900, color:"#fff", margin:"0 auto 14px" }}>
          {client.logo}
        </div>

        {/* Business name */}
        <div style={{ textAlign:"center", fontWeight:900, fontSize:13, color:T.primary, marginBottom:2 }}>TRACKA</div>
        <div style={{ textAlign:"center", fontWeight:800, fontSize:18, color:T.dark, marginBottom:4 }}>{client.name}</div>
        <div style={{ textAlign:"center", fontSize:12, color:"#64748b", marginBottom:4 }}>{client.address}</div>
        <div style={{ textAlign:"center", fontSize:12, color:"#64748b", marginBottom:20 }}>{client.state}</div>

        <div style={{ height:1, background:T.border, marginBottom:20 }} />

        {/* DB Error */}
        {dbOk === false && (
          <div style={{ background:"#fef2f2", border:"1px solid #fca5a5", borderRadius:8, padding:14, marginBottom:16, color:"#dc2626", fontSize:13 }}>
            <strong>⚠ Cannot connect to database</strong>
            {dbErr && <div style={{ fontSize:11, marginTop:4, opacity:.8, wordBreak:"break-all" }}>{dbErr}</div>}
          </div>
        )}

        {/* Form */}
        <label style={lbl}>Email Address</label>
        <input style={{ ...inp, marginBottom:14 }} placeholder="your@email.ng" value={email}
          onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && go()} />

        <label style={lbl}>PIN</label>
        <input style={inp} type="password" maxLength={8} placeholder="Enter your PIN"
          value={pin} onChange={e => setPin(e.target.value)} onKeyDown={e => e.key === "Enter" && go()} />

        {err && <div style={{ color:"#dc2626", fontSize:13, marginTop:8 }}>{err}</div>}

        <button style={{ width:"100%", background:T.logo, border:"none", borderRadius:10, color:"#fff", padding:"13px", fontWeight:800, fontSize:15, cursor:"pointer", marginTop:16 }}
          onClick={go} disabled={loading}>
          {loading ? "Connecting…" : "Enter Dashboard →"}
        </button>

        <div style={{ fontSize:11, color:T.primary, marginTop:14, textAlign:"center" }}>
          {client.owner} · Change default PIN after first login
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
//  MAIN APP
// ─────────────────────────────────────────────────────────────────
function MainApp({ client, user, onLogout }) {
  const T   = client.theme;
  const CID = client.id;

  const [tab,      setTab]      = useState("dashboard");
  const [ab,       setAb]       = useState(null);
  const [dbOk,     setDbOk]     = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [toast,    setToast]    = useState(null);
  const [confirm,  setConfirm]  = useState(null);

  const [users,    setUsers]    = useState([]);
  const [products, setProducts] = useState([]);
  const [stock,    setStock]    = useState([]);
  const [sales,    setSales]    = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [credits,  setCredits]  = useState([]);
  const [expCats,  setExpCats]  = useState(client.expCats || ["Rent","Utilities","Salary","Miscellaneous"]);
  const [branches, setBranches] = useState(client.branches || []);

  const toast2  = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };
  const askConf = (msg, fn) => setConfirm({ msg, fn });

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [u, p, st, sa, ex, cr] = await Promise.all([
        db.get("users",    CID, "order=name.asc"),
        db.get("products", CID, "order=name.asc"),
        db.get("stock",    CID, "order=productName.asc"),
        db.get("sales",    CID, "order=date.desc"),
        db.get("expenses", CID, "order=date.desc"),
        db.get("credits",  CID, "order=due.asc"),
      ]);
      setDbOk(!u.error);
      if (u.data?.length)  setUsers(u.data);
      if (p.data?.length)  setProducts(p.data);
      if (st.data?.length) setStock(st.data);
      if (sa.data?.length) setSales(sa.data);
      if (ex.data?.length) {
        setExpenses(ex.data);
        const ec = [...new Set(ex.data.map(e => e.category).filter(Boolean))];
        setExpCats(v => [...new Set([...v, ...ec])]);
      }
      if (cr.data?.length) setCredits(cr.data);
    } catch { setDbOk(false); }
    setLoading(false);
  }, [CID]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const isOwner    = user?.role === "owner";
  const P          = PERM[user?.role] || {};
  const myBranch   = isOwner ? ab : user?.branch;
  const myBranches = isOwner ? branches : (user?.branch ? [user.branch] : []);
  const fB         = arr => isOwner && !ab ? arr : arr.filter(r => r.branch === myBranch);

  const fS  = fB(sales), fE = fB(expenses), fSt = fB(stock), fC = fB(credits);
  const tS  = fS.reduce((s, r) => s + +r.amount, 0);
  const tE  = fE.reduce((s, r) => s + +r.amount, 0);
  const tC  = fC.reduce((s, r) => s + (+r.amount - +(r.paid || 0)), 0);
  const lSt = fSt.filter(s => +s.qty <= +s.reorder);
  const ov  = fC.filter(c => (+c.amount - +(c.paid || 0)) > 0 && c.status === "Overdue");

  // ── ACTIONS ──
  const doSale = async d => {
    const row = { client_id:CID, id:genId(), productId:d.productId, productName:d.productName, qty:d.qty, unitPrice:d.unitPrice, amount:d.amount, branch:d.branch, customer:d.customer||"Walk-in", payType:d.payType||"Cash", soldBy:user.id, date:tod() };
    const { error } = await db.post("sales", row);
    if (error) { toast2("Sale error: " + (error.message || JSON.stringify(error)), "error"); return; }
    const sr = stock.find(s => s.productId === d.productId && s.branch === d.branch);
    if (sr) { const q = Math.max(0, +sr.qty - +d.qty); await db.patch("stock", sr.id, { qty: q }); setStock(p => p.map(s => s.id === sr.id ? { ...s, qty: q } : s)); }
    setSales(p => [row, ...p]);
    toast2("Sale saved! Inventory updated ✓");
  };

  const doRestock = async d => {
    const ex = stock.find(s => s.productId === d.productId && s.branch === d.branch);
    if (ex) {
      const q = +ex.qty + +d.qty;
      const patch = { qty:q, costPrice:d.costPrice||ex.costPrice, sellPrice:d.sellPrice||ex.sellPrice };
      await db.patch("stock", ex.id, patch);
      setStock(p => p.map(s => s.id === ex.id ? { ...s, ...patch } : s));
      toast2("Restocked ✓ New qty: " + q);
    } else {
      const row = { client_id:CID, ...d, id:genId() };
      await db.post("stock", row);
      setStock(p => [...p, row]);
      toast2("Stock item added ✓");
    }
  };

  const doPay = async (id, amt) => {
    const c = credits.find(x => x.id === id); if (!c) return;
    const np = +(c.paid || 0) + amt, ns = np >= +c.amount ? "Paid" : c.status;
    await db.patch("credits", id, { paid:np, status:ns });
    setCredits(p => p.map(x => x.id === id ? { ...x, paid:np, status:ns } : x));
    toast2("Payment of " + fmt(amt) + " recorded ✓");
  };

  const doDel = async (type, id) => {
    if (type === "sale") {
      const s = sales.find(x => x.id === id);
      if (s) { const sr = stock.find(x => x.productId === s.productId && x.branch === s.branch); if (sr) { const q = +sr.qty + +s.qty; await db.patch("stock", sr.id, { qty:q }); setStock(p => p.map(x => x.id === sr.id ? { ...x, qty:q } : x)); } }
      setSales(p => p.filter(x => x.id !== id));
    }
    if (type === "expense") setExpenses(p => p.filter(x => x.id !== id));
    if (type === "credit")  setCredits(p  => p.filter(x => x.id !== id));
    await db.remove({ sale:"sales", expense:"expenses", credit:"credits" }[type], id);
    setConfirm(null);
    toast2("Deleted ✓", "info");
  };

  const doAddExp  = async d => { const row={client_id:CID,...d,id:genId(),addedBy:user.id}; const{error}=await db.post("expenses",row); if(error){toast2("Error","error");return;} setExpenses(p=>[row,...p]); toast2("Expense saved ✓"); };
  const doAddCred = async d => { const row={client_id:CID,...d,id:genId(),paid:0,addedBy:user.id}; const{error}=await db.post("credits",row); if(error){toast2("Error","error");return;} setCredits(p=>[row,...p]); toast2("Credit added ✓"); };
  const doAddProd = async d => { const row={client_id:CID,...d,id:genId()}; const{error}=await db.post("products",row); if(error){toast2("Error","error");return;} setProducts(p=>[...p,row]); toast2("Product added ✓"); };
  const doAddCat  = cat => { if(expCats.includes(cat)){toast2("Already exists","error");return;} setExpCats(p=>[...p,cat]); toast2(cat+" added ✓"); };
  const doAddUser = async d => { const row={client_id:CID,...d,id:genId(),active:true}; const{error}=await db.post("users",row); if(error){toast2("Error: "+(error.message||""),"error");return;} setUsers(p=>[...p,row]); toast2(d.name+" added ✓"); };
  const doToggle  = async uid => { const u=users.find(x=>x.id===uid); if(!u)return; await db.patch("users",uid,{active:!u.active}); setUsers(p=>p.map(x=>x.id===uid?{...x,active:!x.active}:x)); toast2(u.name+" "+(u.active?"disabled":"enabled")+" ✓"); };
  const doPin     = async (uid,pin) => { await db.patch("users",uid,{pin}); setUsers(p=>p.map(u=>u.id===uid?{...u,pin}:u)); toast2("PIN updated ✓"); };

  const nav = [
    { id:"dashboard", label:"Dashboard",        icon:"dashboard" },
    { id:"sales",     label:"Sales",             icon:"sales"     },
    ...(P.exp ? [{ id:"expenses", label:"Expenses", icon:"expense" }] : []),
    { id:"stock",     label:"Inventory",         icon:"stock"     },
    { id:"credit",    label:"Credit Book",       icon:"credit"    },
    { id:"reports",   label:"Reports & Tools",   icon:"report"    },
    ...(isOwner ? [
      { id:"branches", label:"Branches",          icon:"branch"    },
      { id:"users",    label:"Users & Access",    icon:"users"     },
    ] : []),
  ];

  // ── STYLE HELPERS ──
  const S = {
    inp:  { width:"100%", background:T.light, border:`1px solid ${T.border}`, borderRadius:7, padding:"9px 10px", color:T.dark, fontSize:13, outline:"none", boxSizing:"border-box" },
    lbl:  { display:"block", fontSize:10, fontWeight:700, color:T.primary, marginBottom:5, textTransform:"uppercase", letterSpacing:.5 },
    btn:  { display:"flex", alignItems:"center", gap:7, background:T.logo, color:"#fff", border:"none", borderRadius:8, padding:"9px 15px", fontWeight:700, fontSize:13, cursor:"pointer", flexShrink:0 },
    gBtn: { display:"flex", alignItems:"center", gap:7, background:T.light, border:`1px solid ${T.border}`, color:T.primary, borderRadius:8, padding:"9px 15px", fontWeight:700, fontSize:13, cursor:"pointer", flexShrink:0 },
    save: { flex:2, background:T.logo, border:"none", borderRadius:7, color:"#fff", padding:"10px", fontWeight:700, cursor:"pointer", fontSize:14 },
    canc: { flex:1, background:T.mid, border:"none", borderRadius:7, color:T.primary, padding:"10px", fontWeight:700, cursor:"pointer" },
    pay:  { display:"flex", alignItems:"center", gap:4, background:T.mid, color:T.primary, border:`1px solid ${T.border}`, borderRadius:6, padding:"5px 9px", fontSize:12, cursor:"pointer", fontWeight:700, whiteSpace:"nowrap" },
    del:  { display:"flex", alignItems:"center", gap:3, background:"#fef2f2", color:"#dc2626", border:"1px solid #fca5a5", borderRadius:6, padding:"4px 8px", cursor:"pointer", fontSize:11 },
    th:   { textAlign:"left", fontSize:10, fontWeight:700, color:T.primary, padding:"8px 10px", borderBottom:`1px solid ${T.border}`, textTransform:"uppercase", letterSpacing:.5, whiteSpace:"nowrap" },
    td:   { padding:"10px", fontSize:13, borderBottom:`1px solid ${T.mid}`, color:"#374151", verticalAlign:"middle" },
    card: { background:"#fff", border:`1px solid ${T.border}`, borderRadius:11 },
    fc:   { background:"#fff", border:`1px solid ${T.border}`, borderRadius:11, padding:17, marginBottom:16 },
    fg:   { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(185px,1fr))", gap:12 },
    mbox: { background:"#fff", border:`1px solid ${T.border}`, borderRadius:13, width:"100%", maxWidth:420 },
    chip: (bg, tc) => ({ background:bg||T.mid, color:tc||T.primary, fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:99, whiteSpace:"nowrap" }),
    pill: a => ({ background:a?T.mid:T.light, border:a?`1px solid ${T.primary}`:`1px solid ${T.border}`, color:a?T.dark:T.primary, borderRadius:99, padding:"5px 13px", fontSize:12, cursor:"pointer", fontWeight:600 }),
  };

  const Btn = ({ children, onClick, ghost }) => <button onClick={onClick} style={ghost ? S.gBtn : S.btn}>{children}</button>;
  const Del = ({ onClick }) => <button onClick={onClick} style={S.del}><Ic name="delete" size={12} />Del</button>;
  const Tag = ({ children, bg, tc }) => <span style={S.chip(bg, tc)}>{children}</span>;
  const FL  = ({ l, children }) => <div><label style={S.lbl}>{l}</label>{children}</div>;
  const FG  = ({ children }) => <div style={S.fg}>{children}</div>;
  const FC  = ({ title, children }) => <div style={S.fc}><div style={{ fontWeight:700, fontSize:11, color:T.primary, marginBottom:14, textTransform:"uppercase", letterSpacing:.5 }}>{title}</div>{children}</div>;
  const TH  = ({ title, sub, sc, children }) => (
    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:16, flexWrap:"wrap", gap:10 }}>
      <div>
        <div style={{ fontWeight:800, fontSize:18, color:T.dark }}>{title}</div>
        {sub && <div style={{ fontSize:13, color:sc||"#374151", fontWeight:700 }}>{sub}</div>}
      </div>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>{children}</div>
    </div>
  );
  const SH  = ({ children }) => <div style={{ fontWeight:800, fontSize:12, color:T.primary, marginBottom:12, textTransform:"uppercase", letterSpacing:1 }}>{children}</div>;
  const KV  = ({ l, v, c }) => <div style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:`1px solid ${T.mid}`, fontSize:13, color:"#374151" }}><span>{l}</span><strong style={{ color:c||"#374151" }}>{v}</strong></div>;

  function Grid({ cols, rows }) {
    return (
      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr>{cols.map(c => <th key={c} style={S.th}>{c}</th>)}</tr></thead>
          <tbody>
            {rows.length === 0
              ? <tr><td colSpan={cols.length} style={{ ...S.td, textAlign:"center", color:"#94a3b8", padding:32 }}>No records yet</td></tr>
              : rows.map((row, i) => (
                  <tr key={i} style={{ background: i%2===0 ? "transparent" : T.light }}>
                    {row.map((cell, j) => <td key={j} style={S.td}>{cell}</td>)}
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>
    );
  }

  function Modal({ onClose, title, children }) {
    return (
      <div style={{ position:"fixed", inset:0, background:"#00000060", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100 }} onClick={onClose}>
        <div style={S.mbox} onClick={e => e.stopPropagation()}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 20px", borderBottom:`1px solid ${T.border}` }}>
            <span style={{ fontWeight:800, color:T.dark }}>{title}</span>
            <button onClick={onClose} style={{ background:"transparent", border:"none", cursor:"pointer", display:"flex", color:"#374151" }}><Ic name="close" size={18} /></button>
          </div>
          <div style={{ padding:20 }}>{children}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display:"flex", height:"100vh", background:T.light, color:T.dark, fontFamily:"'DM Sans','Segoe UI',sans-serif", overflow:"hidden" }}>

      {/* ── SIDEBAR ── */}
      <aside style={{ width:232, background:"#fff", borderRight:`1px solid ${T.border}`, display:"flex", flexDirection:"column", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:9, padding:"16px 13px 14px", borderBottom:`1px solid ${T.border}` }}>
          <div style={{ width:38, height:38, borderRadius:10, background:T.logo, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, fontWeight:900, color:"#fff", flexShrink:0 }}>{client.logo}</div>
          <div style={{ minWidth:0 }}>
            <div style={{ fontWeight:800, fontSize:12, color:T.dark, lineHeight:1.3 }}>{client.name}</div>
            <div style={{ fontSize:10, color:T.primary, lineHeight:1.5 }}>{client.address}</div>
          </div>
        </div>

        {isOwner && (
          <div style={{ padding:"10px 11px", borderBottom:`1px solid ${T.border}` }}>
            <div style={{ fontSize:10, color:"#374151", fontWeight:700, marginBottom:5, textTransform:"uppercase", letterSpacing:.5 }}>Branch View</div>
            <select style={{ width:"100%", background:T.mid, border:`1px solid ${T.border}`, color:T.dark, borderRadius:7, padding:"7px 8px", fontSize:12, fontWeight:700, cursor:"pointer" }}
              value={ab || ""} onChange={e => { setAb(e.target.value || null); setTab("dashboard"); }}>
              <option value="">📊 All Branches</option>
              {branches.map(b => <option key={b} value={b}>📍 {b}</option>)}
            </select>
          </div>
        )}

        <nav style={{ flex:1, padding:"10px 7px", display:"flex", flexDirection:"column", gap:2, overflowY:"auto" }}>
          {nav.map(({ id, label, icon }) => (
            <button key={id} onClick={() => setTab(id)}
              style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 10px", borderRadius:8, border:"none", background:tab===id?T.mid:"transparent", color:tab===id?T.primary:"#374151", fontSize:13, fontWeight:600, cursor:"pointer", textAlign:"left", width:"100%" }}>
              <Ic name={icon} size={16} />
              <span style={{ flex:1 }}>{label}</span>
              {id==="credit" && ov.length>0  && <span style={{ background:"#ef4444", color:"#fff", fontSize:10, fontWeight:800, borderRadius:99, padding:"1px 6px" }}>{ov.length}</span>}
              {id==="stock"  && lSt.length>0 && <span style={{ background:"#f59e0b", color:"#fff", fontSize:10, fontWeight:800, borderRadius:99, padding:"1px 6px" }}>{lSt.length}</span>}
            </button>
          ))}
        </nav>

        <div style={{ padding:"10px 10px 14px", borderTop:`1px solid ${T.border}` }}>
          <div style={{ fontSize:11, fontWeight:700, marginBottom:6, color:dbOk?"#16a34a":"#ef4444" }}>{dbOk?"● Live":"● Offline"}</div>
          <div style={{ fontSize:11, fontWeight:700, marginBottom:8, padding:"4px 8px", background:T.light, borderRadius:6, border:`1px solid ${T.border}`, color:T.primary }}>
            {user?.role==="owner"?"👑 Owner":user?.role==="manager"?"🏪 Manager":"🧑 Staff"}
            {!isOwner && user?.branch && <span style={{ color:"#374151", marginLeft:6 }}>· {user.branch}</span>}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
            <div style={{ width:32, height:32, borderRadius:"50%", background:T.mid, color:T.primary, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:14, flexShrink:0 }}>{user?.name?.[0]}</div>
            <div style={{ minWidth:0 }}>
              <div style={{ fontWeight:700, fontSize:13, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", color:T.dark }}>{user?.name}</div>
              <div style={{ fontSize:10, color:"#374151" }}>{user?.email}</div>
            </div>
          </div>
          <div style={{ display:"flex", gap:6 }}>
            <button onClick={loadAll} style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 10px", border:`1px solid ${T.border}`, borderRadius:7, background:T.light, color:T.primary, fontSize:12, cursor:"pointer" }}><Ic name="refresh" size={14} /></button>
            <button onClick={onLogout} style={{ flex:1, display:"flex", alignItems:"center", gap:6, padding:"7px 10px", border:`1px solid ${T.border}`, borderRadius:7, background:T.light, color:"#374151", fontSize:12, cursor:"pointer" }}><Ic name="logout" size={14} /> Sign Out</button>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 20px", borderBottom:`1px solid ${T.border}`, flexShrink:0, background:"#fff" }}>
          <div>
            <div style={{ fontSize:18, fontWeight:800, color:T.dark }}>
              {tab==="dashboard" ? `Good day, ${user?.name?.split(" ")[0]} 👋` : nav.find(n=>n.id===tab)?.label}
            </div>
            <div style={{ fontSize:11, color:T.primary, marginTop:2 }}>
              {client.name} · {isOwner?(ab?"📍 "+ab:"📊 All Branches"):"📍 "+user?.branch} · {new Date().toLocaleDateString("en-NG",{weekday:"short",year:"numeric",month:"short",day:"numeric"})}
            </div>
          </div>
          <div style={{ textAlign:"right", fontSize:11, color:"#374151", lineHeight:1.7 }}>
            <div style={{ fontWeight:700, color:T.primary }}>{client.owner}</div>
            <div>{client.phone} · {client.state}</div>
            {isOwner && (
              <button onClick={() => {
                const now = new Date();
                const fmt2 = n => "₦" + Number(n||0).toLocaleString("en-NG");
                const todaySales   = sales.filter(s => new Date(s.date).toDateString() === now.toDateString());
                const weekSales    = sales.filter(s => { const d=new Date(s.date); const w=new Date(now); w.setDate(now.getDate()-7); return d>=w; });
                const monthSales   = sales.filter(s => { const d=new Date(s.date); return d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear(); });
                const yearSales    = sales.filter(s => new Date(s.date).getFullYear()===now.getFullYear());
                const todayExp     = expenses.filter(e => new Date(e.date).toDateString() === now.toDateString());
                const weekExp      = expenses.filter(e => { const d=new Date(e.date); const w=new Date(now); w.setDate(now.getDate()-7); return d>=w; });
                const monthExp     = expenses.filter(e => { const d=new Date(e.date); return d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear(); });
                const yearExp      = expenses.filter(e => new Date(e.date).getFullYear()===now.getFullYear());
                const row=(sArr,eArr)=>{const tS=sArr.reduce((s,r)=>s+ +r.amount,0);const tE=eArr.reduce((s,r)=>s+ +r.amount,0);return`<tr><td class="g">${fmt2(tS)}</td><td class="r">${fmt2(tE)}</td><td class="${tS-tE>=0?"g":"r"}">${fmt2(tS-tE)}</td></tr>`;};
                const html=`<html><head><title>${client.name} — Dashboard Summary</title><style>body{font-family:sans-serif;padding:24px}h1{font-size:18px;margin-bottom:4px}h2{font-size:13px;color:#555;margin:18px 0 6px;text-transform:uppercase;letter-spacing:1px}table{width:100%;border-collapse:collapse;margin-bottom:8px}th{background:#f5f5f5;padding:7px 12px;text-align:left;font-size:11px;border:1px solid #ddd}td{padding:7px 12px;border:1px solid #ddd;font-size:13px}.g{color:#16a34a;font-weight:700}.r{color:#dc2626;font-weight:700}</style></head><body>
                  <h1>${client.name}</h1><p style="color:#555;font-size:12px">${client.address} · ${client.state} · ${client.phone}<br/>Printed: ${now.toLocaleString("en-NG")}</p><hr/>
                  <table><thead><tr><th></th><th>Sales</th><th>Expenses</th><th>Net Profit</th></tr></thead><tbody>
                  <tr><td><strong>Today</strong></td>${row(todaySales,todayExp).replace("<tr>","")}</tr>
                  <tr><td><strong>This Week</strong></td>${row(weekSales,weekExp).replace("<tr>","")}</tr>
                  <tr><td><strong>This Month</strong></td>${row(monthSales,monthExp).replace("<tr>","")}</tr>
                  <tr><td><strong>This Year</strong></td>${row(yearSales,yearExp).replace("<tr>","")}</tr>
                  </tbody></table>
                  <h2>All Branches Summary</h2>
                  <table><thead><tr><th>Branch</th><th>Total Sales</th><th>Total Expenses</th><th>Profit</th></tr></thead><tbody>
                  ${branches.map(b=>{const bS=sales.filter(s=>s.branch===b).reduce((t,r)=>t+ +r.amount,0);const bE=expenses.filter(e=>e.branch===b).reduce((t,r)=>t+ +r.amount,0);return`<tr><td>📍 ${b}</td><td class="g">${fmt2(bS)}</td><td class="r">${fmt2(bE)}</td><td class="${bS-bE>=0?"g":"r"}">${fmt2(bS-bE)}</td></tr>`;}).join("")}
                  </tbody></table>
                  </body></html>`;
                const w = window.open("","_blank"); w.document.write(html); w.document.close(); w.print();
              }} style={{ marginTop:6, background:T.logo, border:"none", borderRadius:6, color:"#fff", padding:"5px 12px", fontSize:11, fontWeight:700, cursor:"pointer" }}>
                🖨 Print Summary
              </button>
            )}
          </div>
        </div>

        {loading && <div style={{ height:3, background:T.logo, flexShrink:0 }} />}

        <div style={{ flex:1, overflow:"auto", padding:"18px 20px", background:T.light }}>

          {/* ── DASHBOARD ── */}
          {tab === "dashboard" && (() => {
            const kpis = P.fin
              ? [{ label:"Total Sales", value:fmt(tS), icon:"sales", color:T.primary, bg:T.mid },{ label:"Total Expenses", value:fmt(tE), icon:"expense", color:"#ef4444", bg:"#fef2f2" },{ label:"Net Profit", value:fmt(tS-tE), icon:"profit", color:tS-tE>=0?T.primary:"#ef4444", bg:tS-tE>=0?T.mid:"#fef2f2" },{ label:"Credit Outstanding", value:fmt(tC), icon:"credit", color:"#f59e0b", bg:"#fef9c3" }]
              : [{ label:"Branch Sales", value:fmt(tS), icon:"sales", color:T.primary, bg:T.mid },{ label:"Credit Outstanding", value:fmt(tC), icon:"credit", color:"#f59e0b", bg:"#fef9c3" }];
            return (
              <div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))", gap:12, marginBottom:16 }}>
                  {kpis.map(k => (
                    <div key={k.label} style={{ background:"#fff", border:`1px solid ${T.border}`, borderRadius:11, padding:"15px 15px 15px 11px", display:"flex", alignItems:"center", gap:12, borderLeft:`4px solid ${k.color}` }}>
                      <div style={{ width:42, height:42, borderRadius:10, background:k.bg, color:k.color, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><Ic name={k.icon} size={22} /></div>
                      <div><div style={{ fontSize:12, color:"#374151", marginBottom:3 }}>{k.label}</div><div style={{ fontSize:22, fontWeight:800, color:k.color }}>{k.value}</div></div>
                    </div>
                  ))}
                </div>
                {(lSt.length>0||ov.length>0) && (
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:12, marginBottom:16 }}>
                    {lSt.length>0 && <div style={{ border:"1px solid #f59e0b", borderRadius:10, padding:13, background:"#fff" }}><div style={{ color:"#f59e0b", fontWeight:700, display:"flex", alignItems:"center", gap:6, marginBottom:8 }}><Ic name="alert" size={15}/>{lSt.length} Low Stock</div>{lSt.map(s=><div key={s.id} style={{ fontSize:12, color:"#374151", padding:"3px 0" }}>{s.productName} · {s.branch} — {s.qty} {s.unit} left</div>)}</div>}
                    {ov.length>0  && <div style={{ border:"1px solid #ef4444", borderRadius:10, padding:13, background:"#fff" }}><div style={{ color:"#ef4444", fontWeight:700, display:"flex", alignItems:"center", gap:6, marginBottom:8 }}><Ic name="alert" size={15}/>{ov.length} Overdue Credit</div>{ov.map(c=><div key={c.id} style={{ fontSize:12, color:"#374151", padding:"3px 0" }}>{c.customer} · {c.branch} — {fmt(+c.amount-+(c.paid||0))}</div>)}</div>}
                  </div>
                )}
                {isOwner && !ab && (
                  <div style={{ marginBottom:18 }}>
                    <SH>Branch Snapshot</SH>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))", gap:12 }}>
                      {branches.map(b => {
                        const bS=sales.filter(s=>s.branch===b).reduce((t,r)=>t+ +r.amount,0);
                        const bE=expenses.filter(e=>e.branch===b).reduce((t,r)=>t+ +r.amount,0);
                        return (
                          <div key={b} style={{ background:"#fff", border:`1px solid ${T.border}`, borderRadius:10, padding:14 }}>
                            <div style={{ fontWeight:700, color:T.primary, marginBottom:10, fontSize:13 }}>📍 {b}</div>
                            <KV l="Sales"    v={fmt(bS)}    c={T.primary} />
                            <KV l="Expenses" v={fmt(bE)}    c="#ef4444"   />
                            <KV l="Profit"   v={fmt(bS-bE)} c={bS-bE>=0?T.primary:"#ef4444"} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                <div style={{ background:"#fff", border:`1px solid ${T.border}`, borderRadius:11, padding:15 }}>
                  <SH>Recent Sales {ab?"— "+ab:""}</SH>
                  <Grid cols={["Product","Customer","Qty","Unit Price","Total","Pay","Branch","Date"]}
                    rows={fS.slice(0,10).map(s=>[s.productName,s.customer||"Walk-in",s.qty,<span style={{color:"#374151"}}>{fmt(s.unitPrice)}</span>,<strong style={{color:T.primary}}>{fmt(s.amount)}</strong>,<Tag bg={T.mid} tc={T.primary}>{s.payType||"Cash"}</Tag>,<Tag>{s.branch}</Tag>,s.date])} />
                </div>
              </div>
            );
          })()}

          {/* ── SALES ── */}
          {tab === "sales" && (() => {
            const [open, setOpen] = [useState(false)].flat();
            return null; // inline state not allowed — use component below
          })()}
          {tab === "sales"     && <SalesPage     data={fS}  stock={fSt} products={products} users={users} user={user} myBranch={myBranch} myBranches={myBranches} isOwner={isOwner} P={P} T={T} S={S} Btn={Btn} Del={Del} Tag={Tag} FL={FL} FG={FG} FC={FC} TH={TH} Grid={Grid} onSale={doSale}     onDelete={id=>askConf("Delete this sale? Stock will be restored.",()=>doDel("sale",id))}/>}
          {tab === "expenses"  && P.exp && <ExpPage data={fE} expCats={expCats} myBranch={myBranch} myBranches={myBranches} P={P} T={T} S={S} Btn={Btn} Del={Del} Tag={Tag} FL={FL} FG={FG} FC={FC} TH={TH} Grid={Grid} onAdd={doAddExp} onAddCat={doAddCat} onDelete={id=>askConf("Delete expense?",()=>doDel("expense",id))} showToast={toast2}/>}
          {tab === "stock"     && <StockPage  data={fSt} products={products} myBranch={myBranch} myBranches={myBranches} P={P} T={T} S={S} Btn={Btn} Tag={Tag} FL={FL} FG={FG} FC={FC} TH={TH} Grid={Grid} onRestock={doRestock} onAddProd={doAddProd} showToast={toast2}/>}
          {tab === "credit"    && <CreditPage data={fC}  myBranch={myBranch} myBranches={myBranches} P={P} T={T} S={S} Btn={Btn} Del={Del} Tag={Tag} FL={FL} FG={FG} FC={FC} TH={TH} Grid={Grid} Modal={Modal} onPayment={doPay} onAdd={doAddCred} onDelete={id=>askConf("Delete credit?",()=>doDel("credit",id))} showToast={toast2}/>}
          {tab === "reports"   && <ReportsPage sales={sales} expenses={expenses} credits={credits} branches={branches} client={cl} ab={ab} isOwner={isOwner} P={P} user={user} myBranch={myBranch} myBranches={myBranches} T={T} S={S} Btn={Btn} Tag={Tag} TH={TH} Grid={Grid} KV={KV}/>}
          {tab === "branches"  && isOwner && <BranchPage sales={sales} expenses={expenses} stock={stock} credits={credits} branches={branches} T={T} S={S} Btn={Btn} TH={TH} KV={KV} onAdd={n=>{if(!branches.includes(n)){setBranches(p=>[...p,n]);toast2("Branch added ✓");}}} onSwitch={b=>{setAb(b);setTab("dashboard");}} showToast={toast2}/>}
          {tab === "users"     && isOwner && <UsersPage  users={users}  branches={branches} T={T} S={S} Btn={Btn} Tag={Tag} FL={FL} FG={FG} FC={FC} TH={TH} Grid={Grid} Modal={Modal} onAdd={doAddUser} onToggle={id=>askConf("Toggle user?",()=>doToggle(id))} onPin={doPin} showToast={toast2}/>}

        </div>
      </main>

      {/* ── TOAST ── */}
      {toast && (
        <div style={{ position:"fixed", bottom:18, right:18, color:"#fff", padding:"11px 16px", borderRadius:9, fontWeight:700, fontSize:13, display:"flex", alignItems:"center", gap:8, zIndex:300, boxShadow:"0 8px 24px #0009", maxWidth:360, background:toast.type==="error"?"#dc2626":toast.type==="info"?"#2563eb":"#16a34a" }}>
          <Ic name={toast.type==="error"?"alert":"check"} size={15}/> {toast.msg}
        </div>
      )}

      {/* ── CONFIRM ── */}
      {confirm && (
        <div style={{ position:"fixed", inset:0, background:"#00000060", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100 }} onClick={()=>setConfirm(null)}>
          <div style={{ background:"#fff", border:"1px solid #fca5a5", borderRadius:13, padding:24, maxWidth:350, width:"90%" }} onClick={e=>e.stopPropagation()}>
            <div style={{ fontWeight:700, fontSize:15, marginBottom:18, color:T.dark }}>{confirm.msg}</div>
            <div style={{ display:"flex", gap:10 }}>
              <button style={S.canc} onClick={()=>setConfirm(null)}>Cancel</button>
              <button style={{...S.save,background:"#dc2626"}} onClick={confirm.fn}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  PAGE COMPONENTS
// ═══════════════════════════════════════════════════════════════════

function SalesPage({data,stock,products,users,user,myBranch,myBranches,isOwner,P,T,S,Btn,Del,Tag,FL,FG,FC,TH,Grid,onSale,onDelete}){
  const[open,setOpen]=useState(false);const[fb,setFb]=useState("all");
  const[form,setForm]=useState({branch:myBranch||myBranches[0]||"",productId:"",qty:1,customer:"",payType:"Cash"});
  const F=(k,v)=>setForm(f=>({...f,[k]:v}));
  const bs=stock.filter(s=>s.branch===form.branch);const sel=bs.find(s=>s.productId===form.productId);
  const amt=sel?+sel.sellPrice*+form.qty:0;
  const shown=isOwner&&fb!=="all"?data.filter(s=>s.branch===fb):data;
  const uName=id=>users.find(u=>u.id===id)?.name||"";
  const sub=()=>{
    if(!form.productId){alert("Select a product");return;}
    if(+form.qty<1){alert("Enter valid qty");return;}
    if(!sel){alert("Product not in stock for this branch");return;}
    if(+form.qty>+sel.qty){alert("Only "+sel.qty+" "+sel.unit+" left in stock");return;}
    onSale({productId:form.productId,productName:sel.productName,qty:+form.qty,unitPrice:+sel.sellPrice,amount:amt,branch:form.branch,customer:form.customer||"Walk-in",payType:form.payType});
    setForm({branch:myBranch||myBranches[0]||"",productId:"",qty:1,customer:"",payType:"Cash"});setOpen(false);
  };
  return(<div>
    <TH title="Sales" sub={fmt(shown.reduce((s,r)=>s+ +r.amount,0))+" shown"} sc={T.primary}><Btn onClick={()=>setOpen(v=>!v)}><Ic name={open?"close":"add"} size={16}/>{open?"Cancel":"Record Sale"}</Btn></TH>
    {open&&<FC title="📦 New Sale — inventory auto-deducted on save"><FG>
      {isOwner&&<FL l="Branch"><select style={S.inp} value={form.branch} onChange={e=>{F("branch",e.target.value);F("productId","");}}>{myBranches.map(b=><option key={b}>{b}</option>)}</select></FL>}
      <FL l="Product *"><select style={S.inp} value={form.productId} onChange={e=>F("productId",e.target.value)}><option value="">— select product —</option>{bs.map(s=><option key={s.productId} value={s.productId}>{s.productName} ({s.qty} {s.unit} @ {fmt(s.sellPrice)})</option>)}</select></FL>
      <FL l="Qty *"><input style={S.inp} type="number" min="1" value={form.qty} onChange={e=>F("qty",e.target.value)}/></FL>
      <FL l="Unit Price (auto)"><div style={{...S.inp,fontWeight:700,color:T.primary}}>{sel?fmt(sel.sellPrice):"—"}</div></FL>
      <FL l="Total Amount (auto)"><div style={{...S.inp,fontWeight:800,fontSize:16,color:T.primary}}>{amt>0?fmt(amt):"—"}</div></FL>
      <FL l="Customer Name"><input style={S.inp} placeholder="Walk-in / Name" value={form.customer} onChange={e=>F("customer",e.target.value)}/></FL>
      <FL l="Payment Type"><select style={S.inp} value={form.payType} onChange={e=>F("payType",e.target.value)}>{["Cash","Transfer","POS","Credit"].map(p=><option key={p}>{p}</option>)}</select></FL>
    </FG><button style={{...S.save,marginTop:16}} onClick={sub}>✅ Save Sale & Update Inventory</button></FC>}
    {isOwner&&<div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>{["all",...myBranches].map(b=><button key={b} onClick={()=>setFb(b)} style={S.pill(fb===b)}>{b==="all"?"📊 All":b}</button>)}</div>}
    <Grid cols={["Product","Customer","Qty","Unit Price","Total","Pay","Branch","Date","Sold By",...(P.del?["Del"]:[])]}
      rows={shown.map(s=>[s.productName,s.customer||"Walk-in",s.qty,<span style={{color:"#374151"}}>{fmt(s.unitPrice)}</span>,<strong style={{color:T.primary}}>{fmt(s.amount)}</strong>,<Tag bg={T.mid} tc={T.primary}>{s.payType||"Cash"}</Tag>,<Tag>{s.branch}</Tag>,s.date,<span style={{fontSize:11,color:"#374151"}}>{uName(s.soldBy)}</span>,...(P.del?[<Del onClick={()=>onDelete(s.id)}/>]:[])])}/>
  </div>);
}

function ExpPage({data,expCats,myBranch,myBranches,P,T,S,Btn,Del,Tag,FL,FG,FC,TH,Grid,onAdd,onAddCat,onDelete,showToast}){
  const[open,setOpen]=useState(false);const[co,setCo]=useState(false);const[nc,setNc]=useState("");
  const[form,setForm]=useState({branch:myBranch||myBranches[0]||"",category:expCats[0],desc:"",amount:"",date:tod()});
  const F=(k,v)=>setForm(f=>({...f,[k]:v}));
  return(<div>
    <TH title="Expenses" sub={fmt(data.reduce((s,r)=>s+ +r.amount,0))+" total"} sc="#ef4444">
      <div style={{display:"flex",gap:8}}><Btn ghost onClick={()=>setCo(v=>!v)}>+ Category</Btn><Btn onClick={()=>setOpen(v=>!v)}><Ic name={open?"close":"add"} size={16}/>{open?"Cancel":"Add Expense"}</Btn></div>
    </TH>
    {co&&<FC title="➕ New Expense Category"><div style={{display:"flex",gap:10}}><input style={{...S.inp,flex:1}} placeholder="e.g. Packaging, Cleaning…" value={nc} onChange={e=>setNc(e.target.value)}/><button style={S.save} onClick={()=>{onAddCat(nc);setNc("");setCo(false);}}>Add</button></div><div style={{marginTop:12,display:"flex",flexWrap:"wrap",gap:7}}>{expCats.map(c=><span key={c} style={{background:T.mid,border:`1px solid ${T.border}`,borderRadius:99,padding:"4px 12px",fontSize:12,color:T.primary}}>{c}</span>)}</div></FC>}
    {open&&<FC title="💸 Record Expense"><FG>
      {myBranches.length>1&&<FL l="Branch"><select style={S.inp} value={form.branch} onChange={e=>F("branch",e.target.value)}>{myBranches.map(b=><option key={b}>{b}</option>)}</select></FL>}
      <FL l="Category *"><select style={S.inp} value={form.category} onChange={e=>F("category",e.target.value)}>{expCats.map(c=><option key={c}>{c}</option>)}</select></FL>
      <FL l="Description *"><input style={S.inp} placeholder="e.g. Generator Fuel 20L" value={form.desc} onChange={e=>F("desc",e.target.value)}/></FL>
      <FL l="Amount (₦) *"><input style={S.inp} type="number" value={form.amount} onChange={e=>F("amount",e.target.value)}/></FL>
      <FL l="Date"><input style={S.inp} type="date" value={form.date} onChange={e=>F("date",e.target.value)}/></FL>
    </FG><button style={{...S.save,marginTop:16}} onClick={()=>{if(!form.desc||!form.amount){showToast("Fill description and amount","error");return;}onAdd({...form,amount:+form.amount});setForm({branch:myBranch||myBranches[0]||"",category:expCats[0],desc:"",amount:"",date:tod()});setOpen(false);}}>Save Expense</button></FC>}
    <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:14}}>{[...new Set(data.map(e=>e.category))].map(c=>{const t=data.filter(e=>e.category===c).reduce((s,r)=>s+ +r.amount,0);return<div key={c} style={{background:T.mid,border:`1px solid ${T.border}`,borderRadius:99,padding:"4px 12px",fontSize:12,color:T.primary}}>{c} <strong style={{color:"#ef4444"}}>{fmt(t)}</strong></div>;})}</div>
    <Grid cols={["Description","Category","Amount","Branch","Date",...(P.del?["Del"]:[])]}
      rows={data.map(e=>[e.desc,<Tag bg="#fef2f2" tc="#ef4444">{e.category}</Tag>,<strong style={{color:"#ef4444"}}>{fmt(e.amount)}</strong>,<Tag>{e.branch}</Tag>,e.date,...(P.del?[<Del onClick={()=>onDelete(e.id)}/>]:[])])}/>
  </div>);
}

function StockPage({data,products,myBranch,myBranches,P,T,S,Btn,Tag,FL,FG,FC,TH,Grid,onRestock,onAddProd,showToast}){
  const[oR,setOR]=useState(false);const[oP,setOP]=useState(false);
  const[form,setForm]=useState({branch:myBranch||myBranches[0]||"",productId:"",qty:"",costPrice:"",sellPrice:"",reorder:10});
  const[pf,setPf]=useState({name:"",unit:"pcs",price:"",branch:myBranch||myBranches[0]||""});
  const F=(k,v)=>setForm(f=>({...f,[k]:v}));const FP=(k,v)=>setPf(f=>({...f,[k]:v}));
  const bp=products.filter(p=>p.branch===form.branch);const ss=data.find(s=>s.productId===form.productId&&s.branch===form.branch);
  return(<div>
    <TH title="Stock / Inventory">{P.stk&&<div style={{display:"flex",gap:8}}><Btn ghost onClick={()=>{setOP(v=>!v);setOR(false);}}><Ic name="stock" size={15}/> New Product</Btn><Btn onClick={()=>{setOR(v=>!v);setOP(false);}}><Ic name="add" size={15}/> Restock</Btn></div>}</TH>
    {oP&&<FC title="🆕 Add New Product to Catalogue"><FG>
      <FL l="Product Name *"><input style={S.inp} placeholder="e.g. Ankara Fabric" value={pf.name} onChange={e=>FP("name",e.target.value)}/></FL>
      <FL l="Unit"><input style={S.inp} placeholder="yards / bags / pcs" value={pf.unit} onChange={e=>FP("unit",e.target.value)}/></FL>
      <FL l="Default Sell Price (₦)"><input style={S.inp} type="number" value={pf.price} onChange={e=>FP("price",e.target.value)}/></FL>
      {myBranches.length>1&&<FL l="Branch"><select style={S.inp} value={pf.branch} onChange={e=>FP("branch",e.target.value)}>{myBranches.map(b=><option key={b}>{b}</option>)}</select></FL>}
    </FG><button style={{...S.save,marginTop:16}} onClick={()=>{if(!pf.name){showToast("Enter product name","error");return;}onAddProd({name:pf.name,unit:pf.unit,price:+pf.price||0,branch:pf.branch});setPf({name:"",unit:"pcs",price:"",branch:myBranch||myBranches[0]||""});setOP(false);}}>Add to Catalogue</button></FC>}
    {oR&&<FC title="📥 Restock — updates existing qty or adds new"><FG>
      {myBranches.length>1&&<FL l="Branch"><select style={S.inp} value={form.branch} onChange={e=>{F("branch",e.target.value);F("productId","");}}>{myBranches.map(b=><option key={b}>{b}</option>)}</select></FL>}
      <FL l="Product *"><select style={S.inp} value={form.productId} onChange={e=>{F("productId",e.target.value);const f=data.find(s=>s.productId===e.target.value&&s.branch===form.branch);if(f){F("costPrice",f.costPrice);F("sellPrice",f.sellPrice);F("reorder",f.reorder);}}}><option value="">— select product —</option>{bp.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></FL>
      <FL l="Qty to Add *"><input style={S.inp} type="number" min="1" value={form.qty} onChange={e=>F("qty",e.target.value)}/></FL>
      <FL l="Cost Price (₦)"><input style={S.inp} type="number" value={form.costPrice} onChange={e=>F("costPrice",e.target.value)}/></FL>
      <FL l="Selling Price (₦)"><input style={S.inp} type="number" value={form.sellPrice} onChange={e=>F("sellPrice",e.target.value)}/></FL>
      <FL l="Reorder Level"><input style={S.inp} type="number" value={form.reorder} onChange={e=>F("reorder",e.target.value)}/></FL>
    </FG>{ss&&<div style={{marginTop:8,fontSize:13,color:"#374151"}}>Current: <strong style={{color:T.primary}}>{ss.qty} {ss.unit}</strong> → After: <strong style={{color:T.dark}}>{+ss.qty+(+form.qty||0)} {ss.unit}</strong></div>}
    <button style={{...S.save,marginTop:16}} onClick={()=>{if(!form.productId||!form.qty){showToast("Select product and qty","error");return;}const p=products.find(x=>x.id===form.productId);onRestock({productId:form.productId,productName:p?.name||"Unknown",qty:+form.qty,unit:p?.unit||"pcs",costPrice:+form.costPrice||0,sellPrice:+form.sellPrice||0,branch:form.branch,reorder:+form.reorder||10});setForm({branch:myBranch||myBranches[0]||"",productId:"",qty:"",costPrice:"",sellPrice:"",reorder:10});setOR(false);}}>✅ Update Inventory</button></FC>}
    <Grid cols={["Product","Qty","Unit","Cost Price","Sell Price","Stock Value","Branch","Status"]}
      rows={data.map(s=>{const low=+s.qty<=+s.reorder;return[s.productName,<strong style={{color:T.dark}}>{s.qty}</strong>,s.unit,fmt(s.costPrice),fmt(s.sellPrice),<strong>{fmt(+s.qty*+s.costPrice)}</strong>,<Tag>{s.branch}</Tag>,<Tag bg={low?"#fef9c3":T.mid} tc={low?"#f59e0b":T.primary}>{low?"⚠ Low":"✓ OK"}</Tag>];})}/>
  </div>);
}

function CreditPage({data,myBranch,myBranches,P,T,S,Btn,Del,Tag,FL,FG,FC,TH,Grid,Modal,onPayment,onAdd,onDelete,showToast}){
  const[open,setOpen]=useState(false);const[modal,setModal]=useState(null);const[amt,setAmt]=useState("");
  const[form,setForm]=useState({branch:myBranch||myBranches[0]||"",customer:"",phone:"",amount:"",due:tod(),status:"Pending"});
  const F=(k,v)=>setForm(f=>({...f,[k]:v}));
  const out=data.reduce((s,c)=>s+(+c.amount-+(c.paid||0)),0);
  return(<div>
    <TH title="Credit Book" sub={"Outstanding: "+fmt(out)} sc="#f59e0b"><Btn onClick={()=>setOpen(v=>!v)}><Ic name={open?"close":"add"} size={16}/>{open?"Cancel":"Add Credit"}</Btn></TH>
    {open&&<FC title="📒 New Credit Entry"><FG>
      {myBranches.length>1&&<FL l="Branch"><select style={S.inp} value={form.branch} onChange={e=>F("branch",e.target.value)}>{myBranches.map(b=><option key={b}>{b}</option>)}</select></FL>}
      <FL l="Customer *"><input style={S.inp} value={form.customer} onChange={e=>F("customer",e.target.value)} placeholder="e.g. Mama Ngozi"/></FL>
      <FL l="Phone"><input style={S.inp} value={form.phone} onChange={e=>F("phone",e.target.value)} placeholder="08012345678"/></FL>
      <FL l="Amount (₦) *"><input style={S.inp} type="number" value={form.amount} onChange={e=>F("amount",e.target.value)}/></FL>
      <FL l="Due Date"><input style={S.inp} type="date" value={form.due} onChange={e=>F("due",e.target.value)}/></FL>
      <FL l="Status"><select style={S.inp} value={form.status} onChange={e=>F("status",e.target.value)}>{["Pending","Overdue"].map(s=><option key={s}>{s}</option>)}</select></FL>
    </FG><button style={{...S.save,marginTop:16}} onClick={()=>{if(!form.customer||!form.amount){showToast("Fill customer and amount","error");return;}onAdd({...form,amount:+form.amount});setForm({branch:myBranch||myBranches[0]||"",customer:"",phone:"",amount:"",due:tod(),status:"Pending"});setOpen(false);}}>Add to Credit Book</button></FC>}
    {modal&&<Modal onClose={()=>setModal(null)} title={`Record Payment — ${modal.customer}`}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:18}}>
        {[["Total",fmt(modal.amount),"#374151"],["Paid",fmt(modal.paid||0),T.primary],["Balance",fmt(+modal.amount-+(modal.paid||0)),"#f59e0b"]].map(([l,v,c])=>(
          <div key={l} style={{background:T.light,borderRadius:8,padding:10,textAlign:"center"}}><div style={{fontSize:11,color:T.primary}}>{l}</div><div style={{fontWeight:800,color:c,fontSize:14}}>{v}</div></div>
        ))}
      </div>
      <label style={S.lbl}>Payment Amount (₦)</label>
      <input style={S.inp} type="number" value={amt} onChange={e=>setAmt(e.target.value)} autoFocus placeholder={"Max: "+(+modal.amount-+(modal.paid||0))}/>
      <div style={{display:"flex",gap:10,marginTop:16}}>
        <button style={S.canc} onClick={()=>setModal(null)}>Cancel</button>
        <button style={S.save} onClick={()=>{const a=+amt;if(!a||a<=0){showToast("Enter valid amount","error");return;}if(a>+modal.amount-+(modal.paid||0)){showToast("Exceeds balance","error");return;}onPayment(modal.id,a);setModal(null);setAmt("");}}>✅ Record Payment</button>
      </div>
    </Modal>}
    <Grid cols={["Customer","Phone","Total","Paid","Balance","Due","Branch","Status","Pay",...(P.del?["Del"]:[])]}
      rows={data.map(c=>{const bal=+c.amount-+(c.paid||0);const sc=c.status==="Paid"?T.primary:c.status==="Overdue"?"#ef4444":"#f59e0b";return[<strong style={{color:T.dark}}>{c.customer}</strong>,<a href={`tel:${c.phone}`} style={{color:T.primary,textDecoration:"none"}}>{c.phone}</a>,fmt(c.amount),<span style={{color:T.primary}}>{fmt(c.paid||0)}</span>,<strong style={{color:bal>0?"#f59e0b":T.primary}}>{fmt(bal)}</strong>,c.due,<Tag>{c.branch}</Tag>,<Tag bg={sc+"20"} tc={sc}>{c.status}</Tag>,bal>0?<button onClick={()=>setModal(c)} style={S.pay}><Ic name="credit" size={12}/> Pay</button>:<span style={{fontSize:11,color:T.primary}}>✓ Cleared</span>,...(P.del?[<Del onClick={()=>onDelete(c.id)}/>]:[])]})}/>
  </div>);
}

function BranchPage({sales,expenses,stock,credits,branches,T,S,Btn,TH,KV,onAdd,onSwitch,showToast}){
  const[nb,setNb]=useState("");
  return(<div>
    <TH title="Branch Overview"><div style={{display:"flex",gap:8}}><input style={{...S.inp,width:180}} placeholder="New branch name…" value={nb} onChange={e=>setNb(e.target.value)}/><Btn onClick={()=>{if(!nb.trim()){showToast("Enter name","error");return;}onAdd(nb.trim());setNb("");}}>+ Add Branch</Btn></div></TH>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:16}}>
      {branches.map(b=>{
        const bS=sales.filter(s=>s.branch===b).reduce((t,r)=>t+ +r.amount,0);
        const bE=expenses.filter(e=>e.branch===b).reduce((t,r)=>t+ +r.amount,0);
        const bC=credits.filter(c=>c.branch===b).reduce((t,r)=>t+(+r.amount-+(r.paid||0)),0);
        const bV=stock.filter(s=>s.branch===b).reduce((t,r)=>t+ +r.qty*+r.costPrice,0);
        const bL=stock.filter(s=>s.branch===b&&+s.qty<=+s.reorder).length;
        return(
          <div key={b} style={{background:"#fff",border:`1px solid ${T.border}`,borderRadius:11,padding:16}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <span style={{fontWeight:800,fontSize:14,color:T.primary}}>📍 {b}</span>
              <button onClick={()=>onSwitch(b)} style={S.pay}><Ic name="switch" size={12}/> View</button>
            </div>
            {[["Sales",fmt(bS),T.primary],["Expenses",fmt(bE),"#ef4444"],["Profit",fmt(bS-bE),bS-bE>=0?T.primary:"#ef4444"],["Credit Outstanding",fmt(bC),"#f59e0b"],["Stock Value",fmt(bV),"#374151"],["Low Stock Items",bL,bL>0?"#f59e0b":T.primary]].map(([l,v,c])=><KV key={l} l={l} v={v} c={c}/>)}
          </div>
        );
      })}
    </div>
  </div>);
}

function UsersPage({users,branches,T,S,Btn,Tag,FL,FG,FC,TH,Grid,Modal,onAdd,onToggle,onPin,showToast}){
  const[open,setOpen]=useState(false);const[pm,setPm]=useState(null);const[np,setNp]=useState("");
  const[form,setForm]=useState({name:"",email:"",pin:"",role:"staff",branch:branches[0]});
  const F=(k,v)=>setForm(f=>({...f,[k]:v}));
  const RC={owner:"#a78bfa",manager:T.primary,staff:"#f59e0b"};
  return(<div>
    <TH title="Users & Access Control"><Btn onClick={()=>setOpen(v=>!v)}><Ic name={open?"close":"add"} size={16}/>{open?"Cancel":"Add User"}</Btn></TH>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:12,marginBottom:20}}>
      {[{role:"owner",title:"👑 Owner",desc:"All branches · Full financials · Delete entries · Manage users"},{role:"manager",title:"🏪 Manager",desc:"Own branch only · Sales, Expenses, Stock, Credits"},{role:"staff",title:"🧑 Staff",desc:"Own branch only · Sales · View stock · View credits"}].map(r=>(
        <div key={r.role} style={{background:T.light,border:`1px solid ${RC[r.role]}40`,borderRadius:11,padding:14}}>
          <div style={{fontWeight:800,color:RC[r.role],marginBottom:6,fontSize:13}}>{r.title}</div>
          <div style={{fontSize:11,color:"#374151",lineHeight:1.7}}>{r.desc}</div>
        </div>
      ))}
    </div>
    {open&&<FC title="➕ Add New User"><FG>
      <FL l="Full Name *"><input style={S.inp} value={form.name} onChange={e=>F("name",e.target.value)} placeholder="e.g. Emeka Obi"/></FL>
      <FL l="Email *"><input style={S.inp} value={form.email} onChange={e=>F("email",e.target.value)} placeholder="emeka@business.ng"/></FL>
      <FL l="PIN * (4–8 digits)"><input style={S.inp} maxLength={8} value={form.pin} onChange={e=>F("pin",e.target.value)} placeholder="e.g. 1234"/></FL>
      <FL l="Role"><select style={S.inp} value={form.role} onChange={e=>F("role",e.target.value)}><option value="staff">Staff</option><option value="manager">Manager</option></select></FL>
      <FL l="Branch"><select style={S.inp} value={form.branch} onChange={e=>F("branch",e.target.value)}>{branches.map(b=><option key={b}>{b}</option>)}</select></FL>
    </FG>
    <div style={{marginTop:12,background:T.mid,borderRadius:8,padding:12,fontSize:12,color:T.primary}}>⚠ This user will only see data for <strong>{form.branch}</strong>. They log in with email + PIN.</div>
    <button style={{...S.save,marginTop:14}} onClick={()=>{if(!form.name||!form.email||!form.pin){showToast("Fill name, email and PIN","error");return;}onAdd(form);setForm({name:"",email:"",pin:"",role:"staff",branch:branches[0]});setOpen(false);}}>✅ Create User</button></FC>}
    {pm&&<Modal onClose={()=>setPm(null)} title={`Change PIN — ${pm.name}`}>
      <div style={{fontSize:13,color:"#374151",marginBottom:14}}>Current PIN: <code style={{background:T.mid,padding:"2px 8px",borderRadius:4,color:T.primary}}>{pm.pin}</code></div>
      <label style={S.lbl}>New PIN (4–8 digits)</label>
      <input style={S.inp} maxLength={8} value={np} onChange={e=>setNp(e.target.value)} placeholder="New PIN" autoFocus/>
      <div style={{display:"flex",gap:10,marginTop:16}}>
        <button style={S.canc} onClick={()=>setPm(null)}>Cancel</button>
        <button style={S.save} onClick={()=>{if(!np||np.length<4){showToast("PIN must be 4–8 digits","error");return;}onPin(pm.id,np);setPm(null);setNp("");}}>Update PIN</button>
      </div>
    </Modal>}
    <Grid cols={["Name","Email","Role","Branch","PIN","Status","Actions"]}
      rows={users.map(u=>[
        <strong style={{color:u.active?T.dark:"#94a3b8"}}>{u.name}</strong>,
        <span style={{fontSize:12,color:"#374151"}}>{u.email}</span>,
        <Tag bg={RC[u.role]+"20"} tc={RC[u.role]}>{u.role}</Tag>,
        u.branch?<Tag>{u.branch}</Tag>:<span style={{color:"#a78bfa",fontSize:12}}>All Branches</span>,
        <code style={{background:T.mid,padding:"2px 8px",borderRadius:4,color:T.primary,fontSize:12}}>{u.pin}</code>,
        <Tag bg={u.active?T.mid:"#fef2f2"} tc={u.active?T.primary:"#ef4444"}>{u.active?"Active":"Disabled"}</Tag>,
        <div style={{display:"flex",gap:6}}>
          {u.role!=="owner"&&<button onClick={()=>onToggle(u.id)} style={{...S.pay,background:u.active?"#fef2f2":T.mid,color:u.active?"#ef4444":T.primary,border:`1px solid ${u.active?"#fca5a5":T.border}`}}><Ic name={u.active?"disable":"enable"} size={12}/>{u.active?"Disable":"Enable"}</button>}
          <button onClick={()=>{setPm(u);setNp("");}} style={S.pay}><Ic name="pin" size={12}/> Change PIN</button>
        </div>
      ])}/>
  </div>);
}

// ═══════════════════════════════════════════════════════════════════
//  REPORTS PAGE — Sales, Expenses, Profit Summary + WhatsApp tools
// ═══════════════════════════════════════════════════════════════════
// Format Nigerian phone number to WhatsApp international format
// Handles: 08012345678 → 2348012345678
//          +2348012345678 → 2348012345678
//          2348012345678 → 2348012345678
function fmtPhone(raw) {
  const digits = (raw || "").replace(/\D/g, "");
  if (digits.startsWith("234")) return digits;
  if (digits.startsWith("0")) return "234" + digits.slice(1);
  if (digits.length === 10) return "234" + digits;
  return digits;
}

function ReportsPage({sales,expenses,credits,branches,client,ab,isOwner,P,user,myBranch,myBranches,T,S,Btn,Tag,TH,Grid,KV}){
  const[period,setPeriod]=useState("today");
  const[branch,setBranch]=useState(isOwner?(ab||"all"):(myBranch||"all"));
  const[showWA,setShowWA]=useState(null);
  const[waData,setWaData]=useState({customer:"",phone:"",amount:"",item:""});
  const[searchSale,setSearchSale]=useState("");
  const[searchExp,setSearchExp]=useState("");
  const[customFrom,setCustomFrom]=useState("");
  const[customTo,setCustomTo]=useState("");
  const[activeSearch,setActiveSearch]=useState("sales");
  const fmt=n=>"₦"+Number(n||0).toLocaleString("en-NG");
  const now=new Date();

  const inPeriod=dateStr=>{
    if(!dateStr)return false;
    const d=new Date(dateStr);
    if(period==="today")return d.toDateString()===now.toDateString();
    if(period==="week"){const w=new Date(now);w.setDate(now.getDate()-7);return d>=w;}
    if(period==="month")return d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear();
    if(period==="year")return d.getFullYear()===now.getFullYear();
    if(period==="custom"&&customFrom&&customTo){const f=new Date(customFrom),t=new Date(customTo);t.setHours(23,59,59);return d>=f&&d<=t;}
    return true;
  };

  // Branch filter — owner sees all or selected, manager/staff see own branch only
  const myBr = isOwner ? branch : (myBranch||"all");
  const fBr=arr=>myBr==="all"?arr:arr.filter(r=>r.branch===myBr);
  const fS=fBr(sales).filter(s=>inPeriod(s.date));
  const fE=fBr(expenses).filter(e=>inPeriod(e.date));
  const fC=fBr(credits);
  const tS=fS.reduce((s,r)=>s+ +r.amount,0);
  const tE=fE.reduce((s,r)=>s+ +r.amount,0);
  const tC=fC.reduce((s,r)=>s+(+r.amount-+(r.paid||0)),0);
  const overdue=fC.filter(c=>(+c.amount-+(c.paid||0))>0&&c.status==="Overdue");

  // Search filters
  const fsSales=fS.filter(s=>
    s.productName?.toLowerCase().includes(searchSale.toLowerCase())||
    s.customer?.toLowerCase().includes(searchSale.toLowerCase())||
    s.branch?.toLowerCase().includes(searchSale.toLowerCase())||
    s.payType?.toLowerCase().includes(searchSale.toLowerCase())
  );
  const fsExp=fE.filter(e=>
    e.desc?.toLowerCase().includes(searchExp.toLowerCase())||
    e.category?.toLowerCase().includes(searchExp.toLowerCase())||
    e.branch?.toLowerCase().includes(searchExp.toLowerCase())
  );

  // Top products
  const prodT={};
  fS.forEach(s=>{if(!prodT[s.productName])prodT[s.productName]={qty:0,amount:0};prodT[s.productName].qty+= +s.qty;prodT[s.productName].amount+= +s.amount;});
  const topProds=Object.entries(prodT).sort((a,b)=>b[1].amount-a[1].amount).slice(0,5);

  // Expense by category
  const catT={};
  fE.forEach(e=>{catT[e.category]=(catT[e.category]||0)+ +e.amount;});

  // Period label
  const pLabel=period==="today"?"Today":period==="week"?"This Week":period==="month"?"This Month":period==="year"?"This Year":period==="custom"&&customFrom&&customTo?customFrom+" to "+customTo:"All Time";

  // CSV Export
  const exportCSV=(type)=>{
    let rows,headers;
    if(type==="sales"){
      headers=["Product","Customer","Qty","Unit Price","Amount","Payment","Branch","Date"];
      rows=fS.map(s=>[s.productName,s.customer||"Walk-in",s.qty,s.unitPrice,s.amount,s.payType||"Cash",s.branch,s.date]);
    }else{
      headers=["Description","Category","Amount","Branch","Date"];
      rows=fE.map(e=>[e.desc,e.category,e.amount,e.branch,e.date]);
    }
    const csv=[headers,...rows].map(r=>r.map(v=>`"${v}"`).join(",")).join("\n");
    const blob=new Blob([csv],{type:"text/csv"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url;a.download=`tracka_${type}_${pLabel.replace(/ /g,"_")}.csv`;a.click();
    URL.revokeObjectURL(url);
  };

  // Print
  const doPrint=()=>{
    const brLabel=myBr==="all"?"All Branches":myBr;
    const html=`
      <html><head><title>${client.name} — ${pLabel}</title>
      <style>body{font-family:sans-serif;padding:20px;font-size:13px}h1{font-size:18px;margin-bottom:4px}h2{font-size:14px;color:#555;margin:20px 0 8px}table{width:100%;border-collapse:collapse;margin-bottom:20px}th{background:#f0f0f0;text-align:left;padding:7px 10px;font-size:11px;border:1px solid #ddd}td{padding:7px 10px;border:1px solid #ddd;font-size:12px}.kpi{display:inline-block;border:1px solid #ddd;border-radius:8px;padding:12px 20px;margin:4px;min-width:140px}.kv{display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px solid #eee}.tot{font-weight:700}.red{color:#dc2626}.grn{color:#16a34a}.ora{color:#f59e0b}</style>
      </head><body>
      <h1>${client.name}</h1>
      <p>${client.address} · ${client.state} · ${client.phone}</p>
      <p><strong>Report Period:</strong> ${pLabel} &nbsp;|&nbsp; <strong>Branch:</strong> ${brLabel} &nbsp;|&nbsp; <strong>Printed:</strong> ${new Date().toLocaleString("en-NG")}</p>
      <hr/>
      <div>
        <div class="kpi"><div style="font-size:11px;color:#555">Total Sales</div><div class="tot grn">${fmt(tS)}</div></div>
        <div class="kpi"><div style="font-size:11px;color:#555">Total Expenses</div><div class="tot red">${fmt(tE)}</div></div>
        <div class="kpi"><div style="font-size:11px;color:#555">Net Profit</div><div class="tot" style="color:${tS-tE>=0?"#16a34a":"#dc2626"}">${fmt(tS-tE)}</div></div>
        <div class="kpi"><div style="font-size:11px;color:#555">Credit Owed</div><div class="tot ora">${fmt(tC)}</div></div>
      </div>
      ${topProds.length>0?`<h2>Top Selling Products</h2><table><thead><tr><th>Product</th><th>Qty Sold</th><th>Revenue</th></tr></thead><tbody>${topProds.map(([n,d])=>`<tr><td>${n}</td><td>${d.qty}</td><td class="tot grn">${fmt(d.amount)}</td></tr>`).join("")}</tbody></table>`:""}
      ${Object.keys(catT).length>0?`<h2>Expenses by Category</h2><table><thead><tr><th>Category</th><th>Amount</th></tr></thead><tbody>${Object.entries(catT).sort((a,b)=>b[1]-a[1]).map(([cat,amt])=>`<tr><td>${cat}</td><td class="tot red">${fmt(amt)}</td></tr>`).join("")}</tbody></table>`:""}
      ${isOwner&&myBr==="all"&&branches.length>1?`<h2>Performance by Branch</h2><table><thead><tr><th>Branch</th><th>Sales</th><th>Expenses</th><th>Profit</th></tr></thead><tbody>${branches.map(b=>{const bS=sales.filter(s=>s.branch===b&&inPeriod(s.date)).reduce((t,r)=>t+ +r.amount,0);const bE=expenses.filter(e=>e.branch===b&&inPeriod(e.date)).reduce((t,r)=>t+ +r.amount,0);return`<tr><td>📍 ${b}</td><td class="grn">${fmt(bS)}</td><td class="red">${fmt(bE)}</td><td class="${bS-bE>=0?"grn":"red"} tot">${fmt(bS-bE)}</td></tr>`;}).join("")}</tbody></table>`:""}
      <h2>Sales Records (${fS.length} records)</h2>
      <table><thead><tr><th>Product</th><th>Customer</th><th>Qty</th><th>Unit Price</th><th>Total</th><th>Payment</th><th>Branch</th><th>Date</th></tr></thead>
      <tbody>${fS.map(s=>`<tr><td>${s.productName}</td><td>${s.customer||"Walk-in"}</td><td>${s.qty}</td><td>${fmt(s.unitPrice)}</td><td class="tot grn">${fmt(s.amount)}</td><td>${s.payType||"Cash"}</td><td>${s.branch}</td><td>${s.date}</td></tr>`).join("")}</tbody></table>
      <h2>Expense Records (${fE.length} records)</h2>
      <table><thead><tr><th>Description</th><th>Category</th><th>Amount</th><th>Branch</th><th>Date</th></tr></thead>
      <tbody>${fE.map(e=>`<tr><td>${e.desc}</td><td>${e.category}</td><td class="tot red">${fmt(e.amount)}</td><td>${e.branch}</td><td>${e.date}</td></tr>`).join("")}</tbody></table>
      </body></html>`;
    const w=window.open("","_blank");w.document.write(html);w.document.close();w.print();
  };

  // WhatsApp
  const waReceipt=()=>{
    const msg=`🧾 *PAYMENT RECEIPT*\n━━━━━━━━━━━━━━━━━━━\n🏢 *${client.name}*\n📍 ${client.address}\n\n👤 Customer: *${waData.customer}*\n🛍 Item: ${waData.item}\n💰 Amount Paid: *${fmt(+waData.amount)}*\n📅 Date: ${new Date().toLocaleDateString("en-NG",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}\n\n✅ *Payment received. Thank you!*\n\n📞 ${client.phone}\n_Powered by Tracka_`;
    return`https://wa.me/${fmtPhone(waData.phone)}?text=${encodeURIComponent(msg)}`;
  };
  const waThankYou=()=>{
    const msg=`🙏 *THANK YOU!*\n━━━━━━━━━━━━━━━━━━━\nDear *${waData.customer}*,\n\nThank you for your patronage at *${client.name}*!\n\nWe appreciate your business and look forward to serving you again.\n\n📞 ${client.phone}\n🌟 Your satisfaction is our priority!\n_${client.name}_`;
    return`https://wa.me/${fmtPhone(waData.phone)}?text=${encodeURIComponent(msg)}`;
  };
  const waReminder=cr=>{
    const bal=+cr.amount-+(cr.paid||0);
    const msg=`⚠️ *PAYMENT REMINDER*\n━━━━━━━━━━━━━━━━━━━\nDear *${cr.customer}*,\n\nFriendly reminder from *${client.name}*.\n\n💳 Outstanding Balance: *${fmt(bal)}*\n📅 Due Date: ${cr.due}\n📊 Status: ${cr.status}\n\nKindly arrange payment at your earliest convenience.\n\nThank you!\n📞 ${client.phone}\n_${client.name}_`;
    return`https://wa.me/${fmtPhone(cr.phone)}?text=${encodeURIComponent(msg)}`;
  };

  const ps=a=>({background:a?T.primary:T.light,color:a?"#fff":T.primary,border:`1px solid ${T.border}`,borderRadius:99,padding:"6px 14px",fontSize:12,cursor:"pointer",fontWeight:700});
  const card={background:"#fff",border:`1px solid ${T.border}`,borderRadius:11,padding:16,marginBottom:16};

  return<div>
    <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:10}}>
      <div><div style={{fontWeight:800,fontSize:18,color:T.dark}}>Reports & Tools</div><div style={{fontSize:13,color:"#374151",fontWeight:700}}>{pLabel} · {myBr==="all"?"All Branches":myBr}</div></div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        <button onClick={()=>exportCSV("sales")} style={{...S.gBtn,fontSize:12,padding:"7px 12px"}}>⬇ CSV Sales</button>
        <button onClick={()=>exportCSV("expenses")} style={{...S.gBtn,fontSize:12,padding:"7px 12px"}}>⬇ CSV Expenses</button>
        <button onClick={doPrint} style={{...S.btn,fontSize:12,padding:"7px 12px"}}>🖨 Print Report</button>
      </div>
    </div>

    {/* Period Filter */}
    <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap",alignItems:"center"}}>
      <span style={{fontSize:12,color:"#374151",fontWeight:700}}>Period:</span>
      {[["today","Today"],["week","This Week"],["month","This Month"],["year","This Year"],["all","All Time"],["custom","Custom"]].map(([v,l])=><button key={v} onClick={()=>setPeriod(v)} style={ps(period===v)}>{l}</button>)}
    </div>
    {period==="custom"&&<div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
      <div><label style={S.lbl}>From</label><input style={{...S.inp,width:160}} type="date" value={customFrom} onChange={e=>setCustomFrom(e.target.value)}/></div>
      <div><label style={S.lbl}>To</label><input style={{...S.inp,width:160}} type="date" value={customTo} onChange={e=>setCustomTo(e.target.value)}/></div>
    </div>}

    {/* Branch Filter — owner only */}
    {isOwner&&<div style={{display:"flex",gap:8,marginBottom:18,flexWrap:"wrap",alignItems:"center"}}>
      <span style={{fontSize:12,color:"#374151",fontWeight:700}}>Branch:</span>
      <select style={{...S.inp,width:"auto",padding:"6px 10px"}} value={branch} onChange={e=>setBranch(e.target.value)}>
        <option value="all">All Branches</option>
        {branches.map(b=><option key={b} value={b}>{b}</option>)}
      </select>
    </div>}

    {/* KPI Cards */}
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12,marginBottom:18}}>
      {[{label:"Total Sales",value:fmt(tS),color:T.primary},{label:"Total Expenses",value:fmt(tE),color:"#ef4444"},{label:"Net Profit",value:fmt(tS-tE),color:tS-tE>=0?T.primary:"#ef4444"},{label:"Credit Owed",value:fmt(tC),color:"#f59e0b"}].map(k=><div key={k.label} style={{background:"#fff",border:`1px solid ${T.border}`,borderRadius:11,padding:16,borderLeft:`4px solid ${k.color}`}}><div style={{fontSize:11,color:"#374151",marginBottom:4}}>{k.label}</div><div style={{fontSize:18,fontWeight:800,color:k.color}}>{k.value}</div></div>)}
    </div>

    {/* Top Products */}
    {topProds.length>0&&<div style={card}><div style={{fontWeight:800,color:T.primary,fontSize:13,marginBottom:12,textTransform:"uppercase",letterSpacing:.5}}>🏆 Top Selling Products</div><Grid cols={["Product","Qty Sold","Revenue"]} rows={topProds.map(([n,d])=>[<strong style={{color:T.dark}}>{n}</strong>,d.qty,<strong style={{color:T.primary}}>{fmt(d.amount)}</strong>])}/></div>}

    {/* Expenses by Category */}
    {Object.keys(catT).length>0&&<div style={card}><div style={{fontWeight:800,color:"#ef4444",fontSize:13,marginBottom:12,textTransform:"uppercase",letterSpacing:.5}}>💸 Expenses by Category</div><Grid cols={["Category","Amount"]} rows={Object.entries(catT).sort((a,b)=>b[1]-a[1]).map(([cat,amt])=>[cat,<strong style={{color:"#ef4444"}}>{fmt(amt)}</strong>])}/></div>}

    {/* Branch Comparison — owner all-branch */}
    {isOwner&&myBr==="all"&&branches.length>1&&<div style={card}><div style={{fontWeight:800,color:T.primary,fontSize:13,marginBottom:12,textTransform:"uppercase",letterSpacing:.5}}>📍 Performance by Branch</div><Grid cols={["Branch","Sales","Expenses","Profit"]} rows={branches.map(b=>{const bS=sales.filter(s=>s.branch===b&&inPeriod(s.date)).reduce((t,r)=>t+ +r.amount,0);const bE=expenses.filter(e=>e.branch===b&&inPeriod(e.date)).reduce((t,r)=>t+ +r.amount,0);return[<strong style={{color:T.dark}}>📍 {b}</strong>,<span style={{color:T.primary}}>{fmt(bS)}</span>,<span style={{color:"#ef4444"}}>{fmt(bE)}</span>,<strong style={{color:bS-bE>=0?T.primary:"#ef4444"}}>{fmt(bS-bE)}</strong>];})}/></div>}

    {/* WhatsApp Tools */}
    <div style={{...card,border:"1px solid #25d36640"}}>
      <div style={{fontWeight:800,color:"#25d366",fontSize:14,marginBottom:16}}>📱 WhatsApp Tools</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:12,marginBottom:16}}>
        {[{key:"receipt",label:"🧾 Send Receipt",color:"#16a34a",desc:"Send payment receipt"},{key:"thankyou",label:"🙏 Thank You Message",color:"#0369a1",desc:"Appreciate a customer"}].map(btn=><button key={btn.key} onClick={()=>{setShowWA(btn.key);setWaData({customer:"",phone:"",amount:"",item:""}); }} style={{background:btn.color+"15",border:`1px solid ${btn.color}40`,borderRadius:10,padding:14,cursor:"pointer",textAlign:"left"}}><div style={{fontWeight:800,color:btn.color,marginBottom:4}}>{btn.label}</div><div style={{fontSize:11,color:"#374151"}}>{btn.desc}</div></button>)}
      </div>
      {(showWA==="receipt"||showWA==="thankyou")&&<div style={{background:T.light,border:`1px solid ${T.border}`,borderRadius:10,padding:16,marginBottom:16}}>
        <div style={{fontWeight:700,color:T.primary,marginBottom:12,fontSize:12,textTransform:"uppercase"}}>{showWA==="receipt"?"🧾 Generate Receipt":"🙏 Generate Thank You"}</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(185px,1fr))",gap:12}}>
          <div><label style={S.lbl}>Customer Name *</label><input style={S.inp} placeholder="e.g. Mama Ngozi" value={waData.customer} onChange={e=>setWaData(p=>({...p,customer:e.target.value}))}/></div>
          <div><label style={S.lbl}>Phone *</label><input style={S.inp} placeholder="08012345678" value={waData.phone} onChange={e=>setWaData(p=>({...p,phone:e.target.value}))}/></div>
          {showWA==="receipt"&&<><div><label style={S.lbl}>Item / Service</label><input style={S.inp} placeholder="e.g. Jollof Rice x3" value={waData.item} onChange={e=>setWaData(p=>({...p,item:e.target.value}))}/></div><div><label style={S.lbl}>Amount Paid (₦)</label><input style={S.inp} type="number" value={waData.amount} onChange={e=>setWaData(p=>({...p,amount:e.target.value}))}/></div></>}
        </div>
        <div style={{display:"flex",gap:10,marginTop:14}}>
          <button onClick={()=>setShowWA(null)} style={{...S.canc,flex:"none",padding:"9px 16px"}}>Cancel</button>
          <a href={showWA==="receipt"?waReceipt():waThankYou()} target="_blank" rel="noreferrer" style={{flex:1,background:"#25d366",border:"none",borderRadius:7,color:"#fff",padding:"10px",fontWeight:800,fontSize:14,cursor:"pointer",textAlign:"center",textDecoration:"none",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><Ic name="wa" size={18}/> Open WhatsApp & Send</a>
        </div>
      </div>}
      {overdue.length>0&&<div>
        <div style={{fontWeight:800,color:"#ef4444",fontSize:13,marginBottom:12}}>⚠️ Overdue Credit Reminders — tap Send to open WhatsApp</div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {overdue.map(cr=>{const bal=+cr.amount-+(cr.paid||0);return<div key={cr.id} style={{background:"#fff",border:"1px solid #fca5a5",borderRadius:10,padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
            <div><div style={{fontWeight:700,color:"#7f1d1d"}}>{cr.customer}</div><div style={{fontSize:12,color:"#374151"}}>{cr.phone} · {cr.branch} · Due: {cr.due}</div><div style={{fontSize:13,fontWeight:700,color:"#ef4444"}}>Balance: {fmt(bal)}</div></div>
            <a href={waReminder(cr)} target="_blank" rel="noreferrer" style={{background:"#25d366",border:"none",borderRadius:8,color:"#fff",padding:"8px 16px",fontWeight:700,fontSize:13,cursor:"pointer",textDecoration:"none",display:"flex",alignItems:"center",gap:6}}><Ic name="wa" size={16}/> Send Reminder</a>
          </div>;})}
        </div>
      </div>}
      {overdue.length===0&&<div style={{fontSize:13,color:"#16a34a",fontWeight:600,padding:"8px 0"}}>✅ No overdue credits!</div>}
    </div>

    {/* Search Tabs */}
    <div style={{display:"flex",gap:8,marginBottom:14}}>
      <button onClick={()=>setActiveSearch("sales")} style={ps(activeSearch==="sales")}>Search Sales</button>
      <button onClick={()=>setActiveSearch("expenses")} style={ps(activeSearch==="expenses")}>Search Expenses</button>
    </div>

    {/* Sales Search & Table */}
    {activeSearch==="sales"&&<div style={card}>
      <div style={{display:"flex",gap:10,marginBottom:14,alignItems:"center",flexWrap:"wrap"}}>
        <div style={{fontWeight:800,color:T.primary,fontSize:13,textTransform:"uppercase",letterSpacing:.5,flex:1}}>📋 Sales Records ({fsSales.length}) · {fmt(fsSales.reduce((s,r)=>s+ +r.amount,0))}</div>
        <input style={{...S.inp,width:220}} placeholder="🔍 Search product, customer, branch…" value={searchSale} onChange={e=>setSearchSale(e.target.value)}/>
      </div>
      <Grid cols={["Product","Customer","Qty","Unit Price","Total","Pay","Branch","Date"]} rows={fsSales.map(s=>[s.productName,s.customer||"Walk-in",s.qty,<span style={{color:"#374151"}}>{fmt(s.unitPrice)}</span>,<strong style={{color:T.primary}}>{fmt(s.amount)}</strong>,<Tag bg={T.mid} tc={T.primary}>{s.payType||"Cash"}</Tag>,<Tag>{s.branch}</Tag>,s.date])}/>
    </div>}

    {/* Expense Search & Table */}
    {activeSearch==="expenses"&&<div style={card}>
      <div style={{display:"flex",gap:10,marginBottom:14,alignItems:"center",flexWrap:"wrap"}}>
        <div style={{fontWeight:800,color:"#ef4444",fontSize:13,textTransform:"uppercase",letterSpacing:.5,flex:1}}>💸 Expense Records ({fsExp.length}) · {fmt(fsExp.reduce((s,r)=>s+ +r.amount,0))}</div>
        <input style={{...S.inp,width:220}} placeholder="🔍 Search description, category, branch…" value={searchExp} onChange={e=>setSearchExp(e.target.value)}/>
      </div>
      <Grid cols={["Description","Category","Amount","Branch","Date"]} rows={fsExp.map(e=>[e.desc,<Tag bg="#fef2f2" tc="#ef4444">{e.category}</Tag>,<strong style={{color:"#ef4444"}}>{fmt(e.amount)}</strong>,<Tag>{e.branch}</Tag>,e.date])}/>
    </div>}
  </div>;
    }

