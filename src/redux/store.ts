import { combineReducers, configureStore } from "@reduxjs/toolkit";

/* === UTILS === */
import sidebarReducer from "./slices/utils/sidebar/sidebarSlice";

const rootReducer = combineReducers({
    
    utils: combineReducers({
        sidebar: sidebarReducer,
    }),
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

// Type definitions
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
