import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/user.service';
import { HttpClientModule }    from '@angular/common/http';
import { Router,ActivatedRoute } from "@angular/router";
import { environment } from 'src/environments/environment';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-feedback-approval-detail1',
  templateUrl: './feedback-approval-detail1.component.html',
  styleUrls: ['./feedback-approval-detail1.component.scss']
})
export class FeedbackApprovalDetail1Component implements OnInit {
  id:any;
  dataArray:any;
  dateFormat = environment.dateFormat;
  feedbackId: any;
  displayStyle="none";
  message="";

  constructor(private httpClientModule:HttpClientModule, private router:Router,private route: ActivatedRoute, private userService: UserService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
			this.id = params['id'];
		});

    this.userService.getFeedbackDetailsById(this.id).subscribe(
      (res:any) =>{
          if(res.statusText == 'success'){
           
              this.feedbackId = res.feedbackdata._id;
              res.user['formated_dob'] = formatDate(res.user.dob, this.dateFormat, 'en');
              res.user['formated_dlExpiry'] = formatDate(res.user.dlExpiryDate, this.dateFormat, 'en');
              res.feedbackdata['date_added'] = formatDate(res.feedbackdata.date, this.dateFormat, 'en');
              
              let photo = [];
              if(res.feedbackdata.photos){
                photo = JSON.parse(res.feedbackdata.photos);
              }

              let video = [];
              if(res.feedbackdata.videos){
                video = JSON.parse(res.feedbackdata.videos);
              }

              let dnrReason =  [];
              
              if(res.feedbackdata.dnrReason){
                dnrReason = JSON.parse(res.feedbackdata.dnrReason);
              }

              res.feedbackdata['photosArray'] = photo;
              res.feedbackdata['videoArray'] = video;
              res.feedbackdata['drReasonArray'] = dnrReason;
             
            
              this.dataArray = res;
          }
      });
  }


  approveFeedback(){
    this.userService.approveFeedback(this.feedbackId).subscribe(
      (res:any) =>{
        if(res.statusText == "success"){ 
          this.displayStyle="block";
          this.message = "Feedback Approved Successfully!";
          setTimeout(() => {
            this.router.navigate(['feedback-approvals']);
          }, 2000);
        }else{
          this.displayStyle="block";
          this.message = "Somehting Went Worng. Please try again later!";
        }
      },
      (err:any) =>{
        this.displayStyle="block";
          this.message = "Somehting Went Worng. Please try again later!";
      })

  }

  rejectFeedback(){
    this.userService.rejectFeedback(this.feedbackId).subscribe(
      (res:any) =>{
        if(res.statusText == "success"){ 
          this.displayStyle="block";
          this.message = "Feedback Rejected Successfully!";
          setTimeout(() => {
            this.router.navigate(['feedback-approvals']);
          }, 2000);
        }else{
          this.displayStyle="block";
          this.message = "Somehting Went Worng. Please try again later!";
        }
      },
      (err:any) =>{
        this.displayStyle="block";
          this.message = "Somehting Went Worng. Please try again later!";
      })
  }

  
closePopup() {
  this.displayStyle = "none";
}

}