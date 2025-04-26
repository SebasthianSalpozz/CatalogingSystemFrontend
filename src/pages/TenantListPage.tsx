/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTenants, setTenantHeader } from "../services/api";
import { ITenant } from "../Interfaces/ITenant";
import { Button } from "../atoms/Button";
import { AdministrativeTemplate } from "../templates/AdministrativeTemplate";
import { colors } from "../styles/colors";

export function TenantListPage() {
  const [tenants, setTenants] = useState<ITenant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchTenants = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTenants();
      setTenants(data);
    } catch (err) {
      setError("No se pudieron cargar las instituciones.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleTenantSelect = (tenantId: string) => {
    setTenantHeader(tenantId);
    navigate("/list");
  };

  return (
    <AdministrativeTemplate title="Lista de Instituciones">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold" style={{ color: colors.textPrimary }}>
          Mis Instituciones ({tenants.length})
        </h2>
        <Button
          onClick={() => navigate("/createTenant")}
          variant="primary"
          className="flex items-center space-x-2"
        >
          <span>+ Nueva Institución</span>
        </Button>
      </div>
      {loading ? (
        <p className="text-center" style={{ color: colors.textPrimary }}>
          Cargando instituciones...
        </p>
      ) : error ? (
        <div className="text-red-500 mb-4">{error}</div>
      ) : tenants.length === 0 ? (
        <p className="text-center" style={{ color: colors.textSecondary }}>
          No hay instituciones registradas. Crea una para comenzar.
        </p>
      ) : (
        <div className="space-y-4">
          {tenants.map((tenant) => (
            <div
              key={tenant.id}
              className="flex items-center justify-between p-4 rounded-lg shadow-sm"
              style={{
                backgroundColor: colors.white,
                border: `1px solid ${colors.border}`,
              }}
            >
              <div className="flex items-center space-x-4">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: colors.success }}
                />
                <div>
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: colors.textPrimary }}
                  >
                    {tenant.name}
                  </h3>
                  <p style={{ color: colors.textSecondary }}>
                    ISIL: {tenant.isil}
                  </p>
                  <p style={{ color: colors.textSecondary }}>
                    {tenant.description}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => handleTenantSelect(tenant.id)}
                variant="info"
                className="flex items-center space-x-2"
              >
                <span>Seleccionar</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Button>
            </div>
          ))}
        </div>
      )}
    </AdministrativeTemplate>
  );
}