/* eslint-disable import/no-named-as-default */
// External Dependencies
import { isEmpty } from 'lodash-es';

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

export const FIELD_SET = 'fieldset';
export const HELP_VALUE = 'helpvalue';
export const CHECKBOXES = 'checkboxes';
export const  INACTIVE_ENUM = 'inactive_enum';
export const  DISABLED_ENUM = 'inactive_titleMap';
export const  STRING_TYPE = 'string';

export const isObject = (item: any) => item instanceof Object;

export const isString = (item: any) => typeof item === STRING_TYPE;
export const isSchemaFieldSet = (definition: any[]) => {
  if (definition.length === 0) {
    return false;
  }
  const fieldSet = definition.find((item: any) => isObject(item)
    && item && (item.type || '') === FIELD_SET);
  return fieldSet !== undefined;
};

export const isFieldSetTitle = (item: any) => isObject(item) && item.type === FIELD_SET
  && !isEmpty(item.title);

export const isFieldSetTitleWithoutItems = (item: any) => isObject(item) && item.type === FIELD_SET
  && item.items.length === 0 && !isEmpty(item.title);

export const isFieldSet = (item: any) => isObject(item) && item.type === FIELD_SET && item.items.length > 0;

export const isCheckbox = (item: any) => isObject(item) && item.type === CHECKBOXES;

export const isPropertyKey = (item: any) => !isEmpty(item.key);

export const getFieldSetTitleKey = (title: string) => {
  const key = title.toLowerCase().replace(/[\s\\/\\%]/gi, '_');
  return `fieldset__title_${key}`;
};

export const getSchemaValidations = (stringSchema: string) => ({
  hasCheckboxes: hasCheckboxes(stringSchema),
  hasInactiveChoices: hasInactiveChoices(stringSchema),
  hasDisabledChoices: hasDisabledChoices(stringSchema),
});

const hasCheckboxes = (stringSchema: string) => stringSchema.includes(CHECKBOXES);

const hasInactiveChoices = (stringSchema: string) => stringSchema.includes(INACTIVE_ENUM);

const hasDisabledChoices = (stringSchema: string) => stringSchema.includes(DISABLED_ENUM);

export const isInactiveChoice = (item: any) => item.type === STRING_TYPE
 && item.enum?.length > 0 && item.inactive_enum?.length > 0;

export const isDisabledChoice = (item: any) => isObject(item) && item.type === CHECKBOXES
  && item.titleMap?.length > 0 && item.inactive_titleMap?.length > 0;

