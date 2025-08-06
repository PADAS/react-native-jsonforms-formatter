export interface ValidationOptions {
  version?: 'v1' | 'v2' | 'auto';
  strictMode?: boolean;
  locale?: string;
}

// V1 Schema Types
export interface V1Schema {
  schema: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
    [key: string]: any;
  };
  definition: any[];
}

// V2 Schema Types
export interface V2Schema {
  json: {
    $schema: string;
    additionalProperties: boolean;
    properties: Record<string, V2Property>;
    required: string[];
    type: string;
  };
  ui: {
    fields: Record<string, V2UIField>;
    headers: Record<string, V2Header>;
    order: string[];
    sections: Record<string, V2Section>;
  };
}

// Base property interface for nested properties (doesn't require deprecated/title)
export interface V2BaseProperty {
  type: 'string' | 'number' | 'array' | 'object';
  description?: string;
  default?: any;
  minimum?: number;
  maximum?: number;
  format?: 'date-time' | 'date' | 'time' | 'uri';
  anyOf?: Array<{ $ref: string }>;
  items?: V2BaseProperty;
  properties?: Record<string, V2BaseProperty>;
  required?: string[];
  additionalProperties?: boolean;
  unevaluatedItems?: boolean;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
}

// Top-level property interface (extends base with required fields)
export interface V2Property extends V2BaseProperty {
  deprecated: boolean;
  title: string;
  items?: V2BaseProperty;
  properties?: Record<string, V2BaseProperty>;
}

export interface V2UIField {
  type: 'TEXT' | 'NUMERIC' | 'CHOICE_LIST' | 'DATE_TIME' | 'LOCATION' | 'COLLECTION' | 'ATTACHMENT';
  parent: string;
  inputType?: 'SHORT_TEXT' | 'LONG_TEXT' | 'DROPDOWN' | 'LIST';
  placeholder?: string;
  choices?: V2Choices;
  buttonText?: string;
  columns?: number;
  itemIdentifier?: string;
  itemName?: string;
  leftColumn?: string[];
  rightColumn?: string[];
  allowableFileTypes?: string[];
}

export interface V2Choices {
  type: 'EXISTING_CHOICE_LIST' | 'MY_DATA';
  eventTypeCategories: string[];
  existingChoiceList: string[];
  featureCategories: string[];
  myDataType: string;
  subjectGroups: string[];
  subjectSubtypes: string[];
}

export interface V2Header {
  label: string;
  section: string;
  size: 'LARGE' | 'MEDIUM' | 'SMALL';
}

export interface V2Section {
  columns: 1 | 2;
  isActive: boolean;
  label: string;
  leftColumn: V2ColumnItem[];
  rightColumn: V2ColumnItem[];
}

export interface V2ColumnItem {
  name: string;
  type: 'field' | 'header';
}

// JSONForms UI Schema Types
export interface JSONFormsUIElement {
  type: string;
  scope?: string;
  label?: string;
  options?: Record<string, any>;
  elements?: JSONFormsUIElement[];
}

export interface JSONFormsControl extends JSONFormsUIElement {
  type: 'Control';
  scope: string;
  label: string;
  options?: {
    format?: string;
    display?: string;
    placeholder?: string;
    multi?: boolean;
    [key: string]: any;
  };
}

export interface JSONFormsLayout extends JSONFormsUIElement {
  type: 'VerticalLayout' | 'HorizontalLayout' | 'Group' | 'Categorization';
  elements: JSONFormsUIElement[];
  label?: string;
}

export interface JSONFormsLabel extends JSONFormsUIElement {
  type: 'Label';
  text: string;
  options?: {
    size?: 'LARGE' | 'MEDIUM' | 'SMALL';
    [key: string]: any;
  };
}

export type JSONFormsUISchema = JSONFormsUIElement;
