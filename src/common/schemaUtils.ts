/**
 * Utility functions for schema version detection and handling
 */

export type SchemaVersion = 'v1' | 'v2';

export interface ParsedSchema {
  version: SchemaVersion;
  data: any;
}

/**
 * Detects whether a schema string contains v1 or v2 format
 * 
 * v1 schema structure: { schema: {...}, definition: [...] } or { data: { schema: {...}, definition: [...] } }
 * v2 schema structure: { json: {...}, ui: {...} } or { data: { json: {...}, ui: {...} } }
 */
export const detectSchemaVersion = (schemaString: string): ParsedSchema => {
  try {
    const parsed = JSON.parse(schemaString);
    
    // Handle wrapped responses (API responses with data wrapper)
    const actualSchema = parsed.data || parsed;
    
    // Check for v2 schema structure
    if (actualSchema.json && actualSchema.ui) {
      return {
        version: 'v2',
        data: actualSchema
      };
    }
    
    // Check for v1 schema structure
    if (actualSchema.schema && actualSchema.definition) {
      return {
        version: 'v1',
        data: actualSchema
      };
    }
    
    // If we have a schema property but no ui property, assume v1
    if (actualSchema.schema && !actualSchema.ui) {
      return {
        version: 'v1',
        data: actualSchema
      };
    }
    
    // Default to v1 for backward compatibility
    return {
      version: 'v1',
      data: actualSchema
    };
    
  } catch (error) {
    throw new Error(`Invalid JSON schema: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Processes a schema string and returns the appropriate data structure for the detected version
 */
export const processSchema = (schemaString: string): { version: SchemaVersion; processedData: string } => {
  const { version, data } = detectSchemaVersion(schemaString);
  
  return {
    version,
    processedData: JSON.stringify(data)
  };
};