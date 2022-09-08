import { useHistory } from "react-router-dom";
import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CancelIcon from "@material-ui/icons/Cancel";
import {
  AccordionSummary,
  Stack,
  Typography,
  Accordion,
  AccordionDetails,
  FormControlLabel,
  Checkbox,
  Button,
  Chip,
  Box,
  IconButton,
  Popper,
  Card,
} from "@material-ui/core";
import { useCallback, useMemo, useRef, useState } from "react";
import { useTheme } from "@material-ui/core/styles";
import { Label, Song } from "@aivarsliepa/shared";
import LabelIcon from "@material-ui/icons/Label";

import { createSongName } from "../../utils";
import ContentListItem from "../atoms/ContentListItem";
import ListContent from "../molecules/ListContent";
import { useGetAllLabelsQuery } from "../../store/api";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  draftClearLabel,
  draftExcludeLabel,
  draftIncludeLabel,
  selectAppliedExcludeLabelsFilterSet,
  selectAppliedIncludeLabelsFilterSet,
  selectDraftExcludeLabelsFilterSet,
  selectDraftIncludeLabelsFilterSet,
  selectHasDraftAnyChanges,
} from "../../store/filterSlice";
import { createSongsURL } from "../../router/helpers";
import { flexGrowColumnMixin } from "../atoms/styledComponents";
import { checkIds, selectCheckboxes, toggleId, uncheckAll } from "../../store/checkboxesSlice";

interface Props {
  songs: Song[];
}

// TODO: extract into multiple components
export default function SongList({ songs }: Props) {
  const history = useHistory();
  const allLabelsQuery = useGetAllLabelsQuery();
  const appliedExcludeLabels = useAppSelector(selectAppliedExcludeLabelsFilterSet);
  const appliedIncludeLabels = useAppSelector(selectAppliedIncludeLabelsFilterSet);
  const draftExcludeLabels = useAppSelector(selectDraftExcludeLabelsFilterSet);
  const draftIncludeLabels = useAppSelector(selectDraftIncludeLabelsFilterSet);
  const isDraftDifferent = useAppSelector(selectHasDraftAnyChanges);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const [shouldShowFilters, setShouldShowFilters] = useState(false);

  const checkboxes = useAppSelector(selectCheckboxes);

  const onAccordionChange = useCallback(
    (_, expanded: boolean) => {
      setShouldShowFilters(expanded);
    },
    [setShouldShowFilters]
  );

  const applyFilters = useCallback(() => {
    history.push(createSongsURL({ excludeLabels: draftExcludeLabels, includeLabels: draftIncludeLabels }));
    setShouldShowFilters(false);
  }, [history, draftExcludeLabels, draftIncludeLabels, setShouldShowFilters]);

  const labelsMap = useMemo(() => {
    const labelsMap = new Map<string, Label>();
    if (!allLabelsQuery.data) {
      return labelsMap;
    }

    for (const label of allLabelsQuery.data.labels) {
      labelsMap.set(label.id, label);
    }
    return labelsMap;
  }, [allLabelsQuery.data]);

  const labelCheckboxes = useMemo(() => {
    if (!allLabelsQuery.data) {
      return [];
    }

    return allLabelsQuery.data.labels.map(label => {
      const isLabelIncluded = draftIncludeLabels.has(label.id);
      const isLabelExcluded = draftExcludeLabels.has(label.id);

      const color = isLabelIncluded ? theme.palette.primary.main : isLabelExcluded ? theme.palette.error.main : undefined;

      return (
        <FormControlLabel
          label={<Typography sx={{ color }}>{label.name}</Typography>}
          key={label.id}
          control={
            <Checkbox
              checked={isLabelIncluded}
              indeterminate={isLabelExcluded}
              indeterminateIcon={<CancelIcon color="error" />}
              onChange={() => {
                if (isLabelExcluded) {
                  dispatch(draftClearLabel(label.id));
                } else if (isLabelIncluded) {
                  dispatch(draftExcludeLabel(label.id));
                } else {
                  dispatch(draftIncludeLabel(label.id));
                }
              }}
            />
          }
        />
      );
    });
  }, [allLabelsQuery.data, dispatch, draftExcludeLabels, draftIncludeLabels, theme.palette.error.main, theme.palette.primary.main]);

  const includeFilters = useMemo(
    () => Array.from(appliedIncludeLabels).map(labelId => <Chip key={labelId} label={labelsMap.get(labelId)?.name} color="primary" />),
    [appliedIncludeLabels, labelsMap]
  );

  const excludeFilters = useMemo(
    () => Array.from(appliedExcludeLabels).map(labelId => <Chip key={labelId} label={labelsMap.get(labelId)?.name} color="error" />),
    [appliedExcludeLabels, labelsMap]
  );

  const areAllSongsChecked = useMemo(() => {
    for (const song of songs) {
      if (!checkboxes[song.spotifyId]) {
        return false;
      }
    }
    return true;
  }, [checkboxes, songs]);

  const areNoneSongsChecked = useMemo(() => {
    for (const song of songs) {
      if (checkboxes[song.spotifyId]) {
        return false;
      }
    }
    return true;
  }, [checkboxes, songs]);

  const onMainCheckboxClick = useCallback(() => {
    if (areAllSongsChecked) {
      dispatch(uncheckAll());
    } else {
      dispatch(checkIds(songs.map(song => song.spotifyId)));
    }
  }, [dispatch, areAllSongsChecked, songs]);

  const [openPopper, setOpenPopper] = useState(false);
  const togglePopper = useCallback(() => setOpenPopper(prevState => !prevState), []);

  const labelsRef = useRef<HTMLButtonElement>(null);

  if (!allLabelsQuery.data) {
    return <div>Loading....</div>;
  }

  return (
    <ListContent>
      <Box>
        <Checkbox
          checked={areAllSongsChecked}
          indeterminate={!(areAllSongsChecked || areNoneSongsChecked)}
          onClick={onMainCheckboxClick}
          color="secondary"
        />
        {/* TODO: make it a component ?  */}

        <IconButton aria-label="modify labels for selected" onClick={togglePopper} ref={labelsRef}>
          <LabelIcon />
        </IconButton>
        {/* TODO */}
        <Popper open={openPopper} anchorEl={labelsRef.current} placement="bottom-start">
          <Card>TODO: The content of the Popper.</Card>
        </Popper>
      </Box>
      <Stack direction="row" spacing={1} sx={{ marginBottom: 1, marginX: 1 }}>
        {includeFilters} {excludeFilters}
      </Stack>

      <Accordion onChange={onAccordionChange} expanded={shouldShowFilters}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="filter-options-content">
          <Typography>Filter options</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack direction="row" spacing={1}>
            {labelCheckboxes}
          </Stack>
          {isDraftDifferent && (
            <Button color="primary" variant="contained" onClick={applyFilters}>
              Apply
            </Button>
          )}
        </AccordionDetails>
      </Accordion>

      <Box sx={{ ...flexGrowColumnMixin }}>
        <AutoSizer>
          {({ height, width }) => (
            <FixedSizeList height={height} itemCount={songs.length} itemSize={64} width={width}>
              {({ index, style }) => {
                const song = songs[index];
                return (
                  <ContentListItem
                    style={style}
                    text={createSongName(song)}
                    image={song.image}
                    key={song.spotifyId}
                    onClick={() => history.push(`/songs/${song.spotifyId}`)}
                    isChecked={checkboxes[song.spotifyId]}
                    onCheckboxClick={e => {
                      e.stopPropagation();
                      dispatch(toggleId(song.spotifyId));
                    }}
                  />
                );
              }}
            </FixedSizeList>
          )}
        </AutoSizer>
      </Box>
    </ListContent>
  );
}
