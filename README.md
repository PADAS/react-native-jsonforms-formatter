# React Native JSONForms Formatter
![Build Status][ci-url]

[ci-url]: https://github.com/PADAS/react-native-jsonforms-formatter/actions/workflows/npm-build.yml/badge.svg

A Node.js library for validating JSONSchema and generating UISchema for a custom ReactNative JSONForms element.

## Installation

You can install the library using npm or yarn:

#### Using `yarn`

```
yarn add react-native-jsonforms-formatter
```

#### Using `npm`

```
npm install --save react-native-jsonforms-formatter
```

## Usage
The library provides two main functions: `validateJSONSchema` and `generateUISchema`.

### Validating JSONSchema

You can use the `validateJSONSchema` function to validate a JSONSchema string:

```typescript
import { validateJSONSchema } from 'react-native-jsonforms-formatter';

const stringSchema = `
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "title": "Name"
    },
    "age": {
      "type": "integer",
      "title": "Age"
    }
  }
}
`;

const jsonSchema = validateJSONSchema(stringSchema);  
```

The `validateJSONSchema` function returns a valid JSONSchema object if the input string is a valid JSONSchema. If the input is not valid, it will throw an error.

### Generating UISchema
You can use the `generateUISchema` function to generate a UISchema object from a valid JSONSchema:

```typescript
import { generateUISchema } from 'react-native-jsonforms-formatter';

const uiSchema = generateUISchema(jsonSchema);
```

The `generateUISchema` function returns a `UISchema` object that can be used with the ReactNative JSONForms library.

## Putting it all together
Here's an example of how you can use the library in a ReactNative application:

```typescript
import React from 'react';
import { JsonForms } from '@jsonforms/react-native';
import { validateJSONSchema, generateUISchema } from 'react-native-jsonforms-formatter';
import { RNRenderers, RNCells } from '@jsonforms/react-native-renderers';

const stringSchema = `
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "title": "Name"
    },
    "age": {
      "type": "integer",
      "title": "Age"
    }
  }
}
`;

const jsonSchema = validateJSONSchema(stringSchema);
const uiSchema = generateUISchema(jsonSchema);

const App = () => {
  const [data, setData] = React.useState({ name: 'John Doe', age: 30 });

  return (
    <JsonForms
      schema={jsonSchema}
      uischema={uiSchema}
      data={data}
      renderers={RNRenderers}
      cells={RNCells}
      onChange={(event) => setData(event.data)}
    />
  );
};

export default App;
```

## Contributors
Contributions are welcome! If you find a bug or have a feature request, please open an issue.

<a href="https://github.com/PADAS/react-native-jsonforms-formatter/graphs/contributors">
  <img src="https://contributors-img.web.app/image?repo=PADAS/react-native-jsonforms-formatter" />
</a>

## Licensing
A copy of the license is available in the repository's [LICENSE](LICENSE) file.
