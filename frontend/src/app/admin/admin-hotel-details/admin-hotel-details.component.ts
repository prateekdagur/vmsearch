import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/user.service';
import { HttpClientModule }    from '@angular/common/http';
import { Router,ActivatedRoute } from "@angular/router";
import { environment } from 'src/environments/environment';
import {formatDate} from '@angular/common'
@Component({
  selector: 'app-admin-hotel-details',
  templateUrl: './admin-hotel-details.component.html',
  styleUrls: ['./admin-hotel-details.component.scss']
})
export class AdminHotelDetailsComponent implements OnInit {
  id:any;
  dataArray:any;
  ViewUserArray:any;
  ViewHotelArray:any;
  ViewTransactionsArray:any;
  viewUserType: any;
  taxFile: any;
  storeUserType: any;
  dateFormat = environment.dateFormat;
  constructor(private httpClientModule:HttpClientModule, private router:Router,private route: ActivatedRoute, private userService: UserService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
			this.id = params['id'];
  })
      console.log(this.id, "iddddddddd>>>>>>>>>>>>>>>")
      this.userService.getAdminViewHotels(this.id).subscribe(
        (res:any) =>{
      console.log(res, "hotelssssssssssssss?>>>>>>>>>>>>>>>>>>")

      // this.ViewUserArray = res['user'];
      this.ViewHotelArray = res['hotel'];
      this.ViewTransactionsArray = res['transaction'];
      this.taxFile = res['hotel'].tax_filename
      //this.storeUserType = res['user']['user_type'];
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
