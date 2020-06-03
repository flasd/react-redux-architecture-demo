/**
 * This should be its own NPM package!
 */
import React, { useContext, useState, ReactNode, useEffect } from 'react';
import { bindActionCreators, AnyAction, Dispatch } from 'redux';

// Types

interface Action<Payload = undefined> {
  type: string;
  payload?: Payload;
  error?: boolean;
  meta?: Object;
}

type PropType<TObj, TProp extends keyof TObj> = TObj[TProp];

interface ActionCreator {
  (...args: any[]): AnyAction;

  type: string;
}

type ActionCreatorMap = {
  [key: string]: ActionCreator;
};

type ActionCreatorNamespace = {
  [key: string]: ActionCreatorMap;
};

interface SubscriberFunction {
  (next: ActionCreatorNamespace): void;
}

type SubscriberFunctionMap = {
  [key: string]: SubscriberFunction;
};

type Registry = {
  // Subscribe to action creator updates
  subscribe: (subscriber: SubscriberFunction) => () => void;
  // Register one action creator to a namespace
  registerOne: (
    namespace: string,
    name: string,
    actionCreator: ActionCreator,
  ) => void;
  // register multiple action creators to a namespace
  registerMany: (
    namespace: string,
    aditionalActionCreators: ActionCreatorMap,
  ) => void;
  // remove one action creator from a namespace
  removeOne: (namespace: string, name: string) => void;
  // remove many action creators from a namespace
  removeMany: (namespace: string, names: Array<string>) => void;
  // get all namespaces
  getAllActionCreators: () => ActionCreatorNamespace;
  // get a single action creator from a namespace
  getActionCreator: (namespace: string, name: string) => ActionCreator;
  // get multiple action creators from a namespace
  getActionCreators: (
    namespace: string,
    names: Array<string>,
  ) => Array<ActionCreator>;
  // get a single action type from a namespace
  getActionType: (namespace: string, name: string) => string;
  // get multiple action types from a namespace
  getActionTypes: (namespace: string, names: Array<string>) => Array<string>;
  // React hook, returns a single action creator from a namespace
  useActionCreator: (
    namespace: string,
    actionCreatorName: string,
  ) => ActionCreator;
  // React hook, returns multiple action creators from a namespace
  useActionCreators: (
    namespace: string,
    actionCreatorNames: Array<string>,
  ) => Array<ActionCreator>;
  // React hook, returns a single action type from a namespace
  useActionType: (namespace: string, actionCreatorName: string) => string;
  // React hook, returns multiple action types from a namespace
  useActionTypes: (
    namespace: string,
    actionCreatorNames: Array<string>,
  ) => Array<string>;
  // Registry context
  Context: React.Context<ActionCreatorNamespace>;
};

type ProviderProps = {
  children?: ReactNode;
  registry: Registry;
};

// Functions

export const Provider: React.FC<ProviderProps> = (props) => {
  const { registry } = props;

  const [actionCreators, setActionCretators] = useState(
    registry.getAllActionCreators(),
  );

  useEffect(() => {
    return registry.subscribe(setActionCretators);
  }, [registry]);

  const { children } = props;

  return React.createElement(
    registry.Context.Provider,
    { value: actionCreators },
    children,
  );
};

export default function createRegistry(
  actionCreatorsNamespaces: ActionCreatorNamespace,
  dispatch: Dispatch<AnyAction>,
) {
  const store: ActionCreatorNamespace = {};

  Object.entries(actionCreatorsNamespaces).forEach(([key, value]) => {
    store[key] = bindActionCreators(value, dispatch);
  });

  const subscribers: SubscriberFunctionMap = {};

  function subscribe(subscriber: SubscriberFunction) {
    const key = Object.keys(subscribers).length;

    subscribers[key] = subscriber;

    return () => {
      delete subscribers[key];
    };
  }

  function updateSubscribers() {
    Object.values(subscribers).forEach((subscriber) => subscriber(store));
  }

  // Mutator Functions
  function registerOne(
    namespace: string,
    name: string,
    actionCreator: ActionCreator,
  ) {
    if (!store[namespace]) {
      store[namespace] = {};
    }
    store[namespace][name] = actionCreator;

    updateSubscribers();
  }

  function registerMany(
    namespace: string,
    aditionalActionCreators: ActionCreatorMap,
  ) {
    if (!store[namespace]) {
      store[namespace] = {};
    }

    const boundActionCreators = bindActionCreators(
      aditionalActionCreators,
      dispatch,
    );

    store[namespace] = {
      ...store[namespace],
      ...boundActionCreators,
    };

    updateSubscribers();
  }

  function removeOne(namespace: string, name: string) {
    if (store[namespace] && store[namespace][name]) {
      delete store[namespace][name];

      updateSubscribers();
    }
  }

  function removeMany(namespace: string, names: Array<string>) {
    if (store.namespace) {
      names.forEach((name) => {
        delete store[namespace][name];
      });

      updateSubscribers();
    }
  }

  // Selector Functions
  function getAllActionCreators() {
    return store;
  }

  function getActionCreator(namespace: string, name: string) {
    if (store[namespace] && store[namespace][name]) {
      return store[namespace][name];
    }

    throw new ReferenceError(
      `Action creator ${name} was not found in namespace ${namespace}`,
    );
  }

  function getActionCreators(namespace: string, names: Array<string>) {
    return names.map((name) => getActionCreator(namespace, name));
  }

  function getActionType(namespace: string, name: string) {
    return getActionCreator(namespace, name).type;
  }

  function getActionTypes(namespace: string, names: Array<string>) {
    return names
      .map((name) => getActionCreator(namespace, name))
      .map((actionCreator) => actionCreator.type);
  }

  // React Context
  const Context = React.createContext(store);

  // Hoocks
  function useActionCreator(namespace: string, name: string) {
    const currentStore = useContext(Context);

    if (currentStore[namespace] && currentStore[namespace][name]) {
      return currentStore[namespace][name];
    }

    throw new ReferenceError(
      `Action creator ${name} was not found in namespace ${namespace}`,
    );
  }

  function useActionCreators(namespace: string, names: Array<string>) {
    const currentStore = useContext(Context);

    return names.map((name) => {
      if (currentStore[namespace] && currentStore[namespace][name]) {
        return currentStore[namespace][name];
      }

      throw new ReferenceError(
        `Action creator ${name} was not found in namespace ${namespace}`,
      );
    });
  }

  function useActionType(namespace: string, name: string) {
    return useActionCreator(namespace, name).type;
  }

  function useActionTypes(namespace: string, names: Array<string>) {
    const actionCreators = useActionCreators(namespace, names);

    return actionCreators.map((actionCreator) => actionCreator.type);
  }

  // Registry Object
  const registry: Registry = {
    subscribe,
    registerOne,
    registerMany,
    removeOne,
    removeMany,
    getAllActionCreators,
    getActionCreator,
    getActionCreators,
    getActionType,
    getActionTypes,
    useActionCreator,
    useActionCreators,
    useActionType,
    useActionTypes,
    Context,
  };

  return registry;
}
