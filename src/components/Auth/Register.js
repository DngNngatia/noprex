import React, {Component} from 'react';
import {Container, Text, Spinner, Button, View, List, ListItem, Content, Form, Item, Input, Label} from 'native-base';
import {Image} from 'react-native';
import image from '../../images/logo.png'
import axios from 'axios'


export default class Login extends Component {

    state = {
        name: '',
        email: '',
        password: '',
        errors: '',
        spinning: false
    }

    register() {
        this.setState({spinning: true, errors: ''})
        axios.post('https://b41f7b32.ngrok.io/api/register', {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password
        }).then((response) => {
            this.props.navigation.navigate('Login')
            this.setState({spinning: true})
        }).catch((error) => {
            this.setState({errors: error.response.data.data.email[0], spinning: false})
        })
    }

    render() {
        return (
            <Container>
                <Content contentContainerStyle={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <Image source={image} style={{height: 100, width: 100}}/>
                    {
                        this.state.errors != '' ?
                            <Text style={{backgroundColor: '#FF0000', fontSize: 19}}>{this.state.errors}</Text> : null
                    }
                    <Form style={{height: 300, width: 300, padding: 10, margin: 5}}>
                        <Item>
                            <Input value={this.state.name} onChangeText={(value) => this.setState({name: value})}
                                   placeholder="Name"/>
                        </Item>
                        <Item>
                            <Input value={this.state.email} onChangeText={(value) => this.setState({email: value})}
                                   placeholder="Email"/>
                        </Item>
                        <Item last>
                            <Input secureTextEntry value={this.state.password}
                                   onChangeText={(value) => this.setState({password: value})} placeholder="Password"/>
                        </Item>
                        {
                            this.state.spinning ? <Spinner/> : <Button onPress={() => this.register()} style={{
                                marginTop: 10,
                                height: 45,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 20,
                                width: 250,
                                borderRadius: 30,
                            }}>
                                <Text>Register</Text>
                            </Button>
                        }
                    </Form>

                </Content>
            </Container>
        );
    }
}