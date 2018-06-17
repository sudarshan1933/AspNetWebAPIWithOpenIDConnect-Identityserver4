import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './components/app/app.component';
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { HomeComponent } from './components/home/home.component';
import { FetchDataComponent } from './components/fetchdata/fetchdata.component';
import { CounterComponent } from './components/counter/counter.component';

import { AuthGuardService } from './components/common/guards/auth.guard';
import { AuthService } from './components/common/services/auth.service';
import { AuthCallbackComponent } from './components/authcallback/authcallback.component';
import { TestNewComponent } from './components/testnew/testnew.component';

@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        CounterComponent,
        FetchDataComponent,
        HomeComponent,
        AuthCallbackComponent,
        TestNewComponent
    ],
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        RouterModule.forRoot([
            { path: '', redirectTo: 'fetch-data', pathMatch: 'full' },
            { path: 'home', component: HomeComponent},
            { path: 'counter', component: CounterComponent, canActivate: [AuthGuardService] },
            { path: 'fetch-data', component: FetchDataComponent},
            { path: 'authcallback', component: AuthCallbackComponent },
            { path: 'testnew', component: TestNewComponent },
            { path: '**', redirectTo: 'home' }
        ])
    ],
    providers: [AuthGuardService, AuthService]

})
export class AppModuleShared {
}
