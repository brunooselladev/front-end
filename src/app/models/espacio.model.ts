import { ActividadEspacio } from './actividad.model';

export interface Espacio {
  id?: number;
  nombre: string;
  telefono: string;
  tipoOrganizacion: 'estatal' | 'comunitario' | 'educacion' | 'merendero' | 'comedor' | 'deportiva' | 'religiosa' | 'centro vecinal' | 'otros';
  direccion?: string;
  barrio?: string;
  encargado: string;
  poblacionVinculada: Array<'niños' | 'adolescentes' | 'jovenes' | 'adultos' | 'mayores' | 'familias' | 'otros'>;
  diasHorarios: string;
  actividadesPrincipales?: string;
  actividadesSecundarias?: string;
  actividadEspacio?: ActividadEspacio[];
  coordenadas?: {
    lat: number;
    lng: number;
  };
  cuentaConInternet?: boolean;
  cuentaConDispositivo?: boolean;
}
