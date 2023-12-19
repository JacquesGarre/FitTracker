import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExerciseDetailsPage } from './exercise-details.page';

describe('ExerciseDetailsPage', () => {
  let component: ExerciseDetailsPage;
  let fixture: ComponentFixture<ExerciseDetailsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ExerciseDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
