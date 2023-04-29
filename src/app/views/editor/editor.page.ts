import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.page.html',
  styleUrls: ['./editor.page.scss'],
})
export class EditorPage implements OnInit {

  innerHTML = {"html": ""};  
  trustedHTML: SafeHtml;
  sanitizer;
  isPreviewOpen = false;  
  isAttributeOpen = false;
  isStyleOpen = false
  customActionSheetOptions = {
    header: 'Etiquetas',
    subHeader: 'Agrega una etiqueta al documento',
  };

  public insertMode = "outside"
  public insertModeIcon = "return-down-forward-outline"
  
  public attributesList: Array<any> = []
  public styleList: Array<any> = []

  public combobox: Array<string> = []
  
  public DOM: Array<any> = []

  public lines = ['<html>','  <head></head>','  <body>',' </body>','</html>']
  public currentIndex = -1;
  public currentElement = -1;
  public componentIndex = 1;
  public elements = [
    { name: "<div>", type:"block", tag: "div", attributes: ["text"] },
    { name: "<p>", type:"block", tag: "p", attributes: ["text"] },
    { name: "<span>", type:"block", tag: "span", attributes: ["text"] },
    { name: "<h1>", type:"block", tag: "h1", attributes: ["text"] },
    { name: "<h2>", type:"block", tag: "h2", attributes: ["text"] },
    { name: "<h3>", type:"block", tag: "h3", attributes: ["text"] },
    { name: "<a>", type:"block", tag: "a", attributes: ["text", "href", "target"] },
    { name: "<img>", type:"line", tag: "img", attributes: ["src", "alt"] },
    { name: "<i>", type:"block", tag: "i", attributes: ["text"] },
    { name: "<b>", type:"block", tag: "b", attributes: ["text"] },
    { name: "<u>", type:"block", tag: "u", attributes: ["text"]},
    { name: "<q>", type:"block", tag: "q", attributes: ["text"]},
    { name: "<del>", type:"block", tag: "del", attributes: ["text"]},
    { name: "<sub>", type:"block", tag: "sub", attributes: ["text"]},
    { name: "<sup>", type:"block", tag: "sup", attributes: ["text"]},
    { name: "<br>", type:"line", tag: "br", attributes: ["text"]},
    { name: "<ul>", type:"block", tag: "ul", attributes: ["text"]},
    { name: "<ol>", type:"block", tag: "ol", attributes: ["text"]},
    { name: "<li>", type:"block", tag: "li", attributes: ["text"]},
    { name: "<table>", type:"block", tag: "table", attributes: ["text", "align", "valign"]},
    { name: "<th>", type:"block", tag: "th", attributes: ["text"]},
    { name: "<tr>", type:"block", tag: "tr", attributes: ["text"]},
    { name: "<td>", type:"block", tag: "td", attributes: ["text", "colspan", "rowspan", "align", "valign"]},
    { name: "<label>", type:"block", tag: "label", attributes: ["text"]},
    { name: "<input>", type:"line", tag: "input", attributes: ["type", "value","name", "placeholder","maxlength"]},
    { name: "<button>", type:"block", tag: "button", attributes: ["text"]},
    { name: "<textarea>", type:"block", tag: "textarea", attributes: ["text","maxlength"]},
    { name: "<select>", type:"block", tag: "select", attributes: ["text"]},
    { name: "<option>", type:"block", tag: "option", attributes: ["text","value"]},
    { name: "<optgroup>", type:"block", tag: "optgroup", attributes: ["text","label"]},
    { name: "<fieldset>", type:"block", tag: "fieldset", attributes: ["text"]},
    { name: "<legend>", type:"block", tag: "legend", attributes: ["text"]},
    { name: "<marquee>", type:"block", tag: "marquee", attributes: ["text", "direction", "behavior", "scrollamount", "scrolldelay"]},
  ]
  public styles = ["color","background-color","opacity",
  "margin","padding","border",  
  "width","height","top","bottom","left","right",
  "display","position","float","box-sizing",
  "justify-content","align-content",
  "font-family","font-size","font-weight","font-style","text-align","text-decoration","text-transform","text-indent","line-height","letter-spacing","word-spacing","text-shadow"]

  constructor(private alertController: AlertController, private _sanitizer: DomSanitizer, private toast: ToastController) {
    this.sanitizer = _sanitizer;
    this.trustedHTML = this.sanitizer.bypassSecurityTrustHtml(this.innerHTML.html);

    var el = this;
    this.elements.forEach(function(item, index, array) {       
      el.combobox.push(item.name)
    })
  }  

  ngOnInit() {
  }

  async AddInput() {   
    this.currentElement = 24;
    this.attributesList = []
    let el = this
    this.elements[this.currentElement].attributes.forEach(function(item, index, array){
      el.attributesList.push({ name: item, value: ""})
    })    

    this.setAttributeModalOpen(true)     
  }

  async AddH1() {    
    await this.AddElement(3, [{name:"text", value: "Título " + this.componentIndex}])
  }

  async AddParagraph() {    
    await this.AddElement(1, [{name: "text", value: "Párrafo " + this.componentIndex}])
  }

  async AddDiv() {    
    await this.AddElement(0, [{name:"text", value:"..."}])
  }

  async AddElement(i: number, attributes: Array<any>)
  {
    var html = ""

    var text = this.getTextFromAttributes(attributes)
    var attributesText = this.getInnerHTMLFromAttributes(attributes)

    var currentTab = 0;
    if (this.DOM.length > 0) { 
      currentTab = this.DOM[this.currentIndex].tab;
      if (this.DOM[this.currentIndex].type == "containerStart") 
        currentTab++
    }

    if(this.elements[i].type == "block")
      html = html.concat("<", this.elements[i].tag, attributesText, ">", text, "</", this.elements[i].tag, ">")
    else
      html = html.concat("<", this.elements[i].tag, attributesText, "/>")
    
    this.componentIndex++

    if(this.DOM.length > 0 && this.DOM[this.currentIndex].type == "block" && this.insertMode == "inside" )
    {      
      var containerTag = this.DOM[this.currentIndex].tag  
      var containerAttr = (this.DOM[this.currentIndex].attributes) as Array<any>
      var containerAttrText = this.getInnerHTMLFromAttributes(containerAttr)
      var containerText = this.getTextFromAttributes(containerAttr)

      var tab = " ".repeat(currentTab)    
      var inner = ""

      this.DOM.splice(this.currentIndex, 1)

      inner = "".concat(tab, "<", containerTag, containerAttrText, ">", containerText)
      this.DOM.splice(this.currentIndex, 0, { html: inner, active: true, type: "containerStart", tag: this.elements[i].tag, tab: currentTab, attributes: attributes })
            
      html = " ".repeat(currentTab+1) + html
      this.DOM.splice(this.currentIndex+1, 0, { html: html, active: true, type: this.elements[i].type, tag: this.elements[i].tag, tab: currentTab+1, attributes: attributes  })

      inner = "".concat(tab, "</", containerTag, ">")
      this.DOM.splice(this.currentIndex+2, 0, { html: inner, active: true, type: "containerEnd", tag: this.elements[i].tag, tab: currentTab, attributes: attributes  })
    }
    else {
      html = " ".repeat(currentTab) + html
      this.DOM.splice(this.currentIndex+1, 0, { html: html, active: true, type: this.elements[i].type, tag: this.elements[i].tag, tab: currentTab, attributes: attributes  })
    }

    this.currentIndex++

    if(this.DOM.length == this.currentIndex)
      this.pick(this.currentIndex-1)
    else
      this.pick(this.currentIndex)
  }

  private getTextFromAttributes(attributes: Array<any>) : string
  {
    let output =  attributes.find(item => {
      return item.name === "text" && item.value !== undefined
    })
    
    if(output != undefined)
      return output.value
    else
      return ""
  }

  private getInnerHTMLFromAttributes(attributes: Array<any>)
  {
    var attr = " "

    attributes.forEach(function(item, index, array) {
      if(item.name !== "text" && item.value !== "")
          attr = attr.concat(item.name,'="', item.value ,'" ')
    })

    return attr.trimEnd();
  }

  aceptarAtributos() {
    this.AddElement(this.currentElement, this.attributesList );
    this.setAttributeModalOpen(false)
  }

  aceptarEstilos() {
    console.log(this.styleList)
    this.setStyleModalOpen(false)
  }

  async insertar() {
    if(this.currentElement >= 0)
    {
      this.attributesList = []
      let el = this
      this.elements[this.currentElement].attributes.forEach(function(item, index, array){
        el.attributesList.push({ name: item, value: ""})
      })      

      this.setAttributeModalOpen(true)
    } else {
      await this.presentToast("top", "Seleccione una etiqueta de la lista desplegable")
    }
  }

  async editarAtributos() {
    if(this.currentIndex >= 0)
    {
      this.attributesList = []
      let el = this
      let attr = this.DOM[this.currentIndex].attributes as Array<any>
      attr.forEach(function(item, index, array){
        el.attributesList.push({ name: item.name, value: item.value})
      })      

      this.setAttributeModalOpen(true)
    } else {
      await this.presentToast("top", "Primero inserte una línea de código")
    }
  }

  async editarEstilos() {
    if(this.currentIndex >= 0)
    {
      this.styleList = []
      let el = this      
      this.styles.forEach(function(item, index, array){
        el.styleList.push({ name: item, value: ""})
      })      

      this.setStyleModalOpen(true)
    } else {
      await this.presentToast("top", "Primero inserte una línea de código")
    }
  }  

  handleChange(event: Event) {   
    const value = (event as CustomEvent).detail.value;    
    this.currentElement = value;
  }

  removeAttribute(index:number):void{
    this.attributesList.splice(index, 1);    
  }

  removeStyle(index:number):void{
    this.styleList.splice(index, 1);    
  }

  async presentToast(position: 'top' | 'middle' | 'bottom', message: string) {
    const toast = await this.toast.create({
      message: message,
      duration: 1500,
      position: position
    });

    await toast.present();
  }

  async changeInsertMode()
  {
    if(this.insertMode == "outside")
    {
      this.insertMode = "inside"
      this.insertModeIcon = "enter-outline"
      await this.presentToast("top", "Los elementos se insertarán DENTRO de la etiqueta actual")
    } else
    {
      this.insertMode = "outside"
      this.insertModeIcon = "return-down-forward-outline"      
      await this.presentToast("top", "Los elementos se insertarán DEBAJO de la etiqueta actual")
    }
  }

  pick(index: number) {
    try {
      this.DOM.forEach(function(item, index, array) {       
        item.active = false
      })

      this.currentIndex = index;
      this.DOM[this.currentIndex].active = true;      
    }
    catch(ex) {}
  }
  
  setPreviewModalOpen(isOpen: boolean) {

    var el = this
    el.innerHTML.html = ""
    this.DOM.forEach(function(item, index, array) {       
      el.innerHTML.html += item.html
    })

    this.trustedHTML = this.sanitizer.bypassSecurityTrustHtml(el.innerHTML.html);

    this.isPreviewOpen = isOpen;
  }

  setAttributeModalOpen(isOpen: boolean) {
    this.isAttributeOpen = isOpen;
  }

  setStyleModalOpen(isOpen: boolean) {
    this.isStyleOpen = isOpen;
  }

}
