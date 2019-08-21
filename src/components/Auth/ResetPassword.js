import React, {Component} from 'react';
import {Container, Text, Spinner, Button, View, Form, Input, Item, Content} from 'native-base';
import axios from 'axios'
import {Image} from "react-native";
import image from "../../images/logo.png";

export default class ResetPassword extends Component {
    state = {
        email: '',
        message: '',
        loading: false
    };

    reset() {
        if (this.state.email !== '') {
            this.setState({loading: true});
            axios.post('http://noprex.tk/api/reset/password', {email: this.state.email}).then((response) => {
                this.setState({loading: false});
                this.props.navigation.navigate('OtpReset', {
                    email: this.state.email
                })
            }).catch((error) => {
                this.setState({loading: false, message: error.response.data.message})
            })
        }else{
            this.setState({message: 'Enter a valid email'})
        }
    }

    render() {
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Image source={image} style={{height: 200, width: 200}}/>
                <Form style={{height: 300, width: 300, padding: 10, margin: 5}}>
                    {this.state.message ? <Text style={{backgroundColor: 'red'}}>{this.state.message}</Text> : <Text/>}
                    <Item>
                    <Input onChangeText={(value) => this.setState({email: value})} placeholder="Email"
                           value={this.state.email}/>
                    </Item>
                    {
                        this.state.loading ? <Spinner color='black'/> :
                            <Button style={{
                                marginTop: 15,
                                textColor: '#000000',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 20,
                                borderRadius: 30,
                            }} onPress={() => this.reset()} dark><Text>Request Password Reset</Text></Button>
                    }
                </Form>
            </View>
        )

    }

}