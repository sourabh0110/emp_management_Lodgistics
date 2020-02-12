import { Component, OnInit } from "@angular/core";
import { HttpService } from "../../../services/http-service/http.service";
import { IonicModelsService } from "src/app/services/ionic-models/ionic-models.service";
import { Router, NavigationExtras } from "@angular/router";
import { OfflineService } from 'src/app/services/offline-service/offline.service';
import { NativeServiceService } from 'src/app/services/native-service/native-service.service';

@Component({
  selector: "app-employee-list",
  templateUrl: "./employee-list.page.html",
  styleUrls: ["./employee-list.page.scss"]
})
export class EmployeeListPage implements OnInit {
  /**
   * Employees 
   */
  employees: any = [];
  /**
   * Replicate original values for searchBox
   */
  employeeList: any = [];
  constructor(
    private offlineService: OfflineService,
    private router: Router,
    private restApiService: HttpService,
    private ionicModels: IonicModelsService
  ) {
    
   }
   /**
    * Life Cycle method
    */
   ionViewDidEnter(){
    console.log('ionViewDidEnter');
    this.offlineService.getValues('emp').then(res => {
      if (res) {
        this.employees = this.employeeList = res;

      } else {
        this.getEmpList();
      }

    },
      err => {
        this.getEmpList();
      }
    )
   }

  ngOnInit() {
  }
  /**
   * Getting list of employees
   */
  async getEmpList() {
    this.ionicModels.showLoader("Loading..");
    await this.restApiService.getEmp().subscribe(
      res => {
        console.log(res);
        this.employees = this.employeeList = res.data;
        this.offlineService.setValues('emp', this.employees);
        this.ionicModels.hideLoader();
      },
      err => {
        console.log(err);
        this.ionicModels.hideLoader();
      }
    );
  }
  /**
   * 
   * @param employeeDetail getting employee
   * @param index getting employee index from array
   */
  empDetail(employeeDetail,index) {
    let navigationExtras: NavigationExtras = {
      state: {
        index:index,
        employee: employeeDetail
      }
    };
    this.router.navigate(["employee-detail"], navigationExtras);
  }
  /**
   * Delete employee 
   * @param index Delete employee from specific index
   */
  deleteEmp(index) {
    //delete this.employees[index];
    this.ionicModels.presentAlertConfirm().then(
      res => {
        this.employees.splice(index, 1);
        this.offlineService.setValues('emp',this.employees);
      },
      cancel => {
        console.log("Cancel Clicked");
      }
    );
  }

  /**
   * To search from search box
   * @param element Element value to be searched
   */
  searchEmp(element) {

    this.onCancel();
    var text = element.srcElement.value; //Input Value
    if (!text) {
      return;
    }
    this.employees = this.employees.filter(res => {
      return res.employee_name.toLowerCase().includes(text);
    })
    console.log(this.employees);
  }
  /**
   * To reinitialise the the employee list
   */
  onCancel() {
    this.employees = this.employeeList;
  }
}
