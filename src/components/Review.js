import React, {Component} from 'react';
import {ScrollView} from 'react-native';
import {
    Container,
    Header,
    Button,
    View,
    Card,
    Spinner,
    CardItem,
    List,
    Content,
    ListItem,
    Title,
    Right,
    Text,
    Left,
    Body,
    Icon
} from 'native-base';
import axios from 'axios'

export default class Review extends Component {
    state = {
        questions: [],
        index: 0,
        Score: 0,
        timeGiven: 20,
        ListClickDisabled: true,
        answer_correct: 0,
        counter: true,
        empty: false
    }

    componentWillMount() {
        const {navigation} = this.props;
        const itemId = navigation.getParam('id', null);
        const token = navigation.getParam('token', null);
        let config = {
            headers: {'Authorization': "Bearer " + token}
        };
        axios.get('http://noprex.tk/api/questions/' + itemId, config)
            .then(response => {
                if (response.data.data.length === 0) {
                    this.setState({
                        empty: true
                    })
                }
                this.setState({questions: response.data.data})
            })
            .catch((error) => {
                this.props.navigation.navigate('Login');
            })
    }

    render() {
        const {navigation} = this.props;
        const subject = navigation.getParam('subject', null);
        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name='arrow-back'/>
                        </Button>
                    </Left>
                    <Body>
                        <Title><Text>{subject.subject_name}</Text></Title>
                    </Body>
                    <Right/>
                </Header>
                <Content>
                    <ScrollView>
                        {this.state.questions.length > 0 && this.state.index !== this.state.questions.length - 1 ?
                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                <Card style={{elevation: 3, width: '100%'}}>
                                    <CardItem cardBody style={{flexDirection: 'column', flex: 1}}>
                                        <Text style={{
                                            fontFamily: 'sans-serif-medium',
                                            fontSize: 18
                                        }}>{this.state.questions[this.state.index].question}</Text>
                                    </CardItem>
                                    <CardItem>
                                        <List style={{flexDirection: 'column', flex: 2}}>

                                            {
                                                this.state.questions[this.state.index].answer.map((answer, i) => {
                                                    return this.state.questions[this.state.index].correct_answer === i ?
                                                        <ListItem style={{backgroundColor: 'green'}} key={i}>
                                                            <Text style={{
                                                                fontFamily: 'sans-serif-thin',
                                                                fontSize: 18
                                                            }}>{i + 1}. {answer.answer}</Text>
                                                        </ListItem> : <ListItem key={i}>
                                                            <Text style={{
                                                                fontFamily: 'sans-serif-thin',
                                                                fontSize: 18
                                                            }}>{i + 1}. {answer.answer}</Text>
                                                        </ListItem>
                                                })
                                            }
                                        </List>
                                    </CardItem>
                                    <CardItem>
                                        <Button style={{flex: 1, alignItems: 'center'}}
                                                onPress={() => this.setState({
                                                    answer_correct: 0,
                                                    counter: true,
                                                    ListClickDisabled: true,
                                                    index: this.state.index + 1,
                                                })}>
                                            <Text>Next Question</Text>
                                        </Button>
                                    </CardItem>
                                </Card>
                            </View> : this.state.questions.length === 0 ?
                                this.state.empty ?
                                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                        <Text>Please attempt one quiz for review to be available.</Text>
                                    </View> : <Spinner color='red'/> :
                                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                    <Text>The end!</Text>
                                </View>}
                    </ScrollView>
                </Content>
            </Container>


        );
    }
}