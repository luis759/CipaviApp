import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { MasterService } from '../services/master.service';

@Component({
  selector: 'app-load',
  templateUrl: './load.page.html',
  styleUrls: ['./load.page.scss'],
})
export class LoadPage implements OnInit {

  constructor(private navcontroll:NavController,private master:MasterService) { 
   this.CheckInternet()
  }

  ngOnInit() {
  }
  CheckInternet(){
    
    this.master.usuario.getInternet().then((usuarios)=>{
      console.log(usuarios)
      if(!usuarios['correcto']){
        if(usuarios['data']['status']==-1){
          this.finalizaciondeBusqueda()
        }else{
          this.ExtraerData()
        }
      }else{
        this.ExtraerData()
      }
    })
  }
  ExtraerData(){
    this.master.usuario.getAllUsers().then((usuarios)=>{
      let Datausuarios=usuarios
      this.master.Empresas.getAllEmpresas().then((empresas)=>{
        let Dataempresas=empresas
        this.master.Responsable.getAllREsponsables().then((responsables)=>{
          let Dataresponsables=responsables
          this.master.Proyectos.getAllProyectos().then((proyectos)=>{
            let DataProyectos=proyectos
            this.master.Equipos.getAllEquipos().then((equipos)=>{
              let Dataequipos=equipos
                if(Datausuarios['correcto'])
                {
                  if(Dataempresas['correcto'])
                  {
                    if(Dataresponsables['correcto'])
                    {
                      if(Dataequipos['correcto'])
                      {
                        if(DataProyectos['correcto'])
                        {
                          this.guardarinfoenBasedeDatos(Datausuarios['data']['usuarios'],Dataempresas['data']['empresas'],Dataresponsables['data']['responsables'],Dataequipos['data']['equipos'],DataProyectos['data']['proyectos'])
                        }
                        else
                        {
                          this.guardarinfoenBasedeDatos(Datausuarios['data']['usuarios'],Dataempresas['data']['empresas'],Dataresponsables['data']['responsables'],Dataequipos['data']['equipos'],null)
                        }
                      }
                      else
                      {
                        this.guardarinfoenBasedeDatos(Datausuarios['data']['usuarios'],Dataempresas['data']['empresas'],Dataresponsables['data']['responsables'],null,null)
                      }
                    }else{
                      this.guardarinfoenBasedeDatos(Datausuarios['data']['usuarios'],Dataempresas['data']['empresas'],null,null,null)
                    }
                  }
                  else
                  {
                    this.guardarinfoenBasedeDatos(Datausuarios['data']['usuarios'],null,null,null,null)
                  }
                }else{
                  this.guardarinfoenBasedeDatos(null,null,null,null,null)
                }
            })
          })
        })
      })
    })
  }
  guardarinfoenBasedeDatos(usuario,empresas,responsable,equipos,proyectos){
      if(usuario){
        this.master.storage.DeleteKey(this.master.storage.arrayname.Usuarios).then(()=>{
          this.master.storage.addItem(this.master.storage.arrayname.Usuarios,usuario).then(()=>{
            if(empresas){
              this.master.storage.DeleteKey(this.master.storage.arrayname.Empresas).then(()=>{
                this.master.storage.addItem(this.master.storage.arrayname.Empresas,empresas).then(()=>{
                  if(responsable){
                    this.master.storage.DeleteKey(this.master.storage.arrayname.Responsables).then(()=>{
                      this.master.storage.addItem(this.master.storage.arrayname.Responsables,responsable).then(()=>{
                        if(equipos){
                          this.master.storage.DeleteKey(this.master.storage.arrayname.equipos).then(()=>{
                            this.master.storage.addItem(this.master.storage.arrayname.equipos,equipos).then(()=>{
                              if(proyectos){
                                this.master.storage.DeleteKey(this.master.storage.arrayname.proyectos).then(()=>{
                                  this.master.storage.addItem(this.master.storage.arrayname.proyectos,proyectos).then(()=>{
                                    this.finalizaciondeBusqueda()
                                  })
                                })
                              }else{
                                this.finalizaciondeBusqueda()
                              }
                            })
                          })
                        }else{
                          this.finalizaciondeBusqueda()
                        }
                      })
                    })
                  }else{
                    this.finalizaciondeBusqueda()
                  }
                })
              })
            }else{
              this.finalizaciondeBusqueda()
            }
          })
        })
      }else{
        this.finalizaciondeBusqueda()
      }
  }
  finalizaciondeBusqueda(){
   this.master.storage.getItems(this.master.storage.arrayname.UsuarioActivo).then((usuarioactivo)=>{
      if(usuarioactivo){
        this.master.storage.getItems(this.master.storage.arrayname.Usuarios).then((Usuarios)=>{
          let activo=false
          for(let i =0;i<Usuarios[0].length;i++){
            if(Usuarios[0][i]['id']==usuarioactivo[0]['id']){
              activo=true
            }
          }
          if(activo){
            this.navcontroll.navigateRoot("menu/home")
          }else{
            this.master.storage.DeleteKey(this.master.storage.arrayname.UsuarioActivo).then(()=>{
              this.navcontroll.navigateRoot("login")
            })
          }
        })
      }else{
        this.navcontroll.navigateRoot("login")
      }
    })

  }

}
