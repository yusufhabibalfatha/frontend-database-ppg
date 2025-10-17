import { Outlet, Link, useLocation } from "react-router-dom";
import ButtonLogout from "./components/ButtonLogout";
import WhatsAppButton from "./components/WhatsAppButton"
import PrivateRoute from "./context/PrivateRoute";
import "./Layout.css"; // ✅ Import CSS

function Layout() {
  const location = useLocation();

  return (
    <div className="layout-container">
      <nav className="layout-nav">
        <PrivateRoute>
          <div className="nav-content">
            <div className="nav-links">
              <Link 
                to="/" 
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              >
                🏠 Home
              </Link>
              <span className="nav-separator">|</span>
              <Link 
                to="/tambah" 
                className={`nav-link ${location.pathname === '/tambah' ? 'active' : ''}`}
              >
                ➕ Tambah Generus
              </Link>
            </div>
            <div className="nav-right">
              <ButtonLogout />
            </div>
          </div>
        </PrivateRoute>
      </nav>
      
      <hr className="layout-divider" />
      
      <main className="layout-outlet">
        <Outlet />
      </main>
      <WhatsAppButton phoneNumber="6287865712625" />
    </div>
  );
}

export default Layout;