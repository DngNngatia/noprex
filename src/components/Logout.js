import React,{Component} from 'react'
import {Spinner} from 'native-base'
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
export default class Logout extends Component{

    async componentWillMount() {
        try {
            const value = await AsyncStorage.getItem('token');
            if (value !== null) {
                let config = {
                    headers: {'Authorization': "Bearer " + value}
                };
                axios.post('http://noprex.tk/api/logout', null, config).then(response => {
                    this.props.navigation.navigate('Login')
                }).catch((error) => console.log(error))
            }
        } catch (error) {
            console.log(error)
        }
    }

    render(){
        return (
            <Spinner color='red'/>
        );
    }


}