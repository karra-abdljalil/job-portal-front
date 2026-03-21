import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, updateProfileThunk, updatePasswordThunk, uploadPictureThunk } from "@/Redux/profileSlice";
import { User, Lock, Camera, Trash2, Check, Eye, EyeOff, Shield, AlertTriangle } from "lucide-react";

const Field = ({ label, value, onChange, type = "text", disabled = false, right, placeholder = "" }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block">{label}</label>
    <div className="relative">
      <input
        type={type} value={value} onChange={onChange} disabled={disabled} placeholder={placeholder}
        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm disabled:bg-slate-50 disabled:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all bg-white"
      />
      {right && <div className="absolute right-3 top-1/2 -translate-y-1/2">{right}</div>}
    </div>
  </div>
);
export default function SettingsPage() {
  const dispatch = useDispatch();
  const { user, loading, successMessage, error } = useSelector((s) => s.profile);

  const [accountForm, setAccountForm] = useState({ full_name: "" });
  const [passwordForm, setPasswordForm] = useState({ old_password: "", new_password: "", confirm_password: "" });
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState("account");

  useEffect(() => { dispatch(fetchProfile()); }, [dispatch]);
  useEffect(() => { if (user) setAccountForm({ full_name: user.full_name || "" }); }, [user]);

  const handleSaveAccount = (e) => {
    e.preventDefault();
    dispatch(updateProfileThunk({ full_name: accountForm.full_name }));
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    setPasswordError(""); setPasswordSuccess("");
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setPasswordError("Passwords do not match!");
      return;
    }
    dispatch(updatePasswordThunk({
      old_password: passwordForm.old_password,
      new_password: passwordForm.new_password,
    })).then((res) => {
      if (!res.error) {
        setPasswordSuccess("Password updated successfully!");
        setPasswordForm({ old_password: "", new_password: "", confirm_password: "" });
      } else {
        setPasswordError("Old password is incorrect.");
      }
    });
  };

  const handlePicture = (e) => {
    const file = e.target.files[0];
    if (file) dispatch(uploadPictureThunk(file));
  };

  const TABS = [
    { id: "account", label: "Account", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "danger", label: "Danger Zone", icon: AlertTriangle },
  ];



  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* ── Page Header ── */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your account preferences and security</p>
        </div>

        <div className="flex gap-6">

          {/* ── Left Tabs ── */}
          <div className="w-52 shrink-0">
            <nav className="space-y-1">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === id
                      ? id === "danger"
                        ? "bg-red-50 text-red-600"
                        : "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Icon size={16} className={activeTab === id && id === "danger" ? "text-red-500" : ""} />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* ── Right Content ── */}
          <div className="flex-1 space-y-5">

            {/* ── Account Tab ── */}
            {activeTab === "account" && (
              <>
                {/* Profile Photo */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Camera size={15} className="text-blue-600" />
                    </div>
                    <h2 className="text-sm font-bold text-slate-800">Profile Photo</h2>
                  </div>
                  <div className="flex items-center gap-5">
                    <div className="w-18 h-18 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold overflow-hidden ring-2 ring-blue-100" style={{ width: 72, height: 72 }}>
                      {user?.profile_picture
                        ? <img src={`http://localhost:5000/${user.profile_picture}`} alt="avatar" className="w-full h-full object-cover" />
                        : <span>{user?.full_name?.[0]?.toUpperCase() || "U"}</span>}
                    </div>
                    <div className="space-y-2">
                      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                        <Camera size={13} /> Upload New Photo
                        <input type="file" accept="image/*" className="hidden" onChange={handlePicture} />
                      </label>
                      <p className="text-xs text-slate-400">JPG, PNG · Max 2MB</p>
                    </div>
                  </div>
                </div>

                {/* Account Info */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                      <User size={15} className="text-blue-600" />
                    </div>
                    <h2 className="text-sm font-bold text-slate-800">Account Information</h2>
                  </div>

                  {successMessage && (
                    <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 px-4 py-2.5 rounded-xl mb-4">
                      <Check size={13} /> {successMessage}
                    </div>
                  )}
                  {error && (
                    <div className="text-xs text-red-600 bg-red-50 border border-red-100 px-4 py-2.5 rounded-xl mb-4">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSaveAccount} className="space-y-4">
                    <Field
                      label="Full Name"
                      value={accountForm.full_name}
                      onChange={(e) => setAccountForm({ ...accountForm, full_name: e.target.value })}
                      placeholder="Your full name"
                    />
                    <Field label="Email" value={user?.email || ""} disabled />
                    <Field label="Role" value={user?.role?.replace("_", " ") || ""} disabled />
                    <div className="pt-1">
                      <button type="submit" disabled={loading}
                        className="px-5 py-2.5 text-xs font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors">
                        {loading ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}

            {/* ── Security Tab ── */}
            {activeTab === "security" && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Lock size={15} className="text-blue-600" />
                  </div>
                  <h2 className="text-sm font-bold text-slate-800">Change Password</h2>
                </div>

                {passwordError && (
                  <div className="text-xs text-red-600 bg-red-50 border border-red-100 px-4 py-2.5 rounded-xl mb-4">
                    {passwordError}
                  </div>
                )}
                {passwordSuccess && (
                  <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 px-4 py-2.5 rounded-xl mb-4">
                    <Check size={13} /> {passwordSuccess}
                  </div>
                )}

                <form onSubmit={handleSavePassword} className="space-y-4">
                  <Field
                    label="Current Password"
                    type={showOld ? "text" : "password"}
                    value={passwordForm.old_password}
                    onChange={(e) => setPasswordForm({ ...passwordForm, old_password: e.target.value })}
                    right={
                      <button type="button" onClick={() => setShowOld(!showOld)} className="text-slate-400 hover:text-slate-600">
                        {showOld ? <Eye size={15} /> : <EyeOff size={15} />}
                      </button>
                    }
                  />
                  <Field
                    label="New Password"
                    type={showNew ? "text" : "password"}
                    value={passwordForm.new_password}
                    onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                    right={
                      <button type="button" onClick={() => setShowNew(!showNew)} className="text-slate-400 hover:text-slate-600">
                        {showNew ? <Eye size={15} /> : <EyeOff size={15} />}
                      </button>
                    }
                  />
                  <Field
                    label="Confirm New Password"
                    type="password"
                    value={passwordForm.confirm_password}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                  />

                  {/* Password requirements */}
                  <div className="bg-slate-50 rounded-xl p-3 space-y-1">
                    <p className="text-xs font-semibold text-slate-500 mb-2">Password requirements:</p>
                    {[
                      "At least 8 characters",
                      "One uppercase letter",
                      "One number",
                      "One special character (@$!%*?&)"
                    ].map((req) => (
                      <p key={req} className="text-xs text-slate-400 flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-slate-300 inline-block" /> {req}
                      </p>
                    ))}
                  </div>

                  <div className="pt-1">
                    <button type="submit" disabled={loading}
                      className="px-5 py-2.5 text-xs font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors">
                      {loading ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ── Danger Zone Tab ── */}
            {activeTab === "danger" && (
              <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                    <AlertTriangle size={15} className="text-red-500" />
                  </div>
                  <h2 className="text-sm font-bold text-slate-800">Danger Zone</h2>
                </div>

                <div className="bg-red-50 border border-red-100 rounded-xl p-4 space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-red-700">Delete Account</p>
                    <p className="text-xs text-red-500 mt-1">
                      Once you delete your account, all your data will be permanently removed. This action cannot be undone.
                    </p>
                  </div>

                  {!deleteConfirm
                    ? <button onClick={() => setDeleteConfirm(true)}
                        className="px-4 py-2 text-xs font-semibold border border-red-300 text-red-600 rounded-xl hover:bg-red-100 transition-colors">
                        Delete My Account
                      </button>
                    : <div className="space-y-3">
                        <p className="text-xs font-semibold text-red-700">
                          ⚠️ Are you absolutely sure? This cannot be undone.
                        </p>
                        <div className="flex gap-2">
                          <button onClick={() => setDeleteConfirm(false)}
                            className="px-4 py-2 text-xs font-semibold border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                            Cancel
                          </button>
                          <button className="px-4 py-2 text-xs font-semibold bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors">
                            Yes, Delete My Account
                          </button>
                        </div>
                      </div>
                  }
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}