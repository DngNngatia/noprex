import React, {Component} from 'react';
import {Text, Spinner, Button, View, Form, Item, Input} from 'native-base';
import {Image} from 'react-native';
import image from '../../images/logo.png'
import axios from 'axios'

export default class OtpReset extends Component {
    state = {
        message: '',
        loading: false,
        otp: '',
        password: '',
        confirm_password: ''
    };

    reset() {
        if (this.state.otp.length < 6) {
            this.setState({message: 'Invalid OTP'});
        } else if (this.state.password === null || this.state.password.length < 6) {
            this.setState({message: 'Invalid password!! must be greater than 6chars'});
        } else if (!this.state.password.match(this.state.confirm_password)) {
            this.setState({message: 'Password dont match'});
        } else {
            this.setState({loading: true});
            const {navigation} = this.props;
            const email = navigation.getParam('email', null);
            let data = {
                email: email,
                otp: this.state.otp,
                password: this.state.password
            };
            axios.post('http://noprex.tk/api/otp', data).then((response) => {
                this.setState({loading: false});
                this.props.navigation.navigate('Login')
            }).catch((error) => {
                this.setState({loading: false, message: error.response.data.message})
            })
        }

    }

    render() {
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Image source={image} style={{height: 200, width: 200}}/>
                <Form style={{height: 300, width: 300, padding: 10, margin: 5}}>
                    {this.state.message ? <Text style={{backgroundColor: 'red'}}>{this.state.message}</Text> : <Text/>}
                   <Item>
                    <Input onChangeText={(value) => this.setState({otp: value})} placeholder="OTP code"
                           value={this.state.otp}/>
                   </Item>
                    <Item>
                    <Input secureTextEntry onChangeText={(value) => this.setState({password: value})} placeholder="Password"
                           value={this.state.password}/>
                    </Item>
                    <Item>
                    <Input secureTextEntry onChangeText={(value) => this.setState({confirm_password: value})}
                           placeholder="Confirm Password"
                           value={this.state.confirm_password}/>
                    </Item>
                    {
                        this.state.loading ? <Spinner color='yellow'/> :
                            <Button style={{
                                marginTop: 10,
                                height: 40,
                                textColor: 'blue',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 20,
                                borderRadius: 30,
                            }} onPress={() => this.reset()} primary><Text>Reset Password</Text></Button>
                    }
                </Form>
            </View>
        )

    }

}