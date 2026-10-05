import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributionActivity } from './contribution-activity';

describe('ContributionActivity', () => {
  let component: ContributionActivity;
  let fixture: ComponentFixture<ContributionActivity>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContributionActivity],
    }).compileComponents();

    fixture = TestBed.createComponent(ContributionActivity);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
