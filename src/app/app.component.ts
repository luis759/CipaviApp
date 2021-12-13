import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private platform:Platform,private routr:Router,private modal:ModalController,private navController:NavController) {
    this.platform.backButton.subscribe(() => {
      if(this.routr.url=="/login"){
        navigator['app'].exitApp();
      }else if(this.routr.url=="/load"){
        navigator['app'].exitApp();
      }else if(this.routr.url=="/menu/home"){
        navigator['app'].exitApp();
      }else if(this.modal.getTop()){
        
      }
    })
  }
}
