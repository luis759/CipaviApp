import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { LoadingController } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { MasterService } from '../services/master.service';
@Component({
  selector: 'app-allreport',
  templateUrl: './allreport.page.html',
  styleUrls: ['./allreport.page.scss'],
})
export class AllreportPage implements OnInit {
  desde=new Date();
  hasta=new Date(); 
  reportesMostrar=[]
  ReporteSeleccionado=0
  empresas=[]
  proyectos=[]
  reponsables=[]
  equipos=[]
  Equiposs={
    datatodos:[],
    datas1:[],
    datas2:[]
  }
  Equipo:{}
  empresa:{}
  tipodereporte=1;
  constructor(private DatePicker:DatePicker,private master:MasterService ,private loadingController:LoadingController,private FileOpener:FileOpener) { }
  seleccionartiporeporte(evento){
    this.tipodereporte=evento.detail.value
  }
  ngOnInit() {
    this.master.storage.getItems(this.master.storage.arrayname.Empresas).then((Empresas)=>{
      if(Empresas){
        this.empresas=Empresas[0]
      }
    })
    this.master.storage.getItems(this.master.storage.arrayname.proyectos).then((proyectos)=>{
      if(proyectos){
        this.proyectos=proyectos[0]
      }
    })
    this.master.storage.getItems(this.master.storage.arrayname.Responsables).then((Responsable)=>{
      if(Responsable){
        this.reponsables=Responsable[0]
      }
    })
    this.master.storage.getItems(this.master.storage.arrayname.equipos).then((equipos)=>{
      if(equipos){
        this.equipos=equipos[0]
      }
    })
  }
  searchProyect(){
    if(this.empresa){
      if(this.Equipo){
      this.master.Load(this.loadingController).then(()=>{
        this.master.Reportes.get_reportes_by_IDEMP_CODIGO_DESDEYHASTA(this.empresa['IDEMP'],this.Equipo['CODIGO'],formatDate(new  Date(this.desde) , 'yyyy-MM-dd', 'en'),formatDate(new  Date(this.hasta) , 'yyyy-MM-dd', 'en'),this.tipodereporte.toString()).then((Reportes)=>{
          if(Reportes['correcto']){
             let array=Reportes['data']['Reportes']
             this.agregarNombreEmpresasGranjasRespon(array)
           }else{
            this.loadingController.dismiss()
    
           }
        })
         
        })
      }else{
        this.master.toastMensaje("Debe Seleccionar un Equipo",1000)
      }
    }else{
      this.master.toastMensaje("Debe Seleccionar una empresa",1000)
    }
    
  }

  radioGroupChange(evento){
    this.ReporteSeleccionado=evento.detail.value;
  }
  MostrarReporte(){
    if(this.ReporteSeleccionado>0){
      this.master.Load(this.loadingController).then(()=>{
        let valorNORC= this.reportesMostrar[this.ReporteSeleccionado-1]['NORC']
        let valorIDEMP= this.reportesMostrar[this.ReporteSeleccionado-1]['IDEMP']
        let tipo= this.reportesMostrar[this.ReporteSeleccionado-1]['tipo']
        this.master.Reportes.download_Reporte_NORC_EMP(valorNORC,valorIDEMP,tipo).then((Reporte)=>{
         if(Reporte['success']){
           this.loadingController.dismiss()
          this.mostrarReportespdf(Reporte['value'])
         }else{
          this.loadingController.dismiss().finally(()=>{
            this.master.MensajeAlert("No se pudo Mostrar el Reporte","Mensajes")
          })
         }
        })
      })
    }else{
      this.master.toastMensaje('Debe seleccionar un reporte al menos',1500)
    }
  }
  mostrarReportespdf(valor){
    this.FileOpener.open(valor, 'application/pdf')
    .then(() =>{ 
    }
    )
    .catch(e => { 
    });
  }
  agregarNombreEmpresasGranjasRespon(arrays){
    for(var i=0;i<arrays.length;i++){
      for(var j=0;j<this.empresas.length;j++){
        if(this.empresas[j]['IDEMP']==arrays[i]['IDEMP']){
          arrays[i]['NombreEmpresa']=this.empresas[j]['RAZON']
        }
      }
      for(var k=0;k<this.equipos.length;k++){
        if((this.equipos[k]['CODIGO']==arrays[i]['CODIGO']) && (this.equipos[k]['IDEMP']==arrays[i]['IDEMP']) ){
          arrays[i]['EquipoNombre']=this.equipos[k]['NOMBREGLO']
        }
      }
      for(var l=0;l<this.reponsables.length;l++){
        if((this.reponsables[l]['COD']==arrays[i]['RESPONSABLE']) && (this.reponsables[k]['IDEMP']==arrays[i]['IDEMP']) ){
          arrays[i]['Responsablenombre']=this.reponsables[l]['NOMBRES']
        }
      }
      for(var m=0;m<this.proyectos.length;m++){
        if((this.proyectos[m]['IDPROY']==arrays[i]['IDPROY']) && (this.proyectos[m]['IDEMP']==arrays[i]['IDEMP']) ){
          arrays[i]['ProyectoNombre']=this.proyectos[m]['NOMBREGLO']
        }
      }
      arrays[i]['tipo']=this.tipodereporte
      arrays[i]['id']=i+1
    }
      this.reportesMostrar=arrays
      this.loadingController.dismiss()
    }
  checkDesde(){
    this.DatePicker.show({
      date: this.desde,
      mode: 'date',
      androidTheme: this.DatePicker.ANDROID_THEMES.THEME_HOLO_LIGHT   }).then(
      date => this.desde=date,
      err => console.log('Error occurred while getting date: ', err)
    );
  }
  checkHasta(){
    this.DatePicker.show({
      date: this.hasta,
      mode: 'date',
      androidTheme: this.DatePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
    }).then(
      date => this.hasta=date,
      err => console.log('Error occurred while getting date: ', err)
    );
  }
  seachEquipos(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    let text = event.text.trim().toLowerCase();
    event.component.startSearch();
    if (!text) {
      event.component.items = this.Equiposs.datas1;
      // Enable and start infinite scroll from the beginning.
      event.component.endSearch();
      event.component.enableInfiniteScroll();
      return;
    }
    let any=[]
    this.Equiposs.datatodos=any.concat(this.filterPorts(this.Equiposs.datas2, text,"NOMBREGLO"))
    event.component.items = this.filterPorts(this.Equiposs.datatodos, text,"NOMBREGLO").splice(0, this.filterPorts(this.Equiposs.datatodos, text,"NOMBREGLO").length>20?20: this.filterPorts(this.Equiposs.datatodos, text,"NOMBREGLO").length);
    event.component.endSearch();
  }
  getMorePortsEquipos(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    let text = (event.text || '').trim().toLowerCase();
    // There're no more ports - disable infinite scroll.
    if (event.component.items.length >= this.filterPorts(this.Equiposs.datatodos, text,"NOMBREGLO").length) {
      event.component.disableInfiniteScroll();
      return;
    }
    let any=[]
    this.Equiposs.datatodos=any.concat(this.filterPorts(this.Equiposs.datas2, text,"NOMBREGLO"))
    let valor=0
    if((event.component.items.length+20)>this.filterPorts(this.Equiposs.datatodos, text,"NOMBREGLO").length)
    {
      valor=this.filterPorts(this.Equiposs.datatodos, text,"NOMBREGLO").length
    }else{
      valor=20
    }
    let port = event.component.items.concat(this.Equiposs.datas2.splice(event.component.items.length,valor));
  
  
    event.component.items = port;
    event.component.endInfiniteScroll();
  }

  filterPorts(ports: any[], text: string,nombrebuscar:string) {
    if(!text){
      return ports
    }else{
      return ports.filter(port => {
        return port[nombrebuscar].toString().toLowerCase().indexOf(text) !== -1;
      });
    }
    
  }
  changeEquipos(evento){

  }
  changeEmpresas(evento){
    let idempres=evento.value['IDEMP']
    let mostrarEquipos=[]
    this.Equiposs={
      datatodos:[],
      datas1:[],
      datas2:[]
    }
    this.Equipo={}
    this.master.storage.getItems(this.master.storage.arrayname.equipos).then((equipos)=>{
      if(equipos){
        for(let i=0;i<equipos[0].length;i++){
          if(equipos[0][i]['IDEMP']==idempres){
            let val=mostrarEquipos.push(equipos[0][i])
          }
        }
        this.Equiposs.datatodos=mostrarEquipos
        this.Equiposs.datas2=this.Equiposs.datas2.concat(this.Equiposs.datatodos)
        this.Equiposs.datas1=this.Equiposs.datatodos.splice(0, this.Equiposs.datatodos.length>20?20: this.Equiposs.datatodos.length)
      }
    })
    
  }
}
