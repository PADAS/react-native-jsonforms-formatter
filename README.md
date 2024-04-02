# React Native JSONForms Formatter
![Build Status][ci-url]

[ci-url]: https://github.com/PADAS/react-native-jsonforms-formatter/actions/workflows/npm-build.yml/badge.svg

A [React Native](https://reactnative.dev/) [JSON Schema](https://json-schema.org/) formatter to build mobile forms based on [JSON Forms](https://jsonforms.io/)

React Native JSON Forms Formatter is an alternative solution for rendering JTD schemas in JSON Forms. It validates JSON Schemas and generates UI schemas compatible with the [JSON Forms library](https://github.com/eclipsesource/jsonforms), even for schemas that are not supported by other JSON Schema libraries.

## Install

#### Using `yarn`

```
yarn add react-native-jsonforms-formatter
```

#### Using `npm`

```
npm install --save react-native-jsonforms-formatter
```

## Usage

```javascript
import { validateJSONSchema, generateUISchema } 'react-native-jsonforms-formatter';
```

Your json schema needs to be validated and formatted in order to make it parsable and valid for JSON Forms library. The library will generate a valid UI schema for input into JSON Forms to be used in a `JsonForms` component.

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

## Contributors
<a href="https://github.com/PADAS/react-native-jsonforms-formatter/graphs/contributors">
  <img src="https://contributors-img.web.app/image?repo=PADAS/react-native-jsonforms-formatter" />
</a>

## Licensing
A copy of the license is available in the repository's [LICENSE](LICENSE) file.
