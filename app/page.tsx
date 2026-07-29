"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

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

const nav = ["Overview", "Transactions", "Customers", "Compliance", "Reports"];

export default function Home() {
  const [active, setActive] = useState("Overview");
  const [language, setLanguage] = useState("EN");
  const [showTransfer, setShowTransfer] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [created, setCreated] = useState(false);
  const [query, setQuery] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>(seededTransactions);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const savedTransactions = window.localStorage.getItem("hawala-transactions");
    if (savedTransactions) {
      try {
        const parsedTransactions = JSON.parse(savedTransactions) as Transaction[];
        if (Array.isArray(parsedTransactions)) setTransactions(parsedTransactions);
      } catch {
        window.localStorage.removeItem("hawala-transactions");
      }
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    window.localStorage.setItem("hawala-transactions", JSON.stringify(transactions));
  }, [isHydrated, transactions]);

  const filtered = useMemo(
    () =>
      transactions.filter((item) =>
        `${item.customer} ${item.id} ${item.corridor}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [query],
  );

  function submitTransfer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const customer = String(formData.get("sender") || "New customer");
    const destination = String(formData.get("destination") || "Egypt");
    const amount = Number(formData.get("amount") || 0);
    const initials = customer
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
    const isReview = amount >= 3000;

    setTransactions((currentTransactions) => [
      {
        id: `HW-${28492 + currentTransactions.length - seededTransactions.length}`,
        customer,
        initials: initials || "NC",
        corridor: `Jordan → ${destination}`,
        amount: `JOD ${amount.toLocaleString("en-US")}`,
        time: "Just now",
        risk: isReview ? "Medium" : "Low",
        status: isReview ? "Review" : "Cleared",
        tone: isReview ? "amber" : "sage",
      },
      ...currentTransactions,
    ]);
    setCreated(true);
    window.setTimeout(() => {
      setCreated(false);
      setShowTransfer(false);
    }, 1800);
  }

  return (
    <main className="app-shell">
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
                {["⌂", "⇄", "◎", "◇", "▤"][index]}
              </span>
              {item}
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
          <button className="nav-item settings">
            <span className="nav-icon">⚙</span> Settings
          </button>
          <div className="user-card">
            <div className="avatar dark">YK</div>
            <div>
              <strong>Yousef Khoury</strong>
              <small>Compliance officer</small>
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
              placeholder="Search people or transactions"
              aria-label="Search people or transactions"
            />
            <kbd>⌘ K</kbd>
          </label>
          <div className="top-actions">
            <button
              className="language"
              onClick={() => setLanguage(language === "EN" ? "AR" : "EN")}
              aria-label="Change language"
            >
              {language}⌄
            </button>
            <button className="notification" aria-label="Notifications">
              ♢<span />
            </button>
          </div>
        </header>

        <div className="content">
          <div className="welcome">
            <div>
              <p className="eyebrow">WEDNESDAY, 29 JULY</p>
              <h1>Good morning, Yousef.</h1>
              <p>Here’s what needs your attention across your network.</p>
            </div>
            <button className="primary" onClick={() => setShowTransfer(true)}>
              <span>＋</span> New transfer
            </button>
          </div>

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
                  {filtered.map((item) => (
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
        </div>
      </section>

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
                <label>Transfer purpose<select defaultValue="Family support"><option>Family support</option><option>Education</option><option>Medical expenses</option><option>Salary</option></select></label>
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
    </main>
  );
}
