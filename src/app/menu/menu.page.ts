import { Component, OnInit } from '@angular/core';
import { MenuController, NavController, Platform } from '@ionic/angular';
import { MasterService } from '../services/master.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  pages=[
    {
      title:'Principal',
      url:'/menu/home',
      icon:'assets/iconmenu/main.png',
      routerdi:'root',
      forw:false,
      function:''
    },{
      title:'Nuevo Responsables',
      url:'/menu/responsables',
      icon:'assets/iconmenu/profile.png',
      routerdi:'root',
      forw:false,
      function:''
    },{
      title:'Reportes Generados',
      url:'/menu/allreport',
      icon:'assets/iconmenu/report.png',
      routerdi:'root',
      forw:false,
      function:''
    },{
      title:'Reportes Generados por el Usuario',
      url:'/menu/reportlist',
      icon:'assets/iconmenu/report.png',
      routerdi:'root',
      forw:false,
      function:''
    },{
      title:'Salir',
      url:'',
      icon:'assets/iconmenu/exit.png',
      routerdi:'root',
      forw:false,
      function:'logout'
    }    
]
  constructor(private platform:Platform,private menus:MenuController,private master:MasterService,private nav:NavController) {
      
   }

  ngOnInit() {
  }
  funcioneMenu(funcion){
    if(funcion=="logout"){
      this.logoutfuncion()
    }
  }
  logoutfuncion(){
    this.master.storage.DeleteKey(this.master.storage.arrayname.UsuarioActivo).then(()=>{
      this.nav.navigateRoot("login")
    })
  
  }
  activarmenuDesactivar(bool){
    this.menus.enable(bool)
  }
  funcioncerrar(){
    this.menus.close("first")
  } 

}
