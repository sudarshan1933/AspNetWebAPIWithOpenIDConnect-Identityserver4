import { Component } from '@angular/core';
import { AuthService } from '../common/services/auth.service';
import { User } from 'oidc-client';
import { Router } from '@angular/router';

@Component({
    selector: 'home',
    templateUrl: './home.component.html'
})
export class HomeComponent {

    user: User;

    constructor(private _router: Router, private _authService: AuthService) {
        console.log('HomeComponent constructor as It is landing Page');
        debugger;


    }
    ngOnInit() {
        debugger;
        this._authService.completeAuthentication().then(
            (u) => {
                console.log('completeAuthentication ngOnInit');
                console.log(this.user);
                this.user = u;
                debugger;
                if (this.user) {
                    debugger;
                    this._router.navigate(["/counter"]);
                }
            }
        );

    }

}
