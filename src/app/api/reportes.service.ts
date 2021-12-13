import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { Platform } from '@ionic/angular';
import { environment } from 'src/environments/environment';

import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  Reporte={
    IDEMP:'',
    IDPROY:'',
    GALONES:'',
    FECHA:'',
    ACEITE:'',
    CODIGO:'',
    LECINI:'',
    RESPONSABLE:'',
    OBSERVA:'',
    USUARIO:'',
    LECFIN:'',
    HORAS:'',
    TIEMPOS:''
  }
  Reporte2={
    IDEMP:'',
    IDPROY:'',
    GALONESTANQUEADOS:'',
    FECHA:'',
    KILOMETRAJETANQUEO:'',
    CODIGO:'',
    HORATANQUEO:'',
    RESPONSABLE:'',
    OBSERVA:'',
    USUARIO:'',
    NIVELCOMBINICIO:'',
    NIVELCOMBFIN:'',
    DETALLE:'',
    TANQUEOBOOL:''
  }
  DetallesReporte2={
    NOVIAJE:0,
    CARGA:'',
    LUGARCARGUE:'',
    HORASALIDA:'',
    KILOMSALIDA:0,
    LUGARDESCARGUE:'',
    HORALLEGADA:'',
    KILOMLLEGADA:0,
    VOLUMENMT3:0 
  }
  constructor(private httpnative:HTTP,private plt:Platform,private FileTransfer:FileTransfer,private file:File) { 

  }
  postNewReporte(Report:any):Promise<any>{
    return new Promise((resolve)=>{
      this.httpnative.setRequestTimeout(60)
      let nativecall=this.httpnative.post(environment.urlApi+'reportes/opermaquiyequi',Report,{'Accept': 'application/json','Content-Type': 'application/json'})
      nativecall.then((Data)=>{
        console.log(Data)
          if(Data.status==200 || Data.status==201){
            if(this.isJson(Data.data)){
              let DataRetorno=JSON.parse(Data.data)
              if( DataRetorno['Principal']['Paso']){
                resolve({
                  correcto:true,
                  data:DataRetorno,
                  mensaje:''
                })
              }else if(!DataRetorno['Principal']['Paso']){
                resolve({
                  correcto:false,
                  data:DataRetorno,
                  mensaje:'NoRegistradoNada'
                })
              }else{
                resolve({
                  correcto:true,
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
  postNewReporteTransporteycarga(Report2:any):Promise<any>{
    return new Promise((resolve)=>{
      this.httpnative.setRequestTimeout(60)
      let nativecall=this.httpnative.post(environment.urlApi+'reportes/controltranscarga',Report2,{'Accept': 'application/json','Content-Type': 'application/json'})
      nativecall.then((Data)=>{
        console.log(Data)
          if(Data.status==200 || Data.status==201){
            if(this.isJson(Data.data)){
              let DataRetorno=JSON.parse(Data.data)
              if( DataRetorno['Principal']['Paso']){
                resolve({
                  correcto:true,
                  data:DataRetorno,
                  mensaje:''
                })
              }else if(!DataRetorno['Principal']['Paso']){
                resolve({
                  correcto:false,
                  data:DataRetorno,
                  mensaje:'NoRegistradoNada'
                })
              }else{
                resolve({
                  correcto:true,
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
  //API PARA LLAMAR TODOS LOS equipos
  get_reportes_by_IDEMP_CODIGO_DESDEYHASTA(IDEMP:string,CODIGO:string,DESDE:string,HASTA:string,ID:string):Promise<any>{
    return new Promise((resolve)=>{
      let nativecall=this.httpnative.get(environment.urlApi+'reportes/'+IDEMP+'/'+CODIGO+'/'+DESDE+'/'+HASTA+'/'+ID,{},{'Content-Type': 'application/json'})
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
   //API PARA LLAMAR TODOS LOS REPORTES POR UN IDEMP, IDPROY,FECHADESDE Y HASTA
  download_Reporte_NORC_EMP(NORC:any,IDEMP:any,IDTIPO:any){
    return new Promise((resolve)=>{
      let path=""
      if(this.plt.is("ios")){
        path=this.file.documentsDirectory
      }else{
      path=this.file.externalApplicationStorageDirectory
      }
      const fileTransfer: FileTransferObject = this.FileTransfer.create(); 
        fileTransfer.download(environment.urlApi+"pdf/tiempo/"+IDEMP+"/"+NORC+"/"+IDTIPO+"",path+"Reporte.pdf").then((entry)=>{
         resolve({
           success:true,
           value:entry.toURL()
         })
        }, (err) => {
          resolve({
            succes:false,
            value:err
          })
      })
      })
    }
   isJson(str) {
    try {
       let val= JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
}
