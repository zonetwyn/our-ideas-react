import React, { Component } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { Menu, Image, Dropdown, Grid } from 'semantic-ui-react'

import Dasboard from '../dashboard/dashboard';
import Users from '../users/users';
import Domains from '../domains/domains';
import Subjects from '../subjects/subjects';
import Ideas from '../ideas/ideas';
import NotFound from '../not-found/not-found';

import Logo from '../../images/logo-idea.png';
import './home.css';

import Cookies from 'universal-cookie';
import Keys from '../../constants/keys';

const cookies = new Cookies();

class Home extends Component {

    state = {
        activeMenu: 'dashboard'
    }

    handleMenuClick = (e, { name }) => {
        this.setState({ activeMenu: name })
        this.props.history.push(name);
    }

    componentWillMount() {
        const menu = this.props.location.pathname.split('/')[2];
        this.setState({
            activeMenu: menu
        });
    }

    handleLogout = () => {
        cookies.remove(Keys.tokenKey, { path: '/' });
        cookies.remove(Keys.usernameKey, { path: '/' });
        this.props.setAuthenticate(false);
    }
    
    render() {
        const { activeMenu } = this.state

        if (!this.props.isAuthenticated) {
            this.props.history.push('/signin');
        }

        const username = cookies.get(Keys.usernameKey);

        return (
            <div className='home'>
                <div className='app-navbar'>
                    <Menu>
                        <Menu.Item>
                            <Image src={Logo} className='logo'/>
                        </Menu.Item>

                        <Menu.Menu position='right'>
                            <Dropdown item text={username}>
                                <Dropdown.Menu>
                                    <Dropdown.Item text='Logout' onClick={this.handleLogout}/>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Menu.Menu>
                    </Menu>
                </div>
                <Grid className='app-sidebar'>
                    <Grid.Column width={2} className='app-sidemenu'>
                        <Menu pointing vertical>
                            <Menu.Item 
                                name='dashboard' 
                                active={activeMenu === 'dashboard'} 
                                onClick={this.handleMenuClick} 
                            />
                            <Menu.Item
                                name='users'
                                active={activeMenu === 'users'}
                                onClick={this.handleMenuClick}
                            />
                            <Menu.Item
                                name='domains'
                                active={activeMenu === 'domains'}
                                onClick={this.handleMenuClick}
                            />
                            <Menu.Item
                                name='subjects'
                                active={activeMenu === 'subjects'}
                                onClick={this.handleMenuClick}
                            />
                            <Menu.Item
                                name='ideas'
                                active={activeMenu === 'ideas'}
                                onClick={this.handleMenuClick}
                            />
                        </Menu>
                    </Grid.Column>
                    <Grid.Column width={14} className='app-sidecontent'>
                        <Switch>
                            <Route exact path='/home' render={() => <Redirect to='/home/dashboard' />}/>
                            <Route exact path='/home/dashboard' component={Dasboard} />
                            <Route exact path='/home/users' component={Users} />
                            <Route exact path='/home/domains' component={Domains} />
                            <Route exact path='/home/subjects' component={Subjects} />
                            <Route exact path='/home/ideas' component={Ideas} />
                            <Route component={NotFound} />
                        </Switch>
                    </Grid.Column>
                </Grid>
            </div>
        )
    }
}

export default withRouter(Home);