import { EvaluacionItem } from './evaluacion-item';
export interface EvaluacionIndividual {
  idRonda: string;
  idParticipante: string;
  idConsenso: string;
  consensoindividual: number;
  item: EvaluacionItem[];
}