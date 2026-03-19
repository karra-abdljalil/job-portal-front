import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, updateProfileThunk, uploadPictureThunk } from "@/Redux/profileSlice";
import { fetchMySkills, fetchAllSkills, addSkillThunk, removeSkillThunk, createSkillThunk } from "@/Redux/skillSlice";
import { fetchExperiences, addExperienceThunk, updateExperienceThunk, deleteExperienceThunk } from "@/Redux/experienceSlice";
import { fetchEducations, addEducationThunk, updateEducationThunk, deleteEducationThunk } from "@/Redux/educationSlice";
import { fetchLanguages, addLanguageThunk, deleteLanguageThunk } from "@/Redux/languageSlice";
import { fetchCertifications, createCertificationThunk, updateCertificationThunk, deleteCertificationThunk } from "@/Redux/certificationSlice";
import {
  Code2, Briefcase, GraduationCap, Award, Globe2, Star,
  Pencil, Plus, Trash2, X, Check, Camera, MapPin, Mail,
  Building2, Calendar, Link, Hash, ChevronRight, Terminal
} from "lucide-react";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const colors = {
  primary: "#2563EB",
  primaryLight: "#DBEAFE",
  primaryMid: "#93C5FD",
  accent: "#0EA5E9",
  text: "#0F172A",
  textMid: "#475569",
  textLight: "#94A3B8",
  border: "#E2E8F0",
  bg: "#F8FAFC",
  white: "#FFFFFF",
  success: "#10B981",
  successLight: "#D1FAE5",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const Avatar = ({ user }) => (
  <div style={{
    width: 88, height: 88, borderRadius: "50%",
    background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "white", fontSize: 32, fontWeight: 700,
    overflow: "hidden", border: "3px solid white",
    boxShadow: "0 4px 20px rgba(37,99,235,0.25)"
  }}>
    {user?.profile_picture
      ? <img src={`http://localhost:5000/${user.profile_picture}`} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      : <span>{user?.full_name?.[0]?.toUpperCase() || "U"}</span>}
  </div>
);

const Tag = ({ children, color = colors.primaryLight, textColor = colors.primary }) => (
  <span style={{
    background: color, color: textColor,
    padding: "3px 10px", borderRadius: 20,
    fontSize: 11, fontWeight: 600, letterSpacing: "0.02em"
  }}>
    {children}
  </span>
);

const Card = ({ children, style = {} }) => (
  <div style={{
    background: colors.white, borderRadius: 14,
    border: `1px solid ${colors.border}`,
    boxShadow: "0 1px 4px rgba(15,23,42,0.06)",
    padding: 24, ...style
  }}>
    {children}
  </div>
);

const SectionHeader = ({ icon: Icon, title, onAdd }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8,
        background: colors.primaryLight,
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <Icon size={16} color={colors.primary} />
      </div>
      <span style={{ fontSize: 14, fontWeight: 700, color: colors.text, letterSpacing: "-0.01em" }}>{title}</span>
    </div>
    {onAdd && (
      <button onClick={onAdd} style={{
        display: "flex", alignItems: "center", gap: 4,
        fontSize: 12, fontWeight: 600, color: colors.primary,
        background: colors.primaryLight, border: "none",
        padding: "5px 10px", borderRadius: 8, cursor: "pointer"
      }}>
        <Plus size={13} /> Add
      </button>
    )}
  </div>
);

const Modal = ({ title, onClose, children }) => (
  <div style={{
    position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)",
    zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16
  }}>
    <div style={{
      background: colors.white, borderRadius: 18,
      boxShadow: "0 20px 60px rgba(15,23,42,0.2)",
      width: "100%", maxWidth: 480, padding: 28
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: colors.text }}>{title}</span>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: colors.textLight }}>
          <X size={18} />
        </button>
      </div>
      {children}
    </div>
  </div>
);

const Input = ({ label, value, onChange, type = "text", disabled = false, placeholder = "" }) => (
  <div style={{ marginBottom: 12 }}>
    <label style={{ fontSize: 11, fontWeight: 600, color: colors.textMid, display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>
      {label}
    </label>
    <input
      type={type} value={value} onChange={onChange} disabled={disabled} placeholder={placeholder}
      style={{
        width: "100%", padding: "9px 12px", fontSize: 13,
        border: `1.5px solid ${disabled ? colors.bg : colors.border}`,
        borderRadius: 9, outline: "none", boxSizing: "border-box",
        background: disabled ? colors.bg : colors.white,
        color: disabled ? colors.textLight : colors.text,
        transition: "border-color 0.15s"
      }}
      onFocus={e => !disabled && (e.target.style.borderColor = colors.primary)}
      onBlur={e => e.target.style.borderColor = colors.border}
    />
  </div>
);

const Btn = ({ children, onClick, variant = "primary", type = "button", disabled = false, style = {} }) => {
  const styles = {
    primary: { background: colors.primary, color: "white", border: "none" },
    outline: { background: "white", color: colors.primary, border: `1.5px solid ${colors.primary}` },
    ghost: { background: "transparent", color: colors.textMid, border: "none" },
    danger: { background: "#FEF2F2", color: "#DC2626", border: "none" },
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{
      ...styles[variant], padding: "9px 16px", borderRadius: 9,
      fontSize: 12, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
      display: "flex", alignItems: "center", gap: 6, opacity: disabled ? 0.5 : 1,
      transition: "opacity 0.15s", ...style
    }}>
      {children}
    </button>
  );
};

const Divider = () => <div style={{ height: 1, background: colors.border, margin: "14px 0" }} />;

// ─── Constants ────────────────────────────────────────────────────────────────
const EMPTY_EXP = { job_title: "", company_name: "", description: "", start_date: "", end_date: "" };
const EMPTY_EDU = { title: "", university: "", degree: "Bachelor", start_date: "", end_date: "" };
const EMPTY_LANG = { language: "", level: "Beginner" };
const EMPTY_CERT = { title: "", issuer: "", credential_id: "", credential_url: "", obtained_at: "", expires_at: "" };
const DEGREES = ["Bachelor", "Master", "PhD", "Associate", "High School", "Other"];
const LEVELS = ["Beginner", "Intermediate", "Advanced", "Fluent", "Native"];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((s) => s.profile);
  const { mySkills, allSkills } = useSelector((s) => s.skills);
  const { items: experiences } = useSelector((s) => s.experiences);
  const { items: educations } = useSelector((s) => s.educations);
  const { items: languages } = useSelector((s) => s.languages);
  const { items: certifications } = useSelector((s) => s.certifications);

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ full_name: "" });
  const [expModal, setExpModal] = useState(null);
  const [eduModal, setEduModal] = useState(null);
  const [langModal, setLangModal] = useState(null);
  const [certModal, setCertModal] = useState(null);
  const [skillOpen, setSkillOpen] = useState(false);
  const [expForm, setExpForm] = useState(EMPTY_EXP);
  const [eduForm, setEduForm] = useState(EMPTY_EDU);
  const [langForm, setLangForm] = useState(EMPTY_LANG);
  const [certForm, setCertForm] = useState(EMPTY_CERT);
  const [certFile, setCertFile] = useState(null);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState("");

  useEffect(() => {
    const load = async () => {
      await dispatch(fetchProfile());
      await dispatch(fetchMySkills());
      await dispatch(fetchAllSkills());
      await dispatch(fetchExperiences());
      await dispatch(fetchEducations());
      await dispatch(fetchLanguages());
      await dispatch(fetchCertifications());
    };
    load();
  }, [dispatch]);

  useEffect(() => {
    if (user) setForm({ full_name: user.full_name || "" });
  }, [user]);

  const handleSaveProfile = () => { dispatch(updateProfileThunk(form)); setEditMode(false); };
  const handlePicture = (e) => { const f = e.target.files[0]; if (f) dispatch(uploadPictureThunk(f)); };
  const handleCreateSkill = () => {
    if (!newSkillName || !newSkillCategory) return;
    dispatch(createSkillThunk({ name: newSkillName, category: newSkillCategory })).then((res) => {
      if (!res.error) {
        setNewSkillName(""); setNewSkillCategory("");
        dispatch(fetchAllSkills()).then((result) => {
          const s = result.payload?.skills?.find((s) => s.name.toLowerCase() === newSkillName.toLowerCase());
          if (s) dispatch(addSkillThunk(s.id));
        });
      }
    });
  };

  const openEditExp = (exp) => { setExpForm({ ...exp }); setExpModal(exp); };
  const openAddExp = () => { setExpForm(EMPTY_EXP); setExpModal("add"); };
  const handleSaveExp = () => {
    if (expModal === "add") dispatch(addExperienceThunk(expForm));
    else dispatch(updateExperienceThunk({ id: expModal.id, payload: expForm }));
    setExpModal(null);
  };

  const openEditEdu = (edu) => { setEduForm({ ...edu }); setEduModal(edu); };
  const openAddEdu = () => { setEduForm(EMPTY_EDU); setEduModal("add"); };
  const handleSaveEdu = () => {
    if (eduModal === "add") dispatch(addEducationThunk(eduForm));
    else dispatch(updateEducationThunk({ id: eduModal.id, payload: eduForm }));
    setEduModal(null);
  };

  const openAddLang = () => { setLangForm(EMPTY_LANG); setLangModal("add"); };
  const handleSaveLang = () => { dispatch(addLanguageThunk(langForm)); setLangModal(null); };

  const openAddCert = () => { setCertForm(EMPTY_CERT); setCertFile(null); setCertModal("add"); };
  const openEditCert = (cert) => { setCertForm({ ...cert }); setCertModal(cert); };
  const handleSaveCert = () => {
    if (certModal === "add") {
      const fd = new FormData();
      Object.entries(certForm).forEach(([k, v]) => { if (v) fd.append(k, v); });
      if (certFile) fd.append("certif", certFile);
      dispatch(createCertificationThunk(fd));
    } else {
      const { id, user_id, createdAt, updatedAt, certif_path, created_at, updated_at, ...clean } = certForm;
      const final = Object.fromEntries(Object.entries(clean).filter(([, v]) => v !== "" && v != null));
      dispatch(updateCertificationThunk({ id: certModal.id, payload: final }));
    }
    setCertModal(null);
  };

  const mySkillIds = mySkills.map((s) => s.id);

  if (loading && !user) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300 }}>
      <div style={{ width: 36, height: 36, border: `3px solid ${colors.primaryLight}`, borderTopColor: colors.primary, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    </div>
  );

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 20px", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>

      {/* ── Header ── */}
      <div style={{
        background: `linear-gradient(135deg, #1D4ED8 0%, #0EA5E9 100%)`,
        borderRadius: 18, overflow: "hidden", marginBottom: 20,
        boxShadow: "0 4px 24px rgba(29,78,216,0.2)"
      }}>
        {/* Top dots decoration */}
        <div style={{ padding: "28px 28px 20px", position: "relative" }}>
          <div style={{ position: "absolute", top: 16, right: 20, display: "flex", gap: 6, opacity: 0.3 }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "white" }} />
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 18 }}>
              <Avatar user={user} />
              <div style={{ paddingBottom: 4 }}>
                <h1 style={{ color: "white", fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>
                  {user?.full_name}
                </h1>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 5 }}>
                  <span style={{
                    background: "rgba(255,255,255,0.2)", color: "white",
                    padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                    textTransform: "capitalize", backdropFilter: "blur(4px)"
                  }}>
                    {user?.role?.replace("_", " ")}
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}>
                    <Mail size={11} style={{ display: "inline", marginRight: 4 }} />
                    {user?.email}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, paddingBottom: 4 }}>
              <label style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "rgba(255,255,255,0.15)", color: "white",
                padding: "8px 14px", borderRadius: 9, fontSize: 12, fontWeight: 600,
                cursor: "pointer", backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.2)"
              }}>
                <Camera size={13} /> Change Photo
                <input type="file" accept="image/*" style={{ display: "none" }} onChange={handlePicture} />
              </label>
              <button
                onClick={() => editMode ? handleSaveProfile() : setEditMode(true)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: "white", color: colors.primary,
                  padding: "8px 16px", borderRadius: 9, fontSize: 12, fontWeight: 700,
                  cursor: "pointer", border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                }}
              >
                {editMode ? <><Check size={13} /> Save Changes</> : <><Pencil size={13} /> Edit Profile</>}
              </button>
              {editMode && (
                <button onClick={() => setEditMode(false)} style={{
                  background: "rgba(255,255,255,0.15)", color: "white",
                  padding: "8px 14px", borderRadius: 9, fontSize: 12, fontWeight: 600,
                  cursor: "pointer", border: "1px solid rgba(255,255,255,0.2)"
                }}>
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 }}>

        {/* ── Left ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Personal Info */}
          <Card>
            <SectionHeader icon={Terminal} title="Personal Info" />
            <Input label="Full Name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} disabled={!editMode} />
            <Input label="Email" value={user?.email || ""} disabled />
            <Input label="Role" value={user?.role?.replace("_", " ") || ""} disabled />
          </Card>

          {/* Skills */}
          <Card>
            <SectionHeader icon={Code2} title="Skills & Expertise" onAdd={() => setSkillOpen(true)} />
            {mySkills.length === 0
              ? <p style={{ fontSize: 12, color: colors.textLight, fontStyle: "italic" }}>No skills added yet.</p>
              : <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {mySkills.map((skill) => (
                    <div key={skill.id} className="skill-tag" style={{
                      display: "flex", alignItems: "center", gap: 5,
                      background: colors.primaryLight, color: colors.primary,
                      padding: "4px 10px", borderRadius: 20,
                      fontSize: 11, fontWeight: 600, position: "relative"
                    }}>
                      <Hash size={10} />
                      {skill.name}
                      <button onClick={() => dispatch(removeSkillThunk(skill.id))} style={{
                        background: "none", border: "none", cursor: "pointer",
                        color: colors.primary, padding: 0, display: "flex", marginLeft: 2
                      }}>
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
            }
          </Card>

          {/* Languages */}
          <Card>
            <SectionHeader icon={Globe2} title="Languages" onAdd={openAddLang} />
            {languages.length === 0
              ? <p style={{ fontSize: 12, color: colors.textLight, fontStyle: "italic" }}>No languages added yet.</p>
              : <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {languages.map((lang) => (
                    <div key={lang.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: colors.text, margin: 0 }}>{lang.language}</p>
                        <p style={{ fontSize: 11, color: colors.textLight, margin: 0 }}>{lang.level}</p>
                      </div>
                      <button onClick={() => dispatch(deleteLanguageThunk(lang.id))} style={{
                        background: "none", border: "none", cursor: "pointer", color: colors.textLight,
                        padding: 4, borderRadius: 6, display: "flex"
                      }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
            }
          </Card>

        </div>

        {/* ── Right ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Experience */}
          <Card>
            <SectionHeader icon={Briefcase} title="Work Experience" onAdd={openAddExp} />
            {experiences.length === 0
              ? <p style={{ fontSize: 12, color: colors.textLight, fontStyle: "italic" }}>No experience added yet.</p>
              : <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {experiences.map((exp, idx) => (
                    <div key={exp.id}>
                      {idx > 0 && <Divider />}
                      <div style={{ display: "flex", gap: 12 }} className="group-item">
                        <div style={{
                          width: 38, height: 38, borderRadius: 10,
                          background: colors.primaryLight, color: colors.primary,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontWeight: 800, fontSize: 14, flexShrink: 0
                        }}>
                          {exp.company_name?.[0]?.toUpperCase()}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div>
                              <p style={{ fontSize: 13, fontWeight: 700, color: colors.text, margin: 0 }}>{exp.job_title}</p>
                              <p style={{ fontSize: 12, color: colors.primary, fontWeight: 600, margin: "2px 0" }}>
                                <Building2 size={10} style={{ display: "inline", marginRight: 4 }} />
                                {exp.company_name}
                              </p>
                              <p style={{ fontSize: 11, color: colors.textLight, margin: 0 }}>
                                <Calendar size={10} style={{ display: "inline", marginRight: 4 }} />
                                {exp.start_date?.slice(0, 7)} — {exp.end_date ? exp.end_date?.slice(0, 7) : "Present"}
                              </p>
                            </div>
                            <div style={{ display: "flex", gap: 4 }}>
                              <button onClick={() => openEditExp(exp)} style={{ background: "none", border: "none", cursor: "pointer", color: colors.textLight, padding: 4, borderRadius: 6 }}>
                                <Pencil size={13} />
                              </button>
                              <button onClick={() => dispatch(deleteExperienceThunk(exp.id))} style={{ background: "none", border: "none", cursor: "pointer", color: colors.textLight, padding: 4, borderRadius: 6 }}>
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                          {exp.description && <p style={{ fontSize: 12, color: colors.textMid, margin: "6px 0 0", lineHeight: 1.6 }}>{exp.description}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
            }
          </Card>

          {/* Education */}
          <Card>
            <SectionHeader icon={GraduationCap} title="Education" onAdd={openAddEdu} />
            {educations.length === 0
              ? <p style={{ fontSize: 12, color: colors.textLight, fontStyle: "italic" }}>No education added yet.</p>
              : <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {educations.map((edu, idx) => (
                    <div key={edu.id}>
                      {idx > 0 && <Divider />}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 700, color: colors.text, margin: 0 }}>{edu.title}</p>
                          <p style={{ fontSize: 12, color: colors.primary, fontWeight: 600, margin: "2px 0" }}>{edu.university}</p>
                          <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 3 }}>
                            <Tag>{edu.degree}</Tag>
                            <span style={{ fontSize: 11, color: colors.textLight }}>
                              {edu.start_date?.slice(0, 7)} — {edu.end_date?.slice(0, 7)}
                            </span>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 4 }}>
                          <button onClick={() => openEditEdu(edu)} style={{ background: "none", border: "none", cursor: "pointer", color: colors.textLight, padding: 4 }}>
                            <Pencil size={13} />
                          </button>
                          <button onClick={() => dispatch(deleteEducationThunk(edu.id))} style={{ background: "none", border: "none", cursor: "pointer", color: colors.textLight, padding: 4 }}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
            }
          </Card>

          {/* Certifications */}
          <Card>
            <SectionHeader icon={Award} title="Certifications" onAdd={openAddCert} />
            {certifications.length === 0
              ? <p style={{ fontSize: 12, color: colors.textLight, fontStyle: "italic" }}>No certifications added yet.</p>
              : <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {certifications.map((cert, idx) => {
                    const fileUrl = cert.certif_path
                      ? `http://localhost:5000/uploaded_files/${cert.certif_path.split("uploaded_files/")[1] || cert.certif_path}`
                      : null;
                    const isImage = fileUrl && /\.(jpg|jpeg|png)$/i.test(fileUrl);
                    const isPdf = fileUrl && /\.pdf$/i.test(fileUrl);

                    return (
                      <div key={cert.id}>
                        {idx > 0 && <Divider />}
                        <div style={{ display: "flex", gap: 12 }}>
                          {/* Thumbnail */}
                          <div style={{
                            width: 52, height: 52, borderRadius: 10,
                            border: `1px solid ${colors.border}`,
                            overflow: "hidden", flexShrink: 0,
                            background: colors.bg, display: "flex", alignItems: "center", justifyContent: "center"
                          }}>
                            {isImage ? (
                              <a href={fileUrl} target="_blank" rel="noreferrer">
                                <img src={fileUrl} alt={cert.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              </a>
                            ) : isPdf ? (
                              <a href={fileUrl} target="_blank" rel="noreferrer" style={{ display: "flex", flexDirection: "column", alignItems: "center", textDecoration: "none" }}>
                                <span style={{ fontSize: 20 }}>📄</span>
                                <span style={{ fontSize: 9, color: colors.textLight }}>PDF</span>
                              </a>
                            ) : (
                              <Award size={20} color={colors.textLight} />
                            )}
                          </div>

                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                              <div>
                                <p style={{ fontSize: 13, fontWeight: 700, color: colors.text, margin: 0 }}>{cert.title}</p>
                                {cert.issuer && <p style={{ fontSize: 12, color: colors.primary, fontWeight: 600, margin: "2px 0" }}>{cert.issuer}</p>}
                                {cert.obtained_at && (
                                  <p style={{ fontSize: 11, color: colors.textLight, margin: 0 }}>
                                    {cert.obtained_at?.slice(0, 10)}
                                    {cert.expires_at && ` → ${cert.expires_at?.slice(0, 10)}`}
                                  </p>
                                )}
                                <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                                  {cert.credential_url && (
                                    <a href={cert.credential_url} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: colors.accent, textDecoration: "none", display: "flex", alignItems: "center", gap: 3 }}>
                                      <Link size={10} /> View credential
                                    </a>
                                  )}
                                  {fileUrl && (
                                    <a href={fileUrl} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: colors.success, textDecoration: "none", display: "flex", alignItems: "center", gap: 3 }}>
                                      <ChevronRight size={10} /> View file
                                    </a>
                                  )}
                                </div>
                              </div>
                              <div style={{ display: "flex", gap: 4 }}>
                                <button onClick={() => openEditCert(cert)} style={{ background: "none", border: "none", cursor: "pointer", color: colors.textLight, padding: 4 }}>
                                  <Pencil size={13} />
                                </button>
                                <button onClick={() => dispatch(deleteCertificationThunk(cert.id))} style={{ background: "none", border: "none", cursor: "pointer", color: colors.textLight, padding: 4 }}>
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
            }
          </Card>

        </div>
      </div>

      {/* ── Skill Modal ── */}
      {skillOpen && (
        <Modal title="Manage Skills" onClose={() => setSkillOpen(false)}>
          <div style={{ background: "#EFF6FF", border: "1.5px dashed #93C5FD", borderRadius: 10, padding: 14, marginBottom: 16 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: colors.primary, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              <Code2 size={11} style={{ display: "inline", marginRight: 4 }} />
              Create New Skill
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <input placeholder="Skill name" value={newSkillName} onChange={(e) => setNewSkillName(e.target.value)}
                style={{ flex: 1, padding: "8px 10px", fontSize: 12, border: `1.5px solid ${colors.border}`, borderRadius: 8, outline: "none" }} />
              <input placeholder="Category" value={newSkillCategory} onChange={(e) => setNewSkillCategory(e.target.value)}
                style={{ flex: 1, padding: "8px 10px", fontSize: 12, border: `1.5px solid ${colors.border}`, borderRadius: 8, outline: "none" }} />
              <button onClick={handleCreateSkill} disabled={!newSkillName || !newSkillCategory}
                style={{ padding: "8px 14px", fontSize: 12, fontWeight: 700, background: colors.primary, color: "white", border: "none", borderRadius: 8, cursor: "pointer" }}>
                Add
              </button>
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, maxHeight: 200, overflowY: "auto" }}>
            {allSkills.map((skill) => {
              const has = mySkillIds.includes(skill.id);
              return (
                <button key={skill.id}
                  onClick={() => has ? dispatch(removeSkillThunk(skill.id)) : dispatch(addSkillThunk(skill.id))}
                  style={{
                    padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer",
                    background: has ? colors.primary : "white",
                    color: has ? "white" : colors.textMid,
                    border: `1.5px solid ${has ? colors.primary : colors.border}`,
                    display: "flex", alignItems: "center", gap: 5, transition: "all 0.15s"
                  }}>
                  {has && <Check size={10} />}
                  {skill.name}
                </button>
              );
            })}
          </div>
        </Modal>
      )}

      {/* ── Experience Modal ── */}
      {expModal && (
        <Modal title={expModal === "add" ? "Add Experience" : "Edit Experience"} onClose={() => setExpModal(null)}>
          <Input label="Job Title *" value={expForm.job_title} onChange={(e) => setExpForm({ ...expForm, job_title: e.target.value })} />
          <Input label="Company *" value={expForm.company_name} onChange={(e) => setExpForm({ ...expForm, company_name: e.target.value })} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Input label="Start Date *" type="date" value={expForm.start_date?.slice(0, 10)} onChange={(e) => setExpForm({ ...expForm, start_date: e.target.value })} />
            <Input label="End Date *" type="date" value={expForm.end_date?.slice(0, 10)} onChange={(e) => setExpForm({ ...expForm, end_date: e.target.value })} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: colors.textMid, display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>Description *</label>
            <textarea rows={3} value={expForm.description} onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
              style={{ width: "100%", padding: "9px 12px", fontSize: 13, border: `1.5px solid ${colors.border}`, borderRadius: 9, outline: "none", resize: "none", boxSizing: "border-box" }} />
          </div>
          <button onClick={handleSaveExp} style={{ width: "100%", padding: "10px", background: colors.primary, color: "white", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            {expModal === "add" ? "Add Experience" : "Save Changes"}
          </button>
        </Modal>
      )}

      {/* ── Education Modal ── */}
      {eduModal && (
        <Modal title={eduModal === "add" ? "Add Education" : "Edit Education"} onClose={() => setEduModal(null)}>
          <Input label="Title *" value={eduForm.title} onChange={(e) => setEduForm({ ...eduForm, title: e.target.value })} />
          <Input label="University *" value={eduForm.university} onChange={(e) => setEduForm({ ...eduForm, university: e.target.value })} />
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: colors.textMid, display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>Degree *</label>
            <select value={eduForm.degree} onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
              style={{ width: "100%", padding: "9px 12px", fontSize: 13, border: `1.5px solid ${colors.border}`, borderRadius: 9, outline: "none" }}>
              {DEGREES.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Input label="Start Date *" type="date" value={eduForm.start_date?.slice(0, 10)} onChange={(e) => setEduForm({ ...eduForm, start_date: e.target.value })} />
            <Input label="End Date *" type="date" value={eduForm.end_date?.slice(0, 10)} onChange={(e) => setEduForm({ ...eduForm, end_date: e.target.value })} />
          </div>
          <button onClick={handleSaveEdu} style={{ width: "100%", padding: "10px", background: colors.primary, color: "white", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            {eduModal === "add" ? "Add Education" : "Save Changes"}
          </button>
        </Modal>
      )}

      {/* ── Certification Modal ── */}
      {certModal && (
        <Modal title={certModal === "add" ? "Add Certification" : "Edit Certification"} onClose={() => setCertModal(null)}>
          <Input label="Title *" value={certForm.title} onChange={(e) => setCertForm({ ...certForm, title: e.target.value })} />
          <Input label="Issuer" value={certForm.issuer} onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })} />
          <Input label="Credential ID" value={certForm.credential_id} onChange={(e) => setCertForm({ ...certForm, credential_id: e.target.value })} />
          <Input label="Credential URL" value={certForm.credential_url} onChange={(e) => setCertForm({ ...certForm, credential_url: e.target.value })} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Input label="Obtained At *" type="date" value={certForm.obtained_at?.slice(0, 10)} onChange={(e) => setCertForm({ ...certForm, obtained_at: e.target.value })} />
            <Input label="Expires At" type="date" value={certForm.expires_at?.slice(0, 10)} onChange={(e) => setCertForm({ ...certForm, expires_at: e.target.value })} />
          </div>
          {certModal === "add" && (
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: colors.textMid, display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>Certificate File</label>
              <input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={(e) => setCertFile(e.target.files[0])}
                style={{ width: "100%", fontSize: 12, padding: "8px", border: `1.5px solid ${colors.border}`, borderRadius: 9 }} />
            </div>
          )}
          <button onClick={handleSaveCert} style={{ width: "100%", padding: "10px", background: colors.primary, color: "white", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            {certModal === "add" ? "Add Certification" : "Save Changes"}
          </button>
        </Modal>
      )}

      {/* ── Language Modal ── */}
      {langModal && (
        <Modal title="Add Language" onClose={() => setLangModal(null)}>
          <Input label="Language * (min 5 chars)" value={langForm.language} onChange={(e) => setLangForm({ ...langForm, language: e.target.value })} />
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: colors.textMid, display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>Level</label>
            <select value={langForm.level} onChange={(e) => setLangForm({ ...langForm, level: e.target.value })}
              style={{ width: "100%", padding: "9px 12px", fontSize: 13, border: `1.5px solid ${colors.border}`, borderRadius: 9, outline: "none" }}>
              {LEVELS.map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>
          <button onClick={handleSaveLang} style={{ width: "100%", padding: "10px", background: colors.primary, color: "white", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            Add Language
          </button>
        </Modal>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}