import { TestBed } from '@angular/core/testing';

import { LeccionesService } from './lecciones.service';

describe('LeccionesService', () => {
  let service: LeccionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeccionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
