/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, updateIdentification } from "../services/api";
import {
  IIdentification,
  initialIdentification,
} from "../Interfaces/IIdentification";
import { IdentificationForm } from "../organisms/IdentificationForm";
import { AdministrativeTemplate } from "../templates/AdministrativeTemplate";
import axios from "axios";
import Swal from "sweetalert2";
import { Button } from "../atoms/Button";
import { mapBackendToFrontend } from "../utils/mapData";

export function EditIdentificationPage() {
  const navigate = useNavigate();
  const { expediente: expedienteParam } = useParams<{ expediente: string }>();
  const expediente = Number(expedienteParam);

  const [identification, setIdentification] = useState<IIdentification>(() => ({
    ...initialIdentification,
    expediente: expediente || 0,
    section: { ...initialIdentification.section },
    typology: { ...initialIdentification.typology },
    specificName: { ...initialIdentification.specificName },
    author: { ...initialIdentification.author, BirthDate: "", DeathDate: "" },
    title: { ...initialIdentification.title },
    material: { ...initialIdentification.material },
    techniques: { ...initialIdentification.techniques },
  }));
  const [errors, setErrors] = useState<Record<string, any>>({});
  const [currentTenant, setCurrentTenant] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const tenantId = api.defaults.headers.common["tenant"] as string;
    if (!tenantId) {
      setErrors({ general: "Por favor selecciona una institución primero." });
      setTimeout(() => navigate("/tenants"), 1500);
      setIsLoading(false);
      return;
    }
    setCurrentTenant(tenantId.replace("tenant_", ""));

    if (!expediente || expediente <= 0) {
      setErrors({ general: "Número de expediente inválido." });
      setIsLoading(false);
      setTimeout(() => navigate("/list"), 1500);
      return;
    }

    const fetchIdentification = async () => {
      setIsLoading(true);
      setErrors({});
      try {
        const response = await api.get(`Identification/${expediente}`);
        const data = response.data;

        if (!data) {
          throw new Error(`No se recibieron datos para la identificación con expediente ${expediente}.`);
        }

        console.log("Datos recibidos del backend:", data);

        // Mapear los datos del backend a la estructura de IIdentification
        const mappedData = mapBackendToFrontend(data);

        const safeData = {
          ...initialIdentification,
          ...mappedData,
          section: mappedData.section ? { ...initialIdentification.section, ...mappedData.section } : { ...initialIdentification.section },
          typology: mappedData.typology ? { ...initialIdentification.typology, ...mappedData.typology } : { ...initialIdentification.typology },
          specificName: mappedData.specificName ? { ...initialIdentification.specificName, ...mappedData.specificName } : { ...initialIdentification.specificName },
          author: mappedData.author ? { ...initialIdentification.author, ...mappedData.author } : { ...initialIdentification.author, BirthDate: "", DeathDate: "" },
          title: mappedData.title ? { ...initialIdentification.title, ...mappedData.title } : { ...initialIdentification.title },
          material: mappedData.material ? { ...initialIdentification.material, ...mappedData.material } : { ...initialIdentification.material },
          techniques: mappedData.techniques ? { ...initialIdentification.techniques, ...mappedData.techniques } : { ...initialIdentification.techniques },
          expediente: mappedData.expediente || expediente,
        };

        const formattedAuthor = {
          ...safeData.author,
          BirthDate: safeData.author.BirthDate ? new Date(safeData.author.BirthDate).toISOString().split('T')[0] : "",
          DeathDate: safeData.author.DeathDate ? new Date(safeData.author.DeathDate).toISOString().split('T')[0] : "",
        };

        setIdentification({
          ...safeData,
          author: formattedAuthor,
        });
      } catch (error) {
        console.error("Error fetching identification:", error);
        const message = error instanceof Error ? error.message : "No se pudo cargar la información de la identificación para editar.";
        setErrors({ general: message });
      } finally {
        setIsLoading(false);
      }
    };

    fetchIdentification();
  }, [expediente, navigate]);

  const inputChangeValue = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    nestedField?: keyof IIdentification,
    subField?: string
  ) => {
    const { name, value, type } = event.target;
    setIdentification((prev) => {
      const newState = { ...prev };
      if (nestedField && typeof newState[nestedField] === 'object' && newState[nestedField] !== null) {
        newState[nestedField] = { ...(newState[nestedField] as object) } as any;
      } else if (nestedField && (newState[nestedField] === null || newState[nestedField] === undefined)) {
        newState[nestedField] = {} as any;
      }

      let processedValue: string | number | null | boolean = value;
      if (type === 'date') {
        processedValue = value || "";
      } else if (type === 'number') {
        processedValue = value === '' ? '' : Number.isNaN(Number(value)) ? value : Number(value);
      } else if (type === 'checkbox') {
        if (event.target instanceof HTMLInputElement) {
          processedValue = event.target.checked;
        }
      } else if (name === 'PeticionTransferencia' && nestedField === undefined) {
        processedValue = value === 'true';
      }

      if (nestedField && subField && typeof newState[nestedField] === 'object' && newState[nestedField] !== null) {
        (newState[nestedField] as any)[subField] = processedValue;
      } else if (name in newState && nestedField === undefined) {
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
    } else if (errors[name] && nestedField === undefined) {
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
    if (!identification.section?.Room?.trim())
      newErrors.section = { ...(newErrors.section || {}), Room: "La Sala es obligatoria." };
    if (!identification.typology?.Type?.trim())
      newErrors.typology = { ...(newErrors.typology || {}), Type: "El Tipo (Tipología) es obligatorio." };
    if (!identification.specificName?.GenericName?.trim())
      newErrors.specificName = { ...(newErrors.specificName || {}), GenericName: "El Nombre Genérico (Nombre Específico) es obligatorio." };
    if (!identification.author?.Name?.trim())
      newErrors.author = { ...(newErrors.author || {}), Name: "El Nombre (Autor) es obligatorio." };
    if (!identification.author?.BirthPlace?.trim())
      newErrors.author = { ...(newErrors.author || {}), BirthPlace: "El Lugar de Nacimiento (Autor) es obligatorio." };
    if (!identification.author?.BirthDate)
      newErrors.author = { ...(newErrors.author || {}), BirthDate: "La Fecha de Nacimiento (Autor) es obligatoria." };
    if (!identification.title?.Name?.trim())
      newErrors.title = { ...(newErrors.title || {}), Name: "El Título es obligatorio." };
    if (!identification.material?.MaterialName?.trim())
      newErrors.material = { ...(newErrors.material || {}), MaterialName: "La Materia es obligatoria." };
    if (!identification.techniques?.TechniqueName?.trim())
      newErrors.techniques = { ...(newErrors.techniques || {}), TechniqueName: "La Técnica es obligatoria." };
    if (!identification.observations?.trim())
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

    const payload = { ...formattedData };
    // delete payload.expediente; // Descomentar si la API no espera expediente en el body de PUT

    console.log("Datos enviados al backend:", payload);

    try {
      await updateIdentification(expediente, payload);
      console.log("Identificación actualizada exitosamente para expediente:", expediente);
      Swal.fire("¡Actualizado!", "La identificación ha sido actualizada.", "success");
      navigate("/list");
    } catch (error) {
      let errorMessage = "No se pudo actualizar la identificación.";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.response?.data?.title || errorMessage;
        if (error.response?.status === 404) {
          errorMessage = "Error: No se encontró la identificación para actualizar.";
        } else if (error.response?.data?.errors) {
          console.error("Errores de validación del backend:", error.response.data.errors);
        }
      }
      setErrors((prev) => ({ ...prev, general: errorMessage }));
      Swal.fire("Error", errorMessage, "error");
    }
  };

  if (isLoading) {
    return (
      <AdministrativeTemplate title={`Cargando Identificación ${expedienteParam}...`}>
        <p className="text-center">Cargando datos para editar...</p>
      </AdministrativeTemplate>
    );
  }

  if (errors.general && !identification.inventory) {
    return (
      <AdministrativeTemplate title={`Error al Cargar Identificación ${expedienteParam}`}>
        <p className="text-red-500 mb-4 text-center">{errors.general}</p>
        <Button onClick={() => navigate("/list")} variant="secondary">Volver a la Lista</Button>
      </AdministrativeTemplate>
    );
  }

  return (
    <AdministrativeTemplate
      title={`Editar Identificación - Exp. ${expediente} - ${currentTenant || "Institución no seleccionada"}`}
    >
      {errors.general && !isLoading && (
        <p className="text-red-500 mb-4 text-center">{errors.general}</p>
      )}
      {!isLoading && identification.expediente > 0 ? (
        <IdentificationForm
          identification={identification}
          onChange={inputChangeValue}
          onSave={save}
          onCancel={() => navigate("/list")}
          errors={errors}
          isEdit={true}
          expediente={expediente}
        />
      ) : (
        !isLoading && <p className="text-red-600 text-center">No se pudo inicializar el formulario de edición.</p>
      )}
    </AdministrativeTemplate>
  );
}