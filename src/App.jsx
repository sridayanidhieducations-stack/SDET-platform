import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
// These are read from Vercel environment variables (set in your Vercel dashboard)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


// ─── Responsive Hook ──────────────────────────────────────────────────────────
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handle = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);
  return width;
}
const isMob = (w) => w < 768;

// ─── Email Helper ─────────────────────────────────────────────────────────────
async function sendEmail(to, subject, html) {
  try {
    await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, subject, html }),
    });
  } catch (e) {
    console.error("Email failed:", e);
  }
}

// ─── Claude AI Helper (calls our secure server-side proxy) ────────────────────
async function callClaude(prompt, system = "", max_tokens = 1000) {
  const res = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, system, max_tokens }),
  });
  if (!res.ok) throw new Error(`Claude API error: ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.text || "";
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const icons = {
  logo: (s = 28) => (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="15" stroke="#f59e0b" strokeWidth="2" />
      <path d="M10 22 L16 10 L22 22" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="12" y1="18" x2="20" y2="18" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  google: (s = 20) => (
    <svg width={s} height={s} viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  ),
  home: (s = 18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
  students: (s = 18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  worksheet: (s = 18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>,
  submit: (s = 18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>,
  chart: (s = 18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>,
  teacher: (s = 18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>,
  brain: (s = 18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" /><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" /></svg>,
  logout: (s = 18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>,
  plus: (s = 18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
  alert: (s = 18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>,
  star: (s = 18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
  book: (s = 18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>,
  phone: (s = 18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.26h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z" /></svg>,
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const C = {
  bg: "#f8f6f1", card: "#ffffff", navy: "#1a2744", gold: "#d4a017",
  goldLight: "#f59e0b", green: "#059669", red: "#dc2626",
  text: "#1a1a2e", muted: "#64748b", border: "#e2e8f0",
};
const inp = {
  width: "100%", padding: "11px 14px", borderRadius: 10,
  border: `1.5px solid ${C.border}`, fontSize: 14, fontFamily: "inherit",
  outline: "none", boxSizing: "border-box", background: "#fff", color: C.text,
};
const btn = (variant = "primary") => ({
  display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 22px",
  borderRadius: 10, border: "none", fontFamily: "inherit", fontWeight: 700,
  fontSize: 14, cursor: "pointer",
  ...(variant === "primary" ? { background: C.navy, color: "#fff" } :
    variant === "gold" ? { background: C.gold, color: "#fff" } :
      variant === "outline" ? { background: "transparent", color: C.navy, border: `1.5px solid ${C.navy}` } :
        variant === "danger" ? { background: C.red, color: "#fff" } : {}),
});
const card = {
  background: C.card, borderRadius: 16, padding: 24,
  boxShadow: "0 1px 4px rgba(0,0,0,.08)", border: `1px solid ${C.border}`,
};

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else { setProfile(null); setLoading(false); }
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (uid) => {
    const { data } = await supabase.from("profiles").select("*").eq("id", uid).single();
    setProfile(data);
    setLoading(false);
  };

  if (loading) return <Splash />;
  if (!session) return <LoginPage />;

  if (profile?.role === "student" && !profile?.phone) {
    return (
      <PhoneCollect
        uid={session.user.id}
        onDone={() => fetchProfile(session.user.id)}
      />
    );
  }

  return profile?.role === "student"
    ? <StudentApp profile={profile} onRefresh={() => fetchProfile(session.user.id)} />
    : <TeacherApp profile={profile} onRefresh={() => fetchProfile(session.user.id)} />;
}

// ─── SPLASH ───────────────────────────────────────────────────────────────────
function Splash() {
  return (
    <div style={{ minHeight: "100vh", background: C.navy, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
      {icons.logo(48)}
      <div style={{ color: "#f59e0b", fontFamily: "Georgia,serif", fontSize: 22, fontWeight: 700 }}>SDET</div>
      <div style={{ width: 36, height: 3, background: "#f59e0b33", borderRadius: 2, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "#f59e0b", animation: "slide 1s infinite", borderRadius: 2 }} />
      </div>
      <style>{`@keyframes slide{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}`}</style>
    </div>
  );
}

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
function LoginPage() {
  const [modal, setModal] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const login = () => supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: window.location.origin },
  });

  const modalContent = {
    "About Us": {
      title: "About Us",
      icon: "🏫",
      content: (
        <div>
          <h3 style={{ color: C.navy, fontFamily: "'Playfair Display',serif", margin: "0 0 4px", fontSize: 20 }}>Welcome to SDET</h3>
          <p style={{ color: "#d4a017", fontWeight: 700, margin: "0 0 16px", fontSize: 14 }}>Sri Dayanidhi Educational Trust</p>
          <p style={{ color: C.text, fontSize: 14, lineHeight: 1.8, margin: "0 0 14px" }}>Sri Dayanidhi Educational Trust was established with a vision to guide students towards a brighter and more successful future. Founded by <strong>Arun Kumar M N</strong>, the institution is committed to helping students overcome fear, confusion, and challenges related to education and career growth.</p>
          <p style={{ color: C.text, fontSize: 14, lineHeight: 1.8, margin: "0 0 20px" }}>At SDET, we believe that every student has unique talents and abilities. Our mission is to identify students' strengths, build confidence, and support them in achieving their academic and career goals.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
            <div style={{ background: "#f0f9ff", borderRadius: 12, padding: 16 }}>
              <div style={{ fontWeight: 700, color: C.navy, marginBottom: 8, fontSize: 13 }}>🎯 Our Mission</div>
              {["Empower students with confidence and knowledge", "Help students discover their abilities", "Provide quality education with personal guidance", "Create a positive learning environment"].map((m, i) => (
                <div key={i} style={{ fontSize: 12, color: C.text, lineHeight: 1.7, paddingLeft: 10, borderLeft: "2px solid #d4a017", marginBottom: 6 }}>{m}</div>
              ))}
            </div>
            <div style={{ background: "#f0fdf4", borderRadius: 12, padding: 16 }}>
              <div style={{ fontWeight: 700, color: C.navy, marginBottom: 8, fontSize: 13 }}>✅ Why Choose SDET?</div>
              {["Experienced & student-friendly faculty", "Individual attention and mentoring", "Focus on academic excellence", "Supportive growth environment", "Improves confidence & performance"].map((m, i) => (
                <div key={i} style={{ fontSize: 12, color: C.text, lineHeight: 1.7, paddingLeft: 10, borderLeft: "2px solid #059669", marginBottom: 6 }}>{m}</div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    "Courses": {
      title: "Courses Offered",
      icon: "📚",
      content: (
        <div>
          <p style={{ color: C.muted, fontSize: 14, margin: "0 0 20px" }}>We provide coaching and academic support across all major boards and subjects.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
            <div style={{ background: "#f0f9ff", borderRadius: 12, padding: 16 }}>
              <div style={{ fontWeight: 700, color: C.navy, marginBottom: 10, fontSize: 13 }}>🏫 Boards Covered</div>
              {["ICSE", "CBSE", "State Board"].map((b, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: C.text, marginBottom: 8 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#d4a017", flexShrink: 0, display: "inline-block" }} />{b}
                </div>
              ))}
            </div>
            <div style={{ background: "#fffbeb", borderRadius: 12, padding: 16 }}>
              <div style={{ fontWeight: 700, color: C.navy, marginBottom: 10, fontSize: 13 }}>🎓 Classes</div>
              <div style={{ fontSize: 13, color: C.text, lineHeight: 1.8 }}>Class 1 to Class 12<br />(All Standards)</div>
            </div>
            <div style={{ background: "#f0fdf4", borderRadius: 12, padding: 16 }}>
              <div style={{ fontWeight: 700, color: C.navy, marginBottom: 10, fontSize: 13 }}>📖 Subjects</div>
              {["Mathematics", "Science", "Physics", "Chemistry", "Biology", "Social Science", "English", "Kannada", "Hindi", "Commerce", "Computer Science"].map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: C.text, marginBottom: 6 }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#059669", flexShrink: 0, display: "inline-block" }} />{s}
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    "Teachers": {
      title: "Our Teachers",
      icon: "👨‍🏫",
      content: (
        <div>
          <p style={{ color: C.text, fontSize: 14, lineHeight: 1.8, margin: "0 0 20px" }}>Our faculty consists of experienced and dedicated teachers who are passionate about student success. They provide personalized attention and simplified teaching methods to help every student learn with confidence.</p>
          <div style={{ background: "#f8f9ff", borderRadius: 12, padding: 20, marginBottom: 16 }}>
            <div style={{ fontWeight: 700, color: C.navy, marginBottom: 14, fontSize: 14 }}>Faculty Members</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { subject: "Mathematics", color: "#dbeafe", text: "#1d4ed8" },
                { subject: "Science", color: "#d1fae5", text: "#065f46" },
                { subject: "English", color: "#fce7f3", text: "#9d174d" },
                { subject: "Physics", color: "#ede9fe", text: "#5b21b6" },
                { subject: "Commerce", color: "#fef3c7", text: "#92400e" },
              ].map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "#fff", borderRadius: 8, border: `1px solid ${C.border}` }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: t.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: t.text, flexShrink: 0 }}>{t.subject[0]}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: C.text }}>Mr./Mrs. __________</div>
                    <div style={{ fontSize: 12, color: C.muted }}>{t.subject} Teacher</div>
                  </div>
                  <span style={{ marginLeft: "auto", background: t.color, color: t.text, fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 700 }}>{t.subject}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 12, color: C.muted, marginTop: 14, fontStyle: "italic" }}>* Teacher names will be updated soon.</p>
          </div>
        </div>
      ),
    },
    "Contact": {
      title: "Contact Us",
      icon: "📞",
      content: (
        <div>
          <div style={{ background: "linear-gradient(135deg, #1a2744, #0f3460)", borderRadius: 16, padding: 24, marginBottom: 20, textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🏛️</div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 18, fontFamily: "'Playfair Display',serif", marginBottom: 4 }}>Sri Dayanidhi Educational Trust</div>
            <div style={{ color: "#d4a017", fontSize: 13, fontStyle: "italic", marginTop: 8 }}>"Guiding Students Towards Confidence, Knowledge & Success."</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { icon: "📍", label: "Address", value: "Mulbagal, Kolar District, Karnataka" },
              { icon: "📞", label: "Contact Number", value: "9620647878" },
              { icon: "📚", label: "Coaching For", value: "ICSE | CBSE | State Board" },
              { icon: "🎓", label: "Classes", value: "1st to 12th Standard" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "14px 18px", background: "#f8fafc", borderRadius: 10, border: `1px solid ${C.border}` }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: 11, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>{item.label}</div>
                  <div style={{ fontSize: 14, color: C.text, fontWeight: 700 }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  };

  const LoginCard = () => (
    <div style={{ background: "#fff", borderRadius: 20, padding: "32px 28px", boxShadow: "0 24px 80px rgba(0,0,0,0.4)" }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ width: 52, height: 52, borderRadius: "50%", background: C.navy, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>{icons.logo(28)}</div>
        <div style={{ fontSize: 11, color: C.gold, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Welcome Back</div>
        <h3 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 800, color: C.navy, fontFamily: "'Playfair Display',serif" }}>Sign in to SDET</h3>
        <p style={{ margin: 0, color: C.muted, fontSize: 13 }}>Access your learning dashboard</p>
      </div>
      <div style={{ borderTop: `1px solid ${C.border}`, marginBottom: 20 }} />
      <button onClick={login}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: "14px 20px", background: "#fff", border: `1.5px solid ${C.border}`, borderRadius: 12, fontSize: 15, fontWeight: 700, color: C.navy, cursor: "pointer", fontFamily: "inherit", boxSizing: "border-box" }}>
        {icons.google(22)} Continue with Google
      </button>
      <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "16px 0" }}>
        <div style={{ flex: 1, height: 1, background: C.border }} />
        <span style={{ fontSize: 12, color: C.muted }}>SDET Portal</span>
        <div style={{ flex: 1, height: 1, background: C.border }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        {[{ icon: "🎓", title: "Students", desc: "Worksheets & progress" }, { icon: "📋", title: "Teachers", desc: "Classes & AI evaluation" }].map(item => (
          <div key={item.title} style={{ background: "#f8f9ff", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontSize: 18, marginBottom: 4 }}>{item.icon}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.navy }}>{item.title}</div>
            <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.4, marginTop: 2 }}>{item.desc}</div>
          </div>
        ))}
      </div>
      <p style={{ margin: 0, fontSize: 11, color: C.muted, textAlign: "center", lineHeight: 1.7 }}>
        By signing in you agree to SDET's terms.<br />
        New students will be asked for their phone number after sign-in.
      </p>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: C.navy, fontFamily: "'Lato',sans-serif", display: "flex", flexDirection: "column" }}>
      <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet" />
      <style>{`
        @media (max-width: 767px) {
          .sdet-desktop { display: none !important; }
          .sdet-mobile { display: flex !important; }
          .sdet-hamburger { display: flex !important; }
          .sdet-nav-links { display: none !important; }
        }
        @media (min-width: 768px) {
          .sdet-mobile { display: none !important; }
          .sdet-hamburger { display: none !important; }
        }
        .sdet-mobile { display: none; flex-direction: column; }
        .sdet-hamburger { display: none; }
      `}</style>

      {/* Modal */}
      {modal && (
        <div onClick={() => setModal(null)} style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 680, maxHeight: "85vh", overflowY: "auto", boxShadow: "0 32px 80px rgba(0,0,0,0.4)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 28px", borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, background: "#fff", zIndex: 1, borderRadius: "20px 20px 0 0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 24 }}>{modalContent[modal].icon}</span>
                <h2 style={{ margin: 0, fontSize: 20, fontFamily: "'Playfair Display',serif", color: C.navy }}>{modalContent[modal].title}</h2>
              </div>
              <button onClick={() => setModal(null)} style={{ background: "#f1f5f9", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", fontSize: 18, color: C.muted, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
            </div>
            <div style={{ padding: "24px 28px" }}>{modalContent[modal].content}</div>
          </div>
        </div>
      )}

      {/* Background */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden" }}>
        <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style={{ width: "100%", height: "100%", opacity: 0.08 }}>
          <rect x="180" y="120" width="1080" height="680" rx="4" fill="none" stroke="#fff" strokeWidth="2"/>
          <rect x="180" y="120" width="1080" height="100" fill="#fff" opacity="0.3"/>
          {[220,340,460,580,700,820,940,1060,1180].map((x,i) => (
            <g key={i}>
              <rect x={x} y="260" width="100" height="130" rx="2" fill="#fff" opacity="0.4"/>
              <rect x={x} y="430" width="100" height="130" rx="2" fill="#fff" opacity="0.4"/>
              <rect x={x} y="600" width="100" height="130" rx="2" fill="#fff" opacity="0.4"/>
            </g>
          ))}
          <rect x="620" y="660" width="200" height="140" rx="0" fill="#fff" opacity="0.5"/>
          <line x1="180" y1="220" x2="1260" y2="220" stroke="#fff" strokeWidth="1" opacity="0.5"/>
          <line x1="180" y1="390" x2="1260" y2="390" stroke="#fff" strokeWidth="1" opacity="0.5"/>
          <line x1="180" y1="560" x2="1260" y2="560" stroke="#fff" strokeWidth="1" opacity="0.5"/>
          <line x1="180" y1="730" x2="1260" y2="730" stroke="#fff" strokeWidth="1" opacity="0.5"/>
        </svg>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(26,39,68,0.85) 0%, rgba(26,39,68,0.7) 60%, rgba(26,39,68,0.92) 100%)" }} />
      </div>

      {/* Nav */}
      <nav style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid rgba(212,160,23,0.25)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {icons.logo(30)}
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 14, fontFamily: "'Playfair Display',serif", lineHeight: 1.2 }}>Sri Dayanidhi Educational Trust</div>
            <div style={{ color: "#d4a017", fontSize: 10, fontWeight: 400, letterSpacing: 1 }}>Bengaluru, Karnataka</div>
          </div>
        </div>
        {/* Desktop nav links */}
        <div className="sdet-nav-links" style={{ display: "flex", gap: 32 }}>
          {["About Us", "Courses", "Teachers", "Contact"].map(item => (
            <span key={item} onClick={() => setModal(item)}
              style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, cursor: "pointer" }}
              onMouseEnter={e => e.target.style.color = "#d4a017"}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.7)"}>
              {item}
            </span>
          ))}
        </div>
        {/* Mobile hamburger */}
        <div className="sdet-hamburger" style={{ position: "relative" }}>
          <button onClick={() => setMenuOpen(v => !v)} style={{ background: "none", border: "none", cursor: "pointer", padding: 8, display: "flex", flexDirection: "column", gap: 5 }}>
            <div style={{ width: 24, height: 2, background: "#fff", borderRadius: 2 }} />
            <div style={{ width: 24, height: 2, background: "#fff", borderRadius: 2 }} />
            <div style={{ width: 24, height: 2, background: "#fff", borderRadius: 2 }} />
          </button>
          {menuOpen && (
            <div style={{ position: "absolute", right: 0, top: 48, background: "#1a2744", border: "1px solid rgba(212,160,23,0.3)", borderRadius: 12, padding: "8px 0", minWidth: 180, zIndex: 100, boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}>
              {["About Us", "Courses", "Teachers", "Contact"].map(item => (
                <div key={item} onClick={() => { setModal(item); setMenuOpen(false); }}
                  style={{ padding: "14px 20px", color: "rgba(255,255,255,0.85)", fontSize: 15, cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Desktop layout */}
      <div className="sdet-desktop" style={{ position: "relative", zIndex: 2, flex: 1, flexDirection: "row", alignItems: "center", padding: "40px 48px", gap: 48, maxWidth: 1200, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "inline-block", background: "rgba(212,160,23,0.15)", border: "1px solid rgba(212,160,23,0.4)", color: "#d4a017", fontSize: 11, padding: "5px 14px", borderRadius: 20, marginBottom: 20, letterSpacing: 1 }}>EST. — BENGALURU</div>
          <h1 style={{ margin: "0 0 6px", fontSize: 42, fontWeight: 800, color: "#fff", fontFamily: "'Playfair Display',serif", lineHeight: 1.15 }}>Sri Dayanidhi<br />Educational Trust</h1>
          <h2 style={{ margin: "0 0 18px", fontSize: 18, fontWeight: 400, color: "#d4a017", fontFamily: "'Playfair Display',serif" }}>SDET Learning Platform</h2>
          <p style={{ margin: "0 0 36px", color: "rgba(255,255,255,0.65)", fontSize: 15, lineHeight: 1.8, maxWidth: 420 }}>Empowering students across ICSE, ISC, CBSE and Karnataka State Board with expert-led Physics, Mathematics, Chemistry and more.</p>
          <div style={{ display: "flex", gap: 40 }}>
            {[["500+","Students"],["15+","Courses"],["3","Boards"]].map(([n,l]) => (
              <div key={l}><div style={{ fontSize: 28, fontWeight: 900, color: "#d4a017", fontFamily: "'Playfair Display',serif" }}>{n}</div><div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>{l}</div></div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 28, flexWrap: "wrap" }}>
            {["ICSE","ISC","CBSE","Karnataka Board"].map(b => (
              <span key={b} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)", fontSize: 11, padding: "5px 14px", borderRadius: 20 }}>{b}</span>
            ))}
          </div>
        </div>
        <div style={{ width: 380, flexShrink: 0 }}><LoginCard /></div>
      </div>

      {/* Mobile layout */}
      <div className="sdet-mobile" style={{ position: "relative", zIndex: 2, padding: "20px 16px 32px", gap: 24, flex: 1 }}>
        <div>
          <div style={{ display: "inline-block", background: "rgba(212,160,23,0.15)", border: "1px solid rgba(212,160,23,0.4)", color: "#d4a017", fontSize: 11, padding: "5px 14px", borderRadius: 20, marginBottom: 12, letterSpacing: 1 }}>EST. — BENGALURU</div>
          <h1 style={{ margin: "0 0 6px", fontSize: 30, fontWeight: 800, color: "#fff", fontFamily: "'Playfair Display',serif", lineHeight: 1.2 }}>Sri Dayanidhi<br/>Educational Trust</h1>
          <h2 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 400, color: "#d4a017", fontFamily: "'Playfair Display',serif" }}>SDET Learning Platform</h2>
          <div style={{ display: "flex", gap: 24, marginBottom: 8 }}>
            {[["500+","Students"],["15+","Courses"],["3","Boards"]].map(([n,l]) => (
              <div key={l}><div style={{ fontSize: 22, fontWeight: 900, color: "#d4a017", fontFamily: "'Playfair Display',serif" }}>{n}</div><div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{l}</div></div>
            ))}
          </div>
        </div>
        <LoginCard />
        <div style={{ textAlign: "center" }}>
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>© 2026 Sri Dayanidhi Educational Trust</span>
        </div>
      </div>

      {/* Footer — desktop */}
      <div className="sdet-desktop" style={{ position: "relative", zIndex: 2, borderTop: "1px solid rgba(255,255,255,0.08)", padding: "12px 48px", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>sdet-platform.vercel.app</span>
        <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>Physics · Mathematics · Chemistry · Biology · English</span>
      </div>
    </div>
  );
}

// ─── PHONE COLLECT ────────────────────────────────────────────────────────────
function PhoneCollect({ uid, onDone }) {
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (phone.length < 10) return;
    setSaving(true);
    await supabase.from("profiles").update({ phone }).eq("id", uid);

    const { data: courses } = await supabase.from("courses").select("id");
    if (courses?.length) {
      const enrollments = courses.map((c) => ({ student_id: uid, course_id: c.id }));
      await supabase.from("enrollments").upsert(enrollments, {
        onConflict: "student_id,course_id",
        ignoreDuplicates: true,
      });
    }

    setSaving(false);
    onDone();
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ ...card, maxWidth: 420, width: "100%", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>{icons.logo(44)}</div>
        <h2 style={{ color: C.navy, fontFamily: "Georgia,serif", margin: "0 0 8px" }}>One Last Step</h2>
        <p style={{ color: C.muted, fontSize: 14, margin: "0 0 28px" }}>Please enter your phone number so your teacher can reach you.</p>
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#f1f5f9", borderRadius: 10, padding: "4px 12px", marginBottom: 20 }}>
          {icons.phone(18)}
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            placeholder="+91 98765 43210"
            maxLength={15}
            style={{ ...inp, background: "transparent", border: "none", padding: "8px 4px", flex: 1 }}
          />
        </div>
        <button
          onClick={save}
          disabled={saving || phone.length < 10}
          style={{ ...btn("primary"), width: "100%", justifyContent: "center", opacity: phone.length < 10 ? 0.6 : 1 }}
        >
          {saving ? "Saving…" : "Join SDET Platform"}
        </button>
      </div>
    </div>
  );
}

// ─── TEACHER APP ──────────────────────────────────────────────────────────────
function TeacherApp({ profile, onRefresh }) {
  const [tab, setTab] = useState("dashboard");
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [worksheets, setWorksheets] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    const [c, s, w, sub] = await Promise.all([
      supabase.from("courses").select("*").eq("teacher_id", profile.id),
      supabase.from("profiles").select("*").eq("role", "student").order("joined_date", { ascending: false }),
      supabase.from("worksheets").select("*").eq("teacher_id", profile.id).order("created_at", { ascending: false }),
      supabase.from("submissions")
        .select("*, profiles(full_name,phone), worksheets(topic,questions,course_id)")
        .order("submitted_at", { ascending: false }),
    ]);
    setCourses(c.data || []);
    setStudents(s.data || []);
    setWorksheets(w.data || []);
    setSubmissions(sub.data || []);
  };

  const logout = () => supabase.auth.signOut();

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: icons.home },
    { id: "students", label: "Students", icon: icons.students },
    { id: "worksheets", label: "Worksheets", icon: icons.worksheet },
    { id: "submissions", label: "Submissions", icon: icons.submit },
    { id: "progress", label: "Progress", icon: icons.chart },
    { id: "profile", label: "My Profile", icon: icons.phone },
    ...(profile.role === "admin" ? [{ id: "teachers", label: "Teachers", icon: icons.teacher }] : []),
  ];

  const w = useWindowWidth();
  const mob = isMob(w);

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: C.bg, fontFamily: "'Lato',sans-serif", paddingBottom: mob ? 60 : 0 }}>
      <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet" />

      {/* Mobile top bar */}
      {mob && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 20, background: C.navy, height: 52, display: "flex", alignItems: "center", padding: "0 16px", justifyContent: "space-between", borderBottom: "1px solid #ffffff18" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {icons.logo(24)}
            <span style={{ color: "#f59e0b", fontWeight: 900, fontSize: 15, fontFamily: "'Playfair Display',serif" }}>SDET</span>
          </div>
          <div style={{ color: "#94a3b8", fontSize: 12 }}>{profile.full_name.split(" ")[0]}</div>
          <button onClick={logout} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}>{icons.logout(18)}</button>
        </div>
      )}

      {/* Mobile bottom tab bar */}
      {mob && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: C.navy, borderTop: "1px solid #ffffff18", display: "flex", zIndex: 20, height: 60 }}>
          {navItems.slice(0, 5).map((n) => (
            <button key={n.id} onClick={() => setTab(n.id)}
              style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 9, fontWeight: tab === n.id ? 700 : 400, background: "transparent", color: tab === n.id ? "#f59e0b" : "#64748b" }}>
              {n.icon(18)} {n.label}
            </button>
          ))}
        </div>
      )}

      {/* Sidebar — desktop only */}
      <aside style={{ width: 240, background: C.navy, display: mob ? "none" : "flex", flexDirection: "column", padding: "28px 0", flexShrink: 0, position: "sticky", top: 0, height: "100vh" }}>
        <div style={{ padding: "0 24px 28px", borderBottom: "1px solid #ffffff18" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            {icons.logo(32)}
            <span style={{ color: "#f59e0b", fontWeight: 900, fontSize: 18, fontFamily: "'Playfair Display',serif" }}>SDET</span>
          </div>
          <div style={{ color: "#94a3b8", fontSize: 11, marginTop: 2 }}>Sri Dayanidhi Educational Trust</div>
        </div>

        <nav style={{ flex: 1, padding: "20px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
          {navItems.map((n) => (
            <button key={n.id} onClick={() => setTab(n.id)}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: tab === n.id ? 700 : 400, background: tab === n.id ? "#f59e0b1a" : "transparent", color: tab === n.id ? "#f59e0b" : "#94a3b8", transition: "all .15s", textAlign: "left" }}>
              {n.icon(16)} {n.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: "0 12px 20px" }}>
          <div style={{ padding: "12px 14px", borderRadius: 10, background: "#ffffff0a", marginBottom: 8 }}>
            <div style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 700 }}>{profile.full_name}</div>
            <div style={{ color: "#64748b", fontSize: 11, marginTop: 2 }}>{profile.role === "admin" ? "Admin · " : ""}{profile.subject || "Physics & Math"}</div>
          </div>
          <button onClick={logout} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "transparent", border: "none", color: "#64748b", cursor: "pointer", fontFamily: "inherit", fontSize: 13, width: "100%" }}>
            {icons.logout(15)} Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: mob ? "68px 12px 12px" : 32, overflowY: "auto" }}>
        {tab === "dashboard" && <TeacherDashboard profile={profile} students={students} worksheets={worksheets} submissions={submissions} courses={courses} />}
        {tab === "students" && <StudentsView students={students} submissions={submissions} worksheets={worksheets} />}
        {tab === "worksheets" && <WorksheetsView worksheets={worksheets} courses={courses} profile={profile} onRefresh={loadAll} />}
        {tab === "submissions" && <SubmissionsView submissions={submissions} worksheets={worksheets} onRefresh={loadAll} />}
        {tab === "progress" && <ProgressView students={students} submissions={submissions} />}
        {tab === "profile" && <TeacherProfile profile={profile} onRefresh={onRefresh} />}
        {tab === "teachers" && <TeachersView profile={profile} />}
      </main>
    </div>
  );
}

// ─── TEACHER DASHBOARD ────────────────────────────────────────────────────────
function TeacherDashboard({ profile, students, worksheets, submissions, courses }) {
  const w = useWindowWidth();
  const mob = isMob(w);
  const pending = submissions.filter((s) => s.score === null).length;
  const shared = worksheets.filter((w) => w.shared).length;
  const scoredSubs = submissions.filter((s) => s.score !== null);
  const avgScore = scoredSubs.length
    ? (scoredSubs.reduce((a, b) => a + b.score, 0) / scoredSubs.length).toFixed(1)
    : "—";

  const stats = [
    { label: "Total Students", value: students.length, color: C.navy, icon: icons.students },
    { label: "Worksheets Shared", value: shared, color: "#7c3aed", icon: icons.worksheet },
    { label: "Pending Evaluation", value: pending, color: C.red, icon: icons.submit },
    { label: "Avg Class Score", value: avgScore, color: C.green, icon: icons.star },
  ];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontFamily: "'Playfair Display',serif", color: C.navy }}>
          {greeting}, {profile.full_name.split(" ")[0]} 👋
        </h1>
        <p style={{ margin: "6px 0 0", color: C.muted }}>Here's what's happening in your classroom today.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
        {stats.map((s) => (
          <div key={s.label} style={{ ...card, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: C.muted, fontSize: 13 }}>{s.label}</span>
              <span style={{ color: s.color }}>{s.icon(20)}</span>
            </div>
            <div style={{ fontSize: 36, fontWeight: 900, color: s.color, fontFamily: "'Playfair Display',serif" }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 16 }}>
        <div style={card}>
          <h3 style={{ margin: "0 0 16px", color: C.navy, fontSize: 16 }}>Recent Submissions</h3>
          {submissions.slice(0, 5).map((s) => (
            <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{s.profiles?.full_name}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{s.worksheets?.topic}</div>
              </div>
              <span style={{ fontWeight: 700, color: s.score !== null ? (s.score >= 7 ? C.green : s.score >= 5 ? "#d97706" : C.red) : "#94a3b8" }}>
                {s.score !== null ? `${s.score}/10` : "Pending"}
              </span>
            </div>
          ))}
          {submissions.length === 0 && <p style={{ color: C.muted, fontSize: 14 }}>No submissions yet.</p>}
        </div>

        <div style={card}>
          <h3 style={{ margin: "0 0 16px", color: C.navy, fontSize: 16 }}>Your Courses</h3>
          {courses.length === 0
            ? <p style={{ color: C.muted, fontSize: 14 }}>No courses created yet. See the setup guide to add courses.</p>
            : courses.map((c) => (
              <div key={c.id} style={{ padding: "12px 0", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: c.subject === "Physics" ? "#dbeafe" : "#d1fae5", display: "flex", alignItems: "center", justifyContent: "center", color: c.subject === "Physics" ? "#1d4ed8" : "#065f46" }}>
                  {icons.book(18)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{c.title}</div>
                  <div style={{ fontSize: 12, color: C.muted }}>{c.subject}</div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}

// ─── STUDENTS VIEW ────────────────────────────────────────────────────────────
function StudentsView({ students, submissions }) {
  const [search, setSearch] = useState("");
  const filtered = students.filter(
    (s) => s.full_name?.toLowerCase().includes(search.toLowerCase()) || s.phone?.includes(search)
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontFamily: "'Playfair Display',serif", color: C.navy, fontSize: 24 }}>Students</h2>
          <p style={{ margin: "4px 0 0", color: C.muted, fontSize: 14 }}>{students.length} registered</p>
        </div>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or phone…" style={{ ...inp, width: 260 }} />
      </div>

      <div style={{ ...card, padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#f8fafc" }}>
            <tr>{["Name", "Phone", "Email", "Joined", "Submissions", "Avg Score"].map((h) => (
              <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => {
              const subs = submissions.filter((sub) => sub.student_id === s.id && sub.score !== null);
              const avg = subs.length ? (subs.reduce((a, b) => a + b.score, 0) / subs.length).toFixed(1) : "—";
              return (
                <tr key={s.id} style={{ borderTop: `1px solid ${C.border}`, background: i % 2 === 0 ? "#fff" : "#fafbfc" }}>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#1d4ed8" }}>
                        {s.full_name?.[0]}
                      </div>
                      <span style={{ fontWeight: 700, color: C.text }}>{s.full_name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: 14, color: C.text }}>{s.phone || "—"}</td>
                  <td style={{ padding: "14px 20px", fontSize: 13, color: C.muted }}>{s.email}</td>
                  <td style={{ padding: "14px 20px", fontSize: 13, color: C.muted }}>{s.joined_date}</td>
                  <td style={{ padding: "14px 20px", fontSize: 14, color: C.text }}>{submissions.filter((sub) => sub.student_id === s.id).length}</td>
                  <td style={{ padding: "14px 20px", fontWeight: 700, color: avg === "—" ? C.muted : Number(avg) >= 7 ? C.green : Number(avg) >= 5 ? "#d97706" : C.red }}>
                    {avg}{avg !== "—" ? "/10" : ""}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <p style={{ padding: 24, color: C.muted, textAlign: "center" }}>No students found.</p>}
      </div>
    </div>
  );
}

// ─── WORKSHEETS VIEW ──────────────────────────────────────────────────────────
function WorksheetsView({ worksheets, courses, profile, onRefresh }) {
  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState("Physics");
  const [generating, setGenerating] = useState(false);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    if (!topic.trim()) return;
    setGenerating(true);
    setError("");
    try {
      const resp = await callClaude(
        `Create a student worksheet for ${subject}, topic: "${topic}". Generate 5 questions mixing conceptual and problem-solving. Return JSON only: {"questions":["q1","q2","q3","q4","q5"]}`,
        `You are an expert ${subject} teacher. Return only valid JSON, no markdown, no explanation.`
      );
      const parsed = JSON.parse(resp.replace(/```json|```/g, "").trim());
      if (!parsed.questions || !Array.isArray(parsed.questions)) throw new Error("Invalid response format");
      setPreview({ topic, subject, questions: parsed.questions });
    } catch (e) {
      setError("Error generating worksheet. Please check your API setup and try again.");
    }
    setGenerating(false);
  };

  const save = async (shared) => {
    if (!preview || !courses.length) return;
    setSaving(true);
    const course = courses.find((c) => c.subject === preview.subject) || courses[0];
    await supabase.from("worksheets").insert({
      course_id: course.id,
      teacher_id: profile.id,
      topic: preview.topic,
      questions: preview.questions,
      shared,
    });

    // Send emails to all students when worksheet is shared
    if (shared) {
      const { data: students } = await supabase.from("profiles").select("email,full_name").eq("role", "student");
      if (students?.length) {
        const questionsHtml = preview.questions.map((q, i) => `<li style="margin-bottom:8px">${q}</li>`).join("");
        for (const student of students) {
          await sendEmail(
            student.email,
            `📚 New Worksheet: ${preview.topic} — SDET`,
            `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
              <div style="background:#1a2744;padding:20px;border-radius:12px 12px 0 0;text-align:center">
                <h2 style="color:#d4a017;margin:0;font-size:20px">SDET Learning Platform</h2>
                <p style="color:#94a3b8;margin:8px 0 0;font-size:13px">Sri Dayanidhi Educational Trust</p>
              </div>
              <div style="background:#fff;border:1px solid #e2e8f0;padding:28px;border-radius:0 0 12px 12px">
                <p style="color:#64748b;margin:0 0 4px;font-size:13px">Hello ${student.full_name},</p>
                <h3 style="color:#1a2744;margin:8px 0 16px;font-size:18px">New Worksheet Available!</h3>
                <div style="background:#f0f9ff;border-left:4px solid #1a2744;padding:14px 18px;border-radius:0 8px 8px 0;margin-bottom:20px">
                  <strong style="color:#1a2744">${preview.subject}: ${preview.topic}</strong>
                </div>
                <p style="color:#374151;margin:0 0 12px;font-size:14px"><strong>Questions:</strong></p>
                <ol style="color:#374151;font-size:14px;line-height:1.7;padding-left:20px">${questionsHtml}</ol>
                <div style="margin-top:24px;text-align:center">
                  <a href="https://sdet-platform.vercel.app" style="background:#1a2744;color:#d4a017;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px">Open Platform & Submit</a>
                </div>
                <p style="color:#94a3b8;font-size:12px;margin-top:20px;text-align:center">SDET — Guiding Students Towards Confidence, Knowledge & Success</p>
              </div>
            </div>`
          );
        }
      }
    }

    setPreview(null);
    setTopic("");
    onRefresh();
    setSaving(false);
  };

  const toggleShare = async (w) => {
    await supabase.from("worksheets").update({ shared: !w.shared }).eq("id", w.id);
    onRefresh();
  };

  return (
    <div>
      <h2 style={{ margin: "0 0 24px", fontFamily: "'Playfair Display',serif", color: C.navy, fontSize: 24 }}>Worksheets</h2>

      {courses.length === 0 && (
        <div style={{ background: "#fef3c7", border: `1px solid #fcd34d`, borderRadius: 12, padding: 16, color: "#92400e", fontSize: 14, marginBottom: 20 }}>
          ⚠️ You need at least one course before creating worksheets. See the setup guide (Step 5) to add courses via Supabase.
        </div>
      )}

      <div style={{ ...card, marginBottom: 28, background: "linear-gradient(135deg,#1a2744 0%,#0f3460 100%)", border: "none" }}>
        <h3 style={{ margin: "0 0 16px", color: "#f59e0b", fontSize: 16, display: "flex", alignItems: "center", gap: 8 }}>
          {icons.brain(18)} AI Worksheet Generator
        </h3>
        <div style={{ display: "flex", gap: 12 }}>
          <select value={subject} onChange={(e) => setSubject(e.target.value)}
            style={{ ...inp, width: 140, background: "#ffffff18", color: "#e2e8f0", border: "1px solid #ffffff33" }}>
            <option>Physics</option>
            <option>Math</option>
            <option>Chemistry</option>
            <option>Biology</option>
          </select>
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Today's topic (e.g. Newton's Laws, Integration…)"
            style={{ ...inp, flex: 1, background: "#ffffff18", color: "#e2e8f0", border: "1px solid #ffffff33" }}
            onKeyDown={(e) => e.key === "Enter" && generate()}
          />
          <button onClick={generate} disabled={generating || !topic.trim() || courses.length === 0}
            style={{ ...btn("gold"), opacity: (generating || !topic.trim() || courses.length === 0) ? 0.7 : 1, flexShrink: 0 }}>
            {generating ? "Generating…" : "✦ Generate"}
          </button>
        </div>

        {error && (
          <div style={{ marginTop: 14, background: "#fee2e2", borderRadius: 8, padding: "10px 14px", color: C.red, fontSize: 13 }}>
            {error}
          </div>
        )}

        {preview && (
          <div style={{ marginTop: 20, background: "#ffffff12", borderRadius: 12, padding: 20 }}>
            <div style={{ fontWeight: 700, color: "#f0f9ff", marginBottom: 12, fontSize: 16 }}>{preview.subject}: {preview.topic}</div>
            <ol style={{ margin: 0, padding: "0 0 0 20px", display: "flex", flexDirection: "column", gap: 10 }}>
              {preview.questions.map((q, i) => (
                <li key={i} style={{ color: "#cbd5e1", fontSize: 14, lineHeight: 1.7 }}>{q}</li>
              ))}
            </ol>
            <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
              <button onClick={() => save(false)} disabled={saving} style={btn("outline")}>Save as Draft</button>
              <button onClick={() => save(true)} disabled={saving} style={btn("gold")}>📤 Share with Students</button>
            </div>
          </div>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {worksheets.map((w) => (
          <div key={w.id} style={{ ...card, display: "flex", alignItems: "center", gap: 16, padding: "18px 24px" }}>
            <div style={{ color: w.subject === "Physics" ? "#1d4ed8" : "#059669" }}>{icons.worksheet(24)}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: C.text, fontSize: 15 }}>{w.topic}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{w.subject} · {w.questions?.length} questions · {new Date(w.created_at).toLocaleDateString()}</div>
            </div>
            <span style={{ padding: "4px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: w.shared ? "#d1fae5" : "#f1f5f9", color: w.shared ? C.green : C.muted }}>
              {w.shared ? "✓ Shared" : "Draft"}
            </span>
            <button onClick={() => toggleShare(w)}
              style={{ ...btn(w.shared ? "outline" : "primary"), padding: "8px 16px", fontSize: 13 }}>
              {w.shared ? "Unshare" : "Share"}
            </button>
          </div>
        ))}
        {worksheets.length === 0 && <p style={{ color: C.muted, textAlign: "center", padding: 32 }}>No worksheets yet. Generate your first one above!</p>}
      </div>
    </div>
  );
}

// ─── SUBMISSIONS VIEW ─────────────────────────────────────────────────────────
function SubmissionsView({ submissions, worksheets, onRefresh }) {
  const [evaluating, setEvaluating] = useState(null);

  const evaluate = async (sub) => {
    setEvaluating(sub.id);
    const ws = worksheets.find((w) => w.id === sub.worksheet_id);
    try {
      const resp = await callClaude(
        `Evaluate this student's submission.\nTopic: ${ws?.topic}\nQuestions: ${ws?.questions?.join("; ")}\nStudent answer: ${sub.content}\n\nReturn JSON: {"score":<1-10>,"feedback":"<2-3 encouraging sentences>","weak_points":["topic if weak, or empty array if none"]}`,
        "You are a supportive teacher. Return only valid JSON, no markdown."
      );
      const parsed = JSON.parse(resp.replace(/```json|```/g, "").trim());

      await supabase.from("submissions").update({
        score: parsed.score,
        feedback: parsed.feedback,
        weak_points: parsed.weak_points || [],
        evaluated_at: new Date().toISOString(),
      }).eq("id", sub.id);

      if (parsed.weak_points?.length && ws?.course_id) {
        for (const wp of parsed.weak_points) {
          if (!wp) continue;
          await supabase.from("student_weak_points").upsert(
            { student_id: sub.student_id, course_id: ws.course_id, topic: wp, last_flagged: new Date().toISOString() },
            { onConflict: "student_id,course_id,topic" }
          );
        }
      }

      // Send email to student with score and feedback
      const studentEmail = sub.profiles?.email || sub.email;
      const studentName = sub.profiles?.full_name || "Student";
      if (studentEmail) {
        const scoreColor = parsed.score >= 7 ? "#059669" : parsed.score >= 5 ? "#d97706" : "#dc2626";
        await sendEmail(
          studentEmail,
          `📊 Your Score: ${parsed.score}/10 — ${ws?.topic} — SDET`,
          `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
            <div style="background:#1a2744;padding:20px;border-radius:12px 12px 0 0;text-align:center">
              <h2 style="color:#d4a017;margin:0;font-size:20px">SDET Learning Platform</h2>
              <p style="color:#94a3b8;margin:8px 0 0;font-size:13px">Sri Dayanidhi Educational Trust</p>
            </div>
            <div style="background:#fff;border:1px solid #e2e8f0;padding:28px;border-radius:0 0 12px 12px">
              <p style="color:#64748b;margin:0 0 4px;font-size:13px">Hello ${studentName},</p>
              <h3 style="color:#1a2744;margin:8px 0 16px;font-size:18px">Your worksheet has been evaluated!</h3>
              <div style="background:#f8fafc;border-radius:12px;padding:20px;text-align:center;margin-bottom:20px">
                <p style="color:#64748b;margin:0 0 4px;font-size:13px">Topic: <strong>${ws?.topic}</strong></p>
                <div style="font-size:48px;font-weight:900;color:${scoreColor};margin:12px 0">${parsed.score}<span style="font-size:24px;color:#94a3b8">/10</span></div>
              </div>
              <div style="background:#f0fdf4;border-left:4px solid #059669;padding:14px 18px;border-radius:0 8px 8px 0;margin-bottom:20px">
                <p style="color:#065f46;margin:0;font-size:14px;line-height:1.7"><strong>Teacher Feedback:</strong><br/>${parsed.feedback}</p>
              </div>
              <div style="margin-top:24px;text-align:center">
                <a href="https://sdet-platform.vercel.app" style="background:#1a2744;color:#d4a017;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px">View on Platform</a>
              </div>
              <p style="color:#94a3b8;font-size:12px;margin-top:20px;text-align:center">SDET — Guiding Students Towards Confidence, Knowledge & Success</p>
            </div>
          </div>`
        );
      }

      onRefresh();
    } catch (e) {
      alert("Evaluation failed. Please try again.");
    }
    setEvaluating(null);
  };

  const pending = submissions.filter((s) => s.score === null);
  const evaluated = submissions.filter((s) => s.score !== null);

  return (
    <div>
      <h2 style={{ margin: "0 0 8px", fontFamily: "'Playfair Display',serif", color: C.navy, fontSize: 24 }}>Submissions</h2>
      <p style={{ margin: "0 0 28px", color: C.muted, fontSize: 14 }}>{pending.length} pending · {evaluated.length} evaluated</p>

      {pending.length > 0 && (
        <>
          <h3 style={{ color: C.red, fontSize: 15, margin: "0 0 14px", display: "flex", alignItems: "center", gap: 8 }}>
            {icons.alert(16)} Pending Evaluation
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
            {pending.map((sub) => (
              <SubmissionCard key={sub.id} sub={sub} onEvaluate={() => evaluate(sub)} evaluating={evaluating === sub.id} />
            ))}
          </div>
        </>
      )}

      {evaluated.length > 0 && (
        <>
          <h3 style={{ color: C.green, fontSize: 15, margin: "0 0 14px", display: "flex", alignItems: "center", gap: 8 }}>
            {icons.submit(16)} Evaluated
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {evaluated.map((sub) => (
              <SubmissionCard key={sub.id} sub={sub} />
            ))}
          </div>
        </>
      )}

      {submissions.length === 0 && <p style={{ color: C.muted, textAlign: "center", padding: 48 }}>No submissions yet.</p>}
    </div>
  );
}

function SubmissionCard({ sub, onEvaluate, evaluating }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ ...card, padding: 0, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 24px", cursor: "pointer" }} onClick={() => setOpen((v) => !v)}>
        <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#1d4ed8", fontSize: 16 }}>
          {sub.profiles?.full_name?.[0]}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, color: C.text }}>{sub.profiles?.full_name}</div>
          <div style={{ fontSize: 12, color: C.muted }}>{sub.worksheets?.topic} · {new Date(sub.submitted_at).toLocaleDateString()}</div>
        </div>
        {sub.score !== null ? (
          <div style={{ textAlign: "center", padding: "8px 20px", borderRadius: 10, background: sub.score >= 7 ? "#d1fae5" : sub.score >= 5 ? "#fef3c7" : "#fee2e2" }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: sub.score >= 7 ? C.green : sub.score >= 5 ? "#d97706" : C.red }}>{sub.score}/10</div>
          </div>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); onEvaluate && onEvaluate(); }}
            disabled={evaluating}
            style={{ ...btn("primary"), opacity: evaluating ? 0.7 : 1 }}
          >
            {icons.brain(16)}{evaluating ? "Evaluating…" : "AI Evaluate"}
          </button>
        )}
      </div>
      {open && (
        <div style={{ padding: "0 24px 20px", borderTop: `1px solid ${C.border}` }}>
          <div style={{ background: "#f8fafc", borderRadius: 10, padding: 16, fontSize: 14, color: C.text, margin: "16px 0 0", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
            {sub.content}
          </div>
          {sub.feedback && (
            <div style={{ background: "#f0fdf4", border: `1px solid #bbf7d0`, borderRadius: 10, padding: 16, marginTop: 12, fontSize: 14, color: C.text, lineHeight: 1.7 }}>
              <strong style={{ color: C.green }}>AI Feedback:</strong> {sub.feedback}
              {sub.weak_points?.length > 0 && (
                <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {sub.weak_points.map((w) => (
                    <span key={w} style={{ background: "#fee2e2", color: C.red, borderRadius: 6, padding: "3px 12px", fontSize: 12 }}>⚠ {w}</span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── PROGRESS VIEW ────────────────────────────────────────────────────────────
function ProgressView({ students, submissions }) {
  const [aiTips, setAiTips] = useState({});
  const [loading, setLoading] = useState(null);

  const getRecommendation = async (student) => {
    setLoading(student.id);
    const subs = submissions.filter((s) => s.student_id === student.id && s.score !== null);
    const avg = subs.length ? (subs.reduce((a, b) => a + b.score, 0) / subs.length).toFixed(1) : "N/A";
    const wp = [...new Set(subs.flatMap((s) => s.weak_points || []))];
    try {
      const tip = await callClaude(
        `Student: ${student.full_name}. Avg score: ${avg}/10. Weak areas: ${wp.join(", ") || "none identified yet"}. Give a specific 2-sentence study plan to help them improve.`,
        "You are a supportive teacher. Be specific and encouraging. Keep it to 2 sentences."
      );
      setAiTips((t) => ({ ...t, [student.id]: tip }));
    } catch {
      setAiTips((t) => ({ ...t, [student.id]: "Could not generate recommendation. Please try again." }));
    }
    setLoading(null);
  };

  return (
    <div>
      <h2 style={{ margin: "0 0 24px", fontFamily: "'Playfair Display',serif", color: C.navy, fontSize: 24 }}>Student Progress</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {students.map((s) => {
          const subs = submissions.filter((sub) => sub.student_id === s.id);
          const evaluated = subs.filter((sub) => sub.score !== null);
          const avg = evaluated.length ? (evaluated.reduce((a, b) => a + b.score, 0) / evaluated.length).toFixed(1) : null;
          const weakPoints = [...new Set(evaluated.flatMap((sub) => sub.weak_points || []))];
          return (
            <div key={s.id} style={card}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#1d4ed8", fontSize: 18 }}>
                  {s.full_name?.[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 16, color: C.text }}>{s.full_name}</div>
                  <div style={{ fontSize: 12, color: C.muted }}>{s.phone} · {subs.length} submissions · {evaluated.length} evaluated</div>
                </div>
                {avg && (
                  <div style={{ padding: "8px 20px", borderRadius: 10, background: Number(avg) >= 7 ? "#d1fae5" : Number(avg) >= 5 ? "#fef3c7" : "#fee2e2", textAlign: "center" }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: Number(avg) >= 7 ? C.green : Number(avg) >= 5 ? "#d97706" : C.red }}>{avg}/10</div>
                    <div style={{ fontSize: 11, color: C.muted }}>Avg</div>
                  </div>
                )}
              </div>
              {weakPoints.length > 0 && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
                  {weakPoints.map((w) => (
                    <span key={w} style={{ background: "#fee2e2", color: C.red, borderRadius: 6, padding: "3px 12px", fontSize: 12 }}>⚠ {w}</span>
                  ))}
                </div>
              )}
              {aiTips[s.id] && (
                <div style={{ background: "#fffbeb", border: `1px solid #fcd34d`, borderRadius: 10, padding: 14, fontSize: 14, color: C.text, lineHeight: 1.7, marginBottom: 14 }}>
                  <strong style={{ color: "#d97706" }}>✦ AI Recommendation: </strong>{aiTips[s.id]}
                </div>
              )}
              <button
                onClick={() => getRecommendation(s)}
                disabled={loading === s.id}
                style={{ ...btn("outline"), fontSize: 13, opacity: loading === s.id ? 0.7 : 1 }}
              >
                {icons.brain(15)}{loading === s.id ? "Generating…" : "Get AI Study Plan"}
              </button>
            </div>
          );
        })}
        {students.length === 0 && <p style={{ color: C.muted, textAlign: "center", padding: 32 }}>No students have signed up yet.</p>}
      </div>
    </div>
  );
}

// ─── TEACHERS VIEW (Admin only) ───────────────────────────────────────────────
function TeachersView({ profile }) {
  const [teachers, setTeachers] = useState([]);
  useEffect(() => {
    supabase.from("profiles").select("*").in("role", ["teacher", "admin"]).then(({ data }) => setTeachers(data || []));
  }, []);

  const promote = async (uid) => {
    await supabase.from("profiles").update({ role: "teacher", approved: true }).eq("id", uid);
    setTeachers((t) => t.map((x) => x.id === uid ? { ...x, role: "teacher", approved: true } : x));
  };

  return (
    <div>
      <h2 style={{ margin: "0 0 8px", fontFamily: "'Playfair Display',serif", color: C.navy, fontSize: 24 }}>Teachers</h2>
      <p style={{ margin: "0 0 24px", color: C.muted, fontSize: 14 }}>Promote students to teachers and manage faculty.</p>
      <div style={{ ...card, padding: 0 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#f8fafc" }}>
            <tr>{["Name", "Email", "Subject", "Role", "Status"].map((h) => (
              <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase" }}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {teachers.map((t, i) => (
              <tr key={t.id} style={{ borderTop: `1px solid ${C.border}`, background: i % 2 ? "#fafbfc" : "#fff" }}>
                <td style={{ padding: "14px 20px", fontWeight: 700, color: C.text }}>{t.full_name}</td>
                <td style={{ padding: "14px 20px", fontSize: 13, color: C.muted }}>{t.email}</td>
                <td style={{ padding: "14px 20px", fontSize: 13 }}>{t.subject || "—"}</td>
                <td style={{ padding: "14px 20px" }}>
                  <span style={{ background: t.role === "admin" ? "#fef3c7" : "#dbeafe", color: t.role === "admin" ? "#d97706" : "#1d4ed8", padding: "3px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                    {t.role}
                  </span>
                </td>
                <td style={{ padding: "14px 20px" }}>
                  {t.approved
                    ? <span style={{ color: C.green, fontSize: 13 }}>✓ Active</span>
                    : <button onClick={() => promote(t.id)} style={{ ...btn("primary"), padding: "6px 14px", fontSize: 12 }}>Approve</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {teachers.length === 0 && <p style={{ padding: 24, color: C.muted, textAlign: "center" }}>No teachers yet.</p>}
      </div>
    </div>
  );
}

// ─── STUDENT APP ──────────────────────────────────────────────────────────────
function StudentApp({ profile, onRefresh }) {
  const [tab, setTab] = useState("home");
  const [worksheets, setWorksheets] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => { loadStudentData(); }, []);

  const loadStudentData = async () => {
    const [enr, subs] = await Promise.all([
      supabase.from("enrollments").select("*, courses(*)").eq("student_id", profile.id),
      supabase.from("submissions").select("*, worksheets(topic,questions)").eq("student_id", profile.id).order("submitted_at", { ascending: false }),
    ]);
    setEnrollments(enr.data || []);
    setSubmissions(subs.data || []);

    if (enr.data?.length) {
      const courseIds = enr.data.map((e) => e.course_id);
      const { data: wData } = await supabase
        .from("worksheets")
        .select("*")
        .in("course_id", courseIds)
        .eq("shared", true)
        .order("created_at", { ascending: false });
      setWorksheets(wData || []);
    } else {
      setWorksheets([]);
    }
  };

  const logout = () => supabase.auth.signOut();
  const pending = worksheets.filter((w) => !submissions.find((s) => s.worksheet_id === w.id));
  const scoredSubs = submissions.filter((s) => s.score !== null);
  const avgScore = scoredSubs.length
    ? (scoredSubs.reduce((a, b) => a + b.score, 0) / scoredSubs.length).toFixed(1)
    : null;

  const w = useWindowWidth();
  const mob = isMob(w);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Lato',sans-serif", paddingBottom: mob ? 70 : 0 }}>
      <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet" />

      <header style={{ background: C.navy, padding: "0 16px", display: "flex", alignItems: "center", height: 56, gap: 12, position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {icons.logo(24)}
          <span style={{ color: "#f59e0b", fontWeight: 900, fontFamily: "'Playfair Display',serif", fontSize: mob ? 15 : 18 }}>SDET</span>
        </div>
        {!mob && <nav style={{ display: "flex", gap: 4, marginLeft: "auto" }}>
          {[
            { id: "home", label: "Home", icon: icons.home },
            { id: "worksheets", label: "Worksheets", icon: icons.worksheet },
            { id: "submissions", label: "My Work", icon: icons.submit },
          ].map((n) => (
            <button key={n.id} onClick={() => setTab(n.id)}
              style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: tab === n.id ? 700 : 400, background: tab === n.id ? "#f59e0b1a" : "transparent", color: tab === n.id ? "#f59e0b" : "#94a3b8" }}>
              {n.icon(15)} {n.label}
            </button>
          ))}
        </nav>}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
          <div style={{ color: "#e2e8f0", fontSize: 12, fontWeight: 700 }}>{profile.full_name.split(" ")[0]}</div>
          <button onClick={logout} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}>{icons.logout(18)}</button>
        </div>
      </header>

      {/* Mobile bottom tab bar */}
      {mob && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: C.navy, borderTop: "1px solid #ffffff18", display: "flex", zIndex: 20, height: 60 }}>
          {[
            { id: "home", label: "Home", icon: icons.home },
            { id: "worksheets", label: "Worksheets", icon: icons.worksheet },
            { id: "submissions", label: "My Work", icon: icons.submit },
          ].map((n) => (
            <button key={n.id} onClick={() => setTab(n.id)}
              style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 10, fontWeight: tab === n.id ? 700 : 400, background: "transparent", color: tab === n.id ? "#f59e0b" : "#64748b" }}>
              {n.icon(20)} {n.label}
            </button>
          ))}
        </div>
      )}

      <main style={{ maxWidth: 820, margin: "0 auto", padding: mob ? "16px 12px" : 28 }}>
        {tab === "home" && (
          <div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", color: C.navy, margin: "0 0 24px", fontSize: 26 }}>
              Welcome, {profile.full_name.split(" ")[0]}!
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
              {[
                { label: "Courses Enrolled", value: enrollments.length, color: C.navy },
                { label: "Pending Worksheets", value: pending.length, color: C.red },
                { label: "My Avg Score", value: avgScore ? `${avgScore}/10` : "—", color: C.green },
              ].map((s) => (
                <div key={s.label} style={card}>
                  <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>{s.label}</div>
                  <div style={{ fontSize: 30, fontWeight: 900, color: s.color, fontFamily: "'Playfair Display',serif" }}>{s.value}</div>
                </div>
              ))}
            </div>
            {enrollments.length === 0 && (
              <div style={{ background: "#f0f9ff", border: `1px solid #bae6fd`, borderRadius: 12, padding: 16, color: "#0c4a6e", fontSize: 14 }}>
                ℹ️ You're not enrolled in any courses yet. Ask your teacher to check your enrollment, or contact Arun Kumar MN.
              </div>
            )}
            {pending.length > 0 && (
              <div style={{ background: "#fef3c7", border: `1px solid #fcd34d`, borderRadius: 12, padding: 16, color: "#92400e", fontSize: 14, marginTop: 12 }}>
                📋 You have {pending.length} worksheet{pending.length > 1 ? "s" : ""} pending submission!
              </div>
            )}
          </div>
        )}

        {tab === "worksheets" && (
          <StudentWorksheets worksheets={worksheets} submissions={submissions} profile={profile} onRefresh={loadStudentData} />
        )}

        {tab === "submissions" && (
          <div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", color: C.navy, margin: "0 0 24px", fontSize: 24 }}>My Submissions</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {submissions.map((sub) => (
                <div key={sub.id} style={card}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: sub.feedback ? 12 : 0 }}>
                    <div>
                      <div style={{ fontWeight: 700, color: C.text }}>{sub.worksheets?.topic}</div>
                      <div style={{ fontSize: 12, color: C.muted }}>{new Date(sub.submitted_at).toLocaleDateString()}</div>
                    </div>
                    {sub.score !== null ? (
                      <div style={{ padding: "8px 18px", borderRadius: 10, background: sub.score >= 7 ? "#d1fae5" : sub.score >= 5 ? "#fef3c7" : "#fee2e2", textAlign: "center" }}>
                        <div style={{ fontSize: 20, fontWeight: 900, color: sub.score >= 7 ? C.green : sub.score >= 5 ? "#d97706" : C.red }}>{sub.score}/10</div>
                      </div>
                    ) : (
                      <span style={{ color: C.muted, fontSize: 13 }}>Awaiting evaluation</span>
                    )}
                  </div>
                  {sub.feedback && (
                    <div style={{ background: "#f0fdf4", border: `1px solid #bbf7d0`, borderRadius: 10, padding: 14, fontSize: 13, color: C.text, lineHeight: 1.7 }}>
                      <strong style={{ color: C.green }}>Feedback:</strong> {sub.feedback}
                    </div>
                  )}
                </div>
              ))}
              {submissions.length === 0 && <p style={{ color: C.muted, textAlign: "center", padding: 32 }}>No submissions yet.</p>}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// ─── STUDENT WORKSHEETS ───────────────────────────────────────────────────────
function StudentWorksheets({ worksheets, submissions, profile, onRefresh }) {
  const [active, setActive] = useState(null);
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (ws) => {
    if (!answer.trim()) return;
    setSubmitting(true);
    await supabase.from("submissions").insert({
      worksheet_id: ws.id,
      student_id: profile.id,
      content: answer,
    });
    setAnswer("");
    setActive(null);
    setSubmitting(false);
    onRefresh();
  };

  return (
    <div>
      <h2 style={{ fontFamily: "'Playfair Display',serif", color: C.navy, margin: "0 0 24px", fontSize: 24 }}>Worksheets</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {worksheets.map((w) => {
          const submitted = submissions.find((s) => s.worksheet_id === w.id);
          return (
            <div key={w.id} style={card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: active === w.id ? 16 : 0 }}>
                <div>
                  <div style={{ fontWeight: 700, color: C.text, fontSize: 15 }}>{w.topic}</div>
                  <div style={{ fontSize: 12, color: C.muted }}>{w.questions?.length} questions · {new Date(w.created_at).toLocaleDateString()}</div>
                </div>
                {submitted ? (
                  <span style={{ background: "#d1fae5", color: C.green, padding: "4px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>✓ Submitted</span>
                ) : (
                  <button onClick={() => { setActive(active === w.id ? null : w.id); setAnswer(""); }}
                    style={btn(active === w.id ? "outline" : "primary")}>
                    {active === w.id ? "Cancel" : "Open & Answer"}
                  </button>
                )}
              </div>
              {active === w.id && !submitted && (
                <div>
                  <ol style={{ margin: "0 0 16px", padding: "0 0 0 20px", display: "flex", flexDirection: "column", gap: 10 }}>
                    {w.questions?.map((q, i) => (
                      <li key={i} style={{ fontSize: 14, color: C.text, lineHeight: 1.7 }}>{q}</li>
                    ))}
                  </ol>
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your answers here… (label each answer: Q1: … Q2: … etc.)"
                    style={{ ...inp, minHeight: 140, resize: "vertical" }}
                  />
                  <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
                    <button
                      onClick={() => submit(w)}
                      disabled={submitting || !answer.trim()}
                      style={{ ...btn("gold"), opacity: !answer.trim() ? 0.6 : 1 }}
                    >
                      {submitting ? "Submitting…" : "Submit Answers"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {worksheets.length === 0 && (
          <p style={{ color: C.muted, textAlign: "center", padding: 32 }}>No worksheets shared yet. Check back soon!</p>
        )}
      </div>
    </div>
  );
}

// ─── TEACHER PROFILE ──────────────────────────────────────────────────────────
function TeacherProfile({ profile, onRefresh }) {
  const [form, setForm] = useState({
    full_name: profile.full_name || "",
    phone: profile.phone || "",
    subject: profile.subject || "",
    bio: profile.bio || "",
    education: profile.education || "",
    experience: profile.experience || "",
    linkedin: profile.linkedin || "",
    avatar_url: profile.avatar_url || "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(profile.avatar_url || "");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target.result;
      setPreviewUrl(dataUrl);
      set("avatar_url", dataUrl);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const useGooglePhoto = () => {
    const googleAvatar = profile.avatar_url;
    if (googleAvatar) {
      setPreviewUrl(googleAvatar);
      set("avatar_url", googleAvatar);
    }
  };

  const save = async () => {
    setSaving(true);
    await supabase.from("profiles").update({
      full_name: form.full_name,
      phone: form.phone,
      subject: form.subject,
      bio: form.bio,
      education: form.education,
      experience: form.experience,
      linkedin: form.linkedin,
      avatar_url: form.avatar_url,
    }).eq("id", profile.id);
    setSaving(false);
    setSaved(true);
    onRefresh();
    setTimeout(() => setSaved(false), 3000);
  };

  const fields = [
    { key: "full_name", label: "Full Name", placeholder: "e.g. Arun Kumar MN", type: "text" },
    { key: "phone", label: "Phone Number", placeholder: "e.g. +91 98765 43210", type: "text" },
    { key: "subject", label: "Subject Specialization", placeholder: "e.g. Physics, Mathematics", type: "text" },
    { key: "experience", label: "Years of Experience", placeholder: "e.g. 8 years", type: "text" },
    { key: "education", label: "Education Qualifications", placeholder: "e.g. M.Sc Physics, B.Ed from Bangalore University", type: "textarea" },
    { key: "bio", label: "About Me / Bio", placeholder: "Tell students about yourself, your teaching style, achievements…", type: "textarea" },
    { key: "linkedin", label: "LinkedIn Profile URL (Optional)", placeholder: "https://linkedin.com/in/yourname", type: "text" },
  ];

  return (
    <div style={{ maxWidth: 720 }}>
      <h2 style={{ margin: "0 0 8px", fontFamily: "'Playfair Display',serif", color: C.navy, fontSize: 26 }}>My Profile</h2>
      <p style={{ margin: "0 0 28px", color: C.muted, fontSize: 14 }}>Update your profile details. Students and admins can see this information.</p>

      <div style={{ ...card, marginBottom: 20, display: "flex", alignItems: "center", gap: 24 }}>
        <div style={{ position: "relative", flexShrink: 0 }}>
          {previewUrl ? (
            <img src={previewUrl} alt="Profile" style={{ width: 90, height: 90, borderRadius: "50%", objectFit: "cover", border: `3px solid ${C.gold}` }} />
          ) : (
            <div style={{ width: 90, height: 90, borderRadius: "50%", background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 700, color: "#1d4ed8", border: `3px solid ${C.gold}` }}>
              {profile.full_name?.[0]}
            </div>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, color: C.text, marginBottom: 6 }}>Profile Photo</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <label style={{ ...btn("primary"), padding: "8px 16px", fontSize: 13, cursor: "pointer" }}>
              {uploading ? "Uploading…" : "📁 Upload Photo"}
              <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: "none" }} />
            </label>
            <button onClick={useGooglePhoto} style={{ ...btn("outline"), padding: "8px 16px", fontSize: 13 }}>
              {icons.google(14)} Use Google Photo
            </button>
          </div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 8 }}>Upload a clear photo or use your Google account photo.</div>
        </div>
      </div>

      <div style={{ ...card, display: "flex", flexDirection: "column", gap: 20 }}>
        {fields.map((f) => (
          <div key={f.key}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 8 }}>{f.label}</label>
            {f.type === "textarea" ? (
              <textarea
                value={form[f.key]}
                onChange={(e) => set(f.key, e.target.value)}
                placeholder={f.placeholder}
                rows={3}
                style={{ ...inp, resize: "vertical" }}
              />
            ) : (
              <input
                type={f.type}
                value={form[f.key]}
                onChange={(e) => set(f.key, e.target.value)}
                placeholder={f.placeholder}
                style={inp}
              />
            )}
          </div>
        ))}

        <div style={{ display: "flex", alignItems: "center", gap: 16, paddingTop: 8, borderTop: `1px solid ${C.border}` }}>
          <button onClick={save} disabled={saving} style={{ ...btn("gold"), opacity: saving ? 0.7 : 1 }}>
            {saving ? "Saving…" : "💾 Save Profile"}
          </button>
          {saved && (
            <span style={{ color: C.green, fontWeight: 700, fontSize: 14 }}>✓ Profile saved successfully!</span>
          )}
        </div>
      </div>

      <div style={{ ...card, marginTop: 20, background: "linear-gradient(135deg,#1a2744 0%,#0f3460 100%)", border: "none" }}>
        <div style={{ color: "#f59e0b", fontWeight: 700, fontSize: 14, marginBottom: 16 }}>👁 How students see your profile</div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
          {previewUrl ? (
            <img src={previewUrl} alt="Profile" style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", border: "2px solid #f59e0b" }} />
          ) : (
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700, color: "#1d4ed8" }}>
              {profile.full_name?.[0]}
            </div>
          )}
          <div>
            <div style={{ color: "#f0f9ff", fontWeight: 700, fontSize: 18 }}>{form.full_name || profile.full_name}</div>
            <div style={{ color: "#94a3b8", fontSize: 13 }}>{form.subject || "Subject not set"} · {form.experience || "Experience not set"}</div>
          </div>
        </div>
        {form.education && <div style={{ color: "#cbd5e1", fontSize: 13, marginBottom: 8 }}>🎓 {form.education}</div>}
        {form.bio && <div style={{ color: "#cbd5e1", fontSize: 13, lineHeight: 1.7 }}>{form.bio}</div>}
        {form.linkedin && <div style={{ marginTop: 10 }}><a href={form.linkedin} target="_blank" rel="noreferrer" style={{ color: "#60a5fa", fontSize: 13 }}>🔗 LinkedIn Profile</a></div>}
      </div>
    </div>
  );
}
