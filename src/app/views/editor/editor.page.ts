import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import { IonReorderGroup, ItemReorderEventDetail } from '@ionic/angular';
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
  public insertMode = "outside"
  public insertModeIcon = "return-down-forward-outline"
  
  public lines = ['<html>','  <head></head>','  <body>',' </body>','</html>']
  public currentIndex = 0;
  public componentIndex = 1;
  public elements = [
    { name: "<div>", type:"block", tag: "div"},
    { name: "<p>", type:"block", tag: "p"},
    { name: "<span>", type:"block", tag: "span"},
    { name: "<h1>", type:"block", tag: "h1"},
    { name: "<h2>", type:"block", tag: "h2"},
    { name: "<h3>", type:"block", tag: "h3"},
    { name: "<a>", type:"block", tag: "a"},
    { name: "<i>", type:"block", tag: "i"},
    { name: "<b>", type:"block", tag: "b"},
    { name: "<u>", type:"block", tag: "u"},
    { name: "<q>", type:"block", tag: "q"},
    { name: "<del>", type:"block", tag: "del"},
    { name: "<sub>", type:"block", tag: "sub"},
    { name: "<sup>", type:"block", tag: "sup"},
    { name: "<br>", type:"line", tag: "<br>"},
    { name: "<ul>", type:"block", tag: "ul"},
    { name: "<ol>", type:"block", tag: "ol"},
    { name: "<li>", type:"block", tag: "li"},
    { name: "<table>", type:"block", tag: "table"},
    { name: "<th>", type:"block", tag: "th"},
    { name: "<tr>", type:"block", tag: "tr"},
    { name: "<td>", type:"block", tag: "td"},
    { name: "<label>", type:"block", tag: "label"},
    { name: "<input>", type:"line", tag: "input"},
    { name: "<button>", type:"block", tag: "button"},
    { name: "<textarea>", type:"block", tag: "textarea"},
    { name: "<select>", type:"block", tag: "select"},
    { name: "<option>", type:"block", tag: "option"},
    { name: "<optgroup>", type:"block", tag: "optgroup"},
    { name: "<fieldset>", type:"block", tag: "fieldset"},
    { name: "<legend>", type:"block", tag: "legend"},
    { name: "<marquee>", type:"block", tag: "marquee"},
  ]

  public combobox: Array<string> = []
  
  public DOM: Array<any> = []

  constructor(private alertController: AlertController, private _sanitizer: DomSanitizer, private toast: ToastController) {
    this.sanitizer = _sanitizer;
    this.trustedHTML = this.sanitizer.bypassSecurityTrustHtml(this.innerHTML.html);

    var el = this;
    this.elements.forEach(function(item, key, index) {       
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
    await this.AddElement(23, "", ['type="text"', 'placeholder="Ingresa texto aquí..."'])
  }

  async AddH1() {    
    await this.AddElement(3, "Título " + this.componentIndex, [])
  }

  async AddParagraph() {    
    await this.AddElement(1, "Párrafo " + this.componentIndex, [])
  }

  async AddDiv() {    
    await this.AddElement(0, "...", [])
  }

  async AddElement(i: number, text: string, attr:string [])
  {
    var html = ""
    var attributes = ""

    attr.forEach(function(item, key, index) {       
      attributes = attributes.concat(" ", item)
    })

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

  handleChange(event: Event) {   
    try { 
    const value = (event as CustomEvent).detail.value;
    this.AddElement(value, "", []) 
    } catch(ex) {}  
  }

  handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    // The `from` and `to` properties contain the index of the item
    // when the drag started and ended, respectively
    //console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);

    const draggedItem = this.lines.splice(ev.detail.from, 1)[0];  
    this.lines.splice(ev.detail.to, 0, draggedItem); 

    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. This method can also be called directly
    // by the reorder group
    ev.detail.complete();
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
      this.DOM.forEach(function(item, key, index) {       
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
    this.DOM.forEach(function(item, key, index) {       
      el.innerHTML.html += item.html
    })

    this.trustedHTML = this.sanitizer.bypassSecurityTrustHtml(el.innerHTML.html);

    this.isModalOpen = isOpen;
  }

}
