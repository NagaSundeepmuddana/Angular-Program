import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrjComponent } from './prj.component';

describe('PrjComponent', () => {
  let component: PrjComponent;
  let fixture: ComponentFixture<PrjComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrjComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrjComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
