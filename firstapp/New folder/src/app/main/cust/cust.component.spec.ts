import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { custComponent } from './cust.component';

describe('DashComponent', () => {
  let component: custComponent;
  let fixture: ComponentFixture<custComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ custComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(custComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
