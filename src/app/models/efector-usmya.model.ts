import { Usmya } from './usmya.model';
import { Referente } from './referente.model';

export interface EfectorUsmya {
  id: number;
  idEfector: number;
  idUsmya: number;
}

export interface ReferenteUsmya {
  referente: Referente;
  usmya: Usmya;
}