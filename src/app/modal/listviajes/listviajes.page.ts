import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MasterService } from 'src/app/services/master.service';
import { StorageService } from 'src/app/services/storage.service';
import { NuevoviajePage } from '../nuevoviaje/nuevoviaje.page';

@Component({
  selector: 'app-listviajes',
  templateUrl: './listviajes.page.html',
  styleUrls: ['./listviajes.page.scss'],
})
export class ListviajesPage implements OnInit {
  ListaDeViajes=[]
  presiono=true
  constructor(private moda:ModalController,private master:MasterService,private storage:StorageService) { }
  ngOnInit() {
    this.extraerData()
  }
  closeModal(){
      let data = { 'retorno': 'bar' };
      this.moda.dismiss(data);
  }
  cerrarModalAction(){
    this.closeModal()
  }
  async AgregarNuevo(){
    const modal = await this.moda.create({
      component:  NuevoviajePage,
      cssClass: 'my-custom-class'
    });
    modal.onDidDismiss().then(data => {
      if(data){
        console.log(data)
        if(data['error']){
          this.master.MensajeAlert(data['error'],"Error en Registro")
        }else if(data['succes']){
          this.extraerData()
          this.master.toastMensaje(data['succes'],1500)
        }else{
          this.extraerData()
        }
      }
    });
    return await modal.present();
  }
  extraerData(){
    this.storage.getItems(this.storage.arrayname.usuarioviajes).then((data)=>{
        if(data){
          this.ListaDeViajes=data[0]
        }
    })
  }
}
