import { Dispatch, SetStateAction } from 'react';

export interface ActionProps {
  loading?: boolean;
  error?: Error;
  disableLoading?: boolean;
}

export type Optionalize<T extends K, K> = Omit<T, keyof K>;

export interface StoreOptions {
  disableLoading?: boolean;
}

export type Store<W> = {
  [T in keyof W]: W[T] extends Function ? W[T] & ActionProps: W[T];
}

type NonFunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? never : K }[keyof T];

export type State<T> = Pick<T, NonFunctionPropertyNames<T>>;

export type EqualityFn<M> = (preState: State<M>, newState: State<M>) => boolean

export interface Queue<S> {
  preState: S;
  setState: Dispatch<SetStateAction<S>>;
  equalityFn?: EqualityFn<S>;
}

export interface Ctx {
  action: {
    name: string;
    arguments: any[];
  };
  store: {
    namespace: string;
    getState: () => object;
  };
}

export interface Middleware {
  (ctx: Ctx, next: Promise<any>): any;
}

export interface ComposeFunc extends ActionProps {
  (): Promise<any>;
}
