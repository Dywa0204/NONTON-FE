import { ActionReducerMapBuilder, AsyncThunk } from "@reduxjs/toolkit";

export interface State {
  status: string | 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  [key: string]: any;
}

export class ReduxStatus {
  public static IDLE = 'idle'
  public static LOADING = 'loading'
  public static SUCCEEDED = 'succeeded'
  public static FAILED = 'failed'
}

const setNestedValue = (obj: any, path: string, value: any) => {
  const keys = path.split(".");
  let current = obj;

  keys.slice(0, -1).forEach((key) => {
    if (!current[key]) current[key] = {};
    current = current[key];
  });

  current[keys[keys.length - 1]] = value;
};

export const handleAsyncActions = <ReturnType, ArgType>(
  builder: ActionReducerMapBuilder<State>,
  thunk: AsyncThunk<ReturnType, ArgType, {}>,
  customField?: string
) => {
  builder
    .addCase(thunk.pending, (state) => {
      state.status = ReduxStatus.LOADING;
    })

    .addCase(thunk.fulfilled, (state, action) => {
      state.status = ReduxStatus.SUCCEEDED;

      if (customField) {
        setNestedValue(state, customField, action.payload);
      } else {
        state.data = action.payload;
      }
    })

    .addCase(thunk.rejected, (state, action) => {
      state.status = ReduxStatus.FAILED;
      state.error = action.error?.message ?? null;
    });
};
