import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormArray, FormGroup, Validators,FormControl } from '@angular/forms';
import { UserService } from '../../shared/user.service';
import { HttpClientModule, HttpClient}    from '@angular/common/http';
import { formatDate } from '@angular/common';
import { Router } from "@angular/router";
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-guest',
  templateUrl: './add-guest.component.html',
  styleUrls: ['./add-guest.component.scss']
})
export class AddGuestComponent implements OnInit {
  formSubmitAttempt:boolean = false;
  reasonOther:boolean = false;
  personalDetails!: FormGroup;
  photos: File[] = [];
  videos: File[] = [];
  Dlimages: File[] = [];
  guestPhotos:any;
  guestVideos:any;
  dl_image:any;
  displayStyle = "none";
  message='';
  hotels:any;
  Data:any;
  state:any=[];
  stateJson:any;
  myDate:any;
  dnrReasonList:any;
  constructor(private formBuilder: FormBuilder,private userService: UserService,private httpClientModule:HttpClientModule, private router:Router, private spinnerService:NgxSpinnerService,private httpClient:HttpClient) { }

  ngOnInit(): void {
    this.myDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
  
    this.userService.getActiveHotels().subscribe(
      (res:any) =>{
        this.hotels = res;
        
      console.log(this.hotels);
      }
    );
    
   this.httpClient.get("assets/state.json").subscribe(data =>{
      this.stateJson = data;
        for(let index=0;index<this.stateJson.length;index++){
            this.state.push(this.stateJson[index].name);
        }
       
    })
    
   
    
    this.userService.getDnrReasonList().subscribe(
      (resDnrReason:any) =>{
        this.dnrReasonList = resDnrReason;
      }
    );

    this.personalDetails = this.formBuilder.group({
        firstName: ['', [
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern('^[a-zA-Z ]*$')
        ]],
        lastName: ['', [
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern('^[a-zA-Z ]*$')
        ]],
        dob: [''],
        dlNumber: ['',  [
          Validators.required,
          Validators.maxLength(20)
        ]],
        dlExpiryDate: [''],
        dlState: ['', Validators.required],
        address: [''],
        city: [''],
        state: [''],
        zipCode: [''],
        hotelId: ['', Validators.required],
        comments: [''],
        dnrReason :  this.formBuilder.array([])
      });
  }


  checkOtherReason(event){
    if ( event.target.checked ) {
      this.reasonOther = true;
    }else{
      this.personalDetails.value.comments = "";
      this.reasonOther = false;
    }
  }

  /*******************get google address******************************************/
		
	handleAddressChange(address: any) {
	
		const address_components = address.address_components;
		address_components.forEach(element => {
			address[element.types[0]] = element.short_name;
		});
		
		this.personalDetails.patchValue({
			address: address.formatted_address,
			city: address.administrative_area_level_2,
			state: address.administrative_area_level_1,
			zipCode: address.postal_code
		 });
		
	}
	
	/*************************end google address******************************************/

  onCheckboxChange(e) {
    const dnrReason: FormArray = this.personalDetails.get('dnrReason') as FormArray;
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
		return this.personalDetails.controls;
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


  onRemoveDlimage(event) {
		let position = this.Dlimages.indexOf(event);
		this.Dlimages.splice(position, 1);
	}
	
	replaceDlimages(){
		this.Dlimages.splice(0,1); // index =0 , remove_count = 1
	}

	onSelectDlimage(event) {
    this.spinnerService.show();
		this.Dlimages.push(...event.addedFiles);
    if(this.Dlimages.length > 1){ // checking if files array has more than one content
			this.replaceDlimages(); // replace file
		}
    if (this.Dlimages && this.Dlimages[0]) {
			const formData = new FormData(); 
    		formData.append("file", this.Dlimages[0], this.Dlimages[0].name);
			this.userService.uploadFileLoggedUser(formData).subscribe(
				(res:any) =>{
					this.dl_image = res.file_location;
          this.spinnerService.hide();
				},
				(err:any)=>{
				
				}
			);
    }
	}

  closePopup() {
		this.displayStyle = "none";
	}

  submit() {   
    this.formSubmitAttempt = true;
  	if(this.personalDetails.valid){    
      let params:any = {
        'firstName':this.personalDetails.value.firstName,
        'lastName':this.personalDetails.value.lastName,
        'dob':this.personalDetails.value.dob,
        'dlNumber':this.personalDetails.value.dlNumber,
        'dlExpiryDate':this.personalDetails.value.dlExpiryDate,
        'dlState':this.personalDetails.value.dlState,
        'address':this.personalDetails.value.address,
        'city':this.personalDetails.value.city,
        'state':this.personalDetails.value.state,
        'zipCode':this.personalDetails.value.zipCode,
        'hotelId':this.personalDetails.value.hotelId,
        'dlImage':this.dl_image,
        'photos':this.guestPhotos,
        'videos':this.guestVideos,
        'comments':this.personalDetails.value.comments,
        'dnrReason':JSON.stringify(this.personalDetails.value.dnrReason)        	
      }

     // console.log(params);
      
      this.userService.addGuest(params).subscribe(
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
