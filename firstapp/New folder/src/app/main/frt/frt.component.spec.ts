import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { frtComponent } from './frt.component';

describe('DashComponent', () => {
  let component: frtComponent;
  let fixture: ComponentFixture<frtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ frtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(frtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
