export interface LeccionModel {
    number: string,
    title: string,
    content: string,
    evaluation: {
        type: string,
        result: string
    }
}