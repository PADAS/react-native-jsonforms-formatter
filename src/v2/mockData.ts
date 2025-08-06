// Mock data for V2 testing

import { V2Schema } from '../common/types';

export const mockV2Schema = {
  "json": {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "additionalProperties": false,
    "properties": {
      "patrol_leader": {
        "deprecated": false,
        "description": "Name of the patrol leader",
        "title": "Patrol Leader",
        "type": "string",
        "default": ""
      },
      "patrol_size": {
        "deprecated": false,
        "description": "Number of people in the patrol",
        "title": "Patrol Size",
        "type": "number",
        "minimum": 1,
        "maximum": 20
      },
      "patrol_activity": {
        "deprecated": false,
        "description": "Type of patrol activity",
        "title": "Patrol Activity",
        "type": "string",
        "anyOf": [
          {
            "oneOf": [
              { "const": "routine", "title": "Routine Patrol" },
              { "const": "emergency", "title": "Emergency Response" },
              { "const": "investigation", "title": "Investigation" }
            ]
          }
        ]
      },
      "patrol_notes": {
        "deprecated": false,
        "description": "Additional notes about the patrol",
        "title": "Patrol Notes",
        "type": "string",
        "default": ""
      },
      "patrol_date": {
        "deprecated": false,
        "description": "Date and time of patrol",
        "title": "Patrol Date",
        "type": "string",
        "format": "date-time"
      },
      "patrol_location": {
        "deprecated": false,
        "description": "GPS coordinates of patrol location",
        "title": "Patrol Location",
        "type": "object",
        "properties": {
          "latitude": {
            "maximum": 90,
            "minimum": -90,
            "type": "number"
          },
          "longitude": {
            "maximum": 180,
            "minimum": -180,
            "type": "number"
          }
        }
      },
      "equipment_used": {
        "deprecated": false,
        "title": "Equipment Used",
        "type": "array",
        "items": {
          "additionalProperties": false,
          "properties": {
            "item_name": {
              "deprecated": false,
              "title": "Item Name",
              "type": "string",
              "default": ""
            },
            "item_condition": {
              "deprecated": false,
              "title": "Item Condition",
              "type": "string",
              "anyOf": [
                {
                  "oneOf": [
                    { "const": "excellent", "title": "Excellent" },
                    { "const": "good", "title": "Good" },
                    { "const": "fair", "title": "Fair" },
                    { "const": "poor", "title": "Poor" }
                  ]
                }
              ]
            }
          },
          "required": ["item_name"],
          "type": "object"
        },
        "unevaluatedItems": false
      },
      "deprecated_field": {
        "deprecated": true,
        "title": "Deprecated Field",
        "type": "string"
      }
    },
    "required": ["patrol_leader", "patrol_size", "patrol_date"],
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
      "patrol_activity": {
        "choices": {
          "eventTypeCategories": [],
          "existingChoiceList": ["patrol_activity"],
          "featureCategories": [],
          "myDataType": "",
          "subjectGroups": [],
          "subjectSubtypes": [],
          "type": "EXISTING_CHOICE_LIST"
        },
        "inputType": "DROPDOWN",
        "parent": "section-details",
        "placeholder": "Select activity type",
        "type": "CHOICE_LIST"
      },
      "patrol_notes": {
        "inputType": "LONG_TEXT",
        "parent": "section-details",
        "placeholder": "Enter additional notes",
        "type": "TEXT"
      },
      "patrol_date": {
        "parent": "section-details",
        "type": "DATE_TIME"
      },
      "patrol_location": {
        "parent": "section-location",
        "type": "LOCATION"
      },
      "equipment_used": {
        "buttonText": "Add Equipment",
        "columns": 1,
        "itemIdentifier": "item_name",
        "itemName": "Equipment Item",
        "leftColumn": ["item_name", "item_condition"],
        "rightColumn": [],
        "parent": "section-location",
        "type": "COLLECTION"
      },
      "item_name": {
        "inputType": "SHORT_TEXT",
        "parent": "equipment_used",
        "placeholder": "Equipment name",
        "type": "TEXT"
      },
      "item_condition": {
        "choices": {
          "eventTypeCategories": [],
          "existingChoiceList": ["item_condition"],
          "featureCategories": [],
          "myDataType": "",
          "subjectGroups": [],
          "subjectSubtypes": [],
          "type": "EXISTING_CHOICE_LIST"
        },
        "inputType": "LIST",
        "parent": "equipment_used",
        "placeholder": "",
        "type": "CHOICE_LIST"
      }
    },
    "headers": {
      "header-info": {
        "label": "Important Information",
        "section": "section-details",
        "size": "MEDIUM"
      }
    },
    "order": ["section-details", "section-location"],
    "sections": {
      "section-details": {
        "columns": 1,
        "isActive": true,
        "label": "Patrol Details",
        "leftColumn": [
          {
            "name": "patrol_leader",
            "type": "field"
          },
          {
            "name": "patrol_size",
            "type": "field"
          },
          {
            "name": "patrol_activity",
            "type": "field"
          },
          {
            "name": "header-info",
            "type": "header"
          },
          {
            "name": "patrol_notes",
            "type": "field"
          },
          {
            "name": "patrol_date",
            "type": "field"
          }
        ],
        "rightColumn": []
      },
      "section-location": {
        "columns": 2,
        "isActive": true,
        "label": "Location & Equipment",
        "leftColumn": [
          {
            "name": "patrol_location",
            "type": "field"
          }
        ],
        "rightColumn": [
          {
            "name": "equipment_used",
            "type": "field"
          }
        ]
      }
    }
  }
} as V2Schema;

export const expectedUISchemaForMockV2: any = {
  "type": "VerticalLayout",
  "elements": [
    {
      "type": "VerticalLayout",
      "label": "Patrol Details",
      "elements": [
        {
          "type": "Control",
          "scope": "#/properties/patrol_leader",
          "label": "Patrol Leader",
          "options": {
            "placeholder": "Enter patrol leader name",
            "description": "Name of the patrol leader"
          }
        },
        {
          "type": "Control",
          "scope": "#/properties/patrol_size",
          "label": "Patrol Size",
          "options": {
            "format": "number",
            "placeholder": "5",
            "description": "Number of people in the patrol"
          }
        },
        {
          "type": "Control",
          "scope": "#/properties/patrol_activity",
          "label": "Patrol Activity",
          "options": {
            "format": "dropdown",
            "placeholder": "Select activity type",
            "description": "Type of patrol activity"
          }
        },
        {
          "type": "Control",
          "scope": "#/properties/patrol_notes",
          "label": "Patrol Notes",
          "options": {
            "multi": true,
            "placeholder": "Enter additional notes",
            "description": "Additional notes about the patrol"
          }
        },
        {
          "type": "Control",
          "scope": "#/properties/patrol_date",
          "label": "Patrol Date",
          "options": {
            "format": "date-time",
            "display": "date-time",
            "description": "Date and time of patrol"
          }
        }
      ]
    },
    {
      "type": "HorizontalLayout",
      "label": "Location & Equipment",
      "elements": [
        {
          "type": "VerticalLayout",
          "elements": [
            {
              "type": "Control",
              "scope": "#/properties/patrol_location",
              "label": "Patrol Location",
              "options": {
                "format": "location",
                "display": "map",
                "description": "GPS coordinates of patrol location"
              }
            }
          ]
        },
        {
          "type": "VerticalLayout",
          "elements": [
            {
              "type": "Control",
              "scope": "#/properties/equipment_used",
              "label": "Equipment Used",
              "options": {
                "format": "array",
                "addButtonText": "Add Equipment",
                "itemIdentifier": "item_name"
              }
            }
          ]
        }
      ]
    }
  ]
};
