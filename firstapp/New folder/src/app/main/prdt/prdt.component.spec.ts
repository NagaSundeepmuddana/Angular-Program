import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { prdtComponent } from './prdt.component';

describe('DashComponent', () => {
  let component: prdtComponent;
  let fixture: ComponentFixture<prdtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ prdtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(prdtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
