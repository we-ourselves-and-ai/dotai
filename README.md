# Dotai

Простой реактивный атомарный стейт менеджер
https://www.npmjs.com/package/@dacorm/dotai

## Features

- Реактивные микросторы
- Простое апи
- Полная типизация
- Маленький размер
- Нет лишних ререндеров

## Installation

```shell
# npm
npm i @dacorm/dotai

# yarn
yarn add @dacorm/dotai
```

## Usage

```ts
// store.ts
import { atom, useAtom, useAtomValue } from "./jotai";

const value = atom(100000);
```

```ts
// Counter.tsx
import { state } from './store.ts'

export const Counter = () => {
    const [atomValue, setAtomValue] = useAtom(value);
    const newValue = useAtomValue(value);
    
    const handleIncrement = () => {
        state.count = state.count + 1;
    }
    
    return (
        <button onClick={() => {
            const countValue = newValue + 150;

            setAtomValue(countValue);
        }}>
            count is {atomValue}
        </button>
    )
};
```

## API

### `atom`

Создает атом на основе переданного значения
Так же может считать значение нескольких атомов или принимать промис (результат вызова fetch for example)

Пример:

```ts
const value = atom(100000);
const secondValue = atom(1000);
const computedAtom = atom((get) => get(value) + get(secondValue))
```

### `useAtomValue`

Хук, возвращающий значение атома

```ts
const newValue = useAtomValue(value);
```

### `useAtom`

Специальный хелпер хук для реакта, отдающий наружу сеттер и геттер, работающий по принципу useState
Принимает на вход атом.

Пример:

```ts
const [atomValue, setAtomValue] = useAtom(value);
```
