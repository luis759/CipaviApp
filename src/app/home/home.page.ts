import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { MasterService } from '../services/master.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  reportes=[{
    id:1,
    name:"Reportes de operación de maquinaria y equipos",
   
  },{
    id:2,
    name:"Reportes de transporte de carga y livianos"
  }]
  valorinicial=0
  tipoEnviados=true;

  constructor(private navcontorll:NavController,private master:MasterService) {

  }
  
  radioGroupChange(evento){
    this.valorinicial=evento.detail.value;
  }
  
  irAlGenerarReporte(){
    if(this.valorinicial==0){

    }else if(this.valorinicial==1){
      this.navcontorll.navigateForward("menu/reportgene")
    }else if(this.valorinicial==2){
      this.navcontorll.navigateForward("menu/reportetransmater")
    }
  }
}
