import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizontalTrailComponent } from './horizontal-trail.component';

describe('HorizontalTrailComponent', () => {
  let component: HorizontalTrailComponent;
  let fixture: ComponentFixture<HorizontalTrailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HorizontalTrailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HorizontalTrailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
