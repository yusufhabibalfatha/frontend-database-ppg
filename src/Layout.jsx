import { Outlet, Link } from "react-router-dom";
import ButtonLogout from "./components/ButtonLogout";
import PrivateRoute from "./context/PrivateRoute";

function Layout() {
  return (
    <div>
      <nav>
        <PrivateRoute>
          <Link to="/">Home</Link> |{" "}
          <Link to="/tambah">Tambah Generus</Link>
          <ButtonLogout />
        </PrivateRoute>
      </nav>
      <hr />
      <Outlet />
    </div>
  );
}

export default Layout;
