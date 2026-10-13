import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User, 
  Lock, 
  Bell, 
  Share2, 
  AlertTriangle, 
  Check, 
  Printer, 
  ShieldCheck, 
  Smartphone, 
  Laptop, 
  CheckCircle2, 
  Trash2,
  Save
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { currentUser, setCurrentUser, showToast, setIsLoggedIn } = useApp();
  const [activeTab, setActiveTab] = useState<'personal' | 'security' | 'notifications' | 'channels' | 'danger'>('personal');

  // Personal Info Form State
  const [firstName, setFirstName] = useState('Alex');
  const [lastName, setLastName] = useState('Vance');
  const [email, setEmail] = useState(currentUser.email);
  const [companyTagline, setCompanyTagline] = useState(currentUser.tagline);
  const [timezone, setTimezone] = useState(currentUser.timezone);
  const [language, setLanguage] = useState(currentUser.language);

  // Password & Security State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactor, setTwoFactor] = useState(currentUser.twoFactorEnabled);

  // Notification Preferences State
  const [emailDigest, setEmailDigest] = useState(currentUser.notificationPreferences.emailDigest);
  const [campaignAlerts, setCampaignAlerts] = useState(currentUser.notificationPreferences.campaignAlerts);
  const [securityWarnings, setSecurityWarnings] = useState(currentUser.notificationPreferences.securityWarnings);
  const [marketingUpdates, setMarketingUpdates] = useState(currentUser.notificationPreferences.marketingUpdates);

  // Sessions
  const [sessions, setSessions] = useState([
    { id: '1', device: 'MacBook Pro • San Francisco, US', sub: 'Active now • Chrome 122.0', current: true },
    { id: '2', device: 'iPhone 15 Pro • San Francisco, US', sub: '2 hours ago • SocialFlow iOS App', current: false }
  ]);

  const handleRevokeSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    showToast('Session revoked successfully.');
  };

  const handleSaveProfile = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setCurrentUser(prev => ({
      ...prev,
      name: `${firstName} ${lastName}`.trim(),
      email,
      tagline: companyTagline,
      timezone,
      language,
      twoFactorEnabled: twoFactor,
      notificationPreferences: {
        emailDigest,
        campaignAlerts,
        securityWarnings,
        marketingUpdates
      }
    }));
    showToast('Profile and settings saved successfully.');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? All funds, active orders, and data will be permanently wiped.')) {
      setIsLoggedIn(false);
      showToast('Account successfully removed.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Profile Header Banner (Reference 9) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-blue-600 text-white font-black text-xl flex items-center justify-center shadow-md">
            {firstName.charAt(0)}{lastName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100">
                PRO WORKSPACE
              </span>
              <span className="text-xs text-slate-500 font-medium">· Verified Agency</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {firstName} {lastName}
            </h2>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
              <span>{email}</span>
              <span>·</span>
              <span className="font-mono">Member ID: #SF-9043</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Profile</span>
          </button>
          <button
            onClick={() => handleSaveProfile()}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* 2-Column Layout: Left Navigation + Right Content (Reference 9) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Tabs (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 space-y-1">
          <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400 px-3 mb-2 block">
            Settings Navigation
          </span>

          <button
            onClick={() => setActiveTab('personal')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors text-left ${
              activeTab === 'personal'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Personal Information</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors text-left ${
              activeTab === 'security'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Password & Security</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors text-left ${
              activeTab === 'notifications'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notification Preferences</span>
          </button>

          <button
            onClick={() => setActiveTab('channels')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors text-left ${
              activeTab === 'channels'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>Connected Apps & Channels</span>
          </button>

          <button
            onClick={() => setActiveTab('danger')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors text-left ${
              activeTab === 'danger'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-rose-600 hover:bg-rose-50'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Danger Zone</span>
          </button>
        </div>

        {/* Right Form Panels (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
          {/* TAB 1: Personal Information */}
          {activeTab === 'personal' && (
            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Personal Information</h3>
                <p className="text-xs text-slate-400">Update your public profile details and contact information.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Bio / Company Tagline</label>
                <textarea
                  rows={3}
                  value={companyTagline}
                  onChange={e => setCompanyTagline(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Timezone</label>
                  <select
                    value={timezone}
                    onChange={e => setTimezone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                  >
                    <option value="(GMT-08:00) Pacific Time (US & Canada)">(GMT-08:00) Pacific Time</option>
                    <option value="(GMT-05:00) Eastern Time">(GMT-05:00) Eastern Time</option>
                    <option value="(GMT+00:00) UTC / London">(GMT+00:00) UTC / London</option>
                    <option value="(GMT+05:30) Mumbai, New Delhi">(GMT+05:30) Mumbai, New Delhi</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Language</label>
                  <select
                    value={language}
                    onChange={e => setLanguage(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                  >
                    <option value="English (United States)">English (United States)</option>
                    <option value="English (UK)">English (UK)</option>
                    <option value="Spanish">Spanish</option>
                    <option value="German">German</option>
                  </select>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                >
                  Save Profile Information
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: Password & Security */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Password & Security</h3>
                <p className="text-xs text-slate-400">Manage your credentials, 2-factor authentication, and sessions.</p>
              </div>

              {/* Password update form */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Current Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    />
                  </div>
                </div>
                <button
                  onClick={() => { showToast('Password updated successfully.'); setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); }}
                  className="py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors"
                >
                  Update Password
                </button>
              </div>

              {/* 2FA Toggle */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Two-Factor Authentication (2FA)</span>
                  <span className="text-[11px] text-slate-500">Secure your account with authenticator app code verification</span>
                </div>
                <button
                  type="button"
                  onClick={() => { setTwoFactor(!twoFactor); showToast(`2FA ${!twoFactor ? 'enabled' : 'disabled'}`); }}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    twoFactor ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      twoFactor ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Active Sessions */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-slate-900 block">Active Sessions</span>
                {sessions.map(s => (
                  <div key={s.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      {s.device.includes('iPhone') ? <Smartphone className="w-4 h-4 text-slate-400" /> : <Laptop className="w-4 h-4 text-slate-400" />}
                      <div>
                        <span className="font-bold text-slate-900 block">{s.device}</span>
                        <span className="text-[11px] text-slate-400">{s.sub}</span>
                      </div>
                    </div>
                    {s.current ? (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700">
                        Current Device
                      </span>
                    ) : (
                      <button
                        onClick={() => handleRevokeSession(s.id)}
                        className="text-xs text-rose-600 hover:underline font-semibold"
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Notification Preferences */}
          {activeTab === 'notifications' && (
            <div className="space-y-5">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Notification Preferences</h3>
                <p className="text-xs text-slate-400">Choose how and when you want to receive alerts and summaries.</p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <span className="font-bold text-slate-900 block">Email Digest</span>
                    <span className="text-[11px] text-slate-500">Receive weekly performance summaries and analytics breakdowns</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailDigest}
                    onChange={e => setEmailDigest(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 accent-emerald-600 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <span className="font-bold text-slate-900 block">Campaign Alerts</span>
                    <span className="text-[11px] text-slate-500">Instant alerts when scheduled campaigns finish or require refills</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={campaignAlerts}
                    onChange={e => setCampaignAlerts(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 accent-emerald-600 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <span className="font-bold text-slate-900 block">Security & Login Warnings</span>
                    <span className="text-[11px] text-slate-500">Get notified immediately upon new sign-ins from unrecognized devices</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={securityWarnings}
                    onChange={e => setSecurityWarnings(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 accent-emerald-600 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <span className="font-bold text-slate-900 block">Marketing & Feature Updates</span>
                    <span className="text-[11px] text-slate-500">News about new SocialFlow tools, templates, and platform releases</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={marketingUpdates}
                    onChange={e => setMarketingUpdates(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 accent-emerald-600 rounded"
                  />
                </div>
              </div>

              <button
                onClick={() => handleSaveProfile()}
                className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                Save Preferences
              </button>
            </div>
          )}

          {/* TAB 4: Connected Apps */}
          {activeTab === 'channels' && (
            <div className="space-y-5">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Connected Social Channels</h3>
                <p className="text-xs text-slate-400">Manage OAuth authorization tokens and connected networks.</p>
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 font-bold flex items-center justify-center text-xs">
                      IG
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Instagram Business (@vancemedia)</span>
                      <span className="text-[11px] text-slate-400">Connected 2 months ago • Token active</span>
                    </div>
                  </div>
                  <button
                    onClick={() => showToast('Reconnected to Instagram Graph API')}
                    className="px-3 py-1.5 text-xs font-bold bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700"
                  >
                    Reconnect
                  </button>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-xs">
                      LI
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">LinkedIn Company Page (Vance Media Agency)</span>
                      <span className="text-[11px] text-slate-400">Connected 1 month ago • Token active</span>
                    </div>
                  </div>
                  <button
                    onClick={() => showToast('Reconnected to LinkedIn Marketing API')}
                    className="px-3 py-1.5 text-xs font-bold bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700"
                  >
                    Reconnect
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Danger Zone */}
          {activeTab === 'danger' && (
            <div className="space-y-5">
              <div className="pb-3 border-b border-rose-100">
                <h3 className="text-base font-bold text-rose-600">Danger Zone</h3>
                <p className="text-xs text-slate-500">Permanent actions regarding your workspace and account data.</p>
              </div>

              <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Deactivate or Delete Account</span>
                  <span className="text-[11px] text-slate-600">
                    Once you delete your account, all campaigns, queued posts, and analytics history will be permanently wiped.
                  </span>
                </div>
                <button
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0"
                >
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
