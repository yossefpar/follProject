import { User } from '../models/User';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { environment } from 'src/environments/environment';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private currentUserSource$ = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource$.asObservable();

  constructor(private http: HttpClient) { }

  login(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/login' , model)
    .pipe(
      map((response: User) => {
        const user = response;
        if(user){
          this.setCurentUser(user);
        }
      })
    )
  }

  register(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/register', model)
    .pipe(
      map((user: User) => {
        if (user) {
          this.setCurentUser(user);
        }
        return user;
      })
    )
  }

  setCurentUser(user:User){
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource$.next(user);
  }

  logout(){
    localStorage.removeItem('user')
    this.currentUserSource$.next();
  }
}
