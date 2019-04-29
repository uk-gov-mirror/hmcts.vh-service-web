import { JourneyFactory } from 'src/app/modules/base-journey/services/journey.factory';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule} from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { BaseJourneyRoutingModule } from './base-journey-routing.module';

@NgModule({
  providers: [
    JourneyFactory
  ],
  imports: [
    // angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    // app
    SharedModule,
    BaseJourneyRoutingModule,
  ],
})
export class BaseJourneyModule {
}
