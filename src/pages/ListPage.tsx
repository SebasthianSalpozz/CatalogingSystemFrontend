/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, ChangeEvent } from "react";
import Swal from "sweetalert2";
import { api, getIdentifications, deleteIdentification } from "../services/api";
import { IAdministrativeFile } from "../Interfaces/IAdministrativeFile";
import { IIdentification } from "../Interfaces/IIdentification";
import { TipoInstitucion, TipoDocumentoOrigen } from "../constants/enums";
import { AdministrativeTable } from "../organisms/AdministrativeTable";
import { IdentificationTable } from "../organisms/IdentificationTable";
import { AdministrativeCard } from "../organisms/AdministrativeCard";
import { IdentificationCard } from "../organisms/IdentificationCard";
import { AdministrativeTemplate } from "../templates/AdministrativeTemplate";
import { Button } from "../atoms/Button";
import { Tab } from "../molecules/Tab";
import { useNavigate } from "react-router-dom";
import { colors } from "../styles/colors";
import axios from "axios";
import { mapBackendToFrontend } from "../utils/mapData";

interface ArchivoAdministrativoResponse {
  institucion: TipoInstitucion;
  unidad: string;
  expediente: number;
  serie: string;
  documentoOrigen: TipoDocumentoOrigen;
  fechaInicial: string;
  fechaFinal?: string;
  expedienteAnterior?: string;
  asunto?: string;
  peticionTransferencia?: boolean;
  historial?: string;
  archivoDocumental?: string;
  observaciones?: string;
}

export function ListPage() {
  const [archivos, setArchivos] = useState<IAdministrativeFile[]>([]);
  const [filteredArchivos, setFilteredArchivos] = useState<IAdministrativeFile[]>([]);
  const [identificaciones, setIdentificaciones] = useState<IIdentification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchExpedienteAdmin, setSearchExpedienteAdmin] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<IAdministrativeFile | null>(null);
  const [selectedIdentification, setSelectedIdentification] = useState<IIdentification | null>(null);
  const [adminModalOpen, setAdminModalOpen] = useState<boolean>(false);
  const [idModalOpen, setIdModalOpen] = useState<boolean>(false);
  const [currentTenant, setCurrentTenant] = useState<string | null>(null);
  const navigate = useNavigate();

  const mapResponseToAdministrativeFile = (response: ArchivoAdministrativoResponse[]): IAdministrativeFile[] => {
    return response.map((item) => ({
      TipoInstitucion: item.institucion,
      Unidad: item.unidad,
      Expediente: item.expediente,
      Serie: item.serie || "",
      TipoDocumentoOrigen: item.documentoOrigen,
      FechaInicial: new Date(item.fechaInicial),
      FechaFinal: item.fechaFinal ? new Date(item.fechaFinal) : null,
      ExpedienteAnterior: item.expedienteAnterior || "",
      Asunto: item.asunto || "",
      PeticionTransferencia: item.peticionTransferencia || false,
      Historial: item.historial || "",
      ArchivoDocumental: item.archivoDocumental || "",
      Observaciones: item.observaciones || "",
    }));
  };

  const obtenerDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      const tenantId = api.defaults.headers.common["tenant"] as string;
      if (!tenantId) {
        navigate("/tenants");
        return;
      }
      setCurrentTenant(tenantId.replace("tenant_", ""));

      const [archivosResponse, identificacionesResponse] = await Promise.all([
        api.get("ArchivoAdministrativo"),
        getIdentifications(),
      ]);

      if (archivosResponse.status === 200) {
        const mappedArchivos = mapResponseToAdministrativeFile(archivosResponse.data);
        setArchivos(mappedArchivos);
        setFilteredArchivos(mappedArchivos);
      } else {
        setError(prev => (prev ? prev + "\n" : "") + "Error al cargar archivos administrativos.");
      }

      if (identificacionesResponse) {
        const dataIdentificaciones = Array.isArray(identificacionesResponse) ? identificacionesResponse : identificacionesResponse.data;
        // Mapear los datos de identificaciones al formato esperado por IIdentification
        const mappedIdentificaciones = dataIdentificaciones.map((item: any) => mapBackendToFrontend(item));
        setIdentificaciones(mappedIdentificaciones);
      } else {
        setError(prev => (prev ? prev + "\n" : "") + "Error al cargar identificaciones.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      let adminError = "No se pudieron cargar los archivos administrativos.";
      let idError = "No se pudieron cargar las identificaciones.";
      if (axios.isAxiosError(error)) {
        setError(`${adminError}\n${idError}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerDatos();
  }, [navigate]);

  const handleSearchAdmin = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchExpedienteAdmin(value);
    if (value.trim() === "") {
      setFilteredArchivos(archivos);
    } else {
      const filtered = archivos.filter((item) =>
        item.Expediente.toString().includes(value)
      );
      setFilteredArchivos(filtered);
    }
  };

  const eliminarAdmin = (expediente: number, peticionTransferencia?: boolean) => {
    if (peticionTransferencia === true) {
      Swal.fire({
        title: "Error",
        text: "No se puede eliminar un archivo con Petición de Transferencia activa.",
        icon: "error",
      });
      return;
    }
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Eliminar archivo administrativo!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: colors.primary,
      cancelButtonColor: colors.danger,
      confirmButtonText: "Sí, eliminar!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          try {
            await api.get(`Identification/${expediente}`);
            Swal.fire({
              title: "Error",
              text: "No se puede eliminar el archivo administrativo porque tiene una identificación asociada. Elimine primero la identificación.",
              icon: "error",
            });
            return;
          } catch (idError) {
            if (!(axios.isAxiosError(idError) && idError.response?.status === 404)) {
              throw new Error("Error al verificar la identificación asociada.");
            }
            const response = await api.delete(`ArchivoAdministrativo/${expediente}`);
            if (response.status === 200 || response.status === 204) {
              await obtenerDatos();
              Swal.fire("¡Eliminado!", "El archivo administrativo ha sido eliminado.", "success");
            } else {
              throw new Error(`Error inesperado al eliminar: ${response.status}`);
            }
          }
        } catch (error) {
          let message = "No se pudo eliminar el archivo administrativo.";
          if (axios.isAxiosError(error) && error.response?.data?.message) {
            message = error.response.data.message;
          } else if (error instanceof Error) {
            message = error.message;
          }
          setError(message);
          Swal.fire("Error", message, "error");
        }
      }
    });
  };

  const verDetallesAdmin = async (expediente: number) => {
    try {
      const response = await api.get(`ArchivoAdministrativo/${expediente}`);
      const data = response.data;
      setSelectedFile({
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
      setAdminModalOpen(true);
    } catch (error) {
      setError("No se pudo cargar los detalles del archivo administrativo.");
    }
  };

  const toggleAdminModal = () => setAdminModalOpen(!adminModalOpen);

  const handleCreateNewFile = () => {
    navigate("/createAdministrativeFile");
  };

  const eliminarIdentificacion = (expediente: number) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Eliminar registro de identificación!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: colors.primary,
      cancelButtonColor: colors.danger,
      confirmButtonText: "Sí, eliminar!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const status = await deleteIdentification(expediente);
          if (status === 200 || status === 204) {
            await obtenerDatos();
            Swal.fire("¡Eliminado!", "El registro de identificación ha sido eliminado.", "success");
          } else {
            throw new Error(`Error inesperado al eliminar: ${status}`);
          }
        } catch (error) {
          let message = "No se pudo eliminar la identificación.";
          if (axios.isAxiosError(error) && error.response?.data?.message) {
            message = error.response.data.message;
          } else if (error instanceof Error) {
            message = error.message;
          }
          setError(message);
          Swal.fire("Error", message, "error");
        }
      }
    });
  };

  const verDetallesIdentificacion = async (expediente: number) => {
    try {
      const response = await api.get(`/Identification/${expediente}`);
      const identificationData = response.data ? response.data : response;
      // Mapear los datos al formato esperado por IIdentification
      const mappedData = mapBackendToFrontend(identificationData);
      setSelectedIdentification(mappedData);
      setIdModalOpen(true);
    } catch (error) {
      console.error("Error fetching identification details:", error);
      setError("No se pudo cargar los detalles de la identificación.");
      Swal.fire("Error", "No se pudo cargar los detalles de la identificación.", "error");
    }
  };

  const editarIdentificacion = (expediente: number) => {
    navigate(`/editIdentification/${expediente}`);
  };

  const toggleIdModal = () => setIdModalOpen(!idModalOpen);

  const tabs = [
    {
      label: "Archivo Administrativo",
      content: (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold" style={{ color: colors.textPrimary }}>
              Archivos Administrativos ({filteredArchivos.length})
            </h2>
            <Button
              onClick={handleCreateNewFile}
              variant="primary"
              className="flex items-center space-x-2"
            >
              <span>+ Crear Nuevo Archivo</span>
            </Button>
          </div>
          {loading && !archivos.length ? (
            <p className="text-center" style={{ color: colors.textPrimary }}>
              Cargando archivos administrativos...
            </p>
          ) : error && !archivos.length ? (
            <div className="text-red-500 mb-4">{error.split('\n')[0]}</div>
          ) : (
            <AdministrativeTable
              archivos={filteredArchivos}
              searchExpediente={searchExpedienteAdmin}
              onSearch={handleSearchAdmin}
              onDelete={eliminarAdmin}
              onViewDetails={verDetallesAdmin}
            />
          )}
        </div>
      ),
    },
    {
      label: "Identificación",
      content: (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold" style={{ color: colors.textPrimary }}>
              Registros de Identificación ({identificaciones.length})
            </h2>
          </div>
          {loading && !identificaciones.length ? (
            <p className="text-center" style={{ color: colors.textPrimary }}>
              Cargando identificaciones...
            </p>
          ) : error && !identificaciones.length ? (
            <div className="text-red-500 mb-4">{error.split('\n')[1] || error}</div>
          ) : (
            <IdentificationTable
              identificaciones={identificaciones}
              onDelete={eliminarIdentificacion}
              onViewDetails={verDetallesIdentificacion}
              onEdit={editarIdentificacion}
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <AdministrativeTemplate title={`Catálogo - ${currentTenant || 'Cargando...'}`}>
      {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
      <Tab tabs={tabs} />
      {selectedFile && (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${adminModalOpen ? "block" : "hidden"}`}>
          <div className="p-8 rounded-lg shadow-lg max-w-3xl w-full overflow-y-auto max-h-[90vh]" style={{ backgroundColor: colors.white }}>
            <h5 className="text-xl font-semibold mb-6" style={{ color: colors.textPrimary }}>
              Detalles del Archivo Administrativo
            </h5>
            <AdministrativeCard file={selectedFile} />
            <div className="mt-6 flex justify-end">
              <Button onClick={toggleAdminModal} variant="secondary" className="flex items-center space-x-2">
                <span>Cerrar</span>
              </Button>
            </div>
          </div>
        </div>
      )}
      {selectedIdentification && (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${idModalOpen ? "block" : "hidden"}`}>
          <div className="p-8 rounded-lg shadow-lg max-w-4xl w-full overflow-y-auto max-h-[90vh]" style={{ backgroundColor: colors.white }}>
            <h5 className="text-xl font-semibold mb-6" style={{ color: colors.textPrimary }}>
              Detalles de la Identificación (Exp: {selectedIdentification.expediente})
            </h5>
            <IdentificationCard identification={selectedIdentification} />
            <div className="mt-6 flex justify-end">
              <Button onClick={toggleIdModal} variant="secondary" className="flex items-center space-x-2">
                <span>Cerrar</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdministrativeTemplate>
  );
}