import { CanCreateComponent } from '../individual-base-component/component-test-bed.spec';
import { DifferentHearingTypesComponent } from './different-hearing-types.component';

describe('DifferentHearingTypesComponent', () => {
  it('can be created', () => {
    CanCreateComponent(DifferentHearingTypesComponent);
  });
});
