import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HTTP } from '@ionic-native/http/ngx';
@Injectable({
  providedIn: 'root'
})
export class EmpresasService {
  
  constructor(private httpnative:HTTP) { 

  }
  //API PARA LLAMAR TODOS LOS EMPRESAS
  getAllEmpresas():Promise<any>{
    return new Promise((resolve)=>{
      let nativecall=this.httpnative.get(environment.urlApi+'empresas',{},{'Content-Type': 'application/json'})
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
   //API PARA LLAMAR TODOS LAS EMPRESAS

   isJson(str) {
    try {
       let val= JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
}
