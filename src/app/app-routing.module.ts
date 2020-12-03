import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewSnippetComponent } from './account/new-snippet.component';
import { HomeComponent } from './home';
import { AuthGuard } from './_helpers';

const accountModule = () =>
  import('./account/account.module').then((x) => x.AccountModule);
const usersModule = () =>
  import('./users/users.module').then((x) => x.UsersModule);

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'post', component: NewSnippetComponent, canActivate: [AuthGuard] },
  { path: 'users', loadChildren: usersModule, canActivate: [AuthGuard] },
  { path: 'account', loadChildren: accountModule },

  // otherwise redirect to home
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
