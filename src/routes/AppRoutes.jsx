import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import AssessmentDetailPage from "../pages/AssessmentDetailPage";
import AssessmentReportPage from "../pages/AssessmentReportPage";
import AssessmentsPage from "../pages/AssessmentsPage";
import LoginPage from "../pages/LoginPage";
import ParametersPage from "../pages/ParametersPage";
import DashboardPage from "../pages/DashboardPage";
import TenantConnectionPage from "../pages/TenantConnectionPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/tenant" element={<TenantConnectionPage />} />
          <Route path="/assessments" element={<AssessmentsPage />} />
          <Route path="/parameters" element={<ParametersPage />} />
          <Route path="/assessments/:assessmentId" element={<AssessmentDetailPage />} />
          <Route path="/assessments/:assessmentId/report" element={<AssessmentReportPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
