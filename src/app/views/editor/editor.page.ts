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
  isModalOpen = false;  
  isModalAttrOpen = false;
  customActionSheetOptions = {
    header: 'Etiquetas',
    subHeader: 'Agrega una etiqueta al documento',
  };

  public insertMode = "outside"
  public insertModeIcon = "return-down-forward-outline"
  
  public attributes:Array<string> = [];
  public attributesValues:Array<string> = [];

  public lines = ['<html>','  <head></head>','  <body>',' </body>','</html>']
  public currentIndex = 0;
  public currentElement = -1;
  public componentIndex = 1;
  public elements = [
    { name: "<div>", type:"block", tag: "div", attributes: ["texto", "style", "class"] },
    { name: "<p>", type:"block", tag: "p", attributes: ["texto", "style", "class"] },
    { name: "<span>", type:"block", tag: "span", attributes: ["texto", "style", "class"] },
    { name: "<h1>", type:"block", tag: "h1", attributes: ["texto", "style", "class"] },
    { name: "<h2>", type:"block", tag: "h2", attributes: ["texto", "style", "class"] },
    { name: "<h3>", type:"block", tag: "h3", attributes: ["texto", "style", "class"] },
    { name: "<a>", type:"block", tag: "a", attributes: ["texto", "style", "class", "href", "target"] },
    { name: "<i>", type:"block", tag: "i", attributes: ["texto", "style", "class"] },
    { name: "<b>", type:"block", tag: "b", attributes: ["texto", "style", "class"] },
    { name: "<u>", type:"block", tag: "u", attributes: ["texto", "style", "class"]},
    { name: "<q>", type:"block", tag: "q", attributes: ["texto", "style", "class"]},
    { name: "<del>", type:"block", tag: "del", attributes: ["texto", "style", "class"]},
    { name: "<sub>", type:"block", tag: "sub", attributes: ["texto", "style", "class"]},
    { name: "<sup>", type:"block", tag: "sup", attributes: ["texto", "style", "class"]},
    { name: "<br>", type:"line", tag: "<br>", attributes: ["texto", "style", "class"]},
    { name: "<ul>", type:"block", tag: "ul", attributes: ["texto", "style", "class"]},
    { name: "<ol>", type:"block", tag: "ol", attributes: ["texto", "style", "class"]},
    { name: "<li>", type:"block", tag: "li", attributes: ["texto", "style", "class"]},
    { name: "<table>", type:"block", tag: "table", attributes: ["texto", "style", "class"]},
    { name: "<th>", type:"block", tag: "th", attributes: ["texto", "style", "class"]},
    { name: "<tr>", type:"block", tag: "tr", attributes: ["texto", "style", "class"]},
    { name: "<td>", type:"block", tag: "td", attributes: ["texto", "style", "class"]},
    { name: "<label>", type:"block", tag: "label", attributes: ["texto", "style", "class"]},
    { name: "<input>", type:"line", tag: "input", attributes: ["type", "value", "placeholder", "style", "class"]},
    { name: "<button>", type:"block", tag: "button", attributes: ["texto", "style", "class"]},
    { name: "<textarea>", type:"block", tag: "textarea", attributes: ["texto", "style", "class"]},
    { name: "<select>", type:"block", tag: "select", attributes: ["texto", "style", "class"]},
    { name: "<option>", type:"block", tag: "option", attributes: ["texto", "style", "class"]},
    { name: "<optgroup>", type:"block", tag: "optgroup", attributes: ["texto", "style", "class"]},
    { name: "<fieldset>", type:"block", tag: "fieldset", attributes: ["texto", "style", "class"]},
    { name: "<legend>", type:"block", tag: "legend", attributes: ["texto", "style", "class"]},
    { name: "<marquee>", type:"block", tag: "marquee", attributes: ["texto", "style", "class"]},
  ]

  public combobox: Array<string> = []
  
  public DOM: Array<any> = []

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

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'Important message',
      message: 'This is an alert!',
      buttons: ['OK']
    });

    await alert.present();
  }

  async AddInput() {   
    this.currentElement = 23;
    this.attributes = this.elements[this.currentElement].attributes ?? []
    this.attributesValues = []

    this.setModalAttrOpen(true)     
  }

  async AddH1() {    
    await this.AddElement(3, "Título " + this.componentIndex, "")
  }

  async AddParagraph() {    
    await this.AddElement(1, "Párrafo " + this.componentIndex, "")
  }

  async AddDiv() {    
    await this.AddElement(0, "...", "")
  }

  async AddElement(i: number, text: string, attributes:string)
  {
    var html = ""

    if(this.elements[i].type == "block")
      html = html.concat("<", this.elements[i].tag, attributes, ">", text, "</", this.elements[i].tag, ">")
    else
      html = html.concat("<", this.elements[i].tag, attributes, "/>")
    
    this.componentIndex++    

    var currentTab = 0;
    if(this.DOM.length > 0) currentTab = this.DOM[this.currentIndex].tab;

    if(this.DOM.length > 0 && this.DOM[this.currentIndex].type == "block" && this.insertMode == "inside" )
    {      
      var containerTag = this.DOM[this.currentIndex].tag  
      var containerAttr = this.DOM[this.currentIndex].attributes 
      var tab = " ".repeat(currentTab)    
      var inner = ""

      this.DOM.splice(this.currentIndex, 1)

      inner = "".concat(tab, "<", containerTag, containerAttr, ">")
      this.DOM.splice(this.currentIndex, 0, { html: inner, active: true, type: "inline", tag: this.elements[i].tag, tab: currentTab, attributes: attributes })
            
      html = " ".repeat(currentTab+1) + html
      this.DOM.splice(this.currentIndex+1, 0, { html: html, active: true, type: this.elements[i].type, tag: this.elements[i].tag, tab: currentTab+1, attributes: attributes  })

      inner = "".concat(tab, "</", containerTag, ">")
      this.DOM.splice(this.currentIndex+2, 0, { html: inner, active: true, type: "inline", tag: this.elements[i].tag, tab: currentTab, attributes: attributes  })
    }
    else {
      this.DOM.splice(this.currentIndex+1, 0, { html: html, active: true, type: this.elements[i].type, tag: this.elements[i].tag, tab: currentTab, attributes: attributes  })
    }

    this.currentIndex++

    if(this.DOM.length == this.currentIndex)
      this.pick(this.currentIndex-1)
    else
      this.pick(this.currentIndex)
  }

  aceptar() {
    var text = ""
    var attr = " "
    var el = this

    this.attributes.forEach(function(item, index, array) {     
      let val = el.attributesValues[Number(index)]
      if (val !== undefined) {   
        if (item == "texto" )        
          text = val
        else
          attr = attr.concat(item,'="', val ,'" ')
      }
    })

    this.AddElement(this.currentElement, text, attr.trimEnd() );
    this.setModalAttrOpen(false)
  }

  async insertar() {
    if(this.currentElement >= 0)
    {
      this.attributes = this.elements[this.currentElement].attributes ?? []
      this.attributesValues = []
      this.setModalAttrOpen(true)
    } else {
      await this.presentToast("top", "Seleccione una etiqueta de la lista desplegable")
    }
  }

  handleChange(event: Event) {   
    const value = (event as CustomEvent).detail.value;    
    this.currentElement = value;
  }

  removeInput(index:number):void{
    this.attributes.splice(index, 1);
    this.attributesValues.splice(index, 1);
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

  setOpen(isOpen: boolean) {

    var el = this
    el.innerHTML.html = ""
    this.DOM.forEach(function(item, index, array) {       
      el.innerHTML.html += item.html
    })

    this.trustedHTML = this.sanitizer.bypassSecurityTrustHtml(el.innerHTML.html);

    this.isModalOpen = isOpen;
  }

  setModalAttrOpen(isOpen: boolean) {
    this.isModalAttrOpen = isOpen;
  }

}
