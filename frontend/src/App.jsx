import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [apiData, setApiData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/health')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to connect to Farmora API');
        }
        return response.json();
      })
      .then((data) => {
        setApiData(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <main className="app">
      <h1>🌱 Farmora</h1>

      <p className="subtitle">
        Agriculture and Livestock Management System
      </p>

      <section className="status-card">
        <h2>Backend Connection</h2>

        {loading && <p>Connecting to Farmora server...</p>}

        {error && <p className="error">Connection failed: {error}</p>}

        {apiData && (
          <div>
            <p className="success">✅ {apiData.message}</p>
            <p>
              <strong>Server:</strong>{' '}
              {apiData.success ? 'Connected' : 'Error'}
            </p>
            <p>
              <strong>Database:</strong> {apiData.database}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;