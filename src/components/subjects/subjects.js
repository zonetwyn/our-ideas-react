import React, { Component } from 'react';
import { Segment, Pagination, Label, Table, Button, Modal, Icon, Loader, Header } from 'semantic-ui-react'
import Cookies from 'universal-cookie';
import Keys from '../../constants/keys';
import Api from '../../constants/api';
import axios from 'axios';
const cookies = new Cookies();

let token = cookies.get(Keys.tokenKey);
let config = {
    headers: {
        'Authorization': 'Bearer ' + token
    }
}

class Subjects extends Component {

    state = {
        docs: [],
        activeDocs: [],
        activePage: 1,
        totalPages: 0,
        loading: true,
        open: false,
        doc: {}
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

        axios.get(Api.subjects + '/all', configs).then(response => {
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

    open = (doc) => this.setState({ open: true, doc: doc })

    close = () => this.setState({ open: false })

    handleStateChanged = (id, status) => {
        axios.patch(Api.subjects + '/' + id + '/status', { status }, config).then(() => {
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

        const { open, loading, totalPages, activeDocs, activePage, doc } = this.state;

        return (
            <div>
                <Segment>
                    <Table celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Created at</Table.HeaderCell>
                                <Table.HeaderCell>Username</Table.HeaderCell>
                                <Table.HeaderCell>Likes</Table.HeaderCell>
                                <Table.HeaderCell>Ideas count</Table.HeaderCell>
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
                                                <Table.Cell>{doc.user.username}</Table.Cell>
                                                <Table.Cell>
                                                    <Label color='grey' horizontal>
                                                        {doc.likes}
                                                    </Label>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Label color='grey' horizontal>
                                                        {doc.ideasCount}
                                                    </Label>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {
                                                        doc.status === 'rejected' ? (
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
                                                    <Button icon size='tiny' style={{ margin: '0 .5rem 0 0' }} onClick={() => {this.open(doc)}}>
                                                        <Icon name='info' />
                                                    </Button>
                                                    {
                                                        doc.status === 'rejected' ? (
                                                            <Button icon size='tiny' onClick={() => {this.handleStateChanged(doc._id, 'opened')}}>
                                                                <Icon name='check' />
                                                            </Button>
                                                        ) : (
                                                            <Button icon size='tiny' onClick={() => {this.handleStateChanged(doc._id, 'rejected')}}>
                                                                <Icon name='ban' />
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
                                <Table.HeaderCell colSpan='6'>
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
                    closeOnDimmerClick={true}
                    basic
                    onClose={this.close}
                    >
                    <Modal.Header>Content</Modal.Header>
                    <Modal.Content>
                        <Header as='h3' style={{ color: 'white' }}>{doc.title}</Header>
                        <p>{doc.description}</p>
                    </Modal.Content>
                </Modal>
            </div>
        )
    }
}

export default Subjects;