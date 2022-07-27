import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormArray, FormGroup, Validators,FormControl } from '@angular/forms';
import { UserService } from '../../shared/user.service';
import { HttpClientModule, }    from '@angular/common/http';
import { Router,ActivatedRoute } from "@angular/router";
import { environment } from 'src/environments/environment';
import {formatDate} from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-admin-feedback-edit',
  templateUrl: './admin-feedback-edit.component.html',
  styleUrls: ['./admin-feedback-edit.component.scss']
})
export class AdminFeedbackEditComponent implements OnInit {
  formSubmitAttempt:boolean = false;
  reasonOther:boolean = false;
  formDetails!: FormGroup;
  photos: File[] = [];
  videos: File[] = [];
  feedbackPhotos:any;
  feedbackVideos:any;
  displayStyle = "none";
  message='';
  hotels:any;
  Data:any;
  DataFeedback:any;
  feedbackDnrReason:any;
  DataGuest:any;
  state:any;
  myDate:any;
  id:any;
  dateFormat = environment.dateFormat;
  guestId:any;
  currentHotel:any;
  dnrReasonList:any;
  constructor(private formBuilder: FormBuilder,private userService: UserService,private httpClientModule:HttpClientModule, private router:Router,private route: ActivatedRoute,private spinnerService: NgxSpinnerService,) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
			this.id = params['id'];
		});

    this.userService.getDnrReasonList().subscribe(
      (resDnrReason:any) =>{
        this.dnrReasonList = resDnrReason;
      }
    );
    // this.userService.getActiveHotels().subscribe(
    //   (res:any) =>{
    //     this.hotels = res;
    //     console.log(this.hotels, "hhhhhhhhhhhhh")
    //   }
    // );
    // this.userService.getDnrReasonList().subscribe(
    //   (resDnrReason:any) =>{
    //     this.dnrReasonList = resDnrReason;
    //   }
    // );

    this.userService.getAdminFeedbackSingle(this.id).subscribe(
      (res:any) =>{   
      console.log(res, "sssssssss>>>>>>>>>>>>")
          let photo = [];
          if(res.feedback.photos){
            photo = JSON.parse(res.feedback.photos);
            console.log(photo, "ppppppppppp")
          }

          let video = [];
          if(res.feedback.videos){
            video = JSON.parse(res.feedback.videos);
            console.log(video, "vvvvvvvvvvvvv")
          }
          let dnrReasonArray =  [];
          
          if(res.feedback.dnrReason){
            dnrReasonArray = JSON.parse(res.feedback.dnrReason);
        console.log(dnrReasonArray, "dddddddddddddddd")
          }

          for(let index=0; index < dnrReasonArray.length;index++){
            const dnrReason: FormArray = this.formDetails.get('dnrReason') as FormArray;
            dnrReason.push(new FormControl(dnrReasonArray[index]));
          }


          this.feedbackPhotos = photo;
          this.feedbackVideos = video;
          this.feedbackDnrReason = dnrReasonArray;
          this.currentHotel = res.feedback.hotelId;

          this.DataFeedback = res;
          if(res.feedback.comments != ''){
              this.reasonOther = true;             
          }
         
          this.formDetails.patchValue({
            comments: res.feedback.comments,
          });
          console.log(res.feedback.comments, "ccccccccccccc")

           this.guestId = res.feedback.guestId;
          console.log(this.guestId, "ggggggggggg")
           this.userService.getAdminGuestDetails(this.guestId).subscribe(
            (response:any) =>{        
              response.user['formated_dob'] = formatDate(response.user.dob, this.dateFormat, 'en');
              response.user['formated_dlExpiry'] = formatDate(response.user.dlExpiryDate, this.dateFormat, 'en');
              this.DataGuest = response;
              console.log(this.DataGuest, "ddddddddddddddddddd")
            }
          );
      }
    );

    this.formDetails = this.formBuilder.group({        
      comments: [''],
      dnrReason :  this.formBuilder.array([]),
       hotelId:['']
    });
  }

  checkOtherReason(event){
    if ( event.target.checked ) {
      this.reasonOther = true;
    }else{
      this.formDetails.value.comments = "";
      this.reasonOther = false;
    }
  }

  onCheckboxChange(e) {
    const dnrReason: FormArray = this.formDetails.get('dnrReason') as FormArray;
    if (e.target.checked) {
      dnrReason.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      dnrReason.controls.forEach((item) => {
        if (item.value == e.target.value) {
          dnrReason.removeAt(i);
          return;
        }
        i++;
      });
    }
  }
  
  get personal() {
		return this.formDetails.controls;
	}

  onRemovePhotoArray(event) {
		let position = this.feedbackPhotos.indexOf(event);
		this.feedbackPhotos.splice(position, 1);   
    console.log(this.feedbackPhotos, "ppppppppppp");
	}
	

  onSelectPhoto(event) {
    this.spinnerService.show();   
		this.photos.push(...event.addedFiles);
    var totalPhoto = event.addedFiles.length;
    for (let i = 0; i < totalPhoto; i++) {
      const formData = new FormData(); 
    	formData.append("file", this.photos[i], this.photos[i].name);      
      this.userService.uploadAdminFileLoggedUser(formData).subscribe(
				(res:any) =>{
					const bill_filename = res.file_location;
          this.feedbackPhotos.push(bill_filename);   
          this.spinnerService.hide();   
				},
				(err:any)=>{
					console.log(err);
				}
			);
    }   
	}

	
  onSelectVideo(event) {
    this.spinnerService.show();  
		this.videos.push(...event.addedFiles);		
    var totalVideo = event.addedFiles.length;
    
    for (let i = 0; i < totalVideo; i++) {
      const formData = new FormData(); 
    	formData.append("file", this.videos[i], this.videos[i].name);      
      this.userService.uploadAdminFileLoggedUser(formData).subscribe(
				(res:any) =>{
					const bill_filename = res.file_location;
          this.feedbackVideos.push(bill_filename); 
          this.spinnerService.hide();   
				},
				(err:any)=>{
					//console.log(err);
				}
			);
    }
    
	}

  onRemoveVideoArray(event) {
		let position = this.feedbackVideos.indexOf(event);
		this.feedbackVideos.splice(position, 1);
  }





  closePopup() {
		this.displayStyle = "none";
	}

  submit() {   
    
    this.formSubmitAttempt = true;
    if(this.formDetails.value.dnrReason.length === 0 && this.formDetails.value.comments == ""){
     
      this.displayStyle = "block";
      this.message ="Please select any DNR Reasons";
    }else{
      if(this.formDetails.value.hotelId == ''){          
        this.formDetails.value.hotelId = this.currentHotel;
      }

      console.log(this.formDetails.value, "vvvvvvvvvvvvvv");
      if(this.formDetails.valid){           

        let params:any = {  
          // 'hotelId':   this.formDetails.value.hotelId,   
          'photos':JSON.stringify(this.feedbackPhotos),
          'videos':JSON.stringify(this.feedbackVideos),
          'comments':this.formDetails.value.comments,
          'dnrReason':JSON.stringify(this.formDetails.value.dnrReason),
                	
        }
        console.log(params);
       this.userService.editAdminFeedback(this.id,params).subscribe(
          (res:any) =>{ 
            this.displayStyle = "block";
            this.message = res.message;
            if(res.statusText == "success"){
              setTimeout(() => {
                this.router.navigate(['admin-feedback']);
              }, 2000);
            }
          },
          (err:any)=>{
            this.displayStyle = "block";
            this.message = err.error;
          }
        );
      }
    }  
  }

}
