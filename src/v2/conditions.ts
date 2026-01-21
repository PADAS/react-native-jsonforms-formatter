import {
  V2Condition,
  V2ConditionOperator,
  JSONFormsRule,
  JSONFormsSchemaBasedCondition,
} from '../common/types';

/**
 * Builds a JSON Schema for the CONTAINS operator.
 * Matches strings that contain the specified value as a substring.
 */
export const buildContainsSchema = (value: string): Record<string, unknown> => {
  return {
    pattern: value,
    type: 'string',
  };
};

/**
 * Builds a JSON Schema for the DOES_NOT_HAVE_INPUT operator.
 * Matches when the field has no meaningful input (null, undefined, empty string, empty array, empty object).
 */
export const buildDoesNotHaveInputSchema = (): Record<string, unknown> => {
  return {
    anyOf: [
      { not: {} }, // undefined/not required
      { type: 'array', maxItems: 0 }, // empty array
      { type: 'object', maxProperties: 0 }, // empty object
      { type: 'string', maxLength: 0 }, // empty string
      { type: 'null' }, // null value
    ],
  };
};

/**
 * Builds a JSON Schema for the HAS_INPUT operator.
 * Matches when the field has meaningful input (non-null, non-empty).
 */
export const buildHasInputSchema = (): Record<string, unknown> => {
  return {
    allOf: [
      { not: { type: 'null' } },
      {
        anyOf: [
          { type: 'array', minItems: 1 },
          { type: 'boolean' },
          { type: 'number' },
          { type: 'object', minProperties: 1 },
          { type: 'string', minLength: 1 },
        ],
      },
    ],
  };
};

/**
 * Builds a JSON Schema for the INPUT_IS_EXACTLY operator.
 * Matches when the field value equals the specified value exactly.
 * Uses `enum` for simple matching without type constraints.
 */
export const buildInputIsExactlySchema = (
  value: string | number | boolean | null,
): Record<string, unknown> => {
  if (value === null) {
    return { type: 'null' };
  }
  if (typeof value === 'boolean') {
    return { const: value };
  }
  if (typeof value === 'number') {
    // Allow both number and string representation
    return { enum: [value, String(value)] };
  }
  // String value - also allow numeric match if the string is a valid number
  const numValue = Number(value);
  if (!isNaN(numValue) && value !== '') {
    return { enum: [numValue, value] };
  }
  return { const: value };
};

const VALID_OPERATORS: V2ConditionOperator[] = [
  'CONTAINS',
  'DOES_NOT_HAVE_INPUT',
  'HAS_INPUT',
  'INPUT_IS_EXACTLY',
];

/**
 * Gets the operator schema for a condition (without field wrapper).
 * Used internally by buildConditionSchema and buildSchemaBasedCondition.
 */
export const getOperatorSchema = (
  condition: V2Condition,
): Record<string, unknown> => {
  switch (condition.operator) {
    case 'CONTAINS':
      if (condition.value === undefined || condition.value === null) {
        throw new Error(
          `CONTAINS operator requires a value for condition '${condition.id}'`,
        );
      }
      return buildContainsSchema(String(condition.value));

    case 'DOES_NOT_HAVE_INPUT':
      return buildDoesNotHaveInputSchema();

    case 'HAS_INPUT':
      return buildHasInputSchema();

    case 'INPUT_IS_EXACTLY':
      if (condition.value === undefined) {
        throw new Error(
          `INPUT_IS_EXACTLY operator requires a value for condition '${condition.id}'`,
        );
      }
      return buildInputIsExactlySchema(condition.value);

    default:
      throw new Error(
        `Unknown operator '${condition.operator}' in condition '${condition.id}'`,
      );
  }
};

/**
 * Builds a JSON Schema for a single condition based on its operator.
 * Wraps the operator schema in a properties structure for root scope validation.
 */
export const buildConditionSchema = (
  condition: V2Condition,
): Record<string, unknown> => {
  const operatorSchema = getOperatorSchema(condition);

  // Wrap in properties structure for the field (used with scope: "#")
  return {
    properties: {
      [condition.field]: operatorSchema,
    },
    required: [condition.field],
  };
};

/**
 * Builds a JSONForms schema-based condition from one or more V2 conditions.
 *
 * For single conditions: Uses field-specific scope (e.g., "#/properties/fieldName")
 * which is the standard JSONForms pattern and most reliable across implementations.
 *
 * For multiple conditions: Uses root scope "#" with allOf combining property schemas.
 */
export const buildSchemaBasedCondition = (
  conditions: V2Condition[],
): JSONFormsSchemaBasedCondition => {
  if (conditions.length === 0) {
    throw new Error('At least one condition is required');
  }

  if (conditions.length === 1) {
    // Single condition: use field-specific scope for better compatibility
    const condition = conditions[0];
    return {
      scope: `#/properties/${condition.field}`,
      schema: getOperatorSchema(condition),
    };
  }

  // Multiple conditions: use root scope with allOf
  const allOfSchemas = conditions.map((condition) =>
    buildConditionSchema(condition),
  );

  return {
    scope: '#',
    schema: {
      allOf: allOfSchemas,
    },
  };
};

/**
 * Creates a complete JSONForms rule for a section with the given conditions.
 * Uses SHOW effect by default.
 */
export const createSectionRule = (conditions: V2Condition[]): JSONFormsRule => {
  return {
    effect: 'SHOW',
    condition: buildSchemaBasedCondition(conditions),
  };
};

/**
 * Validates conditions for a section.
 * Throws an error if any condition is invalid.
 */
export const validateConditions = (
  conditions: V2Condition[],
  fieldNames: string[],
): void => {
  for (const condition of conditions) {
    // Validate operator
    if (!VALID_OPERATORS.includes(condition.operator)) {
      throw new Error(`Invalid operator '${condition.operator}'`);
    }

    // Validate field exists
    if (!fieldNames.includes(condition.field)) {
      throw new Error(`Unknown field '${condition.field}'`);
    }

    // Validate required values
    if (
      condition.operator === 'CONTAINS' &&
      (condition.value === undefined || condition.value === null)
    ) {
      throw new Error(`CONTAINS operator requires a value`);
    }

    if (
      condition.operator === 'INPUT_IS_EXACTLY' &&
      condition.value === undefined
    ) {
      throw new Error(`INPUT_IS_EXACTLY operator requires a value`);
    }
  }
};
