import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';
import { environment } from 'src/environments/environment';
import { Router } from "@angular/router";

@Component({
  selector: 'app-feedback-approval',
  templateUrl: './feedback-approval.component.html',
  styleUrls: ['./feedback-approval.component.scss']
})
export class FeedbackApprovalComponent implements OnInit {

  totalItems : any;
  dataArray:any;
  page:number =0;
  feedbackId: any;
  displayStyle="none";
  message="";

  constructor(private userService:UserService, private router:Router) { }

  ngOnInit(): void {
    this.userService.pendingFeedbackList().subscribe(
      (res:any) =>{
      
        if(res.statusText == "success"){ 

          const count:any = res.feedback.length;
          for (let i = 0; i < count; i++) { 
            let imageCount = 0;                      
            if(res.feedback[i].eventData.photos){
                imageCount = JSON.parse(res.feedback[i].eventData.photos).length;
            }
            let videoCount = 0;
            if(res.feedback[i].eventData.videos){
                videoCount = JSON.parse(res.feedback[i].eventData.videos).length;
            }
            res.feedback[i].eventData['allCount'] = imageCount + videoCount;   
            let dnrReason = [];
            if(res.feedback[i].eventData.dnrReason){
              res.feedback[i].eventData['dnrReason'] = JSON.parse(res.feedback[i].eventData.dnrReason);
            } 
          }
          this.totalItems = res.count;
          this.dataArray = res.feedback;
        }
      })
    }

    setFeedbackId(id){
      console.log(id);
        this.feedbackId = id;
    }


    approveFeedback(){
      this.userService.approveFeedback(this.feedbackId).subscribe(
        (res:any) =>{
          if(res.statusText == "success"){ 
            this.displayStyle="block";
            this.message = "Feedback Approved Successfully!";
            setTimeout(() => {
              window.location.reload();
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
              window.location.reload();
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

  