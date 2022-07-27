import { Injectable, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders,HttpClientModule,HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
Observable

@Injectable({
  providedIn: 'root'
})
export class UserService  {
	auth:any;

	noAuthHeader = {headers: new HttpHeaders({'NoAuth':'True'})};
  
  constructor(private http: HttpClient) { }

  
  sendContactInfo(params){
    return this.http.post(environment.apiBaseUrl+'/api/sendContactInfo/',params)
  }

  changePasswordFront(params){
    return this.http.post(environment.apiBaseUrl+'/api/changePasswordFront/',params)
  }

  myAccountFrontDesk(){
    return this.http.get(environment.apiBaseUrl+'/api/myAccountFrontDesk/')
  }

  getFeedbackDetailsById(id){
    return this.http.get(environment.apiBaseUrl+'/api/getFeedbackDetailsById/'+id)
  }

  getContactInfo(){
    return this.http.get(environment.apiBaseUrl+'/api/getContactInfo/')
  }

  getFeedbackRejected(){
    return this.http.get(environment.apiBaseUrl+'/api/getFeedbackRejected/')
  }

  approveFeedback(id){
    return this.http.get(environment.apiBaseUrl+'/api/approveFeedback/'+id)
  }

  rejectFeedback(id){
    return this.http.get(environment.apiBaseUrl+'/api/rejectFeedback/'+id)
  }

  pendingFeedbackList(){
    return this.http.get(environment.apiBaseUrl+'/api/feedbackApprovalList/')
  }

  changePassword(params){
    return this.http.post(environment.apiBaseUrl+'/api/changePassword/',params)
  }

  subscriptionList(){
    return this.http.get(environment.apiBaseUrl+'/api/subscriptionList/')
  }

  getDnrTitle(id){
    return this.http.get(environment.apiBaseUrl+'/api/getDnrTitle/'+id)
  }

  getDnrReasonList(){
    return this.http.get(environment.apiBaseUrl+'/api/getDnrReasonList/')
  }
  
  readNotificationUpdate(){
    return this.http.get(environment.apiBaseUrl+'/api/readNotificationUpdate/')
  }


  notificationList(page){
    return this.http.get(environment.apiBaseUrl+'/api/notificationList/'+page)
  }

  
  searchGuestLiting(data){
    return this.http.get(environment.apiBaseUrl+'/api/searchGuestLiting/'+data)
  }


  searchGuest(data){
    return this.http.get(environment.apiBaseUrl+'/api/searchGuest/'+data)
  }

  getFrontDeskDetails(id){
    return this.http.get(environment.apiBaseUrl+'/api/getFrontDeskDetails/'+id)
  }
  
  frontDeskList(){
    return this.http.get(environment.apiBaseUrl+'/api/frontDeskList')
  }

  deleteFrontdesk(id){
    return this.http.delete(environment.apiBaseUrl+'/api/deleteFrontdesk/'+id)
  }

  editFrontDeskManager(data,id){
    return this.http.post(environment.apiBaseUrl+'/api/editFrontDeskManager'+id, data)
  }


  addFrontDeskManager(data){
    return this.http.post(environment.apiBaseUrl+'/api/addFrontDeskManager',data)
  }

  myAccount(){
    return this.http.get(environment.apiBaseUrl+'/api/myAccount')
  }

  editFeedback(id,data){
    return this.http.post(environment.apiBaseUrl+'/api/editFeedback/'+id,data)
  }

  addFeedback(id,data){
    return this.http.post(environment.apiBaseUrl+'/api/addFeedback/'+id,data)
  }

  getFeedbackSingle(id){
    return this.http.get(environment.apiBaseUrl+'/api/getFeedbackSingle/'+id)
  }

  getGuestDetails(id){
    return this.http.get(environment.apiBaseUrl+'/api/getGuestDetails/'+id)
  }


  editGuest(id,data){
    return this.http.post(environment.apiBaseUrl+'/api/editGuest/'+id,data)
  }


  dashboard(){
    return this.http.get(environment.apiBaseUrl+'/api/dashboard')
  }

  getFeedbackDetails(id){
    return this.http.get(environment.apiBaseUrl+'/api/getFeedbackDetails/'+id)
  }


  dnrList(page,selectedhotelId){   
    return this.http.get(environment.apiBaseUrl+'/api/dnrList/'+page+'/'+selectedhotelId)
  }


  liveEventList(page){
    return this.http.get(environment.apiBaseUrl+'/api/liveEventList/'+page)
  }

  checkSubscriptionStatus(){
    return this.http.get(environment.apiBaseUrl+'/api/checkSubscriptionStatus')
  }

  makePayment(data){
    return this.http.post(environment.apiBaseUrl+'/api/makePayment/',data)
  }

  addGuest(data){
    return this.http.post(environment.apiBaseUrl+'/api/addGuest/',data)
  }


  getHotelDetails(id){
    return this.http.get(environment.apiBaseUrl+'/api/getHotelDetails/'+id)
  }

  deleteHotel(id){
    return this.http.delete(environment.apiBaseUrl+'/api/deleteHotel/'+id)
  }
  

  getActiveHotels(){
    return this.http.get(environment.apiBaseUrl+'/api/getActiveHotels')
  }

  getMyHotels(){
	  return this.http.get(environment.apiBaseUrl+'/api/getMyHotels')
  }

  addHotel(hotel:any){
	return this.http.post(environment.apiBaseUrl+'/api/addHotel',hotel)
  }

  editHotel(hotel:any,id){
    return this.http.put(environment.apiBaseUrl+'/api/editHotel/'+id,hotel)
  }

  registerUser(user:any){
	  return this.http.post(environment.apiBaseUrl+'/api/register',user,this.noAuthHeader)
  }
  
  /****************user module************ */
  resetPassword(data){
    return this.http.post(environment.apiBaseUrl+'/api/resetPassword',data,this.noAuthHeader)
  }

  verifyOtp(data){
    return this.http.post(environment.apiBaseUrl+'/api/verifyOtp',data,this.noAuthHeader)
  }

 verifyEmail(data){
  	return this.http.post(environment.apiBaseUrl+'/api/verifyEmail',data,this.noAuthHeader)
  }

  loginUser(user:any){
  	return this.http.post(environment.apiBaseUrl+'/api/authenticate',user,this.noAuthHeader)
  }

  loginUserFrontDesk(user:any){
  	return this.http.post(environment.apiBaseUrl+'/api/authenticateFrontDesk',user,this.noAuthHeader)
  }

  setToken(token:string){
  	localStorage.setItem('token',token);
  }

  deleteToken(){
  	localStorage.removeItem('token');
  }

  getToken(){
  	return localStorage.getItem('token');
  }

  getUserPayload(){
	  var token = this.getToken();
	  if(token){
		  var userPayload = atob(token.split('.')[1]);
		  return JSON.parse(userPayload);
	  }else{
		  return null;
	  }
  }

  getUserRole(){
    return this.http.get(environment.apiBaseUrl+'/api/getUserRole')
  }

  isLoggedIn(){
	  var userPayload = this.getUserPayload();
	  if(userPayload)
		  return userPayload.exp > Date.now()/1000;
	  else
	  return false;
  }
/***********************user module end *********************/
  uploadFile(file:any){
	  return this.http.post(environment.apiBaseUrl+'/api/uploadfile',file)
  }


  uploadFileLoggedUser(file:any){
	  return this.http.post(environment.apiBaseUrl+'/api/uploadFileLoggedUser',file)
  }


  uploadMultipleFile(file:any){
	  return this.http.post(environment.apiBaseUrl+'/api/uploadMultipleFile',file)
  }

  


  /****************admin prateek************* */
  isAdminLoggedIn(){
    var AdminPayload = this.getAdminPayload();
	  if(AdminPayload)
		  return AdminPayload.exp > Date.now()/1000;
	  else
	  return false;
  }
  getAdminPayload(){
	  var token = this.getAdminToken();
	  if(token){
		  var AdminPayload = atob(token.split('.')[1]);
		  return JSON.parse(AdminPayload);
	  }else{
		  return token;
	  }
  }
 getAdminToken(){
    
  	return localStorage.getItem('accesstoken');
  }

 setAdminToken(accesstoken:string){
  	localStorage.setItem('accesstoken', accesstoken);
  }
  setAdminEmail(email:string){
  	localStorage.setItem('email', email);
  }
  getAdminEmail(){
  	return localStorage.getItem('email');
  }
  getAdminFeedbackSingle(id){
    return this.http.get(environment.apiBaseUrl+'/api/getAdminFeedbackSingle/'+id)
  }
  getAdminUserByEmail(email:any){
    return this.http.get(environment.apiBaseUrl+'/api/getAdminUserByEmail', {  params:{
      searchKey: email
      }}
     )
  }
  getAdminGuestDetails(id){
    return this.http.get(environment.apiBaseUrl+'/api/getAdminGuestDetails/'+id)
  }

  uploadAdminFileLoggedUser(file:any){
    return this.http.post(environment.apiBaseUrl+'/api/uploadAdminFileLoggedUser',file)
}
editAdminFeedback(id,data){
    return this.http.post(environment.apiBaseUrl+'/api/editAdminFeedback/'+id,data)
  }
  updateHotelStatus(data:any, id){
    return this.http.patch(environment.apiBaseUrl+'/api/updateHotelStatus/'+id, data)
  }


  updateUsersStatus(data:any, id){
    return this.http.patch(environment.apiBaseUrl+'/api/updateUserStatus/'+id, data)
  }
  updateAdminUserDeleteStatus(data:any, id){
    return this.http.patch(environment.apiBaseUrl+'/api/updateAdminUserDeleteStatus/'+id, data)
  }
  updateAdminHotelDeleteStatus(data:any, id){
    console.log(data, "dddddhhhhhhhhh>>>>>>>>>>>")
    return this.http.patch(environment.apiBaseUrl+'/api/updateAdminHotelDeleteStatus/'+id, data)
  }
  updateAdminFrontDeskManDeleteStatus(data:any, id){
    console.log("11111111111")
    return this.http.patch(environment.apiBaseUrl+'/api/updateAdminFrontDeskManDeleteStatus/'+id, data 
     )
  }

  getAdminHotelByEmail(email:any){
    return this.http.get(environment.apiBaseUrl+'/api/getAdminHotelByEmail', {  params:{
      searchKey: email
      }}
     )
  }

  getAdminHotelByName(name:any){
    return this.http.get(environment.apiBaseUrl+'/api/getAdminHotelByName', {  params:{
      searchKey: name
      }}
     )
  }
  
  getAdminHotelByAddress(address:any){
    return this.http.get(environment.apiBaseUrl+'/api/getAdminHotelByAddress', {  params:{
      searchKey: address
      }}
     )
  }
  
  getAdminUserByNumber(number:any){
    return this.http.get(environment.apiBaseUrl+'/api/getAdminUserByNumber', {  params:{
      searchKey: number
      }}
     )
  }
  getAdminHotelByNumber(number:any){
    return this.http.get(environment.apiBaseUrl+'/api/getAdminHotelByNumber', {  params:{
      searchKey: number
      }}
     )
  }
  getAdminHotelByZip(number:any){
    return this.http.get(environment.apiBaseUrl+'/api/getAdminHotelByZip', {  params:{
      searchKey: number
      }}
     )
  }
  getAdminDnrByName(dnrname:any){
    console.log("11111111111")
    return this.http.get(environment.apiBaseUrl+'/api/getAdminDnrByName', {  params:{
      searchKey: dnrname
      }}
     )
  }
  getAdminSubscriptionByTitle(title:any){
    console.log("11111111111")
    return this.http.get(environment.apiBaseUrl+'/api/getAdminSubscriptionByTitle', {  params:{
      searchKey: title
    }})
  }
  getAdminSubscriptionByMonth(month:any){
    console.log("11111111111")
    return this.http.get(environment.apiBaseUrl+'/api/getAdminSubscriptionByMonth', {  params:{
      searchKey: month
      }}
     )
  }
  getAdminSubscriptionByBenefitTitle(benefitTitle:any){
    console.log("11111111111")
    return this.http.get(environment.apiBaseUrl+'/api/getAdminSubscriptionByBenefitTitle', {  params:{
      searchKey: benefitTitle
      }}
     )
  }
 
  getAdminFrontDeskByName(name:any){
    console.log("11111111111")
    return this.http.get(environment.apiBaseUrl+'/api/getAdminFrontDeskByName', {  params:{
      searchKey: name
      }}
     )
  }
  getAdminFrontDeskByHotelName(hotelName:any){
    console.log("11111111111")
    return this.http.get(environment.apiBaseUrl+'/api/getAdminFrontDeskByHotelName', {  params:{
      searchKey: hotelName
      }}
     )
  }
  getAdminFrontDeskByUserName(userName:any){
    console.log("11111111111")
    return this.http.get(environment.apiBaseUrl+'/api/getAdminFrontDeskByUserName', {  params:{
      searchKey: userName
      }}
     )
  }

  getAdminFrontDeskByPosition(position:any){
    console.log("11111111111")
    return this.http.get(environment.apiBaseUrl+'/api/getAdminFrontDeskByPosition', {  params:{
      searchKey: position
      }}
     )
  }
  getAdminFrontDeskByEmpSince(empSince:any){
    console.log("11111111111")
    return this.http.get(environment.apiBaseUrl+'/api/getAdminFrontDeskByEmpSince', {  params:{
      searchKey: empSince
      }}
     )
  }
  getAdminliveEventListByName(name:any){
    console.log("11111111111")
    return this.http.get(environment.apiBaseUrl+'/api/getAdminLiveEventsByName', {  params:{
      searchKey: name
      }}
     )
  }
  // getAdminliveEventListByHotelName(hotelName:any){
  //   console.log("11111111111")
  //   return this.http.get(environment.apiBaseUrl+'/api/getAdminliveEventListByHotelName', {  params:{
  //     searchKey: hotelName
  //     }}
  //    )
  // }

  
  
 loginAdmin(admin:any){
  	return this.http.post(environment.apiBaseUrl+'/api/loginAdmin',admin,this.noAuthHeader)
  }
  resetAdminPassword(data:any){
  	return this.http.post(environment.apiBaseUrl+'/api/resetAdminPassword', data)
  }
 getAdminHotels(status){
  return this.http.get(environment.apiBaseUrl+'/api/getAdminHotels/'+ status)
  }
  getAdminliveEventList(){
    return this.http.get(environment.apiBaseUrl+'/api/getAdminliveEventList')
      
  }
  
  getAdminUsers(status){
    return this.http.get(environment.apiBaseUrl+'/api/getAdminUsers/'+ status)
  }
  adminFrontDeskList(){
    return this.http.get(environment.apiBaseUrl+'/api/adminfrontDeskList')
  }
  // getAdminFeedback(){
  //   return this.http.get(environment.apiBaseUrl+'/api/getAdminFeedback')
  // }
  
  getAdminTransaction(){
    return this.http.get(environment.apiBaseUrl+'/api/getAdminTransaction')
  }
  // getAdminTransactionId(id){
  //   return this.http.get(environment.apiBaseUrl+'/api/getAdminTransactionId/'+id)
  // }
  deleteAdminDnr(id){
    return this.http.delete(environment.apiBaseUrl+'/api/deleteAdminDnr/'+id)
  }

  deleteAdminFeed(id){
    return this.http.delete(environment.apiBaseUrl+'/api/deleteAdminFeed/'+id)
  }

  

  deleteAdminSubs(id){
    return this.http.delete(environment.apiBaseUrl+'/api/deleteAdminSubs/'+id)
  }
updateAdminDnrStatus(data:any, id){
    return this.http.patch(environment.apiBaseUrl+'/api/updateAdminDnrStatus/'+id, data)
  }
  updateAdminDnr(data:any, id){
    return this.http.patch(environment.apiBaseUrl+'/api/updateAdminDnr/'+id, data)
  }
  updateAdminSettings(data:any){
    return this.http.patch(environment.apiBaseUrl+'/api/updateAdminSettings/', data)
  }
  upadteAdminSubscription(data:any, id){
    return this.http.patch(environment.apiBaseUrl+'/api/updateAdminSubscription/'+id, data)
  }
  

  createAdminDnr(data:any){
    return this.http.post(environment.apiBaseUrl+'/api/createAdminDnr/', data)
  }
  createAdminSettings(data:any){
    return this.http.post(environment.apiBaseUrl+'/api/createAdminSettings/', data)
  }
  createAdminSubscription(data:any){
    return this.http.post(environment.apiBaseUrl+'/api/createAdminSubscription/', data)
  }
  getAdminSubscription(){
    return this.http.get(environment.apiBaseUrl+'/api/getAdminSubscription')
    }
    getAdminSubscriptionbyId(id){
      console.log("call update")
      return this.http.get(environment.apiBaseUrl+'/api/getAdminSubscription/'+id)
  }
    getAdminSettings(){
      return this.http.get(environment.apiBaseUrl+'/api/getAdminSettings')
      }
    getAdminDnr(sortStatus){
      console.log(sortStatus, "111111ggggggggggg")
      return this.http.get(environment.apiBaseUrl+'/api/getAdminDnr/'+ sortStatus)
      }
      getAdminDnrbyId(id){
        console.log("qwqwqwqw")
      return this.http.get(environment.apiBaseUrl+'/api/getAdminDnrbyId/'+id)
      }
      getAdminSettingsId(id){
        return this.http.get(environment.apiBaseUrl+'/api/getAdminSettingsId/'+id)
      }
    getAdminViewUsers(id){
      return this.http.get(environment.apiBaseUrl+'/api/getAdminViewUser/'+id)
    }
    getAdminViewHotels(id){
      return this.http.get(environment.apiBaseUrl+'/api/getAdminViewHotel/'+id)
    }
    
    deleteAdminToken(){
      localStorage.removeItem('accesstoken');
      localStorage.removeItem('email')
    }


}
