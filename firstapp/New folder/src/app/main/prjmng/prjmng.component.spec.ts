import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrjmngComponent } from './prjmng.component';

describe('PrjmngComponent', () => {
  let component: PrjmngComponent;
  let fixture: ComponentFixture<PrjmngComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrjmngComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrjmngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
