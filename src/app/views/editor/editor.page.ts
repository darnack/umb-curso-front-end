import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import { ToastController } from '@ionic/angular';
import { UUID } from 'angular2-uuid';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.page.html',
  styleUrls: ['./editor.page.scss'],
})
export class EditorPage implements OnInit {

  public innerHTML = {"html": ""};  
  public trustedHTML: SafeHtml;
  public sanitizer;
  public isPreviewOpen = false;  
  public isAttributeOpen = false;
  public isStyleOpen = false

  public editorMode = "insertar"
  public insertMode = "outside"
  public insertModeIcon = "return-down-forward-outline"
  
  public DOM: Array<any> = []
  public attributesList: Array<any> = []
  public styleList: Array<any> = []
  public combobox: Array<string> = []
  public lines = ['<html>','  <head></head>','  <body>',' </body>','</html>']

  public currentIndex = -1;
  public currentTag = -1;
  public componentIndex = 1;
  public tagSelectable = [
    { name: "<div>", type:"pair", tag: "div", attributes: ["text"] },
    { name: "<p>", type:"pair", tag: "p", attributes: ["text"] },
    { name: "<span>", type:"pair", tag: "span", attributes: ["text"] },
    { name: "<h1>", type:"pair", tag: "h1", attributes: ["text"] },
    { name: "<h2>", type:"pair", tag: "h2", attributes: ["text"] },
    { name: "<h3>", type:"pair", tag: "h3", attributes: ["text"] },
    { name: "<a>", type:"pair", tag: "a", attributes: ["text", "href", "target"] },
    { name: "<img>", type:"single", tag: "img", attributes: ["src", "alt"] },
    { name: "<i>", type:"pair", tag: "i", attributes: ["text"] },
    { name: "<b>", type:"pair", tag: "b", attributes: ["text"] },
    { name: "<u>", type:"pair", tag: "u", attributes: ["text"]},
    { name: "<q>", type:"pair", tag: "q", attributes: ["text"]},
    { name: "<del>", type:"pair", tag: "del", attributes: ["text"]},
    { name: "<sub>", type:"pair", tag: "sub", attributes: ["text"]},
    { name: "<sup>", type:"pair", tag: "sup", attributes: ["text"]},
    { name: "<br>", type:"single", tag: "br", attributes: ["text"]},
    { name: "<ul>", type:"pair", tag: "ul", attributes: ["text"]},
    { name: "<ol>", type:"pair", tag: "ol", attributes: ["text"]},
    { name: "<li>", type:"pair", tag: "li", attributes: ["text"]},
    { name: "<table>", type:"pair", tag: "table", attributes: ["text", "align", "valign"]},
    { name: "<th>", type:"pair", tag: "th", attributes: ["text"]},
    { name: "<tr>", type:"pair", tag: "tr", attributes: ["text"]},
    { name: "<td>", type:"pair", tag: "td", attributes: ["text", "colspan", "rowspan", "align", "valign"]},
    { name: "<form>", type:"pair", tag: "form", attributes: ["action","method","enctype"]},    
    { name: "<input>", type:"single", tag: "input", attributes: ["type", "value","name", "placeholder","maxlength"]},
    { name: "<label>", type:"pair", tag: "label", attributes: ["text"]},
    { name: "<fieldset>", type:"pair", tag: "fieldset", attributes: ["text"]},
    { name: "<legend>", type:"pair", tag: "legend", attributes: ["text"]},
    { name: "<button>", type:"pair", tag: "button", attributes: ["text"]},
    { name: "<textarea>", type:"pair", tag: "textarea", attributes: ["text","maxlength"]},
    { name: "<select>", type:"pair", tag: "select", attributes: ["text"]},
    { name: "<option>", type:"pair", tag: "option", attributes: ["text","value"]},
    { name: "<optgroup>", type:"pair", tag: "optgroup", attributes: ["text","label"]},
    { name: "<audio>", type:"pair", tag: "audio", attributes: ["controls","crossorigin","loop","mute","autoplay"]},
    { name: "<video>", type:"pair", tag: "audio", attributes: ["controls","crossorigin","loop","mute","autoplay","width","height"]},    
    { name: "<source>", type:"pair", tag: "select", attributes: ["src","type"]},
    { name: "<iframe>", type:"pair", tag: "iframe", attributes: ["src","width","height","allowfullscreen","scrolling","importance"]},
    { name: "<marquee>", type:"pair", tag: "marquee", attributes: ["text", "direction", "behavior", "scrollamount", "scrolldelay"]},
    { name: "<header>", type:"pair", tag: "header", attributes: ["text"]},
    { name: "<nav>", type:"pair", tag: "nav", attributes: ["text"]},
    { name: "<aside>", type:"pair", tag: "aside", attributes: ["text"]},
    { name: "<section>", type:"pair", tag: "section", attributes: ["text"]},
    { name: "<article>", type:"pair", tag: "article", attributes: ["text"]},
    { name: "<footer>", type:"pair", tag: "footer", attributes: ["text"]},
  ]
  public styleSelectable = ["color","background-color","opacity",
  "margin","padding","border",  
  "width","height","top","bottom","left","right",
  "display","position","float","box-sizing",
  "justify-content","align-content",
  "font-family","font-size","font-weight","font-style","text-align","text-decoration","text-transform","text-indent","line-height","letter-spacing","word-spacing","text-shadow"]

  constructor(private alertController: AlertController, private _sanitizer: DomSanitizer, private toast: ToastController, private storage: Storage) {
    this.sanitizer = _sanitizer;
    this.trustedHTML = this.sanitizer.bypassSecurityTrustHtml(this.innerHTML.html);

    var el = this;
    this.tagSelectable.forEach(function(item, index, array) {       
      el.combobox.push(item.name)
    })
  }  

  ngOnInit() {
    let el = this
    this.storage.forEach(function(value, key, index) {
      if(key == "editor") {        
        el.DOM = value
        el.currentIndex = 0
        el.pick(0)
      }
    });
  }

  async AddInput() {   
    await this.AddElement(24, [{name:"type", value: "text"}, {name:"placeholder", value: "Escribe algo..."}])      
  }

  async AddH1() {    
    await this.AddElement(3, [{name:"text", value: "Título " + this.componentIndex}])
  }

  async AddParagraph() {    
    await this.AddElement(1, [{name: "text", value: "Párrafo " + this.componentIndex}])
  }

  async AddDiv() {    
    await this.AddElement(0, [])
  }

  async AddAnchor() {    
    await this.AddElement(6, [{name:"href", value:"https://umbvirtual.edu.co/"},{name:"text",value:"UMB Virtual"},{name:"target",value:"_blank"}])
  }

  async AddElement(i: number, attributes: Array<any>)
  {
    var innerHTML = ""

    var innerText = this.getTextFromAttributes(attributes)
    var innerAttributes = this.getInnerHTMLFromAttributes(attributes)
    
    var currentTab = 0;

    // arma el HTML dependiendo del tipo de etiqueta (pair:<el>/el>, single: <el/>)
    if(this.tagSelectable[i].type == "pair")
      innerHTML = innerHTML.concat("<", this.tagSelectable[i].tag, innerAttributes, ">", innerText, "</", this.tagSelectable[i].tag, ">")
    else
      innerHTML = innerHTML.concat("<", this.tagSelectable[i].tag, innerAttributes, "/>")
    
    this.componentIndex++

    // agrega elemento dentro de la etiqueta actual si es 'pair' y está activo el modo 'inside'
    if(this.DOM.length > 0 && this.DOM[this.currentIndex].type == "pair" && this.insertMode == "inside" )
    {
      var containerTag = this.DOM[this.currentIndex].tag        
      var containerAttr = (this.DOM[this.currentIndex].attributes) as Array<any>
      var containerInnerAttributes = this.getInnerHTMLFromAttributes(containerAttr)
      var containerInnerText = this.getTextFromAttributes(containerAttr)

      // determina la tabulación del elemento
      currentTab = this.DOM[this.currentIndex].tab;
      if (this.DOM[this.currentIndex].type == "containerStart") currentTab++
      var tab = " ".repeat(currentTab)    
      var inner = ""

      this.DOM.splice(this.currentIndex, 1)

      let pairGuid = UUID.UUID()

      inner = "".concat(tab, "<", containerTag, containerInnerAttributes, ">", containerInnerText)
      this.DOM.splice(this.currentIndex, 0, { html: inner, pair: pairGuid, active: true, type: "containerStart", tag: containerTag, tab: currentTab, attributes: containerAttr, style: [] })
            
      innerHTML = " ".repeat(currentTab+1) + innerHTML
      this.DOM.splice(this.currentIndex+1, 0, { html: innerHTML, pair: undefined, active: true, type: this.tagSelectable[i].type, tag: this.tagSelectable[i].tag, tab: currentTab+1, attributes: attributes, style: []  })

      inner = "".concat(tab, "</", containerTag, ">")
      this.DOM.splice(this.currentIndex+2, 0, { html: inner, pair: pairGuid, active: true, type: "containerEnd", tag: containerTag, tab: currentTab, attributes: containerAttr, style: []  })

      this.currentIndex++
    } // agrega elemento debajo de la etiqueta actual 
    else {  
      if (this.DOM.length > 0) {
        currentTab = this.DOM[this.currentIndex].tab;        
      }
      
      if(this.DOM.length > 0 && this.DOM[this.currentIndex].type == "containerStart") {
        // si es etiqueta de apertura desplaza el índice de inserción hasta el final de la etiqueta de cierre
        let pair = this.DOM[this.currentIndex].pair              
        for(let i = this.currentIndex; i < this.DOM.length; i++) {
          if(this.DOM[i].type == "containerEnd" && this.DOM[i].pair == pair) {
            this.currentIndex = i
            break
          }
        }

        if( this.insertMode == "outside") {
          this.currentIndex = this.currentIndex+1
        } else {
          currentTab++
        }

      } else {
        this.currentIndex = this.currentIndex+1
      }

      innerHTML = " ".repeat(currentTab) + innerHTML

      this.DOM.splice(this.currentIndex, 0, { html: innerHTML, active: true, type: this.tagSelectable[i].type, tag: this.tagSelectable[i].tag, tab: currentTab, attributes: attributes, style: [] })
    }    

    // marca como seleccionado la nueva posición
    if(this.DOM.length == this.currentIndex)
      this.pick(this.currentIndex-1)
    else
      this.pick(this.currentIndex)

    await this.storage.set("editor", this.DOM)
  }

  async UpdateElement(i: number, attributes: Array<any>) {
    var innerHTML = ""
    let element = this.DOM[i]
    var innerAttributes = this.getInnerHTMLFromAttributes(attributes)
    var innerText = this.getTextFromAttributes(attributes)
    var innerStyle = this.getInnerHTMLFromStyles(element.style)
    element.attributes = attributes
    var tab = " ".repeat(element.tab)

    if(element.type == "pair")
      element.html = innerHTML.concat(tab, "<", element.tag, innerAttributes, innerStyle, ">", innerText, "</", element.tag, ">")
    else if(element.type == "containerStart"){
      element.html = innerHTML.concat(tab, "<", element.tag, innerAttributes, innerStyle, ">", innerText)
    } else
      element.html = innerHTML.concat(tab, "<", element.tag, innerAttributes, innerStyle, "/>")
    
    this.DOM.splice(this.currentIndex, 1, element)

    await this.storage.set("editor", this.DOM)
  }

  async UpdateStyle(i: number, styles: Array<any>) {
    var innerHTML = ""
    let element = this.DOM[i]
    
    var innerAttributes = this.getInnerHTMLFromAttributes(element.attributes)
    var innerText = this.getTextFromAttributes(element.attributes)
    var innerStyle = this.getInnerHTMLFromStyles(styles)
    var tab = " ".repeat(element.tab)
    element.style = styles

    if(element.type == "pair")
      element.html = innerHTML.concat(tab, "<", element.tag, innerAttributes, innerStyle, ">", innerText, "</", element.tag, ">")
    else if(element.type == "containerStart"){
      element.html = innerHTML.concat(tab, "<", element.tag, innerAttributes, innerStyle, ">", innerText)
    } else
      element.html = innerHTML.concat(tab, "<", element.tag, innerAttributes, innerStyle, "/>")
    
    this.DOM.splice(this.currentIndex, 1, element)

    await this.storage.set("editor", this.DOM)
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

  private getInnerHTMLFromStyles(styles: Array<any>)
  {
    let innerStyle = ' style="'
    let count = 0;

    styles.forEach(function(item, index, array) {   
      if(item.value != "") {
        innerStyle = innerStyle.concat(item.name,':', item.value ,';')
        count++
      }
    })

    if(count > 0)
      return innerStyle.concat('"');
    else
      return ""
  }

  aceptarAtributos() {
    if(this.editorMode == "insertar")
      this.AddElement(this.currentTag, this.attributesList );
    else
      this.UpdateElement(this.currentIndex, this.attributesList );

    this.setAttributeModalOpen(false)
  }

  aceptarEstilos() {
    this.UpdateStyle(this.currentIndex, this.styleList)    
    this.setStyleModalOpen(false)
  }

  async insertar() {
    if(this.currentTag >= 0) {
      this.attributesList = []
      let el = this
      this.tagSelectable[this.currentTag].attributes.forEach(function(item, index, array){
        el.attributesList.push({ name: item, value: ""})
      })      
      this.editorMode = "insertar"
      this.setAttributeModalOpen(true)
    } else {
      await this.presentToast("top", "Seleccione una etiqueta de la lista desplegable")
    }
  }

  async editarAtributos() {
    if(this.currentIndex < 0) {
      await this.presentToast("top", "Primero inserte una línea de código")
      return
    }    
    
    if(this.DOM[this.currentIndex].type == "containerEnd") {
      await this.presentToast("top", "Seleccione un elemento válido")
      return;
    }

    this.attributesList = this.DOM[this.currentIndex].attributes as Array<any>  
    this.editorMode = "editar"
    this.setAttributeModalOpen(true)
  }

  async editarEstilos() {
    if(this.currentIndex >= 0) {
      this.styleList = []
      let el = this
      let elementStyle = this.DOM[this.currentIndex].style as Array<any>
      // mapea el listado completo de estilos
      this.styleSelectable.forEach(function(item, index, array){  
        // busca el estilo dento del listado de estilos del elemento actual      
        let result =  elementStyle.find(style => {
          return style.name === item
        })
        if(result !== undefined && result.value !== undefined)
          el.styleList.push({ name: item, value: result.value})
        else
          el.styleList.push({ name: item, value: ""})
      })      

      this.setStyleModalOpen(true)
    } else {
      await this.presentToast("top", "Primero inserte una línea de código")
    }
  }  

  handleChange(event: Event) {   
    const value = (event as CustomEvent).detail.value;    
    this.currentTag = value;
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

  async presentAlertConfirm() {
    if (this.currentIndex < 0) {
      await this.presentToast("top", "Primero inserte una línea de código")
      return;
    }      
    
    if (this.DOM[this.currentIndex].type == "containerEnd") {
      await this.presentToast("top", "Seleccione un elemento válido")
      return;
    }

  const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirma esta acción',
      message: '¿Está seguro de eliminar este elemento?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            //console.log('Confirm Cancel: blah');
          },
        },
        {
          text: 'Si',
          handler: async () => {
            if (this.DOM[this.currentIndex].type == "containerStart")
            { 
              let deleteItems = 0                       
              let pair = this.DOM[this.currentIndex].pair
              
              // realiza el conteo de los elementos a eliminar, hasta llegar a la etiqueta de cierre
              for(let i = this.currentIndex; i < this.DOM.length; i++) {                    
                deleteItems++              
                if(this.DOM[i].type == "containerEnd" && this.DOM[i].pair == pair)
                  break 
              }

              this.DOM.splice(this.currentIndex, deleteItems)
            }
            else {
              this.DOM.splice(this.currentIndex, 1)
            }

            if (this.DOM.length == 0) 
              this.currentIndex = -1
            else
              this.currentIndex = 0

            this.pick(this.currentIndex)

            await this.storage.set("editor", this.DOM)
          },
        },
      ],
    });

    await alert.present();
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
