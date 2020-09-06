import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from '../../models/usuario.model';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  usuario: UsuarioModel
  recuerdame = false;
  constructor( 
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit() { 
    this.usuario = new UsuarioModel();
    // this.usuario.email = 'ejemplo@ejemplo.com'
  }
  
  onSubmit(form: NgForm){
     if(form.invalid){return;}
     Swal.fire({
      position: 'center',
      allowOutsideClick:false,
      icon: 'info',
      title: 'Iniciando sesión',
      showConfirmButton: false,
    });
    Swal.showLoading();

    this.auth.nuevoUsuario(this.usuario).subscribe(
       resp =>{
        console.log(resp);
        Swal.close();
        if(this.recuerdame){
          localStorage.setItem('email',this.usuario.email);
        }
        this.router.navigateByUrl('/home');
         
       }, (err) => {
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
