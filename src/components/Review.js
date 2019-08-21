import React, {Component} from 'react';
import {Dimensions, ScrollView} from 'react-native';
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
import HTML from "react-native-render-html";

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
                                <Card style={{elevation: 3, width: '100%', marginTop: '10%'}}>
                                    <CardItem cardBody style={{flexDirection: 'column', flex: 1}}>
                                        <HTML
                                              html={'<div style="font-size: large; color: black; margin: 5%">' + this.state.questions[this.state.index].question + '</div>'}
                                              imagesMaxWidth={Dimensions.get('window').width}/>
                                    </CardItem>
                                    <CardItem>
                                        <List style={{flexDirection: 'column', flex: 2}}>

                                            {
                                                this.state.questions[this.state.index].answer.map((answer, i) => {
                                                    return this.state.questions[this.state.index].correct_answer === i ?
                                                        <ListItem style={{backgroundColor: 'green'}} key={i}>
                                                            <HTML
                                                                  html={'<div style="font-size: large; width: 100%">' + (i + 1)+ '. ' + answer.answer + '</div>'}
                                                                  imagesMaxWidth={Dimensions.get('window').width}/>
                                                        </ListItem> : <ListItem key={i}>
                                                            <HTML
                                                                html={'<div style="font-size: large; width: 100%">' + (i + 1) + '. ' + answer.answer + '</div>'}
                                                                imagesMaxWidth={Dimensions.get('window').width}/>
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