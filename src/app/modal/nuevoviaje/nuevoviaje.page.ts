import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MasterService } from 'src/app/services/master.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-nuevoviaje',
  templateUrl: './nuevoviaje.page.html',
  styleUrls: ['./nuevoviaje.page.scss'],
})
export class NuevoviajePage implements OnInit {
  datasViajes=[]
  DataForm={
    carga:'',
    lugardecargue:'',
    horasalida:formatDate(new Date() , 'yyyy-MM-dd HH:mm:ss', 'en'),
    kilometrajesalida:0,
    lugardescargue:'',
    horalleguada:formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en'),
    kilometrajelleguada:0,
    volumenmtr:0,
    nroviaje:0
  }
  constructor(private moda:ModalController,private storage:StorageService,private master:MasterService) { }
  ngOnInit() {
    let fecha=new Date()
    let valor=fecha.setMinutes(0)
    this.DataForm.horasalida=formatDate(fecha , 'yyyy-MM-dd HH:mm:ss', 'en')
     valor=fecha.setMinutes(15)
     this.DataForm.horalleguada=formatDate(fecha , 'yyyy-MM-dd HH:mm:ss', 'en')
    this.storage.getItems(this.storage.arrayname.usuarioviajes).then((Viajes)=>{
      if(Viajes){
        this.datasViajes=Viajes[0]
        if(this.datasViajes.length>9){
          let data = { 'error': 'Ya no puede agregar mas viajes' };
          this.moda.dismiss(data);
        }else{
          this.DataForm.nroviaje=this.datasViajes.length+1
        }
      }else{
        this.DataForm.nroviaje=1
      }
      
    })
  }
  closeModal(){
    let data = { 'retorno': 'bar' };
    this.moda.dismiss(data);
}
cerrarModalAction(){
  this.closeModal()
}
  guardarData(){
    let envioDataDetalle=this.master.Reportes.DetallesReporte2
    envioDataDetalle.CARGA=this.DataForm.carga
    envioDataDetalle.HORALLEGADA=formatDate(new  Date(this.DataForm.horalleguada) , 'yyyy-MM-dd HH:mm:ss', 'en')
    envioDataDetalle.HORASALIDA=formatDate(new  Date(this.DataForm.horasalida) , 'yyyy-MM-dd HH:mm:ss', 'en')
    envioDataDetalle.KILOMLLEGADA=this.DataForm.kilometrajelleguada
    envioDataDetalle.KILOMSALIDA=this.DataForm.kilometrajesalida
    envioDataDetalle.LUGARCARGUE=this.DataForm.lugardecargue
    envioDataDetalle.LUGARDESCARGUE=this.DataForm.lugardescargue
    envioDataDetalle.NOVIAJE=this.DataForm.nroviaje
    envioDataDetalle.VOLUMENMT3=this.DataForm.volumenmtr
    let valor=this.datasViajes.push(envioDataDetalle)
    console.log(this.datasViajes)
    this.storage.DeleteKey(this.storage.arrayname.usuarioviajes).then(()=>{
      this.storage.addItem(this.storage.arrayname.usuarioviajes,this.datasViajes).then(()=>{
        let dataRetorno = { 'succes': 'Se ah registrado correctamente el viaje' };
        this.moda.dismiss(dataRetorno)
      })
    })
  }
  validarInfo(){
    if(this.DataForm.carga){
      if(this.DataForm.carga.length<100){
        if(this.DataForm.lugardecargue){
          if(this.DataForm.lugardecargue.length<100){
            if(this.DataForm.lugardescargue){
              if(this.DataForm.lugardescargue.length<100){
                if(this.DataForm.kilometrajelleguada>0){
                  if(this.DataForm.kilometrajesalida>0){
                    if(this.DataForm.volumenmtr>=0){
                      if(this.DataForm.kilometrajesalida>=this.DataForm.kilometrajelleguada){
                        this.master.toastMensaje("el Kilometraje de salida no puede ser mayor al de llegada",1500)
                      }else{
                        if(new Date(formatDate(this.DataForm.horasalida , 'yyyy-MM-dd HH:mm:ss', 'en'))>new Date(formatDate(this.DataForm.horalleguada , 'yyyy-MM-dd HH:mm:ss', 'en'))){
                          this.master.toastMensaje("la hora de salida no puede ser mayor a la de lleguada",1500)
                        }else{
                          this.guardarData()
                        }
                      }
                    }else{
                      this.master.toastMensaje("No debe ser menor a 0 en el volumen metricos",1500)
                    }
                  }else{
                    this.master.toastMensaje("No debe ser menor a 0 en el kilometraje de salida",1500)
                  }
                }else{
                  this.master.toastMensaje("No debe ser menor a 0 en el kilometraje de llegada",1500)
                }
              }else{
                this.master.toastMensaje("No debe sobrepasar la cantidad de 100 caracteres en lugar de descargue",1500)
              }
            }else{
              this.master.toastMensaje("Debe colocar un lugar de descargue al menos",1500)
            }
          }else{
            this.master.toastMensaje("No debe sobrepasar la cantidad de 100 caracteres en lugar de cargue",1500)
          }
        }else{
          this.master.toastMensaje("Debe colocar un lugar de cargue al menos",1500)
        } 
      }else{
        this.master.toastMensaje("No debe sobrepasar la cantidad de 100 caracteres en carga",1500)
      }
    }else{
      this.master.toastMensaje("Debe colocar una carga al menos",1500)
    } 
    
  }
}
