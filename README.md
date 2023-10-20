# React Native JSONForms Formatter

A [React Native](https://reactnative.dev/) [JSON Schema](https://json-schema.org/) formatter to build mobile forms based on [JSON Forms](https://jsonforms.io/)

An alternativive to render JTD schemas in JSON Forms. Some JSON Schema libraries do not support JTD (JSON Type Definition). React Native JSON Forms Formatter validates JSON Schemas and generates a UI schema. This formatter will validate and generate json schemas/ui schemas compatible with [JSON Forms library](https://github.com/eclipsesource/jsonforms)

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