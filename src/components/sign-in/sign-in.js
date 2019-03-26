import React, { Component } from 'react'
import { Button, Form, Grid, Image, Card, Message } from 'semantic-ui-react'
import axios from 'axios';
import Api from '../../constants/api';
import Keys from '../../constants/keys';
import Cookies from 'universal-cookie';

import { withRouter } from 'react-router-dom';

import './sign-in.css';
import Logo from '../../images/logo.png';

const cookies = new Cookies();

const sleep = (milliseconds) => {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}

class SignIn extends Component {

    state = {
        loading: false,
        error: '',
        username: '',
        password: ''
    };

    handleChange = (e, { id, value}) => {
        if (id === 'username') {
            this.setState({
                username: value
            });
        } else {
            this.setState({
                password: value
            });
        }
    }

    handleSubmit = (e) => {
        // initialize error
        this.setState({ error: '' });

        const { username, password } = this.state;
        if (username && password) {
            // initialize loading
            this.setState({ loading: true })

            axios.post(Api.signIn, { 
                username: username,
                password: password
            }).then(response => {
                this.setState({ loading: false });
                cookies.set(Keys.tokenKey, response.data.token, { path: '/' });
                cookies.set(Keys.usernameKey, username, { path: '/' });
                // wait
                sleep(20);
                this.props.setAuthenticate(true);
            }).catch(error => {
                this.setState({ loading: false });
                if (error.response && error.response.data && error.response.data.status !== 500) {
                    this.setState({ error: error.response.data.error });
                } else {
                    console.log(error);
                }
            });
        } else {
            this.setState({
                error: 'You must provide username and password'
            });
        }
    }

    render() {
        if (this.props.isAuthenticated) 
            this.props.history.push('/home');

        const { loading, error } = this.state;

        return (
            <div className='login-form'>
                <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
                    <Grid.Column style={{ maxWidth: 450 }}>
                        <Image src={Logo} centered/>
                        {
                            error ? <Message color='red'>{error}</Message> : <div></div>
                        }
                        <Form size='large'>
                            <Card>
                                <Card.Content>
                                    <Form.Input 
                                        fluid icon='user' 
                                        iconPosition='left' 
                                        placeholder='Username' 
                                        id='username' 
                                        onChange={this.handleChange}/>
                                    <Form.Input
                                        fluid
                                        icon='lock'
                                        iconPosition='left'
                                        placeholder='Password'
                                        id='password'
                                        type='password'
                                        onChange={this.handleChange}
                                        />
                                    <Button color='green' fluid size='large' style={{ fontWeight: 800 }} loading={loading} onClick={this.handleSubmit}>Sign In</Button>
                                </Card.Content>
                            </Card>
                        </Form>
                    </Grid.Column>
                </Grid>
            </div>
        )
    } 
}

export default withRouter(SignIn);