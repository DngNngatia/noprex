import React, {Component} from 'react';
import {Image, Text, View} from 'react-native';
import {Body, Button, Container, Spinner, Form, Header, Icon, Input, Item, Left, Right, Title} from "native-base";
import mpesa from '../images/icons/mpesa.png'
import axios from 'axios'
import AsyncStorage from "@react-native-community/async-storage";

export default class HelloWorldApp extends Component {
    state = {
        phone: '',
        amount: 100,
        message: '',
        loading: false
    };

    async mpesa() {
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
                if (!new RegExp('[0-9]{10}').test(this.state.phone)) {
                    this.setState({message: 'Invalid number'})
                }
                else if(isNaN(this.state.amount)){
                    this.setState({message: 'invalid amount'});
                }
                else {
                    this.setState({loading: true});
                    axios.post('http://noprex.tk/api/mpesa', data, config).then((response) => {
                        this.setState({loading: false});
                    }).catch((error) => {
                        this.setState({loading: false});
                        this.setState({message: 'Sorry! our Paybill number is temporarily disabled'})
                    })
                }
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
                    <Title><Text>Mpesa</Text></Title>
                    </Body>
                    <Right/>
                </Header>
                <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                    <Image
                        style={{width: 90, height: 90}}
                        source={mpesa}
                    />
                    {
                        this.state.message ? <Text style={{backgroundColor: 'red'}}>{this.state.message}</Text> :
                            <Text/>
                    }
                    <Form style={{height: 300, width: 300, padding: 10, margin: 5}}>
                        <Item>
                            <Input style={{borderWidth: 1, borderColor: 'green', margin: 5}} value={this.state.phone}
                                   onChangeText={(value) => this.setState({phone: value})}
                                   placeholder="07********"/>
                        </Item>
                        <Item>
                            <Input style={{borderWidth: 1, borderColor: 'green', margin: 5}} value={this.state.amount}
                                   onChangeText={(value) => this.setState({amount: value})} placeholder="Amount"/>
                        </Item>
                        {
                            this.state.loading ? <Spinner/> :
                                <Button style={{marginTop: 7}} rounded success onPress={() => this.mpesa()} block>
                                    <Text>Complete transaction</Text>
                                </Button>
                        }
                    </Form>
                </View>
            </Container>
        );
    }
}
