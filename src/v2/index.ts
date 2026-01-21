// V2 API exports - new JSONForms v2 schema format
export { generateUISchema } from './generateUISchema';

// Condition utilities
export {
  buildConditionSchema,
  buildSchemaBasedCondition,
  createSectionRule,
  validateConditions
} from './conditions';

// Schema utilities
export { extractConditionalProperties } from './utils';

// Re-export types for convenience
export type {
  V2Schema,
  V2Property,
  V2UIField,
  V2Section,
  V2Header,
  V2Condition,
  V2ConditionOperator,
  JSONFormsUISchema,
  JSONFormsRule,
  JSONFormsRuleEffect,
  JSONFormsSchemaBasedCondition
} from '../common/types';
