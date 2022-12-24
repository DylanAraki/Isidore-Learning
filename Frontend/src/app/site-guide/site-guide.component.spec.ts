import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteGuideComponent } from './site-guide.component';

describe('SiteGuideComponent', () => {
  let component: SiteGuideComponent;
  let fixture: ComponentFixture<SiteGuideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SiteGuideComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiteGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
