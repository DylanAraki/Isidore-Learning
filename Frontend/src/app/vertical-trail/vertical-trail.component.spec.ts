import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalTrailComponent } from './vertical-trail.component';

describe('VerticalTrailComponent', () => {
  let component: VerticalTrailComponent;
  let fixture: ComponentFixture<VerticalTrailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerticalTrailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerticalTrailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
