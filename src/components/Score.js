import React, {Component} from 'react';
import {Container, Header, Title, Content, Card, CardItem, Button, Left, Right, Body, Icon, Text} from 'native-base';
import axios from 'axios'
import {Image, TouchableOpacity, Dimensions, ScrollView} from 'react-native';
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
} from 'react-native-chart-kit'

export default class Score extends Component {
    state = {
        total: 0
    }
    componentWillMount(){
        const {navigation} = this.props;
        const token = navigation.getParam('token', null);
        const subject = navigation.getParam('subject', null);
        const Score = navigation.getParam('Score', 0);
        var config = {
            headers: {'Authorization': "Bearer " + token}
        };
        // axios.post('https://b41f7b32.ngrok.io/api/scores/'+subject.id+'/subjects',config,{score: Score}).
        // then(response=>console.log(response.data.data))
        //     .catch((error)=>{
        //         this.props.navigation.navigate('Login');
        //     })
    }

    render() {
        const screenWidth = Dimensions.get('window').width
        const {navigation} = this.props;
        const itemId = navigation.getParam('id', null);
        const Score = navigation.getParam('Score', 0);
        const subject = navigation.getParam('subject', null);
        const data = [Score / 100, 0.25, 0.5, 0.75]
        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent>
                            <Icon name='menu'/>
                        </Button>
                    </Left>
                    <Body>
                    <Title><Text>Total score</Text></Title>
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
                                <Image source={{uri: subject.subject_avatar_url}}
                                       style={{height: 200, width: '100%', flex: 1}}/>
                            </CardItem>
                        </Card>
                        <ProgressChart
                            data={data}
                            width={screenWidth}
                            height={220}
                            chartConfig={{
                                backgroundColor: '#ffffff',
                                backgroundGradientFrom: '#fb8c00',
                                backgroundGradientTo: '#ffa726',
                                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                style: {
                                    borderRadius: 16
                                }
                            }}
                        />
                    </ScrollView>
                </Content>
            </Container>
        )
    }
}