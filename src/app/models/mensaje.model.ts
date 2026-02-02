export interface Mensaje {
  id?: number;
  descripcion: string;
  idEmisor: number;
  idChat: number;
  fecha: string;
  hora: string;
}