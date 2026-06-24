import { useState, useEffect, useCallback } from "react";

const SB_URL = "https://saxtkbtmszkqstdoamvv.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNheHRrYnRtc3prcXN0ZG9hbXZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwNDU0MzAsImV4cCI6MjA5NjYyMTQzMH0.uXpzhMg_QJR1Ewj5OfFlAwStDrP0gvolCqBrDE1mIqE";

const CHURCHES = {
  grace_of_god: {
    id: "grace_of_god",
    name: "Grace of God Mission International",
    denomination: "His Glory Cathedral",
    address: "33 Trans Nkisi, GRA Onitsha, Anambra State",
    state: "Anambra State",
    pastor: "Bishop Dr Paul Nwachukwu",
    phone: "08033210572",
    logo: "GGM",
    branches: [
      "HQ - Trans Nkisi GRA",
      "His Glory Parish - Niger Drive GRA",
      "His Glory Parish - Stock Exchange GRA",
      "GGM - Owerri Rd Enugu",
      "GGM - New Market Rd Onitsha",
      "GGM - Fegge",
      "GGM - Awada",
      "GGM - Nnewi",
      "GGM - Nkpor",
    ],
    theme: {
      primary: "#ea580c",
      dark: "#7c2d12",
      light: "#fff7ed",
      mid: "#ffedd5",
      border: "#fed7aa",
      login: "linear-gradient(135deg,#7c2d12,#ea580c,#fbbf24)",
      logo: "linear-gradient(135deg,#ea580c,#fbbf24)",
    },
  },
};

const PERM = {
  pastor:    { fin: true,  del: true,  usr: true  },
  treasurer: { fin: true,  del: false, usr: false },
  secretary: { fin: false, del: false, usr: false },
  worker:    { fin: false, del: false, usr: false },
};

async function dbCall(path, opts = {}) {
  const { headers: xh = {}, ...rest } = opts;
  try {
    const r = await fetch(`${SB_URL}/rest/v1/${path}`, {
      ...rest,
      headers: {
        apikey: SB_KEY,
        Authorization: `Bearer ${SB_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
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
  get: (t, cid, q = "") => dbCall(`${t}?client_id=eq.${cid}${q ? "&" + q : ""}`),
  post: (t, b) => dbCall(t, { method: "POST", body: JSON.stringify(b) }),
  patch: (t, id, b) => dbCall(`${t}?id=eq.${id}`, { method: "PATCH", body: JSON.stringify(b) }),
  remove: (t, id) => dbCall(`${t}?id=eq.${id}`, { method: "DELETE" }),
};

const fmt = (n) => "N" + Number(n || 0).toLocaleString("en-NG");
const genId = () => Date.now() + "_" + Math.random().toString(36).slice(2, 6);
const tod = () => new Date().toISOString().split("T")[0];

export default function App() {
  const p = new URLSearchParams(window.location.search);
  const fromUrl = p.get("church");
  if (fromUrl && CHURCHES[fromUrl]) {
    localStorage.setItem("tracka_church_client", fromUrl);
    window.history.replaceState({}, "", window.location.pathname);
  }
  const key = fromUrl || localStorage.getItem("tracka_church_client");
  const church = CHURCHES[key];
  const [user, setUser] = useState(null);

  if (!church) return (
    <div style={{ minHeight: "100vh", background: "#4c1d95", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
      <div style={{ textAlign: "center", color: "#fff" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>+</div>
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Tracka Church</div>
        <div style={{ fontSize: 14, color: "#ddd6fe" }}>Invalid Access Link</div>
        <div style={{ fontSize: 12, color: "#c4b5fd", marginTop: 8 }}>Contact your church administrator for the correct link.</div>
      </div>
    </div>
  );

  if (!user) return <LoginScreen church={church} onLogin={setUser} />;
  return <MainApp church={church} user={user} onLogout={() => setUser(null)} />;
}

function LoginScreen({ church, onLogin }) {
  const T = church.theme;
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await db.get("users", church.id, "order=name.asc");
      if (res.data && res.data.length > 0) {
        setUsers(res.data);
      } else if (!res.error) {
        const owner = { id: genId(), client_id: church.id, name: church.pastor, role: "pastor", branch: null, pin: "0000", email: church.id + "@tracka.ng", active: true };
        await db.post("users", owner);
        setUsers([owner]);
      }
      setLoading(false);
    })();
  }, [church.id]);

  const go = () => {
    const u = users.find(x => x.email.toLowerCase() === email.toLowerCase().trim() && x.pin === pin.trim());
    if (!u) { setErr("Email or PIN incorrect."); return; }
    if (!u.active) { setErr("Account disabled."); return; }
    onLogin(u);
  };

  return (
    <div style={{ minHeight: "100vh", background: T.login, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", padding: 20 }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: "40px 36px", width: "100%", maxWidth: 400, border: `1px solid ${T.border}` }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: T.logo, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 900, color: "#fff", margin: "0 auto 14px" }}>+</div>
        <div style={{ textAlign: "center", fontWeight: 900, fontSize: 13, color: T.primary, marginBottom: 2 }}>TRACKA CHURCH</div>
        <div style={{ textAlign: "center", fontWeight: 800, fontSize: 18, color: T.dark, marginBottom: 4 }}>{church.name}</div>
        <div style={{ textAlign: "center", fontSize: 12, color: "#64748b", marginBottom: 4 }}>{church.denomination}</div>
        <div style={{ textAlign: "center", fontSize: 12, color: "#64748b", marginBottom: 20 }}>{church.address}</div>
        <div style={{ height: 1, background: T.border, marginBottom: 20 }} />
        <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.primary, marginBottom: 5, textTransform: "uppercase" }}>Email Address</label>
        <input style={{ width: "100%", background: T.light, border: `1px solid ${T.border}`, borderRadius: 7, padding: "10px 12px", fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 14 }} placeholder="your@email.ng" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && go()} />
        <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.primary, marginBottom: 5, textTransform: "uppercase" }}>PIN</label>
        <input style={{ width: "100%", background: T.light, border: `1px solid ${T.border}`, borderRadius: 7, padding: "10px 12px", fontSize: 14, outline: "none", boxSizing: "border-box" }} type="password" maxLength={8} placeholder="Enter your PIN" value={pin} onChange={e => setPin(e.target.value)} onKeyDown={e => e.key === "Enter" && go()} />
        {err && <div style={{ color: "#dc2626", fontSize: 13, marginTop: 8 }}>{err}</div>}
        <button style={{ width: "100%", background: T.logo, border: "none", borderRadius: 10, color: "#fff", padding: "13px", fontWeight: 800, fontSize: 15, cursor: "pointer", marginTop: 16 }} onClick={go} disabled={loading}>{loading ? "Connecting..." : "Enter Tracka Church"}</button>
        <div style={{ fontSize: 11, color: T.primary, marginTop: 14, textAlign: "center" }}>{church.pastor} - Change PIN after first login</div>
      </div>
    </div>
  );
}

function MainApp({ church, user, onLogout }) {
  const T = church.theme;
  const [tab, setTab] = useState("dashboard");
  const [offerings, setOfferings] = useState([]);
  const [tithes, setTithes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const CID = church.id;

  const loadAll = useCallback(async () => {
    setLoading(true);
    const [of, ti, ex, mb] = await Promise.all([
      db.get("church_offerings", CID, "order=date.desc"),
      db.get("church_tithes", CID, "order=date.desc"),
      db.get("expenses", CID, "order=date.desc"),
      db.get("church_members", CID, "order=name.asc"),
    ]);
    if (of.data) setOfferings(of.data);
    if (ti.data) setTithes(ti.data);
    if (ex.data) setExpenses(ex.data);
    if (mb.data) setMembers(mb.data);
    setLoading(false);
  }, [CID]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const totOf = offerings.reduce((s, r) => s + +r.amount, 0);
  const totTi = tithes.reduce((s, r) => s + +r.amount, 0);
  const totEx = expenses.reduce((s, r) => s + +r.amount, 0);
  const isPastor = user?.role === "pastor";

  const nav = [
    { id: "dashboard", label: "Dashboard" },
    { id: "offerings", label: "Offerings" },
    { id: "tithes", label: "Tithes" },
    { id: "expenses", label: "Expenses" },
    { id: "members", label: "Members" },
  ];

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "sans-serif", background: T.light, overflow: "hidden" }}>
      <aside style={{ width: 200, background: "#fff", borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px 14px", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ fontWeight: 800, fontSize: 12, color: T.primary }}>TRACKA CHURCH</div>
          <div style={{ fontWeight: 700, fontSize: 13, color: T.dark, marginTop: 2 }}>{church.name}</div>
        </div>
        <nav style={{ flex: 1, padding: "10px 8px" }}>
          {nav.map(n => (
            <button key={n.id} onClick={() => setTab(n.id)} style={{ display: "block", width: "100%", textAlign: "left", padding: "9px 10px", borderRadius: 8, border: "none", background: tab === n.id ? T.mid : "transparent", color: tab === n.id ? T.primary : "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 2 }}>{n.label}</button>
          ))}
        </nav>
        <div style={{ padding: "12px 14px", borderTop: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 12, color: "#374151", marginBottom: 8 }}>{user?.role} - {user?.name}</div>
          <button onClick={onLogout} style={{ width: "100%", background: T.mid, border: "none", borderRadius: 7, color: T.primary, padding: "8px", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>Sign Out</button>
        </div>
      </aside>

      <main style={{ flex: 1, overflow: "auto", padding: 20 }}>
        {loading && <div style={{ height: 3, background: T.primary, marginBottom: 16, borderRadius: 99 }} />}

        {tab === "dashboard" && (
          <div>
            <div style={{ fontWeight: 800, fontSize: 20, color: T.dark, marginBottom: 4 }}>God bless you, {user?.name?.split(" ")[0]}</div>
            <div style={{ fontSize: 12, color: T.primary, marginBottom: 20 }}>{church.name} - {new Date().toLocaleDateString("en-NG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 12, marginBottom: 20 }}>
              {[
                { label: "Total Offerings", value: fmt(totOf), color: "#16a34a" },
                { label: "Total Tithes", value: fmt(totTi), color: T.primary },
                { label: "Total Income", value: fmt(totOf + totTi), color: "#0369a1" },
                { label: "Total Expenses", value: fmt(totEx), color: "#ef4444" },
                { label: "Net Balance", value: fmt(totOf + totTi - totEx), color: totOf + totTi - totEx >= 0 ? "#16a34a" : "#ef4444" },
                { label: "Members", value: members.length, color: T.primary },
              ].map(k => (
                <div key={k.label} style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: 11, padding: 16, borderLeft: `4px solid ${k.color}` }}>
                  <div style={{ fontSize: 11, color: "#374151", marginBottom: 4 }}>{k.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: k.color }}>{k.value}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: 11, padding: 16 }}>
                <div style={{ fontWeight: 700, color: "#16a34a", marginBottom: 12, fontSize: 12, textTransform: "uppercase" }}>Recent Offerings</div>
                {offerings.slice(0, 5).map(o => (
                  <div key={o.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${T.mid}`, fontSize: 13 }}>
                    <span>{o.service_type}</span>
                    <strong style={{ color: "#16a34a" }}>{fmt(o.amount)}</strong>
                  </div>
                ))}
                {offerings.length === 0 && <div style={{ color: "#94a3b8", fontSize: 13 }}>No offerings yet</div>}
              </div>
              <div style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: 11, padding: 16 }}>
                <div style={{ fontWeight: 700, color: T.primary, marginBottom: 12, fontSize: 12, textTransform: "uppercase" }}>Recent Tithes</div>
                {tithes.slice(0, 5).map(t => (
                  <div key={t.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${T.mid}`, fontSize: 13 }}>
                    <span>{t.member_name || "Anonymous"}</span>
                    <strong style={{ color: T.primary }}>{fmt(t.amount)}</strong>
                  </div>
                ))}
                {tithes.length === 0 && <div style={{ color: "#94a3b8", fontSize: 13 }}>No tithes yet</div>}
              </div>
            </div>
          </div>
        )}

        {tab === "offerings" && <OfferingsTab offerings={offerings} setOfferings={setOfferings} church={church} user={user} T={T} db={db} genId={genId} tod={tod} fmt={fmt} />}
        {tab === "tithes" && <TithesTab tithes={tithes} setTithes={setTithes} members={members} church={church} user={user} T={T} db={db} genId={genId} tod={tod} fmt={fmt} />}
        {tab === "expenses" && <ExpensesTab expenses={expenses} setExpenses={setExpenses} church={church} user={user} T={T} db={db} genId={genId} tod={tod} fmt={fmt} />}
        {tab === "members" && <MembersTab members={members} setMembers={setMembers} church={church} T={T} db={db} genId={genId} tod={tod} />}
      </main>
    </div>
  );
}

function OfferingsTab({ offerings, setOfferings, church, user, T, db, genId, tod, fmt }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ date: tod(), service_type: "Sunday Service", offering_type: "General Offering", amount: "", branch: church.branches[0] || "", notes: "" });
  const F = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const total = offerings.reduce((s, r) => s + +r.amount, 0);
  const save = async () => {
    if (!form.amount) { alert("Enter amount"); return; }
    const row = { client_id: church.id, ...form, amount: +form.amount, id: genId(), recorded_by: user.id };
    const { error } = await db.post("church_offerings", row);
    if (error) { alert("Error saving"); return; }
    setOfferings(p => [row, ...p]);
    setForm({ date: tod(), service_type: "Sunday Service", offering_type: "General Offering", amount: "", branch: church.branches[0] || "", notes: "" });
    setOpen(false);
  };
  const inp = { width: "100%", border: `1px solid ${T.border}`, borderRadius: 7, padding: "9px 10px", fontSize: 13, outline: "none", boxSizing: "border-box", background: T.light };
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div><div style={{ fontWeight: 800, fontSize: 18, color: T.dark }}>Offerings</div><div style={{ fontSize: 13, color: "#16a34a", fontWeight: 700 }}>Total: {fmt(total)}</div></div>
        <button onClick={() => setOpen(v => !v)} style={{ background: T.logo, color: "#fff", border: "none", borderRadius: 8, padding: "9px 16px", fontWeight: 700, cursor: "pointer" }}>{open ? "Cancel" : "Record Offering"}</button>
      </div>
      {open && (
        <div style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: 11, padding: 16, marginBottom: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(185px,1fr))", gap: 12 }}>
            <div><label style={{ fontSize: 10, fontWeight: 700, color: T.primary, display: "block", marginBottom: 4 }}>DATE</label><input style={inp} type="date" value={form.date} onChange={e => F("date", e.target.value)} /></div>
            <div><label style={{ fontSize: 10, fontWeight: 700, color: T.primary, display: "block", marginBottom: 4 }}>SERVICE TYPE</label><select style={inp} value={form.service_type} onChange={e => F("service_type", e.target.value)}>{["Sunday Service", "Wednesday Service", "Friday Service", "Special Service", "Harvest", "Thanksgiving", "Other"].map(s => <option key={s}>{s}</option>)}</select></div>
            <div><label style={{ fontSize: 10, fontWeight: 700, color: T.primary, display: "block", marginBottom: 4 }}>OFFERING TYPE</label><select style={inp} value={form.offering_type} onChange={e => F("offering_type", e.target.value)}>{["General Offering", "Special Offering", "Building Fund", "Mission", "Welfare", "Other"].map(o => <option key={o}>{o}</option>)}</select></div>
            <div><label style={{ fontSize: 10, fontWeight: 700, color: T.primary, display: "block", marginBottom: 4 }}>AMOUNT (N)</label><input style={inp} type="number" value={form.amount} onChange={e => F("amount", e.target.value)} /></div>
            <div><label style={{ fontSize: 10, fontWeight: 700, color: T.primary, display: "block", marginBottom: 4 }}>BRANCH</label><select style={inp} value={form.branch} onChange={e => F("branch", e.target.value)}>{church.branches.map(b => <option key={b}>{b}</option>)}</select></div>
          </div>
          <button onClick={save} style={{ background: T.logo, color: "#fff", border: "none", borderRadius: 7, padding: "10px 20px", fontWeight: 700, cursor: "pointer", marginTop: 12, fontSize: 14 }}>Save Offering</button>
        </div>
      )}
      <div style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: 11, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr style={{ background: T.light }}>{["Date", "Service", "Type", "Amount", "Branch"].map(h => <th key={h} style={{ textAlign: "left", padding: "10px 12px", fontSize: 11, fontWeight: 700, color: T.primary, textTransform: "uppercase" }}>{h}</th>)}</tr></thead>
          <tbody>{offerings.length === 0 ? <tr><td colSpan={5} style={{ padding: 32, textAlign: "center", color: "#94a3b8" }}>No offerings yet</td></tr> : offerings.map((o, i) => <tr key={o.id} style={{ background: i % 2 === 0 ? "#fff" : T.light }}><td style={{ padding: "10px 12px", fontSize: 13 }}>{o.date}</td><td style={{ padding: "10px 12px", fontSize: 13 }}>{o.service_type}</td><td style={{ padding: "10px 12px", fontSize: 13 }}>{o.offering_type}</td><td style={{ padding: "10px 12px", fontSize: 13, fontWeight: 700, color: "#16a34a" }}>{fmt(o.amount)}</td><td style={{ padding: "10px 12px", fontSize: 13 }}>{o.branch}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

function TithesTab({ tithes, setTithes, members, church, user, T, db, genId, tod, fmt }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ date: tod(), member_name: "", member_id: "", amount: "", branch: church.branches[0] || "", period: "" });
  const F = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const total = tithes.reduce((s, r) => s + +r.amount, 0);
  const save = async () => {
    if (!form.amount) { alert("Enter amount"); return; }
    const row = { client_id: church.id, ...form, amount: +form.amount, id: genId(), recorded_by: user.id };
    const { error } = await db.post("church_tithes", row);
    if (error) { alert("Error saving"); return; }
    setTithes(p => [row, ...p]);
    setForm({ date: tod(), member_name: "", member_id: "", amount: "", branch: church.branches[0] || "", period: "" });
    setOpen(false);
  };
  const inp = { width: "100%", border: `1px solid ${T.border}`, borderRadius: 7, padding: "9px 10px", fontSize: 13, outline: "none", boxSizing: "border-box", background: T.light };
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div><div style={{ fontWeight: 800, fontSize: 18, color: T.dark }}>Tithes</div><div style={{ fontSize: 13, color: T.primary, fontWeight: 700 }}>Total: {fmt(total)}</div></div>
        <button onClick={() => setOpen(v => !v)} style={{ background: T.logo, color: "#fff", border: "none", borderRadius: 8, padding: "9px 16px", fontWeight: 700, cursor: "pointer" }}>{open ? "Cancel" : "Record Tithe"}</button>
      </div>
      {open && (
        <div style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: 11, padding: 16, marginBottom: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(185px,1fr))", gap: 12 }}>
            <div><label style={{ fontSize: 10, fontWeight: 700, color: T.primary, display: "block", marginBottom: 4 }}>DATE</label><input style={inp} type="date" value={form.date} onChange={e => F("date", e.target.value)} /></div>
            <div><label style={{ fontSize: 10, fontWeight: 700, color: T.primary, display: "block", marginBottom: 4 }}>MEMBER</label><select style={inp} value={form.member_id} onChange={e => { const m = members.find(x => x.id === e.target.value); F("member_id", e.target.value); F("member_name", m?.name || "Anonymous"); }}><option value="">Anonymous</option>{members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</select></div>
            <div><label style={{ fontSize: 10, fontWeight: 700, color: T.primary, display: "block", marginBottom: 4 }}>AMOUNT (N)</label><input style={inp} type="number" value={form.amount} onChange={e => F("amount", e.target.value)} /></div>
            <div><label style={{ fontSize: 10, fontWeight: 700, color: T.primary, display: "block", marginBottom: 4 }}>PERIOD</label><input style={inp} placeholder="e.g. January 2025" value={form.period} onChange={e => F("period", e.target.value)} /></div>
            <div><label style={{ fontSize: 10, fontWeight: 700, color: T.primary, display: "block", marginBottom: 4 }}>BRANCH</label><select style={inp} value={form.branch} onChange={e => F("branch", e.target.value)}>{church.branches.map(b => <option key={b}>{b}</option>)}</select></div>
          </div>
          <button onClick={save} style={{ background: T.logo, color: "#fff", border: "none", borderRadius: 7, padding: "10px 20px", fontWeight: 700, cursor: "pointer", marginTop: 12, fontSize: 14 }}>Save Tithe</button>
        </div>
      )}
      <div style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: 11, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr style={{ background: T.light }}>{["Date", "Member", "Amount", "Period", "Branch"].map(h => <th key={h} style={{ textAlign: "left", padding: "10px 12px", fontSize: 11, fontWeight: 700, color: T.primary, textTransform: "uppercase" }}>{h}</th>)}</tr></thead>
          <tbody>{tithes.length === 0 ? <tr><td colSpan={5} style={{ padding: 32, textAlign: "center", color: "#94a3b8" }}>No tithes yet</td></tr> : tithes.map((t, i) => <tr key={t.id} style={{ background: i % 2 === 0 ? "#fff" : T.light }}><td style={{ padding: "10px 12px", fontSize: 13 }}>{t.date}</td><td style={{ padding: "10px 12px", fontSize: 13, fontWeight: 700 }}>{t.member_name || "Anonymous"}</td><td style={{ padding: "10px 12px", fontSize: 13, fontWeight: 700, color: T.primary }}>{fmt(t.amount)}</td><td style={{ padding: "10px 12px", fontSize: 13 }}>{t.period || "-"}</td><td style={{ padding: "10px 12px", fontSize: 13 }}>{t.branch}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

function ExpensesTab({ expenses, setExpenses, church, user, T, db, genId, tod, fmt }) {
  const [open, setOpen] = useState(false);
  const cats = ["Staff Salary", "Utilities", "Rent", "Maintenance", "Generator/Fuel", "Welfare", "Stationery", "Ministry", "Outreach", "Miscellaneous"];
  const [form, setForm] = useState({ date: tod(), desc: "", category: cats[0], amount: "", branch: church.branches[0] || "" });
  const F = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const total = expenses.reduce((s, r) => s + +r.amount, 0);
  const save = async () => {
    if (!form.desc || !form.amount) { alert("Fill description and amount"); return; }
    const row = { client_id: church.id, ...form, amount: +form.amount, id: genId(), addedBy: user.id };
    const { error } = await db.post("expenses", row);
    if (error) { alert("Error saving"); return; }
    setExpenses(p => [row, ...p]);
    setForm({ date: tod(), desc: "", category: cats[0], amount: "", branch: church.branches[0] || "" });
    setOpen(false);
  };
  const inp = { width: "100%", border: `1px solid ${T.border}`, borderRadius: 7, padding: "9px 10px", fontSize: 13, outline: "none", boxSizing: "border-box", background: T.light };
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div><div style={{ fontWeight: 800, fontSize: 18, color: T.dark }}>Expenses</div><div style={{ fontSize: 13, color: "#ef4444", fontWeight: 700 }}>Total: {fmt(total)}</div></div>
        <button onClick={() => setOpen(v => !v)} style={{ background: T.logo, color: "#fff", border: "none", borderRadius: 8, padding: "9px 16px", fontWeight: 700, cursor: "pointer" }}>{open ? "Cancel" : "Add Expense"}</button>
      </div>
      {open && (
        <div style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: 11, padding: 16, marginBottom: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(185px,1fr))", gap: 12 }}>
            <div><label style={{ fontSize: 10, fontWeight: 700, color: T.primary, display: "block", marginBottom: 4 }}>DATE</label><input style={inp} type="date" value={form.date} onChange={e => F("date", e.target.value)} /></div>
            <div><label style={{ fontSize: 10, fontWeight: 700, color: T.primary, display: "block", marginBottom: 4 }}>DESCRIPTION</label><input style={inp} placeholder="e.g. Generator Diesel" value={form.desc} onChange={e => F("desc", e.target.value)} /></div>
            <div><label style={{ fontSize: 10, fontWeight: 700, color: T.primary, display: "block", marginBottom: 4 }}>CATEGORY</label><select style={inp} value={form.category} onChange={e => F("category", e.target.value)}>{cats.map(c => <option key={c}>{c}</option>)}</select></div>
            <div><label style={{ fontSize: 10, fontWeight: 700, color: T.primary, display: "block", marginBottom: 4 }}>AMOUNT (N)</label><input style={inp} type="number" value={form.amount} onChange={e => F("amount", e.target.value)} /></div>
            <div><label style={{ fontSize: 10, fontWeight: 700, color: T.primary, display: "block", marginBottom: 4 }}>BRANCH</label><select style={inp} value={form.branch} onChange={e => F("branch", e.target.value)}>{church.branches.map(b => <option key={b}>{b}</option>)}</select></div>
          </div>
          <button onClick={save} style={{ background: T.logo, color: "#fff", border: "none", borderRadius: 7, padding: "10px 20px", fontWeight: 700, cursor: "pointer", marginTop: 12, fontSize: 14 }}>Save Expense</button>
        </div>
      )}
      <div style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: 11, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr style={{ background: T.light }}>{["Date", "Description", "Category", "Amount", "Branch"].map(h => <th key={h} style={{ textAlign: "left", padding: "10px 12px", fontSize: 11, fontWeight: 700, color: T.primary, textTransform: "uppercase" }}>{h}</th>)}</tr></thead>
          <tbody>{expenses.length === 0 ? <tr><td colSpan={5} style={{ padding: 32, textAlign: "center", color: "#94a3b8" }}>No expenses yet</td></tr> : expenses.map((e, i) => <tr key={e.id} style={{ background: i % 2 === 0 ? "#fff" : T.light }}><td style={{ padding: "10px 12px", fontSize: 13 }}>{e.date}</td><td style={{ padding: "10px 12px", fontSize: 13 }}>{e.desc}</td><td style={{ padding: "10px 12px", fontSize: 13 }}>{e.category}</td><td style={{ padding: "10px 12px", fontSize: 13, fontWeight: 700, color: "#ef4444" }}>{fmt(e.amount)}</td><td style={{ padding: "10px 12px", fontSize: 13 }}>{e.branch}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

function MembersTab({ members, setMembers, church, T, db, genId, tod }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", gender: "Male", department: "", branch: church.branches[0] || "" });
  const F = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const depts = ["Choir", "Ushering", "Children Ministry", "Youth", "Prayer", "Media", "Welfare", "Executive"];
  const save = async () => {
    if (!form.name) { alert("Enter member name"); return; }
    const row = { client_id: church.id, ...form, id: genId(), joined: tod(), active: true };
    const { error } = await db.post("church_members", row);
    if (error) { alert("Error saving"); return; }
    setMembers(p => [...p, row]);
    setForm({ name: "", phone: "", gender: "Male", department: "", branch: church.branches[0] || "" });
    setOpen(false);
  };
  const inp = { width: "100%", border: `1px solid ${T.border}`, borderRadius: 7, padding: "9px 10px", fontSize: 13, outline: "none", boxSizing: "border-box", background: T.light };
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div><div style={{ fontWeight: 800, fontSize: 18, color: T.dark }}>Members</div><div style={{ fontSize: 13, color: T.primary, fontWeight: 700 }}>{members.length} registered</div></div>
        <button onClick={() => setOpen(v => !v)} style={{ background: T.logo, color: "#fff", border: "none", borderRadius: 8, padding: "9px 16px", fontWeight: 700, cursor: "pointer" }}>{open ? "Cancel" : "Add Member"}</button>
      </div>
      {open && (
        <div style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: 11, padding: 16, marginBottom: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(185px,1fr))", gap: 12 }}>
            <div><label style={{ fontSize: 10, fontWeight: 700, color: T.primary, display: "block", marginBottom: 4 }}>FULL NAME</label><input style={inp} placeholder="Member name" value={form.name} onChange={e => F("name", e.target.value)} /></div>
            <div><label style={{ fontSize: 10, fontWeight: 700, color: T.primary, display: "block", marginBottom: 4 }}>PHONE</label><input style={inp} placeholder="08012345678" value={form.phone} onChange={e => F("phone", e.target.value)} /></div>
            <div><label style={{ fontSize: 10, fontWeight: 700, color: T.primary, display: "block", marginBottom: 4 }}>GENDER</label><select style={inp} value={form.gender} onChange={e => F("gender", e.target.value)}>{["Male", "Female"].map(g => <option key={g}>{g}</option>)}</select></div>
            <div><label style={{ fontSize: 10, fontWeight: 700, color: T.primary, display: "block", marginBottom: 4 }}>DEPARTMENT</label><select style={inp} value={form.department} onChange={e => F("department", e.target.value)}><option value="">Select...</option>{depts.map(d => <option key={d}>{d}</option>)}</select></div>
            <div><label style={{ fontSize: 10, fontWeight: 700, color: T.primary, display: "block", marginBottom: 4 }}>BRANCH</label><select style={inp} value={form.branch} onChange={e => F("branch", e.target.value)}>{church.branches.map(b => <option key={b}>{b}</option>)}</select></div>
          </div>
          <button onClick={save} style={{ background: T.logo, color: "#fff", border: "none", borderRadius: 7, padding: "10px 20px", fontWeight: 700, cursor: "pointer", marginTop: 12, fontSize: 14 }}>Add Member</button>
        </div>
      )}
      <div style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: 11, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr style={{ background: T.light }}>{["Name", "Phone", "Gender", "Department", "Branch", "Joined"].map(h => <th key={h} style={{ textAlign: "left", padding: "10px 12px", fontSize: 11, fontWeight: 700, color: T.primary, textTransform: "uppercase" }}>{h}</th>)}</tr></thead>
          <tbody>{members.length === 0 ? <tr><td colSpan={6} style={{ padding: 32, textAlign: "center", color: "#94a3b8" }}>No members yet</td></tr> : members.map((m, i) => <tr key={m.id} style={{ background: i % 2 === 0 ? "#fff" : T.light }}><td style={{ padding: "10px 12px", fontSize: 13, fontWeight: 700 }}>{m.name}</td><td style={{ padding: "10px 12px", fontSize: 13 }}>{m.phone || "-"}</td><td style={{ padding: "10px 12px", fontSize: 13 }}>{m.gender}</td><td style={{ padding: "10px 12px", fontSize: 13 }}>{m.department || "-"}</td><td style={{ padding: "10px 12px", fontSize: 13 }}>{m.branch}</td><td style={{ padding: "10px 12px", fontSize: 13 }}>{m.joined}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
