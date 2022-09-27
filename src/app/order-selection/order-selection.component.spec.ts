import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSelectionComponent } from './order-selection.component';

describe('OrderSelectionComponent', () => {
  let component: OrderSelectionComponent;
  let fixture: ComponentFixture<OrderSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderSelectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
