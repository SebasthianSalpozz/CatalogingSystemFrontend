/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent } from "react";
import { IIdentification } from "../Interfaces/IIdentification";
import { FormField } from "../molecules/FormField";
import { Tab } from "../molecules/Tab";
import { Button } from "../atoms/Button";
import { colors } from "../styles/colors";

interface IdentificationFormProps {
  identification: IIdentification;
  onChange: (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
    nestedField?: keyof IIdentification,
    subField?: string
  ) => void;
  onSave: () => void;
  onCancel: () => void;
  errors: Record<string, any>;
  isEdit?: boolean;
  expediente: number;
}

export function IdentificationForm({
  identification,
  onChange,
  onSave,
  onCancel,
  errors,
  isEdit,
  expediente,
}: IdentificationFormProps) {
  // --- Definición de las pestañas ---
  const tabs = [
    // --- Pestaña: Información General ---
    {
      label: "Información General",
      content: (
        <div className="space-y-4">
          <FormField
            label="Número de Expediente Asociado"
            name="expedienteDisplay"
            type="number"
            value={expediente}
            onChange={() => {}}
            disabled={true}
          />
          <FormField
            label="Inventario"
            name="inventory"
            type="number"
            value={identification.inventory}
            onChange={onChange}
            error={errors.inventory}
          />
          <FormField
            label="Número de Objetos"
            name="numberOfObjects"
            type="number"
            value={identification.numberOfObjects}
            onChange={onChange}
            error={errors.numberOfObjects}
          />
          <FormField
            label="Clasificación Genérica"
            name="genericClassification"
            type="text"
            value={identification.genericClassification}
            onChange={onChange}
            error={errors.genericClassification}
          />
          <FormField
            label="Nombre del Objeto/Grupo"
            name="objectName"
            type="text"
            value={identification.objectName}
            onChange={onChange}
            error={errors.objectName}
          />
        </div>
      ),
    },
    // --- Pestaña: Sección ---
    {
      label: "Sección",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Sala N°"
            name="Room"
            type="text"
            value={identification.section.Room}
            onChange={(e) => onChange(e, "section", "Room")}
            error={errors.section?.Room}
          />
          <FormField
            label="Panel N°"
            name="Panel"
            type="text"
            value={identification.section.Panel || ""}
            onChange={(e) => onChange(e, "section", "Panel")}
            error={errors.section?.Panel}
          />
          <FormField
            label="Vitrina N°"
            name="DisplayCase"
            type="text"
            value={identification.section.DisplayCase || ""}
            onChange={(e) => onChange(e, "section", "DisplayCase")}
            error={errors.section?.DisplayCase}
          />
          <FormField
            label="Caballete N°"
            name="Easel"
            type="text"
            value={identification.section.Easel || ""}
            onChange={(e) => onChange(e, "section", "Easel")}
            error={errors.section?.Easel}
          />
          <FormField
            label="Depósito N°"
            name="Storage"
            type="text"
            value={identification.section.Storage || ""}
            onChange={(e) => onChange(e, "section", "Storage")}
            error={errors.section?.Storage}
          />
          <FormField
            label="Patio N°"
            name="Courtyard"
            type="text"
            value={identification.section.Courtyard || ""}
            onChange={(e) => onChange(e, "section", "Courtyard")}
            error={errors.section?.Courtyard}
          />
          <FormField
            label="Pilar N°"
            name="Pillar"
            type="text"
            value={identification.section.Pillar || ""}
            onChange={(e) => onChange(e, "section", "Pillar")}
            error={errors.section?.Pillar}
          />
          <FormField
            label="Otros (Sección)"
            name="Others"
            type="text"
            value={identification.section.Others || ""}
            onChange={(e) => onChange(e, "section", "Others")}
            error={errors.section?.Others}
          />
        </div>
      ),
    },
    // --- Pestaña: Tipología ---
    {
      label: "Tipología",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Tipo (*)"
            name="Type"
            type="text"
            value={identification.typology.Type}
            onChange={(e) => onChange(e, "typology", "Type")}
            error={errors.typology?.Type}
          />
          <FormField
            label="Subtipo"
            name="Subtype"
            type="text"
            value={identification.typology.Subtype || ""}
            onChange={(e) => onChange(e, "typology", "Subtype")}
            error={errors.typology?.Subtype}
          />
          <FormField
            label="Clase"
            name="Class"
            type="text"
            value={identification.typology.Class || ""}
            onChange={(e) => onChange(e, "typology", "Class")}
            error={errors.typology?.Class}
          />
          <FormField
            label="Subclase"
            name="Subclass"
            type="text"
            value={identification.typology.Subclass || ""}
            onChange={(e) => onChange(e, "typology", "Subclass")}
            error={errors.typology?.Subclass}
          />
          <FormField
            label="Orden"
            name="Order"
            type="text"
            value={identification.typology.Order || ""}
            onChange={(e) => onChange(e, "typology", "Order")}
            error={errors.typology?.Order}
          />
          <FormField
            label="Suborden"
            name="Suborder"
            type="text"
            value={identification.typology.Suborder || ""}
            onChange={(e) => onChange(e, "typology", "Suborder")}
            error={errors.typology?.Suborder}
          />
        </div>
      ),
    },
    // --- Pestaña: Nombre Específico ---
    {
      label: "Nombre Específico",
      content: (
        <div className="space-y-4">
          <FormField
            label="Nombre Genérico (*)"
            name="GenericName"
            type="text"
            value={identification.specificName.GenericName}
            onChange={(e) => onChange(e, "specificName", "GenericName")}
            error={errors.specificName?.GenericName}
          />
          <FormField
            label="Términos Relacionados"
            name="RelatedTerms"
            type="textarea"
            value={identification.specificName.RelatedTerms || ""}
            onChange={(e) => onChange(e, "specificName", "RelatedTerms")}
            error={errors.specificName?.RelatedTerms}
          />
          <FormField
            label="Términos Específicos"
            name="SpecificTerms"
            type="textarea"
            value={identification.specificName.SpecificTerms || ""}
            onChange={(e) => onChange(e, "specificName", "SpecificTerms")}
            error={errors.specificName?.SpecificTerms}
          />
          <FormField
            label="Usado Por"
            name="UsedBy"
            type="text"
            value={identification.specificName.UsedBy || ""}
            onChange={(e) => onChange(e, "specificName", "UsedBy")}
            error={errors.specificName?.UsedBy}
          />
          <FormField
            label="Notas (Nombre Específico)"
            name="Notes"
            type="textarea"
            value={identification.specificName.Notes || ""}
            onChange={(e) => onChange(e, "specificName", "Notes")}
            error={errors.specificName?.Notes}
          />
        </div>
      ),
    },
    // --- Pestaña: Autor ---
    {
      label: "Autor",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Nombre (*)"
            name="Name"
            type="text"
            value={identification.author.Name}
            onChange={(e) => onChange(e, "author", "Name")}
            error={errors.author?.Name}
          />
          <FormField
            label="Lugar de Nacimiento (*)"
            name="BirthPlace"
            type="text"
            value={identification.author.BirthPlace}
            onChange={(e) => onChange(e, "author", "BirthPlace")}
            error={errors.author?.BirthPlace}
          />
          <FormField
            label="Fecha de Nacimiento (*)"
            name="BirthDate"
            type="date"
            value={identification.author.BirthDate}
            onChange={(e) => onChange(e, "author", "BirthDate")}
            error={errors.author?.BirthDate}
          />
          <FormField
            label="Lugar de Defunción"
            name="DeathPlace"
            type="text"
            value={identification.author.DeathPlace || ""}
            onChange={(e) => onChange(e, "author", "DeathPlace")}
            error={errors.author?.DeathPlace}
          />
          <FormField
            label="Fecha de Defunción"
            name="DeathDate"
            type="date"
            value={identification.author.DeathDate || ""}
            onChange={(e) => onChange(e, "author", "DeathDate")}
            error={errors.author?.DeathDate}
          />
        </div>
      ),
    },
    // --- Pestaña: Título ---
    {
      label: "Título",
      content: (
        <div className="space-y-4">
          <FormField
            label="Título (*)"
            name="Name"
            type="text"
            value={identification.title.Name}
            onChange={(e) => onChange(e, "title", "Name")}
            error={errors.title?.Name}
          />
          <FormField
            label="Atribución"
            name="Attribution"
            type="text"
            value={identification.title.Attribution || ""}
            onChange={(e) => onChange(e, "title", "Attribution")}
            error={errors.title?.Attribution}
          />
          <FormField
            label="Traducción"
            name="Translation"
            type="text"
            value={identification.title.Translation || ""}
            onChange={(e) => onChange(e, "title", "Translation")}
            error={errors.title?.Translation}
          />
        </div>
      ),
    },
    // --- Pestaña: Materia ---
    {
      label: "Materia",
      content: (
        <div className="space-y-4">
          <FormField
            label="Materia (*)"
            name="MaterialName"
            type="text"
            value={identification.material.MaterialName}
            onChange={(e) => onChange(e, "material", "MaterialName")}
            error={errors.material?.MaterialName}
          />
          <FormField
            label="Parte Descrita (Materia)"
            name="DescribedPart"
            type="text"
            value={identification.material.DescribedPart || ""}
            onChange={(e) => onChange(e, "material", "DescribedPart")}
            error={errors.material?.DescribedPart}
          />
          <FormField
            label="Colores"
            name="Colors"
            type="text"
            value={identification.material.Colors || ""}
            onChange={(e) => onChange(e, "material", "Colors")}
            error={errors.material?.Colors}
          />
        </div>
      ),
    },
    // --- Pestaña: Técnica ---
    {
      label: "Técnica",
      content: (
        <div className="space-y-4">
          <FormField
            label="Técnica (*)"
            name="TechniqueName"
            type="text"
            value={identification.techniques.TechniqueName}
            onChange={(e) => onChange(e, "techniques", "TechniqueName")}
            error={errors.techniques?.TechniqueName}
          />
          <FormField
            label="Parte Descrita (Técnica)"
            name="DescribedPart"
            type="text"
            value={identification.techniques.DescribedPart || ""}
            onChange={(e) => onChange(e, "techniques", "DescribedPart")}
            error={errors.techniques?.DescribedPart}
          />
        </div>
      ),
    },
    // --- Pestaña: Observaciones ---
    {
      label: "Observaciones",
      content: (
        <FormField
          label="Observaciones Generales"
          name="observations"
          type="textarea"
          value={identification.observations}
          onChange={onChange}
          error={errors.observations}
        />
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
          {isEdit ? "Guardar Cambios Identificación" : "Guardar Identificación"}
        </Button>
        <Button onClick={onCancel} variant="secondary">
          {isEdit ? "Cancelar" : "Volver"}
        </Button>
      </div>
    </div>
  );
}