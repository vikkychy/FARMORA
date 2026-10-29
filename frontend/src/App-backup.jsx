import { useEffect, useState } from 'react';
import './App.css';

const translations = {
  en: {
    dashboard: 'Dashboard',
    agriculture: 'Agriculture',
    livestock: 'Livestock',
    activities: 'Recent Activities',
    overview: 'Farm Overview',
    totalCrops: 'Total Crops',
    livestockCount: 'Total Livestock',
    farmArea: 'Farm Area',
    healthyAnimals: 'Healthy Animals',
    welcome: 'Welcome to Farmora',
    subtitle: 'Manage your farm smarter, every day.',
    simpleDashboard: 'Simple Dashboard',
    advancedDashboard: 'Advanced Dashboard',
    server: 'Backend',
    database: 'Database',
    connected: 'Connected',
    disconnected: 'Disconnected',
    loading: 'Checking connection...',
    language: 'नेपाली',
    activity1: 'Farmora dashboard initialized',
    activity2: 'Backend connection checked',
    activity3: 'Farm management workspace ready',
    systemStatus: 'System Status',
  },
  ne: {
    dashboard: 'ड्यासबोर्ड',
    agriculture: 'कृषि',
    livestock: 'पशुपन्छी',
    activities: 'हालका गतिविधिहरू',
    overview: 'फार्मको विवरण',
    totalCrops: 'जम्मा बाली',
    livestockCount: 'जम्मा पशुपन्छी',
    farmArea: 'फार्मको क्षेत्रफल',
    healthyAnimals: 'स्वस्थ पशुपन्छी',
    welcome: 'Farmora मा स्वागत छ',
    subtitle: 'हरेक दिन आफ्नो फार्मलाई अझ व्यवस्थित बनाउनुहोस्।',
    simpleDashboard: 'सामान्य ड्यासबोर्ड',
    advancedDashboard: 'उन्नत ड्यासबोर्ड',
    server: 'ब्याकएन्ड',
    database: 'डेटाबेस',
    connected: 'जडान भएको',
    disconnected: 'जडान नभएको',
    loading: 'जडान जाँच हुँदैछ...',
    language: 'English',
    activity1: 'Farmora ड्यासबोर्ड सुरु गरियो',
    activity2: 'ब्याकएन्ड जडान जाँच गरियो',
    activity3: 'फार्म व्यवस्थापनका लागि तयार',
    systemStatus: 'प्रणालीको अवस्था',
  },
};

function App() {
  const [language, setLanguage] = useState('en');
  const [dashboardType, setDashboardType] = useState('simple');
  const [activePage, setActivePage] = useState('dashboard');
  const [apiData, setApiData] = useState(null);
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(true);

  const t = translations[language];

  useEffect(() => {
    fetch('http://localhost:5000/api/health')
      .then((response) => {
        if (!response.ok) {
          throw new Error('API connection failed');
        }

        return response.json();
      })
      .then((data) => {
        setApiData(data);
      })
      .catch(() => {
        setApiError('Unable to connect to the backend');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const navigation = [
    { id: 'dashboard', icon: '▦', label: t.dashboard },
    { id: 'agriculture', icon: '🌱', label: t.agriculture },
    { id: 'livestock', icon: '🐄', label: t.livestock },
    { id: 'activities', icon: '◷', label: t.activities },
  ];

  const stats = [
    { title: t.totalCrops, value: '0', icon: '🌾', note: 'Manage your crops' },
    { title: t.livestockCount, value: '0', icon: '🐄', note: 'Manage your animals' },
    { title: t.farmArea, value: '0', icon: '🌳', note: 'Add your farm area' },
    { title: t.healthyAnimals, value: '0', icon: '💚', note: 'Health tracking' },
  ];

  return (
    <div className="farmora-app">
      <aside className="sidebar glass-panel">
        <a className="brand" href="#" onClick={() => setActivePage('dashboard')}>
          <span className="brand-icon">🌱</span>
          <span>
            <strong>Farmora</strong>
            <small>Smart Farm Management</small>
          </span>
        </a>

        <div className="sidebar-label">WORKSPACE</div>

        <nav className="navigation">
          {navigation.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activePage === item.id ? 'active' : ''}`}
              onClick={() => setActivePage(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom glass-panel">
          <span className="status-dot" />
          <div>
            <strong>{t.systemStatus}</strong>
            <small>
              {loading
                ? t.loading
                : apiData?.success
                  ? t.connected
                  : t.disconnected}
            </small>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar glass-panel">
          <div className="breadcrumb">
            <span>Farmora</span>
            <span>/</span>
            <strong>
              {navigation.find((item) => item.id === activePage)?.label ??
                t.dashboard}
            </strong>
          </div>

          <div className="topbar-actions">
            <button
              className="language-button"
              onClick={() =>
                setLanguage((current) => (current === 'en' ? 'ne' : 'en'))
              }
            >
              🌐 {t.language}
            </button>

            <div className="avatar">F</div>
          </div>
        </header>

        <section className="welcome-section">
          <div>
            <span className="eyebrow">🌿 YOUR FARM, YOUR FUTURE</span>
            <h1>{t.welcome}</h1>
            <p>{t.subtitle}</p>
          </div>

          <div className="dashboard-switch glass-panel">
            <button
              className={dashboardType === 'simple' ? 'selected' : ''}
              onClick={() => setDashboardType('simple')}
            >
              {t.simpleDashboard}
            </button>
            <button
              className={dashboardType === 'advanced' ? 'selected' : ''}
              onClick={() => setDashboardType('advanced')}
            >
              {t.advancedDashboard}
            </button>
          </div>
        </section>

        {activePage === 'dashboard' ? (
          <>
            <section className="stats-grid">
              {stats.map((stat) => (
                <article className="stat-card glass-panel" key={stat.title}>
                  <div className="stat-top">
                    <span>{stat.title}</span>
                    <span className="stat-icon">{stat.icon}</span>
                  </div>

                  <h2>{stat.value}</h2>
                  <p>{stat.note}</p>
                </article>
              ))}
            </section>

            <section className="content-grid">
              <article className="content-card glass-panel overview-card">
                <div className="section-heading">
                  <div>
                    <span className="eyebrow">OVERVIEW</span>
                    <h2>{t.overview}</h2>
                  </div>
                  <span className="overview-icon">🌿</span>
                </div>

                {dashboardType === 'simple' ? (
                  <div className="empty-state">
                    <span>🌱</span>
                    <h3>Your farm journey starts here</h3>
                    <p>
                      Add crops and livestock to begin managing your farm
                      with Farmora.
                    </p>
                  </div>
                ) : (
                  <div className="advanced-info">
                    <div>
                      <span>Crop records</span>
                      <strong>0</strong>
                    </div>
                    <div>
                      <span>Livestock records</span>
                      <strong>0</strong>
                    </div>
                    <div>
                      <span>Database</span>
                      <strong>
                        {apiData?.database === 'connected'
                          ? 'Online'
                          : 'Offline'}
                      </strong>
                    </div>
                    <p>
                      Advanced dashboard uses the same farm records as the
                      simple dashboard.
                    </p>
                  </div>
                )}
              </article>

              <article className="content-card glass-panel activity-card">
                <div className="section-heading">
                  <div>
                    <span className="eyebrow">LATEST UPDATES</span>
                    <h2>{t.activities}</h2>
                  </div>
                  <span className="activity-symbol">◷</span>
                </div>

                <div className="activity-list">
                  {[t.activity1, t.activity2, t.activity3].map(
                    (activity, index) => (
                      <div className="activity-item" key={activity}>
                        <span className="activity-dot">
                          {index === 0 ? '🌱' : index === 1 ? '🔗' : '✓'}
                        </span>
                        <div>
                          <p>{activity}</p>
                          <small>Farmora workspace</small>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </article>
            </section>

            <section className="connection-card glass-panel">
              <div>
                <span className="connection-icon">🔌</span>
                <div>
                  <h3>Farmora API</h3>
                  <p>
                    {loading
                      ? t.loading
                      : apiError || apiData?.message || 'API unavailable'}
                  </p>
                </div>
              </div>

              <span
                className={`connection-badge ${
                  apiData?.success ? 'online' : 'offline'
                }`}
              >
                <span className="status-dot" />
                {loading
                  ? 'Checking'
                  : apiData?.success
                    ? t.connected
                    : t.disconnected}
              </span>
            </section>
          </>
        ) : (
          <section className="content-card glass-panel page-placeholder">
            <span className="placeholder-icon">
              {activePage === 'agriculture' ? '🌾' : activePage === 'livestock' ? '🐄' : '◷'}
            </span>
            <h2>
              {navigation.find((item) => item.id === activePage)?.label}
            </h2>
            <p>
              This section will be developed in the next steps. Your farm
              records will be connected to MongoDB.
            </p>
            <button
              className="primary-button"
              onClick={() => setActivePage('dashboard')}
            >
              Back to Dashboard
            </button>
          </section>
        )}

        <footer className="footer">
          Farmora © 2026 · Growing a smarter future 🌱
        </footer>
      </main>
    </div>
  );
}

export default App;