import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsuarioModel } from '../../models/usuario.model';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    // si falla parar el new usuario Model aqui
  usuario: UsuarioModel
  recuerdame = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.usuario = new UsuarioModel();
    if(localStorage.getItem('email')){
      this.usuario.email = localStorage.getItem('email');
      this.recuerdame = true;
    }
  }

  login(form: NgForm){
    if(form.invalid){
      console.log(form);
      console.log('estas mal ');
      return;
    }
    Swal.fire({
      position: 'center',
      allowOutsideClick:false,
      icon: 'info',
      title: 'Iniciando sesión',
      showConfirmButton: false,
    });
    Swal.showLoading();
    this.auth.logIn(this.usuario)
      .subscribe( resp =>{
        console.log(resp);
        Swal.close();
        if(this.recuerdame){
          localStorage.setItem('email',this.usuario.email);
        }
        this.router.navigateByUrl('/home');
        
      }, (err) => {
        console.log(err.error.error.message);
        console.log(err);
        Swal.fire({
          position: 'center',
          allowOutsideClick:true,
          icon: 'error',
          title: `${err.error.error.message}`,
          showConfirmButton: false,
        });

        
        
      });

  }

}
