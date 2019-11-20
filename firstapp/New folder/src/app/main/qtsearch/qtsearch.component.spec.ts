import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QtsearchComponent } from './qtsearch.component';

describe('QtsearchComponent', () => {
  let component: QtsearchComponent;
  let fixture: ComponentFixture<QtsearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QtsearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QtsearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
