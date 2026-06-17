import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile } from '../../services/auth.service';
import { updateUser } from '../../store/authSlice';

const Icons = {
  user: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  mail: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,12 2,6"/></svg>,
  id: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-4 0v2"/></svg>,
  shield: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  calendar: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  edit: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  save: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17,21 17,13 7,13 7,21"/><polyline points="7,3 7,8 15,8"/></svg>,
  x: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  arrow: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>,
  hash: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>,
};

function formatDate(val) {
  if (!val) return '—';
  try { return new Date(val).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }); }
  catch { return '—'; }
}

export default function Profile() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();

  const [editing, setEditing] = useState(false);
  const [form, setForm]       = useState({ username: user?.username || '', email: user?.email || '' });
  const [saving, setSaving]   = useState(false);
  const [msg, setMsg]         = useState('');
  const [error, setError]     = useState('');

  const startEdit = () => {
    setForm({ username: user?.username || '', email: user?.email || '' });
    setMsg(''); setError('');
    setEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setMsg(''); setError('');
    try {
      const res = await updateProfile(form);
      dispatch(updateUser(res.data?.data || res.data));
      setMsg('Profile updated successfully.');
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update. Please try again.');
    }
    setSaving(false);
  };

  if (!user) return (
    <div className="empty-state">
      <div className="empty-title">No user data</div>
      <div className="empty-desc">Please log in to view your profile.</div>
    </div>
  );

  const initials = (user.username || 'U').substring(0, 2).toUpperCase();
  const isAdmin  = user.role === 'admin';

  const metaItems = [
    { icon: Icons.user,     label: 'Username', value: user.username,              mono: false },
    { icon: Icons.mail,     label: 'Email',    value: user.email,                 mono: false },
    { icon: Icons.shield,   label: 'Role',     value: user.role,                  mono: false },
    { icon: Icons.hash,     label: 'User ID',  value: user._id,                   mono: true  },
    { icon: Icons.calendar, label: 'Joined',   value: formatDate(user.createdAt), mono: false },
    { icon: Icons.calendar, label: 'Updated',  value: formatDate(user.updatedAt), mono: false },
  ];

  const quickLinks = [
    { label: 'Problems',  href: '/dashboard/problems'  },
    { label: 'Solutions', href: '/dashboard/solutions' },
    { label: 'Topics',    href: '/dashboard/topics'    },
    { label: 'Analytics', href: '/dashboard/analytics' },
  ];

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Profile</h1>
          <p className="page-subtitle">Manage your account information</p>
        </div>
      </div>

      {msg   && <div className="success-msg">{msg}</div>}
      {error && <div className="error-msg">{error}</div>}

      {/* ── Hero Card: Avatar + Name + Actions in one row ── */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {/* Avatar */}
          <div style={{
            width: 68, height: 68, borderRadius: '50%',
            background: 'var(--gradient-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, fontWeight: 800, color: 'white', flexShrink: 0,
            boxShadow: '0 6px 20px rgba(0,196,140,0.3)',
            border: '3px solid var(--border)',
            letterSpacing: '-1px',
          }}>
            {initials}
          </div>

          {/* Name + badge */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.4px', marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.username}
            </div>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              fontSize: 12, fontWeight: 700, padding: '3px 12px', borderRadius: 999,
              background: isAdmin ? 'rgba(232,121,170,0.12)' : 'rgba(0,196,140,0.12)',
              color:      isAdmin ? 'var(--accent-pink)'     : 'var(--accent-primary)',
              border:     `1px solid ${isAdmin ? 'rgba(232,121,170,0.25)' : 'rgba(0,196,140,0.25)'}`,
              textTransform: 'capitalize',
            }}>
              {Icons.shield}
              {isAdmin ? 'Administrator' : 'Student'}
            </span>
          </div>

          {/* Edit / Cancel button */}
          {!editing ? (
            <button
              className="btn btn-secondary btn-sm"
              onClick={startEdit}
              style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}
            >
              {Icons.edit} Edit Profile
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setEditing(false)}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                {Icons.x} Cancel
              </button>
              <button
                className="btn btn-primary btn-sm"
                form="profile-form"
                type="submit"
                disabled={saving}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                {Icons.save} {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Inline Edit Form (only shown when editing) ── */}
      {editing && (
        <div className="card" style={{ marginBottom: 16, animation: 'modalIn 0.18s ease' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Update Details
          </div>
          <form id="profile-form" onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Username</label>
                <input
                  className="form-input"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder="Enter username"
                  autoFocus
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Email Address</label>
                <input
                  className="form-input"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Enter email"
                />
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ── Info Grid (6 cells, 3 columns) ── */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
        }}>
          {metaItems.map(({ icon, label, value, mono }, i) => {
            const isLastRow = i >= metaItems.length - 3;
            const isRightCol = (i + 1) % 3 === 0;
            return (
              <div key={label} style={{
                padding: '18px 22px',
                borderBottom: isLastRow ? 'none' : '1px solid var(--border)',
                borderRight:  isRightCol ? 'none' : '1px solid var(--border)',
                background:   Math.floor(i / 3) % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-secondary)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', marginBottom: 8 }}>
                  {icon}
                  <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {label}
                  </span>
                </div>
                <div style={{
                  fontSize: mono ? 11 : 14, fontWeight: 600,
                  color: 'var(--text-primary)',
                  fontFamily: mono ? "'JetBrains Mono', monospace" : 'inherit',
                  wordBreak: 'break-all', lineHeight: 1.4,
                }}>
                  {value || '—'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Quick Navigation ── */}
      <div className="card">
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          Quick Navigation
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {quickLinks.map(({ label, href }) => (
            <a key={href} href={href} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '11px 14px',
              background: 'var(--bg-secondary)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)',
              textDecoration: 'none', fontSize: 13, fontWeight: 600,
              transition: 'all 0.18s',
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-primary)';
                e.currentTarget.style.color = 'var(--accent-primary)';
                e.currentTarget.style.background = 'var(--nav-active-bg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.background = 'var(--bg-secondary)';
              }}
            >
              {label}
              {Icons.arrow}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
