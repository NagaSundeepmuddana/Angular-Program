import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QhtComponent } from './qht.component';

describe('QhtComponent', () => {
  let component: QhtComponent;
  let fixture: ComponentFixture<QhtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QhtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QhtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
