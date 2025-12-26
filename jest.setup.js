// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Polyfill for fetch and Response in Node.js environment
import { TextEncoder, TextDecoder } from 'util'

// Add polyfills to global scope
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Mock fetch for Node.js environment (used in integration tests)
global.fetch = jest.fn()
global.Request = jest.fn()
global.Response = jest.fn()
global.Headers = jest.fn()