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

type SetAppliedFiltersPayload = {
  includeLabels: string[];
  excludeLabels: string[];
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
    setAppliedFilters(state, action: PayloadAction<SetAppliedFiltersPayload>) {
      state.applied.labels.include = action.payload.includeLabels;
      state.applied.labels.exclude = action.payload.excludeLabels;
    },
  },
});

export const { setAppliedFilters, draftClearLabel, draftExcludeLabel, draftIncludeLabel } = slice.actions;

const stringsToSet = (strings: string[]) => new Set(strings);

const selectDraftIncludeLabelsFilter = (state: RootState) => state.filter.draft.labels.include;
export const selectDraftIncludeLabelsFilterSet = createSelector([selectDraftIncludeLabelsFilter], stringsToSet);

const selectDraftExcludeLabelsFilter = (state: RootState) => state.filter.draft.labels.exclude;
export const selectDraftExcludeLabelsFilterSet = createSelector([selectDraftExcludeLabelsFilter], stringsToSet);

const selectAppliedIncludeLabelsFilter = (state: RootState) => state.filter.applied.labels.include;
export const selectAppliedIncludeLabelsFilterSet = createSelector([selectAppliedIncludeLabelsFilter], stringsToSet);

const selectAppliedExcludeLabelsFilter = (state: RootState) => state.filter.applied.labels.exclude;
export const selectAppliedExcludeLabelsFilterSet = createSelector([selectAppliedExcludeLabelsFilter], stringsToSet);

export const selectHasDraftAnyChanges = createSelector(
  [
    selectDraftIncludeLabelsFilterSet,
    selectDraftExcludeLabelsFilterSet,
    selectAppliedIncludeLabelsFilterSet,
    selectAppliedExcludeLabelsFilterSet,
  ],
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
