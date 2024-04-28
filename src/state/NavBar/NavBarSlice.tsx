import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Interface for AuthState
interface SideBarState {
  menu: string;
  pickedTheme: string;
}

// Initial state
const initialState: SideBarState = {
  menu: "",
  pickedTheme: "green-theme",
};
// Create slice
const NavBar = createSlice({
  name: "navBar",
  initialState,
  reducers: {
    setMenu: (state, action: PayloadAction<string>) => {
      state.menu = action.payload;
    },
    setHandlePickedTheme: (state, action: PayloadAction<string>) => {
      state.pickedTheme = action.payload;
    },
  },
});

export const { setMenu, setHandlePickedTheme } = NavBar.actions;

export default NavBar.reducer;
