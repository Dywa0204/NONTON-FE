import { Utils } from "@models/index";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: Utils.Sidebar.SidebarState = {
  isOpen: localStorage.getItem("sidebar")
    ? localStorage.getItem("sidebar") === "open"
    : true,
  menuState: {
    expandedKeys: [],
  },
};

const sidebarSlice = createSlice({
  name: "utils/sidebar",
  initialState,
  reducers: {
    setOpenSidebar(state, action: PayloadAction<boolean>) {
      state.isOpen = action.payload;
      localStorage.setItem("sidebar", action.payload ? "open" : "closed");
    },
    toggleMenu(state, action: PayloadAction<string>) {
      const key = action.payload;
      if (state.menuState.expandedKeys.includes(key)) {
        state.menuState.expandedKeys = state.menuState.expandedKeys.filter(
          (k) => k !== key
        );
      } else {
        state.menuState.expandedKeys.push(key);
      }
    },
    setMenuExpanded(
      state,
      action: PayloadAction<{ key: string; expanded: boolean }>
    ) {
      const { key, expanded } = action.payload;
      if (expanded && !state.menuState.expandedKeys.includes(key)) {
        state.menuState.expandedKeys.push(key);
      } else if (!expanded) {
        state.menuState.expandedKeys = state.menuState.expandedKeys.filter(
          (k) => k !== key
        );
      }
    },
  },
});

export const { setOpenSidebar, toggleMenu, setMenuExpanded } =
  sidebarSlice.actions;

export default sidebarSlice.reducer;
