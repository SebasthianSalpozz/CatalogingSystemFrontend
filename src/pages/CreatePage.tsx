import { useState, useEffect, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { IAdministrativeFile } from "../Interfaces/IAdministrativeFile";
import { TipoInstitucion, TipoDocumentoOrigen } from "../constants/enums";
import { AdministrativeForm } from "../organisms/AdministrativeForm";
import { AdministrativeTemplate } from "../templates/AdministrativeTemplate";
import axios from "axios";

const initialAdministrativeFile: IAdministrativeFile = {
  TipoInstitucion: TipoInstitucion.UMRPSFXCH,
  Unidad: "",
  Expediente: 0,
  Serie: "",
  TipoDocumentoOrigen: TipoDocumentoOrigen.Compra,
  FechaInicial: new Date(),
  FechaFinal: null,
  ExpedienteAnterior: "",
  Asunto: "",
  PeticionTransferencia: false,
  Historial: "",
  ArchivoDocumental: "",
  Observaciones: "",
};

export function CreatePage() {
  const [administrativeFile, setAdministrativeFile] = useState<IAdministrativeFile>(initialAdministrativeFile);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentTenant, setCurrentTenant] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const tenantId = api.defaults.headers.common["tenant"] as string;
    if (!tenantId) {
      setErrors((prev) => ({ ...prev, general: "Por favor selecciona una institución primero." }));
      setTimeout(() => navigate("/tenants"), 1500);
      return;
    }
    setCurrentTenant(tenantId.replace("tenant_", ""));
  }, [navigate]);

  const inputChangeValue = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setAdministrativeFile((prev) => ({
      ...prev,
      [name]:
        name === "FechaInicial" || name === "FechaFinal"
          ? value ? new Date(value) : null
          : name === "PeticionTransferencia"
          ? value === "true"
          : value as keyof typeof TipoInstitucion | keyof typeof TipoDocumentoOrigen,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const save = async () => {
    const newErrors: Record<string, string> = {};
    if (!administrativeFile.TipoInstitucion) newErrors.TipoInstitucion = "La institución es obligatoria.";
    if (!administrativeFile.Unidad.trim()) newErrors.Unidad = "La unidad es obligatoria.";
    if (administrativeFile.Expediente === 0) newErrors.Expediente = "El expediente es obligatorio y debe ser mayor a 0.";
    if (!administrativeFile.TipoDocumentoOrigen) newErrors.TipoDocumentoOrigen = "El tipo de documento origen es obligatorio.";
    if (!administrativeFile.FechaInicial) newErrors.FechaInicial = "La fecha inicial es obligatoria.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await api.get(`ArchivoAdministrativo/${administrativeFile.Expediente}`);
      if (response.status === 200) {
        setErrors((prev) => ({ ...prev, Expediente: "El número de expediente ya existe." }));
        return;
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status !== 404) {
        setErrors((prev) => ({ ...prev, general: "Error al verificar el expediente. Intenta de nuevo." }));
        return;
      }
    }

    const formattedData = {
      Institucion: administrativeFile.TipoInstitucion,
      Unidad: administrativeFile.Unidad,
      Expediente: administrativeFile.Expediente,
      Serie: administrativeFile.Serie,
      DocumentoOrigen: administrativeFile.TipoDocumentoOrigen,
      FechaInicial: administrativeFile.FechaInicial.toISOString(),
      FechaFinal: administrativeFile.FechaFinal ? administrativeFile.FechaFinal.toISOString() : null,
      ExpedienteAnterior: administrativeFile.ExpedienteAnterior,
      Asunto: administrativeFile.Asunto,
      PeticionTransferencia: administrativeFile.PeticionTransferencia,
      Historial: administrativeFile.Historial,
      ArchivoDocumental: administrativeFile.ArchivoDocumental,
      Observaciones: administrativeFile.Observaciones,
    };

    try {
      await api.post("ArchivoAdministrativo", formattedData);
      const nuevoExpediente = formattedData.Expediente;
      navigate("/createIdentification", { state: { expediente: nuevoExpediente } });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        setErrors((prev) => ({ ...prev, general: error.response?.data?.message || "No se pudo guardar el archivo administrativo." }));
      } else {
        setErrors((prev) => ({ ...prev, general: "No se pudo guardar el archivo administrativo." }));
      }
    }
  };

  return (
    <AdministrativeTemplate title={`Crear Archivo Administrativo - ${currentTenant || "No se seleccionó ninguna institución"}`}>
      {errors.general && <p className="text-red-500 mb-4">{errors.general}</p>}
      <AdministrativeForm
        administrativeFile={administrativeFile}
        onChange={inputChangeValue}
        onSave={save}
        onCancel={() => navigate("/list")}
        errors={errors}
      />
    </AdministrativeTemplate>
  );
}