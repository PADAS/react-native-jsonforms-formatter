import { detectSchemaVersion } from '../src/common/schemaUtils';

describe('Schema Version Detection', () => {
  it('should detect v1 schema format', () => {
    const v1Schema = JSON.stringify({
      schema: {
        "$schema": "http://json-schema.org/draft-04/schema#",
        title: "Test Schema",
        type: "object",
        properties: {}
      },
      definition: []
    });

    const result = detectSchemaVersion(v1Schema);
    expect(result.version).toBe('v1');
    expect(result.data.schema).toBeDefined();
    expect(result.data.definition).toBeDefined();
  });

  it('should detect v1 schema format with data wrapper', () => {
    const wrappedV1Schema = JSON.stringify({
      data: {
        schema: {
          "$schema": "http://json-schema.org/draft-04/schema#",
          title: "Test Schema",
          type: "object",
          properties: {}
        },
        definition: []
      },
      status: { code: 200, message: "OK" }
    });

    const result = detectSchemaVersion(wrappedV1Schema);
    expect(result.version).toBe('v1');
    expect(result.data.schema).toBeDefined();
    expect(result.data.definition).toBeDefined();
  });

  it('should detect v2 schema format', () => {
    const v2Schema = JSON.stringify({
      json: {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        type: "object",
        properties: {}
      },
      ui: {
        fields: {},
        sections: {},
        order: []
      }
    });

    const result = detectSchemaVersion(v2Schema);
    expect(result.version).toBe('v2');
    expect(result.data.json).toBeDefined();
    expect(result.data.ui).toBeDefined();
  });

  it('should detect v2 schema format with data wrapper', () => {
    const wrappedV2Schema = JSON.stringify({
      data: {
        json: {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          type: "object",
          properties: {}
        },
        ui: {
          fields: {},
          sections: {},
          order: []
        }
      },
      status: { code: 200, message: "OK" }
    });

    const result = detectSchemaVersion(wrappedV2Schema);
    expect(result.version).toBe('v2');
    expect(result.data.json).toBeDefined();
    expect(result.data.ui).toBeDefined();
  });

  it('should default to v1 for ambiguous schemas', () => {
    const ambiguousSchema = JSON.stringify({
      someProperty: "value"
    });

    const result = detectSchemaVersion(ambiguousSchema);
    expect(result.version).toBe('v1');
  });

  it('should throw error for invalid JSON', () => {
    const invalidJson = "{ invalid json }";

    expect(() => {
      detectSchemaVersion(invalidJson);
    }).toThrow('Invalid JSON schema');
  });
});