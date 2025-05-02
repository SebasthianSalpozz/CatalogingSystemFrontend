/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, ChangeEvent } from "react";
import { IIdentification } from "../Interfaces/IIdentification";
import { colors } from "../styles/colors";
import { Input } from "../atoms/Input";

interface IdentificationTableProps {
  identificaciones: IIdentification[];
  onDelete: (expediente: number) => void;
  onViewDetails: (expediente: number) => void;
  onEdit: (expediente: number) => void;
}

export function IdentificationTable({
  identificaciones,
  onDelete,
  onViewDetails,
  onEdit,
}: IdentificationTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchField, setSearchField] = useState<string>("material.MaterialName"); // Campo por defecto
  const [searchValue, setSearchValue] = useState<string>("");
  const itemsPerPage = 10;

  // Definir los campos disponibles para búsqueda
  const searchFields = [
    { label: "Materia", value: "material.MaterialName" },
    { label: "Autor", value: "author.Name" },
    { label: "Título", value: "title.Name" },
    { label: "Nombre del Objeto", value: "objectName" },
    { label: "Clasificación Genérica", value: "genericClassification" },
  ];

  // Filtrar identificaciones según el campo y valor de búsqueda
  const filteredIdentificaciones = identificaciones.filter((item) => {
    if (!searchValue.trim()) return true; // Si no hay valor de búsqueda, mostrar todo

    const getNestedValue = (obj: any, path: string): string => {
      const value = path.split('.').reduce((acc, part) => acc && acc[part], obj);
      return value ? String(value).toLowerCase() : "";
    };

    const fieldValue = getNestedValue(item, searchField);
    return fieldValue.includes(searchValue.toLowerCase());
  });

  const totalPages = Math.ceil(filteredIdentificaciones.length / itemsPerPage);
  const paginatedIdentificaciones = filteredIdentificaciones.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleSearchFieldChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSearchField(event.target.value);
    setCurrentPage(1); // Resetear la página al cambiar el campo
  };

  const handleSearchValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
    setCurrentPage(1); // Resetear la página al cambiar el valor
  };

  return (
    <div className="space-y-4">
      {/* Formulario de búsqueda avanzada */}
      <div className="flex items-center space-x-4 mb-4">
        <div>
          <label className="mr-2 text-sm font-medium" style={{ color: colors.textPrimary }}>
            Buscar por:
          </label>
          <select
            value={searchField}
            onChange={handleSearchFieldChange}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ borderColor: colors.border, color: colors.textPrimary }}
          >
            {searchFields.map((field) => (
              <option key={field.value} value={field.value}>
                {field.label}
              </option>
            ))}
          </select>
        </div>
        <Input
          type="text"
          value={searchValue}
          onChange={handleSearchValueChange}
          placeholder={`Buscar en ${searchFields.find(f => f.value === searchField)?.label.toLowerCase()}...`}
          className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-1/2"
          style={{ borderColor: colors.border, color: colors.textPrimary }}
        />
      </div>

      {/* Tabla */}
      <table className="w-full border-collapse">
        <thead>
          <tr style={{ backgroundColor: colors.background }}>
            <th className="p-4 text-left text-lg font-semibold" style={{ color: colors.textPrimary }}>Expediente</th>
            <th className="p-4 text-left text-lg font-semibold" style={{ color: colors.textPrimary }}>Inventario</th>
            <th className="p-4 text-left text-lg font-semibold" style={{ color: colors.textPrimary }}>Nombre Objeto</th>
            <th className="p-4 text-left text-lg font-semibold" style={{ color: colors.textPrimary }}>Clasificación Gen.</th>
            <th className="p-4 text-left text-lg font-semibold" style={{ color: colors.textPrimary }}>Autor</th>
            <th className="p-4 text-left text-lg font-semibold" style={{ color: colors.textPrimary }}>Institución</th>
            <th className="p-4 text-left text-lg font-semibold" style={{ color: colors.textPrimary }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {paginatedIdentificaciones.length > 0 ? (
            paginatedIdentificaciones.map((item, index) => (
              <tr
                key={item.id || item.expediente || index}
                className="hover:bg-gray-50 transition-colors"
                style={{ borderBottom: `1px solid ${colors.border}` }}
              >
                <td className="p-4 text-base" style={{ color: colors.textPrimary }}>{item.expediente}</td>
                <td className="p-4 text-base" style={{ color: colors.textPrimary }}>{item.inventory}</td>
                <td className="p-4 text-base" style={{ color: colors.textPrimary }}>{item.objectName}</td>
                <td className="p-4 text-base" style={{ color: colors.textPrimary }}>{item.genericClassification}</td>
                <td className="p-4 text-base" style={{ color: colors.textPrimary }}>
                  {(item.author && item.author.Name) || 'N/A'}
                </td>
                <td className="p-4 text-base" style={{ color: colors.textPrimary }}>{item.unit || 'N/A'}</td>
                <td className="p-4 space-x-3">
                  <button
                    onClick={() => onEdit(item.expediente)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Editar Identificación"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15.828a1 1 0 01-.293.207l-3 1a1 1 0 01-1.207-1.207l1-3a1 1 0 01.207-.293l9.586-9.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(item.expediente)}
                    className="text-red-600 hover:text-red-800"
                    title="Eliminar Identificación"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onViewDetails(item.expediente)}
                    className="text-teal-600 hover:text-teal-800"
                    title="Ver Detalles Identificación"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center p-4 text-base" style={{ color: colors.textSecondary }}>
                No hay registros de identificación que coincidan con la búsqueda
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`p-2 rounded-lg ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:text-blue-800"}`}
            aria-label="Página anterior"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span style={{ color: colors.textPrimary, fontSize: "1.1rem" }}>
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-lg ${currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:text-blue-800"}`}
            aria-label="Página siguiente"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}