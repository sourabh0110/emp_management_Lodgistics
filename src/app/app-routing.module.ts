import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'employee-list', pathMatch: 'full' },
  {
    path: 'employee-list',
    loadChildren: () => import('./pages/employee-list/employee-list/employee-list.module').then( m => m.EmployeeListPageModule)
    
  },
  {
    path: 'employee-detail',
    loadChildren: () => import('./pages/employee-detail/employee-detail/employee-detail.module').then( m => m.EmployeeDetailPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
