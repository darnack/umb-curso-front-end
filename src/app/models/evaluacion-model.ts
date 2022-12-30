import { TipoEvaluacion } from "./tipo-evaluacion"

export interface EvaluacionModel {    
    tipo: TipoEvaluacion,
    pregunta: string,
    contenido: string,
    items: string[],
    respuesta: string,
}
