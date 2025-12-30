/// <reference types="@testing-library/jest-dom" />

// Augment Jest's `expect` type with jest-dom matchers
// This is needed because we import expect from @jest/globals
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers'

declare global {
    namespace jest {
        interface Matchers<R = void> extends TestingLibraryMatchers<typeof expect.stringContaining, R> { }
    }
}
