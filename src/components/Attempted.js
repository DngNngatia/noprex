import React, {Component} from 'react';
import {
    Container,
    Text,
    Spinner,
    Button,
    View,
    Content,
    Left, Icon, Body, Title, Right, Header, ListItem
} from 'native-base';
import {FlatList} from 'react-native';
import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage';
import Emoji from "react-native-emoji";


export default class Attempted extends Component {
    state = {
        attempted: [],
        empty: false,
        token: ''
    }
    retrieveData = async () => {
        try {
            const value = await AsyncStorage.getItem('token');
            if (value !== null) {
                let config = {
                    headers: {'Authorization': "Bearer " + value}
                };
                axios.get('http://noprex.tk/api/user/completed', config).then(response => {
                    if (response.data.data.length === 0) {
                        this.setState({empty: true})
                    }
                    this.setState({
                        attempted: response.data.data,
                        token: value
                    })
                }).catch((error) => {
                    this.props.navigation.navigate('Login');
                })
            }
        } catch (error) {
            console.log(error)
        }
    };

    renderEmoji(score) {
        if (score < 25) {
            return <Emoji name="disappointed" style={{fontSize: 60}}/>
        } else if (score >= 25 && score < 50) {
            return <Emoji name="smile" style={{fontSize: 60}}/>
        } else if (score >= 50 && score < 75) {
            return <Emoji name="fire" style={{fontSize: 60}}/>
        } else if (score >= 75) {
            return <Emoji name="100" style={{fontSize: 60}}/>
        }
    }

    componentDidMount(): void {
        this.retrieveData();

    }

    render() {
        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.openDrawer()}>
                            <Icon name='menu'/>
                        </Button>
                    </Left>
                    <Body>
                        <Title><Text>Attempted Subjects</Text></Title>
                    </Body>
                    <Right/>
                </Header>
                <Content>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        {this.state.empty ? this.state.empty ?
                            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                <Text> You have not attempted any IQ quiz please check out our awesome IQ
                                    questions</Text>
                            </View>
                            : <Spinner/> :
                            <FlatList
                                data={this.state.attempted}
                                renderItem={({item}) => (
                                    <ListItem style={{
                                        flex: 1,
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Text>{item.subject.subject_name}</Text>
                                        <Text>{Math.round(item.score)}%</Text>
                                        {this.renderEmoji(item.score)}
                                        <Button onPress={() => {
                                            this.props.navigation.navigate('Review', {
                                                id: item.subject.id,
                                                subject: item.subject,
                                                token: this.state.token
                                            })
                                        }} small success>
                                            <Text>Review</Text>
                                        </Button>
                                    </ListItem>
                                )}
                                numColumns={1}
                                keyExtractor={(item, index) => index}
                            />
                        }
                    </View>
                </Content>
            </Container>
        );
    }

}


