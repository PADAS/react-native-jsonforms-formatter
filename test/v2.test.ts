import { generateUISchema } from '../src/v2/generateUISchema';
import { mockV2Schema } from '../src/v2/mockData';
import { V2Schema } from '../src/common/types';

describe('V2 generateUISchema', () => {
  it('should generate UI schema for basic V2 schema', () => {
    const result = generateUISchema(mockV2Schema);
    
    expect(result.type).toBe('VerticalLayout');
    expect(result.elements).toHaveLength(2);
    expect(result.elements![0]).toMatchObject({
      type: 'VerticalLayout',
      label: 'Patrol Details'
    });
    expect(result.elements![1]).toMatchObject({
      type: 'VerticalLayout',
      label: 'Location & Equipment'
    });
  });

  it('should create controls with proper scopes and labels', () => {
    const result = generateUISchema(mockV2Schema);
    
    const firstSection = result.elements![0];
    const controls = firstSection.elements!;
    
    expect(controls[0]).toMatchObject({
      type: 'Control',
      scope: '#/properties/patrol_leader',
      label: 'Patrol Leader'
    });
    
    expect(controls[1]).toMatchObject({
      type: 'Control',
      scope: '#/properties/patrol_size',
      label: 'Patrol Size'
    });
  });

  it('should handle text field options correctly', () => {
    const result = generateUISchema(mockV2Schema);
    const firstSection = result.elements![0];
    const controls = firstSection.elements!;
    
    // Short text field
    const leaderControl = controls[0];
    expect(leaderControl.options).toMatchObject({
      placeholder: 'Enter patrol leader name',
      description: 'Name of the patrol leader'
    });
    
    // Long text field (multi-line) - now at position 4 due to header at position 3
    const notesControl = controls[4];
    expect(notesControl.options).toMatchObject({
      multi: true,
      placeholder: 'Enter additional notes'
    });
  });

  it('should handle numeric field options correctly', () => {
    const result = generateUISchema(mockV2Schema);
    const firstSection = result.elements![0];
    const sizeControl = firstSection.elements![1];
    
    expect(sizeControl.options).toMatchObject({
      format: 'number',
      placeholder: '5',
      description: 'Number of people in the patrol'
    });
  });

  it('should handle choice list field options correctly', () => {
    const result = generateUISchema(mockV2Schema);
    const firstSection = result.elements![0];
    const activityControl = firstSection.elements![2];
    
    expect(activityControl.options).toMatchObject({
      format: 'dropdown',
      placeholder: 'Select activity type',
      description: 'Type of patrol activity'
    });
  });

  it('should handle date-time field options correctly', () => {
    const result = generateUISchema(mockV2Schema);
    const firstSection = result.elements![0];
    const dateControl = firstSection.elements![5]; // Date field is now at position 5
    
    expect(dateControl.options).toMatchObject({
      format: 'date-time',
      display: 'date-time',
      description: 'Date and time of patrol'
    });
  });

  it('should handle location field options correctly', () => {
    const result = generateUISchema(mockV2Schema);
    const secondSection = result.elements![1];
    const locationControl = secondSection.elements![0];
    
    expect(locationControl.options).toMatchObject({
      format: 'location',
      display: 'map',
      description: 'GPS coordinates of patrol location'
    });
  });

  it('should handle collection field options correctly', () => {
    const result = generateUISchema(mockV2Schema);
    const secondSection = result.elements![1];
    const collectionControl = secondSection.elements![1];
    
    expect(collectionControl.options).toMatchObject({
      format: 'array',
      addButtonText: 'Add Equipment',
      itemIdentifier: 'item_name'
    });
    
    expect(collectionControl.options!.detail).toBeDefined();
    expect(collectionControl.options!.detail).toMatchObject({
      type: 'VerticalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/item_name',
          label: 'Item Name'
        },
        {
          type: 'Control',
          scope: '#/properties/item_condition', 
          label: 'Item Condition'
        }
      ]
    });
  });

  it('should exclude deprecated fields', () => {
    const result = generateUISchema(mockV2Schema);
    const allControls = getAllControls(result);
    
    // Should not include deprecated_field
    const deprecatedControl = allControls.find(control => 
      control.scope === '#/properties/deprecated_field'
    );
    expect(deprecatedControl).toBeUndefined();
  });

  it('should handle inactive sections', () => {
    const schemaWithInactiveSection: V2Schema = {
      ...mockV2Schema,
      ui: {
        ...mockV2Schema.ui,
        sections: {
          ...mockV2Schema.ui.sections,
          'section-details': {
            ...mockV2Schema.ui.sections['section-details'],
            isActive: false
          }
        }
      }
    };
    
    const result = generateUISchema(schemaWithInactiveSection);
    
    // Should only have one section (the active one)
    expect(result.elements).toHaveLength(1);
    expect(result.elements![0]).toMatchObject({
      label: 'Location & Equipment'
    });
  });

  it('should respect section order', () => {
    const result = generateUISchema(mockV2Schema);
    
    expect(result.elements![0]).toMatchObject({
      label: 'Patrol Details'
    });
    expect(result.elements![1]).toMatchObject({
      label: 'Location & Equipment'
    });
  });

  it('should handle collection constraints and column layout', () => {
    const schemaWithConstraints: V2Schema = {
      ...mockV2Schema,
      json: {
        ...mockV2Schema.json,
        properties: {
          ...mockV2Schema.json.properties,
          test_collection: {
            deprecated: false,
            title: 'Test Collection',
            type: 'array',
            maxItems: 5,
            minItems: 1,
            items: {
              additionalProperties: false,
              type: 'object',
              required: ['field1'],
              properties: {
                field1: { type: 'string' },
                field2: { type: 'string' },
                field3: { type: 'number' }
              }
            },
            unevaluatedItems: false
          }
        }
      },
      ui: {
        ...mockV2Schema.ui,
        fields: {
          ...mockV2Schema.ui.fields,
          test_collection: {
            type: 'COLLECTION',
            parent: 'section-details',
            buttonText: 'Add Test Item',
            columns: 2,
            itemIdentifier: 'field1',
            leftColumn: ['field1', 'field2'],
            rightColumn: ['field3']
          }
        },
        sections: {
          ...mockV2Schema.ui.sections,
          'section-details': {
            ...mockV2Schema.ui.sections['section-details'],
            leftColumn: [
              ...mockV2Schema.ui.sections['section-details'].leftColumn,
              {
                name: 'test_collection',
                type: 'field'
              }
            ]
          }
        }
      }
    };

    const result = generateUISchema(schemaWithConstraints);
    const firstSection = result.elements![0];
    // Find the collection control (should be last in the section)
    const collectionControl = firstSection.elements!.find((el: any) => 
      el.scope === '#/properties/test_collection'
    );

    expect(collectionControl).toBeDefined();
    expect(collectionControl.options).toMatchObject({
      format: 'array',
      addButtonText: 'Add Test Item',
      itemIdentifier: 'field1',
      maxItems: 5,
      minItems: 1
    });

    // Check that the detail UI schema respects leftColumn/rightColumn order
    expect(collectionControl.options.detail).toMatchObject({
      type: 'VerticalLayout',
      elements: [
        { type: 'Control', scope: '#/properties/field1', label: 'field1' },
        { type: 'Control', scope: '#/properties/field2', label: 'field2' },
        { type: 'Control', scope: '#/properties/field3', label: 'field3' }
      ]
    });
  });

  it('should handle single column sections correctly', () => {
    const result = generateUISchema(mockV2Schema);
    const firstSection = result.elements![0];
    
    expect(firstSection.type).toBe('VerticalLayout');
    expect(firstSection.elements).toHaveLength(6); // 5 fields + 1 header in left column
  });

  it('should handle two column sections correctly (React Native single-column)', () => {
    const result = generateUISchema(mockV2Schema);
    const secondSection = result.elements![1];
    
    // React Native: Two-column sections are converted to single-column VerticalLayout
    expect(secondSection.type).toBe('VerticalLayout');
    expect(secondSection.label).toBe('Location & Equipment');
    
    // Fields are combined into single column: leftColumn first, then rightColumn
    expect(secondSection.elements).toHaveLength(2); // patrol_location + equipment_used
    
    expect(secondSection.elements![0]).toMatchObject({
      type: 'Control',
      scope: '#/properties/patrol_location',
      label: 'Patrol Location'
    });
    
    expect(secondSection.elements![1]).toMatchObject({
      type: 'Control', 
      scope: '#/properties/equipment_used',
      label: 'Equipment Used'
    });
  });
});


// Helper function to extract all controls from nested structure
function getAllControls(uiSchema: any): any[] {
  const controls: any[] = [];
  
  function traverse(element: any) {
    if (element.type === 'Control') {
      controls.push(element);
    } else if (element.elements) {
      element.elements.forEach(traverse);
    }
  }
  
  if (uiSchema.elements) {
    uiSchema.elements.forEach(traverse);
  }
  
  return controls;
}
