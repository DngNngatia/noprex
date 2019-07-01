import React, {Component} from 'react';
import {
    Container,
    Text,
    Spinner,
    Button,
    View,
    Content,
    Left, Icon, Body, Title, Right, Header, Card, CardItem
} from 'native-base';
import { FlatList} from 'react-native';
import axios from 'axios'
import {AsyncStorage} from 'react-native';
import Emoji from "react-native-emoji";
import SvgUri from "react-native-svg-uri";
import ViewMoreText from "react-native-view-more-text";



export default class Attempted extends Component {
    state = {
        attempted: [],
        empty: true
    }
    retrieveData = async () => {
        try {
            const value = await AsyncStorage.getItem('token');
            if (value !== null) {
                let config = {
                    headers: {'Authorization': "Bearer " + value}
                };
                axios.get('http://noprex.tk/api/user/completed', config).then(response => this.setState({
                    attempted: response.data.data,
                    empty: false
                })).catch((error) => {
                    this.props.navigation.navigate('Login');
                })
            }
        } catch (error) {
            console.log(error)
        }
    };
    renderEmoji(score){
        if (score<25) {
            return <Emoji name="disappointed" style={{fontSize: 100}} />
        }else if(score>=25 && score<50){
            return <Emoji name="smile" style={{fontSize: 100}} />
        }else if(score>=50 && score< 75){
            return <Emoji name="fire" style={{fontSize: 100}} />
        }else if(score>=75){
            return <Emoji name="100" style={{fontSize: 100}} />
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
                        { this.state.empty ? <Spinner/> :
                            <FlatList
                                data={this.state.attempted}
                                renderItem={({ item }) => (
                                    <Card>
                                        <CardItem>
                                            <Text style={{fontSize: 15, flex: 1, alignItems: 'center', justifyContent: 'center'}}>{item.subject.subject_name}</Text>
                                        </CardItem>
                                        <CardItem cardBody>
                                            <Text style={{fontSize: 20, color: 'green', flex: 1, alignItems: 'center', justifyContent: 'center'}}>{item.score}%</Text>
                                        </CardItem>
                                        <CardItem>
                                            {this.renderEmoji(item.score)}
                                        </CardItem>
                                    </Card>
                                )}
                                numColumns={2}
                                keyExtractor={(item, index) => index}
                            />
                        }
                    </View>
                </Content>
            </Container>
        );
    }

}


