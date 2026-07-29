"use client";

import { type CSSProperties, FormEvent, useEffect, useMemo, useState } from "react";

type Transaction = {
  id: string;
  customer: string;
  initials: string;
  corridor: string;
  amount: string;
  time: string;
  risk: "Low" | "Medium" | "High";
  status: "Cleared" | "Review";
  tone: string;
};

type StoredTransfer = {
  reference: string;
  customerName: string;
  customerInitials: string;
  destination: string;
  amountJod: number;
  risk: "Low" | "Medium" | "High";
  status: "Cleared" | "Review";
  createdAt: string;
};

type Customer = {
  reference: string;
  fullName: string;
  nationality: string;
  idType: "National ID" | "Passport" | "Residence permit";
  idNumberLast4: string;
  verificationStatus: "Verified" | "Pending review";
  risk: "Low" | "Medium" | "High";
  createdAt: string;
};

type ComplianceCase = {
  reference: string;
  transferReference: string;
  customerName: string;
  caseType: string;
  severity: "Low" | "Medium" | "High";
  status: "Open" | "Cleared" | "Escalated";
  riskScore: number;
  reasons: string;
  note: string;
  assignedToEmail: string;
  createdAt: string;
};

const seededTransactions: Transaction[] = [
  {
    id: "HW-28491",
    customer: "Ahmad Al-Khatib",
    initials: "AK",
    corridor: "Jordan → Egypt",
    amount: "JOD 1,240",
    time: "10:42 AM",
    risk: "Low",
    status: "Cleared",
    tone: "sage",
  },
  {
    id: "HW-28490",
    customer: "Samira Khalil",
    initials: "SK",
    corridor: "Jordan → Pakistan",
    amount: "JOD 4,850",
    time: "10:31 AM",
    risk: "High",
    status: "Review",
    tone: "rose",
  },
  {
    id: "HW-28489",
    customer: "Mohammad Saleh",
    initials: "MS",
    corridor: "Jordan → Philippines",
    amount: "JOD 680",
    time: "9:58 AM",
    risk: "Low",
    status: "Cleared",
    tone: "blue",
  },
  {
    id: "HW-28488",
    customer: "Rana Odeh",
    initials: "RO",
    corridor: "Jordan → Morocco",
    amount: "JOD 2,100",
    time: "9:44 AM",
    risk: "Medium",
    status: "Review",
    tone: "amber",
  },
];

const nav = ["Overview", "Transactions", "Brokers", "Customers", "Compliance", "Reports"];

const translations = {
  EN: {
    search: "Search people or transactions", settings: "Settings", officer: "Compliance officer",
    nav: { Overview: "Overview", Transactions: "Transactions", Brokers: "Brokers", Customers: "Customers", Compliance: "Compliance", Reports: "Reports" },
    welcome: {
      Overview: ["WEDNESDAY, 29 JULY", "Good morning, Yousef.", "Here’s what needs your attention across your network."],
      Transactions: ["SECURE TRANSFER LEDGER", "Transactions", "Search, filter, and review every recorded transfer."],
      Brokers: ["TRUSTED BROKER NETWORK", "Broker settlement", "Monitor registered brokers, liquidity, and net corridor obligations."],
      Customers: ["CUSTOMER DUE DILIGENCE", "Customer records", "Onboard customers and monitor identity-verification status."],
      Compliance: ["AML CASE MANAGEMENT", "Compliance review", "Investigate alerts, document reasoning, and record accountable decisions."],
      Reports: ["REGULATORY INTELLIGENCE", "Reporting center", "Monitor remittance exposure and prepare regulator-ready evidence."],
      Settings: ["PLATFORM ADMINISTRATION", "Compliance settings", "Configure screening policy, access controls, and regulatory integrations."],
    },
  },
  AR: {
    search: "ابحث عن أشخاص أو معاملات", settings: "الإعدادات", officer: "مسؤول الامتثال",
    nav: { Overview: "نظرة عامة", Transactions: "المعاملات", Brokers: "الوكلاء", Customers: "العملاء", Compliance: "الامتثال", Reports: "التقارير" },
    welcome: {
      Overview: ["الأربعاء، 29 يوليو", "صباح الخير، يوسف.", "إليك ما يحتاج إلى اهتمامك عبر الشبكة."],
      Transactions: ["سجل التحويلات الآمن", "المعاملات", "ابحث وصفِّ وراجع كل تحويل مسجل."],
      Brokers: ["شبكة الوكلاء الموثوقة", "تسوية الوكلاء", "راقب الوكلاء المسجلين والسيولة والالتزامات."],
      Customers: ["العناية الواجبة بالعملاء", "سجلات العملاء", "سجّل العملاء وتابع حالة التحقق من الهوية."],
      Compliance: ["إدارة حالات مكافحة غسل الأموال", "مراجعة الامتثال", "حقق في التنبيهات ووثّق القرارات المسؤولة."],
      Reports: ["المعلومات الرقابية", "مركز التقارير", "راقب التحويلات وجهّز الأدلة الرقابية."],
      Settings: ["إدارة المنصة", "إعدادات الامتثال", "اضبط سياسات الفحص والصلاحيات والتكامل الرقابي."],
    },
  },
  UR: {
    search: "افراد یا لین دین تلاش کریں", settings: "ترتیبات", officer: "کمپلائنس افسر",
    nav: { Overview: "جائزہ", Transactions: "لین دین", Brokers: "بروکرز", Customers: "صارفین", Compliance: "تعمیل", Reports: "رپورٹس" },
    welcome: {
      Overview: ["بدھ، 29 جولائی", "صبح بخیر، یوسف۔", "آپ کے نیٹ ورک میں توجہ طلب امور یہاں ہیں۔"],
      Transactions: ["محفوظ ترسیلی لیجر", "لین دین", "ہر درج شدہ ترسیل تلاش، فلٹر اور جانچیں۔"],
      Brokers: ["قابل اعتماد بروکر نیٹ ورک", "بروکر سیٹلمنٹ", "رجسٹرڈ بروکرز، لیکویڈیٹی اور واجبات دیکھیں۔"],
      Customers: ["صارف کی مکمل جانچ", "صارف ریکارڈز", "صارفین شامل کریں اور شناختی تصدیق دیکھیں۔"],
      Compliance: ["اے ایم ایل کیس مینجمنٹ", "تعمیل کا جائزہ", "الرٹس کی تحقیق اور فیصلوں کی دستاویز بندی کریں۔"],
      Reports: ["ریگولیٹری انٹیلیجنس", "رپورٹنگ سینٹر", "ترسیلات کی نگرانی اور ریگولیٹری ثبوت تیار کریں۔"],
      Settings: ["پلیٹ فارم انتظام", "تعمیل کی ترتیبات", "اسکریننگ، رسائی اور ریگولیٹری رابطے ترتیب دیں۔"],
    },
  },
  TL: {
    search: "Maghanap ng tao o transaksyon", settings: "Mga setting", officer: "Opisyal ng compliance",
    nav: { Overview: "Pangkalahatan", Transactions: "Mga transaksyon", Brokers: "Mga broker", Customers: "Mga customer", Compliance: "Compliance", Reports: "Mga ulat" },
    welcome: {
      Overview: ["MIYERKULES, HULYO 29", "Magandang umaga, Yousef.", "Narito ang mga kailangang tutukan sa iyong network."],
      Transactions: ["LIGTAS NA TRANSFER LEDGER", "Mga transaksyon", "Hanapin, salain, at suriin ang bawat transfer."],
      Brokers: ["PINAGKAKATIWALAANG BROKER NETWORK", "Broker settlement", "Subaybayan ang mga broker, liquidity, at obligasyon."],
      Customers: ["PAGSUSURI NG CUSTOMER", "Mga rekord ng customer", "Mag-onboard at subaybayan ang identity verification."],
      Compliance: ["PAMAMAHALA NG AML CASE", "Pagsusuri sa compliance", "Imbestigahan ang alert at idokumento ang desisyon."],
      Reports: ["REGULATORY INTELLIGENCE", "Sentro ng pag-uulat", "Subaybayan ang remittance at ihanda ang ebidensya."],
      Settings: ["PANGANGASIWA NG PLATFORM", "Mga setting ng compliance", "I-configure ang screening, access, at integrations."],
    },
  },
} as const;

type Language = keyof typeof translations;

const brokers = [
  { name: "Al Noor Exchange", city: "Amman", code: "BR-JO-014", corridor: "Egypt", balance: 18420, position: 3260, status: "Active", initials: "AN" },
  { name: "Cairo Trust Remit", city: "Cairo", code: "BR-EG-032", corridor: "Jordan", balance: 12780, position: -3260, status: "Active", initials: "CT" },
  { name: "PakLink Services", city: "Lahore", code: "BR-PK-008", corridor: "Jordan", balance: 24400, position: -4850, status: "Active", initials: "PS" },
  { name: "Bayan Remittance", city: "Amman", code: "BR-JO-021", corridor: "Philippines", balance: 9650, position: 680, status: "Review", initials: "BR" },
];

function toDashboardTransaction(transfer: StoredTransfer): Transaction {
  return {
    id: transfer.reference,
    customer: transfer.customerName,
    initials: transfer.customerInitials,
    corridor: `Jordan → ${transfer.destination}`,
    amount: `JOD ${transfer.amountJod.toLocaleString("en-US")}`,
    time: new Date(transfer.createdAt).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }),
    risk: transfer.risk,
    status: transfer.status,
    tone: transfer.risk === "High" ? "rose" : transfer.risk === "Medium" ? "amber" : "sage",
  };
}

export default function Home() {
  const [active, setActive] = useState("Overview");
  const [language, setLanguage] = useState<Language>("EN");
  const [showTransfer, setShowTransfer] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showStr, setShowStr] = useState(false);
  const [strSubmitted, setStrSubmitted] = useState(false);
  const [showCustomer, setShowCustomer] = useState(false);
  const [created, setCreated] = useState(false);
  const [customerCreated, setCustomerCreated] = useState(false);
  const [query, setQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [settlementRun, setSettlementRun] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [screeningRules, setScreeningRules] = useState({
    sanctions: true,
    pep: true,
    adverseMedia: false,
    velocity: true,
  });
  const [transactions, setTransactions] = useState<Transaction[]>(seededTransactions);
  const [ledgerMessage, setLedgerMessage] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [cases, setCases] = useState<ComplianceCase[]>([]);
  const [selectedCaseReference, setSelectedCaseReference] = useState("");
  const [caseNote, setCaseNote] = useState("");

  useEffect(() => {
    async function loadTransfers() {
      try {
        const response = await fetch("/api/transfers");
        const payload = (await response.json()) as { transfers?: StoredTransfer[]; error?: string };
        if (!response.ok) throw new Error(payload.error || "Unable to load transfer ledger.");
        setTransactions((payload.transfers || []).map(toDashboardTransaction));
      } catch {
        setLedgerMessage("Demo data is displayed while the secure ledger is initializing.");
      }
    }
    void loadTransfers();
  }, []);

  useEffect(() => {
    async function loadCases() {
      try {
        const response = await fetch("/api/cases");
        const payload = (await response.json()) as { cases?: ComplianceCase[] };
        if (response.ok) {
          const loadedCases = payload.cases || [];
          setCases(loadedCases);
          setSelectedCaseReference((current) => current || loadedCases[0]?.reference || "");
        }
      } catch {
        // The compliance workspace remains available while reconnecting.
      }
    }
    void loadCases();
  }, []);

  const selectedCase = cases.find((item) => item.reference === selectedCaseReference) || cases[0];
  const ui = translations[language];
  const localizedWelcome = ui.welcome[active as keyof typeof ui.welcome] || ui.welcome.Overview;

  const reportVolume = useMemo(
    () => transactions.reduce((total, item) => total + Number(item.amount.replace(/[^0-9]/g, "")), 0),
    [transactions],
  );
  const corridorSummary = useMemo(() => {
    const totals = new Map<string, { count: number; volume: number }>();
    transactions.forEach((item) => {
      const current = totals.get(item.corridor) || { count: 0, volume: 0 };
      current.count += 1;
      current.volume += Number(item.amount.replace(/[^0-9]/g, ""));
      totals.set(item.corridor, current);
    });
    return Array.from(totals, ([corridor, values]) => ({ corridor, ...values })).sort((a, b) => b.volume - a.volume);
  }, [transactions]);

  useEffect(() => {
    async function loadCustomers() {
      try {
        const response = await fetch("/api/customers");
        const payload = (await response.json()) as { customers?: Customer[] };
        if (response.ok) setCustomers(payload.customers || []);
      } catch {
        // The Customers screen remains available while the service reconnects.
      }
    }
    void loadCustomers();
  }, []);

  const filtered = useMemo(
    () =>
      transactions.filter((item) =>
        `${item.customer} ${item.id} ${item.corridor}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [query, transactions],
  );
  const ledgerFiltered = useMemo(
    () => filtered.filter((item) =>
      (riskFilter === "All" || item.risk === riskFilter) &&
      (statusFilter === "All" || item.status === statusFilter),
    ),
    [filtered, riskFilter, statusFilter],
  );

  async function submitTransfer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const customer = String(formData.get("sender") || "New customer");
    const destination = String(formData.get("destination") || "Egypt");
    const amount = Number(formData.get("amount") || 0);
    const purpose = String(formData.get("purpose") || "Family support");

    try {
      const response = await fetch("/api/transfers", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ customerName: customer, destination, amountJod: amount, purpose }),
      });
      const payload = (await response.json()) as { transfer?: StoredTransfer; error?: string };
      if (!response.ok || !payload.transfer) throw new Error(payload.error || "Unable to record the transfer.");

      setTransactions((currentTransactions) => [toDashboardTransaction(payload.transfer!), ...currentTransactions]);
      setLedgerMessage("");
      setCreated(true);
    } catch (error) {
      setLedgerMessage(error instanceof Error ? error.message : "Unable to record the transfer.");
    }
    window.setTimeout(() => {
      setCreated(false);
      setShowTransfer(false);
    }, 1800);
  }

  async function submitCustomer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/customers", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fullName: String(formData.get("fullName") || ""),
          nationality: String(formData.get("nationality") || ""),
          idType: String(formData.get("idType") || "National ID"),
          idNumber: String(formData.get("idNumber") || ""),
        }),
      });
      const payload = (await response.json()) as { customer?: Customer; error?: string };
      if (!response.ok || !payload.customer) throw new Error(payload.error || "Unable to onboard customer.");
      setCustomers((current) => [payload.customer!, ...current]);
      setCustomerCreated(true);
      window.setTimeout(() => {
        setCustomerCreated(false);
        setShowCustomer(false);
      }, 1600);
    } catch (error) {
      setLedgerMessage(error instanceof Error ? error.message : "Unable to onboard customer.");
      setShowCustomer(false);
    }
  }

  async function decideCase(status: "Cleared" | "Escalated") {
    if (!selectedCase || !caseNote.trim()) {
      setLedgerMessage("Add a review note before deciding the case.");
      return;
    }
    try {
      const response = await fetch("/api/cases", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ reference: selectedCase.reference, status, note: caseNote }),
      });
      const payload = (await response.json()) as { case?: ComplianceCase; error?: string };
      if (!response.ok || !payload.case) throw new Error(payload.error || "Unable to update case.");
      setCases((current) => current.map((item) => item.reference === payload.case!.reference ? payload.case! : item));
      setCaseNote("");
      setLedgerMessage("");
    } catch (error) {
      setLedgerMessage(error instanceof Error ? error.message : "Unable to update case.");
    }
  }

  function exportRegulatoryCsv() {
    const escapeCell = (value: string) => `"${value.replace(/"/g, '""')}"`;
    const rows = [
      ["Transaction reference", "Customer", "Corridor", "Amount", "Risk", "Status"],
      ...transactions.map((item) => [item.id, item.customer, item.corridor, item.amount, item.risk, item.status]),
    ];
    const csv = rows.map((row) => row.map((cell) => escapeCell(String(cell))).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "hawala-regulatory-transactions.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="app-shell" dir={language === "AR" || language === "UR" ? "rtl" : "ltr"}>
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">
            <span />
            <span />
          </div>
          <div>
            <strong>HAWALA</strong>
            <small>COMPLIANCE OS</small>
          </div>
        </div>

        <nav aria-label="Primary navigation">
          {nav.map((item, index) => (
            <button
              className={active === item ? "nav-item active" : "nav-item"}
              key={item}
              onClick={() => setActive(item)}
            >
              <span className="nav-icon" aria-hidden="true">
                {["⌂", "⇄", "◉", "◎", "◇", "▤"][index]}
              </span>
              {ui.nav[item as keyof typeof ui.nav]}
              {item === "Compliance" && <em>3</em>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="license-card">
            <span className="shield">✓</span>
            <div>
              <strong>License active</strong>
              <small>CBJ / EXC-2026-041</small>
            </div>
          </div>
          <button className={active === "Settings" ? "nav-item settings active" : "nav-item settings"} onClick={() => setActive("Settings")}>
            <span className="nav-icon">⚙</span> {ui.settings}
          </button>
          <div className="user-card">
            <div className="avatar dark">YK</div>
            <div>
              <strong>Yousef Khoury</strong>
              <small>{ui.officer}</small>
            </div>
            <span>⌄</span>
          </div>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div className="mobile-brand">HAWALA</div>
          <label className="search">
            <span>⌕</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={ui.search}
              aria-label={ui.search}
            />
            <kbd>⌘ K</kbd>
          </label>
          <div className="top-actions">
            <select className="language" value={language} onChange={(event) => setLanguage(event.target.value as Language)} aria-label="Change language">
              <option value="EN">English</option>
              <option value="AR">العربية</option>
              <option value="UR">اردو</option>
              <option value="TL">Tagalog</option>
            </select>
            <button className="notification" aria-label="Notifications">
              ♢<span />
            </button>
          </div>
        </header>

        <div className="content">
          <div className="welcome">
            <div>
              <p className="eyebrow">{localizedWelcome[0]}</p>
              <h1>{localizedWelcome[1]}</h1>
              <p>{localizedWelcome[2]}</p>
            </div>
            {active !== "Compliance" && active !== "Brokers" && active !== "Settings" && <button className="primary" onClick={() => active === "Reports" ? exportRegulatoryCsv() : active === "Customers" ? setShowCustomer(true) : setShowTransfer(true)}>
              <span>{active === "Reports" ? "↓" : "＋"}</span> {active === "Reports" ? "Export CSV" : active === "Customers" ? "Add customer" : "New transfer"}
            </button>}
          </div>

          {ledgerMessage && <div className="ledger-message" role="status">{ledgerMessage}</div>}

          {active === "Settings" ? (
            <section className="settings-workspace">
              {settingsSaved && <div className="settings-success" role="status">✓ Configuration saved and added to the audit trail.</div>}
              <div className="settings-grid">
                <article className="panel settings-card">
                  <div className="panel-heading"><div><h2>Automated screening</h2><p>Controls applied to every transfer in real time</p></div><span className="settings-badge">Policy v3.4</span></div>
                  <div className="setting-list">
                    {[
                      ["sanctions", "Sanctions screening", "UN, OFAC, EU, and UK consolidated lists"],
                      ["pep", "PEP screening", "Politically exposed persons and close associates"],
                      ["adverseMedia", "Adverse media", "Negative-news signals from approved providers"],
                      ["velocity", "Velocity monitoring", "Detect structuring and unusual transaction bursts"],
                    ].map(([key, title, description]) => (
                      <div className="setting-row" key={key}>
                        <div><strong>{title}</strong><span>{description}</span></div>
                        <button className={screeningRules[key as keyof typeof screeningRules] ? "toggle on" : "toggle"} aria-label={`Toggle ${title}`} aria-pressed={screeningRules[key as keyof typeof screeningRules]} onClick={() => setScreeningRules((current) => ({ ...current, [key]: !current[key as keyof typeof current] }))}><i /></button>
                      </div>
                    ))}
                  </div>
                </article>
                <article className="panel settings-card">
                  <div className="panel-heading"><div><h2>Regulatory connection</h2><p>Supervisory reporting destination</p></div><span className="connection-live">● Connected</span></div>
                  <div className="regulator-profile"><span className="shield">✓</span><div><strong>Central Bank of Jordan</strong><small>Regulatory sandbox · EXC-2026-041</small></div></div>
                  <dl className="connection-details"><div><dt>Reporting mode</dt><dd>Secure API submission</dd></div><div><dt>STR workflow</dt><dd>Analyst approval required</dd></div><div><dt>Last synchronization</dt><dd>Today, 10:45 AM</dd></div><div><dt>Data residency</dt><dd>Jordan region</dd></div></dl>
                </article>
                <article className="panel settings-card">
                  <div className="panel-heading"><div><h2>Roles and approvals</h2><p>Separation of duties for sensitive actions</p></div></div>
                  <div className="role-list"><div><span className="avatar dark">YK</span><p><strong>Yousef Khoury</strong><small>Compliance officer · Case decisions</small></p><em>Administrator</em></div><div><span className="avatar sage">LA</span><p><strong>Lina Abu-Salem</strong><small>Operations · Transfer initiation</small></p><em>Operator</em></div><div><span className="avatar blue">RM</span><p><strong>Rami Mansour</strong><small>Internal audit · Read-only access</small></p><em>Auditor</em></div></div>
                </article>
                <article className="panel settings-card">
                  <div className="panel-heading"><div><h2>Audit controls</h2><p>Evidence retention and accountable actions</p></div></div>
                  <div className="audit-settings"><label>Evidence retention<select defaultValue="7 years"><option>5 years</option><option>7 years</option><option>10 years</option></select></label><label>Case approval threshold<select defaultValue="Risk score 70+"><option>Risk score 60+</option><option>Risk score 70+</option><option>All escalations</option></select></label><div><span>Immutable decision trail</span><strong>Enabled</strong></div><div><span>Analyst identity attribution</span><strong>Required</strong></div></div>
                </article>
              </div>
              <div className="settings-footer"><div><strong>Changes require administrator authority</strong><span>Every configuration change is timestamped and attributed.</span></div><button className="primary" onClick={() => { setSettingsSaved(true); window.setTimeout(() => setSettingsSaved(false), 3500); }}>Save configuration</button></div>
            </section>
          ) : active === "Brokers" ? (
            <section className="broker-workspace">
              <div className="broker-summary">
                <article><span>Registered brokers</span><strong>{brokers.length}</strong><small>Across three countries</small></article>
                <article><span>Network liquidity</span><strong>JOD {brokers.reduce((total, broker) => total + broker.balance, 0).toLocaleString("en-US")}</strong><small>Available prefunded balance</small></article>
                <article><span>Settlement exposure</span><strong>JOD 8,790</strong><small>Gross obligations before netting</small></article>
                <article><span>Net settlement</span><strong>JOD 4,850</strong><small>45% reduction after netting</small></article>
              </div>
              <div className="broker-grid">
                <article className="panel broker-directory">
                  <div className="panel-heading"><div><h2>Registered broker network</h2><p>Licensed participants and live liquidity positions</p></div><span className="data-protection">Identity verified</span></div>
                  <div className="broker-list">
                    {brokers.map((broker) => (
                      <div className="broker-row" key={broker.code}>
                        <span className="broker-avatar">{broker.initials}</span>
                        <div><strong>{broker.name}</strong><small>{broker.code} · {broker.city}</small></div>
                        <div><span>Prefunded balance</span><strong>JOD {broker.balance.toLocaleString("en-US")}</strong></div>
                        <div><span>Net position</span><strong className={broker.position < 0 ? "negative-position" : "positive-position"}>{broker.position < 0 ? "−" : "+"} JOD {Math.abs(broker.position).toLocaleString("en-US")}</strong></div>
                        <em className={`broker-status ${broker.status.toLowerCase()}`}>{broker.status}</em>
                      </div>
                    ))}
                  </div>
                </article>
                <article className="panel settlement-panel">
                  <div className="panel-heading"><div><h2>Settlement cycle</h2><p>Current multilateral netting window</p></div></div>
                  <div className={`settlement-state ${settlementRun ? "settled" : ""}`}>
                    <span>{settlementRun ? "✓" : "⇄"}</span>
                    <strong>{settlementRun ? "Cycle settled" : "Ready to settle"}</strong>
                    <p>{settlementRun ? "Positions were netted and the audit proof was recorded." : "Four broker positions have passed balance and compliance checks."}</p>
                  </div>
                  <div className="settlement-flow">
                    <div><span>Gross obligations</span><strong>JOD 8,790</strong></div>
                    <i>→</i>
                    <div><span>Net payable</span><strong>JOD 4,850</strong></div>
                  </div>
                  <div className="settlement-checks"><span>✓ Broker identities verified</span><span>✓ Sufficient prefunding confirmed</span><span>✓ Transaction batch AML screened</span></div>
                  <button className="primary full" disabled={settlementRun} onClick={() => setSettlementRun(true)}>{settlementRun ? "Settlement complete" : "Run net settlement"}</button>
                </article>
              </div>
              <article className="panel corridor-positions">
                <div className="panel-heading"><div><h2>Corridor positions</h2><p>Obligations to be settled between registered counterparties</p></div><span className="report-ready">Live balances</span></div>
                <div className="position-rail"><div><strong>Jordan → Egypt</strong><span>Al Noor Exchange</span><i /><b>JOD 3,260</b><span>Cairo Trust Remit</span></div><div><strong>Jordan → Pakistan</strong><span>Al Noor Exchange</span><i /><b>JOD 4,850</b><span>PakLink Services</span></div><div><strong>Jordan → Philippines</strong><span>Bayan Remittance</span><i /><b>JOD 680</b><span>Partner pending</span></div></div>
              </article>
            </section>
          ) : active === "Transactions" ? (
            <section className="ledger-workspace">
              <div className="ledger-summary">
                <article><span>Total transfers</span><strong>{transactions.length}</strong><small>Recorded in the secure ledger</small></article>
                <article><span>Cleared</span><strong>{transactions.filter((item) => item.status === "Cleared").length}</strong><small>Passed automated screening</small></article>
                <article><span>Under review</span><strong>{transactions.filter((item) => item.status === "Review").length}</strong><small>Requires analyst attention</small></article>
                <article><span>Recorded value</span><strong>JOD {reportVolume.toLocaleString("en-US")}</strong><small>Across all active corridors</small></article>
              </div>
              <article className="panel ledger-directory">
                <div className="panel-heading ledger-heading">
                  <div><h2>Transfer ledger</h2><p>Complete transaction history across registered brokers</p></div>
                  <button className="secondary" onClick={exportRegulatoryCsv}>↓ Export CSV</button>
                </div>
                <div className="ledger-filters" aria-label="Transaction filters">
                  <label>Risk<select value={riskFilter} onChange={(event) => setRiskFilter(event.target.value)}><option>All</option><option>Low</option><option>Medium</option><option>High</option></select></label>
                  <label>Status<select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option>All</option><option>Cleared</option><option>Review</option></select></label>
                  <span>{ledgerFiltered.length} result{ledgerFiltered.length === 1 ? "" : "s"}</span>
                </div>
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>Customer</th><th>Transaction</th><th>Corridor</th><th>Amount</th><th>Risk</th><th>Status</th><th>Action</th></tr></thead>
                    <tbody>
                      {ledgerFiltered.map((item) => (
                        <tr key={item.id}>
                          <td><div className="customer"><span className={`avatar ${item.tone}`}>{item.initials}</span><div><strong>{item.customer}</strong><small>Verified customer</small></div></div></td>
                          <td><strong>{item.id}</strong><small>{item.time}</small></td>
                          <td>{item.corridor}</td>
                          <td><strong>{item.amount}</strong></td>
                          <td><span className={`risk ${item.risk.toLowerCase()}`}>● {item.risk}</span></td>
                          <td><span className={`status ${item.status.toLowerCase()}`}>{item.status === "Cleared" ? "✓" : "▷"} {item.status}</span></td>
                          <td>{item.status === "Review" ? <button className="table-action" onClick={() => setShowAlert(true)}>Review</button> : <span className="ledger-complete">Complete</span>}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {ledgerFiltered.length === 0 && <div className="empty">No transactions match these filters.</div>}
                </div>
              </article>
            </section>
          ) : active === "Customers" ? (
            <section className="customers-workspace">
              <div className="customer-summary">
                <article><span>Total customers</span><strong>{customers.length}</strong><small>Registered in the secure directory</small></article>
                <article><span>Verified</span><strong>{customers.filter((customer) => customer.verificationStatus === "Verified").length}</strong><small>Identity checks completed</small></article>
                <article><span>Pending review</span><strong>{customers.filter((customer) => customer.verificationStatus === "Pending review").length}</strong><small>Requires compliance action</small></article>
              </div>
              <article className="panel customer-directory">
                <div className="panel-heading">
                  <div><h2>Customer directory</h2><p>Identity records and current KYC status</p></div>
                  <span className="data-protection">Protected records</span>
                </div>
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>Customer</th><th>Reference</th><th>Nationality</th><th>Identity document</th><th>Risk</th><th>KYC status</th></tr></thead>
                    <tbody>
                      {customers.map((customer) => (
                        <tr key={customer.reference}>
                          <td><div className="customer"><span className="avatar sage">{customer.fullName.split(/\s+/).slice(0, 2).map((part) => part[0]).join("")}</span><div><strong>{customer.fullName}</strong><small>Added {new Date(customer.createdAt).toLocaleDateString("en-GB")}</small></div></div></td>
                          <td><strong>{customer.reference}</strong></td>
                          <td>{customer.nationality}</td>
                          <td><strong>{customer.idType}</strong><small>•••• {customer.idNumberLast4}</small></td>
                          <td><span className={`risk ${customer.risk.toLowerCase()}`}>● {customer.risk}</span></td>
                          <td><span className={`status ${customer.verificationStatus === "Verified" ? "cleared" : "review"}`}>{customer.verificationStatus === "Verified" ? "✓" : "◷"} {customer.verificationStatus}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {customers.length === 0 && <div className="empty customer-empty"><span>◎</span><strong>No customer records yet</strong><p>Add the first customer to demonstrate the complete KYC onboarding flow.</p><button className="primary" onClick={() => setShowCustomer(true)}>Add first customer</button></div>}
                </div>
              </article>
            </section>
          ) : active === "Compliance" ? (
            <section className="compliance-workspace">
              <div className="case-summary">
                <article><span>Open cases</span><strong>{cases.filter((item) => item.status === "Open").length}</strong><small>Awaiting analyst decision</small></article>
                <article><span>Escalated</span><strong>{cases.filter((item) => item.status === "Escalated").length}</strong><small>Enhanced review required</small></article>
                <article><span>Cleared</span><strong>{cases.filter((item) => item.status === "Cleared").length}</strong><small>Decision trail complete</small></article>
              </div>
              <div className="case-layout">
                <article className="panel case-queue">
                  <div className="panel-heading"><div><h2>Case queue</h2><p>Prioritized by severity and age</p></div></div>
                  {cases.map((item) => (
                    <button key={item.reference} className={selectedCase?.reference === item.reference ? "case-row selected" : "case-row"} onClick={() => { setSelectedCaseReference(item.reference); setCaseNote(""); }}>
                      <span className={`case-severity ${item.severity.toLowerCase()}`}>{item.riskScore}</span>
                      <span><strong>{item.caseType}</strong><small>{item.customerName} · {item.transferReference}</small></span>
                      <em className={`case-status ${item.status.toLowerCase()}`}>{item.status}</em>
                    </button>
                  ))}
                  {cases.length === 0 && <div className="empty">No compliance cases are waiting.</div>}
                </article>
                <article className="panel case-detail">
                  {selectedCase ? <>
                    <div className="case-detail-head">
                      <div><span className="eyebrow">{selectedCase.reference} · {selectedCase.severity.toUpperCase()} RISK</span><h2>{selectedCase.caseType}</h2><p>{selectedCase.customerName} · {selectedCase.transferReference}</p></div>
                      <div className={`score-chip ${selectedCase.severity.toLowerCase()}`}><strong>{selectedCase.riskScore}</strong><small>/100</small></div>
                    </div>
                    <div className="case-section"><h3>Explainable triggers</h3>{JSON.parse(selectedCase.reasons).map((reason: string, index: number) => <div className="case-reason" key={reason}><span>{String(index + 1).padStart(2, "0")}</span><p>{reason}</p></div>)}</div>
                    <div className="case-section timeline"><h3>Case timeline</h3><div><span>✓</span><p><strong>Alert created</strong><small>{new Date(selectedCase.createdAt).toLocaleString("en-GB")}</small></p></div>{selectedCase.status !== "Open" && <div><span>✓</span><p><strong>{selectedCase.status} by analyst</strong><small>{selectedCase.assignedToEmail}</small></p></div>}</div>
                    {selectedCase.status === "Open" ? <div className="case-decision"><label>Investigation note<textarea value={caseNote} onChange={(event) => setCaseNote(event.target.value)} placeholder="Document evidence reviewed and the reason for your decision…" /></label><div><button className="secondary" onClick={() => decideCase("Escalated")}>Escalate case</button><button className="primary" onClick={() => decideCase("Cleared")}>Clear with note</button></div></div> : <div className="decision-record"><span>✓</span><div><strong>Decision recorded: {selectedCase.status}</strong><p>{selectedCase.note}</p>{selectedCase.status === "Escalated" && <button className="str-action" onClick={() => { setStrSubmitted(false); setShowStr(true); }}>Prepare suspicious transaction report →</button>}</div></div>}
                  </> : <div className="empty">Select a case to begin the review.</div>}
                </article>
              </div>
            </section>
          ) : active === "Reports" ? (
            <section className="reports-workspace">
              <div className="report-period"><div><span className="eyebrow">REPORTING PERIOD</span><strong>Current demonstration dataset</strong></div><span className="report-ready">✓ Evidence pack ready</span></div>
              <div className="report-metrics">
                <article><span>Recorded volume</span><strong>JOD {reportVolume.toLocaleString("en-US")}</strong><small>{transactions.length} ledger transactions</small></article>
                <article><span>Customer population</span><strong>{customers.length}</strong><small>{customers.filter((customer) => customer.verificationStatus === "Verified").length} identities verified</small></article>
                <article><span>High/medium risk</span><strong>{transactions.filter((item) => item.risk !== "Low").length}</strong><small>Transactions requiring oversight</small></article>
                <article><span>Case closure rate</span><strong>{cases.length ? Math.round(cases.filter((item) => item.status !== "Open").length / cases.length * 100) : 0}%</strong><small>{cases.filter((item) => item.status !== "Open").length} of {cases.length} cases decided</small></article>
              </div>
              <div className="report-grid">
                <article className="panel corridor-report">
                  <div className="panel-heading"><div><h2>Corridor exposure</h2><p>Recorded volume by destination corridor</p></div></div>
                  <div className="corridor-list">
                    {corridorSummary.map((item) => <div key={item.corridor}><div><strong>{item.corridor}</strong><small>{item.count} transfers · JOD {item.volume.toLocaleString("en-US")}</small></div><span><i style={{ width: `${reportVolume ? Math.max(8, item.volume / reportVolume * 100) : 8}%` }} /></span></div>)}
                    {corridorSummary.length === 0 && <div className="empty">No corridor data recorded yet.</div>}
                  </div>
                </article>
                <article className="panel risk-report">
                  <div className="panel-heading"><div><h2>Risk distribution</h2><p>Transaction monitoring outcomes</p></div></div>
                  <div className="risk-donut" style={{ "--low": `${transactions.length ? transactions.filter((item) => item.risk === "Low").length / transactions.length * 100 : 0}%`, "--medium": `${transactions.length ? transactions.filter((item) => item.risk === "Medium").length / transactions.length * 100 : 0}%` } as CSSProperties}><div><strong>{transactions.length}</strong><small>screened</small></div></div>
                  <div className="risk-legend"><span><i className="low-dot" />Low <strong>{transactions.filter((item) => item.risk === "Low").length}</strong></span><span><i className="medium-dot" />Medium <strong>{transactions.filter((item) => item.risk === "Medium").length}</strong></span><span><i className="high-dot" />High <strong>{transactions.filter((item) => item.risk === "High").length}</strong></span></div>
                </article>
              </div>
              <article className="panel evidence-register">
                <div className="panel-heading"><div><h2>Regulatory evidence register</h2><p>Data available for supervisory review</p></div><span className="data-protection">Audit attributed</span></div>
                <div className="evidence-grid"><div><span>✓</span><p><strong>Transaction ledger</strong><small>Sender, corridor, value, risk, and disposition</small></p></div><div><span>✓</span><p><strong>KYC register</strong><small>Identity status with minimized document data</small></p></div><div><span>✓</span><p><strong>Case decisions</strong><small>Triggers, analyst notes, outcomes, and attribution</small></p></div><div><span>✓</span><p><strong>Corridor summary</strong><small>Aggregate volume and transaction counts</small></p></div></div>
              </article>
            </section>
          ) : (<>
          <section className="metrics" aria-label="Key metrics">
            <article>
              <div className="metric-icon mint">↗</div>
              <div>
                <span>Today’s volume</span>
                <strong>JOD 48,290</strong>
                <small className="positive">↑ 12.4% <i>vs. yesterday</i></small>
              </div>
              <div className="sparkline mint-line" aria-hidden="true">
                <i /><i /><i /><i /><i /><i /><i /><i />
              </div>
            </article>
            <article>
              <div className="metric-icon blue-bg">⇄</div>
              <div>
                <span>Transfers today</span>
                <strong>127</strong>
                <small className="positive">↑ 8.1% <i>vs. yesterday</i></small>
              </div>
              <div className="sparkline blue-line" aria-hidden="true">
                <i /><i /><i /><i /><i /><i /><i /><i />
              </div>
            </article>
            <article>
              <div className="metric-icon amber-bg">!</div>
              <div>
                <span>Pending review</span>
                <strong>3</strong>
                <small className="warning">Requires attention</small>
              </div>
            </article>
            <article>
              <div className="metric-icon lavender">◷</div>
              <div>
                <span>Average clearance</span>
                <strong>42 sec</strong>
                <small className="positive">↓ 18% <i>this month</i></small>
              </div>
            </article>
          </section>

          <section className="main-grid">
            <article className="panel activity-panel">
              <div className="panel-heading">
                <div>
                  <h2>Transaction activity</h2>
                  <p>Processed volume · Last 7 days</p>
                </div>
                <button>This week ⌄</button>
              </div>
              <div className="chart">
                <div className="y-labels">
                  <span>12k</span><span>8k</span><span>4k</span><span>0</span>
                </div>
                <div className="chart-area">
                  <div className="chart-grid"><i /><i /><i /><i /></div>
                  <svg
                    viewBox="0 0 700 180"
                    preserveAspectRatio="none"
                    role="img"
                    aria-label="Transaction volume rose from Monday to Sunday"
                  >
                    <defs>
                      <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1f8f73" stopOpacity=".24" />
                        <stop offset="100%" stopColor="#1f8f73" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path className="area" d="M0,148 C55,135 78,102 122,111 C180,124 194,73 244,88 C299,104 325,40 373,54 C430,70 453,92 501,70 C555,46 580,63 622,35 C650,17 680,30 700,15 L700,180 L0,180 Z" />
                    <path className="line" d="M0,148 C55,135 78,102 122,111 C180,124 194,73 244,88 C299,104 325,40 373,54 C430,70 453,92 501,70 C555,46 580,63 622,35 C650,17 680,30 700,15" />
                    <circle cx="622" cy="35" r="5" />
                  </svg>
                  <div className="x-labels">
                    <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
                  </div>
                </div>
              </div>
            </article>

            <article className="panel attention-panel">
              <div className="panel-heading">
                <div>
                  <h2>Needs attention</h2>
                  <p>3 compliance items</p>
                </div>
                <button className="arrow-button">→</button>
              </div>
              <button className="alert-item" onClick={() => setShowAlert(true)}>
                <span className="alert-symbol high">!</span>
                <div>
                  <strong>High-risk transaction</strong>
                  <p>HW-28490 · JOD 4,850</p>
                </div>
                <span className="time">11m</span>
              </button>
              <button className="alert-item" onClick={() => setShowAlert(true)}>
                <span className="alert-symbol medium">◎</span>
                <div>
                  <strong>Name match requires review</strong>
                  <p>Rana Odeh · 78% similarity</p>
                </div>
                <span className="time">24m</span>
              </button>
              <button className="alert-item" onClick={() => setShowAlert(true)}>
                <span className="alert-symbol low">▤</span>
                <div>
                  <strong>KYC document expiring</strong>
                  <p>Customer C-1842 · 6 days</p>
                </div>
                <span className="time">1h</span>
              </button>
            </article>
          </section>

          <section className="panel transactions-panel">
            <div className="panel-heading">
              <div>
                <h2>Recent transactions</h2>
                <p>Live activity across all branches</p>
              </div>
              <button onClick={() => setActive("Transactions")}>View all <span>→</span></button>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Transaction</th>
                    <th>Corridor</th>
                    <th>Amount</th>
                    <th>Risk</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.slice(0, 4).map((item) => (
                    <tr key={item.id} onClick={() => item.status === "Review" && setShowAlert(true)}>
                      <td>
                        <div className="customer">
                          <span className={`avatar ${item.tone}`}>{item.initials}</span>
                          <div><strong>{item.customer}</strong><small>Verified customer</small></div>
                        </div>
                      </td>
                      <td><strong>{item.id}</strong><small>{item.time}</small></td>
                      <td>{item.corridor}</td>
                      <td><strong>{item.amount}</strong></td>
                      <td><span className={`risk ${item.risk.toLowerCase()}`}>● {item.risk}</span></td>
                      <td><span className={`status ${item.status.toLowerCase()}`}>{item.status === "Cleared" ? "✓" : "◷"} {item.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && <div className="empty">No matching transactions found.</div>}
            </div>
          </section>
          </>)}
        </div>
      </section>

      <nav className="mobile-nav" aria-label="Mobile navigation">
        {[...nav, "Settings"].map((item, index) => (
          <button key={item} className={active === item ? "active" : ""} onClick={() => setActive(item)}>
            <span aria-hidden="true">{["⌂", "⇄", "◉", "◎", "◇", "▤", "⚙"][index]}</span>
            <small>{item === "Settings" ? ui.settings : ui.nav[item as keyof typeof ui.nav]}</small>
            {item === "Compliance" && <em>3</em>}
          </button>
        ))}
      </nav>

      {showTransfer && (
        <div className="modal-backdrop" onMouseDown={() => setShowTransfer(false)}>
          <section className="modal transfer-modal" onMouseDown={(event) => event.stopPropagation()} aria-modal="true" role="dialog">
            <div className="modal-header">
              <div><span className="eyebrow">NEW TRANSFER</span><h2>Record a customer transfer</h2></div>
              <button onClick={() => setShowTransfer(false)} aria-label="Close">×</button>
            </div>
            {created ? (
              <div className="success-state">
                <div>✓</div>
                <h3>Transfer cleared</h3>
                <p>HW-28492 was screened and added to the ledger.</p>
              </div>
            ) : (
              <form onSubmit={submitTransfer}>
                <div className="progress"><span className="complete" /><span className="complete" /><span /></div>
                <div className="step-labels"><span>Customer</span><span>Transfer</span><span>Review</span></div>
                  <label>Sender<input name="sender" required defaultValue="Ahmad Al-Khatib" /></label>
                  <div className="form-row">
                  <label>Destination<select name="destination" defaultValue="Egypt"><option>Egypt</option><option>Pakistan</option><option>Philippines</option><option>Morocco</option></select></label>
                  <label>Amount (JOD)<input name="amount" required type="number" defaultValue="1240" min="1" /></label>
                </div>
                <label>Transfer purpose<select name="purpose" defaultValue="Family support"><option>Family support</option><option>Education</option><option>Medical expenses</option><option>Salary</option></select></label>
                <div className="screening-result"><span>✓</span><div><strong>Screening complete</strong><p>No sanctions or PEP matches · Risk score 12/100</p></div></div>
                <button className="primary full" type="submit">Approve and record transfer</button>
              </form>
            )}
          </section>
        </div>
      )}

      {showAlert && (
        <div className="modal-backdrop" onMouseDown={() => setShowAlert(false)}>
          <section className="modal review-modal" onMouseDown={(event) => event.stopPropagation()} aria-modal="true" role="dialog">
            <div className="modal-header">
              <div><span className="eyebrow red-text">HIGH RISK · HW-28490</span><h2>Compliance review</h2></div>
              <button onClick={() => setShowAlert(false)} aria-label="Close">×</button>
            </div>
            <div className="risk-score">
              <div className="score-ring"><strong>82</strong><small>/ 100</small></div>
              <div><strong>Enhanced review required</strong><p>The transfer triggered 3 explainable risk rules.</p></div>
            </div>
            <div className="reasons">
              <div><span>01</span><p><strong>Velocity anomaly</strong>4 transfers in 48 hours, 2.6× this customer’s baseline.</p></div>
              <div><span>02</span><p><strong>Amount pattern</strong>Transactions total JOD 9,760, close to the review threshold.</p></div>
              <div><span>03</span><p><strong>New beneficiary</strong>First transfer to this beneficiary in Pakistan.</p></div>
            </div>
            <label>Compliance note<textarea placeholder="Record your review decision and supporting evidence…" /></label>
            <div className="modal-actions">
              <button className="secondary" onClick={() => setShowAlert(false)}>Escalate case</button>
              <button className="primary" onClick={() => setShowAlert(false)}>Clear with note</button>
            </div>
          </section>
        </div>
      )}

      {showStr && selectedCase && (
        <div className="modal-backdrop" onMouseDown={() => setShowStr(false)}>
          <section className="modal str-modal" onMouseDown={(event) => event.stopPropagation()} aria-modal="true" role="dialog" aria-labelledby="str-title">
            <div className="modal-header">
              <div><span className="eyebrow red-text">REGULATORY FILING · DRAFT</span><h2 id="str-title">Suspicious transaction report</h2></div>
              <button onClick={() => setShowStr(false)} aria-label="Close">×</button>
            </div>
            {strSubmitted ? (
              <div className="str-receipt">
                <div>✓</div>
                <h3>Report submitted securely</h3>
                <p>The regulator acknowledged receipt of the filing.</p>
                <dl><div><dt>Receipt</dt><dd>STR-JO-2026-00418</dd></div><div><dt>Submitted by</dt><dd>{selectedCase.assignedToEmail || "Current compliance officer"}</dd></div><div><dt>Status</dt><dd>Accepted for review</dd></div></dl>
                <button className="primary full" onClick={() => setShowStr(false)}>Return to case</button>
              </div>
            ) : (
              <>
                <div className="str-notice"><span>◇</span><p><strong>Prefilled from the case evidence trail</strong>Review the report before encrypted submission to the financial intelligence unit.</p></div>
                <div className="str-fields">
                  <div><span>Reporting entity</span><strong>HAWALA Compliance OS · CBJ EXC-2026-041</strong></div>
                  <div><span>Case reference</span><strong>{selectedCase.reference}</strong></div>
                  <div><span>Subject</span><strong>{selectedCase.customerName}</strong></div>
                  <div><span>Transaction</span><strong>{selectedCase.transferReference}</strong></div>
                  <div className="wide"><span>Suspicion category</span><strong>{selectedCase.caseType}</strong></div>
                  <div className="wide"><span>Automated indicators</span><p>{JSON.parse(selectedCase.reasons).join(" · ")}</p></div>
                </div>
                <label className="str-narrative">Regulatory narrative<textarea defaultValue={`${selectedCase.customerName} was escalated following automated detection of ${selectedCase.caseType.toLowerCase()}. The transaction and related customer activity were reviewed against the recorded risk indicators. The reporting entity is submitting this report for supervisory assessment; no conclusion of criminal conduct has been made.`} /></label>
                <div className="str-certification"><span>✓</span><p>I certify that this filing reflects the evidence available in the case record and is submitted in good faith.</p></div>
                <div className="modal-actions"><button className="secondary" onClick={() => setShowStr(false)}>Save draft</button><button className="primary" onClick={() => setStrSubmitted(true)}>Submit encrypted STR</button></div>
              </>
            )}
          </section>
        </div>
      )}

      {showCustomer && (
        <div className="modal-backdrop" onMouseDown={() => setShowCustomer(false)}>
          <section className="modal customer-modal" onMouseDown={(event) => event.stopPropagation()} aria-modal="true" role="dialog">
            <div className="modal-header">
              <div><span className="eyebrow">CUSTOMER ONBOARDING</span><h2>Create a verified record</h2></div>
              <button onClick={() => setShowCustomer(false)} aria-label="Close">×</button>
            </div>
            {customerCreated ? (
              <div className="success-state"><div>✓</div><h3>Customer verified</h3><p>The KYC record was added to the secure customer directory.</p></div>
            ) : (
              <form onSubmit={submitCustomer}>
                <div className="progress"><span className="complete" /><span className="complete" /><span className="complete" /></div>
                <div className="step-labels"><span>Identity</span><span>Document</span><span>Verification</span></div>
                <label>Full legal name<input name="fullName" required placeholder="As shown on the identity document" autoComplete="name" /></label>
                <div className="form-row">
                  <label>Nationality<select name="nationality" defaultValue="Jordan"><option>Jordan</option><option>Egypt</option><option>Pakistan</option><option>Philippines</option><option>Morocco</option></select></label>
                  <label>Identity type<select name="idType" defaultValue="National ID"><option>National ID</option><option>Passport</option><option>Residence permit</option></select></label>
                </div>
                <label>Identity number<input name="idNumber" required minLength={4} placeholder="Only the final four characters are retained" autoComplete="off" /></label>
                <div className="privacy-note"><span>◇</span><div><strong>Data minimization enabled</strong><p>The demo stores only the final four identity characters, verification result, and audit attribution.</p></div></div>
                <button className="primary full" type="submit">Verify and create customer</button>
              </form>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
