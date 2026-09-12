"use client";

import { useState } from "react";

type Section = "Overview" | "Transactions" | "Brokers" | "Customers" | "Compliance" | "Reports";

const transactions = [
  ["HW-28491", "Ahmad Al-Khatib", "Jordan → Egypt", "1,240", "Cleared", "2 min ago"],
  ["HW-28490", "Samira Khalil", "Jordan → Pakistan", "4,850", "Review", "13 min ago"],
  ["HW-28489", "Mohammad Saleh", "Jordan → Philippines", "680", "Cleared", "46 min ago"],
  ["HW-28488", "Rana Odeh", "Jordan → Morocco", "2,100", "Review", "1 hr ago"],
];

const nav: { id: Section; icon: string; label: string }[] = [
  { id: "Overview", icon: "⌂", label: "Overview" }, { id: "Transactions", icon: "↗", label: "Transactions" },
  { id: "Brokers", icon: "⌁", label: "Brokers" }, { id: "Customers", icon: "◎", label: "Customers" },
  { id: "Compliance", icon: "◈", label: "Compliance" }, { id: "Reports", icon: "▤", label: "Reports" },
];

const copy = {
  EN: { overview: "Overview", hello: "Good morning, Yousef", intro: "Your remittance network is ready for review.", pilot: "Jordan pilot", active: "Active pilot", transfer: "Record transfer", attention: "Needs attention", allClear: "Everything else is on track", volume: "7-day processed volume", formalized: "formalized this week", openCases: "Open compliance cases", clearance: "Average clearance", network: "Network health", view: "View all", recent: "Recent transfers", transferSub: "Live activity across your registered corridors", status: "Status", corridor: "Corridor", sender: "Sender", amount: "Amount", time: "Time", screening: "Screening coverage", brokers: "Registered brokers", liquidity: "Network liquidity", regulator: "Regulator connection", simulated: "Simulated", connected: "Connected", demo: "Demo environment · Synthetic data · No funds move" },
  AR: { overview: "نظرة عامة", hello: "صباح الخير، يوسف", intro: "شبكة التحويلات جاهزة للمراجعة.", pilot: "التجربة الأردنية", active: "التجربة نشطة", transfer: "تسجيل تحويل", attention: "يتطلب الانتباه", allClear: "كل شيء آخر يسير كما هو مخطط", volume: "حجم المعاملات خلال ٧ أيام", formalized: "تم تسجيله هذا الأسبوع", openCases: "حالات الامتثال المفتوحة", clearance: "متوسط زمن المعالجة", network: "صحة الشبكة", view: "عرض الكل", recent: "التحويلات الأخيرة", transferSub: "النشاط الحالي عبر الممرات المسجلة", status: "الحالة", corridor: "الممر", sender: "المرسل", amount: "المبلغ", time: "الوقت", screening: "تغطية الفحص", brokers: "الوكلاء المسجلون", liquidity: "سيولة الشبكة", regulator: "الربط الرقابي", simulated: "محاكى", connected: "متصل", demo: "بيئة تجريبية · بيانات اصطناعية · لا يتم نقل أموال" },
} as const;

export default function Home() {
  const [section, setSection] = useState<Section>("Overview");
  const [language, setLanguage] = useState<"EN" | "AR">("EN");
  const [showTransfer, setShowTransfer] = useState(false);
  const t = copy[language]; const rtl = language === "AR";
  const navLabel = (id: Section) => rtl ? ({ Overview: "نظرة عامة", Transactions: "المعاملات", Brokers: "الوكلاء", Customers: "العملاء", Compliance: "الامتثال", Reports: "التقارير" }[id]) : id;

  return <main className="product-shell" dir={rtl ? "rtl" : "ltr"}>
    <aside className="product-sidebar">
      <div className="product-brand"><div className="brand-symbol">↗</div><div><strong>HAWALA</strong><span>COMPLIANCE OS</span></div></div>
      <div className="workspace-label">WORKSPACE</div>
      <nav className="product-nav" aria-label="Primary navigation">{nav.map((item) => <button key={item.id} onClick={() => setSection(item.id)} className={section === item.id ? "active" : ""}><i>{item.icon}</i><span>{navLabel(item.id)}</span>{item.id === "Compliance" && <b>3</b>}</button>)}</nav>
      <div className="sidebar-spacer" />
      <div className="pilot-status"><div className="status-line"><span className="live-dot" />{t.active}</div><strong>{t.pilot}</strong><small>CBJ / EXC-2026-041</small><div className="progress-track"><span /></div><small>62% of pilot gates complete</small></div>
      <button className="sidebar-settings">⚙ <span>{rtl ? "الإعدادات" : "Settings"}</span></button>
      <div className="profile"><div className="profile-avatar">YK</div><div><strong>Yousef Khoury</strong><small>{rtl ? "مسؤول الامتثال" : "Compliance officer"}</small></div><span>•••</span></div>
    </aside>
    <section className="product-main">
      <header className="product-header"><div className="breadcrumb"><span>HAWALA</span><b>/</b><strong>{navLabel(section)}</strong></div><div className="header-actions"><label className="global-search">⌕ <input placeholder={rtl ? "ابحث في الشبكة" : "Search the network"} /></label><button className="icon-button" aria-label="Notifications">♢<em /></button><button className="lang-button" onClick={() => setLanguage(language === "EN" ? "AR" : "EN")}>{language === "EN" ? "عربي" : "EN"}</button><div className="header-avatar">YK</div></div></header>
      <div className="product-content">
        <div className="demo-strip"><span className="demo-dot" />{t.demo}<button onClick={() => setSection("Reports")}>{rtl ? "تفاصيل البيئة" : "Environment details"} →</button></div>
        <div className="page-intro"><div><p className="overline">WEDNESDAY, 29 JULY 2026 <span className="intro-divider" /> AMMAN</p><h1>{section === "Overview" ? t.hello : navLabel(section)}</h1><p>{section === "Overview" ? t.intro : (rtl ? "راجع وراقب نشاط الشبكة من هذه المساحة." : "Review and manage activity across your network.")}</p></div><button className="primary-action" onClick={() => setShowTransfer(true)}><span>＋</span>{t.transfer}</button></div>
        {section === "Overview" ? <>
          <div className="metric-grid"><article className="metric-card featured"><div className="metric-top"><span>{t.volume}</span><span className="metric-icon">↗</span></div><strong>JOD 18,420</strong><div className="metric-foot"><span className="trend-up">↗ 12.8%</span><small>{t.formalized}</small></div><div className="mini-bars">{[36,52,42,68,58,76,92,71,86,100].map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}</div></article><article className="metric-card"><div className="metric-top"><span>{t.openCases}</span><span className="metric-icon amber">!</span></div><strong>03</strong><div className="metric-foot"><span className="trend-warn">2 high priority</span><small>oldest 18 min</small></div><div className="metric-ring"><span>94%</span><small>screened</small></div></article><article className="metric-card"><div className="metric-top"><span>{t.clearance}</span><span className="metric-icon blue">◷</span></div><strong>2m 14s</strong><div className="metric-foot"><span className="trend-up">↘ 8.4%</span><small>vs last week</small></div><div className="metric-spark"><svg viewBox="0 0 120 42" preserveAspectRatio="none"><path d="M0 35 C20 31, 24 19, 40 24 S55 31, 72 15 S94 20, 120 5" /></svg></div></article><article className="metric-card"><div className="metric-top"><span>{t.network}</span><span className="metric-icon green">✓</span></div><strong>98.7%</strong><div className="metric-foot"><span className="trend-up">All systems normal</span><small>last check 09:42</small></div><div className="health-pill"><i />{t.connected}</div></article></div>
          <div className="section-grid"><section className="surface activity-surface"><div className="surface-heading"><div><h2>{t.recent}</h2><p>{t.transferSub}</p></div><button className="text-button" onClick={() => setSection("Transactions")}>{t.view} ↗</button></div><div className="table-scroll"><table><thead><tr><th>{t.sender}</th><th>{t.corridor}</th><th>{t.amount}</th><th>{t.time}</th><th>{t.status}</th><th /></tr></thead><tbody>{transactions.map((row) => <tr key={row[0]}><td><div className="person-cell"><span className={`person-avatar tone-${row[0].slice(-1)}`}>{row[1].split(" ").map((x) => x[0]).join("").slice(0, 2)}</span><div><strong>{row[1]}</strong><small>{row[0]}</small></div></div></td><td>{row[2]}</td><td><strong>JOD {row[3]}</strong></td><td className="muted-cell">{row[5]}</td><td><span className={`status-chip ${row[4] === "Review" ? "review" : "cleared"}`}><i />{row[4]}</span></td><td><button className="row-action">→</button></td></tr>)}</tbody></table></div></section><aside className="side-stack"><section className="surface attention-card"><div className="surface-heading"><div><h2>{t.attention}</h2><p>Prioritized for you</p></div><span className="count-badge">3</span></div><div className="attention-item high"><span>!</span><div><strong>High-risk transfer</strong><small>Samira Khalil · JOD 4,850</small></div><button onClick={() => setSection("Compliance")}>Review</button></div><div className="attention-item"><span>◷</span><div><strong>Permit expiring soon</strong><small>Customer C-1842 · 6 days</small></div><button onClick={() => setSection("Customers")}>Open</button></div><div className="attention-item"><span>↗</span><div><strong>Settlement ready</strong><small>4 broker positions validated</small></div><button onClick={() => setSection("Brokers")}>Settle</button></div><div className="attention-footer"><span className="live-dot" />{t.allClear}</div></section><section className="surface coverage-card"><div className="surface-heading"><div><h2>{t.screening}</h2><p>Last 24 hours</p></div><span className="coverage-value">99.2%</span></div><div className="coverage-bar"><span /></div><div className="coverage-legend"><span><i className="dot-green" />Sanctions</span><span><i className="dot-blue" />PEP</span><span><i className="dot-amber" />Behavioral</span></div></section></aside></div>
        </> : <section className="surface section-placeholder"><div className="placeholder-icon">{nav.find((x) => x.id === section)?.icon}</div><h2>{navLabel(section)} workspace</h2><p>{rtl ? "هذا القسم جاهز للعرض في النسخة التجريبية." : "This workspace is ready for your festival walkthrough."}</p><button className="primary-action" onClick={() => setSection("Overview")}>← {t.overview}</button></section>}
      </div>
    </section>
    {showTransfer && <div className="modal-layer" onClick={() => setShowTransfer(false)}><div className="transfer-modal" onClick={(e) => e.stopPropagation()}><div className="modal-top"><div><p className="overline">NEW RECORD</p><h2>{t.transfer}</h2></div><button onClick={() => setShowTransfer(false)}>×</button></div><div className="modal-form"><label>Customer<input placeholder="Search verified customer" /></label><label>Destination<select><option>Egypt · Cairo</option><option>Pakistan · Lahore</option><option>Philippines · Manila</option></select></label><label>Amount (JOD)<input placeholder="0.00" /></label><div className="screening-callout"><span>✓</span><div><strong>Automated screening ready</strong><small>Sanctions, PEP, and behavioral checks run on record.</small></div></div><button className="primary-action full" onClick={() => setShowTransfer(false)}>Screen and record transfer</button></div></div></div>}
  </main>;
}
