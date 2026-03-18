// const BASE_URL = "/api";
// const getToken = () => localStorage.getItem("token");
// const headers = () => ({
//   "Content-Type": "application/json",
//   Authorization: `Bearer ${getToken()}`,
// });

// const api = {
//   login: (email, password) =>
//     fetch(`${BASE_URL}/auth/login`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({email,password}) }).then(r=>r.json()),

//   getMe: () => fetch(`${BASE_URL}/auth/me`, {headers:headers()}).then(r=>r.json()),

//   // Analytics
//   getOverview:      () => fetch(`${BASE_URL}/analytics/overview`,          {headers:headers()}).then(r=>r.json()),
//   getLeadsPerDay:   () => fetch(`${BASE_URL}/analytics/leads-per-day`,     {headers:headers()}).then(r=>r.json()),
//   getLeadsByStatus: () => fetch(`${BASE_URL}/analytics/leads-by-status`,   {headers:headers()}).then(r=>r.json()),
//   getCallStats:     () => fetch(`${BASE_URL}/calls/stats`,                 {headers:headers()}).then(r=>r.json()),

//   // Users
//   getUsers: () => fetch(`${BASE_URL}/users`,{headers:headers()}).then(r=>r.json()),
//   createUser: (d) => fetch(`${BASE_URL}/users`,{method:"POST",headers:headers(),body:JSON.stringify(d)}).then(r=>r.json()),
//   updateUser: (id,d) => fetch(`${BASE_URL}/users/${id}`,{method:"PUT",headers:headers(),body:JSON.stringify(d)}).then(r=>r.json()),
//   deleteUser: (id) => fetch(`${BASE_URL}/users/${id}`,{method:"DELETE",headers:headers()}).then(r=>r.json()),
//   changePassword: (id,p) => fetch(`${BASE_URL}/users/${id}/password`,{method:"PUT",headers:headers(),body:JSON.stringify({newPassword:p})}).then(r=>r.json()),

//   // Leads
//   getLeads: (p={}) => fetch(`${BASE_URL}/leads?${new URLSearchParams(p)}`,{headers:headers()}).then(r=>r.json()),
//   getLeadById: (id) => fetch(`${BASE_URL}/leads/${id}`,{headers:headers()}).then(r=>r.json()),
//   createLead: (d) => fetch(`${BASE_URL}/leads`,{method:"POST",headers:headers(),body:JSON.stringify(d)}).then(r=>r.json()),
//   updateLead: (id,d) => fetch(`${BASE_URL}/leads/${id}`,{method:"PUT",headers:headers(),body:JSON.stringify(d)}).then(r=>r.json()),
//   deleteLead: (id) => fetch(`${BASE_URL}/leads/${id}`,{method:"DELETE",headers:headers()}).then(r=>r.json()),

//   // Notes
//   getNotes: (lid) => fetch(`${BASE_URL}/leads/${lid}/notes`,{headers:headers()}).then(r=>r.json()),
//   addNote: (lid,note) => fetch(`${BASE_URL}/leads/${lid}/notes`,{method:"POST",headers:headers(),body:JSON.stringify({note})}).then(r=>r.json()),
//   deleteNote: (lid,nid) => fetch(`${BASE_URL}/leads/${lid}/notes/${nid}`,{method:"DELETE",headers:headers()}).then(r=>r.json()),

//   // Follow Ups
//   getTodayFollowUps: () => fetch(`${BASE_URL}/leads/followups/today`,{headers:headers()}).then(r=>r.json()),
//   getFollowUps: (lid) => fetch(`${BASE_URL}/leads/${lid}/followups`,{headers:headers()}).then(r=>r.json()),
//   addFollowUp: (lid,d) => fetch(`${BASE_URL}/leads/${lid}/followups`,{method:"POST",headers:headers(),body:JSON.stringify(d)}).then(r=>r.json()),
//   markFollowUpDone: (id) => fetch(`${BASE_URL}/leads/followups/${id}/done`,{method:"PUT",headers:headers()}).then(r=>r.json()),

//   // Products
//   getProducts: () => fetch(`${BASE_URL}/products`,{headers:headers()}).then(r=>r.json()),
//   createProduct: (d) => fetch(`${BASE_URL}/products`,{method:"POST",headers:headers(),body:JSON.stringify(d)}).then(r=>r.json()),
//   updateProduct: (id,d) => fetch(`${BASE_URL}/products/${id}`,{method:"PUT",headers:headers(),body:JSON.stringify(d)}).then(r=>r.json()),
//   deleteProduct: (id) => fetch(`${BASE_URL}/products/${id}`,{method:"DELETE",headers:headers()}).then(r=>r.json()),

//   // Expense Categories
//   getExpenseCategories: () => fetch(`${BASE_URL}/expenses/categories`,{headers:headers()}).then(r=>r.json()),
//   createExpenseCategory: (d) => fetch(`${BASE_URL}/expenses/categories`,{method:"POST",headers:headers(),body:JSON.stringify(d)}).then(r=>r.json()),
//   updateExpenseCategory: (id,d) => fetch(`${BASE_URL}/expenses/categories/${id}`,{method:"PUT",headers:headers(),body:JSON.stringify(d)}).then(r=>r.json()),
//   deleteExpenseCategory: (id) => fetch(`${BASE_URL}/expenses/categories/${id}`,{method:"DELETE",headers:headers()}).then(r=>r.json()),

//   // Expenses
//   getExpenses: (p={}) => fetch(`${BASE_URL}/expenses?${new URLSearchParams(p)}`,{headers:headers()}).then(r=>r.json()),
//   createExpense: (d) => fetch(`${BASE_URL}/expenses`,{method:"POST",headers:headers(),body:JSON.stringify(d)}).then(r=>r.json()),
//   updateExpense: (id,d) => fetch(`${BASE_URL}/expenses/${id}`,{method:"PUT",headers:headers(),body:JSON.stringify(d)}).then(r=>r.json()),
//   deleteExpense: (id) => fetch(`${BASE_URL}/expenses/${id}`,{method:"DELETE",headers:headers()}).then(r=>r.json()),

//   // Salesman
//   getSalesmans: () => fetch(`${BASE_URL}/salesman`,{headers:headers()}).then(r=>r.json()),
//   createSalesman: (d) => fetch(`${BASE_URL}/salesman`,{method:"POST",headers:headers(),body:JSON.stringify(d)}).then(r=>r.json()),
//   updateSalesman: (id,d) => fetch(`${BASE_URL}/salesman/${id}`,{method:"PUT",headers:headers(),body:JSON.stringify(d)}).then(r=>r.json()),
//   deleteSalesman: (id) => fetch(`${BASE_URL}/salesman/${id}`,{method:"DELETE",headers:headers()}).then(r=>r.json()),
//   getAllBookings: () => fetch(`${BASE_URL}/salesman/bookings/all`,{headers:headers()}).then(r=>r.json()),
//   getBookings: (id) => fetch(`${BASE_URL}/salesman/${id}/bookings`,{headers:headers()}).then(r=>r.json()),
//   createBooking: (sid,d) => fetch(`${BASE_URL}/salesman/${sid}/bookings`,{method:"POST",headers:headers(),body:JSON.stringify(d)}).then(r=>r.json()),
//   updateBookingStatus: (id,status) => fetch(`${BASE_URL}/salesman/bookings/${id}/status`,{method:"PUT",headers:headers(),body:JSON.stringify({status})}).then(r=>r.json()),
//   deleteBooking: (id) => fetch(`${BASE_URL}/salesman/bookings/${id}`,{method:"DELETE",headers:headers()}).then(r=>r.json()),

//   // Call Logs
//   getCallLogs: (p={}) => fetch(`${BASE_URL}/calls?${new URLSearchParams(p)}`,{headers:headers()}).then(r=>r.json()),
//   createCallLog: (d) => fetch(`${BASE_URL}/calls`,{method:"POST",headers:headers(),body:JSON.stringify(d)}).then(r=>r.json()),

//   // Email & WhatsApp
//   sendEmail: (d) => fetch(`${BASE_URL}/email/send`,{method:"POST",headers:headers(),body:JSON.stringify(d)}).then(r=>r.json()),
//   sendWhatsApp: (d) => fetch(`${BASE_URL}/whatsapp/send`,{method:"POST",headers:headers(),body:JSON.stringify(d)}).then(r=>r.json()),

//   // WhatsApp Campaigns
//   getWhatsAppCampaigns: () => fetch(`${BASE_URL}/whatsapp/campaigns`,{headers:headers()}).then(r=>r.json()),
//   createWhatsAppCampaign: (d) => fetch(`${BASE_URL}/whatsapp/campaigns`,{method:"POST",headers:headers(),body:JSON.stringify(d)}).then(r=>r.json()),
//   startWhatsAppCampaign: (id) => fetch(`${BASE_URL}/whatsapp/campaigns/${id}/start`,{method:"POST",headers:headers()}).then(r=>r.json()),

//   // Email Campaigns
//   getEmailCampaigns: () => fetch(`${BASE_URL}/email/campaigns`,{headers:headers()}).then(r=>r.json()),
//   createEmailCampaign: (d) => fetch(`${BASE_URL}/email/campaigns`,{method:"POST",headers:headers(),body:JSON.stringify(d)}).then(r=>r.json()),
//   sendEmailCampaign: (id) => fetch(`${BASE_URL}/email/campaigns/${id}/send`,{method:"POST",headers:headers()}).then(r=>r.json()),

//   // AI
//   getAIRecommendation: (id) => fetch(`${BASE_URL}/ai/recommend/${id}`,{method:"POST",headers:headers()}).then(r=>r.json()),
//   suggestWhatsApp: (id) => fetch(`${BASE_URL}/ai/whatsapp-message/${id}`,{method:"POST",headers:headers()}).then(r=>r.json()),
//   suggestEmail: (id) => fetch(`${BASE_URL}/ai/email/${id}`,{method:"POST",headers:headers()}).then(r=>r.json()),
// };

// export default api;




const BASE_URL = "/api";

const getToken = () => localStorage.getItem("token");

const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

// Safe fetch - empty/invalid response handle karo
const safeFetch = async (url, options = {}) => {
  try {
    const res = await fetch(url, options);
    const text = await res.text();
    if (!text || text.trim() === "") {
      console.error("Empty response from:", url, "Status:", res.status);
      return {};
    }
    return JSON.parse(text);
  } catch (err) {
    console.error("API Error:", url, err.message);
    return {};
  }
};

const api = {
  login: (email, password) =>
    safeFetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }),

  getMe: () => safeFetch(`${BASE_URL}/auth/me`, { headers: headers() }),

  // Analytics
  getOverview: () => safeFetch(`${BASE_URL}/analytics/overview`, { headers: headers() }),
  getLeadsPerDay: () => safeFetch(`${BASE_URL}/analytics/leads-per-day`, { headers: headers() }),
  getLeadsByStatus: () => safeFetch(`${BASE_URL}/analytics/leads-by-status`, { headers: headers() }),
  getCallStats: () => safeFetch(`${BASE_URL}/calls/stats`, { headers: headers() }),

  // Users
  getUsers: () => safeFetch(`${BASE_URL}/users`, { headers: headers() }),
  createUser: (d) => safeFetch(`${BASE_URL}/users`, { method: "POST", headers: headers(), body: JSON.stringify(d) }),
  updateUser: (id, d) => safeFetch(`${BASE_URL}/users/${id}`, { method: "PUT", headers: headers(), body: JSON.stringify(d) }),
  deleteUser: (id) => safeFetch(`${BASE_URL}/users/${id}`, { method: "DELETE", headers: headers() }),
  changePassword: (id, p) => safeFetch(`${BASE_URL}/users/${id}/password`, { method: "PUT", headers: headers(), body: JSON.stringify({ newPassword: p }) }),

  // Leads
  getLeads: (p = {}) => safeFetch(`${BASE_URL}/leads?${new URLSearchParams(p)}`, { headers: headers() }),
  getLeadById: (id) => safeFetch(`${BASE_URL}/leads/${id}`, { headers: headers() }),
  createLead: (d) => safeFetch(`${BASE_URL}/leads`, { method: "POST", headers: headers(), body: JSON.stringify(d) }),
  updateLead: (id, d) => safeFetch(`${BASE_URL}/leads/${id}`, { method: "PUT", headers: headers(), body: JSON.stringify(d) }),
  deleteLead: (id) => safeFetch(`${BASE_URL}/leads/${id}`, { method: "DELETE", headers: headers() }),

  // Notes
  getNotes: (lid) => safeFetch(`${BASE_URL}/leads/${lid}/notes`, { headers: headers() }),
  addNote: (lid, note) => safeFetch(`${BASE_URL}/leads/${lid}/notes`, { method: "POST", headers: headers(), body: JSON.stringify({ note }) }),
  deleteNote: (lid, nid) => safeFetch(`${BASE_URL}/leads/${lid}/notes/${nid}`, { method: "DELETE", headers: headers() }),

  // Follow Ups
  getTodayFollowUps: () => safeFetch(`${BASE_URL}/leads/followups/today`, { headers: headers() }),
  getFollowUps: (lid) => safeFetch(`${BASE_URL}/leads/${lid}/followups`, { headers: headers() }),
  addFollowUp: (lid, d) => safeFetch(`${BASE_URL}/leads/${lid}/followups`, { method: "POST", headers: headers(), body: JSON.stringify(d) }),
  markFollowUpDone: (id) => safeFetch(`${BASE_URL}/leads/followups/${id}/done`, { method: "PUT", headers: headers() }),

  // Products
  getProducts: () => safeFetch(`${BASE_URL}/products`, { headers: headers() }),
  createProduct: (d) => safeFetch(`${BASE_URL}/products`, { method: "POST", headers: headers(), body: JSON.stringify(d) }),
  updateProduct: (id, d) => safeFetch(`${BASE_URL}/products/${id}`, { method: "PUT", headers: headers(), body: JSON.stringify(d) }),
  deleteProduct: (id) => safeFetch(`${BASE_URL}/products/${id}`, { method: "DELETE", headers: headers() }),

  // Expense Categories
  getExpenseCategories: () => safeFetch(`${BASE_URL}/expenses/categories`, { headers: headers() }),
  createExpenseCategory: (d) => safeFetch(`${BASE_URL}/expenses/categories`, { method: "POST", headers: headers(), body: JSON.stringify(d) }),
  updateExpenseCategory: (id, d) => safeFetch(`${BASE_URL}/expenses/categories/${id}`, { method: "PUT", headers: headers(), body: JSON.stringify(d) }),
  deleteExpenseCategory: (id) => safeFetch(`${BASE_URL}/expenses/categories/${id}`, { method: "DELETE", headers: headers() }),

  // Expenses
  getExpenses: (p = {}) => safeFetch(`${BASE_URL}/expenses?${new URLSearchParams(p)}`, { headers: headers() }),
  createExpense: (d) => safeFetch(`${BASE_URL}/expenses`, { method: "POST", headers: headers(), body: JSON.stringify(d) }),
  updateExpense: (id, d) => safeFetch(`${BASE_URL}/expenses/${id}`, { method: "PUT", headers: headers(), body: JSON.stringify(d) }),
  deleteExpense: (id) => safeFetch(`${BASE_URL}/expenses/${id}`, { method: "DELETE", headers: headers() }),

  // Salesman
  getSalesmans: () => safeFetch(`${BASE_URL}/salesman`, { headers: headers() }),
  createSalesman: (d) => safeFetch(`${BASE_URL}/salesman`, { method: "POST", headers: headers(), body: JSON.stringify(d) }),
  updateSalesman: (id, d) => safeFetch(`${BASE_URL}/salesman/${id}`, { method: "PUT", headers: headers(), body: JSON.stringify(d) }),
  deleteSalesman: (id) => safeFetch(`${BASE_URL}/salesman/${id}`, { method: "DELETE", headers: headers() }),
  getAllBookings: () => safeFetch(`${BASE_URL}/salesman/bookings/all`, { headers: headers() }),
  getBookings: (id) => safeFetch(`${BASE_URL}/salesman/${id}/bookings`, { headers: headers() }),
  createBooking: (sid, d) => safeFetch(`${BASE_URL}/salesman/${sid}/bookings`, { method: "POST", headers: headers(), body: JSON.stringify(d) }),
  updateBookingStatus: (id, status) => safeFetch(`${BASE_URL}/salesman/bookings/${id}/status`, { method: "PUT", headers: headers(), body: JSON.stringify({ status }) }),
  deleteBooking: (id) => safeFetch(`${BASE_URL}/salesman/bookings/${id}`, { method: "DELETE", headers: headers() }),

  // Call Logs
  getCallLogs: (p = {}) => safeFetch(`${BASE_URL}/calls?${new URLSearchParams(p)}`, { headers: headers() }),
  createCallLog: (d) => safeFetch(`${BASE_URL}/calls`, { method: "POST", headers: headers(), body: JSON.stringify(d) }),

  // Email
  sendEmail: (d) => safeFetch(`${BASE_URL}/email/send`, { method: "POST", headers: headers(), body: JSON.stringify(d) }),
  getEmailCampaigns: () => safeFetch(`${BASE_URL}/email/campaigns`, { headers: headers() }),
  createEmailCampaign: (d) => safeFetch(`${BASE_URL}/email/campaigns`, { method: "POST", headers: headers(), body: JSON.stringify(d) }),
  sendEmailCampaign: (id) => safeFetch(`${BASE_URL}/email/campaigns/${id}/send`, { method: "POST", headers: headers() }),

  // WhatsApp
  sendWhatsApp: (d) => safeFetch(`${BASE_URL}/whatsapp/send`, { method: "POST", headers: headers(), body: JSON.stringify(d) }),
  getWhatsAppCampaigns: () => safeFetch(`${BASE_URL}/whatsapp/campaigns`, { headers: headers() }),
  createWhatsAppCampaign: (d) => safeFetch(`${BASE_URL}/whatsapp/campaigns`, { method: "POST", headers: headers(), body: JSON.stringify(d) }),
  startWhatsAppCampaign: (id) => safeFetch(`${BASE_URL}/whatsapp/campaigns/${id}/start`, { method: "POST", headers: headers() }),

  // AI
  getAIRecommendation: (id) => safeFetch(`${BASE_URL}/ai/recommend/${id}`, { method: "POST", headers: headers() }),
  suggestWhatsApp: (id) => safeFetch(`${BASE_URL}/ai/whatsapp-message/${id}`, { method: "POST", headers: headers() }),
  suggestEmail: (id) => safeFetch(`${BASE_URL}/ai/email/${id}`, { method: "POST", headers: headers() }),
};

export default api;