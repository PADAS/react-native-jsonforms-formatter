import {
  buildConditionSchema,
  buildContainsSchema,
  buildDoesNotHaveInputSchema,
  buildHasInputSchema,
  buildInputIsExactlySchema,
  buildIsContainedBySchema,
  buildIsEmptySchema,
  buildIsExactlySchema,
  buildIsNotContainedBySchema,
  buildSchemaBasedCondition,
  createSectionRule,
  getOperatorSchema,
  validateConditions,
} from '../src/v2/conditions';
import { V2Condition } from '../src/common/types';

// ---------------------------------------------------------------------------
// buildContainsSchema
// ---------------------------------------------------------------------------

describe('buildContainsSchema', () => {
  describe('single string value', () => {
    const schema = buildContainsSchema('elephant');

    it('returns anyOf with three branches', () => {
      expect((schema as any).anyOf).toHaveLength(3);
    });

    it('array branch uses contains', () => {
      expect((schema as any).anyOf[0]).toMatchObject({
        type: 'array',
        allOf: [{ contains: { const: 'elephant' } }],
      });
    });

    it('object branch uses required', () => {
      expect((schema as any).anyOf[1]).toMatchObject({
        type: 'object',
        required: ['elephant'],
      });
    });

    it('string branch uses pattern', () => {
      expect((schema as any).anyOf[2]).toMatchObject({
        type: 'string',
        pattern: 'elephant',
      });
    });
  });

  describe('array of values', () => {
    const schema = buildContainsSchema(['elephant', 'lion']);

    it('array branch has one contains entry per value', () => {
      const arrayBranch = (schema as any).anyOf[0];
      expect(arrayBranch.type).toBe('array');
      expect(arrayBranch.allOf).toContainEqual({ contains: { const: 'elephant' } });
      expect(arrayBranch.allOf).toContainEqual({ contains: { const: 'lion' } });
    });

    it('object branch requires all values', () => {
      expect((schema as any).anyOf[1]).toMatchObject({
        type: 'object',
        required: ['elephant', 'lion'],
      });
    });

    it('string branch is unsatisfiable (const: null)', () => {
      expect((schema as any).anyOf[2]).toMatchObject({
        type: 'string',
        const: null,
      });
    });
  });

  it('single-element array behaves the same as single string', () => {
    const fromString = buildContainsSchema('elephant');
    const fromArray = buildContainsSchema(['elephant']);
    // Both should produce identical anyOf (single-value path)
    expect((fromString as any).anyOf[0]).toMatchObject((fromArray as any).anyOf[0]);
    expect((fromString as any).anyOf[2]).toMatchObject({ type: 'string', pattern: 'elephant' });
    expect((fromArray as any).anyOf[2]).toMatchObject({ type: 'string', pattern: 'elephant' });
  });
});

// ---------------------------------------------------------------------------
// buildIsEmptySchema
// ---------------------------------------------------------------------------

describe('buildIsEmptySchema', () => {
  const schema = buildIsEmptySchema('injured_animal') as any;

  it('returns an anyOf with 5 branches', () => {
    expect(schema.anyOf).toHaveLength(5);
  });

  it('first branch: field not required (absent)', () => {
    expect(schema.anyOf[0]).toEqual({ not: { required: ['injured_animal'] } });
  });

  it('second branch: empty array', () => {
    expect(schema.anyOf[1]).toMatchObject({
      properties: { injured_animal: { maxItems: 0, type: 'array' } },
      required: ['injured_animal'],
    });
  });

  it('third branch: null value', () => {
    expect(schema.anyOf[2]).toMatchObject({
      properties: { injured_animal: { type: 'null' } },
      required: ['injured_animal'],
    });
  });

  it('fourth branch: empty object', () => {
    expect(schema.anyOf[3]).toMatchObject({
      properties: { injured_animal: { maxProperties: 0, type: 'object' } },
      required: ['injured_animal'],
    });
  });

  it('fifth branch: empty string', () => {
    expect(schema.anyOf[4]).toMatchObject({
      properties: { injured_animal: { maxLength: 0, type: 'string' } },
      required: ['injured_animal'],
    });
  });
});

// ---------------------------------------------------------------------------
// buildHasInputSchema / buildDoesNotHaveInputSchema
// ---------------------------------------------------------------------------

describe('buildHasInputSchema', () => {
  const schema = buildHasInputSchema() as any;

  it('uses allOf with not-null + anyOf of non-empty types', () => {
    expect(schema.allOf).toHaveLength(2);
    expect(schema.allOf[0]).toEqual({ not: { type: 'null' } });
  });

  it('inner anyOf covers array, boolean, number, object, string', () => {
    const inner = schema.allOf[1].anyOf;
    expect(inner).toContainEqual({ type: 'array', minItems: 1 });
    expect(inner).toContainEqual({ type: 'boolean' });
    expect(inner).toContainEqual({ type: 'number' });
    expect(inner).toContainEqual({ type: 'object', minProperties: 1 });
    expect(inner).toContainEqual({ type: 'string', minLength: 1 });
  });
});

describe('buildDoesNotHaveInputSchema', () => {
  it('wraps buildHasInputSchema in a not', () => {
    const schema = buildDoesNotHaveInputSchema() as any;
    expect(schema).toMatchObject({ not: buildHasInputSchema() });
  });
});

// ---------------------------------------------------------------------------
// buildIsExactlySchema
// ---------------------------------------------------------------------------

describe('buildIsExactlySchema', () => {
  describe('single plain string ("elephant")', () => {
    const schema = buildIsExactlySchema('elephant') as any;

    it('array branch: contains + maxItems 1', () => {
      expect(schema.anyOf[0]).toMatchObject({
        type: 'array',
        allOf: [{ contains: { const: 'elephant' } }],
        maxItems: 1,
      });
    });

    it('boolean branch: impossible (const: null)', () => {
      expect(schema.anyOf[1]).toEqual({ const: null, type: 'boolean' });
    });

    it('number branch: impossible (const: null)', () => {
      expect(schema.anyOf[2]).toEqual({ const: null, type: 'number' });
    });

    it('object branch: properties + required + unevaluatedProperties', () => {
      expect(schema.anyOf[3]).toMatchObject({
        type: 'object',
        properties: { elephant: {} },
        required: ['elephant'],
        unevaluatedProperties: false,
      });
    });

    it('string branch: exact const', () => {
      expect(schema.anyOf[4]).toEqual({ const: 'elephant', type: 'string' });
    });
  });

  describe('single boolean-parseable string ("true")', () => {
    const schema = buildIsExactlySchema('true') as any;

    it('boolean branch resolves to true', () => {
      expect(schema.anyOf[1]).toEqual({ const: true, type: 'boolean' });
    });

    it('number branch is still impossible', () => {
      expect(schema.anyOf[2]).toEqual({ const: null, type: 'number' });
    });

    it('string branch: const is "true"', () => {
      expect(schema.anyOf[4]).toEqual({ const: 'true', type: 'string' });
    });
  });

  describe('single boolean-parseable string ("false")', () => {
    it('boolean branch resolves to false', () => {
      const schema = buildIsExactlySchema('false') as any;
      expect(schema.anyOf[1]).toEqual({ const: false, type: 'boolean' });
    });
  });

  describe('single number-parseable string ("42")', () => {
    const schema = buildIsExactlySchema('42') as any;

    it('number branch resolves to 42', () => {
      expect(schema.anyOf[2]).toEqual({ const: 42, type: 'number' });
    });

    it('boolean branch is still impossible', () => {
      expect(schema.anyOf[1]).toEqual({ const: null, type: 'boolean' });
    });
  });

  describe('array of strings', () => {
    const schema = buildIsExactlySchema(['elephant', 'lion']) as any;

    it('array branch: all contains + maxItems equals count', () => {
      expect(schema.anyOf[0]).toMatchObject({
        type: 'array',
        allOf: [{ contains: { const: 'elephant' } }, { contains: { const: 'lion' } }],
        maxItems: 2,
      });
    });

    it('boolean branch: impossible', () => {
      expect(schema.anyOf[1]).toEqual({ const: null, type: 'boolean' });
    });

    it('number branch: impossible', () => {
      expect(schema.anyOf[2]).toEqual({ const: null, type: 'number' });
    });

    it('object branch: all values as properties', () => {
      expect(schema.anyOf[3]).toMatchObject({
        type: 'object',
        properties: { elephant: {}, lion: {} },
        required: ['elephant', 'lion'],
        unevaluatedProperties: false,
      });
    });

    it('string branch: impossible', () => {
      expect(schema.anyOf[4]).toEqual({ const: null, type: 'string' });
    });
  });
});

// ---------------------------------------------------------------------------
// buildInputIsExactlySchema (legacy)
// ---------------------------------------------------------------------------

describe('buildInputIsExactlySchema', () => {
  it('null → type null', () => {
    expect(buildInputIsExactlySchema(null)).toEqual({ type: 'null' });
  });

  it('boolean → const boolean', () => {
    expect(buildInputIsExactlySchema(true)).toEqual({ const: true });
    expect(buildInputIsExactlySchema(false)).toEqual({ const: false });
  });

  it('number → enum with number and string form', () => {
    expect(buildInputIsExactlySchema(3)).toEqual({ enum: [3, '3'] });
  });

  it('numeric string → enum with number and string form', () => {
    expect(buildInputIsExactlySchema('42')).toEqual({ enum: [42, '42'] });
  });

  it('non-numeric string → const string', () => {
    expect(buildInputIsExactlySchema('elephant')).toEqual({ const: 'elephant' });
  });
});

// ---------------------------------------------------------------------------
// buildIsContainedBySchema
// ---------------------------------------------------------------------------

describe('buildIsContainedBySchema', () => {
  describe('with an array of values', () => {
    const schema = buildIsContainedBySchema(['elephant', 'lion', 'giraffe']) as any;

    it('array branch: items enum + minItems 1', () => {
      expect(schema.anyOf[0]).toMatchObject({
        type: 'array',
        items: { enum: ['elephant', 'lion', 'giraffe'] },
        minItems: 1,
      });
    });

    it('object branch: propertyNames enum + minProperties 1', () => {
      expect(schema.anyOf[1]).toMatchObject({
        type: 'object',
        propertyNames: { enum: ['elephant', 'lion', 'giraffe'] },
        minProperties: 1,
      });
    });

    it('string branch: enum', () => {
      expect(schema.anyOf[2]).toMatchObject({
        type: 'string',
        enum: ['elephant', 'lion', 'giraffe'],
      });
    });
  });

  it('single string is normalized to array', () => {
    const schema = buildIsContainedBySchema('elephant') as any;
    expect(schema.anyOf[0]).toMatchObject({ items: { enum: ['elephant'] } });
    expect(schema.anyOf[2]).toMatchObject({ enum: ['elephant'] });
  });
});

// ---------------------------------------------------------------------------
// buildIsNotContainedBySchema
// ---------------------------------------------------------------------------

describe('buildIsNotContainedBySchema', () => {
  const schema = buildIsNotContainedBySchema(['elephant', 'lion', 'giraffe']) as any;

  it('array branch: minItems + not(items enum)', () => {
    const branch = schema.anyOf[0];
    expect(branch.allOf).toContainEqual({ minItems: 1, type: 'array' });
    expect(branch.allOf).toContainEqual({
      not: { items: { enum: ['elephant', 'lion', 'giraffe'] }, type: 'array' },
    });
  });

  it('object branch: minProperties + not(propertyNames enum)', () => {
    const branch = schema.anyOf[1];
    expect(branch.allOf).toContainEqual({ minProperties: 1, type: 'object' });
    expect(branch.allOf).toContainEqual({
      not: { propertyNames: { enum: ['elephant', 'lion', 'giraffe'] }, type: 'object' },
    });
  });

  it('string branch: not enum', () => {
    expect(schema.anyOf[2]).toMatchObject({
      not: { enum: ['elephant', 'lion', 'giraffe'] },
      type: 'string',
    });
  });

  it('single string is normalized to array', () => {
    const single = buildIsNotContainedBySchema('elephant') as any;
    expect(single.anyOf[2]).toMatchObject({ not: { enum: ['elephant'] } });
  });
});

// ---------------------------------------------------------------------------
// getOperatorSchema
// ---------------------------------------------------------------------------

describe('getOperatorSchema', () => {
  const makeCondition = (operator: V2Condition['operator'], value?: V2Condition['value']): V2Condition => ({
    field: 'injured_animal',
    id: 'condition-1',
    operator,
    value,
  });

  it('CONTAINS delegates to buildContainsSchema', () => {
    const schema = getOperatorSchema(makeCondition('CONTAINS', 'elephant')) as any;
    expect(schema.anyOf).toBeDefined();
    expect(schema.anyOf[2]).toMatchObject({ type: 'string', pattern: 'elephant' });
  });

  it('CONTAINS with array value', () => {
    const schema = getOperatorSchema(makeCondition('CONTAINS', ['elephant', 'lion'])) as any;
    expect(schema.anyOf[0].allOf).toHaveLength(2);
  });

  it('CONTAINS throws when value is missing', () => {
    expect(() => getOperatorSchema(makeCondition('CONTAINS'))).toThrow();
  });

  it('HAS_INPUT delegates to buildHasInputSchema', () => {
    const schema = getOperatorSchema(makeCondition('HAS_INPUT')) as any;
    expect(schema.allOf).toBeDefined();
    expect(schema.allOf[0]).toEqual({ not: { type: 'null' } });
  });

  it('IS_NOT_EMPTY produces the same schema as HAS_INPUT', () => {
    const hasInput = getOperatorSchema(makeCondition('HAS_INPUT'));
    const isNotEmpty = getOperatorSchema(makeCondition('IS_NOT_EMPTY'));
    expect(hasInput).toEqual(isNotEmpty);
  });

  it('DOES_NOT_HAVE_INPUT delegates to buildDoesNotHaveInputSchema', () => {
    const schema = getOperatorSchema(makeCondition('DOES_NOT_HAVE_INPUT')) as any;
    expect(schema.not).toBeDefined();
  });

  it('IS_EMPTY returns root-level anyOf with 5 branches', () => {
    const schema = getOperatorSchema(makeCondition('IS_EMPTY')) as any;
    expect(schema.anyOf).toHaveLength(5);
    expect(schema.anyOf[0]).toEqual({ not: { required: ['injured_animal'] } });
  });

  it('INPUT_IS_EXACTLY delegates to buildInputIsExactlySchema', () => {
    const schema = getOperatorSchema(makeCondition('INPUT_IS_EXACTLY', 'elephant'));
    expect(schema).toEqual({ const: 'elephant' });
  });

  it('INPUT_IS_EXACTLY throws when value is undefined', () => {
    expect(() => getOperatorSchema(makeCondition('INPUT_IS_EXACTLY'))).toThrow();
  });

  it('IS_EXACTLY delegates to buildIsExactlySchema', () => {
    const schema = getOperatorSchema(makeCondition('IS_EXACTLY', 'elephant')) as any;
    expect(schema.anyOf).toHaveLength(5);
    expect(schema.anyOf[4]).toEqual({ const: 'elephant', type: 'string' });
  });

  it('IS_EXACTLY throws when value is missing', () => {
    expect(() => getOperatorSchema(makeCondition('IS_EXACTLY'))).toThrow();
  });

  it('IS_CONTAINED_BY delegates to buildIsContainedBySchema', () => {
    const schema = getOperatorSchema(makeCondition('IS_CONTAINED_BY', ['elephant', 'lion'])) as any;
    expect(schema.anyOf[0]).toMatchObject({ type: 'array', items: { enum: ['elephant', 'lion'] } });
  });

  it('IS_CONTAINED_BY throws when value is missing', () => {
    expect(() => getOperatorSchema(makeCondition('IS_CONTAINED_BY'))).toThrow();
  });

  it('IS_NOT_CONTAINED_BY delegates to buildIsNotContainedBySchema', () => {
    const schema = getOperatorSchema(makeCondition('IS_NOT_CONTAINED_BY', ['elephant'])) as any;
    expect(schema.anyOf[2]).toMatchObject({ not: { enum: ['elephant'] } });
  });

  it('IS_NOT_CONTAINED_BY throws when value is missing', () => {
    expect(() => getOperatorSchema(makeCondition('IS_NOT_CONTAINED_BY'))).toThrow();
  });
});

// ---------------------------------------------------------------------------
// buildConditionSchema
// ---------------------------------------------------------------------------

describe('buildConditionSchema', () => {
  const makeCondition = (operator: V2Condition['operator'], value?: V2Condition['value']): V2Condition => ({
    field: 'injured_animal',
    id: 'condition-1',
    operator,
    value,
  });

  it('IS_EMPTY returns root-level anyOf directly (no properties wrapper)', () => {
    const schema = buildConditionSchema(makeCondition('IS_EMPTY')) as any;
    expect(schema.anyOf).toBeDefined();
    expect(schema.properties).toBeUndefined();
  });

  it('non-IS_EMPTY operators are wrapped in properties/required', () => {
    const schema = buildConditionSchema(makeCondition('CONTAINS', 'elephant')) as any;
    expect(schema.properties).toBeDefined();
    expect(schema.properties.injured_animal).toBeDefined();
    expect(schema.required).toContain('injured_animal');
  });

  it('IS_NOT_EMPTY is wrapped in properties/required', () => {
    const schema = buildConditionSchema(makeCondition('IS_NOT_EMPTY')) as any;
    expect(schema.properties.injured_animal.allOf).toBeDefined();
  });

  it('IS_EXACTLY is wrapped in properties/required', () => {
    const schema = buildConditionSchema(makeCondition('IS_EXACTLY', 'elephant')) as any;
    expect(schema.properties.injured_animal.anyOf).toHaveLength(5);
    expect(schema.required).toContain('injured_animal');
  });
});

// ---------------------------------------------------------------------------
// buildSchemaBasedCondition
// ---------------------------------------------------------------------------

describe('buildSchemaBasedCondition', () => {
  const makeCondition = (
    field: string,
    operator: V2Condition['operator'],
    value?: V2Condition['value'],
  ): V2Condition => ({ field, id: `condition-${field}`, operator, value });

  it('throws when conditions array is empty', () => {
    expect(() => buildSchemaBasedCondition([])).toThrow();
  });

  describe('single condition (non-IS_EMPTY)', () => {
    it('uses field scope', () => {
      const result = buildSchemaBasedCondition([makeCondition('injured_animal', 'CONTAINS', 'elephant')]);
      expect(result.scope).toBe('#/properties/injured_animal');
    });

    it('schema is the operator schema (not wrapped)', () => {
      const result = buildSchemaBasedCondition([makeCondition('injured_animal', 'IS_NOT_EMPTY')]) as any;
      expect(result.schema.allOf).toBeDefined(); // buildHasInputSchema output
    });

    it('IS_EXACTLY single field scope', () => {
      const result = buildSchemaBasedCondition([makeCondition('status', 'IS_EXACTLY', 'active')]);
      expect(result.scope).toBe('#/properties/status');
      expect((result.schema as any).anyOf).toHaveLength(5);
    });
  });

  describe('single IS_EMPTY condition', () => {
    it('uses root scope', () => {
      const result = buildSchemaBasedCondition([makeCondition('injured_animal', 'IS_EMPTY')]);
      expect(result.scope).toBe('#');
    });

    it('schema is the IS_EMPTY anyOf', () => {
      const result = buildSchemaBasedCondition([makeCondition('injured_animal', 'IS_EMPTY')]) as any;
      expect(result.schema.anyOf).toHaveLength(5);
      expect(result.schema.anyOf[0]).toEqual({ not: { required: ['injured_animal'] } });
    });
  });

  describe('multiple conditions', () => {
    it('uses root scope with allOf', () => {
      const result = buildSchemaBasedCondition([
        makeCondition('injured_animal', 'CONTAINS', 'elephant'),
        makeCondition('requires_attention', 'IS_NOT_EMPTY'),
      ]);
      expect(result.scope).toBe('#');
      expect((result.schema as any).allOf).toHaveLength(2);
    });

    it('each non-IS_EMPTY condition is wrapped in properties/required', () => {
      const result = buildSchemaBasedCondition([
        makeCondition('injured_animal', 'CONTAINS', 'elephant'),
        makeCondition('requires_attention', 'IS_NOT_EMPTY'),
      ]) as any;
      expect(result.schema.allOf[0].properties.injured_animal).toBeDefined();
      expect(result.schema.allOf[0].required).toContain('injured_animal');
    });

    it('IS_EMPTY in multi-condition contributes root-level anyOf directly', () => {
      const result = buildSchemaBasedCondition([
        makeCondition('injured_animal', 'IS_EMPTY'),
        makeCondition('requires_attention', 'IS_NOT_EMPTY'),
      ]) as any;
      // First entry is the IS_EMPTY root schema
      expect(result.schema.allOf[0].anyOf).toBeDefined();
      expect(result.schema.allOf[0].anyOf[0]).toEqual({ not: { required: ['injured_animal'] } });
      // Second entry is field-wrapped IS_NOT_EMPTY
      expect(result.schema.allOf[1].properties.requires_attention).toBeDefined();
    });

    it('IS_CONTAINED_BY multi-value condition', () => {
      const result = buildSchemaBasedCondition([
        makeCondition('animal_type', 'IS_CONTAINED_BY', ['elephant', 'lion']),
        makeCondition('status', 'IS_EXACTLY', 'active'),
      ]) as any;
      expect(result.schema.allOf).toHaveLength(2);
      expect(result.schema.allOf[0].properties.animal_type.anyOf[0]).toMatchObject({
        type: 'array',
        items: { enum: ['elephant', 'lion'] },
      });
    });
  });
});

// ---------------------------------------------------------------------------
// createSectionRule
// ---------------------------------------------------------------------------

describe('createSectionRule', () => {
  it('creates a SHOW rule', () => {
    const rule = createSectionRule([
      { field: 'injured_animal', id: 'c1', operator: 'IS_NOT_EMPTY' },
    ]);
    expect(rule.effect).toBe('SHOW');
  });

  it('condition scope matches field for single non-IS_EMPTY', () => {
    const rule = createSectionRule([
      { field: 'injured_animal', id: 'c1', operator: 'IS_NOT_EMPTY' },
    ]);
    expect(rule.condition.scope).toBe('#/properties/injured_animal');
  });

  it('condition scope is root for IS_EMPTY', () => {
    const rule = createSectionRule([
      { field: 'injured_animal', id: 'c1', operator: 'IS_EMPTY' },
    ]);
    expect(rule.condition.scope).toBe('#');
  });
});

// ---------------------------------------------------------------------------
// validateConditions
// ---------------------------------------------------------------------------

describe('validateConditions', () => {
  const fields = ['injured_animal', 'requires_attention', 'status'];

  it('passes with valid CONTAINS condition', () => {
    expect(() =>
      validateConditions(
        [{ field: 'injured_animal', id: 'c1', operator: 'CONTAINS', value: 'elephant' }],
        fields,
      ),
    ).not.toThrow();
  });

  it('passes with IS_EMPTY (no value required)', () => {
    expect(() =>
      validateConditions(
        [{ field: 'injured_animal', id: 'c1', operator: 'IS_EMPTY', value: null }],
        fields,
      ),
    ).not.toThrow();
  });

  it('passes with IS_NOT_EMPTY', () => {
    expect(() =>
      validateConditions(
        [{ field: 'injured_animal', id: 'c1', operator: 'IS_NOT_EMPTY' }],
        fields,
      ),
    ).not.toThrow();
  });

  it('throws for unknown operator', () => {
    expect(() =>
      validateConditions(
        [{ field: 'injured_animal', id: 'c1', operator: 'FAKE_OP' as any }],
        fields,
      ),
    ).toThrow(/Invalid operator/);
  });

  it('throws for unknown field', () => {
    expect(() =>
      validateConditions(
        [{ field: 'nonexistent_field', id: 'c1', operator: 'IS_NOT_EMPTY' }],
        fields,
      ),
    ).toThrow(/Unknown field/);
  });

  it('throws when CONTAINS value is missing', () => {
    expect(() =>
      validateConditions(
        [{ field: 'injured_animal', id: 'c1', operator: 'CONTAINS' }],
        fields,
      ),
    ).toThrow(/CONTAINS.*requires a value/);
  });

  it('throws when CONTAINS value is null', () => {
    expect(() =>
      validateConditions(
        [{ field: 'injured_animal', id: 'c1', operator: 'CONTAINS', value: null }],
        fields,
      ),
    ).toThrow(/CONTAINS.*requires a value/);
  });

  it('throws when IS_EXACTLY value is missing', () => {
    expect(() =>
      validateConditions(
        [{ field: 'injured_animal', id: 'c1', operator: 'IS_EXACTLY' }],
        fields,
      ),
    ).toThrow(/IS_EXACTLY.*requires a value/);
  });

  it('throws when IS_CONTAINED_BY value is missing', () => {
    expect(() =>
      validateConditions(
        [{ field: 'injured_animal', id: 'c1', operator: 'IS_CONTAINED_BY' }],
        fields,
      ),
    ).toThrow(/IS_CONTAINED_BY.*requires a value/);
  });

  it('throws when IS_NOT_CONTAINED_BY value is missing', () => {
    expect(() =>
      validateConditions(
        [{ field: 'injured_animal', id: 'c1', operator: 'IS_NOT_CONTAINED_BY' }],
        fields,
      ),
    ).toThrow(/IS_NOT_CONTAINED_BY.*requires a value/);
  });

  it('throws when INPUT_IS_EXACTLY value is undefined', () => {
    expect(() =>
      validateConditions(
        [{ field: 'injured_animal', id: 'c1', operator: 'INPUT_IS_EXACTLY' }],
        fields,
      ),
    ).toThrow(/INPUT_IS_EXACTLY.*requires a value/);
  });

  it('INPUT_IS_EXACTLY allows null value', () => {
    expect(() =>
      validateConditions(
        [{ field: 'injured_animal', id: 'c1', operator: 'INPUT_IS_EXACTLY', value: null }],
        fields,
      ),
    ).not.toThrow();
  });

  it('validates multiple conditions together', () => {
    expect(() =>
      validateConditions(
        [
          { field: 'injured_animal', id: 'c1', operator: 'CONTAINS', value: 'elephant' },
          { field: 'requires_attention', id: 'c2', operator: 'IS_NOT_EMPTY' },
          { field: 'status', id: 'c3', operator: 'IS_CONTAINED_BY', value: ['open', 'active'] },
        ],
        fields,
      ),
    ).not.toThrow();
  });

  it('reports the first invalid condition in a list', () => {
    expect(() =>
      validateConditions(
        [
          { field: 'injured_animal', id: 'c1', operator: 'IS_NOT_EMPTY' },
          { field: 'injured_animal', id: 'c2', operator: 'CONTAINS' }, // missing value
        ],
        fields,
      ),
    ).toThrow(/CONTAINS.*requires a value/);
  });
});
