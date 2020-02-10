import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../services/http-service/http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModelsService } from 'src/app/services/ionic-models/ionic-models.service';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.page.html',
  styleUrls: ['./employee-detail.page.scss'],
})
export class EmployeeDetailPage implements OnInit {
  employee:any={};
  constructor(private ionicModels:IonicModelsService, private route: ActivatedRoute,
    public router: Router) {
      //Calling the function to set data
      this.route.queryParams.subscribe(params => {
        if (this.router.getCurrentNavigation().extras.state) {
          this.employee = this.router.getCurrentNavigation().extras.state.employee;
          console.log(this.employee);
        }
      });
     }

  ngOnInit() {
  //  this.getEmployee();
  }
  
}
