import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './features/components/login/login.component';
import { AppComponent } from './app.component';
import { AuthGuard } from './features/components/login/auth-guard';
import { HomeComponent } from './features/components/home/home.component';

const routes: Routes = [
      { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
      { path: 'login', component: LoginComponent },
       // otherwise redirect to home
      { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
