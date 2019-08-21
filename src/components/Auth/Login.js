import React, {Component} from 'react';
import {Button, Container, Content, Form, Input, Item, Spinner, Text} from 'native-base';
import {Image} from 'react-native';
import image from '../../images/logo.png'
import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage';

export default class Login extends Component {

    state = {
        email: '',
        password: '',
        errors: '',
        spinning: false
    }

    register() {
        this.props.navigation.navigate('Register')
    }
    async storeKey(key){
        try {
            await AsyncStorage.setItem('token', key);
        } catch (error) {
            console.log(error);
        }
    }

    login() {
        if (this.state.email && this.state.password) {
            this.setState({spinning: true, errors: ''})
            axios.post('http://noprex.tk/api/login', {
                email: this.state.email,
                password: this.state.password,
                spinning: false
            }).then((response) => {
                this.storeKey(response.data.access_token);
                this.props.navigation.navigate('Home', {
                    token: response.data.access_token
                })
                this.setState({spinning: false})

            }).catch((error) => {
                console.log(error.response)
                this.setState({errors: error.response.data.message, spinning: false})
            })
        }
        else{
            this.setState({spinning: false, errors: 'Email and Password Required'})
        }

    }

    render() {
        return (
            <Container>
                <Content contentContainerStyle={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <Image source={image} style={{height: 200, width: 200}}/>
                    {
                        this.state.errors !== '' ?
                            <Text style={{backgroundColor: '#FF0000', fontSize: 19}}>{this.state.errors}</Text> : null
                    }
                    <Form style={{height: 300, width: 300, padding: 10, margin: 5}}>
                        <Item>
                            <Input value={this.state.email} onChangeText={(value) => this.setState({email: value})}
                                   placeholder="Email"/>
                        </Item>
                        <Item last>
                            <Input secureTextEntry value={this.state.password}
                                   onChangeText={(value) => this.setState({password: value})} placeholder="Password"/>
                        </Item>
                        {
                            this.state.spinning ? <Spinner/> : <Button onPress={() => this.login()} style={{
                                marginTop: 10,
                                height: 45,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 20,
                                width: 250,
                                borderRadius: 30,
                            }}>
                                <Text>Sign In</Text>
                            </Button>
                        }
                        <Button rounded light onPress={() => this.register()} style={{
                            marginTop: 10,
                            height: 30,
                            textColor: '#000000',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: 20,
                            width: 100,
                            borderRadius: 30,
                        }}>
                            <Text>Register</Text>
                        </Button>
                        <Button onPress={() => this.props.navigation.navigate('ResetPassword')} transparent>
                            <Text style={{textTransform: 'capitalize', textDecorationLine: 'underline', color: 'blue'}}>Forgot
                                password? Reset</Text>
                        </Button>

                    </Form>

                </Content>
            </Container>
        );
    }
}