// Internal Dependencies
import {
    CHECKBOXES,
    ElementDisplay,
    FIELD_SET,
    getFieldSetTitleKey,
    HELP_VALUE,
    isCheckbox,
    isFieldSet,
    isFieldSetTitle,
    isPropertyKey,
    isSchemaFieldSet,
} from './utils/utils';

const specialCharactersInKey = /[^\w\n\s_"](?=[^:\n\s{}[]]*:[\t\n\s]*(\{|\[)+)/g;
const emptyEnumRegex = '\\"enum\\"\\n*\\s*\\:\\n*\\s*\\[\\n*\\s*\\]';
const emptyEnumValue = '"enum": ["0"]';
const emptyEnumNamesRegex = '\\"enumNames\\"\\n*\\s*\\:\\n*\\s*\\{\\n*\\s*\\}';
const emptyEnumNamesValue = '"enumNames": {"0":"No Options"}';
const emptyTitleMapRegex = '\\"titleMap\\"\\n*\\s*\\:\\n*\\s*\\[\\n*\\s*\\]';
const emptyTitleMapValue = '"titleMap": [{"value":"no_option", "name":"No Option"}]';

const generateSchemaForCheckboxes = (schema: any) => {
    const checkboxes: Object[] = [];
    const definitions = schema.definition.filter((item: any) => isCheckbox(item));
    if (definitions.length > 0) {
        checkboxes.push(...definitions);
    }

    if (isSchemaFieldSet(schema.definition)) {
        const fieldSet = schema.definition.filter((item: any) => (
            item instanceof Object && isFieldSet(item)));

        fieldSet.forEach((fieldSetItem: any) => {
            const nestedCheckboxes = fieldSetItem.items.filter((item: any) => isCheckbox(item));
            if (nestedCheckboxes.length > 0) {
                checkboxes.push(...nestedCheckboxes);
            }
        });
    }

    checkboxes.forEach((definition: any) => {
        const {key} = definition;
        schema.schema.properties[key] = getSchemaForCheckbox(
            definition,
            schema.schema.properties[key].title || '',
        );
    });

    return schema;
};

const getFieldSetTitleSchema = (schema: any) => {
    const definitions = schema.definition.filter((item: any) => item instanceof Object
        && isFieldSetTitle(item));

    definitions.forEach((definition: any) => {
        const {title} = definition;
        const key = getFieldSetTitleKey(title);
        schema.schema.properties[key] = getTitleProperty(title);
    });
    return schema;
};

const getSchemaForCheckbox = (definition: any, title: string) => ({
    type: 'array',
    uniqueItems: true,
    isHidden: false,
    title: title || definition.title,
    items: {
        enum: definition.titleMap.map((item: any) => item.value),
        enumNames: definition.titleMap.map((item: any) => item.name),
    },
});

const getTitleProperty = (title: string) => ({
    type: 'string',
    readOnly: true,
    isHidden: false,
    display: ElementDisplay.Header,
    title,
});

const setFieldsVisibility = (schema: any) => {
    const listOfKeys: string[] = [];

    // Get keys in the definition section
    schema.definition.forEach((item: any) => {
        if (typeof item === 'string') {
            listOfKeys.push(item);
        } else if (item instanceof Object) {
            if (isFieldSet(item)) {
                item.items.forEach((fieldSetItem: any) => {
                    if (typeof fieldSetItem === 'string') {
                        listOfKeys.push(fieldSetItem);
                    } else if (isPropertyKey(fieldSetItem)) {
                        listOfKeys.push(fieldSetItem.key);
                    }
                });
            } else if (isPropertyKey(item)) {
                listOfKeys.push(item.key);
            }
        }
    });

    // Mark the schema properties as hidden or visible
    Object.keys(schema.schema.properties).forEach((property: string) => {
        if (schema.schema.properties[property].isHidden !== undefined) {
            return;
        }
        // @ts-ignore
        schema.schema.properties[property].isHidden = listOfKeys.indexOf(property) === -1;
    });

    return schema;
};

const cleanUpRequiredProperty = (schema: any) => {
    // Get all properties in schema
    const propertyNames = Object.keys(schema.properties);
    const requiredProperties = [];

    // Iterate over the properties to get clean enum data
    for (let i = 0, l = propertyNames.length; i < l; i++) {
        if (schema.properties[propertyNames[i]].required === true || schema.properties[propertyNames[i]].required === 'true') {
            requiredProperties.push(propertyNames[i]);
            delete schema.properties[propertyNames[i]].required;
        }
        if (schema.properties[propertyNames[i]].type === 'array'
            && schema.properties[propertyNames[i]].items.enum === undefined
            && schema.properties[propertyNames[i]].items.enumNames === undefined) {
            cleanUpRequiredProperty(schema.properties[propertyNames[i]].items);
        }
    }

    if (requiredProperties.length > 0) {
        // eslint-disable-next-line no-param-reassign
        schema.required = requiredProperties;
    }

    return schema;
};

const formatDefinitionInSchema = (schema: any) => {
    if (schema.schema.definition !== undefined) {
        const {definition} = schema.schema;
        delete schema.schema.definition;
        schema.definition = definition;
        return schema;
    }
    return schema;
};

const formatSchemaRepeatableFieldLayout = (schema: any) => {
    const properties: any = {};
    let headerCount = 0;

    // eslint-disable-next-line no-restricted-syntax
    for (const item of schema.definition) {
        if (typeof item === 'string') {
            properties[item] = schema.schema.properties[item];
            delete schema.schema.properties[item];
        } else if (item instanceof Object) {
            if (item.helpvalue !== undefined) {
                const property = `help_value_${headerCount}`;
                headerCount += 1;
                properties[property] = getTitleProperty((item.helpvalue || '').replace(/(<.+?>)/g, ''));
            } else if (item.key !== undefined) {
                properties[item.key] = schema.schema.properties[item.key];
                delete schema.schema.properties[item.key];
            }
        }
    }

    schema.schema.properties = Object.assign(properties, schema.schema.properties);
};

const cleanUpInactiveEnumOptions = (schema: any) => {
    // Get all properties in schema
    const propertyNames = Object.keys(schema.schema.properties);

    // Iterate over the properties to get clean enum data
    for (let i = 0, l = propertyNames.length; i < l; i++) {
        if (schema.schema.properties[propertyNames[i]].type === 'string'
            && schema.schema.properties[propertyNames[i]].enum
            && schema.schema.properties[propertyNames[i]].inactive_enum) {
            const inactiveEnums = schema.schema.properties[propertyNames[i]].inactive_enum;

            for (let j = 0, m = inactiveEnums.length; j < m; j++) {
                const enumIndex = schema.schema.properties[propertyNames[i]].enum.indexOf(inactiveEnums[j]);

                schema.schema.properties[propertyNames[i]].enum.splice(enumIndex, 1);
            }
        }
    }
};

export const validateSchema = (stringSchema: string) => {
    switch (true) {
        case stringSchema.match(specialCharactersInKey) !== null:
            throw Error('Special characters not supported in JSON Schema');
        // Fall through
        case stringSchema.includes('“') || stringSchema.includes('”'):
            stringSchema = stringSchema.replace(/([“”])/g, '"');
        // Fall through
        case stringSchema.match(new RegExp(emptyEnumRegex, 'g')) !== null:
            stringSchema = stringSchema.replace(new RegExp(emptyEnumRegex, 'g'), emptyEnumValue);
        // Fall through
        case stringSchema.match(new RegExp(emptyEnumNamesRegex, 'g')) !== null:
            stringSchema = stringSchema.replace(new RegExp(emptyEnumNamesRegex, 'g'), emptyEnumNamesValue);
        // Fall through
        case stringSchema.match(new RegExp(emptyTitleMapRegex, 'g')) !== null:
            stringSchema = stringSchema.replace(new RegExp(emptyTitleMapRegex, 'g'), emptyTitleMapValue);
        // Fall through
        default:
            break;
    }

    let schema = JSON.parse(stringSchema);
    delete schema.schema.$schema;
    delete schema.schema.id;

    // Clean up inactive enums
    cleanUpInactiveEnumOptions(schema);

    schema = formatDefinitionInSchema(schema);
    if (stringSchema.includes(CHECKBOXES)) {
        schema = generateSchemaForCheckboxes(schema);
    }

    if (stringSchema.includes(FIELD_SET)) {
        schema = getFieldSetTitleSchema(schema);
    }
    if (stringSchema.includes(HELP_VALUE)) {
        formatSchemaRepeatableFieldLayout(schema);
    }

    schema = setFieldsVisibility(schema);
    schema.schema = cleanUpRequiredProperty(schema.schema);
    return schema;
};