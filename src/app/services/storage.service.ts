import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage-angular';
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  reportesGenerado={
    enviado:false,
    dataEnviada:{},
    dataEnviado:{},
    idreportes:0
  }
  
  arrayname={
    "Usuarios":"Usuarios",
    "Empresas":"Empresas",
    "proyectos":"Proyectos",
    "Responsables":"Responsables",
    "reporteGeneredos":"reporteGeneredos",
    "equipos":"Equipos",
    "UsuarioActivo":"UsuarioActivo",
    "usuarioviajes":"usuarioviajes"
  } 
  constructor(private storage:Storage) {
    this.storage.create()
  }
  addItem(ItemKEY:string,datar:any):Promise<any>{
    return this.storage.get(ItemKEY).then(
      (data:any[])=>{
        if(data){
          data.push(datar)
          return this.storage.set(ItemKEY,data)
        }else{
          return this.storage.set(ItemKEY,[datar])
        }
    });
  }

  getItems(ItemKEY:string):Promise<any[]>{
      return this.storage.get(ItemKEY)
  }

  UpdateItems(ItemKEY:string,datamodificar:any,posicion:number):Promise<any[]>{
      return this.storage.get(ItemKEY).then(
        (data:any[])=>{
          if(data.length===0 || !data || posicion<0 ){
            return null
          }else{
            let newitem:any[]=[];
            for(var i=0;i<data.length;i++){
              if(i==posicion){
                newitem.push(datamodificar)
              }else{
                newitem.push(data[i])
              }
            }
            return this.storage.set(ItemKEY,newitem);
          }
      });
  
    }
    
    DeleteItems(ItemKEY:string,posicion:number):Promise<any[]>{
      return this.storage.get(ItemKEY).then(
        (data:any[])=>{
          if(data.length===0 || !data || posicion<0 ){
            return null
          }else{
            let toKeep:any[]=[];
            for(var i=0;i<data.length;i++){
              if(i!==posicion){
                toKeep.push(data[i])
              }
            }
            return this.storage.set(ItemKEY,toKeep);
          }
      });
    }

    DeleteKey(ItemKEY:string):Promise<any[]>{
      return this.storage.remove(ItemKEY)
    }
}
