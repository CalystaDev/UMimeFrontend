import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MimeCardComponent } from './mime-card.component';

describe('MimeCardComponent', () => {
  let component: MimeCardComponent;
  let fixture: ComponentFixture<MimeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MimeCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MimeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
