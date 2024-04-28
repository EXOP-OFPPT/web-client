import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Interface for AuthState
interface SideBarState {
  menu: string;
}

// Initial state
const initialState: SideBarState = {
  menu: "",
};
// Create slice
const NavBar = createSlice({
  name: "navBar",
  initialState,
  reducers: {
    setMenu: (state, action: PayloadAction<string>) => {
      state.menu = action.payload;
    },
  },
});

export const { setMenu } = NavBar.actions;

export default NavBar.reducer;
