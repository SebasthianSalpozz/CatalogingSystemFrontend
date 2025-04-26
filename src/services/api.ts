// src/services/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5258/",
  headers: {
    "Content-Type": "application/json",
  },
});

export const setTenantHeader = (tenantId: string | null) => {
  if (tenantId) {
    api.defaults.headers.common["tenant"] = tenantId;
  } else {
    delete api.defaults.headers.common["tenant"];
  }
};

export const getTenants = async () => {
  const tenantHeader = api.defaults.headers.common["tenant"];
  delete api.defaults.headers.common["tenant"]; // Remover header para esta solicitud
  try {
    const response = await api.get("/Tenants");
    return response.data;
  } finally {
    if (tenantHeader) {
      api.defaults.headers.common["tenant"] = tenantHeader;
    }
  }
};

export const createTenant = async (tenantData: { name: string; isil: string; description: string }) => {
  const tenantHeader = api.defaults.headers.common["tenant"];
  delete api.defaults.headers.common["tenant"]; // Remover header para esta solicitud
  try {
    const response = await api.post("/Tenants", tenantData);
    return response.data;
  } finally {
    if (tenantHeader) {
      api.defaults.headers.common["tenant"] = tenantHeader;
    }
  }
};

export const getAdministrativeFiles = async () => {
  const response = await api.get("ArchivoAdministrativo");
  return response.data;
};

export { api };