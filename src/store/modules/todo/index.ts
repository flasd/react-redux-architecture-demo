import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from '@reduxjs/toolkit';

const todoAdapter = createEntityAdapter({
  selectId: (entity: Todo) => entity.id,
});

const adapterInitialState = todoAdapter.getInitialState();

export type Todo = {
  id: number | string;
  done: boolean;
  title: string;
};

type TodoState = typeof adapterInitialState & {
  inSync: boolean;
  error: Error | null;
  editor: string;
  editorId?: number | string;
};

export interface FetchSuccededPayload {
  todos: Todo[];
}

export interface FetchFailedPayload {
  error: Error;
}

export interface EditTodoPayload {
  todo: Todo;
}

interface SetInSyncPayload {
  inSync: boolean;
}

interface SetEditorTextPayload {
  text: string;
}

const initialState: TodoState = todoAdapter.getInitialState({
  inSync: true,
  error: null,
  editor: '',
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    fetch(state) {
      state.inSync = true;
    },

    fetchSucceded(state, action: PayloadAction<FetchSuccededPayload>) {
      state.inSync = false;
    },

    fetchFailed: {
      reducer(state, action: PayloadAction<FetchFailedPayload>) {
        state.inSync = false;
        state.error = action.payload.error;
      },
      prepare(payload: FetchFailedPayload) {
        return {
          payload,
          error: true,
        };
      },
    },

    setError: {
      reducer(state, action: PayloadAction<FetchFailedPayload>) {
        state.error = action.payload.error;
      },
      prepare(payload: FetchFailedPayload) {
        return {
          payload,
          error: true,
        };
      },
    },

    setInSync(state, action: PayloadAction<SetInSyncPayload>) {
      state.inSync = action.payload.inSync;
    },

    addTodo: todoAdapter.addOne,
    updateTodo: {
      reducer: todoAdapter.updateOne,
      prepare(payload, meta) {
        return {
          payload,
          meta,
        };
      },
    },

    removeTodo: todoAdapter.removeOne,

    editTodo(state, action: PayloadAction<EditTodoPayload>) {
      state.editor = action.payload.todo.title;
      state.editorId = action.payload.todo.id;
    },

    setEditorText(state, action: PayloadAction<SetEditorTextPayload>) {
      state.editor = action.payload.text;
    },
  },
});

export default authSlice.reducer;
export const TODO_REDUCER_KEY = 'todo';

const { actions } = authSlice;
export { actions };

export const _adapterSelectors = todoAdapter.getSelectors(
  (state: any) => state[TODO_REDUCER_KEY],
);
