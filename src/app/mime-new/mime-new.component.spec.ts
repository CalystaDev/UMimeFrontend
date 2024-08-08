import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MimeNewComponent } from './mime-new.component';

describe('MimeNewComponent', () => {
  let component: MimeNewComponent;
  let fixture: ComponentFixture<MimeNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MimeNewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MimeNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
