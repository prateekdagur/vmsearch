import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UserService } from '../../shared/user.service';
import { HttpClientModule }    from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from "@angular/router";

@Component({
  selector: 'app-admin-dnr',
  templateUrl: './admin-dnr.component.html',
  styleUrls: ['./admin-dnr.component.scss']
})
export class AdminDnrComponent implements OnInit {
  displayStyle = "none";
  message = "";
  DeletednrId:any;
  UpdatednrId:any;
  dnrData:any = []
  startSort: any = "ALLcreated"
  dnrname:any = ""
  p:number = 1;
  itemsperPage:number = 10
  itemLength: any;
  resdn:any;
  AdminDnrUpdate!: FormGroup
  constructor(private formBuilder: FormBuilder, private userService: UserService,private httpClientModule:HttpClientModule,private router:Router) { }

  ngOnInit(): void {
    this.getDnr(this.startSort)
    console.log(this.dnrData, "bhjAGVSHGAFGHSVAhs")
    this.AdminDnrUpdate = this.formBuilder.group({
      dnr_title: ['', [Validators.required]],
    })
  }
  get personal() {
		return this.AdminDnrUpdate.controls;
	}

  statusChange(event, id){
 
    let status = "INACTIVE";
    if (event.target.checked == true) {
        status = "ACTIVE";
    }
  let params:any = {
    'status': status		
  }

   //this.utilsService.processPatchRequest('tutor/update/' + id, { tutor_profile_status: status}).pipe(takeUntil(this.destroy$)).subscribe((response)
    this.userService.updateAdminDnrStatus(params, id).subscribe(
      (response:any) =>{
        this.getDnr(this.startSort) 
                },
    );
  }
  deleteDnr(id){
    console.log(id, "iddddddddddddd111111111>>>>>>>>>>>>>")
    this.userService.deleteAdminDnr(id).subscribe(
      (response:any) =>{
        this.getDnr(this.startSort) 
                },
    );
   }
   delete(id){
     console.log(id, "iddddddddd")
     this.DeletednrId = id
   }
   update(id){
    this.UpdatednrId = id
    this.userService.getAdminDnrbyId(this.UpdatednrId).subscribe(
      (res:any) =>{		
        console.log(res, "under")
       this.resdn = res['dnr']
        this.AdminDnrUpdate = new FormGroup({
          dnr_title: new FormControl(this.resdn.Dnr_title),
        })  
        this.displayStyle = "block";
        this.message = "Admin Dnr Created";   
       
      },
      (err:any)=>{
        this.displayStyle = "block";
        this.message = err.error.message;
      }
    );
    
  }
  //  UpdateDnr(id){
  //   console.log(id, "iddddddddddddd111111111>>>>>>>>>>>>>")
  //   this.userService.updateAdminDnr(id).subscribe(
  //     (response:any) =>{
  //       this.getDnr() 
  //               },
  //   );
  //  }


  //updateAdminDnr
  updateDnr(id){
    let params:any = {		
      'dnr_title':this.AdminDnrUpdate.value.dnr_title,			
    }
    console.log(params, id,  "paramsssssssss")
    this.userService.updateAdminDnr(params, id).subscribe(
      (res:any) =>{		
        this.displayStyle = "block";
        Swal.fire(res.msg);
        this.getDnr(this.startSort);    
      },
      (err:any)=>{
        this.displayStyle = "block";
        this.message = err.error.message;
      }
    );
  }
  
getDnr(sortStatus){
  this.userService.getAdminDnr(sortStatus).subscribe(
    (response:any) =>{
      console.log(response, "ressssssssssss")
                this.dnrData = response['dnr']
                this.itemLength = response['dnr'].length;
              },
    (err:any)=>{
      this.displayStyle = "block";
      this.message = err.error.message;
    }
  );
}
onChangeDnr(e){
  console.log(e.target.value, "name11111111111")
        this.dnrname = e.target.value
          this.userService
            .getAdminDnrByName(this.dnrname)
            .subscribe((response: any) => {
              console.log(response, "dnrrrrrrrrr>>>>>>>>>>>>")
              if(response.length > 0){
                this.dnrData = response
                this.itemLength = this.dnrData.length;
              } else {
                this.dnrData = []
                this.itemLength = this.dnrData.length;
        
              }  
            },
            (err: any) => {
              this.displayStyle = 'block';
              this.message = err.error.message;
            });
}

checkCreated(e){
  console.log(e.target.value)
   this.startSort = e.target.value
   if(this.startSort === "ALL"){
     this.startSort = "ALLcreated"
   } else if(this.startSort === "SORT ASC"){
    this.startSort = "ASCcreated"
   }else if(this.startSort === "SORT DSC"){
    this.startSort = "DSCcreated"
   }
  this.getDnr(this.startSort)
}
checkModified(e){
  console.log(e.target.value)
   this.startSort = e.target.value
   if(this.startSort === "ALL"){
     this.startSort = "ALLmodified"
   } else if(this.startSort === "SORT ASC"){
    this.startSort = "ASCmodified"
   }else if(this.startSort === "SORT DSC"){
    this.startSort = "DSCmodified"
   }
  this.getDnr(this.startSort)
}

pageChangeEvent(event: number) {
  this.p = event;
  this.getDnr(this.startSort);
}

}
