import { ElementDisplay } from "../../utils/utils";

export const JSON_SCHEMA_SPECIAL_CHARS_FAKE_DATA = '{\n' +
    ' "definition": [\n' +
    '  "text_input"\n' +
    ' ],\n' +
    ' "schema": {\n' +
    '  "properties": {\n' +
    '   "text_input": {\n' +
    '    "title": "Text input field",\n' +
    '    "type": "string"\n' +
    '   }\n' +
    '  }\n' +
    ' }\n' +
    '}'

export const JSON_SCHEMA_INVALID_DOUBLE_QUOTES_FAKE_DATA = '{\n' +
    ' “definition”: [\n' +
    '  “text_input”\n' +
    ' ],\n' +
    ' “schema”: {\n' +
    '  “properties”: {\n' +
    '   “text_input”: {\n' +
    '    “title”: “Text input field”,\n' +
    '    “type”: “string”\n' +
    '   }\n' +
    '  }\n' +
    ' }\n' +
    '}'

export const JSON_SCHEMA_EMPTY_CHOICES_FAKE_DATA = '{\n' +
    ' "definition": [\n' +
    '  "single_select",\n' +
    '  {\n' +
    '   "htmlClass": "json-schema-checkbox-wrapper",\n' +
    '   "key": "checkbox_query",\n' +
    '   "titleMap": [],\n' +
    '   "type": "checkboxes"\n' +
    '  }\n' +
    ' ],\n' +
    ' "schema": {\n' +
    '  "properties": {\n' +
    '   "checkbox_query": {\n' +
    '    "title": "I\'m a checkbox with query",\n' +
    '    "type": "checkboxes"\n' +
    '   },\n' +
    '   "single_select": {\n' +
    '    "enum": [],\n' +
    '    "enumNames": {},\n' +
    '    "title": "I\'m a single select query",\n' +
    '    "type": "string"\n' +
    '   },\n' +
    '   "single_select_choices": {\n' +
    '    "enum": [],\n' +
    '    "title": "I\'m a single select choices",\n' +
    '    "type": "string"\n' +
    '   }\n' +
    '  }\n' +
    ' }\n' +
    '}'

export const JSON_SCHEMA_ID_$SCHEMA_FAKE_DATA = '{\n' +
    ' "definition": [\n' +
    '  "text_input"\n' +
    ' ],\n' +
    ' "schema": {\n' +
    '  $schema": "http://json-schema.org/draft-04/schema#,' +
    '  "id": "https://develop.pamdas.org/api/v1.0/activity/events/schema/eventtype/all_types_required_point",' +
    '  "properties": {\n' +
    '   "text_input": {\n' +
    '    "title": "Text input field",\n' +
    '    "type": "string"\n' +
    '   }\n' +
    '  }\n' +
    ' }\n' +
    '}'

export const JSON_SCHEMA_INACTIVE_CHOICES_FAKE_DATA = '{\n' +
    ' "definition": [\n' +
    '  "invasivespecies_urgency"\n' +
    ' ],\n' +
    ' "schema": {\n' +
    '  "properties": {\n' +
    '   "invasivespecies_urgency": {\n' +
    '    "enum": [\n' +
    '     "<",\n' +
    '     ">",\n' +
    '     "=",\n' +
    '     "unknown",\n' +
    '     "other",\n' +
    '     "test"\n' +
    '    ],\n' +
    '    "enumNames": {\n' +
    '     "<": "<",\n' +
    '     "=": "=",\n' +
    '     ">": ">",\n' +
    '     "other": "Other",\n' +
    '     "test": "test",\n' +
    '     "unknown": "Unknown"\n' +
    '    },\n' +
    '    "inactive_enum": [\n' +
    '     "test"\n' +
    '    ],\n' +
    '    "title": "Urgency",\n' +
    '    "type": "string"\n' +
    '   }\n' +
    '  }\n' +
    ' }\n' +
    '}'

export const JSON_SCHEMA_INVALID_DEFINITION_LOCATION_FAKE_DATA = '{\n' +
    ' "schema": {\n' +
    '  "definition": [\n' +
    '   "text_input"\n' +
    '  ],\n' +
    '  "properties": {\n' +
    '   "text_input": {\n' +
    '    "title": "Text input field",\n' +
    '    "type": "string"\n' +
    '   }\n' +
    '  }\n' +
    ' }\n' +
    '}'

export const JSON_SCHEMA_FIELD_SETS_FAKE_DATA = '{\n' +
    ' "definition": [\n' +
    '  {\n' +
    '   "htmlClass": "col-lg-12",\n' +
    '   "items": [],\n' +
    '   "title": "Fieldset title",\n' +
    '   "type": "fieldset"\n' +
    '  },\n' +
    '  {\n' +
    '   "htmlClass": "col-lg-12",\n' +
    '   "items": [\n' +
    '    "text_input"\n' +
    '   ],\n' +
    '   "type": "fieldset"\n' +
    '  },\n' +
    '  {\n' +
    '   "htmlClass": "col-lg-12",\n' +
    '   "items": [\n' +
    '    "text_input_number"\n' +
    '   ],\n' +
    '   "title": "Fieldset number title",\n' +
    '   "type": "fieldset"\n' +
    '  }\n' +
    ' ],\n' +
    ' "schema": {\n' +
    '  "properties": {\n' +
    '   "text_input": {\n' +
    '    "title": "Text input field",\n' +
    '    "type": "string"\n' +
    '   },\n' +
    '   "text_input_number": {\n' +
    '    "title": "Text input field",\n' +
    '    "type": "string"\n' +
    '   }\n' +
    '  }\n' +
    ' }\n' +
    '}'

export const FIELD_SET_HEADER_FAKE_DATA = {
    fieldset_title_fieldset_title: {
        type: 'string',
        readOnly: true,
        isHidden: false,
        display: ElementDisplay.Header,
        title: 'Fieldset title',
    },
    fieldset_title_fieldset_number_title: {
        type: 'string',
        readOnly: true,
        isHidden: false,
        display: ElementDisplay.Header,
        title: 'Fieldset number title',
    }
};

export const JSON_SCHEMA_COLLECTION_FIELD_FAKE_DATA = '{\n' +
    ' "definition": [\n' +
    '  {\n' +
    '   "helpvalue": "<h2>Exhibits Recovered</h2>",\n' +
    '   "type": "help"\n' +
    '  },\n' +
    '  {\n' +
    '   "add": "New",\n' +
    '   "key": "SkinsRecovered",\n' +
    '   "style": {\n' +
    '    "add": "btn-success"\n' +
    '   }\n' +
    '  }\n' +
    ' ],\n' +
    ' "schema": {\n' +
    '  "properties": {\n' +
    '   "SkinsRecovered": {\n' +
    '    "isHidden": false,\n' +
    '    "items": {\n' +
    '     "properties": {\n' +
    '      "AnimalSkinType": {\n' +
    '       "enum": [\n' +
    '        "first",\n' +
    '        "second"\n' +
    '       ],\n' +
    '       "enumNames": [\n' +
    '        "first",\n' +
    '        "second"\n' +
    '       ],\n' +
    '       "title": "Animal Skin Type",\n' +
    '       "type": "string"\n' +
    '      },\n' +
    '      "SkinsNumber": {\n' +
    '       "minimum": 0,\n' +
    '       "title": "Skins Number",\n' +
    '       "type": "number"\n' +
    '      }\n' +
    '     },\n' +
    '     "title": "Skin",\n' +
    '     "type": "object"\n' +
    '    },\n' +
    '    "title": " ",\n' +
    '    "type": "array"\n' +
    '   }\n' +
    '  }\n' +
    ' }\n' +
    '}'

export const COLLECTION_FIELD_HEADER_FAKE_DATA = {
    help_value_0: {
        type: 'string',
        readOnly: true,
        isHidden: false,
        display: ElementDisplay.Header,
        title: 'Fieldset title',
    }
};

export const JSON_SCHEMA_INLINE_REQUIRED_PROPERTIES = '{\n' +
    ' "auto-generate": true,\n' +
    ' "definition": [\n' +
    '  "string",\n' +
    '  {\n' +
    '   "key": "paragraph",\n' +
    '   "type": "textarea"\n' +
    '  },\n' +
    '  "number_no_min_max",\n' +
    '  "number_with_min",\n' +
    '  "number_with_max",\n' +
    '  "number_with_min_and_max",\n' +
    '  "single_select",\n' +
    '  "single_select_choices",\n' +
    '  {\n' +
    '   "add": "New",\n' +
    '   "key": "collection",\n' +
    '   "style": {\n' +
    '    "add": "btn-success"\n' +
    '   }\n' +
    '  },\n' +
    '  {\n' +
    '   "key": "calendar",\n' +
    '   "type": "datetime"\n' +
    '  },\n' +
    '  {\n' +
    '   "htmlClass": "json-schema-checkbox-wrapper",\n' +
    '   "key": "checkbox_static_choice",\n' +
    '   "titleMap": [\n' +
    '    {\n' +
    '     "name": "Coffee",\n' +
    '     "value": "coffee"\n' +
    '    },\n' +
    '    {\n' +
    '     "name": "Water",\n' +
    '     "value": "water"\n' +
    '    },\n' +
    '    {\n' +
    '     "name": "Juice",\n' +
    '     "value": "juice"\n' +
    '    },\n' +
    '    {\n' +
    '     "name": "Beer",\n' +
    '     "value": "beer"\n' +
    '    },\n' +
    '    {\n' +
    '     "name": "Flavor Water",\n' +
    '     "value": "flavor_water"\n' +
    '    },\n' +
    '    {\n' +
    '     "name": "Milk",\n' +
    '     "value": "milk"\n' +
    '    },\n' +
    '    {\n' +
    '     "name": "Mixed Drink",\n' +
    '     "value": "mix_drink"\n' +
    '    },\n' +
    '    {\n' +
    '     "name": "Other",\n' +
    '     "value": "other"\n' +
    '    },\n' +
    '    {\n' +
    '     "name": "Rompope",\n' +
    '     "value": "rompope"\n' +
    '    },\n' +
    '    {\n' +
    '     "name": "Ron",\n' +
    '     "value": "ron"\n' +
    '    },\n' +
    '    {\n' +
    '     "name": "Rum",\n' +
    '     "value": "rum"\n' +
    '    },\n' +
    '    {\n' +
    '     "name": "Soda",\n' +
    '     "value": "soda"\n' +
    '    },\n' +
    '    {\n' +
    '     "name": "Spark Water",\n' +
    '     "value": "spark_water"\n' +
    '    },\n' +
    '    {\n' +
    '     "name": "Tequila",\n' +
    '     "value": "tequila"\n' +
    '    },\n' +
    '    {\n' +
    '     "name": "Whisky",\n' +
    '     "value": "whisky"\n' +
    '    }\n' +
    '   ],\n' +
    '   "type": "checkboxes"\n' +
    '  },\n' +
    '  {\n' +
    '   "htmlClass": "json-schema-checkbox-wrapper",\n' +
    '   "key": "checkbox_query",\n' +
    '   "titleMap": [\n' +
    '    {\n' +
    '     "name": "Rhino",\n' +
    '     "value": "rhino_value"\n' +
    '    },\n' +
    '    {\n' +
    '     "name": "Black Rhino",\n' +
    '     "value": "blackrhino_value"\n' +
    '    },\n' +
    '    {\n' +
    '     "name": "White Rhino",\n' +
    '     "value": "whiterhino"\n' +
    '    }\n' +
    '   ],\n' +
    '   "type": "checkboxes"\n' +
    '  }\n' +
    ' ],\n' +
    ' "description": "This schema will be used for regression testing in the mobile app",\n' +
    ' "schema": {\n' +
    '  "$schema": "http://json-schema.org/draft-04/schema#",\n' +
    '  "icon_id": "hippo_rep",\n' +
    '  "id": "https://develop.pamdas.org/api/v1.0/activity/events/schema/eventtype/all_types_required_point",\n' +
    '  "image_url": "https://develop.pamdas.org/static/sprite-src/hippo_rep.svg",\n' +
    '  "properties": {\n' +
    '   "calendar": {\n' +
    '    "htmlClass": "col-lg-6",\n' +
    '    "readonly": false,\n' +
    '    "required": true,\n' +
    '    "title": "I\'m a calendar",\n' +
    '    "type": "string"\n' +
    '   },\n' +
    '   "checkbox_query": {\n' +
    '    "required": true,\n' +
    '    "title": "I\'m a checkbox with query",\n' +
    '    "type": "checkboxes"\n' +
    '   },\n' +
    '   "checkbox_static_choice": {\n' +
    '    "required": true,\n' +
    '    "title": "I\'m a checkbox with static choices",\n' +
    '    "type": "checkboxes"\n' +
    '   },\n' +
    '   "collection": {\n' +
    '    "items": {\n' +
    '     "properties": {\n' +
    '      "ItemConfiscated": {\n' +
    '       "enum": [\n' +
    '        "trophies",\n' +
    '        "weapons",\n' +
    '        "bushmeat",\n' +
    '        "other"\n' +
    '       ],\n' +
    '       "enumNames": {\n' +
    '        "bushmeat": "Bush Beat",\n' +
    '        "other": "Other",\n' +
    '        "trophies": "Trophies",\n' +
    '        "weapons": "Weapons"\n' +
    '       },\n' +
    '       "required": true,\n' +
    '       "title": "Item Type",\n' +
    '       "type": "string"\n' +
    '      },\n' +
    '      "ItemNumber": {\n' +
    '       "minimum": 0,\n' +
    '       "required": true,\n' +
    '       "title": "Number of Items",\n' +
    '       "type": "number"\n' +
    '      }\n' +
    '     },\n' +
    '     "title": "String inside a collection",\n' +
    '     "type": "object"\n' +
    '    },\n' +
    '    "required": true,\n' +
    '    "title": "I\'m a collection",\n' +
    '    "type": "array"\n' +
    '   },\n' +
    '   "number_no_min_max": {\n' +
    '    "required": true,\n' +
    '    "title": "I\'m a number without min-max",\n' +
    '    "type": "number"\n' +
    '   },\n' +
    '   "number_with_max": {\n' +
    '    "maximum": 100,\n' +
    '    "required": true,\n' +
    '    "title": "I\'m a number with a max (100)",\n' +
    '    "type": "number"\n' +
    '   },\n' +
    '   "number_with_min": {\n' +
    '    "minimum": 10,\n' +
    '    "required": true,\n' +
    '    "title": "I\'m a number with a min (10)",\n' +
    '    "type": "number"\n' +
    '   },\n' +
    '   "number_with_min_and_max": {\n' +
    '    "maximum": 1000,\n' +
    '    "minimum": 80,\n' +
    '    "required": true,\n' +
    '    "title": "I\'m a number with a min (80) and max (1000)",\n' +
    '    "type": "number"\n' +
    '   },\n' +
    '   "paragraph": {\n' +
    '    "required": true,\n' +
    '    "title": "I\'m a text area",\n' +
    '    "type": "string"\n' +
    '   },\n' +
    '   "single_select": {\n' +
    '    "enum": [\n' +
    '     "new",\n' +
    '     "impeded",\n' +
    '     "old"\n' +
    '    ],\n' +
    '    "enumNames": {\n' +
    '     "impeded": "Impeded",\n' +
    '     "new": "New/Fresh",\n' +
    '     "old": "Old"\n' +
    '    },\n' +
    '    "required": true,\n' +
    '    "title": "I\'m a single select query",\n' +
    '    "type": "string"\n' +
    '   },\n' +
    '   "single_select_choices": {\n' +
    '    "enum": [\n' +
    '     "Option 1",\n' +
    '     "Option 2",\n' +
    '     "Option 3"\n' +
    '    ],\n' +
    '    "required": true,\n' +
    '    "title": "I\'m a single select choices",\n' +
    '    "type": "string"\n' +
    '   },\n' +
    '   "string": {\n' +
    '    "required": true,\n' +
    '    "title": "I\'m a string",\n' +
    '    "type": "string"\n' +
    '   }\n' +
    '  },\n' +
    '  "title": "Schema All Types - Non required",\n' +
    '  "type": "object"\n' +
    ' }\n' +
    '}'


