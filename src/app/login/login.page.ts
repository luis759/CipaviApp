import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { MasterService } from '../services/master.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  DataForm={
    nombreusuario:{
      value:'',
      error:false,
      Mensaje:'',
      maxcaracteres:400,
      mincaracteres:1,
      only: 'email'
    },
    clave:{
      value:'',
      error:false,
      Mensaje:'',
      maxcaracteres:20,
      mincaracteres:1,
      only: ''
    },
    recordar:false
  }
  constructor(private master:MasterService,private navcontroller:NavController) {

   }
    validardatosIngreso(){
     if(this.DataForm.clave.value){
       if(this.DataForm.nombreusuario.value){
          this.buscarEnbasededatos()
       }else{
        this.master.MensajeAlert("La cedula no debe estar vacio","Error Login")
       }
     }else{
      this.master.MensajeAlert("La palabra no debe estar vacio","Error Login")
     }
    }
    buscarEnbasededatos(){
      this.master.storage.getItems(this.master.storage.arrayname.Usuarios).then((Usuarios)=>{
        if(Usuarios){
          let usuarioselect=null;
         for (let i = 0; i < Usuarios[0].length; i++) {
           if(Usuarios[0][i]['Cedula']==this.DataForm.nombreusuario.value && Usuarios[0][i]['Palabra']==this.DataForm.clave.value){
             usuarioselect=Usuarios[0][i]
            }
         }
         if(usuarioselect){
           this.master.storage.DeleteKey(this.master.storage.arrayname.UsuarioActivo).then(()=>{
             this.master.storage.addItem(this.master.storage.arrayname.UsuarioActivo,usuarioselect).then(()=>{
               this.navcontroller.navigateRoot("menu/home")
             })
           })
         }else{
           this.master.MensajeAlert("la cedula o la palabra no se encontro en los registros","Error Login")
         }
        }else{
         this.master.MensajeAlert("No se pudo conectar al Servidor, cierre la aplicacion y vuelva a ingresar","Error Login")
        }
      })
    }
  ngOnInit() {
  }

}
