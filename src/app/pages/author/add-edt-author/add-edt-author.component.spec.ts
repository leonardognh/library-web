import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEdtAuthorComponent } from './add-edt-author.component';

describe('AddEdtAuthorComponent', () => {
  let component: AddEdtAuthorComponent;
  let fixture: ComponentFixture<AddEdtAuthorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEdtAuthorComponent]
    });
    fixture = TestBed.createComponent(AddEdtAuthorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
