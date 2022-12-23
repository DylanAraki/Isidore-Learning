import { TestBed } from '@angular/core/testing';

import { EditStateHandlerService } from './edit-state-handler.service';

describe('EditStateHandlerService', () => {
  let service: EditStateHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditStateHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
