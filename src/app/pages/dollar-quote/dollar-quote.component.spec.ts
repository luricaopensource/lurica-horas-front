import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DollarQuoteComponent } from './dollar-quote.component';

describe('DollarQuoteComponent', () => {
  let component: DollarQuoteComponent;
  let fixture: ComponentFixture<DollarQuoteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DollarQuoteComponent]
    });
    fixture = TestBed.createComponent(DollarQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
