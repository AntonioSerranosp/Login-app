import { Injectable } from '@angular/core';
import { ajax, AjaxError } from 'rxjs/ajax';
import { map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from '../models/usuario.model';
//constantes globales 
const URLAJAX = ' https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=';

@Injectable({
  providedIn: 'root'
})



export class AuthService {

  private url = 'https://identitytoolkit.googleapis.com/v1/accounts:';
  private apikey = 'AIzaSyC4hPVnM9LGTMueU0IPNG-FvFwkls5LoSs';
  //singup ajax
  private urlajaxx = ` https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${ this.apikey }`;
  private urlajaxxx = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apikey}`;
  userToken:string;

  constructor(private http: HttpClient) {
    
   }
  //crear usuario
  // https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]
  //Login
  //https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]
  // constantes 
  
  //metodos
  /**
   * permite la destruccion del token
   * Request Body 
   */
  logout(){
    localStorage.removeItem('token');
  }
  /**
   * permite el acceso a usuarios ya existentes
   * Request Body 
   */
  logIn(usuario: UsuarioModel){
    const authData = {
      email: usuario.email,
      password: usuario.password,
      returnSecureToken: true
    };
    return this.http.post(
      `${this.url}signInWithPassword?key=${this.apikey}`,
      authData
    ).pipe(
      map( resp =>{ 
        console.log('entro en el map ');
        
        this.guardarToken(resp['idToken']);
        //se coloca resp para no detener el proceso 
        return resp
      })
    );
  }
  /**
   * Crea un nuevo usuario
   * Request Body 
   */
  nuevoUsuario(usuario: UsuarioModel){
    const authData = {
      // email: usuario.email,
      // passwrod: usuario.password,
      //como usa las mismas propiedades que Usuario model 
      //se puede usar el spreadoperator
      ...usuario,
      returnSecureToken: true
    };
    // intento con Ajax 
    // const creacionAjax = ajax(this.urlajaxx);
    // const subscribe = creacionAjax.subscribe(
    //   res => console.log(res),
    //   err => console.error(err)
    // );

    // return subscribe

    return this.http.post(
      `${this.url}signUp?key=${this.apikey}`,
      authData
    ).pipe(
      map( resp =>{ 
        this.guardarToken(resp['idToken']);
        //se coloca resp para no detener el proceso 
        return resp
      })
    );
  }

  private guardarToken (idToken: string){

    this.userToken = idToken;
    localStorage.setItem('token', idToken);

    let hoy = new Date();
    hoy.setSeconds(3600);
    localStorage.setItem('expira', hoy.getTime().toString());
    
  }

  leerToken(){
    if(localStorage.getItem('token')){
      this.userToken = localStorage.getItem('token');
    }else{
      this.userToken = '';
    }

    return this.userToken;
  }

  estaAuntenticado():boolean{
    if(this.userToken.length < 2){
      return false
    }
    const expira = Number(localStorage.getItem('expira'));
    const expiraDate = new Date();
    expiraDate.setTime(expira);
    if(expiraDate > new Date()){
      return true;
    }else{
      return false;
    }
  }
}
