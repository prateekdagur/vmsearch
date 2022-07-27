import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/user.service';
import { HttpClientModule }    from '@angular/common/http';
import { Router,ActivatedRoute } from "@angular/router";
import { environment } from 'src/environments/environment';
import {formatDate} from '@angular/common'

@Component({
  selector: 'app-admin-users-details',
  templateUrl: './admin-users-details.component.html',
  styleUrls: ['./admin-users-details.component.scss']
})
export class AdminUsersDetailsComponent implements OnInit {
  id:any;
  dataArray:any;
  ViewUserArray:any;
  ViewHotelsArray:any;
  ViewTransactionsArray:any;
  viewUserType: any;
  storeUserType: any;
  dateFormat = environment.dateFormat;
  constructor(private httpClientModule:HttpClientModule, private router:Router,private route: ActivatedRoute, private userService: UserService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
			this.id = params['id'];
  })
      console.log(this.id, "iddddddddd>>>>>>>>>>>>>>>")
      this.userService.getAdminViewUsers(this.id).subscribe(
        (res:any) =>{
      console.log(res, "userssssssssssss?>>>>>>>>>>>>>>>>>>")
      this.ViewUserArray = res['user'];
      this.ViewHotelsArray = res['hotel'];
      this.ViewTransactionsArray = res['transaction'];
      //this.storeUserType = res['user']['user_type'];
      if(res['user']['user_type'] === 'HOTEL_OWNER'){
        this.viewUserType = "HOTEL OWNER"
      } else{
        this.viewUserType = "ADMIN"

      }
  }
  );

//   this.userService.getAdminViewUsers(this.id).subscribe(
//     (res:any) =>{
//   this.ViewUserArray = res['user'];
//   console.log(this.ViewUserArray, "userssssssssssss?>>>>>>>>>>>>>>>>>>")

// }
// );


}

}
