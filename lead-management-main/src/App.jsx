import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./component/pages/Login";
import Layout from "./component/admin/Layout";

import AdminDashboard from "./component/pages/AdminDashboard";
import AdminProfile from "./component/pages/AdminProfile";

import Leads from "./component/pages/leadManager/leads&Calls/Leads";
import CallLogs from "./component/pages/leadManager/leads&Calls/CallLogs";
import LeadNotes from "./component/pages/leadManager/leads&Calls/LeadNotes";

import LeadFollowup from "./component/pages/leadFollowUp/LeadFollowup";

import Products from "./component/pages/products/Products";

import ExpenseCategories from "./component/pages/expenseManager/ExpenseCategories";
import Expenses from "./component/pages/expenseManager/Expenses";

import StaffMembers from "./component/pages/userManagement/StaffMembers";

import Salesman from "./component/pages/userManagement/salesmans/Salesmans";
import SalesmanBookings from "./component/pages/userManagement/salesmans/SalesmanBookings";

import WebsiteDevelopmentCampagines from "./component/pages/WebsiteDevelopmentCampagines";
import WebsiteDeevelopmentCampagines2 from "./component/pages/WebsiteDeevelopmentCampagines2";

import CallManager from "./component/pages/leadManager/CallManager";
import Campaigns from "./component/pages/leadManager/Campaigns";

import SocialMediaCampagiens from "./component/pages/SocialMediaCampagiens";
import SocialMediaCampagins2 from "./component/pages/SocialMediaCampagins2";

import LeadTableFields from "./component/pages/settings/LeadTableFields";
import EmailTemplates from "./component/pages/settings/Messaging/EmailTemplates";
import Forms from "./component/pages/settings/Forms";
import ManagerLayout from "./component/manager/managerLayout";
import ManagerDashboard from "./component/pages/ManagerDashboard";
import Managerprofile from "./component/pages/Managerprofile";

import MemberLayout from "./component/member/memberLayout";
import MemberDashboard from "./component/pages/MemberDashboard";
import MemberProfile from "./component/pages/MemberProfile";
import AdminSettings from "./component/pages/Adminsettings";
import SaleHomeLoneCampagins from "./component/pages/SaleHomeLoneCampagins";

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Login />} />

        {/* ── Standalone full pages — NO sidebar/navbar ── */}
        <Route path="/lead-details"                   element={<WebsiteDevelopmentCampagines />} />
        <Route path="/WebsiteDeevelopmentCampagines2" element={<WebsiteDeevelopmentCampagines2 />} />

        {/* ✅ Social Media Campaign pages — Layout बाहेर (no sidebar/navbar) */}
        <Route path="/socialmedia"  element={<SocialMediaCampagiens />} />
        <Route path="/socialmedia2" element={<SocialMediaCampagins2 />} />

        {/* ✅ Role based lead-details — Campaign 2 (no sidebar/navbar) */}
        <Route path="/admin/lead-details"   element={<WebsiteDevelopmentCampagines />} />
        <Route path="/manager/lead-details" element={<WebsiteDevelopmentCampagines />} />
        <Route path="/member/lead-details"  element={<WebsiteDevelopmentCampagines />} />

        {/* ✅ Sale Home Loan — Layout बाहेर (no sidebar/navbar) */}
        <Route path="/admin/sale-home-loan"   element={<SaleHomeLoneCampagins />} />
        <Route path="/manager/sale-home-loan" element={<SaleHomeLoneCampagins />} />
        <Route path="/member/sale-home-loan"  element={<SaleHomeLoneCampagins />} />

        {/* ── ADMIN — Layout सकट ── */}
        <Route path="/admin" element={<Layout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="profile" element={<AdminProfile />} />

          <Route path="products" element={<Products />} />

          <Route path="expense-categories" element={<ExpenseCategories />} />
          <Route path="expense" element={<Expenses />} />

          <Route path="staff" element={<StaffMembers />} />

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

        {/* ── MANAGER — ManagerLayout सकट ── */}
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

        {/* ── MEMBER — MemberLayout सकट ── */}
        <Route path="/member" element={<MemberLayout />}>
          <Route index element={<MemberDashboard />} />
          <Route path="profile" element={<MemberProfile />} />

          <Route path="calls" element={<CallManager />} />
          <Route path="leads" element={<Leads />} />
          <Route path="follow-up" element={<LeadFollowup />} />
          <Route path="notes" element={<LeadNotes />} />

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