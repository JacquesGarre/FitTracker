import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgramDetailsPage } from './program-details.page';

describe('ProgramDetailsPage', () => {
  let component: ProgramDetailsPage;
  let fixture: ComponentFixture<ProgramDetailsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ProgramDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
