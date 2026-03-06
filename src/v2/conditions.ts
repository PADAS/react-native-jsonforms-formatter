import {
  V2Condition,
  V2ConditionOperator,
  JSONFormsRule,
  JSONFormsSchemaBasedCondition,
} from '../common/types';

/**
 * Builds a JSON Schema for the CONTAINS operator.
 * Handles array, object, and string field types via anyOf.
 * When value is an array, all values must be contained; the string branch
 * becomes unsatisfiable (const: null) since a string can't contain multiple
 * independent required values simultaneously.
 */
export const buildContainsSchema = (value: string | string[]): Record<string, unknown> => {
  const values = Array.isArray(value) ? value : [value];

  if (values.length === 1) {
    const v = values[0];
    return {
      anyOf: [
        {
          allOf: [{ contains: { const: v } }],
          type: 'array',
        },
        {
          required: [v],
          type: 'object',
        },
        {
          pattern: v,
          type: 'string',
        },
      ],
    };
  }

  return {
    anyOf: [
      {
        allOf: values.map((v) => ({ contains: { const: v } })),
        type: 'array',
      },
      {
        required: values,
        type: 'object',
      },
      {
        // Impossible branch: a string cannot satisfy multiple simultaneous contains requirements
        const: null,
        type: 'string',
      },
    ],
  };
};

/**
 * Builds a JSON Schema for the IS_EMPTY operator.
 * Returns a root-level schema (not field-scoped) because it must check for
 * field absence using `not: { required: [fieldName] }`.
 */
export const buildIsEmptySchema = (fieldName: string): Record<string, unknown> => {
  return {
    anyOf: [
      { not: { required: [fieldName] } },
      {
        properties: { [fieldName]: { maxItems: 0, type: 'array' } },
        required: [fieldName],
      },
      {
        properties: { [fieldName]: { type: 'null' } },
        required: [fieldName],
      },
      {
        properties: { [fieldName]: { maxProperties: 0, type: 'object' } },
        required: [fieldName],
      },
      {
        properties: { [fieldName]: { maxLength: 0, type: 'string' } },
        required: [fieldName],
      },
    ],
  };
};

/**
 * Builds a JSON Schema for the IS_NOT_EMPTY / HAS_INPUT operator.
 * Matches when the field is present and has a meaningful (non-null, non-empty) value.
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
 * Builds a JSON Schema for the DOES_NOT_HAVE_INPUT operator (legacy).
 */
export const buildDoesNotHaveInputSchema = (): Record<string, unknown> => {
  return {
    not: buildHasInputSchema(),
  };
};

/**
 * Builds a JSON Schema for the IS_EXACTLY operator.
 * Handles array, boolean, number, object, and string field types via anyOf.
 * When value is an array, non-array/object branches become unsatisfiable (const: null).
 * When value is a single string parseable as boolean/number, those branches use the parsed value.
 */
export const buildIsExactlySchema = (value: string | string[]): Record<string, unknown> => {
  const values = Array.isArray(value) ? value : [value];
  const isSingle = values.length === 1;

  const arrayBranch: Record<string, unknown> = {
    allOf: values.map((v) => ({ contains: { const: v } })),
    maxItems: values.length,
    type: 'array',
  };

  // Boolean branch — meaningful only for single value parseable as boolean
  let booleanConst: boolean | null = null;
  if (isSingle) {
    const lower = values[0].toLowerCase();
    if (lower === 'true') booleanConst = true;
    else if (lower === 'false') booleanConst = false;
  }
  const booleanBranch =
    booleanConst !== null
      ? { const: booleanConst, type: 'boolean' }
      : { const: null, type: 'boolean' };

  // Number branch — meaningful only for single value parseable as number
  let numberConst: number | null = null;
  if (isSingle) {
    const parsed = Number(values[0]);
    if (!isNaN(parsed) && values[0] !== '') numberConst = parsed;
  }
  const numberBranch =
    numberConst !== null
      ? { const: numberConst, type: 'number' }
      : { const: null, type: 'number' };

  // Object branch — all values become required property keys
  const objectProperties: Record<string, Record<string, never>> = {};
  values.forEach((v) => {
    objectProperties[v] = {};
  });
  const objectBranch: Record<string, unknown> = {
    properties: objectProperties,
    required: values,
    type: 'object',
    unevaluatedProperties: false,
  };

  // String branch — meaningful only for single value
  const stringBranch = isSingle
    ? { const: values[0], type: 'string' }
    : { const: null, type: 'string' };

  return {
    anyOf: [arrayBranch, booleanBranch, numberBranch, objectBranch, stringBranch],
  };
};

/**
 * Builds a JSON Schema for the INPUT_IS_EXACTLY operator (legacy).
 * Matches when the field value equals the specified value exactly.
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
    return { enum: [value, String(value)] };
  }
  const numValue = Number(value);
  if (!isNaN(numValue) && value !== '') {
    return { enum: [numValue, value] };
  }
  return { const: value };
};

/**
 * Builds a JSON Schema for the IS_CONTAINED_BY operator.
 * The condition is fulfilled when all elements of the field are included
 * within the specified set of values.
 */
export const buildIsContainedBySchema = (value: string | string[]): Record<string, unknown> => {
  const values = Array.isArray(value) ? value : [value];
  return {
    anyOf: [
      { items: { enum: values }, minItems: 1, type: 'array' },
      { minProperties: 1, propertyNames: { enum: values }, type: 'object' },
      { enum: values, type: 'string' },
    ],
  };
};

/**
 * Builds a JSON Schema for the IS_NOT_CONTAINED_BY operator.
 * The condition is fulfilled when at least one element of the field is not
 * included within the specified set of values.
 */
export const buildIsNotContainedBySchema = (
  value: string | string[],
): Record<string, unknown> => {
  const values = Array.isArray(value) ? value : [value];
  return {
    anyOf: [
      {
        allOf: [
          { minItems: 1, type: 'array' },
          { not: { items: { enum: values }, type: 'array' } },
        ],
      },
      {
        allOf: [
          { minProperties: 1, type: 'object' },
          { not: { propertyNames: { enum: values }, type: 'object' } },
        ],
      },
      { not: { enum: values }, type: 'string' },
    ],
  };
};

const VALID_OPERATORS: V2ConditionOperator[] = [
  'CONTAINS',
  'DOES_NOT_HAVE_INPUT',
  'HAS_INPUT',
  'INPUT_IS_EXACTLY',
  'IS_CONTAINED_BY',
  'IS_EMPTY',
  'IS_EXACTLY',
  'IS_NOT_CONTAINED_BY',
  'IS_NOT_EMPTY',
];

/**
 * Gets the operator schema for a condition.
 * Note: IS_EMPTY is root-scoped; callers that need field-scoped wrapping
 * should use buildConditionSchema instead.
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
      return buildContainsSchema(condition.value as string | string[]);

    case 'DOES_NOT_HAVE_INPUT':
      return buildDoesNotHaveInputSchema();

    case 'HAS_INPUT':
    case 'IS_NOT_EMPTY':
      return buildHasInputSchema();

    case 'IS_EMPTY':
      return buildIsEmptySchema(condition.field);

    case 'INPUT_IS_EXACTLY':
      if (condition.value === undefined) {
        throw new Error(
          `INPUT_IS_EXACTLY operator requires a value for condition '${condition.id}'`,
        );
      }
      return buildInputIsExactlySchema(condition.value as string | number | boolean | null);

    case 'IS_EXACTLY':
      if (condition.value === undefined || condition.value === null) {
        throw new Error(
          `IS_EXACTLY operator requires a value for condition '${condition.id}'`,
        );
      }
      return buildIsExactlySchema(condition.value as string | string[]);

    case 'IS_CONTAINED_BY':
      if (condition.value === undefined || condition.value === null) {
        throw new Error(
          `IS_CONTAINED_BY operator requires a value for condition '${condition.id}'`,
        );
      }
      return buildIsContainedBySchema(condition.value as string | string[]);

    case 'IS_NOT_CONTAINED_BY':
      if (condition.value === undefined || condition.value === null) {
        throw new Error(
          `IS_NOT_CONTAINED_BY operator requires a value for condition '${condition.id}'`,
        );
      }
      return buildIsNotContainedBySchema(condition.value as string | string[]);

    default:
      throw new Error(
        `Unknown operator '${condition.operator}' in condition '${condition.id}'`,
      );
  }
};

/**
 * Builds a root-scoped JSON Schema for a single condition.
 * IS_EMPTY contributes its root-level anyOf directly; all other operators
 * are wrapped in a properties/required structure.
 */
export const buildConditionSchema = (
  condition: V2Condition,
): Record<string, unknown> => {
  if (condition.operator === 'IS_EMPTY') {
    return buildIsEmptySchema(condition.field);
  }

  const operatorSchema = getOperatorSchema(condition);
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
 * Single condition:
 *   - IS_EMPTY → root scope "#" (must check for field absence at object level)
 *   - All others → field scope "#/properties/fieldName"
 *
 * Multiple conditions: root scope "#" with allOf combining all condition schemas.
 */
export const buildSchemaBasedCondition = (
  conditions: V2Condition[],
): JSONFormsSchemaBasedCondition => {
  if (conditions.length === 0) {
    throw new Error('At least one condition is required');
  }

  if (conditions.length === 1) {
    const condition = conditions[0];

    if (condition.operator === 'IS_EMPTY') {
      return {
        scope: '#',
        schema: buildIsEmptySchema(condition.field),
      };
    }

    return {
      scope: `#/properties/${condition.field}`,
      schema: getOperatorSchema(condition),
    };
  }

  // Multiple conditions: combine with allOf at root scope
  const allOfSchemas = conditions.map((condition) => buildConditionSchema(condition));

  return {
    scope: '#',
    schema: {
      allOf: allOfSchemas,
    },
  };
};

/**
 * Creates a complete JSONForms rule for a section with the given conditions.
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
  const requiresValue: V2ConditionOperator[] = [
    'CONTAINS',
    'IS_EXACTLY',
    'IS_CONTAINED_BY',
    'IS_NOT_CONTAINED_BY',
  ];

  for (const condition of conditions) {
    if (!VALID_OPERATORS.includes(condition.operator)) {
      throw new Error(`Invalid operator '${condition.operator}'`);
    }

    if (!fieldNames.includes(condition.field)) {
      throw new Error(`Unknown field '${condition.field}'`);
    }

    if (
      requiresValue.includes(condition.operator) &&
      (condition.value === undefined || condition.value === null)
    ) {
      throw new Error(`${condition.operator} operator requires a value`);
    }

    if (
      condition.operator === 'INPUT_IS_EXACTLY' &&
      condition.value === undefined
    ) {
      throw new Error(`INPUT_IS_EXACTLY operator requires a value`);
    }
  }
};
