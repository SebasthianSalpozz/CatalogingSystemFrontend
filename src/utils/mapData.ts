/* eslint-disable @typescript-eslint/no-explicit-any */
import { IIdentification } from "../Interfaces/IIdentification";

// Función para convertir claves de snake_case o lowerCase a PascalCase (como en IIdentification)
export const toPascalCase = (str: string): string => {
  return str
    .split(/(?=[A-Z])|_|-/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
};

// Función para mapear las claves del backend a las esperadas por IIdentification
export const mapBackendToFrontend = (data: any): IIdentification => {
  const mappedData: any = { ...data };

  // Mapear section
  if (mappedData.section) {
    mappedData.section = Object.keys(mappedData.section).reduce((acc: any, key: string) => {
      const newKey = toPascalCase(key); // Ejemplo: room -> Room
      acc[newKey] = mappedData.section[key];
      return acc;
    }, {});
  }

  // Mapear typology
  if (mappedData.typology) {
    mappedData.typology = Object.keys(mappedData.typology).reduce((acc: any, key: string) => {
      const newKey = toPascalCase(key); // Ejemplo: type -> Type
      acc[newKey] = mappedData.typology[key];
      return acc;
    }, {});
  }

  // Mapear specificName
  if (mappedData.specificName) {
    mappedData.specificName = Object.keys(mappedData.specificName).reduce((acc: any, key: string) => {
      const newKey = toPascalCase(key); // Ejemplo: genericName -> GenericName
      acc[newKey] = mappedData.specificName[key];
      return acc;
    }, {});
  }

  // Mapear author
  if (mappedData.author) {
    mappedData.author = Object.keys(mappedData.author).reduce((acc: any, key: string) => {
      const newKey = toPascalCase(key); // Ejemplo: name -> Name
      acc[newKey] = mappedData.author[key];
      return acc;
    }, {});
  }

  // Mapear title
  if (mappedData.title) {
    mappedData.title = Object.keys(mappedData.title).reduce((acc: any, key: string) => {
      const newKey = toPascalCase(key); // Ejemplo: name -> Name
      acc[newKey] = mappedData.title[key];
      return acc;
    }, {});
  }

  // Mapear material
  if (mappedData.material) {
    mappedData.material = Object.keys(mappedData.material).reduce((acc: any, key: string) => {
      const newKey = toPascalCase(key); // Ejemplo: materialName -> MaterialName
      acc[newKey] = mappedData.material[key];
      return acc;
    }, {});
  }

  // Mapear techniques
  if (mappedData.techniques) {
    mappedData.techniques = Object.keys(mappedData.techniques).reduce((acc: any, key: string) => {
      const newKey = toPascalCase(key); // Ejemplo: techniqueName -> TechniqueName
      acc[newKey] = mappedData.techniques[key];
      return acc;
    }, {});
  }

  return mappedData as IIdentification;
};