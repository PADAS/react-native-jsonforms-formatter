import { 
  V2Schema, 
  JSONFormsUISchema, 
  JSONFormsLayout
} from '../common/types';

import {
  createControl,
  createSectionLayout,
  getVisibleFields,
  groupFieldsBySection
} from './utils';

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
 */
export const generateUISchema = (schema: V2Schema): JSONFormsUISchema => {
  // Get all visible (non-deprecated) fields
  const visibleFields = getVisibleFields(schema);
  
  // Group fields by their parent sections
  const fieldsBySection = groupFieldsBySection(visibleFields, schema.ui.sections);

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
        createControl(name, property, uiField)
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

