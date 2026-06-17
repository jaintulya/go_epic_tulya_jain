import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTheme } from '../../store/ThemeContext';
import { searchProblems, searchTopics, searchSolutions } from '../../services/stats.service';

export default function Topbar({ title }) {
  const { user } = useSelector((s) => s.auth);
  const { theme, toggleTheme } = useTheme();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();
  const timer = useRef(null);
  const dropdownRef = useRef(null);

  const doSearch = async (q) => {
    if (!q.trim()) { setResults(null); return; }
    setSearching(true);
    try {
      const [p, t, s] = await Promise.allSettled([
        searchProblems(q, { limit: 3 }),
        searchTopics(q),
        searchSolutions(q),
      ]);
      setResults({
        problems: p.status === 'fulfilled' ? (p.value.data?.data || []).slice(0, 3) : [],
        topics:   t.status === 'fulfilled' ? (t.value.data?.data || []).slice(0, 3) : [],
        solutions: s.status === 'fulfilled' ? (s.value.data?.data || []).slice(0, 3) : [],
      });
    } catch {
      setResults(null);
    }
    setSearching(false);
  };

  const onChange = (e) => {
    setQuery(e.target.value);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => doSearch(e.target.value), 500);
  };

  const clearSearch = () => { setQuery(''); setResults(null); };
  const goTo = (path) => { navigate(path); clearSearch(); };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setResults(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  const dropdownStyle = {
    position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0,
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-lg)',
    zIndex: 200, overflow: 'hidden',
    animation: 'modalIn 0.15s ease',
  };

  const resultItemStyle = {
    padding: '9px 16px', cursor: 'pointer',
    fontSize: 13, color: 'var(--text-secondary)',
    borderTop: '1px solid var(--border)',
    transition: 'background 0.15s ease',
  };

  return (
    <header className="topbar">
      <span className="topbar-title">{title || 'Dashboard'}</span>

      {/* Global Search */}
      <div style={{ position: 'relative', flex: '0 0 auto' }} ref={dropdownRef}>
        <div className="search-bar" style={{ width: 300 }}>
          <span className="search-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </span>
          <input
            value={query}
            onChange={onChange}
            placeholder="Search problems, topics..."
          />
          {query && (
            <button onClick={clearSearch} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 14, lineHeight: 1, padding: 2 }}>✕</button>
          )}
        </div>

        {/* Dropdown Results */}
        {results && (
          <div style={dropdownStyle}>
            {searching && (
              <div style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                Searching...
              </div>
            )}
            {!searching && results.problems.length === 0 && results.topics.length === 0 && results.solutions.length === 0 && (
              <div style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: 13, textAlign: 'center' }}>
                No results for "<strong>{query}</strong>"
              </div>
            )}
            {results.problems.length > 0 && (
              <div>
                <div style={{ padding: '8px 16px 4px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Problems</div>
                {results.problems.map((p) => (
                  <div key={p._id}
                    style={resultItemStyle}
                    onClick={() => goTo(`/dashboard/problems/${p._id}`)}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--nav-hover-bg)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{p.instruction?.substring(0, 55)}...</span>
                  </div>
                ))}
              </div>
            )}
            {results.topics.length > 0 && (
              <div>
                <div style={{ padding: '8px 16px 4px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', borderTop: '1px solid var(--border)' }}>Topics</div>
                {results.topics.map((t) => (
                  <div key={t._id}
                    style={resultItemStyle}
                    onClick={() => goTo('/dashboard/topics')}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--nav-hover-bg)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{t.name}</span>
                    <span style={{ color: 'var(--text-muted)', marginLeft: 8, fontSize: 12 }}>— {t.category}</span>
                  </div>
                ))}
              </div>
            )}
            <div style={{ padding: '8px 16px', borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
              <button
                onClick={() => { navigate(`/dashboard/search?q=${encodeURIComponent(query)}`); clearSearch(); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-primary)', fontSize: 13, fontWeight: 600, fontFamily: 'Outfit, sans-serif' }}
              >
                View all results →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="topbar-actions">
        {/* Theme Toggle */}
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {/* Profile Avatar */}
        <div
          className="topbar-avatar"
          onClick={() => navigate('/dashboard/profile')}
          title="My Profile"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/dashboard/profile')}
        >
          {user?.username?.substring(0, 2).toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  );
}
