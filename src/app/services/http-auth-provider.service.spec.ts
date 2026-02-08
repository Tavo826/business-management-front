import { TestBed } from '@angular/core/testing';

import { HttpAuthProviderService } from './http-auth-provider.service';

describe('HttpAuthProviderService', () => {
  let service: HttpAuthProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpAuthProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
