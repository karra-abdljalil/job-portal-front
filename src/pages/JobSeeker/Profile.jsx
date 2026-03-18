import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, updateProfileThunk, uploadPictureThunk } from "@/Redux/profileSlice";
import { fetchMySkills, fetchAllSkills, addSkillThunk, removeSkillThunk, createSkillThunk } from "@/Redux/skillSlice";
import { fetchExperiences, addExperienceThunk, updateExperienceThunk, deleteExperienceThunk } from "@/Redux/experienceSlice";
import { fetchEducations, addEducationThunk, updateEducationThunk, deleteEducationThunk } from "@/Redux/educationSlice";
import { fetchLanguages, addLanguageThunk, deleteLanguageThunk } from "@/Redux/languageSlice";
import { fetchCertifications, createCertificationThunk, updateCertificationThunk, deleteCertificationThunk } from "@/Redux/certificationSlice";
import { Pencil, Plus, Trash2, X, Check, Globe, Award } from "lucide-react";

const Avatar = ({ user }) => (
  <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-bold overflow-hidden ring-4 ring-white">
    {user?.profile_picture
      ? <img src={`http://localhost:5000/${user.profile_picture}`} alt="avatar" className="w-full h-full object-cover" />
      : <span>{user?.full_name?.[0]?.toUpperCase() || "U"}</span>}
  </div>
);

const SectionCard = ({ title, icon, onAdd, children }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
    <div className="flex items-center justify-between">
      <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">{icon}{title}</h2>
      {onAdd && (
        <button onClick={onAdd} className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium">
          <Plus size={14} /> Add New
        </button>
      )}
    </div>
    {children}
  </div>
);

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
      </div>
      {children}
    </div>
  </div>
);

const Field = ({ label, value, onChange, type = "text", disabled = false }) => (
  <div>
    <label className="text-xs text-gray-500 block mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm disabled:bg-gray-50 disabled:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
    />
  </div>
);

const EMPTY_EXP = { job_title: "", company_name: "", description: "", start_date: "", end_date: "" };
const EMPTY_EDU = { title: "", university: "", degree: "Bachelor", start_date: "", end_date: "" };
const EMPTY_LANG = { language: "", level: "Beginner" };
const EMPTY_CERT = { title: "", issuer: "", credential_id: "", credential_url: "", obtained_at: "", expires_at: "" };
const DEGREES = ["Bachelor", "Master", "PhD", "Associate", "High School", "Other"];
const LEVELS = ["Beginner", "Intermediate", "Advanced", "Fluent", "Native"];

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
    dispatch(fetchProfile());
    dispatch(fetchMySkills());
    dispatch(fetchAllSkills());
    dispatch(fetchExperiences());
    dispatch(fetchEducations());
    dispatch(fetchLanguages());
    dispatch(fetchCertifications());
  }, [dispatch]);

  useEffect(() => {
    if (user) setForm({ full_name: user.full_name || "" });
  }, [user]);

  const handleSaveProfile = () => {
    dispatch(updateProfileThunk(form));
    setEditMode(false);
  };

  const handlePicture = (e) => {
    const file = e.target.files[0];
    if (file) dispatch(uploadPictureThunk(file));
  };

  const handleCreateSkill = () => {
    if (!newSkillName || !newSkillCategory) return;
    dispatch(createSkillThunk({ name: newSkillName, category: newSkillCategory })).then((res) => {
      if (!res.error) {
        setNewSkillName("");
        setNewSkillCategory("");
        dispatch(fetchAllSkills()).then((result) => {
          const newSkill = result.payload?.skills?.find(
            (s) => s.name.toLowerCase() === newSkillName.toLowerCase()
          );
          if (newSkill) dispatch(addSkillThunk(newSkill.id));
        });
      }
    });
  };

  // Experience
  const openEditExp = (exp) => { setExpForm({ ...exp }); setExpModal(exp); };
  const openAddExp = () => { setExpForm(EMPTY_EXP); setExpModal("add"); };
  const handleSaveExp = () => {
    if (expModal === "add") dispatch(addExperienceThunk(expForm));
    else dispatch(updateExperienceThunk({ id: expModal.id, payload: expForm }));
    setExpModal(null);
  };

  // Education
  const openEditEdu = (edu) => { setEduForm({ ...edu }); setEduModal(edu); };
  const openAddEdu = () => { setEduForm(EMPTY_EDU); setEduModal("add"); };
  const handleSaveEdu = () => {
    if (eduModal === "add") dispatch(addEducationThunk(eduForm));
    else dispatch(updateEducationThunk({ id: eduModal.id, payload: eduForm }));
    setEduModal(null);
  };

  // Language
  const openAddLang = () => { setLangForm(EMPTY_LANG); setLangModal("add"); };
  const handleSaveLang = () => {
    dispatch(addLanguageThunk(langForm));
    setLangModal(null);
  };

  // Certification
  const openAddCert = () => { setCertForm(EMPTY_CERT); setCertFile(null); setCertModal("add"); };
  const openEditCert = (cert) => { setCertForm({ ...cert }); setCertModal(cert); };
  const handleSaveCert = () => {
    if (certModal === "add") {
      const formData = new FormData();
      Object.entries(certForm).forEach(([k, v]) => { if (v) formData.append(k, v); });
      if (certFile) formData.append("certif", certFile);
      dispatch(createCertificationThunk(formData));
    } else {
      dispatch(updateCertificationThunk({ id: certModal.id, payload: certForm }));
    }
    setCertModal(null);
  };

  const mySkillIds = mySkills.map((s) => s.id);

  if (loading && !user) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-5 p-6">

      {/* ── Header Banner ── */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="h-28 bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500" />
        <div className="px-6 pb-5 -mt-10 flex items-end justify-between gap-4 flex-wrap">
          <div className="flex items-end gap-4">
            <Avatar user={user} />
            <div className="mb-1">
              <h1 className="text-lg font-bold text-gray-900">{user?.full_name}</h1>
              <p className="text-sm text-gray-500 capitalize">
                {user?.role && <span>{user.role} • </span>}
                {user?.email}
              </p>
            </div>
          </div>
          <div className="flex gap-2 mb-1">
            <label className="cursor-pointer px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
              📷 Change Photo
              <input type="file" accept="image/*" className="hidden" onChange={handlePicture} />
            </label>
            <button
              onClick={() => editMode ? handleSaveProfile() : setEditMode(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              {editMode ? <><Check size={13} /> Save</> : <><Pencil size={13} /> Edit Profile</>}
            </button>
            {editMode && (
              <button onClick={() => setEditMode(false)} className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        

        {/* ── Right Column ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Experience */}
          <SectionCard title="Work Experience" icon="💼" onAdd={openAddExp}>
            {experiences.length === 0
              ? <p className="text-xs text-gray-400 italic">No experience added yet.</p>
              : <div className="space-y-4">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="flex gap-3 group">
                      <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm shrink-0">
                        {exp.company_name?.[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{exp.job_title}</p>
                            <p className="text-xs text-indigo-600 font-medium">{exp.company_name}</p>
                            <p className="text-xs text-gray-400">
                              {exp.start_date?.slice(0, 7)} — {exp.end_date ? exp.end_date?.slice(0, 7) : "Present"}
                            </p>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            <button onClick={() => openEditExp(exp)} className="text-gray-400 hover:text-indigo-600"><Pencil size={14} /></button>
                            <button onClick={() => dispatch(deleteExperienceThunk(exp.id))} className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                          </div>
                        </div>
                        {exp.description && <p className="text-xs text-gray-500 mt-1 leading-relaxed">{exp.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
            }
          </SectionCard>

          {/* Education */}
          <SectionCard title="Education" icon="🎓" onAdd={openAddEdu}>
            {educations.length === 0
              ? <p className="text-xs text-gray-400 italic">No education added yet.</p>
              : <div className="space-y-3">
                  {educations.map((edu) => (
                    <div key={edu.id} className="flex items-start justify-between gap-2 group">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{edu.title}</p>
                        <p className="text-xs text-indigo-600">{edu.university}</p>
                        <p className="text-xs text-gray-400">
                          {edu.start_date?.slice(0, 7)} — {edu.end_date?.slice(0, 7)}
                        </p>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button onClick={() => openEditEdu(edu)} className="text-gray-400 hover:text-indigo-600"><Pencil size={14} /></button>
                        <button onClick={() => dispatch(deleteEducationThunk(edu.id))} className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
            }
          </SectionCard>

          {/* Certifications */}
          <SectionCard title="Certifications" icon={<Award size={14} />} onAdd={openAddCert}>
            {certifications.length === 0
              ? <p className="text-xs text-gray-400 italic">No certifications added yet.</p>
              : <div className="space-y-3">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="flex items-start justify-between gap-2 group">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{cert.title}</p>
                        {cert.issuer && <p className="text-xs text-indigo-600">{cert.issuer}</p>}
                        {cert.credential_id && <p className="text-xs text-gray-400">ID: {cert.credential_id}</p>}
                        {cert.obtained_at && (
                          <p className="text-xs text-gray-400">
                            {cert.obtained_at?.slice(0, 10)}
                            {cert.expires_at && ` — ${cert.expires_at?.slice(0, 10)}`}
                          </p>
                        )}
                        {cert.credential_url && (
                          <a href={cert.credential_url} target="_blank" rel="noreferrer" className="text-xs text-indigo-500 hover:underline">
                            View credential
                          </a>
                        )}
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button onClick={() => openEditCert(cert)} className="text-gray-400 hover:text-indigo-600"><Pencil size={14} /></button>
                        <button onClick={() => dispatch(deleteCertificationThunk(cert.id))} className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
            }
          </SectionCard>

        </div>

        {/* ── Left Column ── */}
        <div className="space-y-5">

          {/* Personal Info */}
          <SectionCard title="Personal Information" icon="👤">
            <div className="space-y-3">
              <Field label="Full Name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} disabled={!editMode} />
              <Field label="Email" value={user?.email || ""} disabled />
              <Field label="Role" value={user?.role || ""} disabled />
            </div>
          </SectionCard>

          {/* Skills */}
          <SectionCard title="Skills & Expertise" icon="⭐" onAdd={() => setSkillOpen(true)}>
            {mySkills.length === 0
              ? <p className="text-xs text-gray-400 italic">No skills added yet.</p>
              : <div className="flex flex-wrap gap-1.5">
                  {mySkills.map((skill) => (
                    <span key={skill.id} className="flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full text-xs font-medium group">
                      {skill.name}
                      <button onClick={() => dispatch(removeSkillThunk(skill.id))} className="opacity-0 group-hover:opacity-100 text-indigo-400 hover:text-red-500 transition-opacity">
                        <X size={11} />
                      </button>
                    </span>
                  ))}
                </div>
            }
          </SectionCard>

          {/* Languages */}
          <SectionCard title="Languages" icon={<Globe size={14} />} onAdd={openAddLang}>
            {languages.length === 0
              ? <p className="text-xs text-gray-400 italic">No languages added yet.</p>
              : <div className="space-y-2">
                  {languages.map((lang) => (
                    <div key={lang.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{lang.language}</p>
                        <p className="text-xs text-gray-400">{lang.level}</p>
                      </div>
                      <button onClick={() => dispatch(deleteLanguageThunk(lang.id))} className="text-gray-300 hover:text-red-500">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
            }
          </SectionCard>

        </div>
      </div>

      {/* ── Skill Picker Modal ── */}
      {skillOpen && (
        <Modal title="Add Skills" onClose={() => setSkillOpen(false)}>
          <div className="border border-dashed border-indigo-200 rounded-xl p-3 space-y-2 bg-indigo-50/50">
            <p className="text-xs font-medium text-indigo-700">Create new skill</p>
            <div className="flex gap-2">
              <input placeholder="Skill name *" value={newSkillName} onChange={(e) => setNewSkillName(e.target.value)}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-300" />
              <input placeholder="Category *" value={newSkillCategory} onChange={(e) => setNewSkillCategory(e.target.value)}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-300" />
              <button onClick={handleCreateSkill} disabled={!newSkillName || !newSkillCategory}
                className="px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                Add
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 max-h-52 overflow-y-auto">
            {allSkills.length === 0
              ? <p className="text-xs text-gray-400">No skills available.</p>
              : allSkills.map((skill) => {
                  const has = mySkillIds.includes(skill.id);
                  return (
                    <button key={skill.id}
                      onClick={() => has ? dispatch(removeSkillThunk(skill.id)) : dispatch(addSkillThunk(skill.id))}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        has ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-200 text-gray-600 hover:border-indigo-400"
                      }`}>
                      {has && <Check size={11} className="inline mr-1" />}
                      {skill.name}
                    </button>
                  );
                })
            }
          </div>
        </Modal>
      )}

      {/* ── Experience Modal ── */}
      {expModal && (
        <Modal title={expModal === "add" ? "Add Experience" : "Edit Experience"} onClose={() => setExpModal(null)}>
          <div className="space-y-3">
            <Field label="Job Title *" value={expForm.job_title} onChange={(e) => setExpForm({ ...expForm, job_title: e.target.value })} />
            <Field label="Company *" value={expForm.company_name} onChange={(e) => setExpForm({ ...expForm, company_name: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Start Date *" type="date" value={expForm.start_date?.slice(0, 10)} onChange={(e) => setExpForm({ ...expForm, start_date: e.target.value })} />
              <Field label="End Date *" type="date" value={expForm.end_date?.slice(0, 10)} onChange={(e) => setExpForm({ ...expForm, end_date: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Description *</label>
              <textarea rows={3} value={expForm.description} onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none" />
            </div>
            <button onClick={handleSaveExp} className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm hover:bg-indigo-700">
              {expModal === "add" ? "Add Experience" : "Save Changes"}
            </button>
          </div>
        </Modal>
      )}

      {/* ── Education Modal ── */}
      {eduModal && (
        <Modal title={eduModal === "add" ? "Add Education" : "Edit Education"} onClose={() => setEduModal(null)}>
          <div className="space-y-3">
            <Field label="Title *" value={eduForm.title} onChange={(e) => setEduForm({ ...eduForm, title: e.target.value })} />
            <Field label="University *" value={eduForm.university} onChange={(e) => setEduForm({ ...eduForm, university: e.target.value })} />
            <div>
              <label className="text-xs text-gray-500 block mb-1">Degree *</label>
              <select value={eduForm.degree} onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
                {DEGREES.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Start Date *" type="date" value={eduForm.start_date?.slice(0, 10)} onChange={(e) => setEduForm({ ...eduForm, start_date: e.target.value })} />
              <Field label="End Date *" type="date" value={eduForm.end_date?.slice(0, 10)} onChange={(e) => setEduForm({ ...eduForm, end_date: e.target.value })} />
            </div>
            <button onClick={handleSaveEdu} className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm hover:bg-indigo-700">
              {eduModal === "add" ? "Add Education" : "Save Changes"}
            </button>
          </div>
        </Modal>
      )}

      {/* ── Certification Modal ── */}
      {certModal && (
        <Modal title={certModal === "add" ? "Add Certification" : "Edit Certification"} onClose={() => setCertModal(null)}>
          <div className="space-y-3">
            <Field label="Title *" value={certForm.title} onChange={(e) => setCertForm({ ...certForm, title: e.target.value })} />
            <Field label="Issuer" value={certForm.issuer} onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })} />
            <Field label="Credential ID" value={certForm.credential_id} onChange={(e) => setCertForm({ ...certForm, credential_id: e.target.value })} />
            <Field label="Credential URL" value={certForm.credential_url} onChange={(e) => setCertForm({ ...certForm, credential_url: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Obtained At *" type="date" value={certForm.obtained_at?.slice(0, 10)} onChange={(e) => setCertForm({ ...certForm, obtained_at: e.target.value })} />
              <Field label="Expires At" type="date" value={certForm.expires_at?.slice(0, 10)} onChange={(e) => setCertForm({ ...certForm, expires_at: e.target.value })} />
            </div>
            {certModal === "add" && (
              <div>
                <label className="text-xs text-gray-500 block mb-1">Certificate File (PDF/Image)</label>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={(e) => setCertFile(e.target.files[0])}
                  className="w-full text-xs text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
              </div>
            )}
            <button onClick={handleSaveCert} className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm hover:bg-indigo-700">
              {certModal === "add" ? "Add Certification" : "Save Changes"}
            </button>
          </div>
        </Modal>
      )}

      {/* ── Language Modal ── */}
      {langModal && (
        <Modal title="Add Language" onClose={() => setLangModal(null)}>
          <div className="space-y-3">
            <Field label="Language * (min 5 chars)" value={langForm.language} onChange={(e) => setLangForm({ ...langForm, language: e.target.value })} />
            <div>
              <label className="text-xs text-gray-500 block mb-1">Level</label>
              <select value={langForm.level} onChange={(e) => setLangForm({ ...langForm, level: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
                {LEVELS.map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
            <button onClick={handleSaveLang} className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm hover:bg-indigo-700">
              Add Language
            </button>
          </div>
        </Modal>
      )}

    </div>
  );
}