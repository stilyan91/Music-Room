import React, { Component } from 'react';
import { withNavigate } from '../../utilities/withNavigate';  // Ensure correct import path
import { withParams } from '../../utilities/withParams';  // Ensure correct import path
import { Grid, Button, Typography } from '@material-ui/core';

import CreateRoomPage from './CreateRoomPage';

class Room extends Component {
    constructor(props) {
        super(props);
        this.state = {
            votesToSkip: 2,
            guestCanPause: false,
            isHost: false,
            showSettings: false,
            spotifyAuthenticated: false,
        };
        this.roomCode = this.props.params.roomCode;  // Access params from props
        this.leaveButtonPressed = this.leaveButtonPressed.bind(this);
        this.updateShowSettings = this.updateShowSettings.bind(this);
        this.renderSettingsButton = this.renderSettingsButton.bind(this);
        this.renderSettings = this.renderSettings.bind(this);
        this.getRoomDetails = this.getRoomDetails.bind(this);
        this.getRoomDetails();
        this.authenticatedSpotify = this.authenticatedSpotify.bind(this);
    }

    getRoomDetails() {
        fetch('/api/get-room' + '?code=' + this.roomCode)
            .then((response) => {
                if (!response.ok) {
                    this.props.leaveRoomCallback();
                    this.props.navigate('/');
                }
                return response.json()
            }
            ).then((data) => {
                this.setState({
                    votesToSkip: data.votes_to_skip,
                    guestCanPause: data.guest_can_pause,
                    isHost: data.is_host,
                });
                if (this.state.isHost)
                    this.authenticatedSpotify();
            });
    }


    authenticatedSpotify() {
        fetch('/spotify/is-authenticated')
            .then((response) => response.json())
            .then((data) => {
                this.setState({ spotifyAuthenticated: data.status });
                if (!data.status) {
                    fetch('/spotify/get-auth-url')
                        .then((response) => response.json())
                        .then((data) => {
                            window.location.replace(data.url);
                        });
                }
            });
    };


    leaveButtonPressed() {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        };
        fetch('/api/leave-room', requestOptions).then((_response) => {
            this.props.leaveRoomCallback();
            this.props.navigate('/');
        });
    }

    updateShowSettings(value) {
        this.setState({
            showSettings: value,
        });
    };

    renderSettingsButton() {
        return (
            <Grid item xs={12} align="center">
                <Button variant="contained" color="primary" onClick={() => this.updateShowSettings(true)} >
                    Settings
                </Button>
            </Grid>
        );
    };

    renderSettings() {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <CreateRoomPage
                        update={true}
                        voteToSkip={this.state.votesToSkip}
                        guestCanPause={this.state.guestCanPause}
                        roomCode={this.state.roomCode}
                        updateCallback={(this.getRoomDetails)}
                    />
                </Grid>
                <Grid item xs={12} align="center">
                    <Button variant="contained"
                        color="secondary"
                        onClick={() => { this.updateShowSettings(false) }}
                    >
                        Close
                    </Button>
                </Grid>
            </Grid>);
    }

    render() {
        if (this.state.showSettings) {
            return this.renderSettings()
        }
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Typography variant="h4" component="h4">Code: {this.roomCode}</Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography variant="h6" component="h6">Votes: {this.state.votesToSkip}</Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography variant="h6" component="h6">Guest can pause: {this.state.guestCanPause.toString()}</Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography variant="h6" component="h6">Host: {this.state.isHost.toString()}</Typography>
                </Grid>
                {this.state.isHost ? this.renderSettingsButton() : null}
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="secondary" onClick={this.leaveButtonPressed}>Leave Room</Button>
                </Grid>
            </Grid>
        );
    }
}

export default withParams(withNavigate(Room));  // Wrap with withParams
