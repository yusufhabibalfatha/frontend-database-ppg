import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import PageHome from "./pages/PageHome";
import PageDetailGenerus from "./pages/PageDetailGenerus";
import FormTambahGenerus from "./components/FormTambahGenerus";
import FormUpdateGenerus from "./components/FormUpdateGenerus";
import PageNotFound from "./components/PageNotFound";
import PrivateRoute from "./context/PrivateRoute";
import PublicOnlyRoute from "./context/PublicOnlyRoute";
import LoginPage from "./pages/LoginPage";
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<PrivateRoute><PageHome /></PrivateRoute>} />

              <Route
                path="login"
                element={
                  <PublicOnlyRoute>
                    <LoginPage />
                  </PublicOnlyRoute>
                }
              />

              <Route
                path="generus/:id"
                element={
                  <PrivateRoute>
                    <PageDetailGenerus />
                  </PrivateRoute>
                }
              />

              <Route
                path="tambah"
                element={
                  <PrivateRoute>
                    <FormTambahGenerus />
                  </PrivateRoute>
                }
              />

              <Route
                path="update/:id"
                element={
                  <PrivateRoute>
                    <FormUpdateGenerus />
                  </PrivateRoute>
                }
              />

              <Route path="*" element={<PageNotFound />} />
            </Route>
          </Routes>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
