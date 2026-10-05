import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceholderPage } from './placeholder-page';

describe('PlaceholderPage', () => {
  let component: PlaceholderPage;
  let fixture: ComponentFixture<PlaceholderPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaceholderPage],
    }).compileComponents();

    fixture = TestBed.createComponent(PlaceholderPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
