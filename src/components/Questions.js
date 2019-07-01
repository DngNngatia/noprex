import React, {Component} from 'react';
import {Image, TouchableOpacity, AsyncStorage,ScrollView} from 'react-native';
import CountDown from 'react-native-countdown-component';
import {
    Container,
    Header,
    Button,
    View,
    DeckSwiper,
    Card,
    Spinner,
    CardItem,
    List,
    Content,
    ListItem,
    Thumbnail,
    Title,
    Right,
    Text,
    Left,
    Body,
    Icon
} from 'native-base';
import axios from 'axios'

export default class Questions extends Component {
    state = {
        questions: [],
        index: 0,
        Score: 0,
        timeGiven: 20,
        ListClickDisabled: true,
        answer_correct: 0,
        counter: true
    }

    componentWillMount() {
        const {navigation} = this.props;
        const itemId = navigation.getParam('id', null);
        const token = navigation.getParam('token', null);
        var config = {
            headers: {'Authorization': "Bearer " + token}
        };
        axios.get('http://noprex.tk/api/questions/' + itemId, config)
            .then(response => this.setState({questions: response.data.data}))
            .catch((error)=>{
                this.props.navigation.navigate('Login');
            })
    }

    updateState() {
        this.setState({
            Score: this.state.Score + 5,
            answer_correct: 1,
            counter: false,
            timeGiven: 0,
            ListClickDisabled: false
        })
    }

    render() {
        const {navigation} = this.props;
        const itemId = navigation.getParam('id', null);
        const subject = navigation.getParam('subject', null);
        const token = navigation.getParam('token', null);
        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent >
                            <Icon name='arrow-back'/>
                        </Button>
                    </Left>
                    <Body>
                    <Title><Text>{subject.subject_name}</Text></Title>
                    </Body>
                    <Right/>
                </Header>
                <Content>
                    <ScrollView contentContainerStyle={{flex: 1,justifyContent: 'center', alignItems: 'center'}}>
                        {this.state.questions.length > 0 && this.state.index !== this.state.questions.length - 1 ? <View>
                            <Card style={{elevation: 3, width: 330}}>
                                <CardItem >
                                    <CountDown
                                        until={this.state.questions[this.state.index].time_allocated}
                                        size={20}
                                        onFinish={() => this.setState({
                                            answer_correct: 2,
                                            counter: false,
                                            ListClickDisabled: false
                                        })}
                                    />
                                </CardItem>
                                <CardItem cardBody>
                                    <Text>{this.state.questions[this.state.index].question}</Text>
                                </CardItem>
                                <CardItem>
                                    <List>

                                        {
                                            this.state.questions[this.state.index].answer.map((answer, i) => (
                                                this.state.ListClickDisabled ?
                                                    <ListItem
                                                        onPress={() => this.state.questions[this.state.index].correct_answer === i ? this.updateState() : this.setState({
                                                            answer_correct: 2,
                                                            counter: false,
                                                            ListClickDisabled: false
                                                        })} key={i}>
                                                        <Text>{i + 1}. {answer.answer}</Text>
                                                    </ListItem>
                                                    :
                                                    <ListItem key={i}>
                                                        <Text>{i + 1}. {answer.answer}</Text>
                                                    </ListItem>

                                            ))
                                        }
                                    </List>
                                </CardItem>
                                <CardItem>
                                    {
                                        this.state.answer_correct === 0 ?
                                            null
                                            :
                                            this.state.answer_correct === 1 ? <Text style={{
                                                    backgroundColor: '#008000',
                                                    flex: 1,
                                                    fontSize: 20,
                                                    borderRadius: 10
                                                }}>Correct: Answer
                                                    is {this.state.questions[this.state.index].correct_answer + 1}</Text> :
                                                <Text style={{
                                                    borderRadius: 10,
                                                    backgroundColor: '#FF0000',
                                                    flex: 1,
                                                    fontSize: 20
                                                }}>Wrong: Answer
                                                    is {this.state.questions[this.state.index].correct_answer + 1} </Text>
                                    }
                                </CardItem>
                                <CardItem>
                                    {this.state.counter ?
                                        <Button style={{flex: 1, alignItems: 'center'}} disabled><Text>Next
                                            Question</Text></Button> :
                                        <Button style={{flex: 1, alignItems: 'center'}} onPress={() => this.setState({
                                            answer_correct: 0,
                                            counter: true,
                                            ListClickDisabled: true,
                                            index: this.state.index + 1,
                                        })}><Text>Next Question</Text></Button>}
                                </CardItem>
                            </Card>
                        </View> : this.state.questions.length === 0 ?
                            <Spinner/> : this.props.navigation.navigate('Score', {
                                id: itemId,
                                Score: this.state.Score,
                                subject: subject,
                                array_length: this.state.questions.length,
                                token: token
                            })}
                    </ScrollView>
                </Content>
            </Container>


        );
    }
}