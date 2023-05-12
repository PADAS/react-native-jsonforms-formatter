# React Native JSONForms formatter

A simple [React Native](https://reactnative.dev/) [JSON Schema](https://json-schema.org/) formatter to build mobile forms based on [JSON Forms](https://jsonforms.io/)

An alternative to render JTD schemas in JSON Forms. Some JSON Schema libraries does not support JTD (JSON Type Definition). React Native JSON Forms Formatter validates JSON Schema and generates UI schema. This formatter will validate an generate json schemas/ui schemas compatible with [JSON Forms library](https://github.com/eclipsesource/jsonforms)



## Installing the library

#### Using `yarn`

```
yarn add react-native-jsonforms-formatter
```

#### Using `npm

```
npm install --save react-native-jsonforms-formatter
```

## How to use it?

`import { validateJSONSchema, generateUISchema } 'react-native-jsonforms-formatter';`


First, json schema needs to be validated and formatted in order to make it parsable and valid for JSON Forms library. Then we will generate UI schema for JSON Forms. Finally use them in `JsonForms` component.

```
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