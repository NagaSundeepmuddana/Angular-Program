import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PcidComponent } from './pcid.component';

describe('PcidComponent', () => {
  let component: PcidComponent;
  let fixture: ComponentFixture<PcidComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PcidComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PcidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
