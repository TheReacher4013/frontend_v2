import React, { useState, useRef } from "react";
import {
  FaPlus, FaEdit, FaTrash, FaCloudUploadAlt, FaTimes,
  FaEye, FaEyeSlash, FaMinus, FaBold, FaItalic, FaUnderline,
  FaLink, FaListUl, FaListOl, FaTextHeight, FaFileCsv,
  FaCheckCircle, FaExclamationTriangle,
} from "react-icons/fa";
import { Edit, Trash2 } from "lucide-react";

function Campaigns() {
  const [activeTab, setActiveTab] = useState("active");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState("add");
  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [emailTemplateModalOpen, setEmailTemplateModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadTargetCampaign, setUploadTargetCampaign] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const leadsFileRef = useRef(null);

  const [drawerImportFile, setDrawerImportFile] = useState(null);
  const [drawerImportSuccess, setDrawerImportSuccess] = useState(false);
  const drawerImportRef = useRef(null);

  const [perPage, setPerPage] = useState(10);
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  const [roles, setRoles] = useState(["Admin", "Manager", "Salesman"]);
  const [staffMembers, setStaffMembers] = useState(["Ted Sipes", "John Doe", "Admin"]);
  const [forms, setForms] = useState(["Default Form", "Software Development Form"]);
  const [emailTemplates, setEmailTemplates] = useState(["Welcome Email", "Follow-up Template"]);

  const [campaignList, setCampaignList] = useState([
    { id: 1, name: "Make New Mobile Application", progress: 22, leads: "16/70", form: "Software Development Form", emailTemplate: "Welcome Email", members: "Admin", description: "", date: "07-02-2026 01:25 am", user: "Admin" },
    { id: 2, name: "Live Event Campaign", progress: 30, leads: "22/73", form: "Default Form", emailTemplate: "Follow-up Template", members: "Ted Sipes", description: "", date: "16-02-2026 08:43 am", user: "Ted Sipes" },
    { id: 3, name: "Electronic Item Sell Campaign", progress: 50, leads: "25/50", form: "Default Form", emailTemplate: "Welcome Email", members: "Admin", description: "", date: "15-02-2026 05:03 pm", user: "Manager" },
  ]);

  const [editingId, setEditingId] = useState(null);
  const [newCampaignName, setNewCampaignName] = useState("");
  const [newCampaignMembers, setNewCampaignMembers] = useState("Select Members...");
  const [newCampaignForm, setNewCampaignForm] = useState("Select Form...");
  const [newCampaignTemplate, setNewCampaignTemplate] = useState("Select Email Template...");
  const [newCampaignDescription, setNewCampaignDescription] = useState("");

  const [newRoleName, setNewRoleName] = useState("");
  const [newStaffName, setNewStaffName] = useState("");
  const [newFormName, setNewFormName] = useState("");
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [formFields, setFormFields] = useState([]);

  const openAddDrawer = () => {
    setDrawerMode("add");
    setEditingId(null);
    setNewCampaignName("");
    setNewCampaignMembers("Select Members...");
    setNewCampaignForm("Select Form...");
    setNewCampaignTemplate("Select Email Template...");
    setNewCampaignDescription("");
    setDrawerImportFile(null);
    setDrawerImportSuccess(false);
    setStep(1);
    setDrawerOpen(true);
  };

  const openEditDrawer = (item) => {
    setDrawerMode("edit");
    setEditingId(item.id);
    setSelectedCampaign(item);
    setNewCampaignName(item.name);
    setNewCampaignMembers(item.members || "Select Members...");
    setNewCampaignForm(item.form || "Select Form...");
    setNewCampaignTemplate(item.emailTemplate || "Select Email Template...");
    setNewCampaignDescription(item.description || "");
    setDrawerImportFile(null);
    setDrawerImportSuccess(false);
    setStep(1);
    setDrawerOpen(true);
  };

  const handleDrawerImportClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (drawerImportRef.current) {
      drawerImportRef.current.value = "";
      drawerImportRef.current.click();
    }
  };

  const handleDrawerImportFileChange = (e) => {
    const f = e.target.files[0];
    if (f) { setDrawerImportFile(f); setDrawerImportSuccess(false); }
  };

  const handleDrawerImportDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const f = e.dataTransfer.files[0];
    if (f) { setDrawerImportFile(f); setDrawerImportSuccess(false); }
  };

  const handleDrawerImportDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleFinishCampaign = () => {
    if (drawerMode === "edit" && editingId) {
      setCampaignList(campaignList.map((c) =>
        c.id === editingId
          ? { ...c, name: newCampaignName || c.name, members: newCampaignMembers, form: newCampaignForm, emailTemplate: newCampaignTemplate, description: newCampaignDescription }
          : c
      ));
    } else {
      const newEntry = {
        id: Date.now(),
        name: newCampaignName || "New Campaign",
        progress: 0,
        leads: "0/100",
        form: newCampaignForm !== "Select Form..." ? newCampaignForm : "Default Form",
        emailTemplate: newCampaignTemplate !== "Select Email Template..." ? newCampaignTemplate : "",
        members: newCampaignMembers !== "Select Members..." ? newCampaignMembers : "Admin",
        description: newCampaignDescription,
        importedFile: drawerImportFile ? drawerImportFile.name : null,
        date: new Date().toLocaleString(),
        user: "Admin",
      };
      setCampaignList([newEntry, ...campaignList]);
    }
    setDrawerOpen(false);
    setStep(1);
    setDrawerImportFile(null);
    setDrawerImportSuccess(false);
  };

  const openDeleteModal = (item) => { setDeleteTarget(item); setDeleteModalOpen(true); };
  const confirmDelete = () => {
    setCampaignList(campaignList.filter((c) => c.id !== deleteTarget.id));
    setDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  const openUploadModal = (item) => {
    setUploadTargetCampaign(item);
    setUploadedFile(null);
    setUploadSuccess(false);
    setUploadModalOpen(true);
  };
  const handleLeadsFileChange = (e) => {
    const f = e.target.files[0];
    if (f) { setUploadedFile(f); setUploadSuccess(false); }
  };
  const handleLeadsDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) { setUploadedFile(f); setUploadSuccess(false); }
  };
  const handleLeadsUploadClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (leadsFileRef.current) {
      leadsFileRef.current.value = "";
      leadsFileRef.current.click();
    }
  };
  const handleLeadsUploadSubmit = () => {
    if (!uploadedFile) return;
    setUploadSuccess(true);
    setTimeout(() => { setUploadModalOpen(false); setUploadedFile(null); setUploadSuccess(false); }, 1500);
  };

  const addFormField = () => setFormFields([...formFields, { id: Date.now(), name: "", type: "Text" }]);
  const removeFormField = (id) => setFormFields(formFields.filter((f) => f.id !== id));
  const handleFieldChange = (id, value, key) => setFormFields(formFields.map((f) => f.id === id ? { ...f, [key]: value } : f));
  const handleImageChange = (e) => { const f = e.target.files[0]; if (f) setSelectedImage(URL.createObjectURL(f)); };
  const handleAddRole = () => { if (newRoleName.trim()) { setRoles([...roles, newRoleName]); setNewRoleName(""); setRoleModalOpen(false); } };
  const handleAddStaff = () => { if (newStaffName.trim()) { setStaffMembers([...staffMembers, newStaffName]); setNewStaffName(""); setSelectedImage(null); setStaffModalOpen(false); } };
  const handleCreateForm = () => { if (newFormName.trim()) { setForms([...forms, newFormName]); setNewFormName(""); setFormFields([]); setFormModalOpen(false); } };
  const handleCreateTemplate = () => { if (newTemplateName.trim()) { setEmailTemplates([...emailTemplates, newTemplateName]); setNewTemplateName(""); setNewSubject(""); setEmailTemplateModalOpen(false); } };
  const nextStep = () => { if (step < 3) setStep(step + 1); };
  const prevStep = () => { if (step > 1) setStep(step - 1); };

  const filteredList = campaignList.filter((c) =>
    activeTab === "active" ? c.progress < 100 : c.progress >= 100
  );

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen font-sans">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">Campaigns</h1>
          <p className="text-sm text-gray-500">Dashboard - Campaigns</p>
        </div>
        <button onClick={openAddDrawer} className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors text-sm font-semibold w-full sm:w-auto">
          <FaPlus /> Add New Campaign
        </button>
      </div>

      <div className="flex gap-6 border-b mb-4 text-sm overflow-x-auto">
        <button onClick={() => setActiveTab("active")} className={`pb-2 whitespace-nowrap transition-all ${activeTab === "active" ? "border-b-2 border-blue-600 text-blue-600 font-medium" : "text-gray-500 hover:text-blue-400"}`}>Active Campaign</button>
        <button onClick={() => setActiveTab("completed")} className={`pb-2 whitespace-nowrap transition-all ${activeTab === "completed" ? "border-b-2 border-blue-600 text-blue-600 font-medium" : "text-gray-500 hover:text-blue-400"}`}>Completed Campaign</button>
      </div>

      {/* ── DESKTOP TABLE ── */}
      <div className="hidden md:block bg-white shadow-sm rounded-xl border border-gray-100 overflow-auto">
        <table className="min-w-[900px] w-full text-sm text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {["Name","Progress","Members","Form","Started On","Last Actioner","Action"].map(h => (
                <th key={h} className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredList.length === 0 ? (
              <tr><td colSpan={7} className="p-6 text-center text-gray-400">No campaigns found.</td></tr>
            ) : filteredList.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3.5 font-medium text-gray-800">{item.name}</td>
                <td className="px-4 py-3.5 min-w-[140px]">
                  <div className="w-full bg-gray-200 h-2 rounded"><div className="bg-blue-500 h-2 rounded" style={{ width: `${item.progress}%` }}></div></div>
                  <p className="text-xs text-gray-400 mt-1">Remaining Leads: {item.leads}</p>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 bg-blue-300 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] font-bold">{item.members?.charAt(0) || "A"}</div>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-xs text-gray-600">{item.form}</td>
                <td className="px-4 py-3.5 text-xs text-gray-600 whitespace-nowrap">{item.date}</td>
                <td className="px-4 py-3.5 text-xs text-gray-600">{item.user}</td>
                <td className="px-4 py-3.5">
                  {/* ✅ Expenses-style action buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => openUploadModal(item)}
                      title="Upload Leads"
                      className="w-9 h-9 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-sm"
                    >
                      <FaCloudUploadAlt size={14} />
                    </button>
                    <button
                      onClick={() => openAddDrawer()}
                      title="Add to Campaign"
                      className="w-9 h-9 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-sm"
                    >
                      <FaPlus size={12} />
                    </button>
                    <button
                      onClick={() => openEditDrawer(item)}
                      title="Edit Campaign"
                      className="w-9 h-9 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-sm"
                    >
                      <Edit size={15} />
                    </button>
                    <button
                      onClick={() => openDeleteModal(item)}
                      title="Delete Campaign"
                      className="w-9 h-9 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-sm"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── MOBILE CARDS ── */}
      <div className="flex flex-col gap-3 md:hidden">
        {filteredList.length === 0 ? (
          <div className="text-center text-gray-400 py-8 bg-white rounded-xl border border-gray-100">No campaigns found.</div>
        ) : filteredList.map((item) => (
          <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

            {/* Card header */}
            <div className="flex items-start justify-between px-4 py-3 border-b border-gray-100 bg-gray-50 gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-gray-800 leading-tight">{item.name}</h3>
                <span className="text-xs text-blue-600 font-medium">{item.progress}%</span>
              </div>
              {/* ✅ Expenses-style action buttons */}
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => openUploadModal(item)}
                  className="w-9 h-9 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-sm"
                >
                  <FaCloudUploadAlt size={14} />
                </button>
                <button
                  onClick={() => openAddDrawer()}
                  className="w-9 h-9 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-sm"
                >
                  <FaPlus size={12} />
                </button>
                <button
                  onClick={() => openEditDrawer(item)}
                  className="w-9 h-9 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-sm"
                >
                  <Edit size={15} />
                </button>
                <button
                  onClick={() => openDeleteModal(item)}
                  className="w-9 h-9 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-sm"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            <div className="px-4 py-3 border-b border-gray-100">
              <div className="w-full bg-gray-200 h-1.5 rounded mb-1"><div className="bg-blue-500 h-1.5 rounded" style={{ width: `${item.progress}%` }}></div></div>
              <p className="text-xs text-gray-400">Remaining Leads: {item.leads}</p>
            </div>

            <div className="flex flex-col px-4 py-3 border-b border-gray-100">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1">Form</span>
              <span className="text-sm text-gray-700">{item.form}</span>
            </div>

            <div className="flex flex-col px-4 py-3 border-b border-gray-100">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1">Last Actioner</span>
              <span className="text-sm text-gray-700">{item.user}</span>
            </div>

            <div className="flex flex-col px-4 py-3">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1">Started On</span>
              <span className="text-sm text-gray-700">{item.date}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-4 text-sm flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <select value={perPage} onChange={(e) => setPerPage(e.target.value)} className="border px-2 py-1 rounded outline-none text-xs">
            <option>10</option><option>20</option><option>50</option>
          </select>
          <span className="text-xs">/ page</span>
        </div>
        <button className="border px-3 py-1 rounded bg-blue-500 text-white text-xs">1</button>
      </div>

      {/* ── DELETE MODAL ── */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white w-full max-w-sm rounded-xl shadow-2xl p-6 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaExclamationTriangle className="text-red-500 text-2xl" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-1">Delete Campaign?</h2>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete <span className="font-semibold text-gray-700">"{deleteTarget?.name}"</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteModalOpen(false)} className="flex-1 px-4 py-2.5 border rounded-lg text-sm font-medium hover:bg-gray-50 transition-all">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-all shadow-md">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ── UPLOAD MODAL ── */}
      {uploadModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[90] p-4">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">Upload Leads File</h2>
                {uploadTargetCampaign && <p className="text-xs text-gray-500 mt-0.5">Campaign: <span className="font-medium text-blue-600">{uploadTargetCampaign.name}</span></p>}
              </div>
              <button onClick={() => setUploadModalOpen(false)} className="text-gray-400 hover:text-black transition-colors"><FaTimes /></button>
            </div>
            <div className="p-6 space-y-4">
              <input type="file" accept="*" className="hidden" ref={leadsFileRef} onChange={handleLeadsFileChange} />
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleLeadsDrop}
                className={`border-2 border-dashed rounded-xl p-10 text-center transition-all ${uploadedFile ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"}`}
              >
                {uploadedFile ? (
                  <div className="flex flex-col items-center gap-2">
                    <FaFileCsv className="text-4xl text-blue-500" />
                    <p className="text-sm font-semibold text-gray-700">{uploadedFile.name}</p>
                    <p className="text-xs text-gray-400">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                    <button onClick={(e) => { e.stopPropagation(); setUploadedFile(null); }} className="text-xs text-red-500 hover:underline mt-1">Remove file</button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <FaCloudUploadAlt className="text-4xl" />
                    <p className="text-sm font-medium text-gray-600">Drag & drop your file here</p>
                    <p className="text-xs text-gray-400">or</p>
                    <button onClick={handleLeadsUploadClick} className="text-xs bg-blue-50 border border-blue-300 text-blue-600 font-semibold px-4 py-1.5 rounded-md hover:bg-blue-100 transition-all">Browse File</button>
                    <p className="text-xs text-gray-400 mt-1">Supported: All file types (csv, xlsx, images, etc.)</p>
                  </div>
                )}
              </div>
              {uploadSuccess && (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 text-sm font-medium">
                  <FaCheckCircle /> Leads uploaded successfully!
                </div>
              )}
            </div>
            <div className="p-4 border-t flex justify-end gap-3 bg-gray-50 rounded-b-xl">
              <button onClick={() => setUploadModalOpen(false)} className="px-5 py-2 border rounded text-sm font-medium bg-white hover:bg-gray-100 transition-all">Cancel</button>
              <button onClick={handleLeadsUploadSubmit} disabled={!uploadedFile || uploadSuccess}
                className={`px-5 py-2 rounded text-sm font-medium flex items-center gap-2 shadow-md transition-all ${uploadedFile && !uploadSuccess ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
                <FaCloudUploadAlt size={14} /> Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD / EDIT DRAWER ── */}
      {drawerOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-end z-40">
          <div className="bg-white w-full sm:w-[90vw] md:w-[650px] h-full overflow-auto shadow-2xl flex flex-col">
            <div className="flex justify-between items-center p-4 sm:p-6 border-b">
              <h2 className="text-base sm:text-lg font-semibold">
                {drawerMode === "edit" ? "Edit Campaign" : "Add New Campaign"}
              </h2>
              <button onClick={() => setDrawerOpen(false)} className="text-gray-500 hover:text-black p-1"><FaTimes /></button>
            </div>

            <div className="px-4 sm:px-6 pt-4">
              <div className="flex items-center border-b text-xs sm:text-sm mb-6 overflow-x-auto">
                {["Basic Settings", "About Campaign", "Import Data"].map((label, i) => (
                  <div key={label} className={`pb-2 mr-6 whitespace-nowrap flex-shrink-0 transition-all cursor-pointer ${step === i + 1 ? "text-blue-600 font-semibold border-b-2 border-blue-600" : "text-gray-400"}`}
                    onClick={() => setStep(i + 1)}>
                    {label}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-auto px-4 sm:px-6 pb-4">
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Name *</label>
                    <input value={newCampaignName} onChange={(e) => setNewCampaignName(e.target.value)} type="text" placeholder="Please Enter Name" className="w-full border p-2 rounded mt-1 outline-none focus:border-blue-500 text-sm" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Members *</label>
                    <div className="flex gap-2 mt-1">
                      <select value={newCampaignMembers} onChange={(e) => setNewCampaignMembers(e.target.value)} className="w-full border p-2 rounded outline-none focus:border-blue-500 text-sm">
                        <option>Select Members...</option>
                        {staffMembers.map((m, idx) => <option key={idx}>{m}</option>)}
                      </select>
                      <button type="button" onClick={() => setStaffModalOpen(true)} className="bg-white border text-blue-600 p-2 rounded hover:bg-blue-50 flex-shrink-0"><FaPlus size={12} /></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Form *</label>
                      <div className="flex gap-2 mt-1">
                        <select value={newCampaignForm} onChange={(e) => setNewCampaignForm(e.target.value)} className="w-full border p-2 rounded outline-none text-sm">
                          <option>Select Form...</option>
                          {forms.map((f, idx) => <option key={idx}>{f}</option>)}
                        </select>
                        <button type="button" onClick={() => { setFormFields([]); setFormModalOpen(true); }} className="bg-white border text-blue-600 p-2 rounded hover:bg-blue-50 flex-shrink-0"><FaPlus size={12} /></button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email Template *</label>
                      <div className="flex gap-2 mt-1">
                        <select value={newCampaignTemplate} onChange={(e) => setNewCampaignTemplate(e.target.value)} className="w-full border p-2 rounded outline-none text-sm">
                          <option>Select Email Template...</option>
                          {emailTemplates.map((t, idx) => <option key={idx}>{t}</option>)}
                        </select>
                        <button type="button" onClick={() => setEmailTemplateModalOpen(true)} className="bg-white border text-blue-600 p-2 rounded hover:bg-blue-50 flex-shrink-0"><FaPlus size={12} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <p className="text-gray-500 text-sm">Campaign description and details.</p>
                  <textarea value={newCampaignDescription} onChange={(e) => setNewCampaignDescription(e.target.value)} className="w-full border p-2 rounded h-32 outline-none focus:border-blue-500 text-sm" placeholder="Describe your campaign..."></textarea>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <p className="text-gray-500 text-sm">Upload CSV or Lead data for this campaign.</p>
                  <input type="file" accept="*" className="hidden" ref={drawerImportRef} onChange={handleDrawerImportFileChange} />
                  <div
                    onDragOver={handleDrawerImportDragOver}
                    onDrop={handleDrawerImportDrop}
                    className={`border-2 border-dashed rounded-xl p-10 text-center transition-all ${drawerImportFile ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"}`}
                  >
                    {drawerImportFile ? (
                      <div className="flex flex-col items-center gap-2">
                        <FaFileCsv className="text-5xl text-blue-500" />
                        <p className="text-sm font-semibold text-gray-700">{drawerImportFile.name}</p>
                        <p className="text-xs text-gray-400">{(drawerImportFile.size / 1024).toFixed(1)} KB</p>
                        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDrawerImportFile(null); setDrawerImportSuccess(false); }} className="text-xs text-red-500 hover:underline mt-1">Remove file</button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-gray-400">
                        <FaCloudUploadAlt className="text-5xl" />
                        <p className="text-sm font-medium text-gray-600">Drag & drop your file here</p>
                        <p className="text-xs text-gray-400">or</p>
                        <button onClick={handleDrawerImportClick} className="text-xs bg-blue-50 border border-blue-300 text-blue-600 font-semibold px-4 py-1.5 rounded-md hover:bg-blue-100 transition-all">Browse File</button>
                        <p className="text-xs text-gray-400 mt-1">Supported: All file types (csv, xlsx, images, etc.)</p>
                      </div>
                    )}
                  </div>
                  {drawerImportSuccess && (
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 text-sm font-medium">
                      <FaCheckCircle /> File ready to import!
                    </div>
                  )}
                  {drawerImportFile && !drawerImportSuccess && (
                    <div className="flex items-center gap-2 text-blue-600 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2.5 text-sm">
                      <FaCheckCircle size={14} />
                      <span><span className="font-medium">{drawerImportFile.name}</span> will be imported when you click Finish.</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center p-4 sm:p-6 border-t bg-gray-50">
              <div>{step > 1 && <button onClick={prevStep} className="border px-4 py-2 rounded hover:bg-gray-100 transition-all text-sm">Previous</button>}</div>
              <div className="flex gap-3">
                <button onClick={() => setDrawerOpen(false)} className="border px-4 py-2 rounded hover:bg-gray-100 transition-all text-sm">Cancel</button>
                {step < 3 ? (
                  <button onClick={nextStep} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 shadow-md text-sm">Next Step</button>
                ) : (
                  <button onClick={handleFinishCampaign} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 shadow-md text-sm">
                    {drawerMode === "edit" ? "Save Changes" : "Finish"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── FORM MODAL ── */}
      {formModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">Add New Form</h2>
              <button onClick={() => setFormModalOpen(false)} className="text-gray-500 hover:text-black"><FaTimes /></button>
            </div>
            <div className="p-6 overflow-y-auto space-y-6">
              <div>
                <label className="text-xs font-semibold text-red-500 uppercase">* Name</label>
                <input value={newFormName} onChange={(e) => setNewFormName(e.target.value)} type="text" placeholder="Please Enter Name" className="w-full border p-2 rounded text-sm mt-1 outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-2 uppercase text-gray-700">Status</label>
                <div className="flex">
                  <button className="bg-blue-600 text-white px-4 py-1.5 rounded-l text-xs font-medium border border-blue-600">Active</button>
                  <button className="bg-gray-100 text-gray-600 px-4 py-1.5 rounded-r text-xs font-medium border border-l-0">Inactive</button>
                </div>
              </div>
              <div>
                <label className="text-sm font-bold block mb-3 border-b pb-1 text-gray-800">Form Fields</label>
                <div className="space-y-3 mb-4">
                  {formFields.map((field) => (
                    <div key={field.id} className="flex flex-col sm:flex-row gap-3 items-end sm:items-center bg-gray-50 p-3 rounded-md border">
                      <div className="flex-1 w-full">
                        <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Field Name</label>
                        <input type="text" placeholder="Field Name" value={field.name} onChange={(e) => handleFieldChange(field.id, e.target.value, "name")} className="w-full border p-2 rounded text-sm bg-white outline-none focus:border-blue-500" />
                      </div>
                      <div className="w-full sm:w-40">
                        <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Type</label>
                        <select className="w-full border p-2 rounded text-sm bg-white outline-none" value={field.type} onChange={(e) => handleFieldChange(field.id, e.target.value, "type")}>
                          <option>Text</option><option>Number</option><option>Email</option><option>Date</option><option>Dropdown</option>
                        </select>
                      </div>
                      <button onClick={() => removeFormField(field.id)} className="bg-red-50 text-red-500 p-2.5 rounded-md hover:bg-red-500 hover:text-white transition-all border border-red-100"><FaMinus size={12} /></button>
                    </div>
                  ))}
                </div>
                <button onClick={addFormField} className="w-full border-2 border-dashed border-gray-300 p-4 rounded-md text-gray-500 text-sm flex items-center justify-center gap-2 hover:bg-blue-50 transition-all font-medium"><FaPlus size={12} /> Add Form Field</button>
              </div>
            </div>
            <div className="p-4 border-t flex justify-end gap-3 bg-gray-50">
              <button onClick={() => setFormModalOpen(false)} className="px-6 py-2 border rounded text-sm font-medium bg-white">Cancel</button>
              <button onClick={handleCreateForm} className="px-6 py-2 bg-blue-600 text-white rounded text-sm font-medium flex items-center gap-2 hover:bg-blue-700 shadow-md"><FaCloudUploadAlt size={14} /> Create</button>
            </div>
          </div>
        </div>
      )}

      {/* ── EMAIL TEMPLATE MODAL ── */}
      {emailTemplateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[80] p-4">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-2xl flex flex-col max-h-[95vh]">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">Add New Email Template</h2>
              <button onClick={() => setEmailTemplateModalOpen(false)} className="text-gray-500 hover:text-black"><FaTimes /></button>
            </div>
            <div className="p-6 overflow-y-auto space-y-5">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex-1 w-full">
                  <label className="text-xs font-semibold text-red-500 uppercase">* Name</label>
                  <input value={newTemplateName} onChange={(e) => setNewTemplateName(e.target.value)} type="text" placeholder="Please Enter Name" className="w-full border p-2 rounded text-sm mt-1 outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 uppercase flex items-center gap-1">Sharable <span className="text-gray-400 bg-gray-100 rounded-full w-4 h-4 flex items-center justify-center text-[10px]">i</span></label>
                  <div className="flex mt-1">
                    <button className="bg-white text-gray-600 px-4 py-1.5 rounded-l text-xs font-medium border">Yes</button>
                    <button className="bg-blue-600 text-white px-4 py-1.5 rounded-r text-xs font-medium border border-blue-600">No</button>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-red-500 uppercase">* Subject</label>
                <input value={newSubject} onChange={(e) => setNewSubject(e.target.value)} type="text" placeholder="Please Enter Subject" className="w-full border p-2 rounded text-sm mt-1 outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 uppercase">Body</label>
                <div className="border rounded-md mt-1 overflow-hidden">
                  <div className="bg-gray-50 border-b p-2 flex flex-wrap gap-4 text-gray-500">
                    <div className="flex items-center gap-2 border-r pr-4"><span className="text-xs font-medium">Normal</span><FaTextHeight size={12} /></div>
                    <FaBold className="cursor-pointer hover:text-blue-600" /><FaItalic className="cursor-pointer hover:text-blue-600" />
                    <FaUnderline className="cursor-pointer hover:text-blue-600" /><FaLink className="cursor-pointer hover:text-blue-600" />
                    <FaListUl className="cursor-pointer hover:text-blue-600" /><FaListOl className="cursor-pointer hover:text-blue-600" />
                  </div>
                  <textarea placeholder="Please Enter Body" className="w-full p-4 text-sm h-32 outline-none italic text-gray-400"></textarea>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 uppercase">Form</label>
                <select className="w-full border p-2 rounded text-sm mt-1 outline-none focus:border-blue-500">
                  <option>Select Form...</option>
                  {forms.map((f, idx) => <option key={idx}>{f}</option>)}
                </select>
              </div>
            </div>
            <div className="p-4 border-t flex justify-end gap-3 bg-gray-50">
              <button onClick={() => setEmailTemplateModalOpen(false)} className="px-6 py-2 border rounded text-sm font-medium bg-white hover:bg-gray-100">Cancel</button>
              <button onClick={handleCreateTemplate} className="px-6 py-2 bg-blue-600 text-white rounded text-sm font-medium flex items-center gap-2 hover:bg-blue-700 shadow-md"><FaCloudUploadAlt size={14} /> Create</button>
            </div>
          </div>
        </div>
      )}

      {/* ── STAFF MODAL ── */}
      {staffModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">Add New Staff Member</h2>
              <button onClick={() => setStaffModalOpen(false)}><FaTimes /></button>
            </div>
            <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-12 gap-6">
              <div className="sm:col-span-3 text-center">
                <label className="text-xs font-semibold mb-2 block text-left">Profile Image</label>
                <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} />
                <div onClick={() => fileInputRef.current.click()} className="border-2 border-dashed rounded-md p-4 h-32 flex flex-col items-center justify-center text-gray-400 cursor-pointer overflow-hidden hover:bg-gray-50 transition-all">
                  {selectedImage ? <img src={selectedImage} alt="Preview" className="h-full w-full object-cover" /> : <><FaPlus className="mb-1" /><span className="text-xs font-medium">Upload</span></>}
                </div>
              </div>
              <div className="sm:col-span-9 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-red-500">* Role</label>
                  <div className="flex gap-2 mt-1">
                    <select className="w-full border p-2 rounded text-sm outline-none focus:border-blue-500">
                      <option>Select Role...</option>
                      {roles.map((r, idx) => <option key={idx}>{r}</option>)}
                    </select>
                    <button onClick={() => setRoleModalOpen(true)} className="border p-2 rounded bg-white text-blue-600 hover:bg-blue-50 transition-all flex-shrink-0"><FaPlus size={12} /></button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs font-semibold text-red-500">* Name</label><input value={newStaffName} onChange={(e) => setNewStaffName(e.target.value)} type="text" className="w-full border p-2 rounded text-sm outline-none focus:border-blue-500" /></div>
                  <div><label className="text-xs font-semibold text-red-500">* Phone</label><input type="text" className="w-full border p-2 rounded text-sm outline-none focus:border-blue-500" /></div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-red-500">* Password</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} className="w-full border p-2 rounded text-sm outline-none focus:border-blue-500" />
                    <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-gray-400">{showPassword ? <FaEyeSlash /> : <FaEye />}</button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs font-semibold text-red-500">* Email</label><input type="email" className="w-full border p-2 rounded text-sm outline-none focus:border-blue-500" /></div>
                  <div><label className="text-xs font-semibold text-red-500">* Status</label><select className="w-full border p-2 rounded text-sm outline-none"><option>Enabled</option><option>Disabled</option></select></div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t flex justify-end gap-3 bg-gray-50">
              <button onClick={() => setStaffModalOpen(false)} className="px-4 py-2 border rounded text-sm font-medium bg-white">Cancel</button>
              <button onClick={handleAddStaff} className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium flex items-center gap-2 hover:bg-blue-700 shadow-md"><FaEdit size={12} /> Create</button>
            </div>
          </div>
        </div>
      )}

      {/* ── ROLE MODAL ── */}
      {roleModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">Add New Role</h2>
              <button onClick={() => setRoleModalOpen(false)}><FaTimes /></button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="text-xs font-semibold text-red-500">* Display Name</label><input value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)} type="text" placeholder="Manager" className="w-full border p-2 rounded text-sm outline-none focus:border-blue-500" /></div>
                <div><label className="text-xs font-semibold text-red-500">* Role Name</label><input type="text" placeholder="manager" className="w-full border p-2 rounded text-sm outline-none focus:border-blue-500" /></div>
              </div>
              <div><label className="text-xs font-semibold text-gray-700">Description</label><textarea placeholder="Description..." className="w-full border p-2 rounded text-sm h-20 outline-none focus:border-blue-500"></textarea></div>
              <div>
                <h3 className="text-sm font-bold mb-3 border-b pb-1 text-gray-800">Permissions</h3>
                <div className="space-y-3">
                  {["Staff Members", "Campaigns", "Leads"].map((module) => (
                    <div key={module} className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 border-b border-gray-50 gap-2 text-xs">
                      <span className="font-semibold text-gray-700 w-32">{module}</span>
                      <div className="flex flex-wrap gap-4">
                        {["View", "Add", "Edit", "Delete"].map((perm) => (
                          <label key={perm} className="flex items-center gap-1.5 cursor-pointer hover:text-blue-600"><input type="checkbox" className="w-3.5 h-3.5 accent-blue-600" /> {perm}</label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4 border-t flex justify-end gap-3 bg-gray-50">
              <button onClick={() => setRoleModalOpen(false)} className="px-6 py-2 border rounded text-sm font-medium bg-white">Cancel</button>
              <button onClick={handleAddRole} className="px-6 py-2 bg-blue-600 text-white rounded text-sm font-medium flex items-center gap-2 hover:bg-blue-700 shadow-md"><FaCloudUploadAlt size={16} /> Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Campaigns;