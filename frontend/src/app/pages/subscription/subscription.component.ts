import { Component, OnInit } from '@angular/core';
import { dataService } from 'src/app/shared/dataservice.service';
import { UserService } from 'src/app/shared/user.service';
import { environment } from 'src/environments/environment';
import { Router,ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {

  data:any;
  hotelSubscriptionId:any;
  id:any;

  constructor(private service: dataService,private userService: UserService,private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.params.subscribe(params => {
			this.id = params['id'];
		});

    this.userService.subscriptionList().subscribe(
      (res:any) =>{
          console.log(res);
          this.data = res;
      })
  }

  submit(value){
    this.service.planId = value;
    this.service.hotelSubscriptionId = this.id;
  }

}
