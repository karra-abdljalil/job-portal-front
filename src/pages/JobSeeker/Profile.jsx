import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, updateProfileThunk, uploadPictureThunk } from "@/Redux/profileSlice";
import { fetchMySkills, fetchAllSkills, addSkillThunk, removeSkillThunk, createSkillThunk } from "@/Redux/skillSlice";
import { fetchExperiences, addExperienceThunk, updateExperienceThunk, deleteExperienceThunk } from "@/Redux/experienceSlice";
import { fetchEducations, addEducationThunk, updateEducationThunk, deleteEducationThunk } from "@/Redux/educationSlice";
import { fetchLanguages, addLanguageThunk, deleteLanguageThunk } from "@/Redux/languageSlice";
import { fetchCertifications, createCertificationThunk, updateCertificationThunk, deleteCertificationThunk } from "@/Redux/certificationSlice";
import {
  Briefcase, GraduationCap, Award, Globe, Star,
  Pencil, Plus, Trash2, X, Check, Camera, Mail,
  Building2, Calendar, Link, ChevronRight, User,
  BookOpen, Languages, BadgeCheck
} from "lucide-react";

const EMPTY_EXP = { job_title: "", company_name: "", description: "", start_date: "", end_date: "" };
const EMPTY_EDU = { title: "", university: "", degree: "Bachelor", start_date: "", end_date: "" };
const EMPTY_LANG = { language: "", level: "Beginner" };
const EMPTY_CERT = { title: "", issuer: "", credential_id: "", credential_url: "", obtained_at: "", expires_at: "" };
const DEGREES = ["Bachelor", "Master", "PhD", "Associate", "High School", "Other"];
const LEVELS = ["Beginner", "Intermediate", "Advanced", "Fluent", "Native"];

// ─── Components ───────────────────────────────────────────────────────────────

const Avatar = ({ user }) => (
  <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold overflow-hidden ring-4 ring-white shadow-md">
    {user?.profile_picture
      ? <img src={`http://localhost:5000/${user.profile_picture}`} alt="avatar" className="w-full h-full object-cover" />
      : <span>{user?.full_name?.[0]?.toUpperCase() || "U"}</span>}
  </div>
);

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-5 ${className}`}>
    {children}
  </div>
);

const SectionHeader = ({ icon: Icon, title, onAdd }) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
        <Icon size={15} className="text-blue-600" />
      </div>
      <span className="text-sm font-bold text-slate-800">{title}</span>
    </div>
    {onAdd && (
      <button onClick={onAdd} className="flex items-center gap-1 text-xs font-600 text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
        <Plus size={13} /> Add
      </button>
    )}
  </div>
);

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
      <div className="flex items-center justify-between mb-5">
        <span className="text-sm font-bold text-slate-800">{title}</span>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
      </div>
      {children}
    </div>
  </div>
);

const Field = ({ label, value, onChange, type = "text", disabled = false }) => (
  <div className="mb-3">
    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">{label}</label>
    <input type={type} value={value} onChange={onChange} disabled={disabled}
      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm disabled:bg-slate-50 disabled:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
    />
  </div>
);

const Divider = () => <div className="h-px bg-slate-100 my-3" />;

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

  useEffect(() => { if (user) setForm({ full_name: user.full_name || "" }); }, [user]);

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
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-5 p-6">

      {/* ── Header Banner ── */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100">
        <div className="h-28 bg-gradient-to-r from-blue-500 to-sky-400 mb-3" />
        <div className="px-6 pb-5 -mt-10 flex items-end justify-between gap-4 flex-wrap">
          <div className="flex items-end gap-4">
            <Avatar user={user} />
            <div className="mb-1">
              <h1 className="text-lg font-bold text-slate-900">{user?.full_name}</h1>
              <p className="text-sm text-slate-500">
                {user?.role && <span className="capitalize">{user.role.replace("_", " ")} • </span>}
                <Mail size={11} className="inline mr-1" />
                {user?.email}
              </p>
            </div>
          </div>
          <div className="flex gap-2 mb-1">
            <label className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors">
              <Camera size={13} /> Change Photo
              <input type="file" accept="image/*" className="hidden" onChange={handlePicture} />
            </label>
            <button
              onClick={() => editMode ? handleSaveProfile() : setEditMode(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              {editMode ? <><Check size={13} /> Save</> : <><Pencil size={13} /> Edit Profile</>}
            </button>
            {editMode && (
              <button onClick={() => setEditMode(false)} className="px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ── Left ── */}
        <div className="space-y-5">

          {/* Personal Info */}
          <Card>
            <SectionHeader icon={User} title="Personal Information" />
            <Field label="Full Name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} disabled={!editMode} />
            <Field label="Email" value={user?.email || ""} disabled />
            <Field label="Role" value={user?.role?.replace("_", " ") || ""} disabled />
          </Card>

          {/* Skills */}
          <Card>
            <SectionHeader icon={Star} title="Skills & Expertise" onAdd={() => setSkillOpen(true)} />
            {mySkills.length === 0
              ? <p className="text-xs text-slate-400 italic">No skills added yet.</p>
              : <div className="flex flex-wrap gap-1.5">
                  {mySkills.map((skill) => (
                    <span key={skill.id} className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-semibold group">
                      {skill.name}
                      <button onClick={() => dispatch(removeSkillThunk(skill.id))} className="opacity-0 group-hover:opacity-100 text-blue-400 hover:text-red-500 transition-opacity">
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
            }
          </Card>

          {/* Languages */}
          <Card>
            <SectionHeader icon={Globe} title="Languages" onAdd={openAddLang} />
            {languages.length === 0
              ? <p className="text-xs text-slate-400 italic">No languages added yet.</p>
              : <div className="space-y-3">
                  {languages.map((lang) => (
                    <div key={lang.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{lang.language}</p>
                        <p className="text-xs text-slate-400">{lang.level}</p>
                      </div>
                      <button onClick={() => dispatch(deleteLanguageThunk(lang.id))} className="text-slate-300 hover:text-red-500 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
            }
          </Card>
        </div>

        {/* ── Right ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Experience */}
          <Card>
            <SectionHeader icon={Briefcase} title="Work Experience" onAdd={openAddExp} />
            {experiences.length === 0
              ? <p className="text-xs text-slate-400 italic">No experience added yet.</p>
              : <div className="space-y-4">
                  {experiences.map((exp, idx) => (
                    <div key={exp.id}>
                      {idx > 0 && <Divider />}
                      <div className="flex gap-3 group">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
                          {exp.company_name?.[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-sm font-bold text-slate-900">{exp.job_title}</p>
                              <p className="text-xs font-semibold text-blue-600 flex items-center gap-1 mt-0.5">
                                <Building2 size={10} /> {exp.company_name}
                              </p>
                              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                <Calendar size={10} />
                                {exp.start_date?.slice(0, 7)} — {exp.end_date ? exp.end_date?.slice(0, 7) : "Present"}
                              </p>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                              <button onClick={() => openEditExp(exp)} className="text-slate-400 hover:text-blue-600 p-1 rounded-lg"><Pencil size={13} /></button>
                              <button onClick={() => dispatch(deleteExperienceThunk(exp.id))} className="text-slate-400 hover:text-red-500 p-1 rounded-lg"><Trash2 size={13} /></button>
                            </div>
                          </div>
                          {exp.description && <p className="text-xs text-slate-500 mt-2 leading-relaxed">{exp.description}</p>}
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
              ? <p className="text-xs text-slate-400 italic">No education added yet.</p>
              : <div className="space-y-4">
                  {educations.map((edu, idx) => (
                    <div key={edu.id}>
                      {idx > 0 && <Divider />}
                      <div className="flex items-start justify-between gap-2 group">
                        <div>
                          <p className="text-sm font-bold text-slate-900">{edu.title}</p>
                          <p className="text-xs font-semibold text-blue-600 mt-0.5">{edu.university}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold">{edu.degree}</span>
                            <span className="text-xs text-slate-400">{edu.start_date?.slice(0, 7)} — {edu.end_date?.slice(0, 7)}</span>
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <button onClick={() => openEditEdu(edu)} className="text-slate-400 hover:text-blue-600 p-1"><Pencil size={13} /></button>
                          <button onClick={() => dispatch(deleteEducationThunk(edu.id))} className="text-slate-400 hover:text-red-500 p-1"><Trash2 size={13} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
            }
          </Card>

          {/* Certifications */}
          <Card>
            <SectionHeader icon={BadgeCheck} title="Certifications" onAdd={openAddCert} />
            {certifications.length === 0
              ? <p className="text-xs text-slate-400 italic">No certifications added yet.</p>
              : <div className="space-y-4">
                  {certifications.map((cert, idx) => {
                    const fileUrl = cert.certif_path
                      ? `http://localhost:5000/uploaded_files/${cert.certif_path.split("uploaded_files/")[1] || cert.certif_path}`
                      : null;
                    const isImage = fileUrl && /\.(jpg|jpeg|png)$/i.test(fileUrl);
                    const isPdf = fileUrl && /\.pdf$/i.test(fileUrl);
                    return (
                      <div key={cert.id}>
                        {idx > 0 && <Divider />}
                        <div className="flex gap-3 group">
                          <div className="w-12 h-12 rounded-xl border border-slate-100 overflow-hidden shrink-0 bg-slate-50 flex items-center justify-center">
                            {isImage
                              ? <a href={fileUrl} target="_blank" rel="noreferrer"><img src={fileUrl} alt={cert.title} className="w-full h-full object-cover" /></a>
                              : isPdf
                                ? <a href={fileUrl} target="_blank" rel="noreferrer" className="flex flex-col items-center">
                                    <BookOpen size={16} className="text-red-500" />
                                    <span className="text-xs text-slate-400">PDF</span>
                                  </a>
                                : <Award size={18} className="text-slate-300" />
                            }
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="text-sm font-bold text-slate-900">{cert.title}</p>
                                {cert.issuer && <p className="text-xs font-semibold text-blue-600 mt-0.5">{cert.issuer}</p>}
                                {cert.obtained_at && (
                                  <p className="text-xs text-slate-400 mt-0.5">
                                    {cert.obtained_at?.slice(0, 10)}
                                    {cert.expires_at && ` → ${cert.expires_at?.slice(0, 10)}`}
                                  </p>
                                )}
                                <div className="flex gap-3 mt-1">
                                  {cert.credential_url && (
                                    <a href={cert.credential_url} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline flex items-center gap-1">
                                      <Link size={10} /> View credential
                                    </a>
                                  )}
                                  {fileUrl && (
                                    <a href={fileUrl} target="_blank" rel="noreferrer" className="text-xs text-emerald-600 hover:underline flex items-center gap-1">
                                      <ChevronRight size={10} /> View file
                                    </a>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                <button onClick={() => openEditCert(cert)} className="text-slate-400 hover:text-blue-600 p-1"><Pencil size={13} /></button>
                                <button onClick={() => dispatch(deleteCertificationThunk(cert.id))} className="text-slate-400 hover:text-red-500 p-1"><Trash2 size={13} /></button>
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
          <div className="bg-blue-50 border border-dashed border-blue-200 rounded-xl p-3 mb-4">
            <p className="text-xs font-semibold text-blue-700 mb-2 uppercase tracking-wide">Create New Skill</p>
            <div className="flex gap-2">
              <input placeholder="Skill name" value={newSkillName} onChange={(e) => setNewSkillName(e.target.value)}
                className="flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-300" />
              <input placeholder="Category" value={newSkillCategory} onChange={(e) => setNewSkillCategory(e.target.value)}
                className="flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-300" />
              <button onClick={handleCreateSkill} disabled={!newSkillName || !newSkillCategory}
                className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                Add
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 max-h-52 overflow-y-auto">
            {allSkills.map((skill) => {
              const has = mySkillIds.includes(skill.id);
              return (
                <button key={skill.id}
                  onClick={() => has ? dispatch(removeSkillThunk(skill.id)) : dispatch(addSkillThunk(skill.id))}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-1 ${
                    has ? "bg-blue-600 text-white border-blue-600" : "border-slate-200 text-slate-600 hover:border-blue-400"
                  }`}>
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
          <Field label="Job Title *" value={expForm.job_title} onChange={(e) => setExpForm({ ...expForm, job_title: e.target.value })} />
          <Field label="Company *" value={expForm.company_name} onChange={(e) => setExpForm({ ...expForm, company_name: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Start Date *" type="date" value={expForm.start_date?.slice(0, 10)} onChange={(e) => setExpForm({ ...expForm, start_date: e.target.value })} />
            <Field label="End Date *" type="date" value={expForm.end_date?.slice(0, 10)} onChange={(e) => setExpForm({ ...expForm, end_date: e.target.value })} />
          </div>
          <div className="mb-4">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Description *</label>
            <textarea rows={3} value={expForm.description} onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none" />
          </div>
          <button onClick={handleSaveExp} className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
            {expModal === "add" ? "Add Experience" : "Save Changes"}
          </button>
        </Modal>
      )}

      {/* ── Education Modal ── */}
      {eduModal && (
        <Modal title={eduModal === "add" ? "Add Education" : "Edit Education"} onClose={() => setEduModal(null)}>
          <Field label="Title *" value={eduForm.title} onChange={(e) => setEduForm({ ...eduForm, title: e.target.value })} />
          <Field label="University *" value={eduForm.university} onChange={(e) => setEduForm({ ...eduForm, university: e.target.value })} />
          <div className="mb-3">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Degree *</label>
            <select value={eduForm.degree} onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
              {DEGREES.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Start Date *" type="date" value={eduForm.start_date?.slice(0, 10)} onChange={(e) => setEduForm({ ...eduForm, start_date: e.target.value })} />
            <Field label="End Date *" type="date" value={eduForm.end_date?.slice(0, 10)} onChange={(e) => setEduForm({ ...eduForm, end_date: e.target.value })} />
          </div>
          <button onClick={handleSaveEdu} className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
            {eduModal === "add" ? "Add Education" : "Save Changes"}
          </button>
        </Modal>
      )}

      {/* ── Certification Modal ── */}
      {certModal && (
        <Modal title={certModal === "add" ? "Add Certification" : "Edit Certification"} onClose={() => setCertModal(null)}>
          <Field label="Title *" value={certForm.title} onChange={(e) => setCertForm({ ...certForm, title: e.target.value })} />
          <Field label="Issuer" value={certForm.issuer} onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })} />
          <Field label="Credential ID" value={certForm.credential_id} onChange={(e) => setCertForm({ ...certForm, credential_id: e.target.value })} />
          <Field label="Credential URL" value={certForm.credential_url} onChange={(e) => setCertForm({ ...certForm, credential_url: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Obtained At *" type="date" value={certForm.obtained_at?.slice(0, 10)} onChange={(e) => setCertForm({ ...certForm, obtained_at: e.target.value })} />
            <Field label="Expires At" type="date" value={certForm.expires_at?.slice(0, 10)} onChange={(e) => setCertForm({ ...certForm, expires_at: e.target.value })} />
          </div>
          {certModal === "add" && (
            <div className="mb-4">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Certificate File</label>
              <input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={(e) => setCertFile(e.target.files[0])}
                className="w-full text-xs text-slate-600 border border-slate-200 rounded-xl px-3 py-2 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700" />
            </div>
          )}
          <button onClick={handleSaveCert} className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
            {certModal === "add" ? "Add Certification" : "Save Changes"}
          </button>
        </Modal>
      )}

      {/* ── Language Modal ── */}
      {langModal && (
        <Modal title="Add Language" onClose={() => setLangModal(null)}>
          <Field label="Language * (min 5 chars)" value={langForm.language} onChange={(e) => setLangForm({ ...langForm, language: e.target.value })} />
          <div className="mb-4">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Level</label>
            <select value={langForm.level} onChange={(e) => setLangForm({ ...langForm, level: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
              {LEVELS.map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>
          <button onClick={handleSaveLang} className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
            Add Language
          </button>
        </Modal>
      )}

    </div>
  );
}