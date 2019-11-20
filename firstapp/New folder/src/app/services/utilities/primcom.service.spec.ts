import { TestBed, inject } from '@angular/core/testing';

import { PrimcomService } from './primcom.service';

describe('PrimcomService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PrimcomService]
    });
  });

  it('should be created', inject([PrimcomService], (service: PrimcomService) => {
    expect(service).toBeTruthy();
  }));
});
