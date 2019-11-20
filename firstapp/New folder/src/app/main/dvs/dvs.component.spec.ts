import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { dvsComponent } from './dvs.component';

describe('PcrComponent', () => {
  let component: dvsComponent;
  let fixture: ComponentFixture<dvsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ dvsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(dvsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});