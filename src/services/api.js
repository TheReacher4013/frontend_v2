const BASE_URL = "/api";

const getToken = () => localStorage.getItem("token");

const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

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

  // Activity
  getActivity: (lid) => safeFetch(`${BASE_URL}/leads/${lid}/activity`, { headers: headers() }),

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

  // Email Templates
  getEmailTemplates: () => safeFetch(`${BASE_URL}/email/templates`, { headers: headers() }),
  createEmailTemplate: (d) => safeFetch(`${BASE_URL}/email/templates`, { method: "POST", headers: headers(), body: JSON.stringify(d) }),
  updateEmailTemplate: (id, d) => safeFetch(`${BASE_URL}/email/templates/${id}`, { method: "PUT", headers: headers(), body: JSON.stringify(d) }),
  deleteEmailTemplate: (id) => safeFetch(`${BASE_URL}/email/templates/${id}`, { method: "DELETE", headers: headers() }),

  // Forms
  getForms: () => safeFetch(`${BASE_URL}/forms`, { headers: headers() }),
  createForm: (d) => safeFetch(`${BASE_URL}/forms`, { method: "POST", headers: headers(), body: JSON.stringify(d) }),
  updateForm: (id, d) => safeFetch(`${BASE_URL}/forms/${id}`, { method: "PUT", headers: headers(), body: JSON.stringify(d) }),
  deleteForm: (id) => safeFetch(`${BASE_URL}/forms/${id}`, { method: "DELETE", headers: headers() }),

  // WhatsApp
  sendWhatsApp: (d) => safeFetch(`${BASE_URL}/whatsapp/send`, { method: "POST", headers: headers(), body: JSON.stringify(d) }),
  getWhatsAppCampaigns: () => safeFetch(`${BASE_URL}/whatsapp/campaigns`, { headers: headers() }),
  createWhatsAppCampaign: (d) => safeFetch(`${BASE_URL}/whatsapp/campaigns`, { method: "POST", headers: headers(), body: JSON.stringify(d) }),
  startWhatsAppCampaign: (id) => safeFetch(`${BASE_URL}/whatsapp/campaigns/${id}/start`, { method: "POST", headers: headers() }),

  // Campaigns
  getCampaigns: () => safeFetch(`${BASE_URL}/campaigns`, { headers: headers() }),
  getCampaignById: (id) => safeFetch(`${BASE_URL}/campaigns/${id}`, { headers: headers() }),
  createCampaign: (d) => safeFetch(`${BASE_URL}/campaigns`, { method: "POST", headers: headers(), body: JSON.stringify(d) }),
  updateCampaign: (id, d) => safeFetch(`${BASE_URL}/campaigns/${id}`, { method: "PUT", headers: headers(), body: JSON.stringify(d) }),
  deleteCampaign: (id) => safeFetch(`${BASE_URL}/campaigns/${id}`, { method: "DELETE", headers: headers() }),

  // AI
  getAIRecommendation: (id) => safeFetch(`${BASE_URL}/ai/recommend/${id}`, { method: "POST", headers: headers() }),
  suggestWhatsApp: (id) => safeFetch(`${BASE_URL}/ai/whatsapp-message/${id}`, { method: "POST", headers: headers() }),
  suggestEmail: (id) => safeFetch(`${BASE_URL}/ai/email/${id}`, { method: "POST", headers: headers() }),

  // ── Settings ───────────────────────────────────────────────────────────────

  // Company Settings
  getCompanySettings: () => safeFetch(`${BASE_URL}/settings/company`, { headers: headers() }),
  updateCompanySettings: (d) => safeFetch(`${BASE_URL}/settings/company`, { method: "PUT", headers: headers(), body: JSON.stringify(d) }),

  // Currencies
  getCurrencies: () => safeFetch(`${BASE_URL}/settings/currencies`, { headers: headers() }),
  createCurrency: (d) => safeFetch(`${BASE_URL}/settings/currencies`, { method: "POST", headers: headers(), body: JSON.stringify(d) }),
  updateCurrency: (id, d) => safeFetch(`${BASE_URL}/settings/currencies/${id}`, { method: "PUT", headers: headers(), body: JSON.stringify(d) }),
  deleteCurrency: (id) => safeFetch(`${BASE_URL}/settings/currencies/${id}`, { method: "DELETE", headers: headers() }),

  // Lead Statuses
  getLeadStatuses: () => safeFetch(`${BASE_URL}/settings/lead-statuses`, { headers: headers() }),
  createLeadStatus: (d) => safeFetch(`${BASE_URL}/settings/lead-statuses`, { method: "POST", headers: headers(), body: JSON.stringify(d) }),
  updateLeadStatus: (id, d) => safeFetch(`${BASE_URL}/settings/lead-statuses/${id}`, { method: "PUT", headers: headers(), body: JSON.stringify(d) }),
  deleteLeadStatus: (id) => safeFetch(`${BASE_URL}/settings/lead-statuses/${id}`, { method: "DELETE", headers: headers() }),
  bulkDeleteLeadStatus: (ids) => safeFetch(`${BASE_URL}/settings/lead-statuses/bulk`, { method: "DELETE", headers: headers(), body: JSON.stringify({ ids }) }),

  // Email Settings
  getEmailSettings: () => safeFetch(`${BASE_URL}/settings/email`, { headers: headers() }),
  updateEmailSettings: (d) => safeFetch(`${BASE_URL}/settings/email`, { method: "PUT", headers: headers(), body: JSON.stringify(d) }),
  sendTestEmail: () => safeFetch(`${BASE_URL}/settings/email/test`, { method: "POST", headers: headers() }),

  // Database Backup
  generateBackup: () => safeFetch(`${BASE_URL}/settings/backup/generate`, { method: "POST", headers: headers() }),
  listBackups: () => safeFetch(`${BASE_URL}/settings/backup/list`, { headers: headers() }),
  deleteBackup: (name) => safeFetch(`${BASE_URL}/settings/backup/${encodeURIComponent(name)}`, { method: "DELETE", headers: headers() }),

  // Roles & Permissions
  getRoles: () => safeFetch(`${BASE_URL}/settings/roles`, { headers: headers() }),
  createRole: (d) => safeFetch(`${BASE_URL}/settings/roles`, { method: "POST", headers: headers(), body: JSON.stringify(d) }),
  updateRole: (id, d) => safeFetch(`${BASE_URL}/settings/roles/${id}`, { method: "PUT", headers: headers(), body: JSON.stringify(d) }),
  deleteRole: (id) => safeFetch(`${BASE_URL}/settings/roles/${id}`, { method: "DELETE", headers: headers() }),

  // Storage Settings
  getStorageSettings: () => safeFetch(`${BASE_URL}/settings/storage`, { headers: headers() }),
  updateStorageSettings: (d) => safeFetch(`${BASE_URL}/settings/storage`, { method: "PUT", headers: headers(), body: JSON.stringify(d) }),

  // Languages
  getLanguages: () => safeFetch(`${BASE_URL}/settings/languages`, { headers: headers() }),
  createLanguage: (d) => safeFetch(`${BASE_URL}/settings/languages`, { method: "POST", headers: headers(), body: JSON.stringify(d) }),
  updateLanguage: (id, d) => safeFetch(`${BASE_URL}/settings/languages/${id}`, { method: "PUT", headers: headers(), body: JSON.stringify(d) }),
  deleteLanguage: (id) => safeFetch(`${BASE_URL}/settings/languages/${id}`, { method: "DELETE", headers: headers() }),
  toggleLanguage: (id) => safeFetch(`${BASE_URL}/settings/languages/${id}/toggle`, { method: "PATCH", headers: headers() }),

  // Translations
  getTranslations: (p = {}) => safeFetch(`${BASE_URL}/settings/translations?${new URLSearchParams(p)}`, { headers: headers() }),
  saveTranslations: (d) => safeFetch(`${BASE_URL}/settings/translations/bulk`, { method: "POST", headers: headers(), body: JSON.stringify(d) }),

  // Modules
  getModules: () => safeFetch(`${BASE_URL}/settings/modules`, { headers: headers() }),
  verifyModule: (id, d) => safeFetch(`${BASE_URL}/settings/modules/${id}/verify`, { method: "POST", headers: headers(), body: JSON.stringify(d) }),

  // App Info
  getAppInfo: () => safeFetch(`${BASE_URL}/settings/app-info`, { headers: headers() }),
};

export default api;