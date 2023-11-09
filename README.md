# React Native JSONForms Formatter

A [React Native](https://reactnative.dev/) [JSON Schema](https://json-schema.org/) formatter to build mobile forms based on [JSON Forms](https://jsonforms.io/)

React Native JSON Forms Formatter is an alternative solution for rendering JTD schemas in JSON Forms. It validates JSON Schemas and generates UI schemas compatible with the [JSON Forms library](https://github.com/eclipsesource/jsonforms), even for schemas that are not supported by other JSON Schema libraries.

## Installing the library

#### Using `yarn`

```
yarn add react-native-jsonforms-formatter
```

#### Using `npm`

```
npm install --save react-native-jsonforms-formatter
```

## How to use it?

```javascript
import { validateJSONSchema, generateUISchema } 'react-native-jsonforms-formatter';
```

First, your json schema needs to be validated and formatted in order to make it parsable and valid for JSON Forms library. The library will generate a valid UI schema for input into JSON Forms to be used in a `JsonForms` component.

```javascript
const jsonSchema = validateJSONSchema(stringSchema);
const uiSchema = generateJSONUISchema(jsonSchema);

<JsonForms
  schema={jsonSchema}
  uischema={uiSchema}
  data={data}
  renderers={RNRenderers}
  cells={RNCells}
/>
```

## Licensing
A copy of the license is available in the repository's [LICENSE](LICENSE) file.