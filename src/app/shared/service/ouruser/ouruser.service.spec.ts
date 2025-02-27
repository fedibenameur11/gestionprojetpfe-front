import { TestBed } from '@angular/core/testing';

import { OuruserService } from './ouruser.service';

describe('OuruserService', () => {
  let service: OuruserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OuruserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
