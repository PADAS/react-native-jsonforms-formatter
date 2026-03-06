// V2 API exports - new JSONForms v2 schema format
export { generateUISchema } from './generateUISchema';

// Condition utilities
export {
  buildConditionSchema,
  buildContainsSchema,
  buildIsContainedBySchema,
  buildIsEmptySchema,
  buildIsExactlySchema,
  buildIsNotContainedBySchema,
  buildSchemaBasedCondition,
  createSectionRule,
  validateConditions,
} from './conditions';

// Schema utilities
export { extractConditionalProperties, extractConditionalRequired } from './utils';

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
