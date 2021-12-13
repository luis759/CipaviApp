import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HTTP } from '@ionic-native/http/ngx';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private httpnative:HTTP) { 

  }
  //API PARA LLAMAR TODOS LOS USUARIOS
  getInternet():Promise<any>{
    return new Promise((resolve)=>{
      this.httpnative.setRequestTimeout(20)
      let nativecall=this.httpnative.get(environment.urlApi+'checkserver',{},{'Content-Type': 'application/json'})
      nativecall.then((Data)=>{
          if(Data.status==200 || Data.status==201){ 
            resolve({
              correcto:true,
              data:Data,
              mensaje:''
            })
            
          }else{
            resolve({
              correcto:false,
              data:Data,
              mensaje:'succes-failed'
            })
          }
      },(errorData)=>{
        resolve({
          correcto:false,
          data:errorData,
          mensaje:'failed-failed'
        })
      })
    })
    
  }  
   //API PARA LLAMAR TODOS LOS USUARIOS
  //API PARA LLAMAR TODOS LOS USUARIOS
  getAllUsers():Promise<any>{
    return new Promise((resolve)=>{
      this.httpnative.setRequestTimeout(60)
      let nativecall=this.httpnative.get(environment.urlApi+'usuarios',{},{'Content-Type': 'application/json'})
      nativecall.then((Data)=>{
          if(Data.status==200 || Data.status==201){
            if(this.isJson(Data.data)){
              let DataRetorno=JSON.parse(Data.data)
              resolve({
                correcto:true,
                data:DataRetorno,
                mensaje:''
              })
            }else{
              resolve({
                correcto:false,
                data:Data,
                mensaje:'errorjson'
              })
            }
          }else{
            resolve({
              correcto:false,
              data:Data,
              mensaje:'succes-failed'
            })
          }
      },(errorData)=>{
        resolve({
          correcto:false,
          data:errorData,
          mensaje:'failed-failed'
        })
      })
    })
    
  }  
   //API PARA LLAMAR TODOS LOS USUARIOS

   isJson(str) {
    try {
       let val= JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
}
