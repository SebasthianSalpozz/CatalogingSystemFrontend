/* eslint-disable @typescript-eslint/no-unused-vars */
// src/pages/ListPage.tsx
import { useState, useEffect, ChangeEvent } from "react";
import Swal from "sweetalert2";
import { api } from "../services/api";
import { IAdministrativeFile } from "../Interfaces/IAdministrativeFile";
import { TipoInstitucion, TipoDocumentoOrigen } from "../constants/enums";
import { AdministrativeTable } from "../organisms/AdministrativeTable";
import { AdministrativeCard } from "../organisms/AdministrativeCard";
import { AdministrativeTemplate } from "../templates/AdministrativeTemplate";
import { Button } from "../atoms/Button";
import { useNavigate } from "react-router-dom";
import { colors } from "../styles/colors";
import axios from "axios";

interface ArchivoAdministrativoResponse {
  id?: number;
  institucion: TipoInstitucion;
  unidad: string;
  expediente: number;
  fechaInicial: string;
  documentoOrigen: TipoDocumentoOrigen;
  peticionTransferencia?: boolean;
  serie?: string;
  fechaFinal?: string | null;
  expedienteAnterior?: string;
  asunto?: string;
  historial?: string;
  archivoDocumental?: string;
  observaciones?: string;
}

export function ListPage() {
  const [archivos, setArchivos] = useState<IAdministrativeFile[]>([]);
  const [filteredArchivos, setFilteredArchivos] = useState<IAdministrativeFile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchExpediente, setSearchExpediente] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<IAdministrativeFile | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
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

  const obtenerArchivos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("ArchivoAdministrativo");
      if (response.status === 200) {
        const mappedArchivos = mapResponseToAdministrativeFile(response.data);
        setArchivos(mappedArchivos);
        setFilteredArchivos(mappedArchivos);
      }
    } catch (error) {
      setError("No se pudieron cargar los archivos administrativos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const tenantId = api.defaults.headers.common["tenant"] as string;
    if (!tenantId) {
      navigate("/tenants");
      return;
    }
    setCurrentTenant(tenantId ? tenantId.replace("tenant_", "") : "Desconocido");
    obtenerArchivos();
  }, [navigate]);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchExpediente(value);
    if (value.trim() === "") {
      setFilteredArchivos(archivos);
    } else {
      const filtered = archivos.filter((item) =>
        item.Expediente.toString().includes(value)
      );
      setFilteredArchivos(filtered);
    }
  };

  const eliminar = (expediente: number, peticionTransferencia?: boolean) => {
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
          const response = await api.delete(`ArchivoAdministrativo/${expediente}`);
          if (response.status === 200 || response.status === 204) {
            await obtenerArchivos();
          }
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.data?.message) {
            setError(error.response.data.message);
          } else {
            setError("No se pudo eliminar el archivo administrativo.");
          }
        }
      }
    });
  };

  const verDetalles = async (expediente: number) => {
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
      setModalOpen(true);
    } catch (error) {
      setError("No se pudo cargar los detalles del archivo administrativo.");
    }
  };

  const toggleModal = () => setModalOpen(!modalOpen);

  const handleCreateNewFile = () => {
    navigate("/createAdministrativeFile");
  };

  return (
    <AdministrativeTemplate title={`Archivos Administrativos - ${currentTenant}`}>
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
      {loading ? (
        <p className="text-center" style={{ color: colors.textPrimary }}>
          Cargando archivos administrativos...
        </p>
      ) : error ? (
        <div className="text-red-500 mb-4">{error}</div>
      ) : (
        <AdministrativeTable
          archivos={filteredArchivos}
          searchExpediente={searchExpediente}
          onSearch={handleSearch}
          onDelete={eliminar}
          onViewDetails={verDetalles}
          onCreateNewFile={handleCreateNewFile}
        />
      )}
      {selectedFile && (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${modalOpen ? "block" : "hidden"}`}>
          <div
            className="p-8 rounded-lg shadow-lg max-w-lg w-full"
            style={{ backgroundColor: colors.white }}
          >
            <h5
              className="text-xl font-semibold mb-6"
              style={{ color: colors.textPrimary }}
            >
              Detalles del Archivo Administrativo
            </h5>
            <AdministrativeCard file={selectedFile} />
            <div className="mt-6 flex justify-end">
              <Button
                onClick={toggleModal}
                variant="secondary"
                className="flex items-center space-x-2"
              >
                <span>Cerrar</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdministrativeTemplate>
  );
}