import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StartWorkoutPage } from './start-workout.page';

describe('StartWorkoutPage', () => {
  let component: StartWorkoutPage;
  let fixture: ComponentFixture<StartWorkoutPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(StartWorkoutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
