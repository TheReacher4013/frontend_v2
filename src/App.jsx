import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./component/pages/Login";
import Layout from "./component/admin/Layout";

// ── Dashboards ──
import AdminDashboard from "./component/pages/AdminDashboard";
import ManagerDashboard from "./component/pages/ManagerDashboard";
import MemberDashboard from "./component/pages/MemberDashboard"; 

// ── Profiles ──
import AdminProfile from "./component/pages/AdminProfile";  
import Managerprofile from "./component/pages/Managerprofile"; 
import MemberProfile from "./component/pages/MemberProfile"; 

// ── Leads & Calls ──
import Leads from "./component/pages/leadManager/leads&Calls/Leads";
import CallLogs from "./component/pages/leadManager/leads&Calls/CallLogs";
import LeadNotes from "./component/pages/leadManager/leads&Calls/LeadNotes";

// ── Follow Up ──
import LeadFollowup from "./component/pages/leadFollowUp/LeadFollowup";

// ── Products ──
import Products from "./component/pages/products/Products";

// ── Expenses ──
import ExpenseCategories from "./component/pages/expenseManager/ExpenseCategories";
import Expenses from "./component/pages/expenseManager/Expenses";

// ── User Management ──
import StaffMembers from "./component/pages/userManagement/StaffMembers";
import Users from "./component/pages/User"; 
import Salesman from "./component/pages/userManagement/salesmans/Salesmans";
import SalesmanBookings from "./component/pages/userManagement/salesmans/SalesmanBookings";

// ── Call Manager Campaigns ──
import CallManager from "./component/pages/leadManager/CallManager";
import Campaigns from "./component/pages/leadManager/Campaigns";

// ── Website Development Campaigns ── (already had api import)
import WebsiteDevelopmentCampagines from "./component/pages/WebsiteDevelopmentCampagines";
import WebsiteDeevelopmentCampagines2 from "./component/pages/WebsiteDeevelopmentCampagines2";

// ── Social Media Campaigns ──  updated files
import SocialMediaCampagiens from "./component/pages/SocialMediaCampagiens";
import SocialMediaCamagins2 from "./component/pages/SocialMediaCampagins2";

// ── Sale Home Loan Campaign ──updated file
import SaleHomeLoneCampagins from "./component/pages/SaleHomeLoneCampagins";

// ── Settings ──
import LeadTableFields from "./component/pages/settings/LeadTableFields";
import EmailTemplates from "./component/pages/settings/Messaging/EmailTemplates";
import Forms from "./component/pages/settings/Forms";
import AdminSettings from "./component/pages/Adminsettings";

// ── Layouts ──
import ManagerLayout from "./component/manager/managerLayout";
import MemberLayout from "./component/member/memberLayout";

function App() {
  return (
    <Router>
      <Routes>

        {/* ── Login ── */}
        <Route path="/" element={<Login />} />

        {/* ── Standalone Campaign Pages (no sidebar) ── */}
        <Route path="/lead-details" element={<WebsiteDevelopmentCampagines />} />
        <Route path="/WebsiteDeevelopmentCampagines2" element={<WebsiteDeevelopmentCampagines2 />} />

        <Route path="/socialmedia" element={<SocialMediaCampagiens />} />
        <Route path="/socialmedia2" element={<SocialMediaCamagins2 />} />

        {/* Role-based lead-details */}
        <Route path="/admin/lead-details" element={<WebsiteDevelopmentCampagines />} />
        <Route path="/manager/lead-details" element={<WebsiteDevelopmentCampagines />} />
        <Route path="/member/lead-details" element={<WebsiteDevelopmentCampagines />} />

        {/* Sale Home Loan */}
        <Route path="/admin/sale-home-loan" element={<SaleHomeLoneCampagins />} />
        <Route path="/manager/sale-home-loan" element={<SaleHomeLoneCampagins />} />
        <Route path="/member/sale-home-loan" element={<SaleHomeLoneCampagins />} />

        {/* ── ADMIN Layout ── */}
        <Route path="/admin" element={<Layout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="profile" element={<AdminProfile />} />

          <Route path="products" element={<Products />} />

          <Route path="expense-categories" element={<ExpenseCategories />} />
          <Route path="expense" element={<Expenses />} />

          <Route path="staff" element={<StaffMembers />} />
          <Route path="users" element={<Users />} />  

          <Route path="salesmans" element={<Salesman />} />
          <Route path="salesman-bookings" element={<SalesmanBookings />} />

          <Route path="leads" element={<Leads />} />
          <Route path="call-logs" element={<CallLogs />} />
          <Route path="lead-notes" element={<LeadNotes />} />

          <Route path="follow-up" element={<LeadFollowup />} />

          <Route path="calls" element={<CallManager />} />
          <Route path="campaigns" element={<Campaigns />} />

          <Route path="lead-table-fields" element={<LeadTableFields />} />
          <Route path="email-templates" element={<EmailTemplates />} />
          <Route path="forms" element={<Forms />} />

          <Route path="settings" element={<AdminSettings role="admin" />} />
        </Route>

        {/* ── MANAGER Layout ── */}
        <Route path="/manager" element={<ManagerLayout />}>
          <Route index element={<ManagerDashboard />} />
          <Route path="profile" element={<Managerprofile />} />

          <Route path="calls" element={<CallManager />} />
          <Route path="campaigns" element={<Campaigns />} />
          <Route path="leads" element={<Leads />} />

          <Route path="follow-up" element={<LeadFollowup />} />

          <Route path="lead-notes" element={<LeadNotes />} />
          <Route path="call-logs" element={<CallLogs />} />

          <Route path="salesmans" element={<Salesman />} />
          <Route path="salesman-bookings" element={<SalesmanBookings />} />

          <Route path="lead-table-fields" element={<LeadTableFields />} />
          <Route path="email-templates" element={<EmailTemplates />} />
          <Route path="forms" element={<Forms />} />

          <Route path="settings" element={<AdminSettings role="manager" />} />
        </Route>

        {/* ── MEMBER Layout ── */}
        <Route path="/member" element={<MemberLayout />}>
          <Route index element={<MemberDashboard />} />
          <Route path="profile" element={<MemberProfile />} />

          <Route path="calls" element={<CallManager />} />
          <Route path="leads" element={<Leads />} />
          <Route path="follow-up" element={<LeadFollowup />} />
          <Route path="notes" element={<LeadNotes />} />
          <Route path="call-logs" element={<CallLogs />} />
          <Route path="lead-table-fields" element={<LeadTableFields />} />
          <Route path="email-templates" element={<EmailTemplates />} />
          <Route path="forms" element={<Forms />} />

          <Route path="settings" element={<AdminSettings role="member" />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;