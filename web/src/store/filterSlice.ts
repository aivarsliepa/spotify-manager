import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";

import { RootState } from ".";

interface FilterOptions {
  labels: {
    include: string[];
    exclude: string[];
  };
}

export interface FilterState {
  draft: FilterOptions;
  applied: FilterOptions;
}

const initialState: FilterState = {
  applied: {
    labels: {
      include: [],
      exclude: [],
    },
  },
  draft: {
    labels: {
      include: [],
      exclude: [],
    },
  },
};

export const slice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    draftIncludeLabel(state, action: PayloadAction<string>) {
      state.draft.labels.include.push(action.payload);
      state.draft.labels.exclude = state.draft.labels.exclude.filter(label => label !== action.payload);
    },
    draftExcludeLabel(state, action: PayloadAction<string>) {
      state.draft.labels.include = state.draft.labels.include.filter(label => label !== action.payload);
      state.draft.labels.exclude.push(action.payload);
    },
    draftClearLabel(state, action: PayloadAction<string>) {
      state.draft.labels.include = state.draft.labels.include.filter(label => label !== action.payload);
      state.draft.labels.exclude = state.draft.labels.exclude.filter(label => label !== action.payload);
    },
    appliedIncludeLabel(state, action: PayloadAction<string>) {
      state.applied.labels.include.push(action.payload);
      state.applied.labels.exclude = state.applied.labels.exclude.filter(label => label !== action.payload);
    },
    appliedExcludeLabel(state, action: PayloadAction<string>) {
      state.applied.labels.include = state.applied.labels.include.filter(label => label !== action.payload);
      state.applied.labels.exclude.push(action.payload);
    },
    appliedClearLabel(state, action: PayloadAction<string>) {
      state.applied.labels.include = state.applied.labels.include.filter(label => label !== action.payload);
      state.applied.labels.exclude = state.applied.labels.exclude.filter(label => label !== action.payload);
    },
    applyDraft(state) {
      state.applied.labels.include = state.draft.labels.include;
      state.applied.labels.exclude = state.draft.labels.exclude;
    },
  },
});

export const {
  appliedClearLabel,
  appliedExcludeLabel,
  appliedIncludeLabel,
  draftClearLabel,
  draftExcludeLabel,
  draftIncludeLabel,
  applyDraft,
} = slice.actions;

export const selectDraftIncludeLabelsFilter = (state: RootState) => new Set(state.filter.draft.labels.include);
export const selectDraftExcludeLabelsFilter = (state: RootState) => new Set(state.filter.draft.labels.exclude);
export const selectAppliedIncludeLabelsFilter = (state: RootState) => new Set(state.filter.applied.labels.include);
export const selectAppliedExcludeLabelsFilter = (state: RootState) => new Set(state.filter.applied.labels.exclude);

export const selectHasDraftAnyChanges = createSelector(
  [selectDraftIncludeLabelsFilter, selectDraftExcludeLabelsFilter, selectAppliedIncludeLabelsFilter, selectAppliedExcludeLabelsFilter],
  (draftInclude, draftExclude, appliedInclude, appliedExclude) => {
    if (draftInclude.size !== appliedInclude.size || draftExclude.size !== appliedExclude.size) {
      return true;
    }

    for (const label of draftInclude) {
      if (!appliedInclude.has(label)) {
        return true;
      }
    }

    for (const label of draftExclude) {
      if (!appliedExclude.has(label)) {
        return true;
      }
    }

    return false;
  }
);

export default slice.reducer;
