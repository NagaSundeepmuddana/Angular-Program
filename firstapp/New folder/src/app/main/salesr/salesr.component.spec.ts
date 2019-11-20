import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { salesrComponent } from './salesr.component';

describe('DashComponent', () => {
  let component: salesrComponent;
  let fixture: ComponentFixture<salesrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ salesrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(salesrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
