import { TestBed } from '@angular/core/testing';

import { PreventUnsavedChangesGuard } from './prevent-usaved-changes.guard';

describe('PreventUsavedChangesGuard', () => {
  let guard: PreventUnsavedChangesGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PreventUnsavedChangesGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
