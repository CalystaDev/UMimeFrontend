import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratedMimePageComponent } from './generated-mime-page.component';

describe('GeneratedMimePageComponent', () => {
  let component: GeneratedMimePageComponent;
  let fixture: ComponentFixture<GeneratedMimePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneratedMimePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneratedMimePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
