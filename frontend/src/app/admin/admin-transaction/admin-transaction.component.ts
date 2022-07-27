import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/user.service';
import { HttpClientModule }    from '@angular/common/http';
import { Router } from "@angular/router";
@Component({
  selector: 'app-admin-transaction',
  templateUrl: './admin-transaction.component.html',
  styleUrls: ['./admin-transaction.component.scss']
})
export class AdminTransactionComponent implements OnInit {
  displayStyle = "none";
  message = "";
  p:number = 1
  pageSize:number = 10
  totalItem:any
  itemsperPage: number = 10
  transactionData:any = []
  constructor(private userService: UserService,private httpClientModule:HttpClientModule,private router:Router) { }

  ngOnInit(): void {
    this.getTransaction()
  }
  getTransaction(){
    this.userService.getAdminTransaction().subscribe(
			(response:any) =>{
                  this.transactionData = response
                  console.log(this.transactionData, "ttttttttttttttttt")
                  this.totalItem = this.transactionData.length
                },
			(err:any)=>{
				this.displayStyle = "block";
				this.message = err.error.message;
			}
		);

   
}
pageChangeEvent(event: number){

  this.p = event;
  this.getTransaction();

}

}
