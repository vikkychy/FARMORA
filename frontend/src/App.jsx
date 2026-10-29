import { useEffect, useState } from 'react';
import './App.css';

const API_URL = 'http://localhost:5000/api';

const translations = {
  en: {
    dashboard: 'Dashboard',
    agriculture: 'Agriculture',
    livestock: 'Livestock',
    activities: 'Activities',
    welcome: 'Welcome to Farmora',
    overview: 'Your farm at a glance',
    crops: 'Total Crops',
    cropManagement: 'Crop Management',
    addCrop: 'Add New Crop',
    cropName: 'Crop Name',
    cropType: 'Crop Type',
    plantingDate: 'Planting Date',
    area: 'Farm Area',
    areaUnit: 'Area Unit',
    notes: 'Notes',
    save: 'Save Crop',
    update: 'Update Crop',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    cropList: 'Your Crops',
    noCrops: 'No crops added yet.',
    loading: 'Loading...',
    simple: 'Simple',
    advanced: 'Advanced',
    language: 'नेपाली',
    successAdd: 'Crop added successfully.',
    successUpdate: 'Crop updated successfully.',
    successDelete: 'Crop deleted successfully.',
    confirmDelete: 'Are you sure you want to delete this crop?',
    dashboardDescription: 'Manage your farm from one place.',
    livestockMessage: 'Livestock management will be developed next.',
    activitiesMessage: 'Farm activities will be developed next.',
    serverError: 'Unable to connect to the server.',
    chooseUnit: 'Select unit',
    totalArea: 'Recorded Crop Area',
    hectare: 'Hectare',
    acre: 'Acre',
    ropani: 'Ropani',
    kattha: 'Kattha',
    bigha: 'Bigha',
    allFields: 'Please fill in all required fields.',
  },
  ne: {
    dashboard: 'ड्यासबोर्ड',
    agriculture: 'कृषि व्यवस्थापन',
    livestock: 'पशुपन्छी व्यवस्थापन',
    activities: 'कृषि गतिविधिहरू',
    welcome: 'फार्मोरामा स्वागत छ',
    overview: 'तपाईंको फार्मको संक्षिप्त विवरण',
    crops: 'कुल बाली',
    cropManagement: 'बाली व्यवस्थापन',
    addCrop: 'नयाँ बाली थप्नुहोस्',
    cropName: 'बालीको नाम',
    cropType: 'बालीको प्रकार',
    plantingDate: 'रोपेको मिति',
    area: 'खेती क्षेत्रफल',
    areaUnit: 'क्षेत्रफलको एकाइ',
    notes: 'कैफियत',
    save: 'बाली सुरक्षित गर्नुहोस्',
    update: 'बाली अपडेट गर्नुहोस्',
    cancel: 'रद्द गर्नुहोस्',
    edit: 'सम्पादन',
    delete: 'हटाउनुहोस्',
    cropList: 'तपाईंका बालीहरू',
    noCrops: 'अहिलेसम्म कुनै बाली थपिएको छैन।',
    loading: 'लोड हुँदैछ...',
    simple: 'सामान्य',
    advanced: 'उन्नत',
    language: 'English',
    successAdd: 'बाली सफलतापूर्वक थपियो।',
    successUpdate: 'बाली सफलतापूर्वक अपडेट भयो।',
    successDelete: 'बाली सफलतापूर्वक हटाइयो।',
    confirmDelete: 'के तपाईं यो बाली हटाउन चाहनुहुन्छ?',
    dashboardDescription: 'आफ्नो फार्म एउटै ठाउँबाट व्यवस्थापन गर्नुहोस्।',
    livestockMessage: 'पशुपन्छी व्यवस्थापन अर्को चरणमा बनाइनेछ।',
    activitiesMessage: 'कृषि गतिविधिहरू अर्को चरणमा बनाइनेछन्।',
    serverError: 'सर्भरसँग सम्पर्क हुन सकेन।',
    chooseUnit: 'एकाइ छान्नुहोस्',
    totalArea: 'रेकर्ड गरिएको खेती क्षेत्रफल',
    hectare: 'हेक्टर',
    acre: 'एकड',
    ropani: 'रोपनी',
    kattha: 'कट्ठा',
    bigha: 'बिघा',
    allFields: 'कृपया आवश्यक विवरणहरू भर्नुहोस्।',
  },
};

const emptyForm = {
  name: '',
  type: '',
  plantingDate: '',
  area: '',
  areaUnit: 'ropani',
  notes: '',
};

function App() {
  const [language, setLanguage] = useState('en');
  const [dashboardType, setDashboardType] = useState('simple');
  const [activePage, setActivePage] = useState('dashboard');

  const [crops, setCrops] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [databaseStatus, setDatabaseStatus] = useState('Checking...');

  const t = translations[language];

  async function loadCrops() {
    try {
      const response = await fetch(`${API_URL}/crops`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to load crops');
      }

      setCrops(Array.isArray(result.data) ? result.data : []);
      setError('');
    } catch (err) {
      setError(err.message || t.serverError);
    } finally {
      setLoading(false);
    }
  }

  async function checkBackend() {
    try {
      const response = await fetch(`${API_URL}/health`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error('Backend health check failed');
      }

      setDatabaseStatus(
        result.database === 'connected' ? 'Connected' : 'Disconnected'
      );
    } catch {
      setDatabaseStatus('Disconnected');
    }
  }

  useEffect(() => {
    loadCrops();
    checkBackend();
  }, []);

  function handleInputChange(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    setError('');

    if (
      !form.name.trim() ||
      !form.type.trim() ||
      !form.plantingDate ||
      form.area === '' ||
      Number(form.area) <= 0
    ) {
      setError(t.allFields);
      return;
    }

    setSaving(true);

    const payload = {
      ...form,
      name: form.name.trim(),
      type: form.type.trim(),
      area: Number(form.area),
    };

    try {
      const url = editingId
        ? `${API_URL}/crops/${editingId}`
        : `${API_URL}/crops`;

      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Unable to save crop');
      }

      setMessage(editingId ? t.successUpdate : t.successAdd);
      resetForm();
      await loadCrops();
      setActivePage('agriculture');
    } catch (err) {
      setError(err.message || t.serverError);
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(crop) {
    setForm({
      name: crop.name || '',
      type: crop.type || '',
      plantingDate: crop.plantingDate
        ? new Date(crop.plantingDate).toISOString().slice(0, 10)
        : '',
      area: String(crop.area ?? ''),
      areaUnit: crop.areaUnit || 'ropani',
      notes: crop.notes || '',
    });

    setEditingId(crop._id);
    setMessage('');
    setError('');
    setActivePage('agriculture');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(id) {
    if (!window.confirm(t.confirmDelete)) {
      return;
    }

    setMessage('');
    setError('');

    try {
      const response = await fetch(`${API_URL}/crops/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Unable to delete crop');
      }

      if (editingId === id) {
        resetForm();
      }

      setMessage(t.successDelete);
      await loadCrops();
    } catch (err) {
      setError(err.message || t.serverError);
    }
  }

  const navigation = [
    { id: 'dashboard', icon: '⌂', label: t.dashboard },
    { id: 'agriculture', icon: '🌱', label: t.agriculture },
    { id: 'livestock', icon: '🐄', label: t.livestock },
    { id: 'activities', icon: '📅', label: t.activities },
  ];

  const recordedArea = crops.reduce((total, crop) => {
    return total + (Number(crop.area) || 0);
  }, 0);

  const areaUnits = [...new Set(crops.map((crop) => crop.areaUnit || 'ropani'))];

  return (
    <div className="app-layout">
      <aside className="sidebar glass-panel">
        <div className="brand">
          <div className="brand-icon">🌿</div>
          <div>
            <h1>Farmora</h1>
            <span>Smart Farm Management</span>
          </div>
        </div>

        <div className="sidebar-label">
          {language === 'en' ? 'MENU' : 'मेनु'}
        </div>

        <nav className="sidebar-nav">
          {navigation.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${
                activePage === item.id ? 'active' : ''
              }`}
              onClick={() => {
                setActivePage(item.id);
                setMessage('');
                setError('');
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <span className="status-dot" />
          <span>
            {language === 'en' ? 'Farmora is ready' : 'फार्मोरा तयार छ'}
          </span>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar glass-panel">
          <div>
            <p className="eyebrow">FARMORA / MANAGEMENT</p>
            <h2>{navigation.find((item) => item.id === activePage)?.label}</h2>
          </div>

          <div className="topbar-actions">
            <div className="dashboard-switch">
              <button
                className={dashboardType === 'simple' ? 'selected' : ''}
                onClick={() => setDashboardType('simple')}
              >
                {t.simple}
              </button>

              <button
                className={dashboardType === 'advanced' ? 'selected' : ''}
                onClick={() => setDashboardType('advanced')}
              >
                {t.advanced}
              </button>
            </div>

            <button
              className="language-button"
              onClick={() =>
                setLanguage((current) => (current === 'en' ? 'ne' : 'en'))
              }
            >
              🌐 {t.language}
            </button>
          </div>
        </header>

        {message && <div className="alert success-alert">{message}</div>}
        {error && <div className="alert error-alert">{error}</div>}

        {activePage === 'dashboard' && (
          <section className="page-content">
            <div className="welcome-section">
              <div>
                <p className="eyebrow">
                  {language === 'en' ? 'YOUR FARM, SIMPLIFIED' : 'तपाईंको फार्म, सजिलो व्यवस्थापन'}
                </p>
                <h1>{t.welcome} 👋</h1>
                <p>{t.overview}</p>
              </div>

              <button
                className="primary-button"
                onClick={() => {
                  resetForm();
                  setActivePage('agriculture');
                }}
              >
                + {t.addCrop}
              </button>
            </div>

            <div className="stats-grid">
              <article className="stat-card glass-panel">
                <div className="stat-icon">🌱</div>
                <p>{t.crops}</p>
                <h2>{crops.length}</h2>
                <span>
                  {language === 'en'
                    ? 'Saved in your farm records'
                    : 'फार्ममा सुरक्षित गरिएका बाली'}
                </span>
              </article>

              <article className="stat-card glass-panel">
                <div className="stat-icon">📐</div>
                <p>{t.totalArea}</p>
                <h2>
                  {recordedArea.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </h2>
                <span>
                  {areaUnits.length === 1
                    ? t[areaUnits[0]] || areaUnits[0]
                    : language === 'en'
                      ? 'Mixed units — see crop list'
                      : 'फरक एकाइ — बाली सूची हेर्नुहोस्'}
                </span>
              </article>

              <article className="stat-card glass-panel">
                <div className="stat-icon">🗄️</div>
                <p>MongoDB</p>
                <h2 className="status-value">{databaseStatus}</h2>
                <span>
                  {language === 'en'
                    ? 'Database connection status'
                    : 'डाटाबेस जडानको अवस्था'}
                </span>
              </article>
            </div>

            <section className="glass-panel dashboard-section">
              <div className="section-heading">
                <div>
                  <h2>{t.cropList}</h2>
                  <p>
                    {language === 'en'
                      ? 'Recently recorded crops'
                      : 'हालै रेकर्ड गरिएका बालीहरू'}
                  </p>
                </div>

                <button
                  className="secondary-button"
                  onClick={() => setActivePage('agriculture')}
                >
                  {t.agriculture} →
                </button>
              </div>

              {loading ? (
                <p className="empty-state">{t.loading}</p>
              ) : crops.length === 0 ? (
                <p className="empty-state">{t.noCrops}</p>
              ) : (
                <div className="crop-list">
                  {crops.slice(0, 5).map((crop) => (
                    <div className="crop-row" key={crop._id}>
                      <div className="crop-avatar">🌿</div>
                      <div className="crop-info">
                        <strong>{crop.name}</strong>
                        <span>{crop.type}</span>
                      </div>
                      <div className="crop-area">
                        {crop.area} {t[crop.areaUnit] || crop.areaUnit}
                      </div>
                      <button
                        className="small-button"
                        onClick={() => handleEdit(crop)}
                      >
                        {t.edit}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {dashboardType === 'advanced' && (
              <section className="glass-panel dashboard-section">
                <h2>
                  {language === 'en'
                    ? 'Farm Data Overview'
                    : 'फार्म विवरण'}
                </h2>
                <p>
                  {language === 'en'
                    ? `You have ${crops.length} crop records stored in your database.`
                    : `तपाईंको डाटाबेसमा ${crops.length} वटा बालीका रेकर्ड छन्।`}
                </p>
                <p>
                  {language === 'en'
                    ? 'More advanced farm analysis can be added after the MVP is complete.'
                    : 'MVP पूरा भएपछि थप उन्नत विश्लेषण थप्न सकिन्छ।'}
                </p>
              </section>
            )}
          </section>
        )}

        {activePage === 'agriculture' && (
          <section className="page-content">
            <div className="welcome-section">
              <div>
                <p className="eyebrow">AGRICULTURE MODULE</p>
                <h1>{t.cropManagement}</h1>
                <p>
                  {language === 'en'
                    ? 'Add and manage your crop records.'
                    : 'आफ्ना बालीका विवरण थप्नुहोस् र व्यवस्थापन गर्नुहोस्।'}
                </p>
              </div>
            </div>

            <section className="glass-panel form-panel">
              <div className="section-heading">
                <div>
                  <h2>{editingId ? t.update : t.addCrop}</h2>
                  <p>
                    {language === 'en'
                      ? 'Enter the details below.'
                      : 'तलका विवरणहरू भर्नुहोस्।'}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="crop-form">
                <div className="form-grid">
                  <label>
                    {t.cropName} *
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleInputChange}
                      placeholder={language === 'en' ? 'e.g. Rice' : 'जस्तै: धान'}
                      required
                    />
                  </label>

                  <label>
                    {t.cropType} *
                    <input
                      type="text"
                      name="type"
                      value={form.type}
                      onChange={handleInputChange}
                      placeholder={
                        language === 'en'
                          ? 'e.g. Cereal'
                          : 'जस्तै: अन्नबाली'
                      }
                      required
                    />
                  </label>

                  <label>
                    {t.plantingDate} *
                    <input
                      type="date"
                      name="plantingDate"
                      value={form.plantingDate}
                      onChange={handleInputChange}
                      required
                    />
                  </label>

                  <label>
                    {t.area} *
                    <input
                      type="number"
                      name="area"
                      min="0.01"
                      step="any"
                      value={form.area}
                      onChange={handleInputChange}
                      placeholder="e.g. 2.5"
                      required
                    />
                  </label>

                  <label>
                    {t.areaUnit} *
                    <select
                      name="areaUnit"
                      value={form.areaUnit}
                      onChange={handleInputChange}
                    >
                      <option value="ropani">{t.ropani}</option>
                      <option value="kattha">{t.kattha}</option>
                      <option value="bigha">{t.bigha}</option>
                      <option value="acre">{t.acre}</option>
                      <option value="hectare">{t.hectare}</option>
                    </select>
                  </label>

                  <label className="full-width">
                    {t.notes}
                    <textarea
                      name="notes"
                      value={form.notes}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder={
                        language === 'en'
                          ? 'Additional information (optional)'
                          : 'थप विवरण (ऐच्छिक)'
                      }
                    />
                  </label>
                </div>

                <div className="form-actions">
                  <button
                    className="primary-button"
                    type="submit"
                    disabled={saving}
                  >
                    {saving
                      ? t.loading
                      : editingId
                        ? t.update
                        : t.save}
                  </button>

                  {editingId && (
                    <button
                      className="secondary-button"
                      type="button"
                      onClick={resetForm}
                    >
                      {t.cancel}
                    </button>
                  )}
                </div>
              </form>
            </section>

            <section className="glass-panel dashboard-section">
              <div className="section-heading">
                <div>
                  <h2>{t.cropList}</h2>
                  <p>
                    {language === 'en'
                      ? `${crops.length} crop record(s)`
                      : `जम्मा ${crops.length} वटा बाली`}
                  </p>
                </div>

                <button
                  className="secondary-button"
                  onClick={loadCrops}
                  disabled={loading}
                >
                  ↻ {language === 'en' ? 'Refresh' : 'रिफ्रेस'}
                </button>
              </div>

              {loading ? (
                <p className="empty-state">{t.loading}</p>
              ) : crops.length === 0 ? (
                <p className="empty-state">{t.noCrops}</p>
              ) : (
                <div className="crop-list">
                  {crops.map((crop) => (
                    <article className="crop-row" key={crop._id}>
                      <div className="crop-avatar">🌱</div>

                      <div className="crop-info">
                        <strong>{crop.name}</strong>
                        <span>
                          {crop.type} · {t.plantingDate}:{' '}
                          {crop.plantingDate
                            ? new Date(crop.plantingDate).toLocaleDateString()
                            : '—'}
                        </span>
                        {crop.notes && <span>{crop.notes}</span>}
                      </div>

                      <div className="crop-area">
                        {crop.area} {t[crop.areaUnit] || crop.areaUnit}
                      </div>

                      <div className="row-actions">
                        <button
                          className="small-button"
                          onClick={() => handleEdit(crop)}
                        >
                          {t.edit}
                        </button>

                        <button
                          className="small-button danger-button"
                          onClick={() => handleDelete(crop._id)}
                        >
                          {t.delete}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </section>
        )}

        {activePage === 'livestock' && (
          <section className="page-content">
            <section className="glass-panel placeholder-panel">
              <div className="placeholder-icon">🐄</div>
              <h1>{t.livestock}</h1>
              <p>{t.livestockMessage}</p>
              <button
                className="secondary-button"
                onClick={() => setActivePage('dashboard')}
              >
                ← {t.dashboard}
              </button>
            </section>
          </section>
        )}

        {activePage === 'activities' && (
          <section className="page-content">
            <section className="glass-panel placeholder-panel">
              <div className="placeholder-icon">📅</div>
              <h1>{t.activities}</h1>
              <p>{t.activitiesMessage}</p>
              <button
                className="secondary-button"
                onClick={() => setActivePage('dashboard')}
              >
                ← {t.dashboard}
              </button>
            </section>
          </section>
        )}

        <footer className="app-footer">
          <span>Farmora © 2026</span>
          <span>
            {language === 'en'
              ? 'Growing a better future'
              : 'राम्रो भविष्यका लागि कृषि'}
          </span>
        </footer>
      </main>
    </div>
  );
}

export default App;