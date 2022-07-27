// import { Component, OnInit } from '@angular/core';
// import { UserService } from '../../shared/user.service';
// import { HttpClientModule }    from '@angular/common/http';
// import { Router } from "@angular/router";

// @Component({
//   selector: 'app-admin-dashboard',
//   templateUrl: './admin-dashboard.component.html',
//   styleUrls: ['./admin-dashboard.component.scss']
// })
// export class AdminDashboardComponent implements OnInit {
//   displayStyle = "none";
//   message = "";
//   hotelData:any = []
//   constructor(private userService: UserService,private httpClientModule:HttpClientModule,private router:Router) { }

//   ngOnInit(): void {
//     // this.refreshCountries();
//     // this.getHotel()
//     console.log(this.hotelData, "final")
//   }

//   // refreshCountries() {
//   //   this.hotels = hotels
//   //     .map((country, i) => ({id: i + 1, ...country}))
//   //     .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
//   // }

// //   getHotel(){
// //     this.userService.getAdminHotels().subscribe(
// // 			(response:any) =>{
// //                   this.hotelData = response
// //                 },
// // 			(err:any)=>{
// // 				this.displayStyle = "block";
// // 				this.message = err.error.message;
// // 			}
// // 		);

   
// // }



// // statusChange(event, id){
// //   console.log(id, "iiiiiiiiiiiii")
// //   let status = "PENDING";
// //   if (event.target.checked == true) {
// //       status = "APPROVED";
// //   }
// // console.log(status, "sssssssssss")
// // let params:any = {
// //   'is_approved': status		
// // }
// //  //this.utilsService.processPatchRequest('tutor/update/' + id, { tutor_profile_status: status}).pipe(takeUntil(this.destroy$)).subscribe((response)
// //   this.userService.updateHotelStatus(params, id).subscribe(
// //     (response:any) =>{
// //       this.getHotel() 
// //               },
// //   );
  

// // }

// }
