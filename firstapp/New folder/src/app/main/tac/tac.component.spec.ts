import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { tacComponent } from './tac.component';

describe('DashComponent', () => {
  let component: tacComponent;
  let fixture: ComponentFixture<tacComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ tacComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(tacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
