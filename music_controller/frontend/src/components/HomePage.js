import React, { Component } from "react";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";
import { Grid, Button, ButtonGroup, Typography } from '@material-ui/core';

import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";

export default class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomCode: null,
        }
        this.clearRoomCode = this.clearRoomCode.bind(this);
    };

    async componentDidMount() {
        try {
            const response = await fetch('/api/user-in-room');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            this.setState({
                roomCode: data.code,
            });
        } catch (error) {
            console.error('Fetch error:', error);
            this.setState({
                roomCode: null,
            });
        }
    }

    renderHomePage() {
        return (
            <Grid container spacing={3}>
                <Grid item xs={12} align="center">
                    <Typography variant="h3" component="h3">
                        House Party
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <ButtonGroup
                        disableElevation
                        variant="contained"
                        color="primary">
                        <Button color="primary" to="/join" component={Link}>
                            Join a Room
                        </Button>
                        <Button color="secondary" to="/create" component={Link}>
                            Create a Room
                        </Button>
                    </ButtonGroup>
                </Grid>

            </Grid>
        );
    };


    clearRoomCode() {
        this.setState({
            roomCode: null,
        })
    }

    render() {
        return (
            <Router>
                <Routes>
                    <Route exact path="/" element={this.state.roomCode
                        ? <Navigate to={`/room/${this.state.roomCode}`} />
                        : this.renderHomePage()} />
                    <Route path="/join" element={<RoomJoinPage />} />
                    <Route path="/create" element={<CreateRoomPage />} />
                    <Route path="/room/:roomCode" element={
                        <Room leaveRoomCallback={this.clearRoomCode} />
                    } />
                    <Route path="/room/:roomCode" element={<Room leaveRoomCallback={this.clearRoomCode} />} />
                </Routes>
            </Router>);
    };
}

//ZCPWPA