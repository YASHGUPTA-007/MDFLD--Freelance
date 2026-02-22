'use client';

/**
 * @file app/admin/settings/page.tsx
 * @description Admin Settings Page
 *
 * Three sections:
 * 1. Admin Profile — name, email (read-only), change password
 * 2. Store Settings — store name, support email/phone, logo upload, accent color
 * 3. Security & System — allow registrations toggle, maintenance mode toggle (with confirm)
 */

import React, { useEffect, useState, useRef } from 'react';
import { User, Store, Shield, Eye, EyeOff, Upload, Loader2, Check, X } from 'lucide-react';
import Image from 'next/image';

const ACCENT = '#00d4b6';

interface AdminUser { name: string; email: string; }
interface StoreSettings {
  storeName: string;
  supportEmail: string;
  supportPhone: string;
  accentColor: string;
  allowRegistrations: boolean;
  maintenanceMode: boolean;
  logo?: { url: string; public_id: string };
}
interface Toast { message: string; type: 'success' | 'error'; }

// ─── Toast ────────────────────────────────────────────────────────────────────
function ToastNotification({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 1000,
      background: toast.type === 'success' ? '#1a2e2a' : '#2e1a1a',
      border: `1px solid ${toast.type === 'success' ? ACCENT : '#ff6b6b'}`,
      borderRadius: 10, padding: '14px 20px',
      display: 'flex', alignItems: 'center', gap: 10,
      fontFamily: "'Barlow', sans-serif", fontSize: 13,
      color: toast.type === 'success' ? ACCENT : '#ff6b6b',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    }}>
      {toast.type === 'success' ? <Check size={16} /> : <X size={16} />}
      {toast.message}
    </div>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────
function Card({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: 24 }}>
      <div style={{ padding: '20px 28px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(0,212,182,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={18} color={ACCENT} />
        </div>
        <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, fontWeight: 800, color: '#1a1a1a', letterSpacing: '-0.01em' }}>
          {title}
        </h2>
      </div>
      <div style={{ padding: '28px' }}>
        {children}
      </div>
    </div>
  );
}

// ─── Toggle Switch ────────────────────────────────────────────────────────────
function Toggle({ checked, onChange }: { checked: boolean; onChange: (val: boolean) => void }) {
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        width: 44, height: 24, borderRadius: 12, cursor: 'pointer',
        background: checked ? ACCENT : '#e0e0e0',
        position: 'relative', transition: 'background 0.2s', flexShrink: 0,
      }}
    >
      <div style={{
        position: 'absolute', top: 3,
        left: checked ? 23 : 3,
        width: 18, height: 18, borderRadius: '50%',
        background: '#fff', transition: 'left 0.2s',
        boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
      }} />
    </div>
  );
}

// ─── Field ────────────────────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px',
  border: '1px solid #e5e5e5', borderRadius: 8,
  fontFamily: "'Barlow', sans-serif", fontSize: 14, color: '#1a1a1a',
  outline: 'none', background: '#fafafa',
};
const labelStyle: React.CSSProperties = {
  fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700,
  color: '#666', letterSpacing: '0.07em', textTransform: 'uppercase',
  display: 'block', marginBottom: 6,
};
const saveBtn = (loading: boolean): React.CSSProperties => ({
  background: loading ? '#ccc' : ACCENT, color: '#020606', border: 'none',
  borderRadius: 8, padding: '11px 24px',
  fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 700,
  cursor: loading ? 'not-allowed' : 'pointer',
  display: 'flex', alignItems: 'center', gap: 6,
});

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const [adminUser, setAdminUser] = useState<AdminUser>({ name: '', email: '' });
  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    storeName: '', supportEmail: '', supportPhone: '',
    accentColor: '#00d4b6', allowRegistrations: true, maintenanceMode: false,
  });

  // Profile form
  const [profileName, setProfileName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  // Store form
  const [storeName, setStoreName] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [supportPhone, setSupportPhone] = useState('');
  const [accentColor, setAccentColor] = useState('#00d4b6');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [storeLoading, setStoreLoading] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Security
  const [allowRegistrations, setAllowRegistrations] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [securityLoading, setSecurityLoading] = useState(false);
  const [showMaintenanceConfirm, setShowMaintenanceConfirm] = useState(false);

  const [pageLoading, setPageLoading] = useState(true);
  const [toast, setToast] = useState<Toast | null>(null);
  const showToast = (message: string, type: 'success' | 'error') => setToast({ message, type });

  // ── Fetch ──
  useEffect(() => {
    Promise.all([
      fetch('/api/admin/me').then(r => r.json()),
      fetch('/api/admin/settings').then(r => r.json()),
    ]).then(([userData, settingsData]) => {
      if (userData.user) {
        setAdminUser(userData.user);
        setProfileName(userData.user.name);
      }
      if (settingsData.settings) {
        const s = settingsData.settings;
        setStoreSettings(s);
        setStoreName(s.storeName || '');
        setSupportEmail(s.supportEmail || '');
        setSupportPhone(s.supportPhone || '');
        setAccentColor(s.accentColor || '#00d4b6');
        setAllowRegistrations(s.allowRegistrations ?? true);
        setMaintenanceMode(s.maintenanceMode ?? false);
        if (s.logo?.url) setLogoPreview(s.logo.url);
      }
    }).catch(console.error)
      .finally(() => setPageLoading(false));
  }, []);

  // ── Save Profile ──
  const handleSaveProfile = async () => {
    if (newPassword && newPassword !== confirmPassword)
      return showToast('Passwords do not match', 'error');
    if (newPassword && newPassword.length < 8)
      return showToast('Password must be at least 8 characters', 'error');

    setProfileLoading(true);
    try {
      const body: Record<string, string> = { name: profileName };
      if (newPassword) { body.currentPassword = currentPassword; body.newPassword = newPassword; }

      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) return showToast(data.error || 'Failed to update profile', 'error');

      showToast('Profile updated', 'success');
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch { showToast('Server error', 'error'); }
    finally { setProfileLoading(false); }
  };

  // ── Save Store Settings ──
  const handleSaveStore = async () => {
    setStoreLoading(true);
    try {
      const fd = new FormData();
      fd.append('storeName', storeName);
      fd.append('supportEmail', supportEmail);
      fd.append('supportPhone', supportPhone);
      fd.append('accentColor', accentColor);
      if (logoFile) fd.append('logo', logoFile);

      const res = await fetch('/api/admin/settings', { method: 'PUT', body: fd });
      const data = await res.json();
      if (!res.ok) return showToast(data.error || 'Failed to save settings', 'error');
      showToast('Store settings saved', 'success');
    } catch { showToast('Server error', 'error'); }
    finally { setStoreLoading(false); }
  };

  // ── Save Security ──
  const handleSaveSecurity = async (overrideMaintenanceMode?: boolean) => {
    setSecurityLoading(true);
    try {
      const fd = new FormData();
      fd.append('allowRegistrations', String(allowRegistrations));
      fd.append('maintenanceMode', String(overrideMaintenanceMode ?? maintenanceMode));

      const res = await fetch('/api/admin/settings', { method: 'PUT', body: fd });
      const data = await res.json();
      if (!res.ok) return showToast(data.error || 'Failed to save', 'error');

      if (overrideMaintenanceMode !== undefined) setMaintenanceMode(overrideMaintenanceMode);
      showToast('Security settings saved', 'success');
      setShowMaintenanceConfirm(false);
    } catch { showToast('Server error', 'error'); }
    finally { setSecurityLoading(false); }
  };

  const handleMaintenanceToggle = (val: boolean) => {
    if (val) { setShowMaintenanceConfirm(true); }
    else { setMaintenanceMode(false); handleSaveSecurity(false); }
  };

  if (pageLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400, color: ACCENT, gap: 10 }}>
        <Loader2 size={22} style={{ animation: 'spin 1s linear infinite' }} />
        <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14 }}>Loading settings...</span>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '100%' }}>
      <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Barlow:wght@400;500;600;700&display=swap');
                @keyframes spin { to { transform: rotate(360deg); } }
                input[type="color"] { -webkit-appearance: none; border: none; padding: 0; cursor: pointer; }
                input[type="color"]::-webkit-color-swatch-wrapper { padding: 0; }
                input[type="color"]::-webkit-color-swatch { border: none; border-radius: 4px; }
            `}</style>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 40, fontWeight: 900, color: '#1a1a1a', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
          Settings
        </h1>
        <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: '#999', marginTop: 2 }}>
          Manage your store and admin preferences
        </p>
      </div>

      {/* ── 1. Admin Profile ── */}
      <Card icon={User} title="Admin Profile">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={labelStyle}>Name</label>
              <input style={inputStyle} value={profileName} onChange={e => setProfileName(e.target.value)} placeholder="Your name" />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input style={{ ...inputStyle, background: '#f5f5f5', color: '#aaa', cursor: 'not-allowed' }} value={adminUser.email} readOnly />
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: '#f0f0f0' }} />

          <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 700, color: '#666', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
            Change Password
          </p>

          <div>
            <label style={labelStyle}>Current Password</label>
            <div style={{ position: 'relative' }}>
              <input style={{ ...inputStyle, paddingRight: 40 }} type={showCurrent ? 'text' : 'password'} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="Enter current password" />
              <button onClick={() => setShowCurrent(o => !o)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#aaa' }}>
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={labelStyle}>New Password</label>
              <div style={{ position: 'relative' }}>
                <input style={{ ...inputStyle, paddingRight: 40 }} type={showNew ? 'text' : 'password'} value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Min. 8 characters" />
                <button onClick={() => setShowNew(o => !o)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#aaa' }}>
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label style={labelStyle}>Confirm Password</label>
              <input style={{ ...inputStyle, borderColor: confirmPassword && confirmPassword !== newPassword ? '#ff6b6b' : '#e5e5e5' }} type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Repeat new password" />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={handleSaveProfile} disabled={profileLoading} style={saveBtn(profileLoading)}>
              {profileLoading ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Check size={14} />}
              Save Profile
            </button>
          </div>
        </div>
      </Card>

      {/* ── 2. Store Settings ── */}
      <Card icon={Store} title="Store Settings">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* Logo upload */}
          <div>
            <label style={labelStyle}>Store Logo</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 72, height: 72, borderRadius: 12, border: '1px solid #e5e5e5', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                {logoPreview
                  ? <Image src={logoPreview} alt="Logo" width={72} height={72} style={{ objectFit: 'contain' }} />
                  : <Store size={28} color="#ccc" />
                }
              </div>
              <div>
                <button
                  onClick={() => logoInputRef.current?.click()}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 16px', border: '1px solid #e5e5e5', borderRadius: 8, background: '#fff', cursor: 'pointer', fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 600, color: '#555' }}
                >
                  <Upload size={14} /> Upload Logo
                </button>
                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: '#aaa', marginTop: 6 }}>PNG, JPG up to 2MB</p>
              </div>
            </div>
            <input ref={logoInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
              const f = e.target.files?.[0];
              if (f) { setLogoFile(f); setLogoPreview(URL.createObjectURL(f)); }
            }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={labelStyle}>Store Name</label>
              <input style={inputStyle} value={storeName} onChange={e => setStoreName(e.target.value)} placeholder="e.g. MDFLD Store" />
            </div>
            <div>
              <label style={labelStyle}>Support Email</label>
              <input style={inputStyle} type="email" value={supportEmail} onChange={e => setSupportEmail(e.target.value)} placeholder="support@store.com" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={labelStyle}>Support Phone</label>
              <input style={inputStyle} value={supportPhone} onChange={e => setSupportPhone(e.target.value)} placeholder="+44 7700 000000" />
            </div>
            <div>
              <label style={labelStyle}>Accent Color</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input
                  type="color"
                  value={accentColor}
                  onChange={e => setAccentColor(e.target.value)}
                  style={{ width: 44, height: 44, borderRadius: 8, border: '1px solid #e5e5e5', background: '#fafafa', padding: 4 }}
                />
                <input
                  style={{ ...inputStyle, flex: 1 }}
                  value={accentColor}
                  onChange={e => setAccentColor(e.target.value)}
                  placeholder="#00d4b6"
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={handleSaveStore} disabled={storeLoading} style={saveBtn(storeLoading)}>
              {storeLoading ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Check size={14} />}
              Save Settings
            </button>
          </div>
        </div>
      </Card>

      {/* ── 3. Security & System ── */}
      <Card icon={Shield} title="Security & System">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

          {/* Allow Registrations */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #f0f0f0' }}>
            <div>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>Allow New Registrations</div>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: '#aaa', marginTop: 2 }}>Users can sign up for new accounts</div>
            </div>
            <Toggle checked={allowRegistrations} onChange={setAllowRegistrations} />
          </div>

          {/* Maintenance Mode */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0' }}>
            <div>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 600, color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: 8 }}>
                Maintenance Mode
                {maintenanceMode && <span style={{ fontSize: 10, background: 'rgba(255,107,107,0.12)', color: '#ff6b6b', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>ACTIVE</span>}
              </div>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: '#aaa', marginTop: 2 }}>Show maintenance page to all non-admin visitors</div>
            </div>
            <Toggle checked={maintenanceMode} onChange={handleMaintenanceToggle} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
            <button onClick={() => handleSaveSecurity()} disabled={securityLoading} style={saveBtn(securityLoading)}>
              {securityLoading ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Check size={14} />}
              Save Security
            </button>
          </div>
        </div>
      </Card>

      {/* ── Maintenance Mode Confirm ── */}
      {showMaintenanceConfirm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowMaintenanceConfirm(false)}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, width: '100%', maxWidth: 420, boxShadow: '0 8px 40px rgba(0,0,0,0.12)' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 800, color: '#1a1a1a', marginBottom: 12 }}>Enable Maintenance Mode?</h2>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: '#555', lineHeight: 1.6, marginBottom: 24 }}>
              All non-admin visitors will see a maintenance page. The store will be inaccessible until you turn this off.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowMaintenanceConfirm(false)} style={{ background: 'transparent', color: '#666', border: '1px solid #e5e5e5', borderRadius: 8, padding: '11px 20px', fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={() => { setMaintenanceMode(true); handleSaveSecurity(true); }} style={{ background: '#ff6b6b', color: '#fff', border: 'none', borderRadius: 8, padding: '11px 20px', fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                Enable
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <ToastNotification toast={toast} onClose={() => setToast(null)} />}
    </div>
  );
}