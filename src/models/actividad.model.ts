export interface Actividad {
  id?: number;
  nombre: string;
  descripcion: string;
  tipo: string;
  fechaInicio: Date;
  fechaFin?: Date;
  estado: 'activa' | 'inactiva' | 'finalizada';
  espacioId?: number;
  espacioNombre?: string;
}