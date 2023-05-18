import "jest-extended";
// Internal Dependencies
import jsonSchema from "../common/mockData/jsonSchemaMock.json";
import expectedSchema from "../common/mockData/jsonSchemaExpectedMock.json";
import expectedUISchema from "../common/mockData/uiSchemaExpectedMock.json";
import { validateSchema } from "../validateJsonSchema";
import { generateUISchema } from "../generateUISchema";
import {
    JSON_SCHEMA_ID_$SCHEMA_FAKE_DATA,
    JSON_SCHEMA_EMPTY_CHOICES_FAKE_DATA,
    JSON_SCHEMA_INVALID_DOUBLE_QUOTES_FAKE_DATA,
    JSON_SCHEMA_SPECIAL_CHARS_FAKE_DATA,
    JSON_SCHEMA_INACTIVE_CHOICES_FAKE_DATA,
    JSON_SCHEMA_INVALID_DEFINITION_LOCATION_FAKE_DATA,
    JSON_SCHEMA_FIELD_SETS_FAKE_DATA,
    FIELD_SET_HEADER_FAKE_DATA,
    JSON_SCHEMA_COLLECTION_FIELD_FAKE_DATA,
    COLLECTION_FIELD_HEADER_FAKE_DATA, JSON_SCHEMA_INLINE_REQUIRED_PROPERTIES,
} from "../common/mockData/formatterMockData";


describe('JSON Schema validation', () => {

    it('Special chars should throw an exception',  () => {
        expect(() => { validateSchema(JSON_SCHEMA_SPECIAL_CHARS_FAKE_DATA) }).toThrowError('Special characters not supported in JSON Schema');
    });

    it('Validate invalid double quotes',  () => {
        expect(validateSchema(JSON_SCHEMA_INVALID_DOUBLE_QUOTES_FAKE_DATA).toString).not.toContain(/([“”])/g);
    });

    it('Validate empty choices',  () => {
        const validSchema = validateSchema(JSON_SCHEMA_EMPTY_CHOICES_FAKE_DATA).toString;
        expect(validSchema).not.toContain(/\"enum\"\n*\s*\:\n*\s*\[\n*\s*\]/g);
        expect(validSchema).not.toContain(/\"enumNames\"\n*\s*\:\n*\s*\{\n*\s*\}/g);
        expect(validSchema).not.toContain(/\"titleMap\"\n*\s*\:\n*\s*\[\n*\s*\]/g);
    });

    it('Validate remove $schema and id properties',  () => {
        const validSchema = validateSchema(JSON_SCHEMA_ID_$SCHEMA_FAKE_DATA);
        expect(validSchema.schema.$schema).toBeUndefined();
        expect(validSchema.schema.id).toBeUndefined();
    });


    it('Validate remove inactive choices',  () => {
        const validSchema = validateSchema(JSON_SCHEMA_INACTIVE_CHOICES_FAKE_DATA);
        expect(validSchema.schema.properties.invasivespecies_urgency.enum).not.toContain('test');
    });

    it('Format schema definition location',  () => {
        const validSchema = validateSchema(JSON_SCHEMA_INVALID_DEFINITION_LOCATION_FAKE_DATA);
        expect(validSchema.schema.definition).toBeUndefined();
        expect(validSchema.definition).not.toBeUndefined();
    });

    it('Format readonly properties for field set headers',  () => {
        const validSchema = validateSchema(JSON_SCHEMA_FIELD_SETS_FAKE_DATA);
        expect(validSchema.schema.properties['fieldset__title_fieldset_title']).toMatchObject(FIELD_SET_HEADER_FAKE_DATA.fieldset__title_fieldset_title);
        expect(validSchema.schema.properties['fieldset__title_fieldset_number_title']).toMatchObject(FIELD_SET_HEADER_FAKE_DATA.fieldset__title_fieldset_number_title);
    });

    it('Format collection field headers',  () => {
        const validSchema = validateSchema(JSON_SCHEMA_COLLECTION_FIELD_FAKE_DATA);
        expect(validSchema.schema.properties['help_value_0']).toMatchObject(COLLECTION_FIELD_HEADER_FAKE_DATA.help_value_0);
    });

    it('Validate field visibility',  () => {
        const validSchema = validateSchema(JSON.stringify(jsonSchema));
        const prop = validSchema.schema.properties['string'];
        expect(validSchema.schema.properties['string'].isHidden).toBe(false);
        expect(validSchema.schema.properties['paragraph'].isHidden).toBe(false);
        expect(validSchema.schema.properties['number_no_min_max'].isHidden).toBe(false);
        expect(validSchema.schema.properties['number_with_min'].isHidden).toBe(false);
        expect(validSchema.schema.properties['number_with_max'].isHidden).toBe(false);
        expect(validSchema.schema.properties['number_with_min_and_max'].isHidden).toBe(false);
        expect(validSchema.schema.properties['single_select'].isHidden).toBe(false);
        expect(validSchema.schema.properties['single_select_choices'].isHidden).toBe(false);
        expect(validSchema.schema.properties['collection'].isHidden).toBe(false);
        expect(validSchema.schema.properties['calendar'].isHidden).toBe(false);
        expect(validSchema.schema.properties['checkbox_static_choice'].isHidden).toBe(false);
        expect(validSchema.schema.properties['checkbox_query'].isHidden).toBe(false);
    });

    it('Format required inline properties',  () => {
        const validSchema = validateSchema(JSON_SCHEMA_INLINE_REQUIRED_PROPERTIES);
        console.log('Required', validSchema.schema.required);
        expect(validSchema.schema.properties['string'].required).toBeUndefined();
        expect(validSchema.schema.properties['paragraph'].required).toBeUndefined();
        expect(validSchema.schema.properties['number_no_min_max'].required).toBeUndefined();
        expect(validSchema.schema.properties['number_with_min'].required).toBeUndefined();
        expect(validSchema.schema.properties['number_with_max'].required).toBeUndefined();
        expect(validSchema.schema.properties['number_with_min_and_max'].required).toBeUndefined();
        expect(validSchema.schema.properties['single_select'].required).toBeUndefined();
        expect(validSchema.schema.properties['single_select_choices'].required).toBeUndefined();
        expect(validSchema.schema.properties['collection'].required).toBeUndefined();
        expect(validSchema.schema.properties['collection'].items.properties['ItemConfiscated'].required).toBeUndefined();
        expect(validSchema.schema.properties['collection'].items.properties['ItemNumber'].required).toBeUndefined();
        expect(validSchema.schema.properties['calendar'].required).toBeUndefined();
        expect(validSchema.schema.properties['checkbox_static_choice'].required).toBeUndefined();
        expect(validSchema.schema.properties['checkbox_query'].required).toBeUndefined();
        expect(() => (validSchema.schema.required)).toIncludeAllMembers([
            'string',
            'paragraph',
            'number_no_min_max',
            'number_with_min',
            'number_with_max',
            'number_with_min_and_max',
            'single_select',
            'single_select_choices',
            'collection',
            'calendar',
            'checkbox_static_choice',
            'checkbox_query',
        ]);
        expect(validSchema.schema.required).toIncludeAllMembers([
            'string',
            'paragraph',
            'number_no_min_max',
            'number_with_min',
            'number_with_max',
            'number_with_min_and_max',
            'single_select',
            'single_select_choices',
            'collection',
            'calendar',
            'checkbox_static_choice',
            'checkbox_query',
        ]);
    });

    it('Validate schema validator should match expected json schema',  () => {
        const validSchema = validateSchema(JSON.stringify(jsonSchema));
        expect(validSchema).toMatchObject(expectedSchema);
    });
});

describe('JSON UI Schema generation', () => {

    it('ui schema generator should match expected ui schema',  () => {
        const validSchema = validateSchema(JSON.stringify(jsonSchema));
        const uiSchema = generateUISchema(validSchema);
        expect(uiSchema).toMatchObject(expectedUISchema);
    });
});
