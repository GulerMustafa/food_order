import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { OrderSelectionComponent } from './order-selection/order-selection.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'order-selection' },
  { path: 'order-selection', component: OrderSelectionComponent },
  { path: 'order-details', component: OrderDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
