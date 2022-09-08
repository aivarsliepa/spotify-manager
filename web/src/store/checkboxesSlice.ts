import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from ".";

export interface CheckboxState {
  checkedIds: Record<string, boolean>;
}

const initialState: CheckboxState = {
  checkedIds: {},
};

export const slice = createSlice({
  name: "checkboxes",
  initialState,
  reducers: {
    toggleId(state, action: PayloadAction<string>) {
      state.checkedIds[action.payload] = !state.checkedIds[action.payload];
    },
    uncheckAll(state) {
      state.checkedIds = {};
    },
    checkIds(state, action: PayloadAction<string[]>) {
      for (const id of action.payload) {
        state.checkedIds[id] = true;
      }
    },
  },
});

export const { toggleId, uncheckAll, checkIds } = slice.actions;

export const selectCheckboxes = (state: RootState) => state.checkboxes.checkedIds;
export default slice.reducer;
