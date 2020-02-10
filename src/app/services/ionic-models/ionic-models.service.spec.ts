import { TestBed } from '@angular/core/testing';

import { IonicModelsService } from './ionic-models.service';

describe('IonicModelsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IonicModelsService = TestBed.get(IonicModelsService);
    expect(service).toBeTruthy();
  });
});
