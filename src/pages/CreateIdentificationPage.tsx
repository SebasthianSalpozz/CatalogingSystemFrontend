/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, ChangeEvent, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../services/api";
import {
  IIdentification,
  initialIdentification,
} from "../Interfaces/IIdentification";
import { IdentificationForm } from "../organisms/IdentificationForm";
import { AdministrativeTemplate } from "../templates/AdministrativeTemplate";
import axios from "axios";

export function CreateIdentificationPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Extrae el expediente del estado de navegación OBLIGATORIAMENTE
  const expedienteFromState = useMemo(() => location.state?.expediente as number | undefined, [location.state]);

  // Estado para la identificación actual
  const [identification, setIdentification] = useState<IIdentification>(() => {
    return {
      ...initialIdentification,
      section: { ...initialIdentification.section },
      typology: { ...initialIdentification.typology },
      specificName: { ...initialIdentification.specificName },
      author: { ...initialIdentification.author },
      title: { ...initialIdentification.title },
      material: { ...initialIdentification.material },
      techniques: { ...initialIdentification.techniques },
      expediente: expedienteFromState || 0,
    };
  });

  const [errors, setErrors] = useState<Record<string, any>>({});
  const [currentTenant, setCurrentTenant] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log("CreateIdentificationPage Montado/Actualizado. Expediente:", expedienteFromState);
    setIsLoading(true);
    const tenantId = api.defaults.headers.common["tenant"] as string;

    if (!tenantId) {
      setErrors({ general: "Por favor selecciona una institución primero." });
      setTimeout(() => navigate("/tenants"), 1500);
      setIsLoading(false);
      return;
    }

    if (!expedienteFromState || expedienteFromState <= 0) {
      setErrors({ general: "No se proporcionó un número de expediente válido para la identificación." });
      setTimeout(() => navigate("/list"), 2000);
      setIsLoading(false);
      return;
    }

    setCurrentTenant(tenantId.replace("tenant_", ""));
    setIdentification({
      ...initialIdentification,
      section: { ...initialIdentification.section },
      typology: { ...initialIdentification.typology },
      specificName: { ...initialIdentification.specificName },
      author: { ...initialIdentification.author },
      title: { ...initialIdentification.title },
      material: { ...initialIdentification.material },
      techniques: { ...initialIdentification.techniques },
      expediente: expedienteFromState,
    });
    setErrors({});
    setIsLoading(false);
  }, [navigate, expedienteFromState]);

  const inputChangeValue = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
    nestedField?: keyof IIdentification,
    subField?: string
  ) => {
    const { name, value, type } = event.target;

    setIdentification((prev) => {
      const newState = { ...prev };
      if (nestedField && typeof newState[nestedField] === 'object' && newState[nestedField] !== null) {
        newState[nestedField] = { ...(newState[nestedField] as object) } as any;
      }

      let processedValue: string | number | null | boolean = value;

      if (type === 'date') {
        processedValue = value || null;
      } else if (type === 'number') {
        processedValue = value === '' ? '' : Number.isNaN(Number(value)) ? value : Number(value);
      } else if (type === 'checkbox') {
        processedValue = (event.target as HTMLInputElement).checked;
      }

      if (nestedField && subField && typeof newState[nestedField] === 'object' && newState[nestedField] !== null) {
        (newState[nestedField] as any)[subField] = processedValue;
      } else if (name in newState) {
        const key = name as keyof IIdentification;
        if (key in newState) {
          (newState as any)[key] = processedValue;
        }
      }

      return newState;
    });

    if (nestedField && subField && errors[nestedField]?.[subField]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        if (newErrors[nestedField]) {
          delete newErrors[nestedField][subField];
          if (Object.keys(newErrors[nestedField]).length === 0) {
            delete newErrors[nestedField];
          }
        }
        return newErrors;
      });
    } else if (errors[name]) {
      setErrors((prev) => {
        const { [name]: _, ...rest } = prev;
        return rest;
      });
    }
    if (errors.general) {
      setErrors((prev) => {
        const { general: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const save = async () => {
    const newErrors: Record<string, any> = {};
    if (!identification.inventory || identification.inventory <= 0)
      newErrors.inventory = "El inventario es obligatorio y debe ser mayor a 0.";
    if (identification.numberOfObjects <= 0)
      newErrors.numberOfObjects = "El número de objetos debe ser mayor a 0.";
    if (!identification.genericClassification.trim())
      newErrors.genericClassification = "La clasificación genérica es obligatoria.";
    if (!identification.objectName.trim())
      newErrors.objectName = "El nombre del objeto es obligatorio.";
    if (!identification.section.Room.trim())
      newErrors.section = { ...(newErrors.section || {}), Room: "La Sala es obligatoria." };
    if (!identification.typology.Type.trim())
      newErrors.typology = { ...(newErrors.typology || {}), Type: "El Tipo (Tipología) es obligatorio." };
    if (!identification.specificName.GenericName.trim())
      newErrors.specificName = { ...(newErrors.specificName || {}), GenericName: "El Nombre Genérico (Nombre Específico) es obligatorio." };
    if (!identification.author.Name.trim())
      newErrors.author = { ...(newErrors.author || {}), Name: "El Nombre (Autor) es obligatorio." };
    if (!identification.author.BirthPlace.trim())
      newErrors.author = { ...(newErrors.author || {}), BirthPlace: "El Lugar de Nacimiento (Autor) es obligatorio." };
    if (!identification.author.BirthDate)
      newErrors.author = { ...(newErrors.author || {}), BirthDate: "La Fecha de Nacimiento (Autor) es obligatoria." };
    if (!identification.title.Name.trim())
      newErrors.title = { ...(newErrors.title || {}), Name: "El Título es obligatorio." };
    if (!identification.material.MaterialName.trim())
      newErrors.material = { ...(newErrors.material || {}), MaterialName: "La Materia es obligatoria." };
    if (!identification.techniques.TechniqueName.trim())
      newErrors.techniques = { ...(newErrors.techniques || {}), TechniqueName: "La Técnica es obligatoria." };
    if (!identification.observations.trim())
      newErrors.observations = "Las observaciones son obligatorias.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formattedData = {
      ...identification,
      author: {
        ...identification.author,
        BirthDate: identification.author.BirthDate ? new Date(identification.author.BirthDate).toISOString() : null,
        DeathDate: identification.author.DeathDate ? new Date(identification.author.DeathDate).toISOString() : null,
      },
    };
    delete formattedData.id;
    delete formattedData.unit;

    console.log("Datos enviados al backend:", formattedData);

    try {
      await api.post("Identification", formattedData);
      console.log("Identificación creada exitosamente para expediente:", identification.expediente);
      navigate("/list");
    } catch (error) {
      let errorMessage = "No se pudo guardar la identificación.";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.response?.data?.title || errorMessage;
        if (error.response?.status === 409) {
          errorMessage = `Conflicto: ${errorMessage}`;
        } else if (error.response?.data?.errors) {
          console.error("Errores de validación del backend:", error.response.data.errors);
        }
      }
      setErrors((prev) => ({ ...prev, general: errorMessage }));
    }
  };

  if (isLoading) {
    return (
      <AdministrativeTemplate title="Cargando...">
        <p className="text-center">Cargando datos necesarios...</p>
      </AdministrativeTemplate>
    );
  }

  return (
    <AdministrativeTemplate
      title={`Crear Identificación para Expediente ${identification.expediente} - ${
        currentTenant || "Institución no seleccionada"
      }`}
    >
      {errors.general && (
        <p className="text-red-500 mb-4">{errors.general}</p>
      )}
      {identification.expediente > 0 ? (
        <IdentificationForm
          identification={identification}
          onChange={inputChangeValue}
          onSave={save}
          onCancel={() => navigate("/list")}
          errors={errors}
          expediente={identification.expediente}
        />
      ) : (
        !isLoading && <p className="text-red-600 text-center">Error: No se pudo obtener el número de expediente.</p>
      )}
    </AdministrativeTemplate>
  );
}