
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


// Interface for AuthState
interface SideBarState {
    isActive: boolean;
  }
  
  // Initial state
  const initialState: SideBarState = {
    isActive: true,
  };
// Create slice
const SideBar = createSlice({
    name: "sideBar",
    initialState,
    reducers: {
      setIsActive:(state, action: PayloadAction<boolean>) => {
        state.isActive = action.payload;
      },
    },
  });
  
  export const { setIsActive } = SideBar.actions;
  
  export default SideBar.reducer;


  