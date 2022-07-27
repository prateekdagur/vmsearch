import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { UserService } from '../../shared/user.service';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { MustMatch } from '../../_helpers/must-match.validator';
import { HttpClientModule,HttpClient }    from '@angular/common/http';
import { Router,ActivatedRoute } from "@angular/router";
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-edit-hotel',
  templateUrl: './edit-hotel.component.html',
  styleUrls: ['./edit-hotel.component.scss']
})
export class EditHotelComponent implements OnInit {

 	public type: string = 'component';
	imageToShowTax:any;
	imageToShowBill:any;
  	data:any;
	id:any;
	popup = true;
	tax_filename:any | undefined;
	bill_filename:any| undefined;
	displayExistingFile:any;
	personalDetails!: FormGroup;
	addressDetails!: FormGroup;
	personal_step = false;
	address_step = false;
	step = 1;

	state:any=[];
	stateJson:any;

	displayStyleTax = "none";
	displayStyleBill = "none";

	showSuccessMessage!: boolean;
	showErrorMessage!: boolean;

	constructor(private formBuilder: FormBuilder,private userService: UserService,private httpClientModule:HttpClientModule, private router:Router,private route: ActivatedRoute,private ngxSpinnerService:NgxSpinnerService,private httpClient:HttpClient) {}		

	/****** phone number ************/
	separateDialCode = false;
	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
	PhoneNumberFormat = PhoneNumberFormat;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates];
	changePreferredCountries() {
		this.preferredCountries = [CountryISO.UnitedStates];
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
			this.route.params.subscribe(params => {
				this.id = params['id'];
			});
			this.personalDetails = this.formBuilder.group({
			hotelname: ['', Validators.required],
			email: ['', [Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
			phonenumber: ['', Validators.required],
			address: ['', Validators.required],
			city: [''],
			latitude: ['', ],
			longitude: ['', ],
			state: ['', Validators.required],
			zipcode: ['', Validators.required]
			});
			
			this.addressDetails = this.formBuilder.group({
			files: ['', Validators.required],
			files1: ['', Validators.required]
		});
			
		this.userService.getHotelDetails(this.id).subscribe(
		(res:any) =>{  

			this.data = res;
			this.tax_filename = this.data.tax_filename;
			this.bill_filename = this.data.bill_filename;

			this.imageToShowTax = this.tax_filename;
			this.imageToShowBill = this.bill_filename;        
			
			this.personalDetails.patchValue({
			hotelname: this.data.hotelname,
			phonenumber: this.data.phonenumber,
			email: this.data.email,
			address: this.data.address,
			city: this.data.city,
			state: this.data.state,
			zipcode: this.data.zipcode,
			latitude: this.data.latitude,
			longitude: this.data.longitude,
			});
			if(this.imageToShowTax){
				this.displayStyleTax = "block";
			}
			if(this.imageToShowBill){
				this.displayStyleBill = "block";
			}
		},
		(err:any)=>{
			this.displayStyle = "block";
			this.message = err.error;
		}
		);
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
		this.ngxSpinnerService.show();
		this.displayStyleTax = "none";
        this.files.push(...event.addedFiles);
		console.log(this.files);
		if(this.files.length > 1){ // checking if files array has more than one content
			this.replaceFile(); // replace file
		}
		
        if (this.files && this.files[0]) {			
			const formData = new FormData(); 
    		formData.append("file", this.files[0], this.files[0].name);
			this.userService.uploadFile(formData).subscribe(
				(res:any) =>{
					if(this.imageToShowTax){
						this.displayStyleTax = "none";
					}
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
					if(this.imageToShowBill){
						this.displayStyleBill = "none";
					}
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
  


	submit() {
    
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
	  
	  this.userService.editHotel(params,this.id).subscribe(
        (res:any) =>{
        
          this.displayStyle = "block";
          this.message = "Hotel updated successfully. Please wait for the admin approval";
          setTimeout(() => {
            this.router.navigate(['my-hotels']);
          }, 2000);
        },
        (err:any)=>{
			console.log(err);
          this.displayStyle = "block";
          this.message = err.error;
        }
      );
      

    }
  }
	
}
