// src/Interfaces/IIdentification.ts
import { TipoInstitucion } from "../constants/enums"; // Asumiendo que necesitas esto aquí también

export interface ISection {
  Room: string;
  Panel?: string;
  DisplayCase?: string;
  Easel?: string;
  Storage?: string;
  Courtyard?: string;
  Pillar?: string;
  Others?: string;
}

export interface ITypology {
  Type: string;
  Subtype?: string;
  Class?: string;
  Subclass?: string;
  Order?: string;
  Suborder?: string;
}

export interface ISpecificName {
  GenericName: string;
  RelatedTerms?: string;
  SpecificTerms?: string;
  UsedBy?: string;
  Notes?: string;
}

export interface IAuthor {
  Name: string; 
  BirthPlace: string; // Obligatorio
  BirthDate: string; // Obligatorio - Usa string para el input tipo 'date'
  DeathPlace?: string;
  DeathDate?: string | null; // Usa string para el input tipo 'date'
}

export interface ITitle {
  Name: string; // Obligatorio
  Attribution?: string;
  Translation?: string;
}

export interface IMaterial {
  MaterialName: string; // Obligatorio
  DescribedPart?: string;
  Colors?: string;
}

export interface ITechnique {
  TechniqueName: string; // Obligatorio
  DescribedPart?: string;
}

export interface IIdentification {
  id?: string; // Opcional, si la API lo devuelve
  section: ISection;
  inventory: number; // Cambiado a number si es numérico
  numberOfObjects: number;
  genericClassification: string;
  objectName: string;
  typology: ITypology;
  specificName: ISpecificName;
  author: IAuthor;
  title: ITitle;
  material: IMaterial;
  techniques: ITechnique; // Asegúrate que coincida con backend (Technique o Techniques)
  observations: string;
  expediente: number; // El expediente del Archivo Administrativo asociado
  unit?: TipoInstitucion; // Este viene del backend service, no se edita aquí directamente
}

// Estado inicial para el formulario
export const initialIdentification: IIdentification = {
  section: { Room: "" },
  inventory: 0,
  numberOfObjects: 1, // O el valor por defecto que prefieras
  genericClassification: "",
  objectName: "",
  typology: { Type: "" },
  specificName: { GenericName: "" },
  author: { Name: "", BirthPlace: "", BirthDate: "" },
  title: { Name: "" },
  material: { MaterialName: "" },
  techniques: { TechniqueName: "" },
  observations: "",
  expediente: 0, // Este se debería obtener del paso anterior
};