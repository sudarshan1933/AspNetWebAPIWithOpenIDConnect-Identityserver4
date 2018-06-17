import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../common/services/auth.service';
import { User } from 'oidc-client';
import { Observable } from 'rxjs/Observable';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
@Component({
    selector: 'counter',
    templateUrl: './counter.component.html'
})
export class CounterComponent {
    public currentCount = 0;
    user: User;
    temp: string[];
    displayErrorMessage: string;

    constructor(private _router: Router, private _authService: AuthService, private http: Http) {

        debugger;
        this.user = this._authService.currentUser;

        console.log('HomeComponent constructor as It is landing Page');
        debugger;
    }

    public incrementCounter() {
        this.currentCount++;
    }

    public callapi() {
        debugger;
        
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let accessToken = this.user.access_token;
        headers.append('Authorization', `Bearer ${accessToken}`);

        return this.http.get('https://localhost:44366/api/values')
            .map((response: Response) => response.json())
            .catch(this.handleError)
            .subscribe(m => {
                
                console.log(m);
                this.temp = m;

            }, (error) => {
                debugger;
                this.displayErrorMessage = error;
            });
            
    }
    handleError(error: Response) {
        debugger;
        return Observable.throw(error);
    }
}
