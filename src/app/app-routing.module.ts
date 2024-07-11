import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule), data: { mode: 'login' } },
  { path: 'register', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule), data: { mode: 'register' } },
  { path: 'dashboard', loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'users', loadChildren: () => import('./pages/users/users.module').then(m => m.UsersModule) },
  { path: 'companies', loadChildren: () => import('./pages/companies/companies.module').then(m => m.CompaniesModule) },
  { path: 'reports', loadChildren: () => import('./pages/reports/reports.module').then(m => m.ReportsModule) }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
