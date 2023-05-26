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

export const isSchemaFieldSet = (definition: any[]) => {
    if (definition.length === 0) {
        return false;
    }
    const fieldSet = definition.find((item: any) => item instanceof Object
        && item && (item.type || '') === FIELD_SET);
    return fieldSet !== undefined;
};

export const isFieldSetTitle = (item: any) => item.type === FIELD_SET
    && !isEmpty(item.title);

export const isFieldSetTitleWithoutItems = (item: any) => item.type === FIELD_SET
    && item.items.length === 0 && !isEmpty(item.title);

export const isFieldSet = (item: any) => item.type === FIELD_SET && item.items.length > 0;

export const isCheckbox = (item: any) => item.type === CHECKBOXES;

export const isPropertyKey = (item: any) => !isEmpty(item.key);

export const getFieldSetTitleKey = (title: string) => {
    const key = title.toLowerCase().replace(/[\s\\/\\%]/gi, '_');
    return `fieldset__title_${key}`;
};
