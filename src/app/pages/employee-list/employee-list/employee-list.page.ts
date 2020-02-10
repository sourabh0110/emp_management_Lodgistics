import { Component, OnInit } from "@angular/core";
import { HttpService } from "../../../services/http-service/http.service";
import { IonicModelsService } from "src/app/services/ionic-models/ionic-models.service";
import { Router, NavigationExtras } from "@angular/router";
import { OfflineService } from 'src/app/services/offline-service/offline.service';

@Component({
  selector: "app-employee-list",
  templateUrl: "./employee-list.page.html",
  styleUrls: ["./employee-list.page.scss"]
})
export class EmployeeListPage implements OnInit {
  employees: any = [];
  employeeList:any=[];
  constructor(
    private offlineService:OfflineService,
    private router: Router,
    private restApiService: HttpService,
    private ionicModels: IonicModelsService
  ) {}

  ngOnInit() {
    this.offlineService.getValues('emp').then(res=>{
      this.employees=this.employeeList=res;
    },
    err=> {
       this.getEmpList();
    }
    )
    
  }

  async getEmpList() {
    this.ionicModels.showLoader("Loading..");
    await this.restApiService.getClassroom().subscribe(
      res => {
        console.log(res);
        this.employees= this.employeeList = res.data;
        this.offlineService.setValues('emp',this.employees);
        this.ionicModels.hideLoader();
      },
      err => {
        console.log(err);
        this.ionicModels.hideLoader();
      }
    );
  }

  empDetail(employeeDetail) {
    let navigationExtras: NavigationExtras = {
      state: {
        employee: employeeDetail
      }
    };
    this.router.navigate(["employee-detail"], navigationExtras);
  }
  deleteEmp(index) {
    //delete this.employees[index];
    this.ionicModels.presentAlertConfirm().then(
      res => {
        this.employees.splice(index, 1);
      },
      cancel => {
        console.log("Cancel Clicked");
      }
    );
  }
  searchEmp(element){
    
    this.onCancel();
    var text = element.srcElement.value; //Input Value
    if (!text) {
      return;
    }
    this.employees=this.employees.filter(res=>{
      return res.employee_name.toLowerCase().includes(text);
    })
    console.log(this.employees);
  }
  onCancel(){
    this.employees = this.employeeList;
    //this.questionsArray=this.sampleData.faqs; //Reset questions Array from original Array
  }
}
