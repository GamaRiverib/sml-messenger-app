import { TestBed } from '@angular/core/testing';

import { MylocationService } from './mylocation.service';

describe('MylocationService', () => {
  let service: MylocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MylocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
