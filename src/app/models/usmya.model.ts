export interface Usmya {
  id?: number;
  nombre: string;
  dni: number;
  fechaNacimiento: string;
  telefono: string;
  direccionResidencia?: string;
  alias?: string;
  generoAutoPercibido?: string;
  estadoCivil?: string;
  obraSocial?: string;
  geolocalizacion?: string;
  password?: string;
  creadoPor?: number;
  requiereAprobacion?: boolean;
  email?: string;
}
