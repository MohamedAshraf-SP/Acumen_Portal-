import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import MainLayout from "../Layouts/MainLayout";
import Loader from "../component/Loader";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "../Contexts/AuthContext";
import Login from "../pages/Auth/Login";
import Unauthorized from "../pages/Auth/Unauthorized";
import NotFind from "../pages/NotFind";

// Lazy Load Pages
// -------------Admin --------------
const AdminDashboard = lazy(() => import("../pages/Admin/Admin_Dashboard"));
const AdminAccounts = lazy(() => import("../pages/Admin/Accountants"));
const AddClient = lazy(() => import("../component/AddClientform"));
const AdminClients = lazy(() => import("../pages/Admin/Clients"));
const AdminCompaines = lazy(() => import("../component/Companytable"));
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
const AddCompany = lazy(() => import("../component/AddCompany"));
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
const AddacountantForm = lazy(() => import("../component/addAcountantForm"));
const AccountantCompanies = lazy(() =>
  import("../pages/Accountant/Accountant_Companies")
);
// -------------- shared-----------
const Editorpage = lazy(() => import("../pages/Editor"));
const Forms = lazy(() => import("../pages/Forms"));
const Invoices = lazy(() => import("../pages/Invoices"));
const Documents = lazy(() => import("../pages/Documents"));
const DisplayUsersCompany = lazy(() => import("../pages/DisplayUsersCompany"));

const AppRouter = () => {
  const { loading, user } = useAuth();

  if (loading) {
    return <Loader />;
  }

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Redirect to the appropriate dashboard based on the user's role */}
        <Route
          path="/"
          element={
            loading ? (
              <Loader />
            ) : user?.role ? (
              <Navigate to={`/${user.role}/dashboard`} replace />
            ) : (
              <Navigate to="/auth/login" replace />
            )
          }
        />

        {/* Catch-all route for non-existent pages */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFind />} />
        {/* start our routes */}
        <Route element={<MainLayout />}>
          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedTo={["admin"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/accountants" element={<AdminAccounts />} />
            <Route
              path="/accountants/add-account"
              element={<AddacountantForm />}
            />
            <Route path="/clients" element={<AdminClients />} />
            <Route path="/editor/:id" element={<Editorpage />} />
            <Route path="/clients/add-client" element={<AddClient />} />
            <Route path="/companies" element={<AdminCompaines />} />
            <Route path="/notifications" element={<AdminNotifications />} />
            <Route path="/history" element={<AdminHistory />} />
            <Route path="/forms" element={<Forms />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/settings" element={<AdminSettings />} />
            <Route path="/import-clients" element={<ImportClients />} />
            <Route path="/sent-notification" element={<SentNotifications />} />
          </Route>

          {/* Client Routes */}
          <Route element={<ProtectedRoute allowedTo={["client"]} />}>
            <Route path="/client/dashboard" element={<ClientDashboard />} />
            <Route path="/client/add_Company" element={<AddCompany />} />
            <Route path="/client/Engagement" element={<ClientEngagement />} />
            <Route path="/client/Forms" element={<Forms />} />
            <Route path="/client/Invoices" element={<Invoices />} />
            <Route path="/client/Documents" element={<ClientDocuments />} />
          </Route>

          {/* Accountant Routes */}
          <Route element={<ProtectedRoute allowedTo={["accountant"]} />}>
            <Route
              path="/accountant/dashboard"
              element={<Accountants_Dashboard />}
            />
            <Route
              path="/accountant/Clients"
              element={<Accountants_clients />}
            />
            <Route path="/accountant/add-client" element={<AddClient />} />
            <Route
              path="/accountant/Companies"
              element={<AccountantCompanies />}
            />

            <Route
              path="/accountant/Documents"
              element={<Accountants_Documents />}
            />
            <Route path="/accountant/history" element={<AdminHistory />} />
            <Route path="/accountant/forms" element={<Forms />} />
            <Route path="/accountant/invoices" element={<Invoices />} />
          </Route>

          {/* shared routes */}
          <Route
            element={
              <ProtectedRoute allowedTo={["admin", "accountant", "client"]} />
            }
          >
            <Route path="/companies/add-company" element={<AddCompany />} />
            <Route
              path="/companies/:companyId"
              element={<DisplayUsersCompany />}
            />
            <Route
              path="/companies/editcompany/:companyId"
              element={<EditUserCompany />}
            />
            <Route
              path={`/companies/editcompany`}
              element={<EditUserCompany />}
            />
            <Route
              path="/companies/:companyId"
              element={<DisplayUsersCompany />}
            />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
