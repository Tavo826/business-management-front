import { TestBed } from '@angular/core/testing';

import { HttpBusinessProviderService } from './http-business-provider.service';

describe('HttpBusinessProviderService', () => {
  let service: HttpBusinessProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpBusinessProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
