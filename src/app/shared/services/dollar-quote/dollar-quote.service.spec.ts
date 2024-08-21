import { TestBed } from '@angular/core/testing';

import { DollarQuoteService } from './dollar-quote.service';

describe('DollarQuoteService', () => {
  let service: DollarQuoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DollarQuoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
