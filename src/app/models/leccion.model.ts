export interface LeccionModel {
    number: string,
    module: string,
    title: string,
    content: string,
    evaluation: {
        type: string,
        result: string
    }
}