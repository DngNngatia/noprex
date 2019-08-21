import React, { Component } from 'react';
import { StyleSheet,Image } from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import mpesa from '../images/icons/mpesa.png';
import paypal from '../images/icons/paypal.png';
import Paypal from './Paypal';
import Mpesa from './Mpesa';

export default class Donate extends Component {
    state= {
        selectedTab: 'mpesa'
    };

    render() {
        return (
            <TabNavigator style={styles.container}>
                <TabNavigator.Item
                    selected={this.state.selectedTab === 'mpesa'}
                    title="Mpesa"
                    selectedTitleStyle={{color: "#3496f0"}}
                    renderIcon={() =>  <Image
                        style={{width: 24, height: 24}}
                        source={mpesa}
                    />}
                    renderSelectedIcon={() =>  <Image
                        style={{width: 24, height: 24}}
                        source={mpesa}
                    />}
                    onPress={() => this.setState({selectedTab: 'mpesa'})}>
                    <Mpesa/>
                </TabNavigator.Item>
                <TabNavigator.Item
                    selected={this.state.selectedTab === 'paypal'}
                    title="Paypal"
                    selectedTitleStyle={{color: "#3496f0"}}
                    renderIcon={() =>  <Image
                        style={{width: 24, height: 24}}
                        source={paypal}
                    />}
                    renderSelectedIcon={() =>  <Image
                        style={{width: 24, height: 24}}
                        source={paypal}
                    />}
                    onPress={() => this.setState({selectedTab: 'paypal'})}>
                    <Paypal/>
                </TabNavigator.Item>
            </TabNavigator>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});