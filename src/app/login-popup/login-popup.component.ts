import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-login-popup',
  standalone: true,
  imports: [],
  templateUrl: './login-popup.component.html',
  styleUrl: './login-popup.component.css'
})
export class LoginPopupComponent implements OnInit{
  loginForm: FormGroup;
  constructor(private fb: FormBuilder) {

  }

  ngOnInit(): void {
      this.loginForm = this.fb.group({

      })
  }
}
