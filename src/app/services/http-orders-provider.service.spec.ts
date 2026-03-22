import { TestBed } from '@angular/core/testing';

import { HttpOrdersProviderService } from './http-orders-provider.service';

describe('HttpOrdersProviderService', () => {
  let service: HttpOrdersProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpOrdersProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
