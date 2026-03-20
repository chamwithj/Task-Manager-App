import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Api } from '../service/api';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule,RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  regForm: FormGroup;
  error: string ="";
  constructor(private formBuilder: FormBuilder, private apiService :Api, private router: Router){
    this.regForm = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required]
    })
  }

  onSubmit(){
    if(this.regForm.invalid){
      this.error ="please fill in all fields";
      return;
    }
    this.error = "";
     this.apiService.registerUser(this.regForm.value).subscribe({
      next:(res:any) =>{
        if (res.statusCode === 200) {
          this.router.navigate(['/login']);
        }else{
          this.error = res.message || "Register not succesful" 
        }
      },
      error:(error: any) =>{
        this.error = error.error?.message || error.message
      }
     })
  }


}
