/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTenant, setTenantHeader } from "../services/api";
import { Button } from "../atoms/Button";
import { FormField } from "../molecules/FormField";
import { AdministrativeTemplate } from "../templates/AdministrativeTemplate";

export function CreateTenantPage() {
  const [formData, setFormData] = useState({
    name: "",
    isil: "",
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "El nombre de la institución es obligatorio.";
    if (!formData.isil.trim()) newErrors.isil = "El identificador ISIL es obligatorio.";
    if (!formData.description.trim()) newErrors.description = "La descripción es obligatoria.";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      setErrors({});
      setSuccess(null);
      const newTenant = await createTenant(formData);
      if (!newTenant || !newTenant.name || !newTenant.id) {
        throw new Error("La respuesta del servidor no contiene los datos esperados.");
      }
      setSuccess(`Institución ${newTenant.name} creada exitosamente`);
      setTimeout(() => {
        setTenantHeader(newTenant.id);
        navigate("/tenants");
      }, 1500);
    } catch (err: any) {
      setErrors({
        general: err.message || "No se pudo crear la institución.",
      });
    }
  };

  const handleCancel = () => {
    navigate("/tenants");
  };

  return (
    <AdministrativeTemplate title="Crear Nueva Institución">
      {success ? (
        <div className="text-green-500 mb-4 text-center">
          <p>{success}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <div className="text-red-500 mb-4">{errors.general}</div>
          )}
          <FormField
            label="Identificador ISIL (e.g., BO-NEWINST)"
            name="isil"
            type="text"
            value={formData.isil}
            onChange={handleChange}
            placeholder="Ingresa el identificador ISIL"
            error={errors.isil}
          />
          <FormField
            label="Nombre de la Institución"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ingresa el nombre de la institución"
            error={errors.name}
          />
          <FormField
            label="Descripción"
            name="description"
            type="textarea"
            value={formData.description}
            onChange={handleChange}
            placeholder="Ingresa una descripción"
            error={errors.description}
          />
          <div className="flex space-x-4">
            <Button type="submit" variant="primary">
              Crear Institución
            </Button>
            <Button
              onClick={handleCancel}
              variant="secondary"
            >
              Volver
            </Button>
          </div>
        </form>
      )}
    </AdministrativeTemplate>
  );
}