import { Injectable } from '@angular/core';
import { AlertController, LoadingController, Platform, ToastController } from '@ionic/angular';
import { EmpresasService } from '../api/empresas.service';
import { EquiposService } from '../api/equipos.service';
import { ProyectoService } from '../api/proyecto.service';
import { ReportesService } from '../api/reportes.service';
import { ResponsablesService } from '../api/responsables.service';
import { UsuariosService } from '../api/usuarios.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  constructor(private platform:Platform,
    public storage:StorageService,
    public usuario:UsuariosService,
    public Empresas:EmpresasService,
    public Equipos:EquiposService,
    public Responsable:ResponsablesService,
    public Proyectos:ProyectoService,
    public Reportes:ReportesService,
    public alertController: AlertController,
    private toast:ToastController) { }
    
    async Load(LoadingControllers:LoadingController):Promise<void> {
      let load = await LoadingControllers.create({
         message: 'Por Favor Espere..',
         translucent: true,
         cssClass: 'custom-class custom-loading'
       })
       return load.present()
     };
  public async MensajeAlert(Mensajes,Titulos){
    let titulo=Titulos
    let mensaje=Mensajes
    let subtitle=""
  const alert = await this.alertController.create({
    header:titulo,
    subHeader: subtitle,
    message: mensaje,
    buttons: ['OK']
  });

  await alert.present();
 }
 public async toastMensaje(Mensajes,times){
  let Mensajess=Mensajes
  let time=times
const alert = await this.toast.create({
  message: Mensajess,
  duration: time,
  position: 'top'
});

await alert.present();
}
}
