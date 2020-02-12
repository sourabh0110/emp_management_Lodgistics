import { TestBed } from '@angular/core/testing';

import { NativeServiceService } from './native-service.service';

describe('NativeServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NativeServiceService = TestBed.get(NativeServiceService);
    expect(service).toBeTruthy();
  });
});
