import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { of } from 'rxjs';
import { ListviajesPage } from '../modal/listviajes/listviajes.page';
import { MasterService } from '../services/master.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-reportetransmater',
  templateUrl: './reportetransmater.page.html',
  styleUrls: ['./reportetransmater.page.scss'],
})
export class ReportetransmaterPage implements OnInit {
  mostrarinfos=false
  DataForm={
    observaciones:'',
    hora:formatDate(new Date() , 'yyyy-MM-dd HH:mm:ss', 'en'),
    fecha:new Date().toString(),
    galones:0,
    nivelinicial:8,
    nivelfinal:8,
    kilometraje:0,
    empresa:null,
    Proyecto:null,
    Equipo:null,
    viajes:[],
    Responsable:null,
    gasolinaTanqVal:false
  }
  empresas=[]
  Proyectos={
    datatodos:[],
    datas1:[],
    datas2:[]
  }  
  Equipos={
    datatodos:[],
    datas1:[],
    datas2:[]
  }
  Responsables={
    datatodos:[],
    datas1:[],
    datas2:[]
  }
  yearMin=new Date().getFullYear()-15
  yearMax=new Date().getFullYear()+15
  constructor(private master:MasterService ,private modal:ModalController,private loadingController:LoadingController,private storage:StorageService) {
    
   }
    borrarInfodeViajes(){
      this.storage.DeleteKey(this.storage.arrayname.usuarioviajes).then(()=>{
        this.DataForm.viajes=[]
      })
    }
  ngOnInit() {
    this.borrarInfodeViajes()
    this.InicilizarTodo()
  }
  InicilizarTodo(){
    this.master.storage.getItems(this.master.storage.arrayname.Empresas).then((Empresass)=>{
      if(Empresass){
       this.empresas=Empresass[0]
      }else{
       this.empresas=[]
      }
   })
  }

  fecha(){
    if(this.DataForm.empresa){
      this.getDatasProyectos(this.DataForm.empresa['IDEMP'])
    }
  }
  //EMPRESA SECTION
  changeEmpresas(evento){
    let idempres=evento.value['IDEMP']
    let mostrarEquipos=[]
    let mostrarResponsables=[]

    this.Responsables={
      datatodos:[],
      datas1:[],
      datas2:[]
    }
    this.Equipos={
      datatodos:[],
      datas1:[],
      datas2:[]
    }
    this.DataForm.Equipo=null
    this.DataForm.Responsable=null
   this.getDatasProyectos(idempres)
    this.master.storage.getItems(this.master.storage.arrayname.equipos).then((equipos)=>{
      if(equipos){
        for(let i=0;i<equipos[0].length;i++){
          if(equipos[0][i]['IDEMP']==idempres){
            let val=mostrarEquipos.push(equipos[0][i])
          }
        }
        this.Equipos.datatodos=mostrarEquipos
        this.Equipos.datas2=this.Equipos.datas2.concat(this.Equipos.datatodos)
        this.Equipos.datas1=this.Equipos.datatodos.splice(0, this.Equipos.datatodos.length>20?20: this.Equipos.datatodos.length)
      }
    })
    this.master.storage.getItems(this.master.storage.arrayname.Responsables).then((Responsables)=>{
      if(Responsables){
        for(let i=0;i<Responsables[0].length;i++){
          if(Responsables[0][i]['IDEMP']==idempres && Responsables[0][i]['VIGENTE']==1){
            let val=mostrarResponsables.push(Responsables[0][i])
          }
        }
        this.Responsables.datatodos=mostrarResponsables
        this.Responsables.datas2=this.Responsables.datas2.concat(this.Responsables.datatodos)
        this.Responsables.datas1=this.Responsables.datatodos.splice(0, this.Responsables.datatodos.length>20?20: this.Responsables.datatodos.length)

      }
    })
  }
//EMPRESA SECTION

  //PROYECTOS SECTION
  getDatasProyectos(idempres){
    this.master.Load(this.loadingController).then(()=>{
      
      this.mostrarinfos=false  
      let mostrarProyectos=[]
      this.Proyectos={
        datatodos:[],
        datas1:[],
        datas2:[]
      }
      let fechaBusqueda=formatDate(this.DataForm.fecha, 'yyyy-MM-dd', 'en')
      this.master.Proyectos.getAllProyectosVigentes(fechaBusqueda,idempres).then((proyectosCorrecto)=>{
        if(proyectosCorrecto['correcto']){     
          let proyectos=proyectosCorrecto['data']['proyectos']
          mostrarProyectos=proyectos
          if(mostrarProyectos.length>0){
            this.mostrarinfos=true
          }
          this.Proyectos.datatodos=mostrarProyectos
          this.Proyectos.datas2=this.Proyectos.datas2.concat(this.Proyectos.datatodos)
          this.Proyectos.datas1=this.Proyectos.datatodos.splice(0, this.Proyectos.datatodos.length>20?20: this.Proyectos.datatodos.length)
        }
        this.loadingController.dismiss()
      })
    })
  }
  changeProyecto(evento){
  
  }
  seachProyectos(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    let text = event.text.trim().toLowerCase();
    event.component.startSearch();
    if (!text) {
      event.component.items = this.Proyectos.datas1;
      // Enable and start infinite scroll from the beginning.
      event.component.endSearch();
      event.component.enableInfiniteScroll();
      return;
    }
    
    let any=[]
    this.Proyectos.datatodos=any.concat(this.filterPorts(this.Proyectos.datas2, text,"NOMBREGLO"))
    event.component.items = this.filterPorts(this.Proyectos.datatodos, text,"NOMBREGLO").splice(0, this.filterPorts(this.Proyectos.datatodos, text,"NOMBREGLO").length>20?20: this.filterPorts(this.Proyectos.datatodos, text,"NOMBREGLO").length);
    event.component.endSearch();
  }
  getMorePortsProyecto(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    let text = (event.text || '').trim().toLowerCase();
    // There're no more ports - disable infinite scroll.
    if (event.component.items.length >= this.filterPorts(this.Proyectos.datas2, text,"NOMBREGLO").length) {
      event.component.disableInfiniteScroll();
      return;
    }
    
    let any=[]
    console.log(this.Proyectos.datas2.length)
    this.Proyectos.datatodos=any.concat(this.filterPorts(this.Proyectos.datas2, text,"NOMBREGLO"))
    let valor=0
    if((event.component.items.length+20)>this.filterPorts(this.Proyectos.datatodos, text,"NOMBREGLO").length)
    {
      valor=this.filterPorts(this.Proyectos.datatodos, text,"NOMBREGLO").length
    }else{
      valor=20
    }
    let port = event.component.items.concat(this.Proyectos.datatodos.slice(event.component.items.length,valor));
    
    event.component.items = port;
    event.component.endInfiniteScroll();
  }
  //PROYECTOS SECTION
  
  //EQUIPOS SECTION
  changeEquipos(evento){

  }
  seachEquipos(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    let text = event.text.trim().toLowerCase();
    event.component.startSearch();
    if (!text) {
      event.component.items = this.Equipos.datas1;
      // Enable and start infinite scroll from the beginning.
      event.component.endSearch();
      event.component.enableInfiniteScroll();
      return;
    }
    let any=[]
    console.log(this.Equipos.datas2.length)
    this.Equipos.datatodos=any.concat(this.filterPorts(this.Equipos.datas2, text,"NOMBREGLO"))
    event.component.items = this.filterPorts(this.Equipos.datatodos, text,"NOMBREGLO").splice(0, this.filterPorts(this.Equipos.datatodos, text,"NOMBREGLO").length>20?20: this.filterPorts(this.Equipos.datatodos, text,"NOMBREGLO").length);
    event.component.endSearch();
  }
  getMorePortsEquipos(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    let text = (event.text || '').trim().toLowerCase();
    // There're no more ports - disable infinite scroll.
    if (event.component.items.length >= this.filterPorts(this.Equipos.datatodos, text,"NOMBREGLO").length) {
      event.component.disableInfiniteScroll();
      return;
    }
    let any=[]
    console.log(this.Equipos.datas2.length)
    this.Equipos.datatodos=any.concat(this.filterPorts(this.Equipos.datas2, text,"NOMBREGLO"))
    let valor=0
    if((event.component.items.length+20)>this.filterPorts(this.Equipos.datatodos, text,"NOMBREGLO").length)
    {
      valor=this.filterPorts(this.Equipos.datatodos, text,"NOMBREGLO").length
    }else{
      valor=20
    }
    let port = event.component.items.concat(this.Equipos.datatodos.splice(event.component.items.length,valor));
  
  
    event.component.items = port;
    event.component.endInfiniteScroll();
  }
  //EQUIPOS SECTION

  //RESPONSABLE SECTION
  changeResponsable(evento){

  }
  seachResponsale(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    let text = event.text.trim().toLowerCase();
    event.component.startSearch();
    if (!text) {
      event.component.items = this.Responsables.datas1;
      // Enable and start infinite scroll from the beginning.
      event.component.endSearch();
      event.component.enableInfiniteScroll();
      return;
    }
    let any=[]
    this.Responsables.datatodos=any.concat(this.filterPorts(this.Responsables.datas2, text,"NOMBRES"))
    event.component.items = this.filterPorts(this.Responsables.datatodos, text,"NOMBRES").splice(0, this.filterPorts(this.Responsables.datatodos, text,"NOMBRES").length>20?20: this.filterPorts(this.Responsables.datatodos, text,"NOMBRES").length);
    event.component.endSearch();
  }

  getMorePortsResponsale(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    let text = (event.text || '').trim().toLowerCase();
    // There're no more ports - disable infinite scroll.
    if (event.component.items.length >= this.filterPorts(this.Responsables.datatodos, text,"NOMBRES").length) {
      event.component.disableInfiniteScroll();
      return;
    }
    let any=[]
    this.Responsables.datatodos=any.concat(this.filterPorts(this.Responsables.datas2, text,"NOMBRES"))
    let valor=0
    if((event.component.items.length+20)>this.filterPorts(this.Responsables.datatodos, text,"NOMBRES").length)
    {
      valor=this.filterPorts(this.Responsables.datatodos, text,"NOMBRES").length
    }else{
      valor=20
    }
    let port = event.component.items.concat(this.Responsables.datatodos.splice(event.component.items.length,valor));
  
  
    event.component.items = port;
    event.component.endInfiniteScroll();
  }
  //RESPONSABLE SECTION
  //VIAJES 
  async goToListViajes(){
    const modal = await this.modal.create({
      component:  ListviajesPage,
      cssClass: 'my-custom-class'
    });
    modal.onDidDismiss().then(data => {
      this.storage.getItems(this.storage.arrayname.usuarioviajes).then((Viajes)=>{
        if(Viajes){
          this.DataForm.viajes=Viajes[0]
        }else{
          this.DataForm.viajes=[]
        }
      })
    });
    return await modal.present();
  }
  //VIAJEs
  //OTHER SECTION
  filterPorts(ports: any[], text: string,nombrebuscar:string) {
    if(!text){
      return ports
    }else{
      return ports.filter(port => {
        return port[nombrebuscar].toString().toLowerCase().indexOf(text) !== -1;
      });
    }
    
  }
  //OTHER SECTION
  //SECTION REGISTRO
  enviarInfo(){
    this.master.Load(this.loadingController).then(()=>{
      this.storage.getItems(this.storage.arrayname.UsuarioActivo).then((Usuario)=>{
        let valorData=this.master.Reportes.Reporte2
        valorData.CODIGO=this.DataForm.Equipo['CODIGO']
        valorData.RESPONSABLE=this.DataForm.Responsable['COD']
        valorData.IDEMP=this.DataForm.empresa['IDEMP']
        valorData.IDPROY=this.DataForm.Proyecto['IDPROY']
        valorData.DETALLE=JSON.stringify(this.DataForm.viajes)
        valorData.FECHA=formatDate(new  Date(this.DataForm.fecha) , 'yyyy-MM-dd', 'en')
        valorData.GALONESTANQUEADOS=this.DataForm.galones?this.DataForm.galones.toString():''
        valorData.HORATANQUEO=formatDate(this.DataForm.hora , 'yyyy-MM-dd HH:mm:ss', 'en')
        valorData.KILOMETRAJETANQUEO=this.DataForm.kilometraje?this.DataForm.kilometraje.toString():''
        valorData.NIVELCOMBFIN=this.DataForm.nivelfinal.toString()
        valorData.NIVELCOMBINICIO=this.DataForm.nivelinicial.toString()
        valorData.OBSERVA=this.DataForm.observaciones
        valorData.USUARIO=Usuario[0]['Cedula']
        valorData.TANQUEOBOOL=this.DataForm.gasolinaTanqVal?"0":"1"
        this.master.Reportes.postNewReporteTransporteycarga(valorData).then((REporteCreado)=>{
          let ReporteGen=this.master.storage.reportesGenerado
          ReporteGen.dataEnviada=valorData
          ReporteGen.enviado=false
          ReporteGen.idreportes=2
          if(!REporteCreado['correcto'] && REporteCreado['data']['status']==-1){
            this.GuardarRegistroDeReportes(ReporteGen,false,false)
            this.loadingController.dismiss()
          }else{
            if(REporteCreado['correcto']){
              ReporteGen.dataEnviado=REporteCreado['data']
              ReporteGen.enviado=true
              this.GuardarRegistroDeReportes(ReporteGen,true,false)
              this.loadingController.dismiss()
            }else if(REporteCreado['correcto'] && REporteCreado['mensaje']=="errorapi"){ 
              ReporteGen.enviado=true
              ReporteGen.dataEnviado=REporteCreado['data']
              this.GuardarRegistroDeReportes(ReporteGen,true,true)
              this.loadingController.dismiss()
            }else{
              this.GuardarRegistroDeReportes(ReporteGen,false,true)
              this.loadingController.dismiss()
            }
          }
        })
      })
    })
  }
  limpiarData(){

     this.mostrarinfos=false
     this.DataForm={
    observaciones:'',
    hora:formatDate(new Date() , 'yyyy-MM-dd HH:mm:ss', 'en'),
    fecha:new Date().toString(),
    galones:0,
    nivelinicial:8,
    nivelfinal:8,
    kilometraje:0,
    empresa:null,
    Proyecto:null,
    Equipo:null,
    viajes:[],
    Responsable:null,
    gasolinaTanqVal:false
  }
  this.empresas=[]
  this.Proyectos={
    datatodos:[],
    datas1:[],
    datas2:[]
  }  
  this.Equipos={
    datatodos:[],
    datas1:[],
    datas2:[]
  }
  this.Responsables={
    datatodos:[],
    datas1:[],
    datas2:[]
  }
    this.InicilizarTodo()
  }
  GuardarRegistroDeReportes(Report,Enviado,Erroes){
    this.master.storage.getItems(this.master.storage.arrayname.reporteGeneredos).then((Info)=>{
      let Registros=[]
      if(Info){
       Registros=Info[0]
      }
      this.master.storage.DeleteKey(this.master.storage.arrayname.reporteGeneredos).then(()=>{
        let array=Registros
        let valor=array.push(Report)
        this.master.storage.addItem(this.master.storage.arrayname.reporteGeneredos,array).then(()=>{
          if(Enviado){
            this.limpiarData()
            this.master.MensajeAlert("Registro Guardado y Enviado","Reporte Creado")
          }else{
            this.limpiarData()
            this.master.MensajeAlert("Registro Guardado","Reporte Creado")
          }
        })
      })
    })
  }
  validarInfo(){
        if(this.DataForm.empresa){
          if(this.DataForm.Proyecto){
            if(this.DataForm.Responsable){
              if(this.DataForm.Equipo){
                if(this.DataForm.viajes.length>0){
                  if(!this.DataForm.gasolinaTanqVal){
                    this.enviarInfo()
                  }else{
                    if((this.DataForm.kilometraje>0)){
                      if(this.DataForm.galones>=0){
                        this.enviarInfo()
                      }else{
                        this.master.toastMensaje("lo galones tanqueados no pueden ser menor a 0",1500)
                      }
                    }else{
                      this.master.toastMensaje("el kilometraje debe ser mayor a 0",1500)
                    }
                  }
                }else{
                  this.master.toastMensaje("Debes colocar al menos un viaje",1500)
                }
               
              }else{
                this.master.toastMensaje("Debe seleccionar al menos un equipo",1500)
              }
            }else{
              this.master.toastMensaje("Debe seleccionar al menos un responsable",1500)
            }
          }else{
            this.master.toastMensaje("Debe seleccionar al menos un proyecto",1500)
          }
        }else{
          this.master.toastMensaje("Debe seleccionar al menos una empresa",1500)
        }
  }
  //SECTION REGISTRO
}
