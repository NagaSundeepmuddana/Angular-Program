import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrjstgComponent } from './prjstg.component';

describe('PrjstgComponent', () => {
  let component: PrjstgComponent;
  let fixture: ComponentFixture<PrjstgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrjstgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrjstgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
