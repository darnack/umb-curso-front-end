import { Element } from "./element-model"

export interface DOMElement {
    innerHTML: string,
    element: Element,
    tab: number,
    active: boolean,
    attributes: Array<any>,
    childs: Array<DOMElement>
}