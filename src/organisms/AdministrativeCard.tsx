// src/organisms/AdministrativeCard.tsx
import { IAdministrativeFile } from "../Interfaces/IAdministrativeFile";
import { colors } from "../styles/colors";

interface AdministrativeCardProps {
  file: IAdministrativeFile;
}

export function AdministrativeCard({ file }: AdministrativeCardProps) {
  const formatDate = (date?: Date | null) => {
    if (!date) return "No especificada";
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3">
        <div>
          <p className="text-sm font-semibold" style={{ color: colors.textSecondary }}>
            Institución
          </p>
          <p style={{ color: colors.textPrimary }}>
            {file.TipoInstitucion || "No especificada"}
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: colors.textSecondary }}>
            Unidad
          </p>
          <p style={{ color: colors.textPrimary }}>
            {file.Unidad || "No especificada"}
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: colors.textSecondary }}>
            Expediente
          </p>
          <p style={{ color: colors.textPrimary }}>{file.Expediente}</p>
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: colors.textSecondary }}>
            Serie
          </p>
          <p style={{ color: colors.textPrimary }}>
            {file.Serie || "No especificada"}
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: colors.textSecondary }}>
            Tipo de Documento Origen
          </p>
          <p style={{ color: colors.textPrimary }}>
            {file.TipoDocumentoOrigen || "No especificado"}
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: colors.textSecondary }}>
            Fecha Inicial
          </p>
          <p style={{ color: colors.textPrimary }}>{formatDate(file.FechaInicial)}</p>
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: colors.textSecondary }}>
            Fecha Final
          </p>
          <p style={{ color: colors.textPrimary }}>{formatDate(file.FechaFinal)}</p>
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: colors.textSecondary }}>
            Expediente Anterior
          </p>
          <p style={{ color: colors.textPrimary }}>
            {file.ExpedienteAnterior || "No especificado"}
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: colors.textSecondary }}>
            Asunto
          </p>
          <p style={{ color: colors.textPrimary }}>
            {file.Asunto || "No especificado"}
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: colors.textSecondary }}>
            Petición de Transferencia
          </p>
          <p style={{ color: colors.textPrimary }}>
            {file.PeticionTransferencia ? "Sí" : "No"}
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: colors.textSecondary }}>
            Historial
          </p>
          <p style={{ color: colors.textPrimary }}>
            {file.Historial || "No especificado"}
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: colors.textSecondary }}>
            Archivo Documental
          </p>
          <p style={{ color: colors.textPrimary }}>
            {file.ArchivoDocumental || "No especificado"}
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: colors.textSecondary }}>
            Observaciones
          </p>
          <p style={{ color: colors.textPrimary }}>
            {file.Observaciones || "No especificadas"}
          </p>
        </div>
      </div>
    </div>
  );
}