import React, { Component } from "react";

import { Song } from "../store/songs/types";
import LabelBadge from "./LabelBadge";
import * as api from "../api";

interface Props {
  song: Song;
}

interface State {
  newLabel: string;
}

// TODO: FC component
class SongLabels extends Component<Props, State> {
  state = {
    newLabel: "",
  };

  render() {
    const labels = this.props.song.labels.map(label => <LabelBadge labelName={label} key={label} />);
    return (
      <div>
        {labels}
        <form onSubmit={this.submitNewLabel}>
          <input value={this.state.newLabel} onChange={this.onNewLabelChange} />
        </form>
      </div>
    );
  }

  private onNewLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newLabel: event.target.value });
  };

  private submitNewLabel = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { labels, spotifyId } = this.props.song;
    const request = api.changeLabels(spotifyId, [...labels, this.state.newLabel]);
    this.setState({ newLabel: "" });
    await request;
    // TODO: error handling
  };
}

export default SongLabels;
