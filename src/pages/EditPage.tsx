/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";
import { IAdministrativeFile } from "../Interfaces/IAdministrativeFile";
import { TipoInstitucion, TipoDocumentoOrigen } from "../constants/enums";
import { AdministrativeForm } from "../organisms/AdministrativeForm";
import { AdministrativeTemplate } from "../templates/AdministrativeTemplate";
import axios from "axios";

export function EditPage() {
  const [administrativeFile, setAdministrativeFile] = useState<IAdministrativeFile>({
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
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [currentTenant, setCurrentTenant] = useState<string | null>(null);
  const navigate = useNavigate();
  const { expediente } = useParams<{ expediente: string }>();

  useEffect(() => {
    const tenantId = api.defaults.headers.common["tenant"] as string;
    if (!tenantId) {
      setErrors((prev) => ({ ...prev, general: "Por favor selecciona una institución primero." }));
      setTimeout(() => navigate("/tenants"), 1500);
      return;
    }
    setCurrentTenant(tenantId.replace("tenant_", ""));

    const fetchAdministrativeFile = async () => {
      try {
        const response = await api.get(`ArchivoAdministrativo/${expediente}`);
        const data = response.data;
        setAdministrativeFile({
          TipoInstitucion: data.institucion,
          Unidad: data.unidad,
          Expediente: data.expediente,
          Serie: data.serie || "",
          TipoDocumentoOrigen: data.documentoOrigen,
          FechaInicial: new Date(data.fechaInicial),
          FechaFinal: data.fechaFinal ? new Date(data.fechaFinal) : null,
          ExpedienteAnterior: data.expedienteAnterior || "",
          Asunto: data.asunto || "",
          PeticionTransferencia: data.peticionTransferencia || false,
          Historial: data.historial || "",
          ArchivoDocumental: data.archivoDocumental || "",
          Observaciones: data.observaciones || "",
        });
      } catch (error) {
        setErrors((prev) => ({ ...prev, general: "No se pudo cargar el archivo administrativo." }));
        navigate("/list");
      } finally {
        setLoading(false);
      }
    };
    fetchAdministrativeFile();
  }, [expediente, navigate]);

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
      await api.put(`ArchivoAdministrativo/${expediente}`, formattedData);
      navigate("/list");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        setErrors((prev) => ({ ...prev, general: error.response?.data?.message || "No se pudo actualizar el archivo administrativo." }));
      } else {
        setErrors((prev) => ({ ...prev, general: "No se pudo actualizar el archivo administrativo." }));
      }
    }
  };

  if (loading) {
    return <p className="text-center">Cargando archivo administrativo...</p>;
  }

  return (
    <AdministrativeTemplate title={`Editar Archivo Administrativo - ${currentTenant || "No se seleccionó ninguna institución"}`}>
      {errors.general && <p className="text-red-500 mb-4">{errors.general}</p>}
      <AdministrativeForm
        administrativeFile={administrativeFile}
        onChange={inputChangeValue}
        onSave={save}
        onCancel={() => navigate("/list")}
        errors={errors}
        isEdit
      />
    </AdministrativeTemplate>
  );
}