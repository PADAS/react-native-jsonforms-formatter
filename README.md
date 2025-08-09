# React Native JSONForms Formatter

![Build Status][ci-url]

[ci-url]: https://github.com/PADAS/react-native-jsonforms-formatter/actions/workflows/npm-build.yml/badge.svg

A Node.js library for validating JSONSchema and generating UISchema for a custom ReactNative JSONForms element. Supports both v1 (legacy) and v2 (modern) schema formats with full backward compatibility.

## Features

- ✅ **JSON Schema Validation**: Validates and sanitizes JSON schema strings
- 🎨 **UI Schema Generation**: Creates UI schemas compatible with JSONForms
- 📱 **React Native Ready**: Optimized for React Native applications
- 🔄 **Dual Version Support**: V1 (legacy) and V2 (modern) schema formats

## Architecture

For detailed component information, see [component-diagram.md](./component-diagram.md).

## Installation

You can install the library using npm or yarn:

#### Using `yarn`

```
yarn add react-native-jsonforms-formatter
```

#### Using `npm`

```
npm install --save react-native-jsonforms-formatter
```

## Usage

The library supports two schema formats: **V1 (legacy)** and **V2 (modern)**. Choose the appropriate version based on your schema format.

### Version Support

- **V1 (Default/Legacy)**: Traditional JSONSchema format with `schema` and `definition` properties
- **V2 (Modern)**: New format with `json` and `ui` properties, following JSON Schema Draft 2020-12

### Client Integration

#### Default Import (V1 - Backward Compatible)

```typescript
import { validateJSONSchema, generateUISchema } from "react-native-jsonforms-formatter";
// Uses V1 implementation by default
```

#### Explicit Version Imports

```typescript
// V1 specific imports
import { v1 } from "react-native-jsonforms-formatter";
const { validateJSONSchema, generateUISchema } = v1;

// V2 specific imports  
import { v2 } from "react-native-jsonforms-formatter";
const { generateUISchema } = v2;

// Or direct imports
import { v1, v2 } from "react-native-jsonforms-formatter";
```

## V1 Schema Format (Legacy)

### Validating V1 JSONSchema

```typescript
import { validateJSONSchema } from "react-native-jsonforms-formatter";

const stringSchema = `
{
  "schema": {
    "type": "object",
    "properties": {
      "name": {
        "type": "string",
        "title": "Name"
      },
      "age": {
        "type": "integer", 
        "title": "Age"
      }
    }
  },
  "definition": {
    "name": {
      "inputType": "text",
      "placeholder": "Enter your name"
    },
    "age": {
      "inputType": "number",
      "placeholder": "Enter your age"
    }
  }
}
`;

const jsonSchema = validateJSONSchema(stringSchema);
```

**Returns**: A validated V1 schema object with normalized decimal separators and cleaned properties.

### Generating V1 UI Schema

```typescript
import { generateUISchema } from "react-native-jsonforms-formatter";

const uiSchema = generateUISchema(jsonSchema);
```

**Returns**: JSONForms-compatible UI schema optimized for React Native:

```typescript
{
  type: "VerticalLayout",
  elements: [
    {
      type: "Control",
      scope: "#/properties/name",
      label: "Name",
      options: {
        placeholder: "Enter your name"
      }
    },
    {
      type: "Control", 
      scope: "#/properties/age",
      label: "Age",
      options: {
        format: "number",
        placeholder: "Enter your age"
      }
    }
  ]
}
```

## V2 Schema Format

V2 schemas use a new format with `json` and `ui` properties, following JSON Schema Draft 2020-12.

### Generating V2 UI Schema

```typescript
import { v2 } from "react-native-jsonforms-formatter";

const v2Schema = {
  "json": {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "additionalProperties": false,
    "properties": {
      "patrol_leader": {
        "deprecated": false,
        "description": "Name of the patrol leader",
        "title": "Patrol Leader",
        "type": "string"
      },
      "patrol_size": {
        "deprecated": false,
        "description": "Number of people in the patrol", 
        "title": "Patrol Size",
        "type": "number",
        "minimum": 1,
        "maximum": 20
      },
      "patrol_location": {
        "deprecated": false,
        "description": "GPS coordinates of patrol location",
        "title": "Patrol Location",
        "type": "object",
        "properties": {
          "latitude": { "type": "number", "minimum": -90, "maximum": 90 },
          "longitude": { "type": "number", "minimum": -180, "maximum": 180 }
        }
      }
    },
    "required": ["patrol_leader", "patrol_size"],
    "type": "object"
  },
  "ui": {
    "fields": {
      "patrol_leader": {
        "inputType": "SHORT_TEXT",
        "parent": "section-details",
        "placeholder": "Enter patrol leader name",
        "type": "TEXT"
      },
      "patrol_size": {
        "parent": "section-details",
        "placeholder": "5",
        "type": "NUMERIC"
      },
      "patrol_location": {
        "parent": "section-location",
        "type": "LOCATION"
      }
    },
    "order": ["section-details", "section-location"],
    "sections": {
      "section-details": {
        "columns": 1,
        "isActive": true,
        "label": "Patrol Details",
        "leftColumn": [
          { "name": "patrol_leader", "type": "field" },
          { "name": "patrol_size", "type": "field" }
        ],
        "rightColumn": []
      },
      "section-location": {
        "columns": 1,
        "isActive": true,
        "label": "Location",
        "leftColumn": [
          { "name": "patrol_location", "type": "field" }
        ],
        "rightColumn": []
      }
    }
  }
};

const uiSchema = v2.generateUISchema(v2Schema);
```

**Returns**: JSONForms-compatible UI schema with advanced field types and section management:

```typescript
{
  type: "VerticalLayout",
  elements: [
    {
      type: "VerticalLayout",
      label: "Patrol Details",
      elements: [
        {
          type: "Control",
          scope: "#/properties/patrol_leader",
          label: "Patrol Leader",
          options: {
            placeholder: "Enter patrol leader name",
            description: "Name of the patrol leader"
          }
        },
        {
          type: "Control",
          scope: "#/properties/patrol_size", 
          label: "Patrol Size",
          options: {
            format: "number",
            placeholder: "5",
            description: "Number of people in the patrol"
          }
        }
      ]
    },
    {
      type: "VerticalLayout",
      label: "Location",
      elements: [
        {
          type: "Control",
          scope: "#/properties/patrol_location",
          label: "Patrol Location",
          options: {
            format: "location",
            display: "map",
            description: "GPS coordinates of patrol location"
          }
        }
      ]
    }
  ]
}
```

### V2 Field Types

V2 supports advanced field types:

- **TEXT**: `SHORT_TEXT`, `LONG_TEXT` (multi-line)
- **NUMERIC**: Number fields with validation
- **CHOICE_LIST**: Dropdowns and list selections
- **DATE_TIME**: Date and time pickers
- **LOCATION**: GPS coordinate fields with map display
- **COLLECTION**: Arrays with nested field structures
- **ATTACHMENT**: File upload fields

## Complete React Native Examples

### V1 Schema Example

```typescript
import { JsonForms } from "@jsonforms/react-native";
import { RNCells, RNRenderers } from "@jsonforms/react-native-renderers";
import React from "react";
import {
  generateUISchema,
  validateJSONSchema,
} from "react-native-jsonforms-formatter";

const v1StringSchema = `
{
  "schema": {
    "type": "object",
    "properties": {
      "name": {
        "type": "string",
        "title": "Name"
      },
      "age": {
        "type": "integer",
        "title": "Age"
      }
    }
  },
  "definition": {
    "name": {
      "inputType": "text",
      "placeholder": "Enter your name"
    },
    "age": {
      "inputType": "number",
      "placeholder": "Enter your age"
    }
  }
}
`;

const V1App = () => {
  const [data, setData] = React.useState({ name: "John Doe", age: 30 });
  
  // Validate and generate UI schema
  const jsonSchema = validateJSONSchema(v1StringSchema);
  const uiSchema = generateUISchema(jsonSchema);

  return (
    <JsonForms
      schema={jsonSchema.schema}
      uischema={uiSchema}
      data={data}
      renderers={RNRenderers}
      cells={RNCells}
      onChange={(event) => setData(event.data)}
    />
  );
};
```

### V2 Schema Example

```typescript
import { JsonForms } from "@jsonforms/react-native";
import { RNCells, RNRenderers } from "@jsonforms/react-native-renderers";
import React from "react";
import { v2 } from "react-native-jsonforms-formatter";

const v2Schema = {
  "json": {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "additionalProperties": false,
    "properties": {
      "patrol_leader": {
        "deprecated": false,
        "description": "Name of the patrol leader",
        "title": "Patrol Leader",
        "type": "string"
      },
      "patrol_size": {
        "deprecated": false,
        "description": "Number of people in the patrol",
        "title": "Patrol Size", 
        "type": "number",
        "minimum": 1,
        "maximum": 20
      }
    },
    "required": ["patrol_leader", "patrol_size"],
    "type": "object"
  },
  "ui": {
    "fields": {
      "patrol_leader": {
        "inputType": "SHORT_TEXT",
        "parent": "section-details",
        "placeholder": "Enter patrol leader name",
        "type": "TEXT"
      },
      "patrol_size": {
        "parent": "section-details",
        "placeholder": "5",
        "type": "NUMERIC"
      }
    },
    "order": ["section-details"],
    "sections": {
      "section-details": {
        "columns": 1,
        "isActive": true,
        "label": "Patrol Details",
        "leftColumn": [
          { "name": "patrol_leader", "type": "field" },
          { "name": "patrol_size", "type": "field" }
        ],
        "rightColumn": []
      }
    }
  }
};

const V2App = () => {
  const [data, setData] = React.useState({ 
    patrol_leader: "John Smith", 
    patrol_size: 5 
  });
  
  // Generate UI schema using V2
  const uiSchema = v2.generateUISchema(v2Schema);

  return (
    <JsonForms
      schema={v2Schema.json}
      uischema={uiSchema}
      data={data}
      renderers={RNRenderers}
      cells={RNCells}
      onChange={(event) => setData(event.data)}
    />
  );
};
```

## Contributors
<a href="https://github.com/PADAS/react-native-jsonforms-formatter/graphs/contributors">
  <img src="https://contributors-img.web.app/image?repo=PADAS/react-native-jsonforms-formatter" />
</a>

## Licensing

A copy of the license is available in the repository's [LICENSE](LICENSE) file.

