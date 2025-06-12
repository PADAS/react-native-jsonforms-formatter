// External Dependencies
import { isEmpty } from 'lodash-es';

//--------------------------------------------------------------
// public constants
//--------------------------------------------------------------

export const FIELD_SET = 'fieldset';
export const HELP_VALUE = 'helpvalue';
export const REQUIRED_PROPERTY = 'required';
export const CHECKBOXES = 'checkboxes';
export const INACTIVE_ENUM = 'inactive_enum';
export const DISABLED_ENUM = 'inactive_titleMap';
export const STRING_TYPE = 'string';
export const ARRAY_TYPE = 'array';
export const ENUM = 'enum';

//--------------------------------------------------------------
// public enums
//--------------------------------------------------------------

export enum DateTimeFormat {
  DateTime = 'date-time',
  Date = 'date',
}

export enum PropertyFormat {
  DateTime = 'date-time',
  MultiSelect = 'multiselect',
  RepeatableField = 'repeatable-field',
  FormLabel = 'form-label',
}

export enum ElementDisplay {
  Header = 'header',
}

//--------------------------------------------------------------
// public functions
//--------------------------------------------------------------

export const getFieldSetTitleKey = (title: string) => {
  const key = title.toLowerCase().replace(/[\s\\/\\%]/gi, '_');
  return `fieldset__title_${key}`;
};

export const getSchemaValidations = (stringSchema: string) => ({
  hasCheckboxes: hasCheckboxes(stringSchema),
  hasInactiveChoices: hasInactiveChoices(stringSchema),
  hasDisabledChoices: hasDisabledChoices(stringSchema),
  hasEnums: hasEnums(stringSchema),
});

export const hasDuplicatedItems = (items: string[]) => (new Set(items).size !== items.length);

export const isArrayProperty = (property: any) => property.type === ARRAY_TYPE && !property.items?.enum
&& !property.items?.enumNames;

export const isCheckbox = (item: any) => isObject(item) && item.type === CHECKBOXES;

export const isDisabledChoice = (item: any) => isObject(item) && item.type === CHECKBOXES && item.inactive_titleMap?.length > 0
  && item.titleMap?.length > 0;

export const isEmptyString = (value: string | undefined) => (value === undefined
  || value === null
  || value.trim().length === 0);

export const isFieldSetTitle = (item: any) => isObject(item) && item.type === FIELD_SET
  && !isEmpty(item.title);

export const isFieldSetTitleWithoutItems = (item: any) => isObject(item) && item.type === FIELD_SET
  && item.items.length === 0 && !isEmpty(item.title);

export const isFieldSet = (item: any) => isObject(item) && item.type === FIELD_SET && item.items.length > 0;

export const isInactiveChoice = (item: any) => item.type === STRING_TYPE
 && item.enum?.length > 0 && item.inactive_enum?.length > 0;

export const isObject = (item: any) => item instanceof Object;

export const isPropertyKey = (item: any) => !isEmpty(item.key);

export const isRequiredProperty = (property: any) => property.required === 'true' || property.required > 0;

export const isSchemaFieldSet = (definition: any[]) => {
  if (definition.length === 0) {
    return false;
  }
  const fieldSet = definition.find((item: any) => isObject(item)
    && item && (item.type || '') === FIELD_SET);
  return fieldSet !== undefined;
};

export const isString = (item: any) => typeof item === STRING_TYPE;

// Helper function to recursively traverse and process the schema
export const traverseSchema = (
  schema: any,
  processor: (node: any, path: string[]) => void,
  path: string[] = []
) => {
  if (typeof schema !== 'object' || schema === null) {
    return;
  }

  processor(schema, path);

  if (Array.isArray(schema)) {
    schema.forEach((item, index) =>
      traverseSchema(item, processor, [...path, index.toString()])
    );
  } else {
    Object.entries(schema).forEach(([key, value]) =>
      traverseSchema(value, processor, [...path, key])
    );
  }
};

//--------------------------------------------------------------
// private functions
//--------------------------------------------------------------

const hasCheckboxes = (stringSchema: string) => stringSchema.includes(CHECKBOXES);

const hasInactiveChoices = (stringSchema: string) => stringSchema.includes(INACTIVE_ENUM);

const hasDisabledChoices = (stringSchema: string) => stringSchema.includes(DISABLED_ENUM);

const hasEnums = (stringSchema: string) => stringSchema.includes(ENUM);
