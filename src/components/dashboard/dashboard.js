import React, { Component } from 'react';
import { Grid, Header, Segment } from 'semantic-ui-react'
import Cookies from 'universal-cookie';
import Keys from '../../constants/keys';
import Api from '../../constants/api';
import axios from 'axios';
const cookies = new Cookies();

const square = { width: 200, height: 200 }

let token = cookies.get(Keys.tokenKey);
let config = {
    headers: {
        'Authorization': 'Bearer ' + token
    }
}

class Dashboard extends Component {

    state = {
        usersCount: 0,
        ideasCount: 0,
        subjectsCount: 0
    }

    componentDidMount() {
        this.users();
        this.subjects();
        this.ideas();
    }

    users = () => {
        let configs = {
            ...config,
            params: {
                model: 'user'
            }
        };

        axios.get(Api.counts, configs).then(response => {
            const { count } = response.data;
            this.setState({ 
                usersCount: count
            });
        }).catch(error => {
            console.log(error);
        });
    }

    subjects = () => {
        let configs = {
            ...config,
            params: {
                model: 'subject'
            }
        };

        axios.get(Api.counts, configs).then(response => {
            const { count } = response.data;
            this.setState({ 
                subjectsCount: count
            });
        }).catch(error => {
            console.log(error);
        });
    }

    ideas = () => {
        let configs = {
            ...config,
            params: {
                model: 'idea'
            }
        };

        axios.get(Api.counts, configs).then(response => {
            const { count } = response.data;
            this.setState({ 
                ideasCount: count
            });
        }).catch(error => {
            console.log(error);
        });
    }

    render() {
        token = cookies.get(Keys.tokenKey);
        config = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }

        const { usersCount, ideasCount, subjectsCount } = this.state;

        return (
            <Grid centered columns={9}>
                <Grid.Column width={3}>
                    <Segment circular style={square}>
                        <Header as='h2'>Users</Header>
                        <Header as='h3'>{usersCount}</Header>
                    </Segment>
                </Grid.Column>
                <Grid.Column width={3}>
                    <Segment circular style={square} inverted color='green'>
                        <Header as='h2'>Subjects</Header>
                        <Header as='h3'>{subjectsCount}</Header>
                    </Segment>
                </Grid.Column>
                <Grid.Column width={3}>
                    <Segment circular style={square} inverted color='teal'>
                        <Header as='h2'>Ideas</Header>
                        <Header as='h3'>{ideasCount}</Header>
                    </Segment>
                </Grid.Column>
            </Grid>
        )
    }
}

export default Dashboard;