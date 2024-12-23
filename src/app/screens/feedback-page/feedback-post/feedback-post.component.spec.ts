import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackPostComponent } from './feedback-post.component';

describe('FeedbackPostComponent', () => {
  let component: FeedbackPostComponent;
  let fixture: ComponentFixture<FeedbackPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedbackPostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedbackPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
