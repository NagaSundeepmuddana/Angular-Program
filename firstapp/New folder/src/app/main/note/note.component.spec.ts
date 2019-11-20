import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { noteComponent } from './note.component';

describe('DashComponent', () => {
  let component: noteComponent;
  let fixture: ComponentFixture<noteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ noteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(noteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
