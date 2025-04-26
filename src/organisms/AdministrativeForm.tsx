// src/organisms/AdministrativeForm.tsx
import { ChangeEvent } from "react";
import { IAdministrativeFile } from "../Interfaces/IAdministrativeFile";
import { FormField } from "../molecules/FormField";
import { Tab } from "../molecules/Tab";
import { Button } from "../atoms/Button";
import { TipoInstitucion, TipoDocumentoOrigen } from "../constants/enums";
import { colors } from "../styles/colors";

interface AdministrativeFormProps {
  administrativeFile: IAdministrativeFile;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onSave: () => void;
  onCancel: () => void;
  errors: Record<string, string>;
  isEdit?: boolean;
}

export function AdministrativeForm({
  administrativeFile,
  onChange,
  onSave,
  onCancel,
  errors,
  isEdit,
}: AdministrativeFormProps) {
  const tabs = [
    {
      label: "Información Básica",
      content: (
        <div className="space-y-4">
          <FormField
            label="Institución"
            name="TipoInstitucion"
            type="select"
            value={administrativeFile.TipoInstitucion}
            onChange={onChange}
            options={Object.values(TipoInstitucion)}
            error={errors.TipoInstitucion}
          />
          <FormField
            label="Unidad"
            name="Unidad"
            type="text"
            value={administrativeFile.Unidad}
            onChange={onChange}
            error={errors.Unidad}
          />
          <FormField
            label="Expediente"
            name="Expediente"
            type="number"
            value={administrativeFile.Expediente}
            onChange={onChange}
            disabled={isEdit}
            error={errors.Expediente}
          />
          <FormField
            label="Serie"
            name="Serie"
            type="text"
            value={administrativeFile.Serie || ""}
            onChange={onChange}
            error={errors.Serie}
          />
          <FormField
            label="Tipo de Documento Origen"
            name="TipoDocumentoOrigen"
            type="select"
            value={administrativeFile.TipoDocumentoOrigen}
            onChange={onChange}
            options={Object.values(TipoDocumentoOrigen)}
            error={errors.TipoDocumentoOrigen}
          />
        </div>
      ),
    },
    {
      label: "Fechas",
      content: (
        <div className="space-y-4">
          <FormField
            label="Fecha Inicial"
            name="FechaInicial"
            type="date"
            value={administrativeFile.FechaInicial.toISOString().split("T")[0]}
            onChange={onChange}
            error={errors.FechaInicial}
          />
          <FormField
            label="Fecha Final"
            name="FechaFinal"
            type="date"
            value={
              administrativeFile.FechaFinal
                ? administrativeFile.FechaFinal.toISOString().split("T")[0]
                : ""
            }
            onChange={onChange}
            error={errors.FechaFinal}
          />
        </div>
      ),
    },
    {
      label: "Detalles Adicionales",
      content: (
        <div className="space-y-4">
          <FormField
            label="Expediente Anterior"
            name="ExpedienteAnterior"
            type="text"
            value={administrativeFile.ExpedienteAnterior || ""}
            onChange={onChange}
            error={errors.ExpedienteAnterior}
          />
          <FormField
            label="Asunto"
            name="Asunto"
            type="text"
            value={administrativeFile.Asunto || ""}
            onChange={onChange}
            error={errors.Asunto}
          />
          <FormField
            label="Petición de Transferencia"
            name="PeticionTransferencia"
            type="select"
            value={administrativeFile.PeticionTransferencia ? "true" : "false"}
            onChange={onChange}
            options={["false", "true"]}
            error={errors.PeticionTransferencia}
          />
          <FormField
            label="Historial"
            name="Historial"
            type="textarea"
            value={administrativeFile.Historial || ""}
            onChange={onChange}
            error={errors.Historial}
          />
          <FormField
            label="Archivo Documental"
            name="ArchivoDocumental"
            type="text"
            value={administrativeFile.ArchivoDocumental || ""}
            onChange={onChange}
            error={errors.ArchivoDocumental}
          />
          <FormField
            label="Observaciones"
            name="Observaciones"
            type="textarea"
            value={administrativeFile.Observaciones || ""}
            onChange={onChange}
            error={errors.Observaciones}
          />
        </div>
      ),
    },
  ];

  return (
    <div
      className="p-6 rounded-lg shadow-sm"
      style={{ backgroundColor: colors.white }}
    >
      <Tab tabs={tabs} />
      <div className="flex justify-end space-x-4 mt-6">
        <Button onClick={onSave} variant="primary">
          {isEdit ? "Guardar Cambios" : "Guardar"}
        </Button>
        <Button onClick={onCancel} variant="secondary">
          Volver
        </Button>
      </div>
    </div>
  );
}