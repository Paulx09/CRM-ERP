import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize, catchError, throwError } from 'rxjs';
import { AuthService } from '../../auth';
import { URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  
  constructor(
    private http: HttpClient,
    public authservice: AuthService,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  registerRole(data: any) {
    // Transporta información a diferentes componentes de nuestra aplicación
    this.isLoadingSubject.next(true);

    let headers = new HttpHeaders({'Authorization': 'Bearer '+ this.authservice.token});
    let URL = URL_SERVICIOS + "/roles";
    return this.http.post(URL, data, {headers: headers}).pipe(
      // Finaliza tu petición HTTP
      finalize(()=>this.isLoadingSubject.next(false))
    );
  }

  listRoles(page = 1, search:string= '') {
    this.isLoadingSubject.next(true);

    let headers = new HttpHeaders({'Authorization': 'Bearer '+ this.authservice.token});
    let URL = URL_SERVICIOS + "/roles?page="+page+"&search="+search;
    return this.http.get(URL, {headers: headers}).pipe(
      // Finaliza tu petición HTTP
      finalize(()=>this.isLoadingSubject.next(false))
    );
  }
}
