# ls-ts

> TypeScript wrappers for working with localStorage and sessionStorage with types in mind

Apart from wrapper functionality, there are two notable features, that allows persist data only for a given time period (`ttl`) and to bind data to a specific application version.
Examples in the examples below.

## Installation

```bash
yarn add ls-ts
# OR
npm install --save ls-ts
```

## Usage

### LocalStorage

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

### Session Storage

```ts
import { SS } from 'ls-ts';

const obj = {
  key: 'value',
  answerToUltimateQuestion: 42,
};

SS.write('someKey', obj);

const savedData = SS.read<MyType>('someKey');

interface MyType {
  key: string;
  answerToUltimateQuestion: number;
}
```

### Advanced

```ts
import { AdvancedLS } from 'ls-ts';

const obj = {
  key: 'value',
  answerToUltimateQuestion: 42,
};

// Persist something only for 1h
AdvancedLS.write('someKey1', obj, { ttl: 3600 });

// Persist something for particular app version
AdvancedLS.write('someKey2', obj, { cacheToken: 'v1.2.0' });

const savedData1 = AdvancedLS.read<MyType>('someKey1');

const savedData2 = AdvancedLS.read<MyType>('someKey2', { cacheToken: 'v1.2.0' });

interface MyType {
  key: string;
  answerToUltimateQuestion: number;
}
```
