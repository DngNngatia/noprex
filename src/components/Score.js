import React, {Component} from 'react';
import {Container, Header, Title, Content, Card, CardItem, Button, Left, Right, Body, Icon, Text} from 'native-base';
import axios from 'axios'
import { Dimensions, ScrollView, View,BackHandler} from 'react-native';
import Emoji from 'react-native-emoji';


import {
    LineChart,
} from 'react-native-chart-kit'

export default class Score extends Component {
    state = {
        total: 0
    };
    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillUnmount() {
        this.backHandler.remove()
    }

    handleBackPress = () => {
        const {navigation} = this.props;
        const token = navigation.getParam('token', null);
        this.props.navigation.navigate('Home', {
            token: token
        })
    };

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
                console.log(error)
            })
    }

    renderEmoji(score) {
        if (score < 0.25) {
            return <View style={{flex: 1, alignItems: 'center',justifyContent: 'center',flexDirection:'row'}}><Text>Novice:  </Text><Text style={{fontSize: 20}}>{Math.round(score  * 100)}%</Text><Emoji name="disappointed" style={{fontSize: 80}}/></View>
        } else if (score >= 0.25 && score < 0.5) {
            return  <View style={{flex: 1, alignItems: 'center',justifyContent: 'center',flexDirection:'row'}}><Text>Novice: </Text><Text style={{fontSize: 20}}>{Math.round(score  * 100)}%</Text><Emoji name="smile" style={{fontSize: 80}}/></View>
        } else if (score >= 0.5 && score < 0.75) {
            return  <View style={{flex: 1, alignItems: 'center',justifyContent: 'center',flexDirection:'row'}}><Text>Proficient: </Text><Text style={{fontSize: 20}}>{Math.round(score  * 100)}%</Text><Emoji name="fire" style={{fontSize: 80}}/></View>
        } else if (score >= 0.75) {
            return  <View style={{flex: 1, alignItems: 'center',justifyContent: 'center',flexDirection:'row'}}><Text>Expert: </Text><Text style={{fontSize: 20}}>{Math.round(score  * 100)}%</Text><Emoji name="100" style={{fontSize: 80}}/></View>
        }
    }

    render() {
        const {navigation} = this.props;
        const array_length = navigation.getParam('array_length', null);
        const Score = navigation.getParam('Score', 0);
        const subject = navigation.getParam('subject', null);
        const data = [ 0.25, 0.5, 0.75,Score/array_length]
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
                            </CardItem>
                        </Card>
                        <LineChart
                            data={{
                                labels: ['Novice', 'Proficient', 'Expert', 'Your Score'],
                                datasets: [{
                                    data: data
                                }]
                            }}
                            width={Dimensions.get('window').width} // from react-native
                            height={220}
                            chartConfig={{
                                backgroundColor: '#e26a00',
                                backgroundGradientFrom: '#fb8c00',
                                backgroundGradientTo: '#ffa726',
                                decimalPlaces: 2, // optional, defaults to 2dp
                                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                style: {
                                    borderRadius: 16
                                }
                            }}
                            bezier
                            style={{
                                marginVertical: 8,
                                borderRadius: 16
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