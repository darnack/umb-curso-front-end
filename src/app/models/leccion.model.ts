import { EvaluacionModel } from "./evaluacion-model";

export interface LeccionModel {
    numero: string,
    modulo: string,
    titulo: string,
    contenido: string,
    desabilitado: boolean,
    evaluaciones: EvaluacionModel[] | undefined
}