import Currencies from "./settingsPannel/Currencies";
import Modules from "./settingsPannel/Modules";
import StorageSettings from "./settingsPannel/StorageSettings";
import EmailSettings from "./settingsPannel/EmailSettings";
import DatabaseBackup from "./settingsPannel/DatabaseBackup";
import UpdateApp from "./settingsPannel/UpdateApp";
import Translations from "./settingsPannel/Translations";
import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";

// ─── Global Styles ────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', system-ui, sans-serif; background: #f1f5f9; }
    .admin-layout { display: flex; min-height: 100vh; }
    .sidebar {
      width: 240px; background: #fff; border-right: 1px solid #e5e7eb;
      display: flex; flex-direction: column; flex-shrink: 0;
      transition: transform 0.3s ease; z-index: 300;
    }
    .sidebar-overlay {
      display: none; position: fixed; inset: 0;
      background: rgba(0,0,0,0.4); z-index: 299; backdrop-filter: blur(2px);
    }
    .main-content { flex: 1; overflow-y: auto; min-width: 0; }
    .mobile-topbar {
      display: none; align-items: center; justify-content: space-between;
      padding: 12px 16px; background: #fff; border-bottom: 1px solid #e5e7eb;
      position: sticky; top: 0; z-index: 200;
    }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px 20px; }
    .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
    .field-input {
      width: 100%; border: 1.5px solid #e5e7eb; border-radius: 8px;
      padding: 10px 14px; font-size: 13px; outline: none; background: #fff;
      transition: border-color .2s; font-family: inherit;
    }
    .field-input:focus { border-color: #3b82f6; }
    @keyframes popIn { from{transform:scale(.93);opacity:0} to{transform:scale(1);opacity:1} }
    @keyframes slideInRight { from{transform:translateX(100%)} to{transform:translateX(0)} }
    @keyframes modalIn { from{opacity:0;transform:scale(.95)} to{opacity:1;transform:scale(1)} }
    @media (max-width: 900px) { .grid-4 { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 640px) {
      .sidebar { position: fixed; top: 0; left: 0; height: 100%; transform: translateX(-100%); }
      .sidebar.open { transform: translateX(0); }
      .sidebar-overlay.open { display: block; }
      .mobile-topbar { display: flex; }
      .grid-2 { grid-template-columns: 1fr; }
      .grid-4 { grid-template-columns: 1fr 1fr; }
      .page-header { flex-direction: column; align-items: flex-start; gap: 12px; }
      .page-header-btns { width: 100%; display: flex; flex-wrap: wrap; gap: 8px; }
      .page-header-btns button { flex: 1; min-width: 120px; justify-content: center; }
    }
    @media (max-width: 400px) { .grid-4 { grid-template-columns: 1fr; } }
    .sm-hide { display: flex; }
    .dt-show { display: none; }
    @media (min-width: 640px) { .sm-hide { display: none !important; } .dt-show { display: block !important; } }
    .sm-hide2 { display: flex; }
    .dt-show2 { display: none; }
    @media (min-width: 640px) { .sm-hide2 { display: none !important; } .dt-show2 { display: block !important; } }
  `}</style>
);

// ─── Icons ────────────────────────────────────────────────────────────────────
const PlusIcon   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>;
const XIcon      = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>;
const MenuIcon   = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>;
const SaveIcon   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>;
const CameraIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4z"/><path d="M9 3L7.17 5H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2h-3.17L15 3H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/></svg>;
const TagIcon    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"/></svg>;
const SortIcon   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 5.83L15.17 9l1.41-1.41L12 3 7.41 7.59 8.83 9 12 5.83zm0 12.34L8.83 15l-1.41 1.41L12 21l4.59-4.59L15.17 15 12 18.17z"/></svg>;
const SearchIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5z"/></svg>;
const CheckCircleIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>;

// ─── Shared UI ────────────────────────────────────────────────────────────────
const Toast = ({ show, message, type = 'success' }) => (
  <div style={{
    position:'fixed', bottom:20, right:20, zIndex:9999,
    background:'#fff', borderRadius:12, boxShadow:'0 8px 32px rgba(0,0,0,.15)',
    padding:'12px 18px', display:'flex', alignItems:'center', gap:10,
    border:`1.5px solid ${type==='success'?'#d1fae5':'#fee2e2'}`,
    transform:show?'translateX(0)':'translateX(120%)',
    opacity:show?1:0, transition:'all .35s cubic-bezier(.4,2,.6,1)',
    maxWidth:'calc(100vw - 40px)'
  }}>
    <span style={{ color:type==='success'?'#10b981':'#ef4444', flexShrink:0 }}><CheckCircleIcon/></span>
    <span style={{ fontSize:13, fontWeight:600, color:'#374151' }}>{message}</span>
  </div>
);

const Toggle = ({ checked, onChange }) => (
  <div onClick={()=>onChange(!checked)} style={{ width:40, height:22, borderRadius:11, background:checked?'#3b82f6':'#d1d5db', cursor:'pointer', position:'relative', transition:'background .2s', flexShrink:0 }}>
    <div style={{ position:'absolute', top:2, left:checked?20:2, width:18, height:18, borderRadius:'50%', background:'#fff', boxShadow:'0 1px 3px rgba(0,0,0,.2)', transition:'left .2s' }}/>
  </div>
);

const Field = ({ label, required, style, ...props }) => (
  <div style={style}>
    <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:5 }}>
      {required && <span style={{ color:'#ef4444' }}>* </span>}{label}
    </label>
    <input {...props} className="field-input"/>
  </div>
);

const SelectField = ({ label, required, children, style, ...props }) => (
  <div style={style}>
    <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:5 }}>
      {required && <span style={{ color:'#ef4444' }}>* </span>}{label}
    </label>
    <select {...props} className="field-input" style={{ appearance:'none', cursor:'pointer' }}>{children}</select>
  </div>
);

const LogoUpload = ({ label, id }) => {
  const [img, setImg] = useState(null);
  return (
    <div>
      <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:5 }}>{label}</label>
      <label htmlFor={id} style={{ cursor:'pointer', display:'block' }}>
        <input type="file" id={id} accept="image/*" style={{ display:'none' }} onChange={e=>{ const f=e.target.files[0]; if(f) setImg(URL.createObjectURL(f)); }}/>
        {img
          ? <img src={img} alt={label} style={{ width:'100%', height:90, borderRadius:8, objectFit:'contain', border:'1.5px solid #e5e7eb' }}/>
          : <div style={{ width:'100%', height:90, border:'2px dashed #d1d5db', borderRadius:8, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', color:'#9ca3af', background:'#fafafa' }}>
              <CameraIcon/><span style={{ fontSize:11, marginTop:4, fontWeight:600 }}>Upload</span>
            </div>
        }
      </label>
    </div>
  );
};

const Pagination = ({ page, total, onPage }) => {
  const pages = Array.from({ length:total }, (_,i)=>i+1);
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', gap:6, padding:'12px 16px', borderTop:'1px solid #f3f4f6', flexWrap:'wrap' }}>
      <button onClick={()=>onPage(Math.max(1,page-1))} disabled={page===1}
        style={{ background:'none', border:'1px solid #e5e7eb', borderRadius:6, padding:'4px 9px', cursor:page===1?'not-allowed':'pointer', color:page===1?'#d1d5db':'#374151', fontSize:13 }}>‹</button>
      {pages.map(p=>(
        <button key={p} onClick={()=>onPage(p)}
          style={{ background:p===page?'#3b82f6':'none', color:p===page?'#fff':'#374151', border:`1px solid ${p===page?'#3b82f6':'#e5e7eb'}`, borderRadius:6, padding:'4px 10px', cursor:'pointer', fontSize:13, fontWeight:p===page?600:400 }}>{p}</button>
      ))}
      <button onClick={()=>onPage(Math.min(total,page+1))} disabled={page===total||total===0}
        style={{ background:'none', border:'1px solid #e5e7eb', borderRadius:6, padding:'4px 9px', cursor:(page===total||total===0)?'not-allowed':'pointer', color:(page===total||total===0)?'#d1d5db':'#374151', fontSize:13 }}>›</button>
      <span style={{ fontSize:12, color:'#9ca3af' }}>10 / page</span>
    </div>
  );
};

// ─── Company Settings ─────────────────────────────────────────────────────────
function CompanySettings() {
  const [primaryColor, setPrimaryColor] = useState('#007BFF');
  const [showModal, setShowModal]       = useState(false);
  const [toast, setToast]               = useState({ show:false, msg:'' });
  const [placement, setPlacement]       = useState('Top & Bottom');
  const [checks, setChecks]             = useState({ staff:false, lang:true, role:true });
  const showToast = msg => { setToast({ show:true, msg }); setTimeout(()=>setToast(t=>({...t,show:false})),3000); };

  return (
    <div style={{ padding:24 }}>
      <Toast show={toast.show} message={toast.msg}/>
      {showModal && (
        <div style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,0.35)', backdropFilter:'blur(2px)', display:'flex', justifyContent:'flex-end' }} onClick={()=>setShowModal(false)}>
          <div style={{ width:'100%', maxWidth:400, background:'#fff', height:'100%', display:'flex', flexDirection:'column', boxShadow:'-8px 0 40px rgba(0,0,0,.15)', animation:'slideInRight .3s ease' }} onClick={e=>e.stopPropagation()}>
            <div style={{ padding:'18px 20px', borderBottom:'1px solid #f3f4f6', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <h3 style={{ margin:0, fontSize:16, fontWeight:700 }}>Add Menu Settings</h3>
              <button onClick={()=>setShowModal(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'#9ca3af' }}><XIcon/></button>
            </div>
            <div style={{ flex:1, overflowY:'auto', padding:20 }}>
              <div style={{ marginBottom:20 }}>
                <label style={{ fontSize:12, fontWeight:600, color:'#374151', marginBottom:6, display:'block' }}><span style={{ color:'#ef4444' }}>* </span>Add Menu Placement</label>
                <select value={placement} onChange={e=>setPlacement(e.target.value)} className="field-input" style={{ appearance:'none' }}>
                  <option>Top & Bottom</option><option>Left Sidebar</option><option>Right Sidebar</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:'#374151', marginBottom:12, display:'block' }}>Add Menu Settings</label>
                {[['staff','Add Staff Member'],['lang','Add Language'],['role','Add Role']].map(([k,lbl])=>(
                  <label key={k} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14, cursor:'pointer' }}>
                    <div onClick={()=>setChecks(p=>({...p,[k]:!p[k]}))} style={{ width:18, height:18, borderRadius:4, border:checks[k]?'2px solid #3b82f6':'2px solid #d1d5db', background:checks[k]?'#3b82f6':'#fff', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0 }}>
                      {checks[k] && <svg width="10" height="10" viewBox="0 0 10 10" fill="white"><path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>}
                    </div>
                    <span style={{ fontSize:13, color:'#374151' }}>{lbl}</span>
                  </label>
                ))}
              </div>
            </div>
            <div style={{ padding:'14px 20px', borderTop:'1px solid #f3f4f6', display:'flex', gap:10, justifyContent:'flex-end' }}>
              <button style={{ padding:'9px 16px', borderRadius:8, border:'1px solid #e5e7eb', background:'#fff', fontSize:13, fontWeight:600, cursor:'pointer' }} onClick={()=>setShowModal(false)}>Cancel</button>
              <button style={{ padding:'9px 16px', borderRadius:8, border:'none', background:'#3b82f6', color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }} onClick={()=>{ setShowModal(false); showToast('Menu settings updated!'); }}><SaveIcon/> Update</button>
            </div>
          </div>
        </div>
      )}
      <div className="page-header" style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
        <div>
          <h2 style={{ fontSize:20, fontWeight:700, color:'#1f2937' }}>Company Settings</h2>
          <p style={{ fontSize:12, color:'#9ca3af', marginTop:2 }}>Dashboard - Settings - <span style={{ color:'#6b7280' }}>Company Settings</span></p>
        </div>
        <div className="page-header-btns" style={{ display:'flex', gap:8 }}>
          <button style={{ display:'flex', alignItems:'center', gap:6, background:'#3b82f6', color:'#fff', border:'none', padding:'9px 16px', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer' }} onClick={()=>showToast('Settings updated!')}><TagIcon/> Update</button>
          <button style={{ display:'flex', alignItems:'center', gap:6, background:'#f3f4f6', color:'#374151', border:'none', padding:'9px 16px', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer' }} onClick={()=>setShowModal(true)}><PlusIcon/> Add Menu Settings</button>
        </div>
      </div>
      <div style={{ background:'#fff', borderRadius:14, border:'1px solid #f1f5f9', boxShadow:'0 1px 6px rgba(0,0,0,.05)', padding:20 }}>
        <div className="grid-2">
          <Field label="Company Name" required defaultValue="Lead Pro"/>
          <Field label="Company Short Name" required defaultValue="LeadPro"/>
          <Field label="Company Email" required defaultValue="company@example.com"/>
          <Field label="Company Phone" defaultValue="+16785861991"/>
        </div>
        <div style={{ marginTop:16 }}>
          <label style={{ fontSize:12, fontWeight:600, color:'#374151', marginBottom:5, display:'block' }}>Company Address</label>
          <textarea className="field-input" rows={3} defaultValue="7 street, city, state, 762782" style={{ resize:'none', fontFamily:'inherit' }}/>
        </div>
        <div className="grid-2" style={{ marginTop:16 }}>
          <SelectField label="Left Sidebar Theme"><option>Dark</option><option>Light</option></SelectField>
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:'#374151', marginBottom:5, display:'block' }}>Primary Color</label>
            <input type="color" value={primaryColor} onChange={e=>setPrimaryColor(e.target.value)} style={{ width:'100%', height:42, border:'1.5px solid #e5e7eb', borderRadius:8, padding:'3px 6px', cursor:'pointer' }}/>
          </div>
        </div>
        <div className="grid-4" style={{ marginTop:16 }}>
          <LogoUpload label="Dark Logo" id="dLogo"/> <LogoUpload label="Light Logo" id="lLogo"/>
          <LogoUpload label="Small Dark" id="sdLogo"/> <LogoUpload label="Small Light" id="slLogo"/>
        </div>
        <hr style={{ border:'none', borderTop:'1px solid #f3f4f6', margin:'20px 0' }}/>
        <div className="grid-2">
          <SelectField label="Currency" required><option>Dollar ($)</option><option>Indian Rupee (₹)</option></SelectField>
          <SelectField label="Language" required><option>English</option><option>Hindi</option></SelectField>
          <SelectField label="Layout" required><option>LTR</option><option>RTL</option></SelectField>
          <SelectField label="Menu Placement" required><option>Top & Bottom</option><option>Left Sidebar</option></SelectField>
        </div>
        <div className="grid-2" style={{ marginTop:16, alignItems:'end' }}>
          {[['Auto Detect Timezone'],['App Debug'],['Update Notification']].map(([lbl])=>{
            const [on, setOn] = useState(false);
            return (
              <div key={lbl} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'6px 0' }}>
                <span style={{ fontSize:13, fontWeight:600, color:'#374151' }}>{lbl}</span>
                <Toggle checked={on} onChange={setOn}/>
              </div>
            );
          })}
          <SelectField label="Default Timezone" required><option>Asia/Kolkata</option><option>America/New_York</option></SelectField>
        </div>
        <div className="grid-2" style={{ marginTop:16 }}>
          <SelectField label="Date Format" required><option>{`(d-m-Y) => ${new Date().toLocaleDateString('en-GB')}`}</option></SelectField>
          <SelectField label="Time Format" required><option>{`(12h) => ${new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})}`}</option></SelectField>
        </div>
        <div style={{ marginTop:16, maxWidth:180 }}><LogoUpload label="Login Image" id="loginImg"/></div>
        <hr style={{ border:'none', borderTop:'1px solid #f3f4f6', margin:'20px 0' }}/>
        <button style={{ display:'flex', alignItems:'center', gap:6, background:'#3b82f6', color:'#fff', border:'none', padding:'9px 16px', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer' }} onClick={()=>showToast('Settings saved!')}><SaveIcon/> Save</button>
      </div>
    </div>
  );
}

// ─── Profile Panel ────────────────────────────────────────────────────────────
function ProfilePanel() {
  const [form, setForm] = useState({ name:'Admin', email:'admin@example.com', password:'', phone:'+91 98765 43210', address:'7 street, city, state' });
  const [img, setImg]   = useState(null);
  const [toast, setToast] = useState({ show:false });
  const ch   = e => setForm({ ...form, [e.target.name]: e.target.value });
  const save = () => { setToast({ show:true }); setTimeout(()=>setToast({ show:false }),3000); };
  return (
    <div style={{ padding:24 }}>
      <Toast show={toast.show} message="Profile updated successfully!"/>
      <div className="page-header" style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
        <div>
          <h2 style={{ fontSize:20, fontWeight:700, color:'#1f2937' }}>Profile</h2>
          <p style={{ fontSize:12, color:'#9ca3af', marginTop:2 }}>Dashboard - Settings - <span style={{ color:'#6b7280' }}>Profile</span></p>
        </div>
        <button style={{ display:'flex', alignItems:'center', gap:6, background:'#3b82f6', color:'#fff', border:'none', padding:'9px 16px', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer' }} onClick={save}><SaveIcon/> Update</button>
      </div>
      <div style={{ background:'#fff', borderRadius:14, border:'1px solid #f1f5f9', boxShadow:'0 1px 6px rgba(0,0,0,.05)', padding:20 }}>
        <div className="grid-2">
          <Field label="Name" required name="name" value={form.name} onChange={ch}/>
          <Field label="Email" required name="email" value={form.email} onChange={ch} type="email"/>
        </div>
        <div style={{ marginTop:14 }}><Field label="Password" name="password" value={form.password} onChange={ch} type="password" placeholder="Enter new password"/></div>
        <div style={{ marginTop:14 }}><Field label="Phone" name="phone" value={form.phone} onChange={ch}/></div>
        <div style={{ marginTop:14 }}>
          <label style={{ fontSize:12, fontWeight:600, color:'#374151', marginBottom:6, display:'block' }}>Profile Image</label>
          <label htmlFor="profImg" style={{ cursor:'pointer', display:'inline-block' }}>
            <input type="file" id="profImg" accept="image/*" style={{ display:'none' }} onChange={e=>{ const f=e.target.files[0]; if(f) setImg(URL.createObjectURL(f)); }}/>
            {img ? <img src={img} alt="profile" style={{ width:80, height:80, borderRadius:10, objectFit:'cover', border:'2px solid #e5e7eb' }}/>
              : <div style={{ width:80, height:80, border:'2px dashed #d1d5db', borderRadius:10, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', color:'#9ca3af' }}><CameraIcon/><span style={{ fontSize:10, marginTop:3, fontWeight:600 }}>Upload</span></div>}
          </label>
        </div>
        <div style={{ marginTop:14 }}>
          <label style={{ fontSize:12, fontWeight:600, color:'#374151', marginBottom:5, display:'block' }}>Address</label>
          <textarea name="address" value={form.address} onChange={ch} rows={3} className="field-input" style={{ resize:'none', fontFamily:'inherit' }}/>
        </div>
        <div style={{ marginTop:18 }}>
          <button style={{ display:'flex', alignItems:'center', gap:6, background:'#3b82f6', color:'#fff', border:'none', padding:'9px 16px', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer' }} onClick={save}><SaveIcon/> Update</button>
        </div>
      </div>
    </div>
  );
}

// ─── Modal Shell ──────────────────────────────────────────────────────────────
function ModalShell({ title, onClose, children }) {
  return (
    <div style={{ position:'fixed', inset:0, zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:16, background:'rgba(0,0,0,0.45)', backdropFilter:'blur(4px)' }}>
      <div style={{ background:'#fff', borderRadius:16, boxShadow:'0 20px 60px rgba(0,0,0,.2)', width:'100%', maxWidth:380, padding:'20px 24px', animation:'modalIn .18s ease' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
          <h3 style={{ margin:0, fontSize:16, fontWeight:700, color:'#1f2937' }}>{title}</h3>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'#9ca3af' }}><XIcon/></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function AddStatusModal({ onConfirm, onClose }) {
  const [value, setValue] = useState('');
  return (
    <ModalShell title="Add Lead Status" onClose={onClose}>
      <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#6b7280', marginBottom:6 }}>Status Name</label>
      <input autoFocus value={value} onChange={e => setValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && value.trim() && onConfirm(value)} placeholder="e.g. Interested" className="field-input" style={{ marginBottom:20 }}/>
      <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
        <button onClick={onClose} style={{ padding:'8px 16px', borderRadius:8, border:'1px solid #e5e7eb', background:'#fff', fontSize:13, fontWeight:500, cursor:'pointer', color:'#374151' }}>Cancel</button>
        <button onClick={() => value.trim() && onConfirm(value)} disabled={!value.trim()} style={{ padding:'8px 16px', borderRadius:8, border:'none', background:'#3b82f6', color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer', opacity:value.trim()?1:0.4 }}>Add</button>
      </div>
    </ModalShell>
  );
}

function EditStatusModal({ initialName, onConfirm, onClose }) {
  const [value, setValue] = useState(initialName);
  return (
    <ModalShell title="Edit Lead Status" onClose={onClose}>
      <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#6b7280', marginBottom:6 }}>Status Name</label>
      <input autoFocus value={value} onChange={e => setValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && value.trim() && onConfirm(value)} className="field-input" style={{ marginBottom:20, borderColor:'#3b82f6' }}/>
      <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
        <button onClick={onClose} style={{ padding:'8px 16px', borderRadius:8, border:'1px solid #e5e7eb', background:'#fff', fontSize:13, fontWeight:500, cursor:'pointer', color:'#374151' }}>Cancel</button>
        <button onClick={() => value.trim() && onConfirm(value)} disabled={!value.trim()} style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 16px', borderRadius:8, border:'none', background:'#3b82f6', color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer', opacity:value.trim()?1:0.4 }}><SaveIcon/> Save Changes</button>
      </div>
    </ModalShell>
  );
}

// ─── Lead Status ──────────────────────────────────────────────────────────────
function LeadStatus() {
  const [statuses, setStatuses] = useState([
    { id:1, name:'Unreachable' }, { id:2, name:'Not Interested' }, { id:3, name:'Interested' },
  ]);
  const [search,      setSearch]      = useState('');
  const [selected,    setSelected]    = useState([]);
  const [addModal,    setAddModal]    = useState(false);
  const [editModal,   setEditModal]   = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);

  const filtered = statuses.filter(s=>s.name.toLowerCase().includes(search.toLowerCase()));
  const toggleSelect = id => setSelected(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  const toggleAll    = () => {
    const ids = filtered.map(s=>s.id);
    setSelected(ids.every(id=>selected.includes(id)) ? selected.filter(id=>!ids.includes(id)) : [...new Set([...selected,...ids])]);
  };
  const confirmAdd    = (value) => { setStatuses(p=>[...p,{ id:Date.now(), name:value.trim() }]); setAddModal(false); };
  const confirmEdit   = (value) => { setStatuses(p=>p.map(s=>s.id===editModal.id?{...s,name:value.trim()}:s)); setEditModal(null); };
  const confirmDelete = () => { setStatuses(p=>p.filter(s=>s.id!==deleteModal.id)); setSelected(p=>p.filter(id=>id!==deleteModal.id)); setDeleteModal(null); };
  const bulkDelete    = () => { setStatuses(p=>p.filter(s=>!selected.includes(s.id))); setSelected([]); };
  const allSel = filtered.length>0 && filtered.every(s=>selected.includes(s.id));

  return (
    <div style={{ padding:24 }}>
      {addModal && <AddStatusModal onConfirm={confirmAdd} onClose={() => setAddModal(false)} />}
      {editModal && <EditStatusModal initialName={editModal.name} onConfirm={confirmEdit} onClose={() => setEditModal(null)} />}
      {deleteModal && (
        <ModalShell title="Delete Status" onClose={()=>setDeleteModal(null)}>
          <p style={{ fontSize:14, color:'#6b7280', margin:'0 0 20px' }}>Are you sure you want to delete <strong style={{ color:'#1f2937' }}>"{deleteModal.name}"</strong>? This action cannot be undone.</p>
          <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
            <button onClick={()=>setDeleteModal(null)} style={{ padding:'8px 16px', borderRadius:8, border:'1px solid #e5e7eb', background:'#fff', fontSize:13, fontWeight:500, cursor:'pointer', color:'#374151' }}>Cancel</button>
            <button onClick={confirmDelete} style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 16px', borderRadius:8, border:'none', background:'#ef4444', color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer' }}>
              <Trash2 size={13}/> Delete
            </button>
          </div>
        </ModalShell>
      )}

      <div style={{ marginBottom:16 }}>
        <h2 style={{ fontSize:20, fontWeight:700, color:'#1f2937' }}>Lead Status</h2>
        <p style={{ fontSize:12, color:'#9ca3af', marginTop:2 }}>Dashboard - <span style={{ color:'#6b7280' }}>Lead Status</span></p>
      </div>

      <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'space-between', alignItems:'center', gap:10, marginBottom:16 }}>
        <div style={{ display:'flex', gap:8, flex:'1 1 auto' }}>
          <button onClick={() => setAddModal(true)}
            style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, background:'#3b82f6', color:'#fff', border:'none', padding:'9px 16px', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', flex:'1 1 auto' }}>
            <PlusIcon/> Add Lead Status
          </button>
          {selected.length > 0 && (
            <button onClick={bulkDelete} style={{ display:'flex', alignItems:'center', gap:6, background:'#ef4444', color:'#fff', border:'none', padding:'9px 14px', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer' }}>
              <Trash2 size={13}/> Delete ({selected.length})
            </button>
          )}
        </div>
        <div style={{ position:'relative', width:220 }}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." className="field-input" style={{ paddingLeft:34 }}/>
          <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#9ca3af' }}><SearchIcon/></span>
        </div>
      </div>

      {/* ✅ Mobile Cards — icon-only w-9 h-9 buttons, name left + buttons right */}
      <div className="sm-hide" style={{ flexDirection:'column', gap:12 }}>
        {filtered.length === 0
          ? <div style={{ textAlign:'center', padding:'40px 0', color:'#9ca3af', fontSize:14 }}>No results found</div>
          : filtered.map(s=>(
            <div key={s.id} style={{ background:'#fff', border:'1.5px solid #e5e7eb', borderRadius:14, overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
              <div style={{ padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                {/* Left: checkbox + name */}
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <input type="checkbox" checked={selected.includes(s.id)} onChange={()=>toggleSelect(s.id)} style={{ width:16, height:16, cursor:'pointer', accentColor:'#3b82f6', flexShrink:0 }}/>
                  <div>
                    <p style={{ margin:0, fontSize:11, color:'#9ca3af', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:3 }}>Name</p>
                    <p style={{ margin:0, fontSize:14, fontWeight:600, color:'#1f2937' }}>{s.name}</p>
                  </div>
                </div>
                {/* ✅ Right: icon-only buttons — same as desktop */}
                <div style={{ display:'flex', gap:8 }}>
                  <button
                    onClick={() => setEditModal(s)}
                    style={{ width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center', background:'#3b82f6', border:'none', borderRadius:8, cursor:'pointer', color:'#fff', boxShadow:'0 1px 3px rgba(0,0,0,0.15)', flexShrink:0 }}
                  >
                    <Edit size={15}/>
                  </button>
                  <button
                    onClick={()=>setDeleteModal(s)}
                    style={{ width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center', background:'#ef4444', border:'none', borderRadius:8, cursor:'pointer', color:'#fff', boxShadow:'0 1px 3px rgba(0,0,0,0.15)', flexShrink:0 }}
                  >
                    <Trash2 size={15}/>
                  </button>
                </div>
              </div>
            </div>
          ))
        }
      </div>

      {/* Desktop Table */}
      <div className="dt-show" style={{ background:'#fff', borderRadius:14, border:'1.5px solid #f1f5f9', boxShadow:'0 1px 6px rgba(0,0,0,.06)', overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'#f9fafb' }}>
              <th style={{ padding:'11px 14px', width:40 }}><input type="checkbox" checked={allSel} onChange={toggleAll} style={{ width:15, height:15, cursor:'pointer', accentColor:'#3b82f6' }}/></th>
              <th style={{ padding:'11px 14px', textAlign:'left', fontSize:13, fontWeight:600, color:'#6b7280' }}>Name</th>
              <th style={{ padding:'11px 14px', textAlign:'right', fontSize:13, fontWeight:600, color:'#6b7280' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0
              ? <tr><td colSpan={3} style={{ textAlign:'center', padding:'40px 0', color:'#9ca3af', fontSize:14 }}>No results found</td></tr>
              : filtered.map((s,i)=>(
                <tr key={s.id} style={{ borderTop:'1px solid #f3f4f6', background:selected.includes(s.id)?'#eff6ff':i%2===0?'#fff':'#fafafa', transition:'background .1s' }}
                  onMouseEnter={e=>{ if(!selected.includes(s.id)) e.currentTarget.style.background='#f9fafb'; }}
                  onMouseLeave={e=>{ e.currentTarget.style.background=selected.includes(s.id)?'#eff6ff':i%2===0?'#fff':'#fafafa'; }}>
                  <td style={{ padding:'12px 14px' }}><input type="checkbox" checked={selected.includes(s.id)} onChange={()=>toggleSelect(s.id)} style={{ width:15, height:15, cursor:'pointer', accentColor:'#3b82f6' }}/></td>
                  <td style={{ padding:'12px 14px', fontSize:14, color:'#374151' }}>{s.name}</td>
                  <td style={{ padding:'12px 14px' }}>
                    <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
                      <button
                        onClick={() => setEditModal(s)}
                        style={{ width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center', background:'#3b82f6', border:'none', borderRadius:8, cursor:'pointer', color:'#fff', boxShadow:'0 1px 3px rgba(0,0,0,0.15)' }}
                      >
                        <Edit size={15}/>
                      </button>
                      <button
                        onClick={()=>setDeleteModal(s)}
                        style={{ width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center', background:'#ef4444', border:'none', borderRadius:8, cursor:'pointer', color:'#fff', boxShadow:'0 1px 3px rgba(0,0,0,0.15)' }}
                      >
                        <Trash2 size={15}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Role & Permissions ───────────────────────────────────────────────────────
const PERMISSION_SECTIONS = [
  { label:'Staff Members',      perms:['View','Add','Edit','Delete'] },
  { label:'Salesmans',          perms:['View','Add','Edit','Delete'] },
  { label:'Campaigns',          perms:['View','Add','Edit','Delete','Export Lead'] },
  { label:'Campaign View',      perms:['View All','View Completed Campaign'] },
  { label:'Leads',              perms:['View All','Add','Delete'] },
  { label:'Email Templates',    perms:['View','View All','Add','Edit','Delete'] },
  { label:'Expense Categories', perms:['View','Add','Edit','Delete'] },
  { label:'Expenses',           perms:['View','Add','Edit','Delete'] },
  { label:'Products',           perms:['View','Add','Edit','Delete'] },
  { label:'Forms',              perms:['View','View All','Add','Edit','Delete'] },
  { label:'Lead Table Fields',  perms:['View','Add','Edit','Delete'] },
  { label:'Translations',       perms:['View','Add','Edit','Delete'] },
  { label:'Role & Permissions', perms:['View','Add','Edit','Delete'] },
  { label:'Currencies',         perms:['View','Add','Edit','Delete'] },
  { label:'Company Settings',   perms:['Edit'] },
  { label:'Storage Settings',   perms:['Edit'] },
  { label:'Email Settings',     perms:['Edit'] },
];

const makeEmptyPerms = () => {
  const p = {};
  PERMISSION_SECTIONS.forEach(s=>s.perms.forEach(perm=>{ p[`${s.label}__${perm}`]=false; }));
  return p;
};

const DEFAULT_ROLES = [
  { id:1, name:'Manager',     displayName:'Manager',     description:'Team Manager can full permissions to manage campaigns.',             perms:(()=>{ const p=makeEmptyPerms(); ['Campaigns__View','Campaigns__Add','Campaigns__Edit','Campaign View__View All','Leads__View All','Leads__Add'].forEach(k=>p[k]=true); return p; })(), isDefault:false },
  { id:2, name:'Team Member', displayName:'Team Member', description:'Team Member can participate in campaigns which are assigned to him.', perms:(()=>{ const p=makeEmptyPerms(); ['Campaigns__View','Campaign View__View All'].forEach(k=>p[k]=true); return p; })(), isDefault:false },
  { id:3, name:'Admin',       displayName:'Admin',       description:'Admin is allowed to manage everything of the app.',                  perms:(()=>{ const p=makeEmptyPerms(); Object.keys(p).forEach(k=>p[k]=true); return p; })(), isDefault:true },
];

const PermRow = ({ section, perms, onChange }) => (
  <div style={{ display:'flex', flexWrap:'wrap', alignItems:'flex-start', padding:'10px 0', borderBottom:'1px solid #f3f4f6', gap:6 }}>
    <div style={{ width:160, fontSize:13, color:'#6b7280', fontWeight:500, flexShrink:0, paddingTop:2 }}>{section.label}</div>
    <div style={{ display:'flex', flexWrap:'wrap', gap:'8px 20px', flex:1 }}>
      {section.perms.map(perm=>{
        const key=`${section.label}__${perm}`;
        return (
          <label key={perm} style={{ display:'flex', alignItems:'center', gap:5, fontSize:13, color:'#374151', cursor:'pointer', userSelect:'none' }}>
            <input type="checkbox" checked={!!perms[key]} onChange={e=>onChange(key,e.target.checked)} style={{ width:15, height:15, cursor:'pointer', accentColor:'#3b82f6' }}/>
            {perm}
          </label>
        );
      })}
    </div>
  </div>
);

function DrawerComp({ title, role, onChange, onClose, onSubmit, label }) {
  return (
    <div style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,0.35)', backdropFilter:'blur(2px)', display:'flex', justifyContent:'flex-end' }} onClick={onClose}>
      <div style={{ width:'100%', maxWidth:560, background:'#fff', height:'100%', display:'flex', flexDirection:'column', boxShadow:'-8px 0 40px rgba(0,0,0,.15)', animation:'slideInRight .3s ease' }} onClick={e=>e.stopPropagation()}>
        <div style={{ padding:'16px 24px', borderBottom:'1px solid #f3f4f6', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}>
          <h3 style={{ margin:0, fontSize:17, fontWeight:700, color:'#1f2937' }}>{title}</h3>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'#9ca3af', display:'flex', padding:4, borderRadius:6 }}><XIcon/></button>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:'20px 24px' }}>
          <div className="grid-2" style={{ marginBottom:16 }}>
            <div>
              <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#374151', marginBottom:6 }}><span style={{ color:'#ef4444' }}>* </span>Display Name</label>
              <input value={role.displayName} onChange={e=>onChange('displayName',e.target.value)} placeholder="Please Enter Display Name" className="field-input"/>
            </div>
            <div>
              <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#374151', marginBottom:6 }}><span style={{ color:'#ef4444' }}>* </span>Role Name</label>
              <input value={role.name} onChange={e=>onChange('name',e.target.value)} placeholder="Please Enter Role Name" className="field-input"/>
            </div>
          </div>
          <div style={{ marginBottom:20 }}>
            <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#374151', marginBottom:6 }}>Description</label>
            <textarea value={role.description} onChange={e=>onChange('description',e.target.value)} placeholder="Please Enter Description" rows={3} className="field-input" style={{ resize:'none', fontFamily:'inherit' }}/>
          </div>
          <div style={{ fontSize:13, fontWeight:700, color:'#374151', marginBottom:10 }}>Permissions</div>
          {PERMISSION_SECTIONS.map(s=>(
            <PermRow key={s.label} section={s} perms={role.perms} onChange={(key,val)=>onChange('perms',{...role.perms,[key]:val})}/>
          ))}
        </div>
        <div style={{ padding:'14px 24px', borderTop:'1px solid #f3f4f6', display:'flex', justifyContent:'flex-end', gap:10, flexShrink:0 }}>
          <button onClick={onClose} style={{ padding:'9px 20px', borderRadius:8, border:'1px solid #e5e7eb', background:'#fff', fontSize:13, fontWeight:600, cursor:'pointer', color:'#374151' }}>Cancel</button>
          <button onClick={onSubmit} style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 20px', borderRadius:8, border:'none', background:'#3b82f6', color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer', boxShadow:'0 2px 8px rgba(59,130,246,.3)' }}>
            <SaveIcon/> {label}
          </button>
        </div>
      </div>
    </div>
  );
}

function RolePermission() {
  const [roles,       setRoles]       = useState(DEFAULT_ROLES);
  const [selected,    setSelected]    = useState([]);
  const [page,        setPage]        = useState(1);
  const [addDrawer,   setAddDrawer]   = useState(false);
  const [editDrawer,  setEditDrawer]  = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [newRole,     setNewRole]     = useState({ displayName:'', name:'', description:'', perms:makeEmptyPerms() });
  const [toast,       setToast]       = useState({ show:false, message:'', type:'success' });
  const perPage = 10;

  const showToast = (message, type='success') => { setToast({ show:true, message, type }); setTimeout(()=>setToast(t=>({...t,show:false})),3000); };
  const paginated  = roles.slice((page-1)*perPage, page*perPage);
  const totalPages = Math.ceil(roles.length/perPage);
  const toggleSelect = id => setSelected(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  const toggleAll    = () => setSelected(selected.length===paginated.length?[]:paginated.map(r=>r.id));
  const handleAdd    = () => { if(!newRole.displayName.trim()||!newRole.name.trim()) return; setRoles(p=>[...p,{ id:Date.now(),...newRole,isDefault:false }]); setNewRole({ displayName:'',name:'',description:'',perms:makeEmptyPerms() }); setAddDrawer(false); showToast('Role created successfully!'); };
  const handleEdit   = () => { setRoles(p=>p.map(r=>r.id===editDrawer.id?editDrawer:r)); setEditDrawer(null); showToast('Role updated successfully!'); };
  const handleDelete = () => { setRoles(p=>p.filter(r=>r.id!==deleteModal.id)); setDeleteModal(null); showToast('Role deleted!','error'); };

  return (
    <div style={{ padding:24 }}>
      <Toast show={toast.show} message={toast.message} type={toast.type}/>
      {addDrawer && <DrawerComp title="Add New Role" role={newRole} onChange={(f,v) => setNewRole(p=>({...p,[f]:v}))} onClose={() => setAddDrawer(false)} onSubmit={handleAdd} label="Create"/>}
      {editDrawer && <DrawerComp title={`Edit Role — ${editDrawer.name}`} role={editDrawer} onChange={(f,v) => setEditDrawer(p=>({...p,[f]:v}))} onClose={() => setEditDrawer(null)} onSubmit={handleEdit} label="Update"/>}
      {deleteModal && (
        <div style={{ position:'fixed', inset:0, zIndex:2000, background:'rgba(0,0,0,0.4)', backdropFilter:'blur(2px)', display:'flex', alignItems:'center', justifyContent:'center', padding:16 }} onClick={()=>setDeleteModal(null)}>
          <div style={{ background:'#fff', borderRadius:16, boxShadow:'0 20px 60px rgba(0,0,0,.2)', width:'100%', maxWidth:440, animation:'popIn .25s ease' }} onClick={e=>e.stopPropagation()}>
            <div style={{ padding:'16px 24px', borderBottom:'1px solid #f3f4f6', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <h3 style={{ margin:0, fontSize:17, fontWeight:700, color:'#1f2937' }}>Delete Role</h3>
              <button onClick={()=>setDeleteModal(null)} style={{ background:'none', border:'none', cursor:'pointer', color:'#9ca3af', display:'flex', padding:4 }}><XIcon/></button>
            </div>
            <div style={{ padding:'20px 24px' }}>
              <p style={{ margin:0, fontSize:14, color:'#374151' }}>Are you sure you want to delete role <strong>"{deleteModal.name}"</strong>? This action cannot be undone.</p>
            </div>
            <div style={{ padding:'14px 24px', borderTop:'1px solid #f3f4f6', display:'flex', justifyContent:'flex-end', gap:10 }}>
              <button onClick={()=>setDeleteModal(null)} style={{ padding:'9px 20px', borderRadius:8, border:'1px solid #e5e7eb', background:'#fff', fontSize:13, fontWeight:600, cursor:'pointer', color:'#374151' }}>Cancel</button>
              <button onClick={handleDelete} style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 20px', borderRadius:8, border:'none', background:'#ef4444', color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer' }}>
                <Trash2 size={13}/> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginBottom:16 }}>
        <h2 style={{ fontSize:20, fontWeight:700, color:'#1f2937' }}>Role & Permissions</h2>
        <p style={{ fontSize:12, color:'#9ca3af', marginTop:2 }}>Dashboard - Settings - <span style={{ color:'#6b7280' }}>Role & Permissions</span></p>
      </div>

      <div style={{ background:'#fff', borderRadius:14, border:'1.5px solid #f1f5f9', boxShadow:'0 1px 6px rgba(0,0,0,.06)', overflow:'hidden' }}>
        <div style={{ padding:'14px 16px', borderBottom:'1px solid #f3f4f6' }}>
          <button onClick={()=>{ setNewRole({ displayName:'',name:'',description:'',perms:makeEmptyPerms() }); setAddDrawer(true); }}
            style={{ display:'flex', alignItems:'center', gap:6, background:'#3b82f6', color:'#fff', border:'none', padding:'9px 16px', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', boxShadow:'0 2px 8px rgba(59,130,246,.3)' }}>
            <PlusIcon/> Add New Role
          </button>
        </div>

        {/* ✅ Mobile Cards — icon-only w-9 h-9 buttons */}
        <div className="sm-hide2" style={{ flexDirection:'column', gap:10, padding:12 }}>
          {paginated.length === 0
            ? <p style={{ textAlign:'center', color:'#9ca3af', fontSize:14, padding:'32px 0' }}>No roles found</p>
            : paginated.map(role=>(
              <div key={role.id} onClick={()=>setEditDrawer({...role,perms:{...role.perms}})}
                style={{ background:selected.includes(role.id)?'#eff6ff':'#fff', border:`1.5px solid ${selected.includes(role.id)?'#bfdbfe':'#e5e7eb'}`, borderRadius:12, overflow:'hidden', cursor:'pointer', boxShadow:'0 1px 4px rgba(0,0,0,.05)' }}>
                <div style={{ padding:'10px 14px', display:'flex', alignItems:'center', gap:10, borderBottom:'1px solid #f3f4f6' }}>
                  <input type="checkbox" checked={selected.includes(role.id)} onChange={()=>toggleSelect(role.id)} onClick={e=>e.stopPropagation()} style={{ width:15, height:15, cursor:'pointer', accentColor:'#3b82f6' }}/>
                  <span style={{ fontSize:11, fontWeight:700, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.5px', width:90, flexShrink:0 }}>Role Name</span>
                  <span style={{ fontSize:14, fontWeight:600, color:'#1f2937' }}>{role.name}</span>
                </div>
                <div style={{ padding:'10px 14px', display:'flex', alignItems:'flex-start', gap:10, borderBottom:'1px solid #f3f4f6' }}>
                  <div style={{ width:15, flexShrink:0 }}/>
                  <span style={{ fontSize:11, fontWeight:700, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.5px', width:90, flexShrink:0, paddingTop:2 }}>Description</span>
                  <span style={{ fontSize:13, color:'#6b7280', lineHeight:1.4 }}>{role.description}</span>
                </div>
                <div style={{ padding:'10px 14px', display:'flex', alignItems:'center', gap:10 }} onClick={e=>e.stopPropagation()}>
                  <div style={{ width:15, flexShrink:0 }}/>
                  <span style={{ fontSize:11, fontWeight:700, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.5px', width:90, flexShrink:0 }}>Action</span>
                  {/* ✅ icon-only buttons */}
                  <div style={{ display:'flex', gap:8 }}>
                    <button
                      onClick={()=>setEditDrawer({...role,perms:{...role.perms}})}
                      style={{ width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center', background:'#3b82f6', border:'none', borderRadius:8, cursor:'pointer', color:'#fff', boxShadow:'0 1px 3px rgba(0,0,0,0.15)', flexShrink:0 }}
                    >
                      <Edit size={15}/>
                    </button>
                    {!role.isDefault && (
                      <button
                        onClick={()=>setDeleteModal(role)}
                        style={{ width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center', background:'#ef4444', border:'none', borderRadius:8, cursor:'pointer', color:'#fff', boxShadow:'0 1px 3px rgba(0,0,0,0.15)', flexShrink:0 }}
                      >
                        <Trash2 size={15}/>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          }
        </div>

        {/* Desktop Table */}
        <div className="dt-show2" style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'#f9fafb' }}>
                <th style={{ padding:'11px 16px', width:40 }}><input type="checkbox" checked={selected.length===paginated.length&&paginated.length>0} onChange={toggleAll} style={{ width:15, height:15, cursor:'pointer', accentColor:'#3b82f6' }}/></th>
                <th style={{ padding:'11px 16px', textAlign:'left', fontSize:13, fontWeight:600, color:'#6b7280' }}><div style={{ display:'flex', alignItems:'center', gap:4 }}>Role Name <SortIcon/></div></th>
                <th style={{ padding:'11px 16px', textAlign:'left', fontSize:13, fontWeight:600, color:'#6b7280' }}>Description</th>
                <th style={{ padding:'11px 16px', textAlign:'right', fontSize:13, fontWeight:600, color:'#6b7280' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0
                ? <tr><td colSpan={4} style={{ textAlign:'center', padding:'40px 0', color:'#9ca3af', fontSize:14 }}>No roles found</td></tr>
                : paginated.map((role,i)=>(
                  <tr key={role.id} onClick={()=>setEditDrawer({...role,perms:{...role.perms}})}
                    style={{ borderTop:'1px solid #f3f4f6', background:selected.includes(role.id)?'#eff6ff':i%2===0?'#fff':'#fafafa', cursor:'pointer', transition:'background .1s' }}
                    onMouseEnter={e=>{ if(!selected.includes(role.id)) e.currentTarget.style.background='#f0f9ff'; }}
                    onMouseLeave={e=>{ e.currentTarget.style.background=selected.includes(role.id)?'#eff6ff':i%2===0?'#fff':'#fafafa'; }}>
                    <td style={{ padding:'13px 16px' }} onClick={e=>e.stopPropagation()}><input type="checkbox" checked={selected.includes(role.id)} onChange={()=>toggleSelect(role.id)} style={{ width:15, height:15, cursor:'pointer', accentColor:'#3b82f6' }}/></td>
                    <td style={{ padding:'13px 16px', fontSize:14, fontWeight:500, color:'#1f2937' }}>{role.name}</td>
                    <td style={{ padding:'13px 16px', fontSize:13, color:'#6b7280', maxWidth:400 }}><span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', display:'block' }}>{role.description}</span></td>
                    <td style={{ padding:'13px 16px' }} onClick={e=>e.stopPropagation()}>
                      <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
                        <button
                          onClick={()=>setEditDrawer({...role,perms:{...role.perms}})}
                          style={{ width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center', background:'#3b82f6', border:'none', borderRadius:8, cursor:'pointer', color:'#fff', boxShadow:'0 1px 3px rgba(0,0,0,0.15)' }}
                        >
                          <Edit size={15}/>
                        </button>
                        {!role.isDefault && (
                          <button
                            onClick={()=>setDeleteModal(role)}
                            style={{ width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center', background:'#ef4444', border:'none', borderRadius:8, cursor:'pointer', color:'#fff', boxShadow:'0 1px 3px rgba(0,0,0,0.15)' }}
                          >
                            <Trash2 size={15}/>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
        <Pagination page={page} total={totalPages||1} onPage={setPage}/>
      </div>
    </div>
  );
}

// ─── Placeholder ──────────────────────────────────────────────────────────────
const PlaceholderPanel = ({ title }) => (
  <div style={{ padding:24 }}>
    <h2 style={{ fontSize:20, fontWeight:700, color:'#1f2937', marginBottom:16 }}>{title}</h2>
    <div style={{ background:'#fff', borderRadius:14, border:'1px solid #f1f5f9', padding:40, textAlign:'center', color:'#9ca3af' }}>
      <div style={{ fontSize:14 }}>This panel is under development.</div>
    </div>
  </div>
);

// ─── Menus ────────────────────────────────────────────────────────────────────
const ADMIN_MENU = [
  { key:'company',      label:'Company Settings', icon:'🏢' },
  { key:'profile',      label:'Profile',          icon:'👤' },
  { key:'leadstatus',   label:'Lead Status',       icon:'🏷️' },
  { key:'translations', label:'Translations',      icon:'🌐' },
  { key:'roles',        label:'Role & Permissions',icon:'🔐' },
  { key:'currencies',   label:'Currencies',        icon:'💵' },
  { key:'modules',      label:'Modules',           icon:'🧩' },
  { key:'storage',      label:'Storage Settings',  icon:'🗄️' },
  { key:'email',        label:'Email Settings',    icon:'✉️' },
  { key:'database',     label:'Database Backup',   icon:'💾' },
  { key:'update',       label:'Update App',        icon:'🔄' },
];
const MEMBER_MENU  = [{ key:'profile', label:'Profile', icon:'👤' }, { key:'leadstatus', label:'Lead Status', icon:'🏷️' }];
const MANAGER_MENU = [{ key:'profile', label:'Profile', icon:'👤' }, { key:'leadstatus', label:'Lead Status', icon:'🏷️' }];

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function AdminSettings({ role = 'admin' }) {
  const MENU = role==='member'?MEMBER_MENU:role==='manager'?MANAGER_MENU:ADMIN_MENU;
  const [active,      setActive]      = useState(MENU[0].key);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = key => { setActive(key); setSidebarOpen(false); };

  const renderPanel = () => {
    switch (active) {
      case 'company':      return <CompanySettings/>;
      case 'profile':      return <ProfilePanel/>;
      case 'leadstatus':   return <LeadStatus/>;
      case 'translations': return <Translations/>;
      case 'roles':        return <RolePermission/>;
      case 'currencies':   return <Currencies/>;
      case 'modules':      return <Modules/>;
      case 'storage':      return <StorageSettings/>;
      case 'email':        return <EmailSettings/>;
      case 'database':     return <DatabaseBackup/>;
      case 'update':       return <UpdateApp/>;
      default:             return <PlaceholderPanel title={MENU.find(m=>m.key===active)?.label||'Settings'}/>;
    }
  };

  const activeLabel = MENU.find(m=>m.key===active)?.label||'Settings';

  return (
    <>
      <GlobalStyles/>
      <div className="mobile-topbar">
        <button onClick={()=>setSidebarOpen(true)} style={{ background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', color:'#374151' }}><MenuIcon/></button>
        <span style={{ fontSize:15, fontWeight:700, color:'#1f2937' }}>{activeLabel}</span>
        <div style={{ width:36 }}/>
      </div>
      <div className="admin-layout">
        <div className={`sidebar-overlay ${sidebarOpen?'open':''}`} onClick={()=>setSidebarOpen(false)}/>
        <div className={`sidebar ${sidebarOpen?'open':''}`}>
          <div style={{ padding:'16px 20px', borderBottom:'1px solid #f3f4f6', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <span style={{ fontSize:15, fontWeight:700, color:'#1f2937' }}>
              {role==='member'?'Member Settings':role==='manager'?'Manager Settings':'Admin Settings'}
            </span>
            <button onClick={()=>setSidebarOpen(false)} className="sidebar-close-btn" style={{ background:'none', border:'none', cursor:'pointer', color:'#9ca3af', display:'none' }}><XIcon/></button>
          </div>
          <div style={{ overflowY:'auto', flex:1 }}>
            {MENU.map(item=>(
              <button key={item.key} onClick={()=>navigate(item.key)}
                style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'11px 20px', textAlign:'left', border:'none', cursor:'pointer', fontSize:13, fontWeight:active===item.key?600:400, transition:'all .15s', background:active===item.key?'#3b82f6':'transparent', color:active===item.key?'#fff':'#6b7280', fontFamily:'inherit' }}
                onMouseEnter={e=>{ if(active!==item.key) e.currentTarget.style.background='#f9fafb'; }}
                onMouseLeave={e=>{ if(active!==item.key) e.currentTarget.style.background='transparent'; }}>
                <span style={{ fontSize:15 }}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className="main-content">{renderPanel()}</div>
      </div>
      <style>{`@media(max-width:640px){.sidebar-close-btn{display:flex!important}}`}</style>
    </>
  );
}