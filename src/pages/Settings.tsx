import { useState, useEffect, useRef } from "react";
import { Eye, EyeOff, Save, User, Shield, Settings2, Camera, Mail, Phone, Calendar, Lock, CheckCircle } from "lucide-react";
import Swal from "sweetalert2";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ─── Tab Component (inline, no external dependency) ──────────────────────────
const Tabs = ({
  tabs,
  activeTab,
  onChange,
}: {
  tabs: { id: string; label: string; icon: React.ReactNode }[];
  activeTab: string;
  onChange: (id: string) => void;
}) => (
  <div className="flex gap-1 border-b border-gray-200 mb-6">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-md transition-all duration-150 focus:outline-none
          ${
            activeTab === tab.id
              ? "border-b-2 border-blue-600 text-blue-600 bg-blue-50/60"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
      >
        {tab.icon}
        {tab.label}
      </button>
    ))}
  </div>
);

// ─── Password Input Helper ────────────────────────────────────────────────────
const PasswordInput = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  hint,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
}) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <div className="relative w-full sm:w-96">
        <input
          type={show ? "text" : "password"}
          id={id}
          className="w-full px-3.5 py-2.5 pr-11 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="button"
          tabIndex={-1}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
          onClick={() => setShow((s) => !s)}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  );
};

// ─── Profile Avatar ───────────────────────────────────────────────────────────
const Avatar = ({ name, size = "lg" }: { name: string; size?: "sm" | "lg" }) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const colors = [
    "bg-blue-500",
    "bg-violet-500",
    "bg-emerald-500",
    "bg-amber-500",
    "bg-rose-500",
  ];
  const color = colors[name.charCodeAt(0) % colors.length];
  const sz = size === "lg" ? "w-20 h-20 text-2xl" : "w-10 h-10 text-sm";
  return (
    <div
      className={`${sz} ${color} rounded-full flex items-center justify-center text-white font-semibold select-none`}
    >
      {initials || "?"}
    </div>
  );
};

// ─── Detail Row ───────────────────────────────────────────────────────────────
const DetailRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
    <div className="mt-0.5 text-gray-400">{icon}</div>
    <div className="min-w-0 flex-1">
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
      <p className="text-sm text-gray-800 font-medium mt-0.5 break-all">{value || "—"}</p>
    </div>
  </div>
);

// ─── Main Settings Component ──────────────────────────────────────────────────
const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");

  // Profile
  const [profile, setProfile] = useState<{
    name: string;
    email: string;
    role: string;
    createdAt: string;
    _id: string;
  } | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // Password
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // General settings
  const [siteName, setSiteName] = useState("");
  const [siteDescription, setSiteDescription] = useState("");
  const [timezone, setTimezone] = useState("");
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [isUpdatingGeneral, setIsUpdatingGeneral] = useState(false);

  const navigate = useNavigate();
  const { logout } = useAuth();

  // Load profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/api/auth/me");
        setProfile(data);
      } catch {
        Swal.fire("Error", "Failed to load profile", "error");
      } finally {
        setProfileLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Load general settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data } = await api.get("/api/settings");
        setSiteName(data.siteName);
        setSiteDescription(data.siteDescription);
        setTimezone(data.timezone);
      } catch {
        Swal.fire("Error", "Failed to load settings", "error");
      } finally {
        setSettingsLoading(false);
      }
    };
    loadSettings();
  }, []);

  // ── Password Change ──────────────────────────────────────────────────────────
  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      Swal.fire({ icon: "warning", title: "Missing Fields", text: "Please fill in all password fields." });
      return;
    }
    if (newPassword.length < 6) {
      Swal.fire({ icon: "warning", title: "Weak Password", text: "New password must be at least 6 characters." });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      Swal.fire({ icon: "error", title: "Mismatch", text: "New password and confirmation do not match." });
      return;
    }

    setIsChangingPassword(true);
    try {
      await api.post("/api/auth/change-password", { oldPassword, newPassword });
      Swal.fire({
        icon: "success",
        title: "Password Changed",
        text: "Logging you out…",
        timer: 2000,
        showConfirmButton: false,
      });
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setTimeout(() => { logout(); navigate("/login"); }, 2000);
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error.response?.data?.message || "An error occurred.",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  // ── General Settings Update ──────────────────────────────────────────────────
  const handleGeneralUpdate = async () => {
    setIsUpdatingGeneral(true);
    try {
      await api.put("/api/settings", { siteName, siteDescription, timezone });
      Swal.fire({ icon: "success", title: "Settings Updated", timer: 1500, showConfirmButton: false });
    } catch (error: any) {
      Swal.fire({ icon: "error", title: "Update Failed", text: error.response?.data?.message || "Failed." });
    } finally {
      setIsUpdatingGeneral(false);
    }
  };

  // ── Cancel ───────────────────────────────────────────────────────────────────
  const handleCancel = () => {
    setOldPassword(""); setNewPassword(""); setConfirmNewPassword("");
    api.get("/api/settings").then(({ data }) => {
      setSiteName(data.siteName);
      setSiteDescription(data.siteDescription);
      setTimezone(data.timezone);
    }).catch(() => {});
  };

  // ── Save dispatcher ──────────────────────────────────────────────────────────
  const handleSave = () => {
    if (activeTab === "security") handlePasswordChange();
    else if (activeTab === "general") handleGeneralUpdate();
  };

  // ── Tab definitions ──────────────────────────────────────────────────────────
  const tabDefs = [
    { id: "profile",  label: "Profile",  icon: <User size={15} /> },
    { id: "security", label: "Security", icon: <Shield size={15} /> },
    { id: "general",  label: "General",  icon: <Settings2 size={15} /> },
  ];

  // ── Profile Tab ──────────────────────────────────────────────────────────────
  const profileTab = profileLoading ? (
    <div className="flex justify-center items-center h-40">
      <div className="w-7 h-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  ) : profile ? (
    <div className="space-y-6">
      {/* Avatar + name card */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
        <div className="relative shrink-0">
          <Avatar name={profile.name || profile.email} size="lg" />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 border-2 border-white rounded-full" title="Active" />
        </div>
        <div className="text-center sm:text-left">
          <h2 className="text-xl font-bold text-gray-900">{profile.name || "Unnamed User"}</h2>
          <p className="text-sm text-gray-500 mt-0.5">{profile.email}</p>
          <span
            className={`inline-block mt-2 px-2.5 py-0.5 text-xs font-semibold rounded-full
              ${profile.role === "admin" ? "bg-violet-100 text-violet-700" : "bg-blue-100 text-blue-700"}`}
          >
            {profile.role === "admin" ? "Administrator" : "User"}
          </span>
        </div>
      </div>

      {/* Detail rows */}
      <div className="bg-white border border-gray-100 rounded-xl px-4 divide-y divide-gray-100 shadow-sm">
        <DetailRow icon={<User size={16} />}     label="Full Name"   value={profile.name} />
        <DetailRow icon={<Mail size={16} />}     label="Email"       value={profile.email} />
        <DetailRow icon={<Shield size={16} />}   label="Role"        value={profile.role === "admin" ? "Administrator" : "User"} />
        <DetailRow
          icon={<Calendar size={16} />}
          label="Member Since"
          value={profile.createdAt
            ? new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(profile.createdAt))
            : "—"}
        />
        <DetailRow icon={<Lock size={16} />}     label="Account ID"  value={profile._id} />
      </div>

      <p className="text-xs text-gray-400">
        To update your profile name or email, please contact your administrator.
      </p>
    </div>
  ) : (
    <p className="text-gray-500 text-sm">Could not load profile.</p>
  );

  // ── Security Tab ─────────────────────────────────────────────────────────────
  const securityTab = (
    <div className="space-y-5 max-w-lg">
      <div className="flex items-center gap-2 text-sm text-gray-500 bg-amber-50 border border-amber-100 rounded-lg px-4 py-3">
        <Shield size={15} className="text-amber-500 shrink-0" />
        After changing your password you will be logged out automatically.
      </div>

      <PasswordInput
        id="oldPassword"
        label="Current Password"
        value={oldPassword}
        onChange={setOldPassword}
        placeholder="Enter your current password"
      />
      <PasswordInput
        id="newPassword"
        label="New Password"
        value={newPassword}
        onChange={setNewPassword}
        placeholder="Min. 6 characters"
        hint="Must be at least 6 characters long."
      />
      <PasswordInput
        id="confirmNewPassword"
        label="Confirm New Password"
        value={confirmNewPassword}
        onChange={setConfirmNewPassword}
        placeholder="Re-enter new password"
      />

      {/* strength indicator */}
      {newPassword.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs text-gray-500 font-medium">Password strength</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((n) => {
              const len = newPassword.length;
              const active =
                n === 1 ? len >= 1 :
                n === 2 ? len >= 6 :
                n === 3 ? len >= 10 :
                len >= 14;
              const color =
                len < 6  ? "bg-red-400" :
                len < 10 ? "bg-amber-400" :
                len < 14 ? "bg-blue-400" : "bg-green-400";
              return (
                <div
                  key={n}
                  className={`h-1.5 flex-1 rounded-full transition-all ${active ? color : "bg-gray-200"}`}
                />
              );
            })}
          </div>
          <p className="text-xs text-gray-400">
            {newPassword.length < 6 ? "Weak" : newPassword.length < 10 ? "Fair" : newPassword.length < 14 ? "Good" : "Strong"}
          </p>
        </div>
      )}
    </div>
  );

  // ── General Tab ──────────────────────────────────────────────────────────────
  const generalTab = settingsLoading ? (
    <div className="flex justify-center items-center h-40">
      <div className="w-7 h-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  ) : (
    <div className="space-y-5 max-w-lg">
      <div>
        <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-1.5">
          Site Name
        </label>
        <input
          type="text"
          id="siteName"
          className="block w-full px-3.5 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          value={siteName}
          onChange={(e) => setSiteName(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700 mb-1.5">
          Site Description
        </label>
        <textarea
          id="siteDescription"
          rows={3}
          className="block w-full px-3.5 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
          value={siteDescription}
          onChange={(e) => setSiteDescription(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1.5">
          Timezone
        </label>
        <select
          id="timezone"
          className="block w-full px-3.5 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
        >
          <option value="UTC">UTC (GMT+0)</option>
          <option value="America/New_York">Eastern Time (GMT-5)</option>
          <option value="America/Los_Angeles">Pacific Time (GMT-8)</option>
          <option value="Europe/London">London (GMT+0)</option>
          <option value="Europe/Berlin">Central European Time (GMT+1)</option>
          <option value="Asia/Dubai">Dubai (GMT+4)</option>
          <option value="Asia/Kolkata">India Standard Time (GMT+5:30)</option>
          <option value="Asia/Tokyo">Japan Standard Time (GMT+9)</option>
          <option value="Australia/Sydney">Sydney (GMT+11)</option>
        </select>
      </div>
    </div>
  );

  const tabContent: Record<string, React.ReactNode> = {
    profile: profileTab,
    security: securityTab,
    general: generalTab,
  };

  const showFooter = activeTab === "security" || activeTab === "general";

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Settings</h1>
      </div>

      {/* Card */}
      <div className="bg-white shadow-sm rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-5 sm:p-7">
          {/* Tabs */}
          <Tabs tabs={tabDefs} activeTab={activeTab} onChange={setActiveTab} />

          {/* Tab content */}
          <div className="min-h-[260px]">{tabContent[activeTab]}</div>

          {/* Footer actions — only for editable tabs */}
          {showFooter && (
            <div className="pt-5 mt-6 border-t border-gray-100">
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full sm:w-auto px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isChangingPassword || isUpdatingGeneral}
                  className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-5 py-2.5 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={15} />
                  {isChangingPassword || isUpdatingGeneral ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;