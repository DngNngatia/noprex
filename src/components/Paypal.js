import React, {Component} from 'react';
import {Image, Text, View} from 'react-native';
import {Body, Button, Container, Spinner, Form, Header, Icon, Input, Item, Left, Right, Title} from "native-base";
import paypal from '../images/icons/paypal.png'
import axios from 'axios'
import AsyncStorage from "@react-native-community/async-storage";

export default class Paypal extends Component {
    state = {
        id: '',
        amount: 10,
        message: '',
        loading: false
    };

    async paypal() {
        try {
            const value = await AsyncStorage.getItem('token');
            if (value !== null) {
                let config = {
                    headers: {'Authorization': "Bearer " + value}
                };
                let data = {
                    phone: this.state.phone,
                    amount: this.state.amount
                };
                this.setState({loading: true});
                axios.post('http://noprex.tk/api/paypal', data, config).then((response) => {
                    this.setState({loading: false});
                }).catch((error) => {
                    this.setState({loading: false, message: 'Could not complete transcation'});
                })
            }
        } catch (error) {
            console.log(error)
        }

    }

    render() {
        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent>
                            <Icon name='arrow-back'/>
                        </Button>
                    </Left>
                    <Body>
                    <Title><Text>Paypal</Text></Title>
                    </Body>
                    <Right/>
                </Header>
                <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                    <Image
                        style={{width: 90, height: 90}}
                        source={paypal}
                    />
                    {
                        this.state.message ? <Text style={{backgroundColor: 'red'}}>{this.state.message}</Text> : <Text/>
                    }
                    <Form style={{height: 300, width: 300, padding: 10, margin: 5}}>
                        <Item>
                            <Input style={{borderWidth: 1, borderColor: 'green', margin: 5}} value={this.state.amount}
                                   onChangeText={(value) => this.setState({amount: value})}
                                   placeholder="Amount (default 10$)"/>
                        </Item>
                        {
                            this.state.loading ? <Spinner/> :
                                <Button style={{marginTop: 7}} rounded primary onPress={() => this.paypal()} block>
                                    <Text>Complete transaction</Text>
                                </Button>
                        }
                    </Form>
                </View>
            </Container>
        );
    }
}

