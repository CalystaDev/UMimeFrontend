import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostDirectoryComponent } from './host-directory.component';

describe('HostDirectoryComponent', () => {
  let component: HostDirectoryComponent;
  let fixture: ComponentFixture<HostDirectoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostDirectoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostDirectoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
