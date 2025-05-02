import React from "react";
import { IIdentification } from "../Interfaces/IIdentification";
import { colors } from "../styles/colors";

interface IdentificationCardProps {
  identification: IIdentification;
}

const displayOptional = (value?: string | number | null) =>
  value || value === 0 ? value : <span style={{ color: colors.textSecondary }}>N/A</span>;

const formatDate = (dateString?: string | null) =>
  dateString ? new Date(dateString).toLocaleDateString("es-ES") : <span style={{ color: colors.textSecondary }}>N/A</span>;

const DetailSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-4 p-4 border rounded" style={{ borderColor: colors.border }}>
    <h6 className="font-semibold mb-2 text-lg" style={{ color: colors.textPrimary }}>{title}</h6>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">{children}</div>
  </div>
);

const DetailItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div>
    <p className="text-sm font-medium" style={{ color: colors.textSecondary }}>{label}</p>
    <p style={{ color: colors.textPrimary }}>{value}</p>
  </div>
);

export function IdentificationCard({ identification }: IdentificationCardProps) {
  const {
    section,
    inventory,
    numberOfObjects,
    genericClassification,
    objectName,
    typology,
    specificName,
    author,
    title,
    material,
    techniques,
    observations,
    expediente,
    unit,
  } = identification;

  return (
    <div className="space-y-3">
      <DetailSection title="Información General">
        <DetailItem label="Número de Expediente" value={displayOptional(expediente)} />
        <DetailItem label="Institución/Unidad" value={displayOptional(unit)} />
        <DetailItem label="Inventario" value={displayOptional(inventory)} />
        <DetailItem label="Número de Objetos" value={displayOptional(numberOfObjects)} />
        <DetailItem label="Clasificación Genérica" value={displayOptional(genericClassification)} />
        <DetailItem label="Nombre del Objeto/Grupo" value={displayOptional(objectName)} />
      </DetailSection>
      <DetailSection title="Sección">
        <DetailItem label="Sala" value={displayOptional(section?.Room)} />
        <DetailItem label="Panel" value={displayOptional(section?.Panel)} />
        <DetailItem label="Vitrina" value={displayOptional(section?.DisplayCase)} />
        <DetailItem label="Caballete" value={displayOptional(section?.Easel)} />
        <DetailItem label="Depósito" value={displayOptional(section?.Storage)} />
        <DetailItem label="Patio" value={displayOptional(section?.Courtyard)} />
        <DetailItem label="Pilar" value={displayOptional(section?.Pillar)} />
        <DetailItem label="Otros" value={displayOptional(section?.Others)} />
      </DetailSection>
      <DetailSection title="Tipología">
        <DetailItem label="Tipo" value={displayOptional(typology?.Type)} />
        <DetailItem label="Subtipo" value={displayOptional(typology?.Subtype)} />
        <DetailItem label="Clase" value={displayOptional(typology?.Class)} />
        <DetailItem label="Subclase" value={displayOptional(typology?.Subclass)} />
        <DetailItem label="Orden" value={displayOptional(typology?.Order)} />
        <DetailItem label="Suborden" value={displayOptional(typology?.Suborder)} />
      </DetailSection>
      <DetailSection title="Nombre Específico">
        <DetailItem label="Nombre Genérico" value={displayOptional(specificName?.GenericName)} />
        <DetailItem label="Términos Relacionados" value={displayOptional(specificName?.RelatedTerms)} />
        <DetailItem label="Términos Específicos" value={displayOptional(specificName?.SpecificTerms)} />
        <DetailItem label="Usado Por" value={displayOptional(specificName?.UsedBy)} />
        <DetailItem label="Notas" value={displayOptional(specificName?.Notes)} />
      </DetailSection>
      <DetailSection title="Autor">
        <DetailItem label="Nombre" value={displayOptional(author?.Name)} />
        <DetailItem label="Lugar de Nacimiento" value={displayOptional(author?.BirthPlace)} />
        <DetailItem label="Fecha de Nacimiento" value={formatDate(author?.BirthDate)} />
        <DetailItem label="Lugar de Defunción" value={displayOptional(author?.DeathPlace)} />
        <DetailItem label="Fecha de Defunción" value={formatDate(author?.DeathDate)} />
      </DetailSection>
      <DetailSection title="Título">
        <DetailItem label="Título" value={displayOptional(title?.Name)} />
        <DetailItem label="Atribución" value={displayOptional(title?.Attribution)} />
        <DetailItem label="Traducción" value={displayOptional(title?.Translation)} />
      </DetailSection>
      <DetailSection title="Materia">
        <DetailItem label="Materia" value={displayOptional(material?.MaterialName)} />
        <DetailItem label="Parte Descrita" value={displayOptional(material?.DescribedPart)} />
        <DetailItem label="Colores" value={displayOptional(material?.Colors)} />
      </DetailSection>
      <DetailSection title="Técnica">
        <DetailItem label="Técnica" value={displayOptional(techniques?.TechniqueName)} />
        <DetailItem label="Parte Descrita" value={displayOptional(techniques?.DescribedPart)} />
      </DetailSection>
      <DetailSection title="Observaciones">
        <DetailItem label="Observaciones Generales" value={displayOptional(observations)} />
      </DetailSection>
    </div>
  );
}