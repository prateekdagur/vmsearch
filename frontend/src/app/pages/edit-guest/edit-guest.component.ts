import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormArray, FormGroup, Validators,FormControl } from '@angular/forms';
import { UserService } from '../../shared/user.service';
import { HttpClientModule , HttpClient}    from '@angular/common/http';
import { Router,ActivatedRoute } from "@angular/router";
import { formatDate } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-edit-guest',
  templateUrl: './edit-guest.component.html',
  styleUrls: ['./edit-guest.component.scss']
})
export class EditGuestComponent implements OnInit {
  reasonOther:boolean = false;
  personalDetails!: FormGroup;
  Dlimages: File[] = [];
  dl_image:any;
  dl_image_old:any;
  displayStyle = "none";
  message='';
  data:any;
  id:any;
  displayStyleImage:boolean=false;
  state:any=[];
  stateJson:any;
  formSubmitAttempt:boolean = false;
  currentDlState:any;
  constructor(private formBuilder: FormBuilder,private userService: UserService,private httpClientModule:HttpClientModule, private router:Router,private route: ActivatedRoute,private spinnerService: NgxSpinnerService,private httpClient:HttpClient) { }

  ngOnInit(): void {
    
    this.httpClient.get("assets/state.json").subscribe(data =>{
      this.stateJson = data;
        for(let index=0;index<this.stateJson.length;index++){
            this.state.push(this.stateJson[index].name);
        }       
    })

    this.route.params.subscribe(params => {
			this.id = params['id'];
		});

    this.personalDetails = this.formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        dob: [''],
        dlNumber: ['', Validators.required],
        dlExpiryDate: [''],
        dlState: ['', Validators.required],
        address: [''],
        city: [''],
        state: [''],
        zipCode: ['']      
      });


      this.userService.getGuestDetails(this.id).subscribe(
        (res:any) =>{   
          console.log(res); 
          this.data = res;  
          this.dl_image =  this.data.user.dlImage;    
           this.dl_image_old = this.data.user.dlImage;    
           var dob = '';
           if(this.data.user.dob){
              dob = formatDate(this.data.user.dob, 'yyyy-MM-dd', 'en');
           }

           var dlExpiryDate = '';
           if(this.data.user.dlExpiryDate){
              dlExpiryDate = formatDate(this.data.user.dlExpiryDate, 'yyyy-MM-dd', 'en');
           }

          this.personalDetails.patchValue({
            firstName: this.data.user.firstName,
            lastName: this.data.user.lastName,
            dob: dob,
            dlExpiryDate: dlExpiryDate,
            dlState: this.data.user.dlState,
            state: this.data.user.state,
            city: this.data.user.city,
            dlNumber: this.data.user.dlNumber,
            zipCode: this.data.user.zipCode,
            address: this.data.user.address,
          });

          this.currentDlState = this.data.user.dlState;

      },
        (err:any)=>{
          this.displayStyle = "block";
          this.message = err.error;
        }
      );
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

  get personal() {
		return this.personalDetails.controls;
	}


  onRemoveDlimage(event) {
    this.dl_image = "";
		let position = this.Dlimages.indexOf(event);
		this.Dlimages.splice(position, 1);
	}
	
	replaceDlimages(){
		this.Dlimages.splice(0,1); // index =0 , remove_count = 1
	}

	onSelectDlimage(event) {
    this.spinnerService.show(); 
    this.dl_image_old = "";
		this.Dlimages.push(...event.addedFiles);
    if(this.Dlimages.length > 1){ // checking if files array has more than one content
			this.replaceDlimages(); // replace file
		}
    if (this.Dlimages && this.Dlimages[0]) {
			const formData = new FormData(); 
    		formData.append("file", this.Dlimages[0], this.Dlimages[0].name);
			this.userService.uploadFileLoggedUser(formData).subscribe(
				(res:any) =>{    
          this.spinnerService.hide();      
					this.dl_image = res.file_location;
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
        'dlImage':this.dl_image,
        'city':this.personalDetails.value.city,
        'state':this.personalDetails.value.state,
        'zipCode':this.personalDetails.value.zipCode  	
      }

     // console.log(params);
      
      this.userService.editGuest(this.id,params).subscribe(
        (res:any) =>{ 
          this.displayStyle = "block";
          this.message = res.message;
          if(res.statusText == "success"){
            setTimeout(() => {
              //this.router.navigate(['dnr-list']);
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
