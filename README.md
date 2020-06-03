# React Redux Architecture

## Motivation

The idea of this architecture is to separate business logic, UI logic and UI rendering. The idea is to never have to compose HOCs (connect + withHooks for example) and never have business logic inside the withHooks HOC. All business logic will live inside sagas and reducers, which are by nature easy to test.

## Folder Structure

```tsx
src/
	components/ // react components
	services/ // stuff like history, Apollo Client, Firebase, Axios, etc...
	screens/ // route/screen components
		SomeScreen/
			index.ts // container, with a function useHooksAsProps() {} and a decorator
			SomeScreen.tsx // dumb React component
	store/ // redux + business logic
		index.ts // redux store
		rootSaga.ts // self explanatory
		actionCreators.ts // action creator registry
		modules/
			aModule/
				index.ts // reducer, action creators
				selectors.ts // selectors
				someSaga.ts // sagas
```

## Naming Patterns

### Components

A component is the sum of a Container (`index.ts` file), a view file (`ComponentName.tsx` file) inside a folder with the same name as the view file. The view file name and the folder name should be in PascalCase.

### Screens

Follows the Components convention. If used in the browser, the view file name should be a PascalCase version of the URL path the component represents. On React Native the view name can be the most appropriate name given its job.

### Services

A service is one or more files containing infrastructure logic (logic required by your business logic to work, for example Axios) inside a folder. The folder must have a `index.ts` file where all "public" exports will be declared. The folder name should be a lowercase string containing the name of the service, for example: `axios` or `graphql`.

### Store

The store folder contains the Redux store `index.ts`, a Root Saga `rootSaga.ts` (entry point for Redux-Saga) and a Action Creators Registry `actionCreators.ts` (declarion point for React Redux Action Creator Registry). This files should be named as written above.

### Redux Modules

A redux module is the sum of a `index.ts` file where you declare the reducer and actions, a `selectors.ts` where you declare selectors, and one file for each saga, named with the side effect name in camelCase ending with the word Effect (for example `getTodoEffect.ts`. It should be a sub-folder with the name of the module inside the `store/modules` folder.
