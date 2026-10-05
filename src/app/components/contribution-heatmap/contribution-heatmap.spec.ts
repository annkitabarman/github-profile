import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributionHeatmap } from './contribution-heatmap';

describe('ContributionHeatmap', () => {
  let component: ContributionHeatmap;
  let fixture: ComponentFixture<ContributionHeatmap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContributionHeatmap],
    }).compileComponents();

    fixture = TestBed.createComponent(ContributionHeatmap);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
