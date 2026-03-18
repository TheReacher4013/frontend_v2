import { useState, useRef, memo, useCallback } from "react";

const PlusIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>;
const EditIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>;
const TrashIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>;
const DownloadIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>;
const SearchIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>;
const XIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>;
const CheckCircleIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>;
const ImportIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" transform="rotate(180,12,12)"/></svg>;
const EyeIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/></svg>;
const RefreshIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>;
const CameraIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4z"/><path d="M9 3L7.17 5H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2h-3.17L15 3H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/></svg>;
const ArrowLeftIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>;
const ChevronDownIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>;
const SaveIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>;

const btnPrimary = { display:'flex', alignItems:'center', gap:5, background:'#3b82f6', color:'#fff', border:'none', padding:'9px 12px', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', whiteSpace:'nowrap', minWidth:0 };
const btnSecondary = { display:'flex', alignItems:'center', gap:5, background:'#f3f4f6', color:'#374151', border:'none', padding:'9px 12px', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', whiteSpace:'nowrap', minWidth:0 };

const Toast = ({ show, message }) => (
  <div style={{ position:'fixed', bottom:16, left:16, right:16, zIndex:9999, background:'#fff', borderRadius:12, boxShadow:'0 8px 32px rgba(0,0,0,0.15)', padding:'12px 16px', display:'flex', alignItems:'center', gap:10, border:'1.5px solid #d1fae5', transform: show ? 'translateY(0)' : 'translateY(80px)', opacity: show ? 1 : 0, transition:'all 0.35s cubic-bezier(.4,2,.6,1)', maxWidth:360, marginLeft:'auto' }}>
  <div style={{ color:'#10b981' }}><CheckCircleIcon /></div>
  <div><div style={{ fontSize:14, fontWeight:700, color:'#065f46' }}>Success</div><div style={{ fontSize:12, color:'#6b7280' }}>{message}</div></div>
</div>
);

// ✅ Modal — wrapper, children render करतो
const Modal = ({ title, onClose, children, footer, width=480 }) => (
  <div style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,0.4)', backdropFilter:'blur(2px)', display:'flex', alignItems:'center', justifyContent:'center', padding:12 }} onClick={onClose}>
    <div style={{ background:'#fff', borderRadius:14, boxShadow:'0 20px 60px rgba(0,0,0,0.2)', width:'100%', maxWidth:Math.min(width, window.innerWidth - 24), animation:'popIn .25s cubic-bezier(.4,0,.2,1)' }} onClick={e=>e.stopPropagation()}>
      <div style={{ padding:'16px 18px', borderBottom:'1px solid #f3f4f6', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <h3 style={{ margin:0, fontSize:16, fontWeight:700, color:'#1f2937' }}>{title}</h3>
        <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'#9ca3af', display:'flex', padding:4, borderRadius:6 }}><XIcon /></button>
      </div>
      <div style={{ padding:'18px' }}>{children}</div>
      {footer && <div style={{ padding:'14px 18px', borderTop:'1px solid #f3f4f6', display:'flex', justifyContent:'flex-end', gap:10, flexWrap:'wrap' }}>{footer}</div>}
    </div>
    <style>{`@keyframes popIn{from{transform:scale(.92);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
  </div>
);

const Toggle = ({ checked, onChange }) => (
  <div onClick={()=>onChange(!checked)} style={{ width:44, height:24, borderRadius:12, background: checked?'#3b82f6':'#d1d5db', cursor:'pointer', position:'relative', transition:'background .2s', flexShrink:0 }}>
    <div style={{ position:'absolute', top:2, left: checked?22:2, width:20, height:20, borderRadius:'50%', background:'#fff', boxShadow:'0 1px 3px rgba(0,0,0,.2)', transition:'left .2s' }}/>
  </div>
);

const FlagUpload = ({ value, onChange }) => (
  <div style={{ marginBottom:16 }}>
    <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#374151', marginBottom:5 }}>Flag</label>
    <label style={{ cursor:'pointer', display:'inline-block' }}>
      <input type="file" accept="image/*" style={{ display:'none' }} onChange={e=>{ const f=e.target.files[0]; if(f) onChange(URL.createObjectURL(f)); }}/>
      {value
        ? <img src={value} alt="flag" style={{ width:80, height:56, objectFit:'cover', borderRadius:8, border:'2px dashed #d1d5db' }}/>
        : <div style={{ width:80, height:56, border:'2px dashed #d1d5db', borderRadius:8, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', color:'#9ca3af', background:'#f9fafb', cursor:'pointer' }}>
            <CameraIcon/><span style={{ fontSize:10, marginTop:2, fontWeight:600 }}>Upload</span>
          </div>
      }
    </label>
  </div>
);

const TRANSLATION_GROUPS = ['common','menu','dashboard','user','salesman','role','notes','campaign'];
const TRANSLATION_BASE_ROWS = [
  { group:'common', key:'enabled', en:'Enabled' },
  { group:'common', key:'disabled', en:'Disabled' },
  { group:'common', key:'id', en:'Id' },
  { group:'common', key:'action', en:'Action' },
  { group:'common', key:'placeholder_default_text', en:'Please Enter {0}' },
  { group:'common', key:'placeholder_social_text', en:'Please Enter {0} Url' },
  { group:'menu', key:'dashboard', en:'Dashboard' },
  { group:'menu', key:'settings', en:'Settings' },
  { group:'dashboard', key:'total_leads', en:'Total Leads' },
  { group:'user', key:'name', en:'Name' },
  { group:'salesman', key:'assigned', en:'Assigned' },
  { group:'role', key:'permission', en:'Permission' },
  { group:'notes', key:'note', en:'Note' },
  { group:'campaign', key:'subject', en:'Subject' },
];

// ✅ LangModal — स्वतःची LOCAL state ठेवतो त्यामुळे typing blink होत नाही
function LangModal({ initialItem, isEdit, onClose, onSubmit }) {
  const [item, setItem] = useState(() => ({
    name: initialItem.name || '',
    key: initialItem.key || '',
    flag: initialItem.flag || null,
  }));

  return (
    <Modal
      title={isEdit ? 'Edit Language' : 'Add New Language'}
      onClose={onClose}
      footer={<>
        <button style={btnSecondary} onClick={onClose}>Cancel</button>
        <button style={btnPrimary} onClick={() => item.name.trim() && item.key.trim() && onSubmit(item)}>
          <SaveIcon/> {isEdit ? 'Update' : 'Create'}
        </button>
      </>}
    >
      {/* ✅ Local controlled inputs — no parent re-render */}
      <div style={{ marginBottom:16 }}>
        <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#374151', marginBottom:5 }}>
          <span style={{ color:'#ef4444' }}>* </span>Name
        </label>
        <input
          autoFocus
          value={item.name}
          onChange={e => setItem(p => ({ ...p, name: e.target.value }))}
          placeholder="Please Enter Name"
          style={{ width:'100%', border:'1.5px solid #e5e7eb', borderRadius:8, padding:'10px 14px', fontSize:13, outline:'none', background:'#fff', boxSizing:'border-box', fontFamily:'inherit' }}
          onFocus={e=>e.target.style.borderColor='#3b82f6'} onBlur={e=>e.target.style.borderColor='#e5e7eb'}
        />
      </div>
      <div style={{ marginBottom:16 }}>
        <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#374151', marginBottom:5 }}>
          <span style={{ color:'#ef4444' }}>* </span>Key
        </label>
        <input
          value={item.key}
          onChange={e => setItem(p => ({ ...p, key: e.target.value }))}
          placeholder="e.g. en, hi, mr"
          style={{ width:'100%', border:'1.5px solid #e5e7eb', borderRadius:8, padding:'10px 14px', fontSize:13, outline:'none', background:'#fff', boxSizing:'border-box', fontFamily:'inherit' }}
          onFocus={e=>e.target.style.borderColor='#3b82f6'} onBlur={e=>e.target.style.borderColor='#e5e7eb'}
        />
      </div>
      <FlagUpload value={item.flag} onChange={v => setItem(p => ({ ...p, flag: v }))} />
    </Modal>
  );
}

// ✅ TranslationInput — memo + local state — table मध्ये typing blink नाही
const TranslationInput = memo(function TranslationInput({ initialValue, onCommit, style }) {
  const [val, setVal] = useState(initialValue);
  return (
    <input
      value={val}
      onChange={e => setVal(e.target.value)}
      onBlur={() => onCommit(val)}
      style={style}
      onFocus={e=>e.target.style.borderColor='#3b82f6'}
    />
  );
});

// ─── Languages Sub-View ───────────────────────────────────────────────────────
function LanguagesView({ languages, onBack, onAdd, onEdit, onDelete, onToggle }) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);

  const filtered = languages.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.key.toLowerCase().includes(search.toLowerCase())
  );
  const toggleAll = () => setSelected(selected.length === filtered.length ? [] : filtered.map(l=>l.id));

  return (
    <div style={{ padding:10 }}>
      <style>{`
        @media(min-width:640px){.lv-mobile{display:none!important}}
        @media(max-width:639px){.lv-desktop{display:none!important}}
        @media(min-width:640px){.lv-header{flex-direction:row!important;justify-content:space-between!important}.lv-toolbar{flex-direction:row!important;justify-content:space-between!important}.lv-toolbar-btns{flex-wrap:wrap!important}.lv-search-wrap{width:200px!important}}
        @media(max-width:359px){.lv-header-btns button{font-size:12px!important;padding:8px 10px!important;gap:4px!important}.lv-card-actions button{font-size:11px!important;padding:7px 6px!important;gap:3px!important}}
      `}</style>

      <div className="lv-header" style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:16 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <button onClick={onBack} style={{ background:'none', border:'none', cursor:'pointer', color:'#374151', display:'flex', padding:4 }}><ArrowLeftIcon/></button>
          <div>
            <h2 style={{ margin:0, fontSize:20, fontWeight:700, color:'#1f2937' }}>Languages</h2>
            <p style={{ margin:'2px 0 0', fontSize:12, color:'#9ca3af' }}>Dashboard - Settings - Translations - <span style={{ color:'#6b7280' }}>Languages</span></p>
          </div>
        </div>
        <div className="lv-header-btns" style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          <button style={{ ...btnSecondary, flex:1, justifyContent:'center' }}><ImportIcon/> Import</button>
          <button style={{ ...btnPrimary, flex:1, justifyContent:'center' }} onClick={onAdd}><PlusIcon/> Add Language</button>
        </div>
      </div>

      <div style={{ background:'#fff', borderRadius:14, boxShadow:'0 1px 6px rgba(0,0,0,.06)', border:'1.5px solid #f1f5f9', overflow:'hidden' }}>
        <div className="lv-toolbar" style={{ padding:'12px 14px', display:'flex', flexDirection:'column', gap:10, borderBottom:'1px solid #f3f4f6' }}>
          <div className="lv-toolbar-btns" style={{ display:'flex', gap:8 }}>
            <button style={btnPrimary} onClick={onAdd}><PlusIcon/> Add New Language</button>
            <button style={btnSecondary}><ImportIcon/> Import</button>
          </div>
          <div className="lv-search-wrap" style={{ position:'relative', width:'100%' }}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..."
              style={{ width:'100%', border:'1.5px solid #e5e7eb', borderRadius:8, padding:'8px 14px 8px 34px', fontSize:13, outline:'none', boxSizing:'border-box' }}
              onFocus={e=>e.target.style.borderColor='#3b82f6'} onBlur={e=>e.target.style.borderColor='#e5e7eb'}/>
            <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#9ca3af' }}><SearchIcon/></span>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="lv-mobile" style={{ padding:12, display:'flex', flexDirection:'column', gap:12 }}>
          {filtered.length === 0
            ? <div style={{ padding:32, textAlign:'center', color:'#9ca3af', fontSize:14 }}>No languages found</div>
            : filtered.map(lang => (
              <div key={lang.id} style={{
                background: selected.includes(lang.id) ? '#eff6ff' : '#fff',
                border:`1.5px solid ${selected.includes(lang.id)?'#bfdbfe':'#e5e7eb'}`,
                borderRadius:12, overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.06)'
              }}>
                <div style={{ background: selected.includes(lang.id) ? '#dbeafe' : '#f8fafc', padding:'10px 14px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:`1px solid ${selected.includes(lang.id)?'#bfdbfe':'#e5e7eb'}` }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <input type="checkbox" checked={selected.includes(lang.id)} onChange={()=>setSelected(p=>p.includes(lang.id)?p.filter(x=>x!==lang.id):[...p,lang.id])} style={{ cursor:'pointer', width:15, height:15 }}/>
                    <span style={{ fontSize:12, fontWeight:700, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.5px' }}>Language</span>
                  </div>
                  <Toggle checked={lang.enabled} onChange={v=>onToggle(lang.id,v)}/>
                </div>
                <div style={{ padding:'14px' }}>
                  <div style={{ marginBottom:12 }}>
                    <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:6 }}>Name</label>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      {lang.flag ? <img src={lang.flag} alt="" style={{ width:32, height:22, objectFit:'cover', borderRadius:4, border:'1px solid #e5e7eb', flexShrink:0 }}/> : <div style={{ width:32, height:22, background:'#e5e7eb', borderRadius:4, display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, color:'#9ca3af', flexShrink:0 }}>IMG</div>}
                      <div style={{ flex:1, border:'1.5px solid #e5e7eb', borderRadius:8, padding:'9px 12px', fontSize:14, background:'#f9fafb', color:'#1f2937', fontWeight:500 }}>{lang.name}</div>
                    </div>
                  </div>
                  <div style={{ marginBottom: lang.isDefault ? 0 : 14 }}>
                    <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:6 }}>Key</label>
                    <div style={{ border:'1.5px solid #e5e7eb', borderRadius:8, padding:'9px 12px', fontSize:13, background:'#f9fafb', color:'#6b7280', fontFamily:'monospace' }}>{lang.key}</div>
                  </div>
                  {!lang.isDefault && (
                    <div className="lv-card-actions" style={{ display:'flex', gap:6, paddingTop:12, borderTop:'1px solid #f3f4f6' }}>
                      <button onClick={()=>onEdit(lang)} style={{ ...btnPrimary, flex:1, justifyContent:'center', padding:'8px' }} onMouseEnter={e=>e.currentTarget.style.background='#2563eb'} onMouseLeave={e=>e.currentTarget.style.background='#3b82f6'}><EditIcon/> Edit</button>
                      <button onClick={()=>onDelete(lang)} style={{ ...btnPrimary, flex:1, justifyContent:'center', padding:'8px', background:'#ef4444' }} onMouseEnter={e=>e.currentTarget.style.background='#dc2626'} onMouseLeave={e=>e.currentTarget.style.background='#ef4444'}><TrashIcon/> Delete</button>
                      <button style={{ ...btnSecondary, flex:1, justifyContent:'center', padding:'8px' }}><DownloadIcon/> Export</button>
                    </div>
                  )}
                </div>
              </div>
            ))
          }
        </div>

        {/* Desktop Table */}
        <table className="lv-desktop" style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'#f9fafb' }}>
              <th style={{ padding:'11px 16px', width:40 }}>
                <input type="checkbox" checked={selected.length===filtered.length && filtered.length>0} onChange={toggleAll} style={{ cursor:'pointer', width:15, height:15 }}/>
              </th>
              {['Name','Key','Enabled','Action'].map(h=>(
                <th key={h} style={{ padding:'11px 16px', textAlign: h==='Action'?'right':'left', fontSize:13, fontWeight:600, color:'#6b7280' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length===0
              ? <tr><td colSpan={5} style={{ padding:36, textAlign:'center', color:'#9ca3af' }}>No languages found</td></tr>
              : filtered.map((lang,i)=>(
                <tr key={lang.id} style={{ borderTop:'1px solid #f3f4f6', background: selected.includes(lang.id)?'#eff6ff': i%2===0?'#fff':'#fafafa' }}>
                  <td style={{ padding:'13px 16px' }}>
                    <input type="checkbox" checked={selected.includes(lang.id)} onChange={()=>setSelected(p=>p.includes(lang.id)?p.filter(x=>x!==lang.id):[...p,lang.id])} style={{ cursor:'pointer', width:15, height:15 }}/>
                  </td>
                  <td style={{ padding:'13px 16px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      {lang.flag ? <img src={lang.flag} alt="" style={{ width:28, height:20, objectFit:'cover', borderRadius:3, border:'1px solid #e5e7eb' }}/> : <div style={{ width:28, height:20, background:'#e5e7eb', borderRadius:3, display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, color:'#9ca3af' }}>IMG</div>}
                      <span style={{ fontSize:13, color:'#374151', fontWeight:500 }}>{lang.name}</span>
                    </div>
                  </td>
                  <td style={{ padding:'13px 16px', fontSize:13, color:'#374151' }}>{lang.key}</td>
                  <td style={{ padding:'13px 16px' }}><Toggle checked={lang.enabled} onChange={v=>onToggle(lang.id,v)}/></td>
                  <td style={{ padding:'13px 16px' }}>
                    <div style={{ display:'flex', gap:7, justifyContent:'flex-end' }}>
                      {!lang.isDefault && (
                        <>
                          <button onClick={()=>onEdit(lang)} style={{ background:'#3b82f6', color:'#fff', border:'none', borderRadius:7, padding:'7px 11px', cursor:'pointer', display:'flex' }} onMouseEnter={e=>e.currentTarget.style.background='#2563eb'} onMouseLeave={e=>e.currentTarget.style.background='#3b82f6'}><EditIcon/></button>
                          <button onClick={()=>onDelete(lang)} style={{ background:'#3b82f6', color:'#fff', border:'none', borderRadius:7, padding:'7px 11px', cursor:'pointer', display:'flex' }} onMouseEnter={e=>e.currentTarget.style.background='#ef4444'} onMouseLeave={e=>e.currentTarget.style.background='#3b82f6'}><TrashIcon/></button>
                        </>
                      )}
                      <button style={{ background:'#3b82f6', color:'#fff', border:'none', borderRadius:7, padding:'7px 11px', cursor:'pointer', display:'flex' }} onMouseEnter={e=>e.currentTarget.style.background='#2563eb'} onMouseLeave={e=>e.currentTarget.style.background='#3b82f6'}><DownloadIcon/></button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        <div style={{ padding:'11px 16px', borderTop:'1px solid #f3f4f6', display:'flex', justifyContent:'flex-end', gap:7, alignItems:'center' }}>
          <span style={{ fontSize:13, color:'#9ca3af' }}>1 / 1 &nbsp; 10 / page</span>
        </div>
      </div>
    </div>
  );
}

// ─── Import Modal ─────────────────────────────────────────────────────────────
function ImportModal({ onClose, onImport }) {
  const [file, setFile] = useState(null);
  const inputRef = useRef();
  return (
    <Modal title="Import Translations" onClose={onClose} width={460}
      footer={<>
        <button style={btnSecondary} onClick={onClose}>Cancel</button>
        <button style={btnPrimary} onClick={()=>{ if(file) onImport(); }}><ImportIcon/> Import</button>
      </>}
    >
      <div style={{ background:'#eff6ff', borderRadius:8, padding:'10px 14px', marginBottom:18, display:'flex', alignItems:'center', gap:8 }}>
        <DownloadIcon/>
        <a href="#" style={{ fontSize:13, color:'#3b82f6', fontWeight:600, textDecoration:'none' }} onClick={e=>{e.preventDefault();alert('Sample CSV downloaded!');}}>Click here to download sample csv file</a>
      </div>
      <label style={{ cursor:'pointer', display:'block' }}>
        <input ref={inputRef} type="file" accept=".csv" style={{ display:'none' }} onChange={e=>{ if(e.target.files[0]) setFile(e.target.files[0]); }}/>
        <div style={{ border:`2px dashed ${file?'#3b82f6':'#d1d5db'}`, borderRadius:10, padding:'28px 20px', textAlign:'center', background: file?'#eff6ff':'#f9fafb', transition:'all .2s' }}>
          {file
            ? <><div style={{ fontSize:14, fontWeight:600, color:'#3b82f6' }}>📄 {file.name}</div><div style={{ fontSize:12, color:'#6b7280', marginTop:4 }}>Click to change file</div></>
            : <><div style={{ fontSize:14, color:'#6b7280' }}>Drop CSV file here or <span style={{ color:'#3b82f6', fontWeight:600 }}>browse</span></div><div style={{ fontSize:12, color:'#9ca3af', marginTop:4 }}>Only .csv files accepted</div></>
          }
        </div>
      </label>
    </Modal>
  );
}

// ─── Main Translations Export ─────────────────────────────────────────────────
export default function Translations() {
  const [languages, setLanguages] = useState([
    { id:1, name:'cfvgb', key:'vc', enabled:true, flag:null, isDefault:false },
    { id:2, name:'pratu', key:'ADSFGHJ', enabled:true, flag:null, isDefault:false },
    { id:3, name:'English', key:'en', enabled:true, flag:'https://flagcdn.com/w40/gb.png', isDefault:true },
  ]);
  const [rows] = useState(TRANSLATION_BASE_ROWS);
  const [translations, setTranslations] = useState(() => {
    const t = {};
    TRANSLATION_BASE_ROWS.forEach(r => { t[r.key] = { pratu: r.en, vc: r.en }; });
    return t;
  });
  const [view, setView] = useState('main');
  const [selectedGroup, setSelectedGroup] = useState('common');
  const [groupOpen, setGroupOpen] = useState(false);

  // Modal states — फक्त open/close + initial data
  const [showAddLang, setShowAddLang]       = useState(false);
  const [showEditLang, setShowEditLang]     = useState(null); // lang object
  const [showDeleteLang, setShowDeleteLang] = useState(null);
  const [showImport, setShowImport]         = useState(false);

  const [toast, setToast] = useState({ show:false, message:'' });
  const showToast = (message) => { setToast({ show:true, message }); setTimeout(()=>setToast(t=>({...t,show:false})), 3000); };

  const langKeys = languages.filter(l=>!l.isDefault).map(l=>l.key);
  const filteredRows = rows.filter(r => r.group === selectedGroup);

  // ✅ onSubmit ला LangModal च्या local state मधून final data येतो
  const handleAddLang = useCallback((item) => {
    setLanguages(prev=>[...prev, { id:Date.now(), ...item, enabled:true, isDefault:false }]);
    setShowAddLang(false);
    showToast('Language added successfully!');
  }, []);

  const handleEditLang = useCallback((item) => {
    setLanguages(prev=>prev.map(l=>l.id===showEditLang.id ? { ...l, ...item } : l));
    setShowEditLang(null);
    showToast('Language updated successfully!');
  }, [showEditLang]);

  const handleDeleteLang = useCallback(() => {
    setLanguages(prev=>prev.filter(l=>l.id!==showDeleteLang.id));
    setShowDeleteLang(null);
    showToast('Language deleted!');
  }, [showDeleteLang]);

  const handleToggle = (id, val) => setLanguages(prev=>prev.map(l=>l.id===id?{...l,enabled:val}:l));
  const handleFetch = () => showToast('Translations Fetch Successfully');
  const handleImport = () => { setShowImport(false); showToast('Translations imported successfully!'); };

  // ✅ Translation input commit — only on blur, no per-keystroke parent update
  const handleTranslationCommit = useCallback((rowKey, langKey, val) => {
    setTranslations(prev => ({ ...prev, [rowKey]: { ...(prev[rowKey]||{}), [langKey]: val } }));
  }, []);

  // Languages sub-view
  if (view === 'languages') {
    return (
      <>
        <Toast show={toast.show} message={toast.message}/>
        <LanguagesView
          languages={languages}
          onBack={()=>setView('main')}
          onAdd={()=>setShowAddLang(true)}
          onEdit={l=>setShowEditLang({...l})}
          onDelete={l=>setShowDeleteLang(l)}
          onToggle={handleToggle}
        />
        {showAddLang && (
          <LangModal
            initialItem={{ name:'', key:'', flag:null }}
            isEdit={false}
            onClose={()=>setShowAddLang(false)}
            onSubmit={handleAddLang}
          />
        )}
        {showEditLang && (
          <LangModal
            initialItem={showEditLang}
            isEdit={true}
            onClose={()=>setShowEditLang(null)}
            onSubmit={handleEditLang}
          />
        )}
        {showDeleteLang && (
          <Modal title="Confirm Delete" onClose={()=>setShowDeleteLang(null)}
            footer={<>
              <button style={btnSecondary} onClick={()=>setShowDeleteLang(null)}>Cancel</button>
              <button style={{...btnPrimary,background:'#ef4444'}} onClick={handleDeleteLang}><TrashIcon/> Delete</button>
            </>}>
            <p style={{ margin:0, color:'#374151', fontSize:14 }}>Are you sure you want to delete <strong>"{showDeleteLang.name}"</strong>?</p>
          </Modal>
        )}
      </>
    );
  }

  // Main translations view
  return (
    <>
      <Toast show={toast.show} message={toast.message}/>
      <style>{`
        @media(min-width:640px){.tr-mobile{display:none!important}}
        @media(max-width:639px){.tr-desktop{display:none!important}}
        @media(min-width:640px){.tr-toolbar{flex-direction:row!important;align-items:center!important}.tr-toolbar-right{margin-left:auto!important}}
        @media(max-width:359px){.tr-toolbar-btn{font-size:11px!important;padding:8px 8px!important;gap:4px!important}.tr-card-field input{font-size:12px!important;padding:8px 10px!important}}
      `}</style>

      {showAddLang && (
        <LangModal
          initialItem={{ name:'', key:'', flag:null }}
          isEdit={false}
          onClose={()=>setShowAddLang(false)}
          onSubmit={handleAddLang}
        />
      )}
      {showImport && <ImportModal onClose={()=>setShowImport(false)} onImport={handleImport}/>}

      <div style={{ padding:'16px 10px 0', marginBottom:8 }}>
        <h2 style={{ margin:0, fontSize:20, fontWeight:700, color:'#1f2937' }}>Translations</h2>
        <p style={{ margin:'3px 0 0', fontSize:12, color:'#9ca3af' }}>Dashboard - Settings - <span style={{ color:'#6b7280' }}>Translations</span></p>
      </div>

      <div style={{ margin:'12px 10px 16px', background:'#fff', borderRadius:14, boxShadow:'0 1px 6px rgba(0,0,0,.06)', border:'1.5px solid #f1f5f9', overflow:'hidden' }}>
        {/* Toolbar */}
        <div className="tr-toolbar" style={{ padding:'12px 14px', display:'flex', flexDirection:'column', gap:10, borderBottom:'1px solid #f3f4f6', flexWrap:'wrap' }}>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
            <button className="tr-toolbar-btn" style={{ ...btnPrimary, flex:'1 1 auto', justifyContent:'center', minWidth:0 }} onClick={()=>setShowAddLang(true)}><PlusIcon/> Add Language</button>
            <button className="tr-toolbar-btn" style={{ ...btnSecondary, flex:'1 1 auto', justifyContent:'center', minWidth:0 }} onClick={()=>setShowImport(true)}><ImportIcon/> Import</button>
            <button className="tr-toolbar-btn" style={{ ...btnSecondary, flex:'1 1 auto', justifyContent:'center', minWidth:0 }} onClick={()=>setView('languages')}><EyeIcon/> View Languages</button>
          </div>
          <div className="tr-toolbar-right" style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
            <div style={{ position:'relative', flex:'1 1 auto' }}>
              <button className="tr-toolbar-btn" style={{ ...btnSecondary, width:'100%', justifyContent:'space-between' }} onClick={()=>setGroupOpen(o=>!o)}>
                {selectedGroup} <ChevronDownIcon/>
              </button>
              {groupOpen && (
                <div style={{ position:'absolute', top:'110%', left:0, right:0, zIndex:200, background:'#fff', border:'1px solid #e5e7eb', borderRadius:10, boxShadow:'0 8px 24px rgba(0,0,0,.12)', overflow:'hidden' }}>
                  {TRANSLATION_GROUPS.map(g=>(
                    <button key={g} onClick={()=>{ setSelectedGroup(g); setGroupOpen(false); }}
                      style={{ display:'block', width:'100%', padding:'9px 16px', textAlign:'left', fontSize:13, border:'none', cursor:'pointer', fontFamily:'inherit', background: g===selectedGroup?'#eff6ff':'#fff', color: g===selectedGroup?'#3b82f6':'#374151', fontWeight: g===selectedGroup?600:400 }}>
                      {g}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button className="tr-toolbar-btn" style={{ ...btnSecondary, flex:'1 1 auto', justifyContent:'center' }} onClick={handleFetch}><RefreshIcon/> Fetch Translations</button>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="tr-mobile" style={{ padding:12, display:'flex', flexDirection:'column', gap:12 }}>
          {filteredRows.length === 0
            ? <div style={{ padding:32, textAlign:'center', color:'#9ca3af', fontSize:14 }}>No translations found</div>
            : filteredRows.map((r) => (
              <div key={r.key} style={{ background:'#fff', border:'1.5px solid #e5e7eb', borderRadius:12, overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
                <div style={{ background:'#f8fafc', padding:'10px 14px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid #e5e7eb' }}>
                  <span style={{ background:'#eff6ff', color:'#3b82f6', fontSize:11, fontWeight:700, padding:'3px 8px', borderRadius:20 }}>{r.group}</span>
                  <span style={{ fontSize:12, color:'#9ca3af', fontFamily:'monospace' }}>{r.key}</span>
                </div>
                <div style={{ padding:'14px' }}>
                  <div style={{ marginBottom:12 }}>
                    <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:6 }}>English</label>
                    <div style={{ border:'1.5px solid #e5e7eb', borderRadius:8, padding:'9px 12px', fontSize:13, background:'#f9fafb', color:'#374151', fontWeight:500 }}>{r.en}</div>
                  </div>
                  {langKeys.map((k, ki) => (
                    <div key={k} className="tr-card-field" style={{ marginBottom: ki === langKeys.length - 1 ? 0 : 12 }}>
                      <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:6 }}>{k}</label>
                      {/* ✅ TranslationInput — memo + local state + onBlur commit */}
                      <TranslationInput
                        key={`${r.key}-${k}`}
                        initialValue={translations[r.key]?.[k] ?? r.en}
                        onCommit={(val) => handleTranslationCommit(r.key, k, val)}
                        style={{ width:'100%', border:'1.5px solid #e5e7eb', borderRadius:8, padding:'9px 12px', fontSize:13, outline:'none', boxSizing:'border-box', background:'#fff', color:'#1f2937' }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))
          }
        </div>

        {/* Desktop Table */}
        <div className="tr-desktop" style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', minWidth:600 }}>
            <thead>
              <tr style={{ background:'#f9fafb' }}>
                <th style={{ padding:'11px 16px', textAlign:'left', fontSize:13, fontWeight:600, color:'#6b7280', whiteSpace:'nowrap' }}>Group</th>
                <th style={{ padding:'11px 16px', textAlign:'left', fontSize:13, fontWeight:600, color:'#6b7280', whiteSpace:'nowrap' }}>English</th>
                {langKeys.map(k=>(
                  <th key={k} style={{ padding:'11px 16px', textAlign:'left', fontSize:13, fontWeight:600, color:'#6b7280', whiteSpace:'nowrap' }}>{k}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((r,i)=>(
                <tr key={r.key} style={{ borderTop:'1px solid #f3f4f6', background: i%2===0?'#fff':'#fafafa' }}>
                  <td style={{ padding:'12px 16px', fontSize:13, color:'#6b7280' }}>{r.group}</td>
                  <td style={{ padding:'12px 16px', fontSize:13, color:'#374151' }}>{r.en}</td>
                  {langKeys.map(k=>(
                    <td key={k} style={{ padding:'8px 16px' }}>
                      {/* ✅ TranslationInput — memo + local state + onBlur commit */}
                      <TranslationInput
                        key={`${r.key}-${k}`}
                        initialValue={translations[r.key]?.[k] ?? r.en}
                        onCommit={(val) => handleTranslationCommit(r.key, k, val)}
                        style={{ width:'100%', border:'1.5px solid #e5e7eb', borderRadius:6, padding:'7px 10px', fontSize:12, outline:'none', background:'#fff', boxSizing:'border-box', minWidth:100 }}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ padding:'11px 16px', borderTop:'1px solid #f3f4f6', display:'flex', justifyContent:'flex-end', gap:6, alignItems:'center' }}>
          <span style={{ fontSize:13, color:'#9ca3af' }}>1 / 1 &nbsp; 10 / page</span>
        </div>
      </div>

      {groupOpen && <div style={{ position:'fixed', inset:0, zIndex:100 }} onClick={()=>setGroupOpen(false)}/>}
    </>
  );
}