import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrjdtsComponent } from './prjdts.component';

describe('PrjdtsComponent', () => {
  let component: PrjdtsComponent;
  let fixture: ComponentFixture<PrjdtsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrjdtsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrjdtsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
