import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { MenuPage } from '../menu/menu.page';
import { MasterService } from '../services/master.service';

import { IonicSelectableComponent } from 'ionic-selectable';
import { formatDate } from '@angular/common';
@Component({
  selector: 'app-reportgene',
  templateUrl: './reportgene.page.html',
  styleUrls: ['./reportgene.page.scss'],
})
export class ReportgenePage implements OnInit {
  DataForm={
    observaciones:'',
    startdate:formatDate(new Date() , 'yyyy-MM-dd HH:mm:ss', 'en'),
    enddate:formatDate(new Date() , 'yyyy-MM-dd HH:mm:ss', 'en'),
    fecha:new Date().toString(),
    inicialodo:0,
    finalodo:0,
    galones:0,
    litrosaceite:0,
    empresa:null,
    Proyecto:null,
    Equipo:null,
    Responsable:null
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
  tiemposs=[]
  mostrarinfos=false
  constructor(private master:MasterService,
    private loadingController:LoadingController,
    private navcontroll:NavController,
    private menu:MenuPage) { }
    limpiarData(){
      this.DataForm={
        observaciones:'',
        startdate:formatDate(new Date() , 'yyyy-MM-dd HH:mm:ss', 'en'),
        enddate:formatDate(new Date() , 'yyyy-MM-dd HH:mm:ss', 'en'),
        fecha:new Date().toString(),
        inicialodo:0,
        finalodo:0,
        galones:0,
        litrosaceite:0,
        empresa:null,
        Proyecto:null,
        Equipo:null,
        Responsable:null
      }
      this.empresas=[]
      this. Proyectos={
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
      this.tiemposs=[]
      this.InicilizarTodo()
    }
  ngOnInit() {
    this.menu.activarmenuDesactivar(false);
    this.InicilizarTodo()
  }
  fecha(){
    if(this.DataForm.empresa){
      this.getDatasProyectos(this.DataForm.empresa['IDEMP'])
    }
  }
  ngOnDestroy(){
    this.menu.activarmenuDesactivar(true);
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
  agregarTiempo(){
    let time=new Date(this.DataForm.enddate).getTime()-new Date(this.DataForm.startdate).getTime()
    let valorhoras=time/(1000 * 3600)
    console.log(new Date(formatDate(this.DataForm.enddate , 'yyyy-MM-dd HH:mm:ss', 'en')))
    console.log(new Date(formatDate(this.DataForm.startdate , 'yyyy-MM-dd HH:mm:ss', 'en')))
    if(new Date(formatDate(this.DataForm.enddate , 'yyyy-MM-dd HH:mm:ss', 'en'))>new Date(formatDate(this.DataForm.startdate , 'yyyy-MM-dd HH:mm:ss', 'en'))){
      if(valorhoras>0){
        let fechas={
          HORADESDE:formatDate(new  Date(this.DataForm.startdate) , 'yyyy-MM-dd HH:mm:ss', 'en'),
          HORAHASTA:formatDate(new  Date(this.DataForm.enddate) , 'yyyy-MM-dd HH:mm:ss', 'en'),
          HORAS:valorhoras
        }
        let tiempo=this.tiemposs.push(fechas)
        this.DataForm.startdate=formatDate(new Date() , 'yyyy-MM-dd HH:mm:ss', 'en')
        this.DataForm.enddate=formatDate(new Date() , 'yyyy-MM-dd HH:mm:ss', 'en')
        this.master.toastMensaje("Agregado Correctamente",1500)
      }else{
        this.master.toastMensaje("Debe haber almenos 1 hora de diferencia",1500)
      }
    }else{
      this.master.toastMensaje("La hora final debe ser mayor que la de inicio",1500)
    }
   

  }
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
          if(Responsables[0][i]['IDEMP']==idempres){
            let val=mostrarResponsables.push(Responsables[0][i])
          }
        }
        this.Responsables.datatodos=mostrarResponsables
        this.Responsables.datas2=this.Responsables.datas2.concat(this.Responsables.datatodos)
        this.Responsables.datas1=this.Responsables.datatodos.splice(0, this.Responsables.datatodos.length>20?20: this.Responsables.datatodos.length)

      }
    })
  }
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
  changeEquipos(evento){

  }
  changeResponsable(evento){

  }
  
  borrarTiempos(Valor){
    let data=this.tiemposs.splice(Valor,1)
    this.master.toastMensaje("Tiempo Borrado",1500)
  }
  ValidarRegistro(){
      if(this.DataForm.empresa){
        if(this.DataForm.Equipo){
          if(this.DataForm.Proyecto){
            if(this.DataForm.Responsable){
              if(this.tiemposs.length>0){
                 if(this.DataForm.litrosaceite>=0 || !this.DataForm.litrosaceite){
                  if(this.DataForm.galones>=0 || !this.DataForm.galones){
                    this.GenerarReporte()
                  }else{
                   this.master.toastMensaje("Los galones de aceite no puede ser negativo",2000)
                  }
                 }else{
                  this.master.toastMensaje("Los galones de combustibles no puede ser negativo",2000)
                 }
              }else{
                this.master.toastMensaje("Debe seleccionar al menos una hora trabajada",2000)
              }
            }else{
              this.master.toastMensaje("Debe seleccionar al menos un Reponsable",2000)
            }   
          }else{
            this.master.toastMensaje("Debe seleccionar al menos un proyecto",2000)
          }   
        }else{
          this.master.toastMensaje("Debe seleccionar al menos un Equipo",2000)
        }   
      }else{
        this.master.toastMensaje("Debe seleccionar al menos una empresa",2000)
      }   
  }
  GenerarReporte(){
    this.master.Load(this.loadingController).then(()=>{
      let valorhoras=0
      let envioData=this.master.Reportes.Reporte
      for(let x=0;x<this.tiemposs.length;x++){
        valorhoras=this.tiemposs[x]['HORAS']+valorhoras
      }
      this.master.storage.getItems(this.master.storage.arrayname.UsuarioActivo).then((Usuario)=>{
        envioData.ACEITE=this.DataForm.litrosaceite?this.DataForm.litrosaceite.toString():''
        envioData.CODIGO=this.DataForm.Equipo['CODIGO']
        envioData.FECHA=formatDate(new  Date(this.DataForm.fecha) , 'yyyy-MM-dd', 'en')
        envioData.TIEMPOS=JSON.stringify(this.tiemposs)
        envioData.GALONES=this.DataForm.galones?this.DataForm.galones.toString():''
        envioData.HORAS=valorhoras.toString()
        envioData.IDEMP=this.DataForm.empresa['IDEMP']
        envioData.IDPROY=this.DataForm.Proyecto['IDPROY']
        envioData.LECFIN=this.DataForm.finalodo.toString()
        envioData.LECINI=this.DataForm.inicialodo.toString()
        envioData.OBSERVA=this.DataForm.observaciones
        envioData.RESPONSABLE=this.DataForm.Responsable['COD']
        envioData.USUARIO=Usuario[0]['Cedula']
        this.master.Reportes.postNewReporte(envioData).then((REporteCreado)=>{
          let ReporteGen=this.master.storage.reportesGenerado
          ReporteGen.dataEnviada=envioData
          ReporteGen.enviado=false
          ReporteGen.idreportes=1
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

  filterPorts(ports: any[], text: string,nombrebuscar:string) {
    if(!text){
      return ports
    }else{
      return ports.filter(port => {
        return port[nombrebuscar].toString().toLowerCase().indexOf(text) !== -1;
      });
    }
    
  }
}
