// Global test setup for Vitest
import 'zone.js';
import '@angular/compiler';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

// Configure Angular testing environment
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
  {
    teardown: { destroyAfterEach: true }
  }
);

// Add any global test setup you need here
// For example, you could set up global mocks for services or APIs

global.ResizeObserver = class ResizeObserver {
  observe() {
    // Mock implementation - intentionally empty
  }
  unobserve() {
    // Mock implementation - intentionally empty
  }
  disconnect() {
    // Mock implementation - intentionally empty
  }
};