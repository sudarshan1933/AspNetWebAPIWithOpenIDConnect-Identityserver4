import { Component, OnInit, NgZone } from '@angular/core';

import { AuthService } from '../common/services/auth.service'
import { UserManager, User } from 'oidc-client';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    templateUrl: "./authcallback.component.html"
})
export class AuthCallbackComponent implements OnInit {
    loggedIn: Boolean;
    user: User;
    
    constructor(private _router:Router,private _authService: AuthService,private _zone:NgZone, private_activatedRoute:ActivatedRoute)
    { 
        debugger;
        console.log('authcallback constructour called');
        debugger;
        //alert('aaaaaaaaaaaa');
        
    }



    ngOnInit() 
    {
        debugger;
        this._authService.completeAuthentication().then(
            (u)=>
            {
                console.log('completeAuthentication ngOnInit');
                console.log(this.user);
                this.user = u;
                debugger;
                if(this.user)
                {
                    debugger;
                    this._router.navigate(["/"]);
                }
            }
        );
        
    }
    
}

