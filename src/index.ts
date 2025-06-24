// Default exports (backward compatible - uses v1)
export { generateUISchema, validateJSONSchema } from './v1/index';

// Versioned exports                                                                                              │
export * as v1 from './v1/index';
