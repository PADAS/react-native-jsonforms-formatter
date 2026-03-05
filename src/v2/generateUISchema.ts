import {
  V2Schema,
  JSONFormsUISchema,
  JSONFormsLayout
} from '../common/types';

import {
  createControl,
  createSectionLayout,
  extractConditionalProperties,
  extractConditionalRequired,
  getVisibleFields,
  groupFieldsBySection
} from './utils';

import { validateConditions } from './conditions';

/**
 * Validates V2 schema structure for known issues
 */
const validateV2Schema = (schema: V2Schema): void => {
  const invalidFields: string[] = [];
  const supportedFieldTypes = ['TEXT', 'NUMERIC', 'DATE_TIME', 'CHOICE_LIST', 'LOCATION', 'COLLECTION', 'ATTACHMENT'];

  // Check each field for validity
  Object.entries(schema.json.properties).forEach(([fieldName, property]) => {
    const uiField = schema.ui.fields[fieldName];
    
    // Skip deprecated fields without UI definitions (they won't be rendered anyway)
    if (!uiField && property.deprecated) {
      return;
    }
    
    if (!uiField) {
      invalidFields.push(`${fieldName}: missing UI field definition`);
      return;
    }

    // Check for unsupported field types
    if (!supportedFieldTypes.includes(uiField.type)) {
      invalidFields.push(`${fieldName}: unsupported field type '${uiField.type}'`);
      return;
    }

    // Check CHOICE_LIST fields for valid structure (not content)
    if (uiField.type === 'CHOICE_LIST') {
      let hasValidStructure = false;
      
      if (property.type === 'array' && property.items?.anyOf) {
        // Check for oneOf arrays in anyOf items for array types (no $ref support)
        hasValidStructure = property.items.anyOf.some((anyOfItem: any) => 
          anyOfItem.oneOf && Array.isArray(anyOfItem.oneOf) // Empty arrays are valid
        );
      } else if (property.anyOf) {
        // Check direct anyOf structure for string types (no $ref support)
        hasValidStructure = property.anyOf.some((anyOfItem: any) => 
          anyOfItem.oneOf && Array.isArray(anyOfItem.oneOf) // Empty arrays are valid
        );
      }
      
      if (!hasValidStructure) {
        invalidFields.push(`${fieldName}: CHOICE_LIST field requires embedded oneOf arrays - $ref not supported`);
      }
    }
  });

  // Validate section conditions
  const conditionalProperties = extractConditionalProperties(schema);
  const fieldNames = [
    ...Object.keys(schema.json.properties),
    ...Object.keys(conditionalProperties),
  ];

  Object.entries(schema.ui.sections).forEach(([sectionId, section]) => {
    if (section.conditions && section.conditions.length > 0) {
      try {
        validateConditions(section.conditions, fieldNames);
      } catch (error) {
        invalidFields.push(`Section '${sectionId}': ${(error as Error).message}`);
      }
    }
  });

  if (invalidFields.length > 0) {
    throw new Error(`Invalid V2 schema structure: ${invalidFields.join(', ')}`);
  }
};

/**
 * Generates a JSONForms-compatible UI schema from a EarthRanger V2 schema format
 * 
 * React Native Optimization:
 * - All layouts are converted to single-column VerticalLayout
 * - Multi-column sections are flattened: leftColumn fields first, then rightColumn fields
 * - Optimized for mobile form rendering
 * 
 * @param schema - EarthRanger V2 schema with json and ui properties
 * @returns JSONForms UI schema with single-column VerticalLayout for React Native
 * @throws Error if schema has invalid structure or unsupported field configurations
 */
export const generateUISchema = (schema: V2Schema): JSONFormsUISchema => {
  // Validate schema structure first
  validateV2Schema(schema);

  // Get all visible (non-deprecated) fields
  const visibleFields = getVisibleFields(schema);

  // Group fields by their parent sections
  const fieldsBySection = groupFieldsBySection(visibleFields, schema.ui.sections);

  // Get conditionally required fields
  const conditionallyRequiredFields = extractConditionalRequired(schema);

  // Create section layouts in the specified order
  const sectionLayouts: JSONFormsLayout[] = [];

  schema.ui.order.forEach(sectionId => {
    const section = schema.ui.sections[sectionId];
    const sectionFields = fieldsBySection[sectionId] || [];

    // Check if section has any content (fields or headers)
    const hasFields = sectionFields.length > 0;
    const hasHeaders = [...section.leftColumn, ...section.rightColumn]
      .some(item => item.type === 'header' && schema.ui.headers[item.name]);

    // Only create layout if section is active and has content
    if (section?.isActive && (hasFields || hasHeaders)) {
      const sectionControls = sectionFields.map(({ name, property, uiField }) =>
        createControl(name, property, uiField, schema, conditionallyRequiredFields.has(name))
      );

      const sectionLayout = createSectionLayout(sectionId, section, sectionControls, schema.ui.headers);
      sectionLayouts.push(sectionLayout);
    }
  });

  const uiSchema: JSONFormsUISchema = {
    type: 'VerticalLayout',
    elements: sectionLayouts
  };

  return uiSchema;
};

