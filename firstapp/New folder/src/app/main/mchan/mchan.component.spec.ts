import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MchanComponent } from './mchan.component';

describe('MchanComponent', () => {
  let component: MchanComponent;
  let fixture: ComponentFixture<MchanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MchanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MchanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
