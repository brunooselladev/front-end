export interface Usuario {
  id: number;
  email: string;
  role: string;
  isVerified: 'pendiente' | 'aprobado' | 'rechazado';
  nombre: string;
  dni: number | null;
  fechaNacimiento: string | null;
  telefono: string | null;
  direccionResidencia: string | null;
  alias: string | null;
  generoAutoPercibido: string | null;
  estadoCivil: string | null;
  obraSocial: string | null;
  geolocalizacion: string | null;
  creadoPor: number | null;
  requiereAprobacion: boolean;
  idEspacio: number | null;
  tipoProfesional: string | null;
  esEfector: boolean;
  esETratante: boolean;
  registroConUsmya: boolean;
  password?: string;
}