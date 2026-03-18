import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, updateProfileThunk, updatePasswordThunk, uploadPictureThunk } from "@/Redux/profileSlice";
import { User, Lock, Camera, Trash2, Check, Eye, EyeOff } from "lucide-react";

const SectionCard = ({ title, icon, children }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
    <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">{icon}{title}</h2>
    {children}
  </div>
);

const Field = ({ label, value, onChange, type = "text", disabled = false, right }) => (
  <div>
    <label className="text-xs text-gray-500 block mb-1">{label}</label>
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm disabled:bg-gray-50 disabled:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
      />
      {right && <div className="absolute right-3 top-1/2 -translate-y-1/2">{right}</div>}
    </div>
  </div>
);

export default function SettingsPage() {
  const dispatch = useDispatch();
  const { user, loading, successMessage, error } = useSelector((s) => s.profile);

  // Account form
  const [accountForm, setAccountForm] = useState({ full_name: "" });

  // Password form
  const [passwordForm, setPasswordForm] = useState({ old_password: "", new_password: "", confirm_password: "" });
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // Delete confirm
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) setAccountForm({ full_name: user.full_name || "" });
  }, [user]);

  const handleSaveAccount = (e) => {
    e.preventDefault();
    dispatch(updateProfileThunk({ full_name: accountForm.full_name }));
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setPasswordError("Passwords do not match !");
      return;
    }
    dispatch(updatePasswordThunk({
      old_password: passwordForm.old_password,
      new_password: passwordForm.new_password,
    })).then((res) => {
      if (!res.error) {
        setPasswordSuccess("Password updated successfully !");
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

  return (
    <div className="max-w-2xl mx-auto space-y-5 p-6">
      <h1 className="text-xl font-bold text-gray-900">Settings</h1>

      {/* ── Profile Picture ── */}
      <SectionCard title="Profile Photo" icon={<Camera size={15} />}>
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xl font-bold overflow-hidden ring-2 ring-indigo-100">
            {user?.profile_picture
              ? <img src={`http://localhost:5000/${user.profile_picture}`} alt="avatar" className="w-full h-full object-cover" />
              : <span>{user?.full_name?.[0]?.toUpperCase() || "U"}</span>}
          </div>
          <div>
            <label className="cursor-pointer px-4 py-2 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
              Upload New Photo
              <input type="file" accept="image/*" className="hidden" onChange={handlePicture} />
            </label>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG max 2MB</p>
          </div>
        </div>
      </SectionCard>

      {/* ── Account Info ── */}
      <SectionCard title="Account Information" icon={<User size={15} />}>
        {successMessage && (
          <p className="text-xs text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg flex items-center gap-1">
            <Check size={13} /> {successMessage}
          </p>
        )}
        {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

        <form onSubmit={handleSaveAccount} className="space-y-3">
          <Field
            label="Full Name"
            value={accountForm.full_name}
            onChange={(e) => setAccountForm({ ...accountForm, full_name: e.target.value })}
          />
          <Field label="Email" value={user?.email || ""} disabled />
          <Field label="Role" value={user?.role || ""} disabled />
          <button type="submit" disabled={loading}
            className="px-4 py-2 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </SectionCard>

      {/* ── Password ── */}
      <SectionCard title="Change Password" icon={<Lock size={15} />}>
        {passwordError && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{passwordError}</p>}
        {passwordSuccess && (
          <p className="text-xs text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg flex items-center gap-1">
            <Check size={13} /> {passwordSuccess}
          </p>
        )}
        <form onSubmit={handleSavePassword} className="space-y-3">
          <Field
            label="Current Password"
            type={showOld ? "text" : "password"}
            value={passwordForm.old_password}
            onChange={(e) => setPasswordForm({ ...passwordForm, old_password: e.target.value })}
            right={
              <button type="button" onClick={() => setShowOld(!showOld)} className="text-gray-400 hover:text-gray-600">
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
              <button type="button" onClick={() => setShowNew(!showNew)} className="text-gray-400 hover:text-gray-600">
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
          <button type="submit" disabled={loading}
            className="px-4 py-2 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </SectionCard>

      {/* ── Danger Zone ── */}
      <SectionCard title="Danger Zone" icon={<Trash2 size={15} className="text-red-500" />}>
        <p className="text-xs text-gray-500">Once you delete your account, there is no going back.</p>
        {!deleteConfirm
          ? <button onClick={() => setDeleteConfirm(true)}
              className="px-4 py-2 text-xs font-medium border border-red-300 text-red-500 rounded-lg hover:bg-red-50">
              Delete Account
            </button>
          : <div className="space-y-2">
              <p className="text-xs font-medium text-red-600">Are you sure? This action cannot be undone.</p>
              <div className="flex gap-2">
                <button onClick={() => setDeleteConfirm(false)}
                  className="px-4 py-2 text-xs border border-gray-200 rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button className="px-4 py-2 text-xs font-medium bg-red-500 text-white rounded-lg hover:bg-red-600">
                  Yes, Delete
                </button>
              </div>
            </div>
        }
      </SectionCard>

    </div>
  );
}