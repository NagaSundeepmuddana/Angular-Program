import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LdrComponent } from './ldr.component';

describe('LdrComponent', () => {
  let component: LdrComponent;
  let fixture: ComponentFixture<LdrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LdrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LdrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
