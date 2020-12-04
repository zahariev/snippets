import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from './http.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import jwt_decode from 'jwt-decode';
import { environment } from '@environments/environment';
import { User, authUser } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private userSubject: BehaviorSubject<authUser>;
  public user: Observable<authUser>;

  constructor(private router: Router, private http: HttpService) {
    this.userSubject = new BehaviorSubject<authUser>(
      JSON.parse(localStorage.getItem('user'))
    );
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): authUser {
    return this.userSubject.value;
  }

  login(username, password) {
    return this.http.authenticate(username, password).pipe(
      map((user: authUser) => {
        var decoded: authUser = jwt_decode(user.access_token);
        user = Object.assign(decoded, user);

        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('user', JSON.stringify(user));

        this.userSubject.next(user);
        return user;
      })
    );
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/account/login']);
  }

  register(user: User) {
    return this.http.post(`/user/register`, user);
  }

  getAll() {
    return this.http.get(`/user`);
  }

  getById(id: string) {
    return this.http.get(`/user/${id}`);
  }

  update(id, params) {
    return this.http.put(`/user/${id}`, params).pipe(
      map((x) => {
        // update stored user if the logged in user updated their own record
        if (id == this.userValue._id) {
          // update local storage
          const user = { ...this.userValue, ...params };
          localStorage.setItem('user', JSON.stringify(user));

          // publish updated user to subscribers
          this.userSubject.next(user);
        }
        return x;
      })
    );
  }

  delete(id: string) {
    return this.http.delete(`${environment.apiUrl}/user/${id}`).pipe(
      map((x) => {
        // auto logout if the logged in user deleted their own record
        if (id == this.userValue._id) {
          this.logout();
        }
        return x;
      })
    );
  }
}
