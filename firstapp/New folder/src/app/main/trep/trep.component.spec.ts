import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TRepComponent } from './trep.component';

describe('TRepComponent', () => {
  let component: TRepComponent;
  let fixture: ComponentFixture<TRepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TRepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TRepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
