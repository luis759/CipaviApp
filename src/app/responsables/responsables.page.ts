import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { MasterService } from '../services/master.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-responsables',
  templateUrl: './responsables.page.html',
  styleUrls: ['./responsables.page.scss'],
})
export class ResponsablesPage implements OnInit {
  DataForm={
    CEDULA:'',
    NOMBRES:'',
    empresa:null
  }
  empresas=[]
  constructor(private master:MasterService,private Storage:StorageService,private alert:AlertController,private loading:LoadingController) { }

  ngOnInit() {
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
  validarData(){
    if(this.DataForm.NOMBRES){
      if(this.DataForm.NOMBRES.length>0){
          if(this.DataForm.empresa){
                if(this.DataForm.CEDULA){
                  if(this.DataForm.CEDULA.toString().length>0){
                    this.enviarData();
                  }else{
                    this.master.toastMensaje("Debes colocar por lo menos una cedula",1000)
                  }
                }else{
                  this.master.toastMensaje("Debes colocar por lo menos una cedula",1000)
                }           
          }else{
            this.master.toastMensaje("Debes seleccionar una empresa",1000)
          }
      }else{
        this.master.toastMensaje("Debes colocar por lo menos texto en el nombre",1000)
      }
    }else{
      this.master.toastMensaje("Debes colocar por lo menos texto en el nombre",1000)
    }
  }
  Limpiar(){
this.DataForm={
  CEDULA:'',
  NOMBRES:'',
  empresa:null
}
  }
  enviarData(){
    this.master.Load(this.loading).then(()=>{
        let DataResponsable=this.master.Responsable.Responsables
        DataResponsable.CEDULA=this.DataForm.CEDULA
        DataResponsable.NOMBRES=this.DataForm.NOMBRES
        DataResponsable.IDEMP=this.DataForm.empresa['IDEMP']
        this.Storage.getItems(this.Storage.arrayname.UsuarioActivo).then((DataUsuario)=>{
          let Usuarios=DataUsuario[0]
          DataResponsable.USUARIO=Usuarios['Cedula']
          this.master.Responsable.postNewResponsables(DataResponsable).then((NuevoResponsable)=>{
            if(NuevoResponsable['correcto']){
                this.master.Responsable.getAllREsponsables().then((DataResponsables)=>{
                  if(DataResponsables['correcto']){
                    this.Storage.DeleteKey(this.Storage.arrayname.Responsables).then(()=>{
                      this.Storage.addItem(this.Storage.arrayname.Responsables,DataResponsables['data']['responsables']).then(()=>{
                        this.loading.dismiss().then(()=>{
                          this.Limpiar()
                          this.master.MensajeAlert("Creado correctamente el Nuevo Responsable","Nuevo Responsable")
                        })
                      })
                    })
                    
                  }else{
                    this.loading.dismiss().then(()=>{
                      this.Limpiar()
                      this.master.MensajeAlert("El Responsable fue creado cierre y abra la aplicacion","Nuevo Responsable")
                    })
                  }
                })
            }else{
                if(NuevoResponsable['mensaje']=="errorapi"){
                  this.loading.dismiss().then(()=>{
                    this.master.MensajeAlert(NuevoResponsable['data']['responsables']['message'],"Error al ingresar Responsable")
                  })
                }else{
                  this.loading.dismiss().then(()=>{
                    this.master.MensajeAlert("Error al ingresar un nuevo Responsable","Error al ingresar Responsable")
                  })
                }
            }
          })
        })
    })
  }
  changeEmpresas(evento){

  }

}
