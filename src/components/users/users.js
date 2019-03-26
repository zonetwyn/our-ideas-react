import React, { Component } from 'react';
import { Segment, Pagination, Label, Table, Button, Modal, Form, Icon, Loader } from 'semantic-ui-react'
import Cookies from 'universal-cookie';
import Keys from '../../constants/keys';
import Api from '../../constants/api';
import axios from 'axios';
const cookies = new Cookies();

const roles = [
    { key: 'admin', text: 'Admin', value: 'admin' },
    { key: 'user', text: 'User', value: 'user' },
]

let token = cookies.get(Keys.tokenKey);
let config = {
    headers: {
        'Authorization': 'Bearer ' + token
    }
}

class Users extends Component {

    state = {
        docs: [],
        activeDocs: [],
        activePage: 1,
        totalPages: 0,
        loading: true,
        open: false,
        username: '',
        password: '',
        role: '',
        submitting: false
    };

    componentDidMount() {
        this.refresh();
    }

    refresh = () => {
        this.setState({ loading: false });
        let configs = {
            ...config,
            params: {
                limit: '1000'
            }
        };

        axios.get(Api.users, configs).then(response => {
            const { docs, totalDocs } = response.data;
            const totalPages = parseInt(totalDocs / 10 + 1);
            this.setState({ 
                loading: false,
                docs: docs,
                activeDocs: docs.slice(0, 10),
                totalPages: totalPages
            });
        }).catch(error => {
            console.log(error);
        });
    }

    handlePaginationChange = (e, { activePage }) => {
        const { docs } = this.state;
        const first = (activePage - 1) * 10;
        const last = first + 10;
        this.setState({ 
            activePage: activePage,
            activeDocs: docs.slice(first, last) 
        });
    }

    open = () => this.setState({ open: true })

    close = () => this.setState({ open: false, submitting: false })

    handleChange = (e, { id, value}) => {
        if (id === 'username') {
            this.setState({
                username: value
            });
        } else if (id === 'password') {
            this.setState({
                password: value
            });
        } else {
            this.setState({
                role: value
            });
        }
    }

    handleSubmit = (e) => {
        this.setState({
            submitting: true
        });
        const { username, password, role } = this.state;
        axios.post(Api.signUp, { username, password, role }).then(response => {
            this.refresh();
            this.close();
        }).catch(error => {
            this.close();
            if (error.response && error.response.data && error.response.data.status !== 500) {
                console.log(error.response.data.error);
            } else {
                console.log(error);
            }
        });
    }

    handleStateChanged = (userId, status) => {
        axios.patch(Api.users + '/' + userId + '/status', { status }, config).then(() => {
            this.refresh();
        }).catch(error => {
            if (error.response && error.response.data && error.response.data.status !== 500) {
                console.log(error.response.data.error);
            } else {
                console.log(error);
            }
        });
    }

    render() {
        token = cookies.get(Keys.tokenKey);
        config = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }

        const { open, loading, totalPages, activeDocs, activePage, submitting } = this.state;

        return (
            <div>
                <Segment>
                    <Button color='green' onClick={this.open} style={{display: 'inline', float: 'right', margin: '0 0 1rem 0'}}>New</Button>
                    <Table celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Created at</Table.HeaderCell>
                                <Table.HeaderCell>Username</Table.HeaderCell>
                                <Table.HeaderCell>Role</Table.HeaderCell>
                                <Table.HeaderCell>Status</Table.HeaderCell>
                                <Table.HeaderCell>Actions</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {
                                loading ? (
                                    <Table.Row>
                                        <Table.Cell colSpan='6'>
                                            <Loader active inline='centered' />
                                        </Table.Cell>
                                    </Table.Row>
                                ) : (
                                    activeDocs.map((doc, i) => {
                                        return (
                                            <Table.Row key={doc._id}>
                                                <Table.Cell>
                                                    {
                                                        (i === 0 && activePage === 1) ? (
                                                            <div>
                                                                <Label ribbon>Last</Label> 
                                                                {new Date(doc.createdAt).toLocaleDateString() + ' ' + new Date(doc.createdAt).toLocaleTimeString()}
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                {new Date(doc.createdAt).toLocaleDateString() + ' ' + new Date(doc.createdAt).toLocaleTimeString()}
                                                            </div>
                                                        )
                                                    }
                                                </Table.Cell>
                                                <Table.Cell>{doc.username}</Table.Cell>
                                                <Table.Cell>
                                                    {
                                                        doc.role === 'user' ? (
                                                            <Label color='grey' horizontal>
                                                                {doc.role}
                                                            </Label>
                                                        ) : (
                                                            <Label color='black' horizontal>
                                                                {doc.role}
                                                            </Label>
                                                        )
                                                    }
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {
                                                        doc.status === 'locked' ? (
                                                            <Label color='red' horizontal>
                                                                {doc.status}
                                                            </Label>
                                                        ) : (
                                                            <Label color='green' horizontal>
                                                                {doc.status}
                                                            </Label>
                                                        )
                                                    }
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {
                                                        doc.status === 'locked' ? (
                                                            <Button icon size='tiny' onClick={() => {this.handleStateChanged(doc._id, 'opened')}}>
                                                                <Icon name='unlock' />
                                                            </Button>
                                                        ) : (
                                                            <Button icon size='tiny' onClick={() => {this.handleStateChanged(doc._id, 'locked')}}>
                                                                <Icon name='lock' />
                                                            </Button>
                                                        )
                                                    }
                                                </Table.Cell>
                                            </Table.Row>
                                        )
                                    })
                                )
                            }
                        </Table.Body>

                        <Table.Footer>
                            <Table.Row>
                                <Table.HeaderCell colSpan='5'>
                                    <Pagination 
                                        defaultActivePage={1}
                                        ellipsisItem={null}
                                        firstItem={null}
                                        lastItem={null}
                                        siblingRange={1}
                                        totalPages={totalPages}
                                        onPageChange={this.handlePaginationChange}
                                        floated='right' />
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Footer>
                    </Table>
                </Segment>

                <Modal
                    open={open}
                    closeOnDimmerClick={false}
                    onClose={this.close}
                    centered={false}
                    size='tiny'
                    >
                    <Modal.Header>New user</Modal.Header>
                    <Modal.Content>
                        <Form>
                            <Form.Input label='Username' type='text' key='username' id='username' onChange={this.handleChange} />
                            <Form.Input label='Password' type='password'  key='password' id='password'onChange={this.handleChange} />
                            <Form.Select label='Role' options={roles}  key='role' id='role' onChange={this.handleChange} />
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={this.close} negative>
                            Cancel
                        </Button>
                        <Button
                            onClick={this.handleSubmit}
                            positive
                            labelPosition='right'
                            icon='checkmark'
                            content='Submit'
                            loading={submitting}
                        />
                    </Modal.Actions>
                </Modal>
            </div>
        )
    }
}

export default Users;