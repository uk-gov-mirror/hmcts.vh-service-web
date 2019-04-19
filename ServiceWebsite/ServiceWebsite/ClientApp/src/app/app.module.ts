import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler, APP_INITIALIZER } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AdalService, AdalGuard, AdalInterceptor } from 'adal-angular4';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorService } from './services/error.service';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { LoggerService } from './services/logger.service';
import { ConfigService, ENVIRONMENT_CONFIG } from './services/config.service';
import { Config } from './models/config';
import { CustomAdalInterceptor } from './services/custom-adal-interceptor';

import { GuidanceService } from './services/guidance.service';
import { PrintService } from './services/print.service';
import { DocumentRedirectService } from './services/document-redirect.service';
import { AppInsightsLogger } from './services/app-insights-logger.service';
import { HomeComponent } from './pages/home/home.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { GuidanceComponent } from './pages/guidance/guidance.component';
import { IndividualJourneyModule } from './modules/individual-journey/individual-journey.module';
import { BaseJourneyModule } from './modules/base-journey/base-journey.module';
import { SecurityModule } from './modules/security/security.module';
import { SharedModule } from './modules/shared/shared.module';
import { ErrorComponent } from './pages/error/error.component';
import { RepresentativeJourneyModule } from './modules/representative-journey/representative-journey.module';

export function initConfiguration(configService: ConfigService) {
  return () => configService.load();
}

@NgModule({
  declarations: [
    AppComponent,
    ErrorComponent,
    PrivacyPolicyComponent,
    HomeComponent,
    PageNotFoundComponent,
    GuidanceComponent
  ],
  imports: [
    // angular
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,

    // app
    AppRoutingModule,
    IndividualJourneyModule,
    RepresentativeJourneyModule,
    BaseJourneyModule,
    SecurityModule,
    SharedModule,
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: initConfiguration, deps: [ConfigService], multi: true },
    { provide: Config, useFactory: () => ENVIRONMENT_CONFIG },
    { provide: HTTP_INTERCEPTORS, useClass: CustomAdalInterceptor, multi: true },
    AppRoutingModule,
    ConfigService,
    LoggerService,
    AppInsightsLogger,
    AdalService,
    AdalGuard,
    AdalInterceptor,
    ErrorService,
    GuidanceService,
    PrintService,
    DocumentRedirectService,
    { provide: ErrorHandler, useClass: ErrorService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
