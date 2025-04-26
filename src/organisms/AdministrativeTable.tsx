// src/organisms/AdministrativeTable.tsx
import { useState, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { FormField } from "../molecules/FormField";
import { IAdministrativeFile } from "../Interfaces/IAdministrativeFile";
import { colors } from "../styles/colors";

interface AdministrativeTableProps {
  archivos: IAdministrativeFile[];
  searchExpediente: string;
  onSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  onDelete: (expediente: number, peticionTransferencia?: boolean) => void;
  onViewDetails: (expediente: number) => void;
  onCreateNewFile?: () => void;
}

export function AdministrativeTable({
  archivos,
  searchExpediente,
  onSearch,
  onDelete,
  onViewDetails,
}: AdministrativeTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const formatDate = (dateInput: string | Date) => {
    if (!dateInput) return "";
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    return date.toLocaleDateString();
  };

  const totalPages = Math.ceil(archivos.length / itemsPerPage);
  const paginatedArchivos = archivos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <div className="w-64">
          <FormField
            label=""
            name="searchExpediente"
            type="text"
            value={searchExpediente}
            onChange={onSearch}
            placeholder="Buscar por expediente..."
          />
        </div>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr style={{ backgroundColor: colors.background }}>
            <th className="p-4 text-left text-lg font-semibold" style={{ color: colors.textPrimary }}>
              Institución
            </th>
            <th className="p-4 text-left text-lg font-semibold" style={{ color: colors.textPrimary }}>
              Unidad
            </th>
            <th className="p-4 text-left text-lg font-semibold" style={{ color: colors.textPrimary }}>
              Expediente
            </th>
            <th className="p-4 text-left text-lg font-semibold" style={{ color: colors.textPrimary }}>
              Fecha Inicial
            </th>
            <th className="p-4 text-left text-lg font-semibold" style={{ color: colors.textPrimary }}>
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedArchivos.length > 0 ? (
            paginatedArchivos.map((item, index) => (
              <tr
                key={item.id || index}
                className="hover:bg-gray-50 transition-colors"
                style={{ borderBottom: `1px solid ${colors.border}` }}
              >
                <td className="p-4 text-base" style={{ color: colors.textPrimary }}>
                  {item.TipoInstitucion}
                </td>
                <td className="p-4 text-base" style={{ color: colors.textPrimary }}>
                  {item.Unidad}
                </td>
                <td className="p-4 text-base" style={{ color: colors.textPrimary }}>
                  {item.Expediente}
                </td>
                <td className="p-4 text-base" style={{ color: colors.textPrimary }}>
                  {formatDate(item.FechaInicial)}
                </td>
                <td className="p-4 space-x-3">
                  <Link to={`/editAdministrativeFile/${item.Expediente}`}>
                    <button className="text-blue-600 hover:text-blue-800">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15.828a1 1 0 01-.293.207l-3 1a1 1 0 01-1.207-1.207l1-3a1 1 0 01.207-.293l9.586-9.586z"
                        />
                      </svg>
                    </button>
                  </Link>
                  <button
                    onClick={() => onDelete(item.Expediente, item.PeticionTransferencia)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => onViewDetails(item.Expediente)}
                    className="text-teal-600 hover:text-teal-800"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center p-4 text-base" style={{ color: colors.textSecondary }}>
                No hay archivos administrativos disponibles
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
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <span style={{ color: colors.textPrimary, fontSize: "1.1rem" }}>
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-lg ${currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:text-blue-800"}`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}