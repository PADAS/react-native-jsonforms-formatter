// Internal Dependencies
import {
  COLLECTION_FIELD_HEADER_FAKE_DATA,
  FIELD_SET_HEADER_FAKE_DATA,
  JSON_SCHEMA_COLLECTION_FIELD_FAKE_DATA,
  JSON_SCHEMA_COMMA_DECIMAL_NUMBERS,
  JSON_SCHEMA_DATE_TIME_FIELD_SETS,
  JSON_SCHEMA_DEFAULT_VALUES,
  JSON_SCHEMA_DUPLICATED_CHOICES_SINGLE_SELECT_FAKE_DATA,
  JSON_SCHEMA_DUPLICATED_REQUIRED_PROPERTIES_FAKE_DATA,
  JSON_SCHEMA_EDGE_CASE_NUMBERS,
  JSON_SCHEMA_EMPTY_CHOICES_FAKE_DATA,
  JSON_SCHEMA_FIELD_SET_WITH_CHECKBOX,
  JSON_SCHEMA_FIELD_SETS_FAKE_DATA,
  JSON_SCHEMA_ID_$SCHEMA_FAKE_DATA,
  JSON_SCHEMA_INACTIVE_CHOICES_FAKE_DATA,
  JSON_SCHEMA_INACTIVE_FIELD_SET_TITLE_MAP_FAKE_DATA,
  JSON_SCHEMA_INACTIVE_TITLE_MAP_FAKE_DATA,
  JSON_SCHEMA_INLINE_REQUIRED_PROPERTIES,
  JSON_SCHEMA_INVALID_DEFINITION_LOCATION_FAKE_DATA,
  JSON_SCHEMA_INVALID_DOUBLE_QUOTES_FAKE_DATA,
  JSON_SCHEMA_SPECIAL_CHARS_FAKE_DATA,
  UI_SCHEMA_ELEMENT_DATE_TIME_FIELD_SETS,
} from "../common/mockData/formatterMockData"
import expectedSchema from "../common/mockData/jsonSchemaExpectedMock.json";
import jsonSchemaFieldSets from "../common/mockData/jsonSchemaFielSetMock.json";
import jsonSchema from "../common/mockData/jsonSchemaMock.json";
import expectedUISchema from "../common/mockData/uiSchemaExpectedMock.json";
import expectedFieldSetUISchema from "../common/mockData/uiSchemaFielSetExpectedMock.json";
import expectedFieldSetWithCheckboxUISchema from "../common/mockData/uiSchemaFieldSetWithCheckboxExpectedMock.json";
import expectedFieldSetWithCheckboxJSONSchema from "../common/mockData/jsonSchemaFieldSetWithCheckboxExpectedMock.json";
import { generateUISchema } from "../src/v1/generateUISchema";
import { validateJSONSchema } from "../src/v1/validateJsonSchema";
import { normalizeDecimalSeparators } from "../src/v1/utils/utils";

describe("JSON Schema validation", () => {
  it("Special chars should throw an exception", () => {
    expect(() => {
      validateJSONSchema(JSON_SCHEMA_SPECIAL_CHARS_FAKE_DATA);
    }).toThrowError("Special characters not supported in JSON Schema");
  });

  it("Validate invalid double quotes", () => {
    expect(validateJSONSchema(JSON_SCHEMA_INVALID_DOUBLE_QUOTES_FAKE_DATA).toString).not.toContain(/([“”])/g);
  });

  it("Validate empty choices", () => {
    const validSchema = validateJSONSchema(JSON_SCHEMA_EMPTY_CHOICES_FAKE_DATA).toString;
    expect(validSchema).not.toContain(/"enum"\n*\s*:\n*\s*\[\n*\s*\]/g);
    expect(validSchema).not.toContain(/"enumNames"\n*\s*:\n*\s*\{\n*\s*\}/g);
    expect(validSchema).not.toContain(/"titleMap"\n*\s*:\n*\s*\[\n*\s*\]/g);
  });

  it("Validate remove $schema and id properties", () => {
    const validSchema = validateJSONSchema(JSON_SCHEMA_ID_$SCHEMA_FAKE_DATA);
    expect(validSchema.schema.$schema).toBeUndefined();
    expect(validSchema.schema.id).toBeUndefined();
  });

  it("Validate field default values", () => {
    const validSchema = validateJSONSchema(JSON_SCHEMA_DEFAULT_VALUES);
    expect(validSchema.schema.properties.test_one_date.default).toBe("2023-08-14 15:15");
    expect(validSchema.schema.properties.test_two_string.default).toBe("Test 2");
    expect(validSchema.schema.properties.test_three_number.default).toBe(25);
    expect(validSchema.schema.properties.test_four_number.default).toBe(6);
    expect(validSchema.schema.properties.test_five_enumString.default).toBe("behavior1");
    expect(validSchema.schema.properties.test_six_enum_dictionary.default).toBe("testone");
    expect(validSchema.schema.properties.testseven.default).toMatchObject(["testseventhree"]);
    expect(validSchema.schema.properties.test_eight_checkbox_query.default).toMatchObject([
      "9b5cb19e-b7bd-4fa8-9263-8e34502e35ca",
    ]);
    expect(validSchema.schema.properties.test_nine_dropdown_query.default).toBe("9b5cb19e-b7bd-4fa8-9263-8e34502e35ca");
    expect(validSchema.schema.properties.testElevenArrayTest.default).toMatchObject([
      {
        "test_array_number": 1,
        "test_array_string": "string",
      },
    ]);
    expect(validSchema.schema.properties.test_fourteen_textarea.default).toBe("Test 14");
  });

  it("Validate remove inactive enum choices", () => {
    const validSchema = validateJSONSchema(JSON_SCHEMA_INACTIVE_CHOICES_FAKE_DATA);
    expect(validSchema.schema.properties.invasivespecies_urgency.enum).not.toContain("test");
  });

  it("Validate remove disabled titleMap choices", () => {
    const validSchema = validateJSONSchema(JSON_SCHEMA_INACTIVE_TITLE_MAP_FAKE_DATA);
    expect(validSchema.schema.properties.behavior.items.enum).not.toContain("phot_evidence_collected");
  });

  it("Validate remove disabled fieldset titleMap choices", () => {
    const validSchema = validateJSONSchema(JSON_SCHEMA_INACTIVE_FIELD_SET_TITLE_MAP_FAKE_DATA);
    expect(validSchema.schema.properties.reportorigin.items.enum).not.toContain("phot_evidence_collected");
  });

  it('Validate duplicated items in single select',  () => {
    expect(() => validateJSONSchema(JSON_SCHEMA_DUPLICATED_CHOICES_SINGLE_SELECT_FAKE_DATA)).toThrow('Duplicated enum items');
  });

  it('Validate duplicated required properties',  () => {
    expect(() => validateJSONSchema(JSON_SCHEMA_DUPLICATED_REQUIRED_PROPERTIES_FAKE_DATA)).toThrow('Duplicated required properties');
  });

  it("Format schema definition location", () => {
    const validSchema = validateJSONSchema(JSON_SCHEMA_INVALID_DEFINITION_LOCATION_FAKE_DATA);
    expect(validSchema.schema.definition).toBeUndefined();
    expect(validSchema.definition).not.toBeUndefined();
  });

  it("Format readonly properties for field set headers", () => {
    const validSchema = validateJSONSchema(JSON_SCHEMA_FIELD_SETS_FAKE_DATA);
    expect(validSchema.schema.properties["fieldset__title_fieldset_title"]).toMatchObject(
      FIELD_SET_HEADER_FAKE_DATA.fieldset__title_fieldset_title,
    );
    expect(validSchema.schema.properties["fieldset__title_fieldset_number_title"]).toMatchObject(
      FIELD_SET_HEADER_FAKE_DATA.fieldset__title_fieldset_number_title,
    );
  });

  it("Formats checkbox inside a field set", () => {
    const validSchema = validateJSONSchema(JSON_SCHEMA_FIELD_SET_WITH_CHECKBOX);

    expect(validSchema).toMatchObject(expectedFieldSetWithCheckboxJSONSchema);
  });

  it("Format collection field headers", () => {
    const validSchema = validateJSONSchema(JSON_SCHEMA_COLLECTION_FIELD_FAKE_DATA);
    expect(validSchema.schema.properties["help_value_0"]).toMatchObject(COLLECTION_FIELD_HEADER_FAKE_DATA.help_value_0);
  });

  it("Validate field visibility", () => {
    const validSchema = validateJSONSchema(JSON.stringify(jsonSchema));
    expect(validSchema.schema.properties["string"].isHidden).toBe(false);
    expect(validSchema.schema.properties["paragraph"].isHidden).toBe(false);
    expect(validSchema.schema.properties["number_no_min_max"].isHidden).toBe(false);
    expect(validSchema.schema.properties["number_with_min"].isHidden).toBe(false);
    expect(validSchema.schema.properties["number_with_max"].isHidden).toBe(false);
    expect(validSchema.schema.properties["number_with_min_and_max"].isHidden).toBe(false);
    expect(validSchema.schema.properties["single_select"].isHidden).toBe(false);
    expect(validSchema.schema.properties["single_select_choices"].isHidden).toBe(false);
    expect(validSchema.schema.properties["collection"].isHidden).toBe(false);
    expect(validSchema.schema.properties["calendar"].isHidden).toBe(false);
    expect(validSchema.schema.properties["checkbox_static_choice"].isHidden).toBe(false);
    expect(validSchema.schema.properties["checkbox_query"].isHidden).toBe(false);
  });

  it("Format required inline properties", () => {
    const validSchema = validateJSONSchema(JSON_SCHEMA_INLINE_REQUIRED_PROPERTIES);
    expect(validSchema.schema.properties["string"].required).toBeUndefined();
    expect(validSchema.schema.properties["paragraph"].required).toBeUndefined();
    expect(validSchema.schema.properties["number_no_min_max"].required).toBeUndefined();
    expect(validSchema.schema.properties["number_with_min"].required).toBeUndefined();
    expect(validSchema.schema.properties["number_with_max"].required).toBeUndefined();
    expect(validSchema.schema.properties["number_with_min_and_max"].required).toBeUndefined();
    expect(validSchema.schema.properties["single_select"].required).toBeUndefined();
    expect(validSchema.schema.properties["single_select_choices"].required).toBeUndefined();
    expect(validSchema.schema.properties["collection"].required).toBeUndefined();
    expect(validSchema.schema.properties["collection"].items.properties["ItemConfiscated"].required).toBeUndefined();
    expect(validSchema.schema.properties["collection"].items.properties["ItemNumber"].required).toBeUndefined();
    expect(validSchema.schema.properties["calendar"].required).toBeUndefined();
    expect(validSchema.schema.properties["checkbox_static_choice"].required).toBeUndefined();
    expect(validSchema.schema.properties["checkbox_query"].required).toBeUndefined();
    // @ts-ignore
    expect(validSchema.schema.required).toIncludeAllMembers([
      "string",
      "paragraph",
      "number_no_min_max",
      "number_with_min",
      "number_with_max",
      "number_with_min_and_max",
      "single_select",
      "single_select_choices",
      "collection",
      "calendar",
      "checkbox_static_choice",
      "checkbox_query",
    ]);
  });

  it("Validate schema validator should match expected json schema", () => {
    const validSchema = validateJSONSchema(JSON.stringify(jsonSchema));
    expect(validSchema).toMatchObject(expectedSchema);
  });

  it("Validate comma decimal separators are converted to periods", () => {
    const validSchema = validateJSONSchema(JSON_SCHEMA_COMMA_DECIMAL_NUMBERS);
    
    // Check that comma decimals are converted to periods
    expect(validSchema.schema.properties.price_with_comma.default).toBe("12.99");
    expect(validSchema.schema.properties.price_with_comma.minimum).toBe("5.50");
    expect(validSchema.schema.properties.price_with_comma.maximum).toBe("100.00");
    
    // Check negative numbers
    expect(validSchema.schema.properties.negative_number.default).toBe("-15.75");
    
    // Check that regular numbers are unchanged
    expect(validSchema.schema.properties.regular_number.default).toBe(25.50);
    expect(validSchema.schema.properties.regular_number.minimum).toBe(0.01);
    
    // Check that string fields are not affected
    expect(validSchema.schema.properties.string_field.default).toBe("12,99 text");
  });

  it("Validates edge cases for decimal separator conversion", () => {
    const validSchema = validateJSONSchema(JSON_SCHEMA_EDGE_CASE_NUMBERS);
    
    // Should NOT convert numbers with thousands separators (European format: 1.234,56)
    expect(validSchema.schema.properties.thousands_separator.default).toBe("1.234,56");
    
    // Should NOT convert numbers with multiple commas (thousands: 1,234,567)
    expect(validSchema.schema.properties.multiple_commas.default).toBe("1,234,567");
    
    // Should leave empty defaults unchanged
    expect(validSchema.schema.properties.empty_default.default).toBe("");
    
    // Should leave null defaults unchanged
    expect(validSchema.schema.properties.null_default.default).toBe(null);
    
    // Should convert simple comma decimal (0,00 -> 0.00)
    expect(validSchema.schema.properties.zero_comma.default).toBe("0.00");
  });
});

describe("Decimal separator normalization", () => {
  it("Converts comma decimal separators to periods", () => {
    expect(normalizeDecimalSeparators("12,99")).toBe("12.99");
    expect(normalizeDecimalSeparators("-15,75")).toBe("-15.75");
    expect(normalizeDecimalSeparators("0,01")).toBe("0.01");
    expect(normalizeDecimalSeparators("1000,50")).toBe("1000.50");
  });

  it("Leaves period decimal separators unchanged", () => {
    expect(normalizeDecimalSeparators("12.99")).toBe("12.99");
    expect(normalizeDecimalSeparators("-15.75")).toBe("-15.75");
    expect(normalizeDecimalSeparators("0.01")).toBe("0.01");
  });

  it("Leaves numbers unchanged", () => {
    expect(normalizeDecimalSeparators(12.99)).toBe(12.99);
    expect(normalizeDecimalSeparators(-15.75)).toBe(-15.75);
    expect(normalizeDecimalSeparators(0)).toBe(0);
  });

  it("Does not affect strings that are not decimal numbers", () => {
    expect(normalizeDecimalSeparators("12,99 text")).toBe("12,99 text");
    expect(normalizeDecimalSeparators("text 12,99")).toBe("text 12,99");
    expect(normalizeDecimalSeparators("12,99,00")).toBe("12,99,00"); // Multiple commas
    expect(normalizeDecimalSeparators("abc")).toBe("abc");
    expect(normalizeDecimalSeparators("")).toBe("");
    expect(normalizeDecimalSeparators(" ")).toBe(" ");
  });

  it("Handles edge cases properly", () => {
    expect(normalizeDecimalSeparators(null)).toBe(null);
    expect(normalizeDecimalSeparators(undefined)).toBe(undefined);
    expect(normalizeDecimalSeparators("   12,99   ")).toBe("12.99"); // Trims whitespace
    expect(normalizeDecimalSeparators("12,")).toBe("12,"); // No digits after comma
    expect(normalizeDecimalSeparators(",99")).toBe(",99"); // No digits before comma
  });
});

describe("JSON UI Schema generation", () => {
  it("Generate UI Schema for all renderers", () => {
    const validSchema = validateJSONSchema(JSON.stringify(jsonSchema));
    const uiSchema = generateUISchema(validSchema);
    expect(uiSchema).toMatchObject(expectedUISchema);
  });

    it('Validate UI schema date-time fieldset property',  () => {
      const validSchema = validateJSONSchema(JSON_SCHEMA_DATE_TIME_FIELD_SETS);
      const uiSchema = generateUISchema(validSchema);
      expect(uiSchema.elements[0]).toMatchObject(UI_SCHEMA_ELEMENT_DATE_TIME_FIELD_SETS)
    });

  it("Generate UI Schema for field sets", () => {
    const validSchema = validateJSONSchema(JSON.stringify(jsonSchemaFieldSets));
    const uiSchema = generateUISchema(validSchema);
    expect(uiSchema).toMatchObject(expectedFieldSetUISchema);
  });

  it('Generates UI Schema for field set with checkbox inside', () => {
    const validSchema = validateJSONSchema(JSON_SCHEMA_FIELD_SET_WITH_CHECKBOX);
    const uiSchema = generateUISchema(validSchema);

    expect(uiSchema).toMatchObject(expectedFieldSetWithCheckboxUISchema);
  });
});
