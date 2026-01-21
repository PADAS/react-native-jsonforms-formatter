import {
  V2Schema,
  V2UIField,
  V2Property,
  V2BaseProperty,
  V2Header,
  JSONFormsControl,
  JSONFormsLayout,
  JSONFormsLabel,
  JSONFormsUIElement,
  JSONFormsUISchema,
} from "../common/types";

import { createSectionRule } from "./conditions";

/**
 * Determines if a field should be rendered based on deprecation status
 */
export const isFieldVisible = (property: V2Property): boolean => {
  return !property.deprecated;
};

/**
 * Creates a JSONForms control element for a field
 */
export const createControl = (
  fieldName: string,
  property: V2Property,
  uiField: V2UIField,
  schema?: V2Schema,
): JSONFormsControl => {
  const control: JSONFormsControl = {
    type: "Control",
    scope: `#/properties/${fieldName}`,
    label: property.title,
    options: {},
  };

  // Add format based on field type
  switch (uiField.type) {
    case "TEXT":
      if (uiField.inputType === "LONG_TEXT") {
        control.options!.multi = true;
      }
      if (uiField.placeholder) {
        control.options!.placeholder = uiField.placeholder;
      }
      break;

    case "NUMERIC":
      control.options!.format = "number";
      if (uiField.placeholder) {
        control.options!.placeholder = uiField.placeholder;
      }
      break;

    case "DATE_TIME":
      // Always set format and display for DATE_TIME fields
      control.options!.format = property.format || "date-time";
      control.options!.display = property.format || "date-time";
      break;

    case "CHOICE_LIST":
      // Handle multiple choice (array type) first
      if (property.type === "array") {
        control.options!.multi = true;
        // For arrays, use appropriate multi-select format
        if (uiField.inputType === "DROPDOWN") {
          control.options!.format = "dropdown";
        } else if (uiField.inputType === "LIST") {
          control.options!.format = "checkbox";
        }
      } else {
        // Single select
        if (uiField.inputType === "DROPDOWN") {
          control.options!.format = "dropdown";
        } else if (uiField.inputType === "LIST") {
          control.options!.format = "radio";
        }
      }

      if (uiField.placeholder) {
        control.options!.placeholder = uiField.placeholder;
      }
      break;

    case "LOCATION":
      control.options!.format = "location";
      control.options!.display = "map";
      break;

    case "COLLECTION":
      control.options!.format = "array";
      control.options!.addButtonText = uiField.buttonText || "Add Item";
      if (uiField.itemIdentifier) {
        control.options!.itemIdentifier = uiField.itemIdentifier;
      }

      // Add collection constraints
      if (property.maxItems !== undefined) {
        control.options!.maxItems = property.maxItems;
      }
      if (property.minItems !== undefined) {
        control.options!.minItems = property.minItems;
      }

      if (property.type === "array" && property.items?.properties && schema) {
        control.options!.detail = generateCollectionUISchemaInternal(
          property,
          uiField,
          schema,
        );
      }
      break;

    case "ATTACHMENT":
      control.options!.format = "file";
      if (uiField.allowableFileTypes) {
        control.options!.accept = uiField.allowableFileTypes.join(",");
      }
      break;
  }

  // Add description if available
  if (property.description) {
    control.options!.description = property.description;
  }

  return control;
};

/**
 * Creates a JSONForms label element for a header
 */
export const createHeaderLabel = (
  headerId: string,
  header: V2Header,
): JSONFormsLabel => {
  return {
    type: "Label",
    text: header.label,
    options: {
      size: header.size,
    },
  };
};

/**
 * Creates a single-column vertical layout for a section
 */
export const createSectionLayout = (
  sectionId: string,
  section: V2Schema["ui"]["sections"][string],
  fieldControls: JSONFormsControl[],
  headers: Record<string, V2Header>,
): JSONFormsLayout => {
  const layout: JSONFormsLayout = {
    type: "VerticalLayout", // Always vertical for React Native
    label: section.label,
    elements: [],
  };

  // Order: leftColumn items first, then rightColumn items
  const orderedElements: JSONFormsUIElement[] = [];

  // Add left column elements first
  section.leftColumn.forEach((item) => {
    if (item.type === "field") {
      const element = fieldControls.find(
        (el) => el.scope === `#/properties/${item.name}`,
      );
      if (element) {
        orderedElements.push(element);
      }
    } else if (item.type === "header") {
      const header = headers[item.name];
      if (header) {
        const headerLabel = createHeaderLabel(item.name, header);
        orderedElements.push(headerLabel);
      }
    }
  });

  // Add right column elements after left column
  section.rightColumn.forEach((item) => {
    if (item.type === "field") {
      const element = fieldControls.find(
        (el) => el.scope === `#/properties/${item.name}`,
      );
      if (element) {
        orderedElements.push(element);
      }
    } else if (item.type === "header") {
      const header = headers[item.name];
      if (header) {
        const headerLabel = createHeaderLabel(item.name, header);
        orderedElements.push(headerLabel);
      }
    }
  });

  layout.elements = orderedElements;

  // Add rule if section has conditions
  if (section.conditions && section.conditions.length > 0) {
    layout.rule = createSectionRule(section.conditions);
  }

  return layout;
};

/**
 * Extracts properties defined in allOf/if/then conditional structures.
 * These are fields that are conditionally added to the schema based on other field values.
 */
export const extractConditionalProperties = (
  schema: V2Schema,
): Record<string, V2Property> => {
  const conditionalProperties: Record<string, V2Property> = {};

  // Check if schema has allOf with if/then structures
  const allOf = (schema.json as any).allOf;
  if (!Array.isArray(allOf)) {
    return conditionalProperties;
  }

  allOf.forEach((item: any) => {
    // Look for if/then structures
    if (item.then?.properties) {
      Object.entries(item.then.properties).forEach(
        ([fieldName, property]: [string, any]) => {
          // Only add if not already in top-level properties
          if (!schema.json.properties[fieldName]) {
            conditionalProperties[fieldName] = property as V2Property;
          }
        },
      );
    }
  });

  return conditionalProperties;
};

/**
 * Gets all fields that should be rendered (non-deprecated, visible)
 */
export const getVisibleFields = (
  schema: V2Schema,
): Array<{ name: string; property: V2Property; uiField: V2UIField }> => {
  const visibleFields: Array<{
    name: string;
    property: V2Property;
    uiField: V2UIField;
  }> = [];

  Object.entries(schema.json.properties).forEach(([fieldName, property]) => {
    const uiField = schema.ui.fields[fieldName];

    if (isFieldVisible(property) && uiField) {
      visibleFields.push({ name: fieldName, property, uiField });
    }
  });

  // Get conditional properties from allOf/if/then structures
  const conditionalProperties = extractConditionalProperties(schema);
  Object.entries(conditionalProperties).forEach(([fieldName, property]) => {
    const uiField = schema.ui.fields[fieldName];

    if (isFieldVisible(property) && uiField) {
      visibleFields.push({ name: fieldName, property, uiField });
    }
  });

  return visibleFields;
};

/**
 * Groups fields by their parent section
 */
export const groupFieldsBySection = (
  fields: Array<{ name: string; property: V2Property; uiField: V2UIField }>,
  sections: V2Schema["ui"]["sections"],
): Record<
  string,
  Array<{ name: string; property: V2Property; uiField: V2UIField }>
> => {
  const grouped: Record<
    string,
    Array<{ name: string; property: V2Property; uiField: V2UIField }>
  > = {};

  fields.forEach((field) => {
    const sectionId = field.uiField.parent;

    // Only include fields that belong to sections (not collections)
    if (sections[sectionId]) {
      if (!grouped[sectionId]) {
        grouped[sectionId] = [];
      }
      grouped[sectionId].push(field);
    }
  });

  return grouped;
};

/**
 * Generate UI schema for collection items
 */
const generateCollectionUISchemaInternal = (
  collectionProperty: V2Property,
  uiField: V2UIField,
  schema: V2Schema,
): JSONFormsUISchema => {
  if (
    collectionProperty.type !== "array" ||
    !collectionProperty.items?.properties
  ) {
    throw new Error(
      "Collection property must be an array with item properties",
    );
  }

  const itemProperties = collectionProperty.items.properties;
  const itemControls: JSONFormsControl[] = [];

  // Helper function to create control for a collection item field
  const createItemControl = (
    fieldName: string,
    property: V2BaseProperty,
  ): JSONFormsControl => {
    const itemUiField = schema.ui.fields[fieldName];

    if (itemUiField) {
      return createControl(
        fieldName,
        property as V2Property,
        itemUiField,
        schema,
      );
    }

    const control: JSONFormsControl = {
      type: "Control",
      scope: `#/properties/${fieldName}`,
      label: (property as any).title || fieldName,
      options: {},
    };

    // Set basic options based on property type
    switch (property.type) {
      case "string":
        if (property.format === "uri") {
          control.options!.format = "file";
          control.options!.accept = "image/*";
        }
        break;
      case "number":
        control.options!.format = "number";
        break;
    }

    if (property.description) {
      control.options!.description = property.description;
    }

    return control;
  };

  // If leftColumn/rightColumn are specified, use that order
  if (uiField && (uiField.leftColumn || uiField.rightColumn)) {
    // Add left column fields first
    if (uiField.leftColumn) {
      uiField.leftColumn.forEach((fieldName) => {
        if (itemProperties[fieldName]) {
          itemControls.push(
            createItemControl(fieldName, itemProperties[fieldName]),
          );
        }
      });
    }

    // Add right column fields after (React Native single-column)
    if (uiField.rightColumn) {
      uiField.rightColumn.forEach((fieldName) => {
        if (itemProperties[fieldName]) {
          itemControls.push(
            createItemControl(fieldName, itemProperties[fieldName]),
          );
        }
      });
    }
  } else {
    Object.entries(itemProperties).forEach(([fieldName, property]) => {
      itemControls.push(createItemControl(fieldName, property));
    });
  }

  const uiSchema: JSONFormsUISchema = {
    type: "VerticalLayout",
    elements: itemControls,
  };

  return uiSchema;
};
