import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ResponsablesService {
  Responsables={
    IDEMP:'',
    CEDULA:'',
    NOMBRES:'',
    USUARIO:''
  }
  constructor(private httpnative:HTTP) { 

  }
  //API PARA LLAMAR TODOS LOS Responsable
  getAllREsponsables():Promise<any>{
    return new Promise((resolve)=>{
      let nativecall=this.httpnative.get(environment.urlApi+'responsables',{},{'Content-Type': 'application/json'})
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
   //API PARA LLAMAR TODOS LAS RESPONSABLE
    //API PARA REGISTRAR UN RESPONSABLE
   postNewResponsables(responsables:any):Promise<any>{
    return new Promise((resolve)=>{
      this.httpnative.setRequestTimeout(60)
      let nativecall=this.httpnative.post(environment.urlApi+'responsable_reg',responsables,{'Accept': 'application/json','Content-Type': 'application/json'})
      nativecall.then((Data)=>{
          if(Data.status==200 || Data.status==201){
            if(this.isJson(Data.data)){
              let DataRetorno=JSON.parse(Data.data)
              if(DataRetorno['responsables']['Paso']){
                resolve({
                  correcto:true,
                  data:DataRetorno,
                  mensaje:''
                })
              }else{
                resolve({
                  correcto:false,
                  data:DataRetorno,
                  mensaje:'errorapi'
                })
              }
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
        
        console.log(errorData)
        resolve({
          correcto:false,
          data:errorData,
          mensaje:'failed-failed'
        })
      })
    })
    
  }
  //API PARA REGISTRAR UN RESPONSABLE
   isJson(str) {
    try {
       let val= JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
}
