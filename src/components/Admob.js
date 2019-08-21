import React, { Component } from 'react';
import { Text, View } from 'react-native';
import {AdMobBanner} from 'react-native-admob'

export default class Admob extends Component {
    render() {
        return (
            <View>
                <AdMobBanner
                    adSize="fullBanner"
                    adUnitId="ca-app-pub-2616047922037334/1941771515"
                    onAdFailedToLoad={()=>this.handleFailure()}
                    testDevices={[AdMobBanner.simulatorId]}
                />
            </View>
        );
    }

    handleFailure() {

    }
}