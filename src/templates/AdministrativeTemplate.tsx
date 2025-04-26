import { useLocation, useNavigate } from "react-router-dom";
import { colors } from "../styles/colors";
import { setTenantHeader } from "../services/api";

interface AdministrativeTemplateProps {
  title: string;
  children: React.ReactNode;
}

export function AdministrativeTemplate({ title, children }: AdministrativeTemplateProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isTenantRelatedPage =
    location.pathname === "/tenants" ||
    location.pathname === "/" ||
    location.pathname === "/createTenant";

  const handleBackToTenants = () => {
    setTenantHeader(null);
    navigate("/tenants");
  };

  const isActiveRoute = (path: string) => location.pathname === path;

  return (
    <div className="flex min-h-screen">
      <aside
        className="w-64 p-6 text-white"
        style={{ backgroundColor: colors.sidebar }}
      >
        <h2 className="text-xl font-bold mb-6">Sistema de Catalogación</h2>
        {isTenantRelatedPage ? (
          <nav>
            <ul>
              <li className="mb-4">
                <span className="text-lg font-semibold">Instituciones</span>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => navigate("/tenants")}
                  className={`w-full text-left py-2 px-4 rounded-lg transition-colors ${
                    isActiveRoute("/tenants") || isActiveRoute("/") ? "bg-blue-800" : "hover:bg-blue-700"
                  }`}
                >
                  Lista de Instituciones
                </button>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => navigate("/createTenant")}
                  className={`w-full text-left py-2 px-4 rounded-lg transition-colors ${
                    isActiveRoute("/createTenant") ? "bg-blue-800" : "hover:bg-blue-700"
                  }`}
                >
                  Crear Nueva Institución
                </button>
              </li>
            </ul>
          </nav>
        ) : (
          <nav>
            <ul>
              <li className="mb-4">
                <span className="text-lg font-semibold">Archivos Administrativos</span>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => navigate("/list")}
                  className={`w-full text-left py-2 px-4 rounded-lg transition-colors ${
                    isActiveRoute("/list") ? "bg-blue-800" : "hover:bg-blue-700"
                  }`}
                >
                  Lista de Archivos
                </button>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => navigate("/createAdministrativeFile")}
                  className={`w-full text-left py-2 px-4 rounded-lg transition-colors ${
                    isActiveRoute("/createAdministrativeFile") ? "bg-blue-800" : "hover:bg-blue-700"
                  }`}
                >
                  Crear Nuevo Archivo
                </button>
              </li>
              <li className="mt-6">
                <button
                  onClick={handleBackToTenants}
                  className="w-full text-left py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Volver a Instituciones
                </button>
              </li>
            </ul>
          </nav>
        )}
      </aside>

      <main className="flex-1 p-6" style={{ backgroundColor: colors.background }}>
        <h4 className="text-2xl font-bold mb-4" style={{ color: colors.textPrimary }}>
          {title}
        </h4>
        {children}
      </main>
    </div>
  );
}