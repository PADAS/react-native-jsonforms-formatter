import { ElementDisplay } from "../../src/utils/utils";

export const JSON_SCHEMA_SPECIAL_CHARS_FAKE_DATA = '{\n' +
  ' "definition": [\n' +
  '  "text_input"\n' +
  ' ],\n' +
  ' "schema": {\n' +
  '  "properties": {\n' +
  '   "text_input_%": {\n' +
  '    "title": "Text input field",\n' +
  '    "type": "string"\n' +
  '   }\n' +
  '  }\n' +
  ' }\n' +
  '}';

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
  '}';

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
  '}';

export const JSON_SCHEMA_ID_$SCHEMA_FAKE_DATA = '{\n' +
  ' "definition": [\n' +
  '  "text_input"\n' +
  ' ],\n' +
  ' "schema": {\n' +
  '  "$schema": "http://json-schema.org/draft-04/schema#",\n' +
  '  "id": "https://develop.pamdas.org/api/v1.0/activity/events/schema/eventtype/all_types_required_point",\n' +
  '  "properties": {\n' +
  '   "text_input": {\n' +
  '    "title": "Text input field",\n' +
  '    "type": "string"\n' +
  '   }\n' +
  '  }\n' +
  ' }\n' +
  '}';

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
  '}';

export const JSON_SCHEMA_INACTIVE_TITLE_MAP_FAKE_DATA = '{\n' +
  '    "definition": [\n' +
  '        {\n' +
  '            "inactive_titleMap": [\n' +
  '                "phot_evidence_collected"\n' +
  '            ],\n' +
  '            "key": "behavior",\n' +
  '            "title": "test checkbox enum",\n' +
  '            "titleMap": [\n' +
  '                {\n' +
  '                    "name": "Confirmed automated alerts received",\n' +
  '                    "value": "confirmed_alerts"\n' +
  '                },\n' +
  '                {\n' +
  '                    "name": "Deployed HWCMU",\n' +
  '                    "value": "deployed_pac"\n' +
  '                },\n' +
  '                {\n' +
  '                    "name": "Photographic evidence collected",\n' +
  '                    "value": "phot_evidence_collected"\n' +
  '                }\n' +
  '            ],\n' +
  '            "type": "checkboxes"\n' +
  '        }\n' +
  '    ],\n' +
  '    "schema": {\n' +
  '        "$schema": "http://json-schema.org/draft-04/schema#",\n' +
  '        "icon_id": "j93b",\n' +
  '        "id": "https://mobile-bash.pamdas.org/api/v1.0/activity/events/schema/eventtype/j93b",\n' +
  '        "image_url": "https://mobile-bash.pamdas.org/static/generic-black.svg",\n' +
  '        "properties": {\n' +
  '            "behavior": {\n' +
  '                "title": "test checkbox enum",\n' +
  '                "type": "a"\n' +
  '            }\n' +
  '        },\n' +
  '        "title": "Radio Report (radio_rep)",\n' +
  '        "type": "object"\n' +
  '    }\n' +
  '}';

export const JSON_SCHEMA_INACTIVE_FIELD_SET_TITLE_MAP_FAKE_DATA = '{\n' +
  ' "definition": [\n' +
  '  {\n' +
  '   "htmlClass": "col-lg-12",\n' +
  '   "items": [],\n' +
  '   "title": "Reporters Details",\n' +
  '   "type": "fieldset"\n' +
  '  },\n' +
  '  {\n' +
  '   "htmlClass": "col-lg-6",\n' +
  '   "items": [\n' +
  '    {\n' +
  '     "inactive_titleMap": [\n' +
  '      "phot_evidence_collected"\n' +
  '     ],\n' +
  '     "key": "reportorigin",\n' +
  '     "title": "test checkbox enum",\n' +
  '     "titleMap": [\n' +
  '      {\n' +
  '       "name": "Confirmed automated alerts received",\n' +
  '       "value": "confirmed_alerts"\n' +
  '      },\n' +
  '      {\n' +
  '       "name": "Deployed HWCMU",\n' +
  '       "value": "deployed_pac"\n' +
  '      },\n' +
  '      {\n' +
  '       "name": "Photographic evidence collected",\n' +
  '       "value": "phot_evidence_collected"\n' +
  '      }\n' +
  '     ],\n' +
  '     "type": "checkboxes"\n' +
  '    }\n' +
  '   ],\n' +
  '   "type": "fieldset"\n' +
  '  },\n' +
  '  {\n' +
  '   "htmlClass": "col-lg-12",\n' +
  '   "items": [],\n' +
  '   "title": "Reporters Details",\n' +
  '   "type": "fieldset"\n' +
  '  },\n' +
  '  {\n' +
  '   "htmlClass": "col-lg-6",\n' +
  '   "items": [\n' +
  '    "vehicles"\n' +
  '   ],\n' +
  '   "type": "fieldset"\n' +
  '  }\n' +
  ' ],\n' +
  ' "schema": {\n' +
  '  "$schema": "http://json-schema.org/draft-04/schema#",\n' +
  '  "icon_id": "fieldsets_disabled_choice",\n' +
  '  "id": "https://mobile-bash.pamdas.org/api/v1.0/activity/events/schema/eventtype/fieldsets_disabled_choice",\n' +
  '  "image_url": "https://mobile-bash.pamdas.org/static/generic-black.svg",\n' +
  '  "properties": {\n' +
  '    "reportorigin": {\n' +
  '    "enum": [\n' +
  '     "choice1",\n' +
  '     "choice2"\n' +
  '    ],\n' +
  '    "enumNames": {\n' +
  '     "choice1": "Choice 1",\n' +
  '     "choice2": "Choice 2"\n' +
  '    },\n' +
  '    "title": "Report Origin TEST dropdown enum",\n' +
  '    "type": "string"\n' +
  '   }\n' +
  '  },\n' +
  '  "title": "Road Banditry Report",\n' +
  '  "type": "object"\n' +
  ' }\n' +
  '}';

export const JSON_SCHEMA_DATE_TIME_FIELD_SETS = '{\n' +
  ' "schema": {\n' +
  '  "$schema": "http://json-schema.org/draft-04/schema#",\n' +
  '  "definition": [\n' +
  '   {\n' +
  '    "htmlClass": "col-lg-6",\n' +
  '    "items": [\n' +
  '     {\n' +
  '      "fieldHtmlClass": "date-time-picker json-schema",\n' +
  '      "key": "arrival_time"\n' +
  '     }\n' +
  '    ],\n' +
  '    "type": "fieldset"\n' +
  '   }\n' +
  '  ],\n' +
  '  "properties": {\n' +
  '   "arrival_time": {\n' +
  '    "key": "Arrival Time",\n' +
  '    "title": "HWC MU Arrival Time (at scene)"\n' +
  '   }\n' +
  '  },\n' +
  '  "title": "EventType Test Data",\n' +
  '  "type": "object"\n' +
  ' }\n' +
  '}';

export const UI_SCHEMA_ELEMENT_DATE_TIME_FIELD_SETS = {
  "type": "Control",
  "scope": "#/properties/arrival_time",
  "label": "HWC MU Arrival Time (at scene)",
  "options": {
    "format": "date-time",
    "display": "date-time"
  }
};

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
  '}';

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
  '}';

export const FIELD_SET_HEADER_FAKE_DATA = {
  fieldset__title_fieldset_title: {
    type: 'string',
    readOnly: true,
    isHidden: false,
    display: ElementDisplay.Header,
    title: 'Fieldset title',
  },
  fieldset__title_fieldset_number_title: {
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
  '}';

export const COLLECTION_FIELD_HEADER_FAKE_DATA = {
  help_value_0: {
    type: 'string',
    readOnly: true,
    isHidden: false,
    display: ElementDisplay.Header,
    title: 'Exhibits Recovered',
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
  '    "required": "true",\n' +
  '    "title": "I\'m a checkbox with query",\n' +
  '    "type": "checkboxes"\n' +
  '   },\n' +
  '   "checkbox_static_choice": {\n' +
  '    "required": 1,\n' +
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

export const JSON_SCHEMA_DEFAULT_VALUES = '{\n' +
  '  "schema": {\n' +
  '    "type": "object",\n' +
  '    "properties": {\n' +
  '      "test_one_date": {\n' +
  '        "type": "string",\n' +
  '        "title": "Test 1 date",\n' +
  '        "default": "2023-08-14 15:15",\n' +
  '        "isHidden": false\n' +
  '      },\n' +
  '      "test_two_string": {\n' +
  '        "type": "string",\n' +
  '        "title": "Test 2 String",\n' +
  '        "default": "Test 2",\n' +
  '        "isHidden": false\n' +
  '      },\n' +
  '      "test_three_number": {\n' +
  '        "type": "number",\n' +
  '        "title": "Test 3 Number With Min and Max",\n' +
  '        "minimum": 0,\n' +
  '        "default": 25,\n' +
  '        "maximum": 50,\n' +
  '        "isHidden": false\n' +
  '      },\n' +
  '      "test_four_number": {\n' +
  '        "type": "number",\n' +
  '        "default": 6,\n' +
  '        "title": "Test 4 Number",\n' +
  '        "isHidden": false\n' +
  '      },\n' +
  '      "test_five_enumString": {\n' +
  '        "type": "string",\n' +
  '        "title": "Test 5 enum value is a string",\n' +
  '        "default": "behavior1",\n' +
  '        "enum": [\n' +
  '          "0"\n' +
  '        ],\n' +
  '        "enumNames": {\n' +
  '          "0": "No Options"\n' +
  '        },\n' +
  '        "isHidden": false\n' +
  '      },\n' +
  '      "test_six_enum_dictionary": {\n' +
  '        "type": "string",\n' +
  '        "title": "Test 6 enum and dictionary test",\n' +
  '        "default": "testone",\n' +
  '        "enum": [\n' +
  '          "0"\n' +
  '        ],\n' +
  '        "enumNames": {\n' +
  '          "0": "No Options"\n' +
  '        },\n' +
  '        "isHidden": false\n' +
  '      },\n' +
  '      "testseven": {\n' +
  '        "type": "array",\n' +
  '        "uniqueItems": true,\n' +
  '        "isHidden": false,\n' +
  '        "title": "Test Seven Checkbox Enum",\n' +
  '        "items": {\n' +
  '          "enum": [\n' +
  '            "no_option"\n' +
  '          ],\n' +
  '          "enumNames": [\n' +
  '            "No Option"\n' +
  '          ]\n' +
  '        },\n' +
  '        "default": [\n' +
  '          "testseventhree"\n' +
  '        ]\n' +
  '      },\n' +
  '      "test_eight_checkbox_query": {\n' +
  '        "type": "array",\n' +
  '        "uniqueItems": true,\n' +
  '        "isHidden": false,\n' +
  '        "title": "Test 8 checkbox query",\n' +
  '        "items": {\n' +
  '          "enum": [\n' +
  '            "no_option"\n' +
  '          ],\n' +
  '          "enumNames": [\n' +
  '            "No Option"\n' +
  '          ]\n' +
  '        },\n' +
  '        "default": [\n' +
  '          "9b5cb19e-b7bd-4fa8-9263-8e34502e35ca"\n' +
  '        ]\n' +
  '      },\n' +
  '      "test_nine_dropdown_query": {\n' +
  '        "type": "string",\n' +
  '        "title": "Test 9 dropdown query dynamic choice on queens",\n' +
  '        "default": "9b5cb19e-b7bd-4fa8-9263-8e34502e35ca",\n' +
  '        "enum": [\n' +
  '          "0"\n' +
  '        ],\n' +
  '        "enumNames": [],\n' +
  '        "isHidden": false\n' +
  '      },\n' +
  '      "testElevenArrayTest": {\n' +
  '        "type": "array",\n' +
  '        "title": "Array and Object Test",\n' +
  '        "default": [\n' +
  '          {\n' +
  '            "test_array_string": "string",\n' +
  '            "test_array_number": 1\n' +
  '          }\n' +
  '        ],\n' +
  '        "items": {\n' +
  '          "type": "object",\n' +
  '          "title": "Array and Object Test",\n' +
  '          "properties": {\n' +
  '            "test_array_string": {\n' +
  '              "type": "string",\n' +
  '              "title": "Test 2 String"\n' +
  '            },\n' +
  '            "test_array_number": {\n' +
  '              "type": "number",\n' +
  '              "title": "Test number",\n' +
  '              "minimum": 0\n' +
  '            }\n' +
  '          }\n' +
  '        },\n' +
  '        "isHidden": false\n' +
  '      },\n' +
  '      "test_fourteen_textarea": {\n' +
  '        "type": "string",\n' +
  '        "default": "Test 14",\n' +
  '        "title": "Test 14 Text Area",\n' +
  '        "isHidden": false\n' +
  '      }\n' +
  '    },\n' +
  '    "icon_id": "hippo_rep",\n' +
  '    "image_url": "https://mobile-bash.pamdas.org/static/sprite-src/hippo_rep.svg",\n' +
  '    "required": [\n' +
  '      "test_one_date",\n' +
  '      "test_two_string"\n' +
  '    ]\n' +
  '  },\n' +
  '  "definition": [\n' +
  '    {\n' +
  '      "key": "test_one_date",\n' +
  '      "fieldHtmlClass": "date-time-picker json-schema"\n' +
  '    },\n' +
  '    "test_two_string",\n' +
  '    "test_three_number",\n' +
  '    "test_four_number",\n' +
  '    "test_five_enumString",\n' +
  '    "test_six_enum_dictionary",\n' +
  '    {\n' +
  '      "key": "testseven",\n' +
  '      "type": "checkboxes",\n' +
  '      "titleMap": [\n' +
  '        {\n' +
  '          "value": "no_option",\n' +
  '          "name": "No Option"\n' +
  '        }\n' +
  '      ]\n' +
  '    },\n' +
  '    {\n' +
  '      "key": "test_eight_checkbox_query",\n' +
  '      "type": "checkboxes",\n' +
  '      "title": "Test 8 checkbox query",\n' +
  '      "titleMap": [\n' +
  '        {\n' +
  '          "value": "no_option",\n' +
  '          "name": "No Option"\n' +
  '        }\n' +
  '      ],\n' +
  '      "htmlClass": "json-schema-checkbox-wrapper"\n' +
  '    },\n' +
  '    "test_nine_dropdown_query",\n' +
  '    {\n' +
  '      "key": "testElevenArrayTest",\n' +
  '      "add": "New",\n' +
  '      "style": {\n' +
  '        "add": "btn-success"\n' +
  '      }\n' +
  '    },\n' +
  '    {\n' +
  '      "key": "test_fourteen_textarea",\n' +
  '      "type": "textarea"\n' +
  '    }\n' +
  '  ]\n' +
  '}'
