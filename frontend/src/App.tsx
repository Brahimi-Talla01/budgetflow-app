import { Routes, Route } from "react-router-dom"
import Home from "./presentation/pages/home/Home"
import Layout from "./presentation/components/layout/Layout"
import DashboardPage from "./presentation/pages/dashboard/DashboardPage"
import TransactionPage from "./presentation/pages/transaction/TransactionPage"
import ProjectsPage from "./presentation/pages/projects/ProjectsPage"
import AnalysePage from "./presentation/pages/analyse/AnalysePage"
import ConseilPage from "./presentation/pages/conseil/ConseilPage"
import NotFound from "./presentation/pages/NotFound"
import LoginPage from "./presentation/pages/auth/LoginPage"
import { LoadingProvider } from "./application/context/LoadingContext"
import RegisterPage from "./presentation/pages/auth/RegisterPage"
import ForgetPasswordPage from "./presentation/pages/auth/ForgetPasswordPage"
import PrivateRoute from "./routes/PrivateRoute"
import { AuthProvider } from "./application/context/AuthContext"
import { ExpenseProvider } from "./application/context/ExpenseContext"
import { IncomeProvider } from "./application/context/IncomeContext"


const App = () => {
  return (
    <AuthProvider>
      <ExpenseProvider>
        <IncomeProvider>
          
          <LoadingProvider>
            <Routes>

              {/* Routes  */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgetPasswordPage />} />

              {/* Routes */}
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
          </LoadingProvider>

        </IncomeProvider>
      </ExpenseProvider>
    </AuthProvider>
  );
}

export default App;
