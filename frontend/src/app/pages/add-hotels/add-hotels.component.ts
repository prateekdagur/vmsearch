import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { UserService } from '../../shared/user.service';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { HttpClientModule,HttpClient }    from '@angular/common/http';
import { Router } from "@angular/router";
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-hotels',
  templateUrl: './add-hotels.component.html',
  styleUrls: ['./add-hotels.component.scss']
})
export class AddHotelsComponent implements OnInit {
	public type: string = 'component';

	formSubmitAttempt: boolean = false;

	
	popup = true;
	tax_filename:any;
	bill_filename:any;

	personalDetails!: FormGroup;
	addressDetails!: FormGroup;
	personal_step = false;
	address_step = false;
	step = 1;
	state:any=[];
	stateJson:any;

	showSuccessMessage!: boolean;
	showErrorMessage!: boolean;

	constructor(private formBuilder: FormBuilder,private userService: UserService,private httpClientModule:HttpClientModule, private router:Router,private spinnerService:NgxSpinnerService,private httpClient:HttpClient) {}		

	/****** phone number ************/
	separateDialCode = false;
	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
	PhoneNumberFormat = PhoneNumberFormat;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
	changePreferredCountries() {
		this.preferredCountries = [CountryISO.India, CountryISO.Canada];
	}
	/******end phone number ************/


	public disabled: boolean = false;
	displayStyle = "none";
	message = "";
	ngOnInit() {
		this.httpClient.get("assets/state.json").subscribe(data =>{
			this.stateJson = data;
			  for(let index=0;index<this.stateJson.length;index++){
				  this.state.push(this.stateJson[index].name);
		 	  }  
		});	
		this.personalDetails = this.formBuilder.group({
		  hotelname: ['', Validators.required],
		  email: ['', [Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
		  phonenumber: ['', Validators.required],
		  address: ['', Validators.required],
		  city: [''],
		  latitude: ['', Validators.required],
		  longitude: ['', Validators.required ],
		  state:  ['', Validators.required],
		  zipcode: ['', Validators.required]
		});
		
		this.addressDetails = this.formBuilder.group({
		  files: ['', Validators.required],
		  files1: ['', Validators.required]
		});

		
	}
	
	closePopup() {
		this.displayStyle = "none";
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
			zipcode: address.postal_code,
			latitude: address.geometry.location.lat(),
			longitude: address.geometry.location.lng(),
		 });
		
	}
	
	/*************************end google address******************************************/

	/**********file upload**************** */
	files: File[] = [];
	files1: File[] = [];
	
	onSelect(event) {
		this.spinnerService.show();
        this.files.push(...event.addedFiles);
		if(this.files.length > 1){ // checking if files array has more than one content
			this.replaceFile(); // replace file
		}
		
        if (this.files && this.files[0]) {			
			const formData = new FormData(); 
    		formData.append("file", this.files[0], this.files[0].name);
			this.userService.uploadFileLoggedUser(formData).subscribe(
				(res:any) =>{
					this.tax_filename = res.file_location;
					this.addressDetails.controls['files'].setErrors(null);
					this.addressDetails.controls['files1'].setErrors(null);
					this.spinnerService.hide();
				},
				(err:any)=>{
					this.displayStyle = "block";
					this.message = "Something Went Wrong. Try again!";
				}
			);
      }else{
		this.spinnerService.hide();
		this.displayStyle = "block";
		this.message = "Supports only PNG,JPG or JPEG";
	  }
	}
	
	replaceFile(){
		this.files.splice(0,1); // index =0 , remove_count = 1
	}
	
	replaceFile1(){
		this.files1.splice(0,1); // index =0 , remove_count = 1
	}
	
	fileToBase64 = (file:File):Promise<string> => {
		return new Promise<string> ((resolve,reject)=> {
			 const reader = new FileReader();
			 reader.readAsDataURL(file);
			 reader.onload = () => resolve(reader.result.toString());
			 reader.onerror = error => reject(error);
		 })
		}
	
	onRemove(event) {
		let position = this.files.indexOf(event);
		this.files.splice(position, 1);
	  }
	
	
	onSelect1(event) {
		this.spinnerService.show();
		this.files1.push(...event.addedFiles);
		if(this.files1.length > 1){ // checking if files array has more than one content
			this.replaceFile1(); // replace file
		}
        if (this.files1 && this.files1[0]) {
			const formData = new FormData(); 
    		formData.append("file", this.files1[0], this.files1[0].name);
			this.userService.uploadFileLoggedUser(formData).subscribe(
				(res:any) =>{
					this.bill_filename = res.file_location;
					this.addressDetails.controls['files'].setErrors(null);
					this.addressDetails.controls['files1'].setErrors(null);
					this.spinnerService.hide();
				},
				(err:any)=>{
					this.displayStyle = "block";
					this.message = "Something Went Wrong. Try again!";
				}
			);
      }else{
		this.spinnerService.hide();
		this.displayStyle = "block";
		this.message = "Supports only PNG,JPG or JPEG";
	  }
	}

	onRemove1(event) {
		console.log(event);
		this.files1.splice(this.files1.indexOf(event), 1);
	}
	
	/*************************end file upload******************************/
  
	get email(){
		return this.personalDetails.get('email');
	}


	get personal() {
		return this.personalDetails.controls;
	}

	get address() {
		return this.addressDetails.controls;
	}
  


	next() {
		if (this.step == 1) {
		  this.personal_step = true;
		  if (this.personalDetails.invalid) {
			return;
		  }
		  this.step++;
		}
	}


	previous() {
		this.step--;
		if (this.step == 1) {
		  this.personal_step = false;
		}
	}


submit() {
	this.formSubmitAttempt = true;
	if(this.personalDetails.valid){
		if(this.tax_filename == undefined && this.bill_filename == undefined){
				this.displayStyle = "block";
				this.message = "Please select any one of Tax Commission Permit or Water/Gas Bill";
				
			}else{
		let params:any = {
			'hotelname':this.personalDetails.value.hotelname,
			'phonenumber':this.personalDetails.value.phonenumber.nationalNumber,
			'email':this.personalDetails.value.email,
			'address':this.personalDetails.value.address,
			'city':this.personalDetails.value.city,
			'latitude':this.personalDetails.value.latitude,
			'longitude':this.personalDetails.value.longitude,
			'state':this.personalDetails.value.state,
			'zipcode':this.personalDetails.value.zipcode,
			'tax_filename':this.tax_filename,
			'bill_filename':this.bill_filename			
		}
		
		this.userService.addHotel(params).subscribe(
			(res:any) =>{
			
			this.displayStyle = "block";
			this.message = "Hotel added successfully. Please wait for the admin approval";
			setTimeout(() => {
				this.router.navigate(['my-hotels']);
			}, 2000);
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
