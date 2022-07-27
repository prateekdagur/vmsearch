import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { UserService } from '../../shared/user.service';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { MustMatch } from '../../_helpers/must-match.validator';
import { HttpClientModule,HttpClient }    from '@angular/common/http';
import { Router } from "@angular/router";
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
 
})

export class RegisterComponent implements OnInit {
	public type: string = 'component';
	formSubmitAttempt: boolean = false;
	popup = true;
	tax_filename:any;
	bill_filename:any;
	selectedPattern!: string;
	personalDetails!: FormGroup;
	addressDetails!: FormGroup;
	personal_step = false;
	address_step = false;
	step = 1;
	state:any=[];
	stateJson:any;	
	
	passwordType='password';
	passwordImage = 'eye.svg';
	dispalyPasswordTypeEyeClose = "none";
	dispalyPasswordTypeEye = "Block";

	ConfirmpasswordType='password';
	ConfirmpasswordImage = 'eye.svg';
	ConfirmdispalyPasswordTypeEyeClose = "none";
	ConfirmdispalyPasswordTypeEye = "Block";

	showSuccessMessage!: boolean;
	showErrorMessage!: boolean;

	constructor(private formBuilder: FormBuilder,private userService: UserService,private httpClientModule:HttpClientModule, private router:Router,private ngxSpinnerService:NgxSpinnerService,private httpClient:HttpClient) {}		

	/****** phone number ************/
	separateDialCode = false;
	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
	PhoneNumberFormat = PhoneNumberFormat;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
	changePreferredCountries() {
		this.preferredCountries = [CountryISO.UnitedStates];
	}
	/******end phone number ************/

	password = new FormControl();
	public disabled: boolean = false;
	displayStyle = "none";
	message = "";
	ngOnInit() {

		this.httpClient.get("assets/state.json").subscribe(data =>{
			this.stateJson = data;
			  for(let index=0;index<this.stateJson.length;index++){
				  this.state.push(this.stateJson[index].name);				  
		}       
		 

	
		if(this.userService.isLoggedIn()){
			this.router.navigate(['home']);
		  }
		  
		this.personalDetails = this.formBuilder.group({
		 loc:this.formBuilder.group({        
			coordinates:[null]
			}),
		  hotelname: ['', Validators.required],
		  email: ['', [Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
		  phonenumber: ['', Validators.required],
		  address: ['', Validators.required],
		  city: [''],
		  latitude: ['', Validators.required],
		  longitude: ['', Validators.required],
		  state:  ['', Validators.required],
		  zipcode: ['', Validators.required],
		  password: ['', [Validators.required,Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$")]],
		  cpassword: ['', Validators.required]
		}, {
            validator: MustMatch('password', 'cpassword')
        });

		this.personalDetails.get('email').valueChanges.subscribe((event) => {
			this.personalDetails.get('email').setValue(event.toLowerCase(), {emitEvent: false});
		 })

		 

		this.addressDetails = this.formBuilder.group({
		  files: ['', Validators.required],
		  files1: ['', Validators.required]
		});

	
		console.log(this.state);
	})
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
			city: address.administrative_area_level_2,
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
		this.ngxSpinnerService.show();
        this.files.push(...event.addedFiles);
		if(this.files.length > 1){ // checking if files array has more than one content
			this.replaceFile(); // replace file
		}
		console.log(this.files)
        if (this.files && this.files[0]) {			
			const formData = new FormData(); 
    		formData.append("file", this.files[0], this.files[0].name);
			this.userService.uploadFile(formData).subscribe(
				(res:any) =>{
					this.tax_filename = res.file_location;
					this.addressDetails.controls['files'].setErrors(null);
					this.addressDetails.controls['files1'].setErrors(null);
					this.ngxSpinnerService.hide();
				},
				(err:any)=>{
					this.displayStyle = "block";
					this.message = "Something Went Wrong. Try again!";
				}
			);
      	}else{
			this.ngxSpinnerService.hide();
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
		this.ngxSpinnerService.show();
		this.files1.push(...event.addedFiles);
		if(this.files1.length > 1){ // checking if files array has more than one content
			this.replaceFile1(); // replace file
		}
        if (this.files1 && this.files1[0]) {
			const formData = new FormData(); 
    		formData.append("file", this.files1[0], this.files1[0].name);
			this.userService.uploadFile(formData).subscribe(
				(res:any) =>{
					this.bill_filename = res.file_location;
					this.addressDetails.controls['files'].setErrors(null);
					this.addressDetails.controls['files1'].setErrors(null);
					this.ngxSpinnerService.hide();
				},
				(err:any)=>{
					this.displayStyle = "block";
					this.message = "Something Went Wrong. Try again!";
				}
			);
      }else{
		this.ngxSpinnerService.hide();
		this.displayStyle = "block";
		this.message = "Supports only PNG,JPG or JPEG";
	  }
	}

	onRemove1(event) {
		console.log(event);
		this.files1.splice(this.files1.indexOf(event), 1);
	}
	
	/*************************end file upload******************************/
  
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
			  console.log(this.personalDetails.value);
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
		let params:any = {
			'hotelname':this.personalDetails.value.hotelname,
			'phonenumber':this.personalDetails.value.phonenumber.nationalNumber,
			'email':this.personalDetails.value.email,
			'address':this.personalDetails.value.address,
			'city':this.personalDetails.value.city,
			'latitude':this.personalDetails.value.latitude,
			'longitude':this.personalDetails.value.longitude,
			'loc':[this.personalDetails.value.latitude,this.personalDetails.value.longitude],
			'state':this.personalDetails.value.state,
			'zipcode':this.personalDetails.value.zipcode,
			'password':this.personalDetails.value.password,
			'tax_filename':this.tax_filename,
			'bill_filename':this.bill_filename			
		}
		this.userService.registerUser(params).subscribe(
			(res:any) =>{
				if(res.statusText == "error"){
					this.displayStyle = "block";
					this.message = res.message;
				}else{
					this.displayStyle = "block";
					this.message = "Please wait for the admin approval";
					setTimeout(() => {
						this.router.navigate(['login']);
					}, 2000);
					}				
			},
			(err:any)=>{
				this.displayStyle = "block";
				this.message = "Something went worng. Please contact admin!";
			}
		);

	}


	changePasswordType(){
		this.passwordType = "text";
		this.passwordImage = 'eye-close.svg';
		this.dispalyPasswordTypeEyeClose = "block";
		this.dispalyPasswordTypeEye = "none";
	}

	ResetChangePasswordType(){
		this.passwordType = "password";
		this.passwordImage = 'eye.svg';
		this.dispalyPasswordTypeEyeClose = "none";
		this.dispalyPasswordTypeEye = "block";
	}


  changeConfirmPasswordType(){
		this.ConfirmpasswordType = "text";
		this.ConfirmpasswordImage = 'eye-close.svg';
		this.ConfirmdispalyPasswordTypeEyeClose = "block";
		this.ConfirmdispalyPasswordTypeEye = "none";
	}

	ResetConfirmChangePasswordType(){
		this.ConfirmpasswordType = "password";
		this.ConfirmpasswordImage = 'eye.svg';
		this.ConfirmdispalyPasswordTypeEyeClose = "none";
		this.ConfirmdispalyPasswordTypeEye = "block";
	}

	
}
