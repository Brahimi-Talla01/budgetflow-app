import { lazy, Suspense } from "react"
import { Routes, Route } from "react-router-dom"
import Layout from "./presentation/components/layout/Layout"
import PageLoader from "./presentation/components/ui/PageLoader"
import { LoadingProvider } from "./application/context/LoadingProvider"
import PrivateRoute from "./routes/PrivateRoute"
import { AuthProvider } from "./application/context/AuthProvider"
import { ExpenseProvider } from "./application/context/ExpenseProvider"
import { IncomeProvider } from "./application/context/IncomeProvider"
import { ProjectProvider } from "./application/context/ProjectProvider"
import { NotificationProvider } from "./application/context/NotificationProvider"

// Découpage par route : chaque page est chargée à la demande.
const Home = lazy(() => import("./presentation/pages/home/Home"))
const DashboardPage = lazy(() => import("./presentation/pages/dashboard/DashboardPage"))
const TransactionPage = lazy(() => import("./presentation/pages/transaction/TransactionPage"))
const ProjectsPage = lazy(() => import("./presentation/pages/projects/ProjectsPage"))
const AnalysePage = lazy(() => import("./presentation/pages/analyse/AnalysePage"))
const ConseilPage = lazy(() => import("./presentation/pages/conseil/ConseilPage"))
const LoginPage = lazy(() => import("./presentation/pages/auth/LoginPage"))
const RegisterPage = lazy(() => import("./presentation/pages/auth/RegisterPage"))
const ForgetPasswordPage = lazy(() => import("./presentation/pages/auth/ForgetPasswordPage"))
const NotFound = lazy(() => import("./presentation/pages/NotFound"))

const App = () => {
  return (
    <AuthProvider>
      <ExpenseProvider>
        <IncomeProvider>
          <ProjectProvider>
            <NotificationProvider>
              <LoadingProvider>
                <Suspense fallback={<PageLoader />}>
                  <Routes>

                    {/* Routes publiques */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ForgetPasswordPage />} />

                    {/* Routes privées */}
                    <Route element={<PrivateRoute />}>
                      <Route path="/dashboard" element={<Layout />}>
                        <Route index element={<DashboardPage />} />
                        <Route path="transaction" element={<TransactionPage />} />
                        <Route path="projet" element={<ProjectsPage />} />
                        <Route path="analyse" element={<AnalysePage />} />
                        <Route path="conseil" element={<ConseilPage />} />
                      </Route>
                    </Route>

                    <Route path="*" element={<NotFound />} />

                  </Routes>
                </Suspense>
              </LoadingProvider>
            </NotificationProvider>
          </ProjectProvider>
        </IncomeProvider>
      </ExpenseProvider>
    </AuthProvider>
  )
}

export default App
