import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import MainLayout from "../Layouts/MainLayout"; // Import your layout
import NotFind from "../pages/NotFind"; // 404 Page Component
import Loader from "../component/Loader"; // Loading component
import AddAcountant from "../component/AddAcountant";

// Lazy Load Pages
// -------------Admin --------------
const AdminDashboard = lazy(() => import("../pages/Admin/Admin_Dashboard"));
const AdminAccounts = lazy(() => import("../pages/Admin/Accountants"));
const Addaccountant = lazy(() => import("../component/AddAcountant"));
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

// ---------------client ---------
const ClientDashboard = lazy(() => import("../pages/Client/Client_Dashboard"));
const AddCompany = lazy(() => import("../pages/Client/Add_Company"));
const ClientEngagement = lazy(() => import("../pages/Client/Engagement"));
// -------------- shared-----------
const Forms = lazy(() => import("../pages/Forms"));
const Invoices = lazy(() => import("../pages/Invoices"));
const Documents = lazy(() => import("../pages/Documents"));

// Suspense wrapper for lazy-loaded components
const withSuspense = (children) => (
  <Suspense fallback={<Loader />}>{children}</Suspense>
);

const AppRouter = () => {
  // Assuming you have dynamic logic to determine the user role
  const userRole = "Admin"; // Replace this with dynamic role logic (e.g., from context or auth state)

  return (
    <BrowserRouter>
      <Routes>
        {/* Routes with MainLayout */}
        <Route element={<MainLayout />}>
          {/* Common Route - Redirect to the dashboard by default */}
          <Route path="/" element={<Navigate to="/dashboard" />} />

          {/* Admin Routes */}
          {userRole === "Admin" && (
            <>
              <Route
                path="/dashboard"
                element={withSuspense(<AdminDashboard />)}
              />
              <Route
                path="/accountants"
                element={withSuspense(<AdminAccounts />)}
              >
                <Route
                  path="add-accountant"
                  element={withSuspense(<Addaccountant />)}
                />
              </Route>
              <Route path="/clients" element={withSuspense(<AdminClients />)} />
              <Route
                path="/companies"
                element={withSuspense(<AdminCompaines />)}
              />
              <Route
                path="/notifications"
                element={withSuspense(<AdminNotifications />)}
              />
              <Route path="/history" element={withSuspense(<AdminHistory />)} />
              <Route path="/forms" element={withSuspense(<Forms />)} />
              <Route path="/invoices" element={withSuspense(<Invoices />)} />
              <Route path="/documents" element={withSuspense(<Documents />)} />
              <Route
                path="/settings"
                element={withSuspense(<AdminSettings />)}
              />
              <Route
                path="/import-clients"
                element={withSuspense(<ImportClients />)}
              />
              <Route
                path="/sent-notification"
                element={withSuspense(<SentNotifications />)}
              />
              <Route
                path="accontants/add-account"
                element={withSuspense(<AddAcountant />)}
              />
              <Route
                path="clients/add-Client"
                element={withSuspense(<AddClient />)}
              />
            </>
          )}

          {/* Client Routes */}
          {userRole === "Client" && (
            <>
              <Route
                path="/dashboard"
                element={withSuspense(<ClientDashboard />)}
              />
              <Route
                path="/add-company"
                element={withSuspense(<AddCompany />)}
              />
              <Route
                path="/engagement"
                element={withSuspense(<ClientEngagement />)}
              />
            </>
          )}

          {/* Accountant Routes */}
          {userRole === "Accountant" && (
            <>
              <Route
                path="/dashboard"
                element={withSuspense(<AccountantDashboard />)}
              />
              <Route
                path="/settings"
                element={withSuspense(<AccountantSettings />)}
              />
            </>
          )}
        </Route>

        {/* Catch-all route for non-existent pages */}
        <Route path="*" element={<NotFind />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
