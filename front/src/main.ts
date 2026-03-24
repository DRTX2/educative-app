/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Fix for AutofillOverlayContentService "reading 'includes' of null" error
(window as any).bootstrapAutofillOverlayContentService = (window as any).bootstrapAutofillOverlayContentService || {};
const originalSetQualified = (window as any).bootstrapAutofillOverlayContentService.setQualifiedLoginFillType;
if (originalSetQualified) {
  (window as any).bootstrapAutofillOverlayContentService.setQualifiedLoginFillType = function () {
    const el = document.activeElement;
    if (!el) return;
    return originalSetQualified.apply(this, arguments);
  };
}

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
