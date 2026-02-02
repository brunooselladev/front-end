export interface NotaTrayectoria {
  id: number;
  idActor: number; // ID del efector o referente que crea la nota
  idUsmya: number; // ID del paciente USMYA
  titulo: string;
  observacion: string;
  fecha: string; // Formato ISO string
  hora: string; // Formato HH:mm
}