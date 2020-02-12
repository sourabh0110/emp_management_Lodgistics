import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { EmployeeDetailPageRoutingModule } from './employee-detail-routing.module';

import { EmployeeDetailPage } from './employee-detail.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,ReactiveFormsModule,
    IonicModule,
    EmployeeDetailPageRoutingModule
  ],
  declarations: [EmployeeDetailPage]
})
export class EmployeeDetailPageModule {}
