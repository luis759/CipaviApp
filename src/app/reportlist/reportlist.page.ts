import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { IonFab, LoadingController } from '@ionic/angular';
import { MasterService } from '../services/master.service';

import { FileOpener } from '@ionic-native/file-opener/ngx';
@Component({
  selector: 'app-reportlist',
  templateUrl: './reportlist.page.html',
  styleUrls: ['./reportlist.page.scss'],
})
export class ReportlistPage implements OnInit {
  reportesMostrar=[]
  reportesGrabados=[]
  ReporteSeleccionado=0
  empresas=[]
  proyectos=[]
  reponsables=[]
  equipos=[]
  tipoEnviados='enviados'
  enviado={
    limite:0,
    cantidad:0
  };
  tipodereporte=1
 @ViewChild('fab') Fab:IonFab
  constructor(private  ngZone:NgZone,
    private FileOpener:FileOpener,
    private master:MasterService,private loadingController:LoadingController) { }
    seleccionartiporeporte(evento){
      this.ngZone.run(()=>{
        this.tipodereporte=evento.detail.value
        this.segmentChanged({detail:{value:this.tipoEnviados}})
      
      })
    }
  ngOnInit() {
    this.master.storage.getItems(this.master.storage.arrayname.Empresas).then((Empresas)=>{
      if(Empresas){
        this.empresas=Empresas[0]
      }
      this.master.storage.getItems(this.master.storage.arrayname.equipos).then((equipos)=>{
        if(equipos){
          this.equipos=equipos[0]
        }
        this.master.storage.getItems(this.master.storage.arrayname.proyectos).then((proyectos)=>{
          if(proyectos){
            this.proyectos=proyectos[0]
          }
          this.master.storage.getItems(this.master.storage.arrayname.Responsables).then((Responsable)=>{
            if(Responsable){
              this.reponsables=Responsable[0]
            }
            this.ngZone.run(()=>{
              this.segmentChanged({detail:{value:this.tipoEnviados}})
            
            })
            
          })
        })
      })
    })
   
   
   

  }
  segmentChanged(evento){
    this.ngZone.run(()=>{
      this.tipoEnviados=evento.detail.value
      if(this.Fab){
        if(this.Fab.activated.valueOf()){
          this.Fab.close()
          this.tomarValoresactuales()
        }else{
          this.tomarValoresactuales()
        }
      }else{
        this.tomarValoresactuales()
      }
    
    })
   
  }

  tomarValoresactuales(){
    this.ReporteSeleccionado=0
    let array=[]
    this.master.storage.getItems(this.master.storage.arrayname.reporteGeneredos).then((Data)=>{
      this.reportesGrabados=Data[0]
    })
    this.master.storage.getItems(this.master.storage.arrayname.reporteGeneredos).then((Data)=>{
    let Extraccion=[]
    if(Data){
      Extraccion=Data[0]
     
    }
    let valormostrar={
      id:0,
      data:{}
    }
    console.log(Extraccion)
    
    console.log(this.tipodereporte)
    for(var i=0;i<Extraccion.length;i++){
      let valormostrar={
        id:0,
        data:{}
      }
      valormostrar.id=i+1
      valormostrar.data=Extraccion[i]
      let agregar=0
      if(this.tipoEnviados=="enviados"){
        if(Extraccion[i]['enviado']){
          if(Extraccion[i]['idreportes']==0 && this.tipodereporte==1){
            agregar=array.push(valormostrar)
          }else if(Extraccion[i]['idreportes']==this.tipodereporte){
            agregar=array.push(valormostrar)
          }
        }
      }else{
        if(!Extraccion[i]['enviado']){
            if(Extraccion[i]['idreportes']==0 && this.tipodereporte==1){
              agregar =array.push(valormostrar)
            }else if(Extraccion[i]['idreportes']==this.tipodereporte){
              agregar=array.push(valormostrar)
            }
           
        }
      } 
    }
   this.agregarNombreEmpresasGranjasRespon(array)
  })
}
agregarNombreEmpresasGranjasRespon(arrays){
for(var i=0;i<arrays.length;i++){
  for(var j=0;j<this.empresas.length;j++){
    if(this.empresas[j]['IDEMP']==arrays[i]['data']['dataEnviada']['IDEMP']){
      arrays[i]['NombreEmpresa']=this.empresas[j]['RAZON']
    }
  }
  for(var k=0;k<this.equipos.length;k++){
    if((this.equipos[k]['CODIGO']==arrays[i]['data']['dataEnviada']['CODIGO']) && (this.equipos[k]['IDEMP']==arrays[i]['data']['dataEnviada']['IDEMP']) ){
      arrays[i]['EquipoNombre']=this.equipos[k]['NOMBREGLO']
    }
  }
  for(var l=0;l<this.reponsables.length;l++){
    if((this.reponsables[l]['COD']==arrays[i]['data']['dataEnviada']['RESPONSABLE']) && (this.reponsables[k]['IDEMP']==arrays[i]['data']['dataEnviada']['IDEMP']) ){
      arrays[i]['Responsablenombre']=this.reponsables[l]['NOMBRES']
    }
  }
  for(var m=0;m<this.proyectos.length;m++){
    if((this.proyectos[m]['IDPROY']==arrays[i]['data']['dataEnviada']['IDPROY']) && (this.proyectos[m]['IDEMP']==arrays[i]['data']['dataEnviada']['IDEMP']) ){
      arrays[i]['ProyectoNombre']=this.proyectos[m]['NOMBREGLO']
    }
  }
}
  this.reportesMostrar=arrays
}

enviarData(){
  this.master.Load(this.loadingController).then(()=>{
    this.enviado.limite=this.reportesMostrar.length
    this.enviado.cantidad=0
   if(this.enviado.cantidad<this.enviado.limite){
    this.EnviarRegistros(this.reportesMostrar[this.enviado.cantidad]['id']-1)
   }
  })
}
EnviarRegistros(i){
  let valor=this.master.Reportes.Reporte
  valor=this.reportesGrabados[i]['dataEnviada']
  if(!this.reportesGrabados[i]['idreportes'] && this.tipodereporte==1){
    this.enviarReporte1(valor,i)
  }else if(this.reportesGrabados[i]['idreportes']==1){
    this.enviarReporte1(valor,i)
  }else if(this.reportesGrabados[i]['idreportes']==2){
    this.enviarReporte2(valor,i)
  }
  
}
enviarReporte1(valor,i){
  this.master.Reportes.postNewReporte(valor).then((ReporteIngreso)=>{
    if(!ReporteIngreso['correcto'] && ReporteIngreso['data']['status']==-1){
     this.reportesGrabados[i]['enviado']=false
    }else{
      if(ReporteIngreso['correcto']){
        this.reportesGrabados[i]['dataEnviado']=ReporteIngreso['data']
        this.reportesGrabados[i]['enviado']=true
      }else if(ReporteIngreso['correcto'] && ReporteIngreso['mensaje']=="errorapi"){ 
        this.reportesGrabados[i]['dataEnviado']=ReporteIngreso['data']
        this.reportesGrabados[i]['enviado']=true
      }else{
        this.reportesGrabados[i]['enviado']=false
      }
    }
    this.enviado.cantidad=this.enviado.cantidad+1
    if(this.enviado.cantidad<this.enviado.limite){
      this.EnviarRegistros(this.reportesMostrar[this.enviado.cantidad]['id'])
    }else{
      this.GuardarRegistrosDeReportes()
    }
  })
}
enviarReporte2(valor,i){
  this.master.Reportes.postNewReporteTransporteycarga(valor).then((ReporteIngreso)=>{
    if(!ReporteIngreso['correcto'] && ReporteIngreso['data']['status']==-1){
     this.reportesGrabados[i]['enviado']=false
    }else{
      if(ReporteIngreso['correcto']){
        this.reportesGrabados[i]['dataEnviado']=ReporteIngreso['data']
        this.reportesGrabados[i]['enviado']=true
      }else if(ReporteIngreso['correcto'] && ReporteIngreso['mensaje']=="errorapi"){ 
        this.reportesGrabados[i]['dataEnviado']=ReporteIngreso['data']
        this.reportesGrabados[i]['enviado']=true
      }else{
        this.reportesGrabados[i]['enviado']=false
      }
    }
    this.enviado.cantidad=this.enviado.cantidad+1
    if(this.enviado.cantidad<this.enviado.limite){
      this.EnviarRegistros(this.reportesMostrar[this.enviado.cantidad]['id'])
    }else{
      this.GuardarRegistrosDeReportes()
    }
  })
}
GuardarRegistrosDeReportes(){
  this.loadingController.dismiss()
  this.master.storage.DeleteKey(this.master.storage.arrayname.reporteGeneredos).then(()=>{
    this.master.storage.addItem(this.master.storage.arrayname.reporteGeneredos,this.reportesGrabados).then(()=>{
      this.loadingController.dismiss().finally(()=>{
        this.segmentChanged({detail:{value:this.tipoEnviados}})
        this.master.MensajeAlert("Enviados los reportes","Mensajes")
      })
    })
  })

}

borrarReporte(){
  if(this.ReporteSeleccionado>0){
    let borrado=this.reportesGrabados.splice((this.ReporteSeleccionado-1),1)
    this.master.storage.DeleteKey(this.master.storage.arrayname.reporteGeneredos).then(()=>{
      this.master.storage.addItem(this.master.storage.arrayname.reporteGeneredos,this.reportesGrabados).then(()=>{
        this.segmentChanged({detail:{value:this.tipoEnviados}})
          this.master.MensajeAlert("Borrado el Registro","Mensajes")
      })
    })
  }
}
MostrarReporte(){
  if(this.ReporteSeleccionado>0){
    this.master.Load(this.loadingController).then(()=>{
      let valorNORC= this.reportesGrabados[this.ReporteSeleccionado-1]['dataEnviado']['Principal']['NORC']
      let valorIDEMP= this.reportesGrabados[this.ReporteSeleccionado-1]['dataEnviada']['IDEMP']
      this.master.Reportes.download_Reporte_NORC_EMP(valorNORC,valorIDEMP,this.tipodereporte).then((Reporte)=>{
       if(Reporte['success']){
         this.loadingController.dismiss()
         this.FileOpener.open(Reporte['value'], 'application/pdf')
           .then(() =>{ 
           }
           )
           .catch(e => { 
           });
       }else{
        this.loadingController.dismiss().finally(()=>{
          this.master.MensajeAlert("No se pudo Mostrar el Reporte","Mensajes")
        })
       }
      })
    })
  }
}
radioGroupChange(evento){
  this.ReporteSeleccionado=evento.detail.value;
}

}
