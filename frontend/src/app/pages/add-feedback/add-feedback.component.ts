import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormArray, FormGroup, Validators,FormControl } from '@angular/forms';
import { UserService } from '../../shared/user.service';
import { HttpClientModule, }    from '@angular/common/http';
import { Router,ActivatedRoute } from "@angular/router";
import { environment } from 'src/environments/environment';
import {formatDate} from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-add-feedback',
  templateUrl: './add-feedback.component.html',
  styleUrls: ['./add-feedback.component.scss']
})
export class AddFeedbackComponent implements OnInit {
  formSubmitAttempt:boolean = false;
  reasonOther:boolean = false;
  formDetails!: FormGroup;
  photos: File[] = [];
  videos: File[] = [];
  guestPhotos:any;
  guestVideos:any;
  displayStyle = "none";
  message='';
  hotels:any;
  Data:any;
  DataGuest:any;
  state:any;
  myDate:any;
  id:any;
  dnrReasonList:any;
  dateFormat = environment.dateFormat;
  
  constructor(private formBuilder: FormBuilder,private userService: UserService,private httpClientModule:HttpClientModule, private router:Router,private route: ActivatedRoute, private spinnerService:NgxSpinnerService) { }

  ngOnInit(): void {
    
    this.route.params.subscribe(params => {
			this.id = params['id'];
		});

    this.userService.getDnrReasonList().subscribe(
      (resDnrReason:any) =>{
        this.dnrReasonList = resDnrReason;
      }
    );

    this.userService.getActiveHotels().subscribe(
      (res:any) =>{
        this.hotels = res;
      }
    );

    this.userService.getGuestDetails(this.id).subscribe(
      (res:any) =>{        
        res.user['formated_dob'] = formatDate(res.user.dob, this.dateFormat, 'en');
        res.user['formated_dlExpiry'] = formatDate(res.user.dlExpiryDate, this.dateFormat, 'en');
        this.DataGuest = res;
      }
    );
    

   

    this.formDetails = this.formBuilder.group({        
        comments: [''],
        dnrReason :  this.formBuilder.array([]),
        hotelId:['',Validators.required]
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


  onRemovePhoto(event) {
		let position = this.photos.indexOf(event);
		this.photos.splice(position, 1);
	}
	
	
	onSelectPhoto(event) {
    this.spinnerService.show();
		this.photos.push(...event.addedFiles);
    var totalPhoto = this.photos.length;
    var photoArray = new Array();
    for (let i = 0; i < totalPhoto; i++) {
      const formData = new FormData(); 
    	formData.append("file", this.photos[i], this.photos[i].name);      
      this.userService.uploadFileLoggedUser(formData).subscribe(
				(res:any) =>{
					const bill_filename = res.file_location;
          photoArray.push(bill_filename);
          this.guestPhotos = JSON.stringify(photoArray);  
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
    var totalVideo = this.videos.length;
    var VideoArray = new Array();
    for (let i = 0; i < totalVideo; i++) {
      const formData = new FormData(); 
    	formData.append("file", this.videos[i], this.videos[i].name);      
      this.userService.uploadFileLoggedUser(formData).subscribe(
				(res:any) =>{
					const bill_filename = res.file_location;
          VideoArray.push(bill_filename);
          this.guestVideos = JSON.stringify(VideoArray); 
          this.spinnerService.hide();         
				},
				(err:any)=>{
					console.log(err);
				}
			);
    }
	}

  onRemoveVideo(event) {
		let position = this.videos.indexOf(event);
		this.videos.splice(position, 1);
  }


  closePopup() {
		this.displayStyle = "none";
	}

  submit() {   
    
    this.formSubmitAttempt = true;
    if(this.formDetails.value.dnrReason.length === 0 && this.formDetails.value.comments == ""){
      console.log(this.formDetails.value);
      this.displayStyle = "block";
      this.message ="Please select any DNR Reasons";
    }else{
      if(this.formDetails.valid){   

        let params:any = {  
          'hotelId':   this.formDetails.value.hotelId,   
          'photos':this.guestPhotos,
          'videos':this.guestVideos,
          'comments':this.formDetails.value.comments,
          'dnrReason':JSON.stringify(this.formDetails.value.dnrReason)        	
        }
        
        console.log(params);
        
       this.userService.addFeedback(this.id,params).subscribe(
          (res:any) =>{ 
            this.displayStyle = "block";
            this.message = res.message;
            if(res.statusText == "success"){
              setTimeout(() => {
                this.router.navigate(['dnr-list']);
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
