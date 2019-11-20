import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { asmblComponent } from './asmbl.component';

describe('LdrComponent', () => {
  let component: asmblComponent;
  let fixture: ComponentFixture<asmblComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ asmblComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(asmblComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
