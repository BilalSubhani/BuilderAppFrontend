import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhyburqComponent } from './whyburq.component';

describe('WhyburqComponent', () => {
  let component: WhyburqComponent;
  let fixture: ComponentFixture<WhyburqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhyburqComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhyburqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
