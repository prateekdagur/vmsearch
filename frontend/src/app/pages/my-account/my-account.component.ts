import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormArray, FormGroup, Validators,FormControl } from '@angular/forms';
import { UserService } from '../../shared/user.service';
import { HttpClientModule, }    from '@angular/common/http';
import { formatDate } from '@angular/common';
import { Router } from "@angular/router";
import { AnyLengthString } from 'aws-sdk/clients/comprehend';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit {

  data:any;
  hotelIdSubscription:any;
  constructor(private formBuilder: FormBuilder,private userService: UserService,private httpClientModule:HttpClientModule, private router:Router) { }

  ngOnInit(): void {
    this.userService.myAccount().subscribe(
      (res:any) =>{
        this.data = res;
      }
    );
  }

  setHotelId(id){
      this.hotelIdSubscription = id;
  }

}
