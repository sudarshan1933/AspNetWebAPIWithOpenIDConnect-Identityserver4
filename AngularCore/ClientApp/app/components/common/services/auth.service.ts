
import { Injectable, EventEmitter } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { UserManager, User, Log } from 'oidc-client';

const settings: any = {
    authority: 'https://localhost:44381',
    client_id: 'AngularCore',
    redirect_uri: 'https://localhost:44301/authcallback',
    post_logout_redirect_uri: 'https://localhost:44301/',
    response_type: 'id_token token',
    scope: 'openid profile mywebapicore',
    accessTokenExpiringNotificationTime: 4,
    filterProtocolClaims: true,
    loadUserInfo: true   
};

Log.logger = console;
Log.level = Log.DEBUG;

@Injectable()
export class AuthService {
    mgr: UserManager = new UserManager(settings);
    userLoadededEvent: EventEmitter<User> = new EventEmitter<User>();
    currentUser: User;
    loggedIn = false;

    authHeaders: Headers;


    constructor(private http: Http) {

        this.mgr.getUser()
            .then((user) => {
                if (user) {
                    this.loggedIn = true;
                    this.currentUser = user;
                    this.userLoadededEvent.emit(user);
                }
                else {
                    this.loggedIn = false;
                }
            })
            .catch((err) => {
                this.loggedIn = false;
            });

        // this.mgr.events.addUserLoaded((user) => {
        //   this.currentUser = user;
        //     console.log('authService addUserLoaded', user);

        // });

        // this.mgr.events.addUserUnloaded((e) => {
        //     console.log('user unloaded');
        //   this.loggedIn = false;
        // });

    }

    isLoggedIn(): boolean {
        return this.currentUser != null && !this.currentUser.expired;
    };
    getClaims(): any {
        return this.currentUser.profile;
    };
    getAuthorizationHeaderValue(): string {
        return `${this.currentUser.token_type} ${this.currentUser.access_token}`;
    }
    startAuthentication(): Promise<void> {
        return this.mgr.signinRedirect();
    }

    completeAuthentication(): Promise<User> {
        return this.mgr.signinRedirectCallback().then(user => {
            debugger;
            console.log('completeAuthentication');

            console.log(user);
            this.currentUser = user;
            debugger;
            return this.currentUser;
        });
    }
    // isLoggedInObs(): Observable<boolean> {
    //   debugger;
    //   return Observable.fromPromise(this.mgr.getUser()).map<User, boolean>((user) => {
    //     if (user) {
    //       debugger;
    //       return true;
    //     } else {
    //       debugger;
    //       return false;
    //     }
    //   });
    // }

    // clearState() {
    //   this.mgr.clearStaleState().then(function () {
    //     console.log('clearStateState success');
    //   }).catch(function (e) {
    //     console.log('clearStateState error', e.message);
    //   });
    // }

    // getUser() {
    //   this.mgr.getUser().then((user) => {
    //     this.currentUser = user;
    //     console.log('got user', user);
    //     this.userLoadededEvent.emit(user);
    //   }).catch(function (err) {
    //     console.log(err);
    //   });
    // }

    // removeUser() {
    //   this.mgr.removeUser().then(() => {
    //     this.userLoadededEvent.emit(null);
    //     console.log('user removed');
    //   }).catch(function (err) {
    //     console.log(err);
    //   });
    // }

    // startSigninMainWindow() {
    //   debugger;
    //   this.mgr.signinRedirect({ data: 'some data' }).then(function () {
    //     debugger;
    //     console.log('signinRedirect done');
    //   }).catch(function (err) {
    //     console.log(err);
    //   });
    // }
    // endSigninMainWindow() {
    //   this.mgr.signinRedirectCallback().then(function (user) {
    //     debugger;
    //     if (user == null) {
    //       debugger;
    //         document.getElementById("waiting").style.display = "none";
    //         document.getElementById("error").innerText = "No sign-in request pending.";
    //     }
    //     else {
    //       debugger;
    //       this._router.navigate(['/sec']);
    //     }
    //   }
    // ).catch(function (err) {
    //     console.log(err);
    //   });
    // }



    // startSignoutMainWindow() {
    //   this.mgr.signoutRedirect().then(function (resp) {
    //     console.log('signed out', resp);
    //     setTimeout(5000, () => {
    //       console.log('testing to see if fired...');

    //     });
    //   }).catch(function (err) {
    //     console.log(err);
    //   });
    // };

    // endSignoutMainWindow() {
    //   this.mgr.signoutRedirectCallback().then(function (resp) {
    //     console.log('signed out', resp);
    //   }).catch(function (err) {
    //     console.log(err);
    //   });
    // };
    /**
     * Example of how you can make auth request using angulars http methods.
     * @param options if options are not supplied the default content type is application/json
     */
    //AuthGet(url: string, options?: RequestOptions): Observable<Response> {

    //    if (options) {
    //        options = this._setRequestOptions(options);
    //    }
    //    else {
    //        options = this._setRequestOptions();
    //    }
    //    return this.http.get(url, options);
    //}
    ///**
    // * @param options if options are not supplied the default content type is application/json
    // */
    //AuthPut(url: string, data: any, options?: RequestOptions): Observable<Response> {

    //    let body = JSON.stringify(data);

    //    if (options) {
    //        options = this._setRequestOptions(options);
    //    }
    //    else {
    //        options = this._setRequestOptions();
    //    }
    //    return this.http.put(url, body, options);
    //}
    ///**
    // * @param options if options are not supplied the default content type is application/json
    // */
    //AuthDelete(url: string, options?: RequestOptions): Observable<Response> {

    //    if (options) {
    //        options = this._setRequestOptions(options);
    //    }
    //    else {
    //        options = this._setRequestOptions();
    //    }
    //    return this.http.delete(url, options);
    //}
    ///**
    // * @param options if options are not supplied the default content type is application/json
    // */
    //AuthPost(url: string, data: any, options?: RequestOptions): Observable<Response> {

    //    let body = JSON.stringify(data);

    //    if (options) {
    //        options = this._setRequestOptions(options);
    //    } else {
    //        options = this._setRequestOptions();
    //    }
    //    return this.http.post(url, body, options);
    //}


    //private _setAuthHeaders(user: any): void {
    //    this.authHeaders = new Headers();
    //    this.authHeaders.append('Authorization', user.token_type + ' ' + user.access_token);
    //    if (this.authHeaders.get('Content-Type')) {

    //    } else {
    //        this.authHeaders.append('Content-Type', 'application/json');
    //    }
    //}
    //private _setRequestOptions(options?: RequestOptions) {
    //    if (this.loggedIn) {
    //        this._setAuthHeaders(this.currentUser);
    //    }
    //    if (options) {
    //        options.headers.append(this.authHeaders.keys[0], this.authHeaders.values[0]);
    //    } else {
    //        options = new RequestOptions({ headers: this.authHeaders, body: '' });
    //    }

    //    return options;
    //}

}


