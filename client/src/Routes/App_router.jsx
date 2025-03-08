import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import MainLayout from "../Layouts/MainLayout"; // Import your layout
import NotFind from "../pages/NotFind"; // 404 Page Component
import Loader from "../component/Loader"; // Loading component
import AddacountantForm from "../component/addAcountantForm";
import DisplayUsersCompany from "../pages/DisplayUsersCompany";
import Unauthorized from "../Auth/Unauthorized";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../Auth/Login";

// Lazy Load Pages
// -------------Admin --------------
const AdminDashboard = lazy(() => import("../pages/Admin/Admin_Dashboard"));
const AdminAccounts = lazy(() => import("../pages/Admin/Accountants"));
const AddClient = lazy(() => import("../component/AddClientform"));
const AdminClients = lazy(() => import("../pages/Admin/Clients"));
const AdminCompaines = lazy(() => import("../pages/Admin/Compaines"));
const AdminNotifications = lazy(() => import("../pages/Admin/Notifications"));
const AdminHistory = lazy(() => import("../pages/Admin/History"));
const AdminSettings = lazy(() => import("../pages/Admin/Settings"));
const ImportClients = lazy(() => import("../pages/Admin/Import_clients"));
const SentNotifications = lazy(() =>
  import("../pages/Admin/sent_Notifications")
);
const EditUserCompany = lazy(() => import("../pages/Admin/EditCompany"));
// ---------------client ---------
const ClientDashboard = lazy(() => import("../pages/Client/Client_Dashboard"));
const AddCompany = lazy(() => import("../pages/Client/Add_Company"));
const ClientEngagement = lazy(() => import("../pages/Client/ClientEngagement"));
const ClientDocuments = lazy(() => import("../pages/Client/Client_Documents"));
//--------------- Accountants--------
const Accountants_Dashboard = lazy(() =>
  import("../pages/Accountant/Accountant_Dashboard")
);
const Accountants_clients = lazy(() =>
  import("../pages/Accountant/Accountant_Clients")
);
const Accountants_Documents = lazy(() =>
  import("../pages/Accountant/Accountants_Documents")
);

// -------------- shared-----------
const Editorpage = lazy(() => import("../pages/Editor"));
const Forms = lazy(() => import("../pages/Forms"));
const Invoices = lazy(() => import("../pages/Invoices"));
const Documents = lazy(() => import("../pages/Documents"));

// Suspense wrapper for lazy-loaded components
const withSuspense = (Component) => {
  return (
    <Suspense>
      <Component />
    </Suspense>
  );
};


const AppRouter = () => {
  // Get user and loading state from AuthContext

  return (
    <Routes>
      {/* Login Page - Default Route */}
      <Route path="/" element={<Login />} />
      <Route path="/auth/login" element={<Login />} />
      <Route element={<MainLayout />}>
        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedTo={["admin"]} />}>
          <Route
            path="admin/dashboard"
            element={withSuspense(AdminDashboard)}
          />
          <Route path="/accountants" element={withSuspense(AdminAccounts)} />
          <Route
            path="/accountants/add-account"
            element={withSuspense(AddacountantForm)}
          />
          <Route path="/editor/:id" element={withSuspense(Editorpage)} />
          <Route path="/clients" element={withSuspense(AdminClients)} />
          <Route path="/clients/add-client" element={withSuspense(AddClient)} />
          <Route path="/companies" element={withSuspense(AdminCompaines)} />
          <Route
            path="/companies/:itemId"
            element={withSuspense(DisplayUsersCompany)}
          />
          <Route
            path="/companies/editcompany/:companyId"
            element={withSuspense(EditUserCompany)}
          />
          <Route
            path="/notifications"
            element={withSuspense(AdminNotifications)}
          />
          <Route path="/history" element={withSuspense(AdminHistory)} />
          <Route path="/forms" element={withSuspense(Forms)} />
          <Route path="/invoices" element={withSuspense(Invoices)} />
          <Route path="/documents" element={withSuspense(Documents)} />
          <Route path="/settings" element={withSuspense(AdminSettings)} />
          <Route path="/import-clients" element={withSuspense(ImportClients)} />
          <Route
            path="/sent-notification"
            element={withSuspense(SentNotifications)}
          />
        </Route>
        <Route element={<ProtectedRoute allowedTo={["client"]} />}>
          <Route
            path="client/dashboard"
            element={withSuspense(ClientDashboard)}
          />
          <Route
            path="/client/add_Company"
            element={withSuspense(AddCompany)}
          />
          <Route
            path="/client/Engagement"
            element={withSuspense(ClientEngagement)}
          />
          <Route path="/client/Forms" element={withSuspense(Forms)} />
          <Route path="/client/Invoices" element={withSuspense(Invoices)} />
          <Route
            path="/client/Documents"
            element={withSuspense(ClientDocuments)}
          />
        </Route>
        {/* Accountant Routes */}
        <Route element={<ProtectedRoute allowedTo={["accountant"]} />}>
          <Route
            path="/accountant/dashboard"
            element={withSuspense(Accountants_Dashboard)}
          />
          <Route
            path="/accountant/Clients"
            element={withSuspense(Accountants_clients)}
          />
          <Route
            path="/accountant/Companies"
            element={withSuspense(AdminCompaines)}
          />
          <Route
            path="/accountant/History"
            element={withSuspense(AdminHistory)}
          />
          <Route path="/accountant/Forms" element={withSuspense(Forms)} />
          <Route path="/accountant/Invoices" element={withSuspense(Invoices)} />
          <Route
            path="/accountant/Documents"
            element={withSuspense(Accountants_Documents)}
          />
        </Route>
      </Route>
      {/* Catch-all route for non-existent pages */}
      <Route path="*" element={<NotFind />} />
      <Route path="/auth/unauthorized" element={<Unauthorized />} />
    </Routes>
  );
};

export default AppRouter;
