# `ls-ts`

> TypeScript wrappers for working with localStorage and sessionStorage with types in mind

Apart from wrapper functionality, there are two notable features, that allows persist data only for a given time period (`ttl`) and to bind data to a specific application version.
Usage examples below:

## Installation

```bash
yarn add ls-ts
# OR
npm install --save ls-ts
```

## Usage

There are few use cases (exports) for this library:

- `Storage` - Have a nicely typed way of working with a particular **object** in localStorage/sessionStorage.
- `LS`, `SS` - Barebones wrapper around localStorage (and sessionStorage respectively) with types.
- `AdvancedLS` - Extended version of `LS` with support for expiring data items based on tokens or time to live.

### Storage

```ts
const storage = new Storage<MyType>('someKey', LS);
storage.write({ key: 'value', answerToUltimateQuestion: 21 });
storage.update({ answerToUltimateQuestion: 42 });
const savedData = storage.read();

interface MyType {
  key: string;
  answerToUltimateQuestion: number;
}
```

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

It's a more extended version of `LS`, with support for expiring data items based tokens or time to live.

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

## Update complex data

Sometimes it may be useful to be able to update only a part of the data, without overwriting the whole object.
For this purpose, there is a `update` method. It's available for all three wrappers and `Storage` utility.

Sample usage:

```ts
import { LS } from 'ls-ts';

interface AppState {
  chosenProductId: number;
  userId: number;
  theme: 'dark' | 'light';
}
const obj: AppState = {
  chosenProductId: 123,
  userId: 12,
  theme: 'dark'
};

LS.write('appState', obj);

// later on User wants to change the theme and leave the rest of the data intact
LS.update<AppState>('appState', { theme: 'light' });

const savedData = LS.read<AppState>('appState');
/** {
 *   chosenProductId: 123,
 *   userId: 12,
 *   theme: 'light'
 * }
 */
```
