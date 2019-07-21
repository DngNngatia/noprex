import React, {Component} from 'react';
import {Image, TouchableOpacity, AsyncStorage, ScrollView} from 'react-native';
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
import Snackbar from 'react-native-snackbar';

export default class Questions extends Component {
    state = {
        questions: [],
        index: 0,
        Score: 0,
        timeGiven: 20,
        ListClickDisabled: true,
        answer_correct: 0,
        counter: true,
        visible: false,
        message: '',
        empty: false
    }

    componentWillMount() {
        const {navigation} = this.props;
        const itemId = navigation.getParam('id', null);
        const token = navigation.getParam('token', null);
        var config = {
            headers: {'Authorization': "Bearer " + token}
        };
        axios.get('http://noprex.tk/api/questions/' + itemId, config)
            .then(response => {
                if (response.data.data.length === 0) {
                    this.setState({ empty : true})
                }
                this.setState({questions: response.data.data})
            })
            .catch((error) => {
                this.props.navigation.navigate('Login');
            })
    }

    updateState() {
        Snackbar.show({
            title: 'correct answer',
            backgroundColor: 'green',
            duration: Snackbar.LENGTH_LONG,
        });
        this.setState({
            Score: this.state.Score + 1,
            answer_correct: 1,
            counter: false,
            visible: true,
            message: 'correct answer',
            timeGiven: 0,
            ListClickDisabled: false
        })
    }
    wrongAnswer(){
        Snackbar.show({
            title: 'wrong answer',
            backgroundColor: 'red',
            duration: Snackbar.LENGTH_LONG,
        });
        this.setState({
            answer_correct: 2,
            visible: true,
            message: 'wrong answer',
            counter: false,
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
                        <Button transparent  onPress={() => this.props.navigation.goBack()}>
                            <Icon name='arrow-back'/>
                        </Button>
                    </Left>
                    <Body>
                        <Title><Text>{subject.subject_name}</Text></Title>
                    </Body>
                    <Right/>
                </Header>
                <Content>
                    <ScrollView contentContainerStyle={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        {subject.score!=null && subject.score.attempts > 0  ? <Text>Retaking {subject.subject_name}...</Text> :
                            <Text>All the best!!</Text>}
                        {this.state.questions.length > 0 && this.state.index !== this.state.questions.length - 1 ?
                            <View>
                                <Card style={{elevation: 3}}>
                                    <CardItem>
                                        <CountDown
                                            until={this.state.questions[this.state.index].time_allocated}
                                            size={20}
                                            onFinish={() => {
                                                if (this.state.answer_correct === 0 ){
                                                this.setState({
                                                    answer_correct: 2,
                                                    counter: false,
                                                    ListClickDisabled: false
                                                })
                                            }}}
                                        />
                                    </CardItem>
                                    <CardItem cardBody>
                                        <Text style={{ fontFamily: 'Roboto' }}>{this.state.questions[this.state.index].question}</Text>
                                    </CardItem>
                                    <CardItem>
                                        <List>

                                            {
                                                this.state.questions[this.state.index].answer.map((answer, i) => (
                                                    this.state.ListClickDisabled ?
                                                        <ListItem
                                                            onPress={() => this.state.questions[this.state.index].correct_answer === i ? this.updateState() : this.wrongAnswer()} key={i}>
                                                            <Text style={{ fontFamily: 'sans-serif-thin' }}>{i + 1}. {answer.answer}</Text>
                                                        </ListItem>
                                                        :
                                                        <ListItem key={i}>
                                                            <Text style={{ fontFamily: 'sans-serif-thin' }}>{i + 1}. {answer.answer}</Text>
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
                                            <Button style={{flex: 1, alignItems: 'center'}}
                                                    onPress={() => this.setState({
                                                        answer_correct: 0,
                                                        counter: true,
                                                        ListClickDisabled: true,
                                                        index: this.state.index + 1,
                                                    })}><Text>Next Question</Text></Button>}
                                    </CardItem>
                                </Card>
                            </View> : this.state.questions.length === 0 ?
                                this.state.empty ? <View style={{flex: 1, alignItems: 'center',justifyContent: 'center'}}>
                                    <Text>Oops!! something wrong on our end come back later.</Text>
                                </View> : <Spinner color='red'/> : this.props.navigation.navigate('Score', {
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