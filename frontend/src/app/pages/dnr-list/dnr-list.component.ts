import { NONE_TYPE } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { UserService } from 'src/app/shared/user.service';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dnr-list',
  templateUrl: './dnr-list.component.html',
  styleUrls: ['./dnr-list.component.scss']
})
export class DnrListComponent implements OnInit {
  dataArray:any;
  hotelData:any;
  activeHotels:any;
  totalItems : any;
  dateFormat = environment.dateFormat;
  page:number =0;
  selectedhotelId = "all";
  hotelId:any;
  message="";
  displayUploadedCsv = "none";
  displayStyleBulkUpload="none";
  displayStyle="none";
  fileName = "";
  messageFile ="";

  constructor(private userService:UserService, private router:Router,private ngxSpinnerService:NgxSpinnerService,public datepipe: DatePipe) { }

  ngOnInit() {
    
    this.userService.dnrList(this.page,this.selectedhotelId).subscribe(
      (resDnrList:any) =>{ 
            if(resDnrList.statusText == "success"){   
              const count:any = resDnrList.dataDnrList.length; 
              for (let i = 0; i < count; i++) {                
                this.userService.getHotelDetails(resDnrList.dataDnrList[i].eventData.hotelId).subscribe(
                  (result:any) =>{                   
                    resDnrList.dataDnrList[i].eventData['hotelname'] = result.hotelname;
                    resDnrList.dataDnrList[i].eventData['hotelstate'] = result.state;
                      let imageCount = 0;                      
                      if(resDnrList.dataDnrList[i].eventData.photos){
                         imageCount = JSON.parse(resDnrList.dataDnrList[i].eventData.photos).length;
                      }
                      let videoCount = 0;
                      if(resDnrList.dataDnrList[i].eventData.videos){
                         videoCount = JSON.parse(resDnrList.dataDnrList[i].eventData.videos).length;
                      }
                      resDnrList.dataDnrList[i].eventData['allCount'] = imageCount + videoCount;   
                     
                      if(resDnrList.dataDnrList[i].eventData.dnrReason){
                        resDnrList.dataDnrList[i].eventData['dnrReasonArray'] = JSON.parse(resDnrList.dataDnrList[i].eventData.dnrReason);
                      }                                 
                  })  
              }
              this.totalItems = resDnrList.totalData;
              this.dataArray = resDnrList.dataDnrList;
           }

           this.userService.getActiveHotels().subscribe(
            (res:any) =>{
              this.activeHotels = res;
            }
          );
       })
   }

   setHotelId(event){
    this.message = "";
     this.hotelId = event;
   }
   
   showBulkUpload(){
     this.displayStyleBulkUpload = "block";
   }
  lines = [];
	files: File[] = [];
  handleFileSelect(evt) {
    
      this.files.splice(0, 1);
      this.files.push(...evt.addedFiles);
      var hotelId = this.hotelId;
      if(hotelId === undefined){       
        this.message = "Please select hotel from the dropdwon";
        return;
      }
      this.message = "";
      this.messageFile = "";
      this.ngxSpinnerService.show();
      var file = this.files[0];
      this.fileName = this.files[0].name;
      var reader = new FileReader();
      reader.readAsText(file);
      this.lines = [];
      let lines = this.lines;
      reader.onload = function(event){
       
          let allTextLines = (<string>reader.result).split(/\r/);
          let headers = allTextLines[0].split(',');
          

          for ( let i = 0; i < allTextLines.length; i++) {
              // split content based on comma
              let data = allTextLines[i].split(',');
              if (data.length == headers.length) {
                  let tarr = [];
                  for ( let j = 0; j < headers.length; j++) {
                      tarr.push(data[j]);
                  }
                  lines.push(tarr);
              }
          }
      }
    setTimeout(() => {
      this.ngxSpinnerService.hide();
      this.displayUploadedCsv = "block";
    }, 1000);
      
  }

  onChange(selectedhotelId) {
      this.selectedhotelId = selectedhotelId;
      this.userService.dnrList(this.page,this.selectedhotelId).subscribe(
        (res:any) =>{            
              if(res.statusText == "success"){   
                const count:any = res.dataDnrList.length;
                for (let i = 0; i < count; i++) {                
                  this.userService.getHotelDetails(res.dataDnrList[i].eventData.hotelId).subscribe(
                    (result:any) =>{                   
                        res.dataDnrList[i].eventData['hotelname'] = result.hotelname;
                        res.dataDnrList[i].eventData['hotelstate'] = result.state;
                        let imageCount = 0;                      
                        if(res.dataDnrList[i].eventData.photos){
                           imageCount = JSON.parse(res.dataDnrList[i].eventData.photos).length;
                        }
                        let videoCount = 0;
                        if(res.dataDnrList[i].eventData.videos){
                           videoCount = JSON.parse(res.dataDnrList[i].eventData.videos).length;
                        }
                        res.dataDnrList[i].eventData['allCount'] = imageCount + videoCount;   
                        let dnrReason = [];
                        if(res.dataDnrList[i].eventData.dnrReason){
                          res.dataDnrList[i].eventData['dnrReasonArray'] = JSON.parse(res.dataDnrList[i].eventData.dnrReason);
                        }                                 
                    })  
                }
                this.totalItems = res.totalData;
                this.dataArray = res.dataDnrList;
             }
         })
  }

  pageChange(page: number) {
		this.page = page;
    let page_num = page-1;
    this.userService.dnrList(page_num,this.selectedhotelId).subscribe(
      (res:any) =>{
            if(res.statusText == "success"){   
              const count:any = res.dataDnrList.length;
              for (let i = 0; i < count; i++) {                
                this.userService.getHotelDetails(res.dataDnrList[i].eventData.hotelId).subscribe(
                  (result:any) =>{                   
                      res.dataDnrList[i].eventData['hotelname'] = result.hotelname;
                      res.dataDnrList[i].eventData['hotelstate'] = result.state;
                      let imageCount = 0;                      
                      if(res.dataDnrList[i].eventData.photos){
                         imageCount = JSON.parse(res.dataDnrList[i].eventData.photos).length;
                      }
                      let videoCount = 0;
                      if(res.dataDnrList[i].eventData.videos){
                         videoCount = JSON.parse(res.dataDnrList[i].eventData.videos).length;
                      }
                      res.dataDnrList[i].eventData['allCount'] = imageCount + videoCount;                                    
                  })  
              }
              this.totalItems = res.totalData;
              this.dataArray = res.dataDnrList;
           }
       })
	}


  uploadCsvFiledata(){
   
    if(this.hotelId === undefined){
      this.message = "Please select hotel from the dropdwon";
    }else if(this.lines.length <= 1){
      this.messageFile = "Please Upload correct CSV file.";

    }else{
      
      this.displayStyleBulkUpload = "none";
      this.ngxSpinnerService.show();
      for(let index=1;index<this.lines.length;index++){
        let params:any = {
          'firstName':this.lines[index][0],
          'lastName':this.lines[index][1],
          'dob':this.datepipe.transform(this.lines[index][2], 'yyyy-MM-dd'),
          'dlNumber':this.lines[index][3],
          'dlExpiryDate':this.datepipe.transform(this.lines[index][4], 'yyyy-MM-dd'),
          'dlState':this.lines[index][5],
          'address':this.lines[index][6],
          'zipCode':this.lines[index][7],
          'hotelId':this.hotelId ,              
          'comments':this.lines[index][8],       	
        }   
        console.log(params);
        this.userService.addGuest(params).subscribe(
          (res:any) =>{ 
        })
      }

      setTimeout(() => {
        this.ngxSpinnerService.hide();
        this.message = "Data Uploaded successfully";
        this.displayStyle = "block";
        setTimeout(() => {
           // window.location.reload();
        }, 1000);
      }, 4000);

    }
    

    
  }

  closePopup() {
		this.displayStyle = "none";
    this. displayStyleBulkUpload ="none";
	}
}
