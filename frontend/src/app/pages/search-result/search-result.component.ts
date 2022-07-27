import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { UserService } from '../../shared/user.service';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { MustMatch } from '../../_helpers/must-match.validator';
import { HttpClientModule }    from '@angular/common/http';
import { Router,ActivatedRoute } from "@angular/router";
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit {

  selectedhotelId="all";
  page:number =0;
  totalItems : any;
  dataArray:any;
  searchValue:any;
  q:any;

  constructor(private userService: UserService, private router:Router,private route: ActivatedRoute,private ngxSpinnerService:NgxSpinnerService) {}	

  ngOnInit(): void {
   
    this.route.params.subscribe(params => {     
			this.q = params['q'];     
		});

    this.userService.searchGuestLiting(this.q).subscribe(
      (res:any) =>{    
     
            if(res.statusText == "success"){   
              const count:any = res.data.length;
              for (let i = 0; i < count; i++) {                
                this.userService.getHotelDetails(res.data[i].eventData.hotelId).subscribe(
                  (result:any) =>{                   
                      res.data[i].eventData['hotelname'] = result.hotelname;
                      res.data[i].eventData['hotelstate'] = result.state;
                      let imageCount = 0;                      
                      if(res.data[i].eventData.photos){
                         imageCount = JSON.parse(res.data[i].eventData.photos).length;
                      }
                      let videoCount = 0;
                      if(res.data[i].eventData.videos){
                         videoCount = JSON.parse(res.data[i].eventData.videos).length;
                      }
                      res.data[i].eventData['allCount'] = imageCount + videoCount;   
                      let dnrReason = [];
                      if(res.data[i].eventData.dnrReason){
                        res.data[i].eventData['dnrReason'] = JSON.parse(res.data[i].eventData.dnrReason);
                      }                                 
                  })  
              }
              this.totalItems = res.totalData;
              this.dataArray = res.data;
             
           }
       })
  }

}
