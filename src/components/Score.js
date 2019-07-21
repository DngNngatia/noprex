import React, {Component} from 'react';
import {Container, Header, Title, Content, Card, CardItem, Button, Left, Right, Body, Icon, Text} from 'native-base';
import axios from 'axios'
import {Image, TouchableOpacity, Dimensions, ScrollView, View} from 'react-native';
import Emoji from 'react-native-emoji';


import {
    ProgressChart,
} from 'react-native-chart-kit'

export default class Score extends Component {
    state = {
        total: 0
    }

    componentWillMount() {
        const {navigation} = this.props;
        const token = navigation.getParam('token', null);
        const subject = navigation.getParam('subject', null);
        const Score = navigation.getParam('Score', 0);
        const array_length = navigation.getParam('array_length', null);
        let config = {
            headers: {'Authorization': "Bearer " + token}
        };
        axios.post('http://noprex.tk/api/scores/' + subject.id + '/subjects', {score: Score / array_length * 100}, config).then(response => console.log(response.data.data))
            .catch((error) => {
                this.props.navigation.navigate('Home');
            })
    }

    renderEmoji(score) {
        if (score < 0.25) {
            return <Emoji name="disappointed" style={{fontSize: 100}}/>
        } else if (score >= 0.25 && score < 0.5) {
            return <Emoji name="smile" style={{fontSize: 100}}/>
        } else if (score >= 0.5 && score < 0.75) {
            return <Emoji name="fire" style={{fontSize: 100}}/>
        } else if (score >= 0.75) {
            return <Emoji name="100" style={{fontSize: 100}}/>
        }
    }

    render() {
        const screenWidth = Dimensions.get('window').width
        const {navigation} = this.props;
        const array_length = navigation.getParam('array_length', null);
        const Score = navigation.getParam('Score', 0);
        const subject = navigation.getParam('subject', null);
        const data = [Score / array_length, 0.25, 0.5, 0.75]
        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name='arrow-back'/>
                        </Button>
                    </Left>
                    <Body>
                        <Title><Text>Score</Text></Title>
                    </Body>
                    <Right/>
                </Header>
                <Content>
                    <ScrollView>
                        <Card>
                            <CardItem>
                                <Text>{subject.subject_name}</Text>
                            </CardItem>
                            <CardItem cardBody>
                                {
                                    this.renderEmoji(Score / array_length)
                                }
                                <Text style={{fontSize: 20}}>{Math.round(Score / array_length * 100)}%</Text>
                            </CardItem>
                        </Card>
                        <ProgressChart
                            data={data}
                            width={screenWidth}
                            height={200}
                            chartConfig={{
                                backgroundColor: '#ffffff00',
                                backgroundGradientFrom: '#FFFF00',
                                backgroundGradientTo: '#0000FF',
                                color: (opacity = 1) => `rgba(175, 255, 255, ${opacity})`,
                                style: {
                                    borderRadius: 10
                                }
                            }}
                        />
                        <View>
                            <Text style={{fontFamily: 'sans-serif-thin'}}>@noprex is the leading app in keeping
                                developers upto-date with the changing software
                                engineering world</Text>
                        </View>
                    </ScrollView>
                </Content>
            </Container>
        )
    }
}