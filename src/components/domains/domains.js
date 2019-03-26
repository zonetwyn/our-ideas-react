import React, { Component } from 'react';
import { Segment, Pagination, Label, Table, Button, Modal, Form, Icon, Loader } from 'semantic-ui-react'
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

class Domains extends Component {

    state = {
        docs: [],
        activeDocs: [],
        activePage: 1,
        totalPages: 0,
        loading: true,
        open: false,
        openDetails: false,
        doc: {},
        name: '',
        description: '',
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

        axios.get(Api.domains, configs).then(response => {
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

    close = () => this.setState({ open: false, submitting: false, openDetails: false })

    handleChange = (e, { id, value}) => {
        if (id === 'name') {
            this.setState({
                name: value
            });
        } else if (id === 'description') {
            this.setState({
                description: value
            });
        }
    }

    handleSubmit = (e) => {
        this.setState({
            submitting: true
        });
        const { name, description } = this.state;
        console.log(this.state);
        axios.post(Api.domains, { name, description }, config).then(response => {
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

    handleDelete = (id) => {
        axios.delete(Api.domains + '/' + id, null, config).then(() => {
            this.refresh();
        }).catch(error => {
            if (error.response && error.response.data && error.response.data.status !== 500) {
                console.log(error.response.data.error);
            } else {
                console.log(error);
            }
        });
    }

    handleDetails = (doc) => {
        this.setState({
            doc: doc,
            openDetails: true
        });
    }

    render() {
        token = cookies.get(Keys.tokenKey);
        config = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }

        const { open, openDetails, doc, loading, totalPages, activeDocs, activePage, submitting } = this.state;

        return (
            <div>
                <Segment>
                    <Button color='green' onClick={this.open} style={{display: 'inline', float: 'right', margin: '0 0 1rem 0'}}>New</Button>
                    <Table celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Created at</Table.HeaderCell>
                                <Table.HeaderCell>Name</Table.HeaderCell>
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
                                                <Table.Cell>{doc.name}</Table.Cell>
                                                <Table.Cell>
                                                    <Button icon size='tiny' style={{ margin: '0 .5rem 0 0' }} onClick={() => {this.handleDetails(doc)}}>
                                                        <Icon name='info' />
                                                    </Button>
                                                    <Button color='red' icon size='tiny' onClick={() => {this.handleDelete(doc._id)}}>
                                                        <Icon name='delete' />
                                                    </Button>
                                                </Table.Cell>
                                            </Table.Row>
                                        )
                                    })
                                )
                            }
                        </Table.Body>

                        <Table.Footer>
                            <Table.Row>
                                <Table.HeaderCell colSpan='3'>
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
                    centered={false}
                    onClose={this.close}
                    size='tiny'
                    >
                    <Modal.Header>New Domain</Modal.Header>
                    <Modal.Content>
                        <Form>
                            <Form.Input label='Name' type='text' key='name' id='name' onChange={this.handleChange} />
                            <Form.TextArea label='Description' rows={8} type='text'  key='description' id='description' onChange={this.handleChange} />
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
                <Modal
                    open={openDetails}
                    closeOnDimmerClick={true}
                    basic
                    onClose={this.close}
                    >
                    <Modal.Header>Description</Modal.Header>
                    <Modal.Content>
                        { doc.description }
                    </Modal.Content>
                </Modal>
            </div>
        )
    }
}

export default Domains;