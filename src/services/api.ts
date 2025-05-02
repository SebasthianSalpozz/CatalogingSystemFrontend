/* eslint-disable @typescript-eslint/no-explicit-any */
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

// Obtener todas las identificaciones
export const getIdentifications = async () => {
  const response = await api.get("/Identification");
  return response.data; // Array de IdentificationDto
};

// Obtener una identificación por expediente
export const getIdentification = async (expediente: number) => {
  const response = await api.get(`/Identification/${expediente}`);
  return response.data; // IdentificationDto
};

// Crear una nueva identificación
export const createIdentification = async (identificationData: any) => {
  const response = await api.post("/Identification", identificationData);
  return response.data;
};

// Actualizar una identificación
export const updateIdentification = async (expediente: number, identificationData: any) => {
  const response = await api.put(`/Identification/${expediente}`, identificationData);
  return response.data;
};

// Eliminar una identificación
export const deleteIdentification = async (expediente: number) => {
  const response = await api.delete(`/Identification/${expediente}`);
  return response.status;
};
export { api };