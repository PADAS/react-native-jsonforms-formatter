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

  it('should apply UI field properties to collection item fields', () => {
    const result = generateUISchema(mockV2Schema);
    const secondSection = result.elements![1];
    const collectionControl = secondSection.elements![1];

    // Verify the detail schema includes UI field properties
    const detail = collectionControl.options!.detail;
    expect(detail).toBeDefined();
    expect(detail!.elements).toHaveLength(2);

    // item_name should get TEXT field properties
    const itemNameControl = detail!.elements![0];
    expect(itemNameControl).toMatchObject({
      type: 'Control',
      scope: '#/properties/item_name',
      label: 'Item Name',
      options: {
        placeholder: 'Equipment name'
      }
    });

    // item_condition should get CHOICE_LIST field properties (LIST inputType = radio)
    const itemConditionControl = detail!.elements![1];
    expect(itemConditionControl).toMatchObject({
      type: 'Control',
      scope: '#/properties/item_condition',
      label: 'Item Condition'
    });
    // Should have radio format for LIST inputType with single select
    expect(itemConditionControl.options).toMatchObject({
      format: 'radio'
    });
  });

  it('should support nested collections (collection within collection)', () => {
    const nestedSchema: V2Schema = {
      json: {
        properties: {
          tasks: {
            deprecated: false,
            title: "Tasks",
            type: "array",
            items: {
              properties: {
                task_name: {
                  deprecated: false,
                  title: "Task Name",
                  type: "string"
                },
                subtasks: {
                  deprecated: false,
                  title: "Subtasks",
                  type: "array",
                  items: {
                    properties: {
                      subtask_name: {
                        deprecated: false,
                        title: "Subtask Name",
                        type: "string"
                      },
                      priority: {
                        deprecated: false,
                        title: "Priority",
                        type: "number"
                      }
                    },
                    type: "object"
                  }
                }
              },
              type: "object"
            }
          }
        },
        type: "object"
      },
      ui: {
        fields: {
          tasks: {
            buttonText: "Add Task",
            itemIdentifier: "task_name",
            leftColumn: ["task_name", "subtasks"],
            rightColumn: [],
            type: "COLLECTION",
            parent: "section-1"
          },
          task_name: {
            inputType: "SHORT_TEXT",
            placeholder: "Enter task name",
            type: "TEXT",
            parent: "tasks"
          },
          subtasks: {
            buttonText: "Add Subtask",
            itemIdentifier: "subtask_name",
            leftColumn: ["subtask_name", "priority"],
            rightColumn: [],
            type: "COLLECTION",
            parent: "tasks"
          },
          subtask_name: {
            inputType: "SHORT_TEXT",
            placeholder: "Enter subtask",
            type: "TEXT",
            parent: "subtasks"
          },
          priority: {
            placeholder: "1-5",
            type: "NUMERIC",
            parent: "subtasks"
          }
        },
        headers: {},
        order: ["section-1"],
        sections: {
          "section-1": {
            columns: 1,
            isActive: true,
            label: "Task Manager",
            leftColumn: [{ name: "tasks", type: "field" }],
            rightColumn: []
          }
        }
      }
    };

    const result = generateUISchema(nestedSchema);

    // Get the top-level tasks collection
    const tasksControl = result.elements![0].elements![0];
    expect(tasksControl.options).toMatchObject({
      format: 'array',
      addButtonText: 'Add Task',
      itemIdentifier: 'task_name'
    });

    // Verify tasks has detail schema with 2 fields
    const tasksDetail = tasksControl.options!.detail;
    expect(tasksDetail).toBeDefined();
    expect(tasksDetail!.elements).toHaveLength(2);

    // First field should be task_name with TEXT properties
    expect(tasksDetail!.elements![0]).toMatchObject({
      type: 'Control',
      scope: '#/properties/task_name',
      label: 'Task Name',
      options: {
        placeholder: 'Enter task name'
      }
    });

    // Second field should be the nested subtasks collection
    const subtasksControl = tasksDetail!.elements![1];
    expect(subtasksControl).toMatchObject({
      type: 'Control',
      scope: '#/properties/subtasks',
      label: 'Subtasks'
    });
    expect(subtasksControl.options).toMatchObject({
      format: 'array',
      addButtonText: 'Add Subtask',
      itemIdentifier: 'subtask_name'
    });

    // Verify nested collection has its own detail schema
    const subtasksDetail = subtasksControl.options!.detail;
    expect(subtasksDetail).toBeDefined();
    expect(subtasksDetail!.elements).toHaveLength(2);

    // Verify nested collection item fields have proper UI properties
    expect(subtasksDetail!.elements![0]).toMatchObject({
      type: 'Control',
      scope: '#/properties/subtask_name',
      label: 'Subtask Name',
      options: {
        placeholder: 'Enter subtask'
      }
    });

    expect(subtasksDetail!.elements![1]).toMatchObject({
      type: 'Control',
      scope: '#/properties/priority',
      label: 'Priority',
      options: {
        format: 'number',
        placeholder: '1-5'
      }
    });
  });
});


describe('BOOLEAN field type', () => {
  const booleanSchema: V2Schema = {
    json: {
      $schema: 'https://json-schema.org/draft/2020-12/schema',
      additionalProperties: false,
      properties: {
        requires_medicine: {
          deprecated: false,
          title: 'Animal Requires Medicine',
          default: true,
          description: 'Does the veterinarian require medicine for the animal?',
          type: 'boolean',
        },
      },
      required: [],
      type: 'object',
    },
    ui: {
      fields: {
        requires_medicine: {
          conditionalDependents: [],
          parent: 'section-1',
          type: 'BOOLEAN',
        },
      },
      headers: {},
      order: ['section-1'],
      sections: {
        'section-1': {
          columns: 1,
          conditions: [],
          isActive: true,
          label: 'Animal Care',
          leftColumn: [{ name: 'requires_medicine', type: 'field' }],
          rightColumn: [],
        },
      },
    },
  };

  it('generates a Control with boolean format', () => {
    const result = generateUISchema(booleanSchema);
    const control = result.elements![0].elements![0];
    expect(control).toMatchObject({
      type: 'Control',
      scope: '#/properties/requires_medicine',
      label: 'Animal Requires Medicine',
      options: { format: 'boolean' },
    });
  });

  it('includes the description in options', () => {
    const result = generateUISchema(booleanSchema);
    const control = result.elements![0].elements![0];
    expect(control.options!.description).toBe(
      'Does the veterinarian require medicine for the animal?',
    );
  });

  it('deprecated boolean field is not rendered', () => {
    const schema: V2Schema = {
      ...booleanSchema,
      json: {
        ...booleanSchema.json,
        properties: {
          requires_medicine: { ...booleanSchema.json.properties.requires_medicine, deprecated: true },
        },
      },
    };
    const result = generateUISchema(schema);
    expect(result.elements).toHaveLength(0);
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
