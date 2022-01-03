# ls-ts

> TypeScript wrappers for working with localStorage and sessionStorage with types in mind

## Installation

```bash
yarn add ls-ts
# OR
npm install --save ls-ts
```

## Usage

```ts
import { LS } from 'ls-ts';

const obj = {
  key: 'value',
  answerToUltimateQuestion: 42,
};

LS.write('someKey', obj);

const savedData = LS.read<MyType>('someKey');

interface MyType {
  key: string;
  answerToUltimateQuestion: number;
}
```
