import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Interface for AuthState
interface SideBarState {
  menu: string;
  pickedTheme: string;
  primaryColor: string;
}

type Theme = {
  name: string;
  color: string;
};

// get picked theme from local storage
const theme = JSON.parse(localStorage.getItem("theme") || '{"name": "green-theme", "color": "hsl(142.1 76.2% 36.3%)"}');

// Initial state
const initialState: SideBarState = {
  menu: "",
  pickedTheme: theme.name,
  primaryColor: theme.color,
};
// Create slice
const NavBar = createSlice({
  name: "navBar",
  initialState,
  reducers: {
    setMenu: (state, action: PayloadAction<string>) => {
      state.menu = action.payload;
    },
    setHandlePickedTheme: (state, action: PayloadAction<Theme>) => {
      console.log(action.payload);
      state.pickedTheme = action.payload.name;
      state.primaryColor = action.payload.color;
      // store picked theme in local storage
      localStorage.setItem("theme", JSON.stringify(action.payload));
    },
  },
});

export const { setMenu, setHandlePickedTheme } = NavBar.actions;

export default NavBar.reducer;
