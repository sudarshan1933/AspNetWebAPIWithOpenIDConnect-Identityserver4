import { Component } from '@angular/core';
import { AuthService } from '../common/services/auth.service';



@Component({
    selector: 'testnew',
    templateUrl: './testnew.component.html'
})
export class TestNewComponent {
    //user: User;

    constructor() {
        console.log('TestNewComponent constructor');
        debugger;

    }

    ngOnInit() {
        debugger;
        //this._authService.completeAuthentication().then(
        //    (u)=>
        //    {
        //        console.log('completeAuthentication ngOnInit');
        //        //console.log(this.user);
        //        //this.user = u;
        //        debugger;
        //        //if(this.user)
        //        //{
        //        //    debugger;
        //        //    this._router.navigate(["/"]);
        //        //}
        //    }
        //);

    }

}
