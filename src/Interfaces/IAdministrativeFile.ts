import { TipoInstitucion, TipoDocumentoOrigen } from "../constants/enums";

export interface IAdministrativeFile {
  id?: number; 
  TipoInstitucion: TipoInstitucion;
  Unidad: string;
  Expediente: number;
  Serie?: string;
  TipoDocumentoOrigen: TipoDocumentoOrigen;
  FechaInicial: Date;
  FechaFinal?: Date | null;
  ExpedienteAnterior?: string;
  Asunto?: string;
  PeticionTransferencia?: boolean;
  Historial?: string;
  ArchivoDocumental?: string;
  Observaciones?: string;
}