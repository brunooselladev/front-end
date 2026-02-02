import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { MatStepperIntl } from '@angular/material/stepper';

import { routes } from './app.routes';
import { MatStepperIntlEs } from './utils/mat-stepper-intl.es';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), 
    { provide: MatStepperIntl, useClass: MatStepperIntlEs },
  ]
};
