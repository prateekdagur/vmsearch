import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/user.service';
import { HttpClientModule }    from '@angular/common/http';
import { Router } from "@angular/router";
@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {
  data:any;
  constructor(private userService: UserService,private httpClientModule:HttpClientModule,private router:Router) { }

  ngOnInit(): void {
    this.userService.getContactInfo().subscribe(
      (res:any) =>{
        if(res.statusText == 'success'){
          this.data = res.contactData;
          console.log(this.data);
        }        
      },
      (err:any)=>{
      
      }
    );
  }

}
