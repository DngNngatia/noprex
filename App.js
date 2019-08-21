import Subjects from './src/components/Subjects'
import Questions from './src/components/Questions'
import Score from './src/components/Score'
import Login from './src/components/Auth/Login'
import Register from './src/components/Auth/Register'
import Topic from './src/components/Topic'
import Logout from './src/components/Logout'
import Review from './src/components/Review'
import ResetPassword from './src/components/Auth/ResetPassword'
import OtpReset from './src/components/Auth/OtpReset'
import Admob from './src/components/Admob'
import React, {Component} from 'react';
import {
    Header,
    Title,
    Button,
    Left,
    Right,
    Body,
    Icon,
    Text
} from 'native-base';
import {View, Dimensions, SafeAreaView, ScrollView, Image} from 'react-native';
import Profile from './src/components/Profile';
import GSettings from './src/components/GSettings';
import Attempted from './src/components/Attempted';
import Comments from './src/components/Comments';
import Donate from './src/components/Donate';
import  Mpesa from './src/components/Mpesa';
import  Paypal from './src/components/Paypal';
import {createAppContainer, createDrawerNavigator, DrawerItems, createStackNavigator} from "react-navigation";
import image from './src/images/logo.png'

console.disableYellowBox = true;

class App extends Component {
    render(props) {
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Header>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.openDrawer()}>
                            <Icon name='menu'/>
                        </Button>
                    </Left>
                    <Body>
                    <Title><Text>xxx</Text></Title>
                    </Body>
                    <Right/>
                </Header>
                <AppDrawerNavigator/>
            </View>
        );
    }
}

const CustomDrawerComponent = (props) => (
    <SafeAreaView style={{flex: 1}}>
        <View style={{height: 150, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}>
            <Image source={image} style={{height: 100, width: 100, borderRadius: 20}}/>
        </View>
        <ScrollView>
            <DrawerItems {...props}/>
        </ScrollView>
    </SafeAreaView>
)
export const AppDrawerNavigator = createDrawerNavigator({
    Topic: {
        screen: Topic,
        navigationOptions: {
            drawerIcon: (
                <Image
                    style={{width: 24, height: 24}}
                    source={require("./src/images/icons/focus.png")}
                />
            ),
        }
    },
    Profile: {
        screen: Profile,
        navigationOptions: {
            drawerIcon: (
                <Image
                    style={{width: 24, height: 24}}
                    source={require("./src/images/icons/boy.png")}
                />
            ),
        }
    },
    Attempted: {
        screen: Attempted,
        navigationOptions: {
            drawerIcon: (
                <Image
                    style={{width: 24, height: 24}}
                    source={require("./src/images/icons/completed-task.png")}
                />
            ),
        }
    },
    Settings: {
        screen: GSettings,
        navigationOptions: {
            drawerIcon: (
                <Image
                    style={{width: 24, height: 24}}
                    source={require("./src/images/icons/settings-gears.png")}
                />
            ),
        },

    },
    Donate: {
        screen: Donate,
        navigationOptions: {
            drawerIcon: (
                <Image
                    style={{width: 24, height: 24}}
                    source={require("./src/images/icons/donate.png")}
                />
            ),
        },

    },
    Logout: {
        screen: Logout,
        navigationOptions: {
            drawerIcon: (
                <Image
                    style={{width: 30, height: 30}}
                    source={require("./src/images/icons/logout.png")}
                />
            ),
        },

    }
}, {
    contentComponent: CustomDrawerComponent
})
const AppNavigator = createStackNavigator({
        Home: AppDrawerNavigator,
        Subjects: Subjects,
        Questions: Questions,
        Score: Score,
        Login: Login,
        Register: Register,
        Review: Review,
        Comments: Comments,
        ResetPassword: ResetPassword,
        OtpReset: OtpReset,
        Donate: Donate,
        Mpesa: Mpesa,
        Paypal: Paypal,
        Admob: Admob


    },
    {
        initialRouteName: "Login",
        headerMode: 'none',
        navigationOptions: {
            headerVisible: false,
        },
    }
);

export default createAppContainer(AppNavigator);