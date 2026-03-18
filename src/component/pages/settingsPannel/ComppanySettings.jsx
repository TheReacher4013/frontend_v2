import React, { useState, useRef } from 'react';

const TagIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
  </svg>
);

const CameraIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4z"/>
    <path d="M9 3L7.17 5H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2h-3.17L15 3H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
  </svg>
);

const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
  </svg>
);

const LogoUploadField = ({ label, id }) => {
  const [image, setImage] = useState(null);
  const inputRef = useRef();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', fontFamily: 'Georgia, serif' }}>{label}</label>
      <label htmlFor={id} style={{ cursor: 'pointer', display: 'block' }}>
        <input
          ref={inputRef}
          type="file"
          id={id}
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleImageChange}
        />
        {image ? (
          <img src={image} alt={label} style={{ width: '100%', height: 110, borderRadius: 10, objectFit: 'contain', border: '1.5px solid #e5e7eb', background: '#f9fafb' }} />
        ) : (
          <div style={{
            width: '100%', height: 110, border: '2px dashed #d1d5db', borderRadius: 10,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            color: '#9ca3af', background: '#fff', transition: 'all 0.2s', cursor: 'pointer'
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.color = '#3b82f6'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.color = '#9ca3af'; }}
          >
            <CameraIcon />
            <span style={{ fontSize: 12, fontWeight: 600, marginTop: 6 }}>Upload</span>
          </div>
        )}
      </label>
    </div>
  );
};

const InputField = ({ label, required, ...props }) => (
  <div>
    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 5, fontFamily: 'Georgia, serif' }}>
      {required && <span style={{ color: '#ef4444' }}>* </span>}{label}
    </label>
    <input {...props} style={{
      width: '100%', border: '1.5px solid #e5e7eb', borderRadius: 8, padding: '10px 14px',
      fontSize: 13, outline: 'none', background: '#fff', boxSizing: 'border-box', fontFamily: 'inherit',
      transition: 'border-color 0.2s'
    }}
      onFocus={e => e.target.style.borderColor = '#3b82f6'}
      onBlur={e => e.target.style.borderColor = '#e5e7eb'}
    />
  </div>
);

const SelectField = ({ label, required, children, ...props }) => (
  <div>
    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 5, fontFamily: 'Georgia, serif' }}>
      {required && <span style={{ color: '#ef4444' }}>* </span>}{label}
    </label>
    <select {...props} style={{
      width: '100%', border: '1.5px solid #e5e7eb', borderRadius: 8, padding: '10px 14px',
      fontSize: 13, outline: 'none', background: '#fff', boxSizing: 'border-box', fontFamily: 'inherit',
      appearance: 'none', cursor: 'pointer'
    }}>
      {children}
    </select>
  </div>
);

const ToggleSwitch = ({ label }) => {
  const [on, setOn] = useState(false);
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', fontFamily: 'Georgia, serif' }}>{label}</label>
      <div onClick={() => setOn(!on)} style={{
        width: 44, height: 24, borderRadius: 12, background: on ? '#3b82f6' : '#d1d5db',
        cursor: 'pointer', position: 'relative', transition: 'background 0.2s'
      }}>
        <div style={{
          position: 'absolute', top: 2, left: on ? 22 : 2,
          width: 20, height: 20, borderRadius: '50%', background: '#fff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition: 'left 0.2s'
        }} />
      </div>
    </div>
  );
};

const SuccessToast = ({ show }) => (
  <div style={{
    position: 'fixed', top: 24, right: 24, zIndex: 9999,
    background: '#fff', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
    padding: '14px 22px', display: 'flex', alignItems: 'center', gap: 12,
    border: '1.5px solid #d1fae5',
    transform: show ? 'translateY(0)' : 'translateY(-80px)',
    opacity: show ? 1 : 0,
    transition: 'all 0.35s cubic-bezier(.4,2,.6,1)'
  }}>
    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
      <CheckIcon />
    </div>
    <div>
      <div style={{ fontSize: 14, fontWeight: 700, color: '#065f46', fontFamily: 'Georgia, serif' }}>Update Successful!</div>
      <div style={{ fontSize: 12, color: '#6b7280', marginTop: 1 }}>Menu settings have been updated.</div>
    </div>
  </div>
);

const AddMenuModal = ({ onClose, onUpdate }) => {
  const [placement, setPlacement] = useState('Top & Bottom');
  const [addStaffMember, setAddStaffMember] = useState(false);
  const [addLanguage, setAddLanguage] = useState(true);
  const [addRole, setAddRole] = useState(true);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(2px)',
      display: 'flex', alignItems: 'center', justifyContent: 'flex-end'
    }} onClick={onClose}>
      <div style={{
        width: 420, height: '100%', background: '#fff',
        boxShadow: '-8px 0 40px rgba(0,0,0,0.15)',
        display: 'flex', flexDirection: 'column',
        animation: 'slideIn 0.3s cubic-bezier(.4,0,.2,1)'
      }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '20px 24px', borderBottom: '1.5px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1f2937', fontFamily: 'Georgia, serif' }}>Add Menu Settings</h3>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 8,
            color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.15s'
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#f3f4f6'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            <XIcon />
          </button>
        </div>

        <div style={{ flex: 1, padding: '28px 24px', overflow: 'auto' }}>
          <div style={{ marginBottom: 28 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8, fontFamily: 'Georgia, serif' }}>
              <span style={{ color: '#ef4444' }}>* </span>Add Menu Placement
            </label>
            <select
              value={placement}
              onChange={e => setPlacement(e.target.value)}
              style={{
                width: '100%', border: '1.5px solid #3b82f6', borderRadius: 8, padding: '10px 14px',
                fontSize: 13, outline: 'none', background: '#fff', fontFamily: 'inherit',
                appearance: 'none', cursor: 'pointer', boxSizing: 'border-box'
              }}
            >
              <option>Top & Bottom</option>
              <option>Left Sidebar</option>
              <option>Right Sidebar</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 14, fontFamily: 'Georgia, serif' }}>
              Add Menu Settings
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Add Staff Member', state: addStaffMember, set: setAddStaffMember },
                { label: 'Add Language', state: addLanguage, set: setAddLanguage },
                { label: 'Add Role', state: addRole, set: setAddRole },
              ].map(({ label, state, set }) => (
                <label key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                  <div
                    onClick={() => set(!state)}
                    style={{
                      width: 18, height: 18, borderRadius: 4,
                      border: state ? '2px solid #3b82f6' : '2px solid #d1d5db',
                      background: state ? '#3b82f6' : '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0
                    }}
                  >
                    {state && <svg width="10" height="10" viewBox="0 0 10 10" fill="white"><path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>}
                  </div>
                  <span style={{ fontSize: 13, color: '#374151', fontFamily: 'Georgia, serif' }}>{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div style={{ padding: '16px 24px', borderTop: '1.5px solid #f3f4f6', display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{
            padding: '10px 22px', borderRadius: 8, border: '1.5px solid #e5e7eb',
            background: '#fff', color: '#374151', fontSize: 13, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s'
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
            onMouseLeave={e => e.currentTarget.style.background = '#fff'}
          >
            Cancel
          </button>
          <button onClick={onUpdate} style={{
            padding: '10px 22px', borderRadius: 8, border: 'none',
            background: '#3b82f6', color: '#fff', fontSize: 13, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 8,
            transition: 'background 0.15s', boxShadow: '0 2px 8px rgba(59,130,246,0.3)'
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#2563eb'}
            onMouseLeave={e => e.currentTarget.style.background = '#3b82f6'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>
            Update
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default function CompanySettings() {
  const [primaryColor, setPrimaryColor] = useState('#007BFF');
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleUpdate = () => {
    setShowModal(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  const grid2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 24px' };
  const grid4 = { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px 24px' };

  return (
    <div style={{ fontFamily: "'Segoe UI', Georgia, sans-serif", minHeight: '100vh', background: '#f8fafc', padding: 32 }}>
      <SuccessToast show={showToast} />

      {showModal && <AddMenuModal onClose={() => setShowModal(false)} onUpdate={handleUpdate} />}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#1f2937', fontFamily: 'Georgia, serif' }}>Company Settings</h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#9ca3af' }}>
            Dashboard - Settings - <span style={{ color: '#6b7280', fontWeight: 500 }}>Company Settings</span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: '#3b82f6', color: '#fff', border: 'none',
            padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600,
            cursor: 'pointer', transition: 'background 0.15s', boxShadow: '0 2px 8px rgba(59,130,246,0.25)'
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#2563eb'}
            onMouseLeave={e => e.currentTarget.style.background = '#3b82f6'}
          >
            <TagIcon /> Update
          </button>
          <button onClick={() => setShowModal(true)} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: '#fff', color: '#374151', border: '1.5px solid #e5e7eb',
            padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600,
            cursor: 'pointer', transition: 'all 0.15s'
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.borderColor = '#3b82f6'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#e5e7eb'; }}
          >
            <PlusIcon /> Add Menu Settings
          </button>
        </div>
      </div>

      <div style={{ marginTop: 28, background: '#fff', borderRadius: 16, boxShadow: '0 1px 6px rgba(0,0,0,0.06)', border: '1.5px solid #f1f5f9', padding: 36 }}>

        <div style={grid2}>
          <InputField label="Company Name" required defaultValue="Lead Pro" />
          <InputField label="Company Short Name" required defaultValue="LeadPro" />
          <InputField label="Company Email" required defaultValue="company@example.com" />
          <InputField label="Company Phone" defaultValue="+16785861991" />
        </div>

        <div style={{ marginTop: 20 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 5, fontFamily: 'Georgia, serif' }}>Company Address</label>
          <textarea style={{
            width: '100%', border: '1.5px solid #e5e7eb', borderRadius: 8, padding: '10px 14px',
            fontSize: 13, outline: 'none', background: '#fff', resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box'
          }} rows={4} defaultValue="7 street, city, state, 762782" />
        </div>

        <div style={{ ...grid2, marginTop: 24 }}>
          <SelectField label="Left Sidebar Theme">
            <option>Dark</option>
            <option>Light</option>
          </SelectField>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 5, fontFamily: 'Georgia, serif' }}>Primary Color</label>
            <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)}
              style={{ width: '100%', height: 44, border: '1.5px solid #e5e7eb', borderRadius: 8, padding: '4px 8px', cursor: 'pointer', background: '#fff', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        <div style={{ ...grid4, marginTop: 24 }}>
          <LogoUploadField label="Dark Logo" id="darkLogo" />
          <LogoUploadField label="Light Logo" id="lightLogo" />
          <LogoUploadField label="Small Dark Logo" id="smallDarkLogo" />
          <LogoUploadField label="Small Light Logo" id="smallLightLogo" />
        </div>

        <hr style={{ border: 'none', borderTop: '1.5px solid #f3f4f6', margin: '28px 0' }} />

        <div style={grid2}>
          <SelectField label="Currency" required>
            <option>Dollar ($)</option>
            <option>Indian Rupee (₹)</option>
          </SelectField>
          <SelectField label="Language" required>
            <option>English</option>
            <option>Hindi</option>
            <option>Marathi</option>
          </SelectField>
          <SelectField label="Layout" required>
            <option>LTR</option>
            <option>RTL</option>
          </SelectField>
          <SelectField label="Add Menu Placement" required>
            <option>Top & Bottom</option>
            <option>Left Sidebar</option>
          </SelectField>
        </div>

        <div style={{ ...grid2, marginTop: 24, alignItems: 'end' }}>
          <ToggleSwitch label="Auto Detect Timezone" />
          <SelectField label="Default Timezone" required>
            <option>Asia/Kolkata</option>
            <option>America/New_York</option>
          </SelectField>
          <ToggleSwitch label="App Debug" />
          <ToggleSwitch label="Update App Notification" />
        </div>

        <div style={{ ...grid2, marginTop: 24 }}>
          <SelectField label="Date Format" required>
            <option>{`(d-m-Y) => ${new Date().toLocaleDateString('en-GB')}`}</option>
          </SelectField>
          <SelectField label="Time Format" required>
            <option>{`(12 Hours) => ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`}</option>
          </SelectField>
        </div>

        <div style={{ marginTop: 24, maxWidth: 200 }}>
          <LogoUploadField label="Login Image" id="loginImage" />
        </div>

        <hr style={{ border: 'none', borderTop: '1.5px solid #f3f4f6', margin: '28px 0' }} />

        <button style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: '#3b82f6', color: '#fff', border: 'none',
          padding: '11px 28px', borderRadius: 8, fontSize: 13, fontWeight: 600,
          cursor: 'pointer', transition: 'background 0.15s', boxShadow: '0 2px 8px rgba(59,130,246,0.25)'
        }}
          onMouseEnter={e => e.currentTarget.style.background = '#2563eb'}
          onMouseLeave={e => e.currentTarget.style.background = '#3b82f6'}
        >
          Save
        </button>
      </div>
    </div>
  );
}