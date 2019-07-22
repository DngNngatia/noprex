import React, {Component} from 'react';
import {
    Container,
    List,
    Spinner,
    ListItem,
    Header,
    Title,
    Content,
    Card,
    CardItem,
    Button,
    Left,
    Right,
    Body,
    Icon,
    Text, Footer, FooterTab
} from 'native-base';
import axios from 'axios'
import {ScrollView, TouchableOpacity, View, Alert} from 'react-native';
import SvgUri from 'react-native-svg-uri';
import Emoji from 'react-native-emoji';
import ViewMoreText from "react-native-view-more-text";


export default class Subjects extends Component {

    state = {
        subjects: [],
        empty: false,
        topics: [],
        loading: false
    };

    like(subject) {
        const {navigation} = this.props;
        const token = navigation.getParam('token', null);
        let config = {
            headers: {'Authorization': "Bearer " + token}
        };
        this.setState({loading: true})
        axios.get('http://noprex.tk/api/like/' + subject.id, config).then((response) => {
            this.setState({subjects: response.data.data, loading: false})
            console.log(response.data.data)
        }).catch((error) => {
            console.log(error)
        })
    }

    dislike(subject) {
        const {navigation} = this.props;
        const token = navigation.getParam('token', null);
        let config = {
            headers: {'Authorization': "Bearer " + token}
        };
        this.setState({loading: true})
        axios.get('http://noprex.tk/api/dislike/' + subject.id, config).then((response) => {
            this.setState({subjects: response.data.data, loading: false})
        }).catch((error) => {
            console.log(error)
            this.setState({loading: false})

        })
        console.log(this.state)
    }

    componentWillMount() {
        const {navigation} = this.props;
        const itemId = navigation.getParam('id', null);
        const token = navigation.getParam('token', null);
        let config = {
            headers: {'Authorization': "Bearer " + token}
        };
        axios.get('http://noprex.tk/api/subjects/' + itemId, config).then(response => {
            this.setState({subjects: response.data.data})
            if (response.data.data.length === 0) {
                this.setState({empty: true})
            }
        })
            .catch((error) => {
                this.props.navigation.navigate('Login');
            })
    }

    renderAvailable() {
        const {navigation} = this.props;
        const token = navigation.getParam('token', null);
        let config = {
            headers: {'Authorization': "Bearer " + token}
        };
        axios.get('http://noprex.tk/api/topics/available', config).then(response => {
            this.setState({topics: response.data.data})
        }).catch((error) => {
        })
        return this.state.topics.length ?
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{color: 'green', fontSize: 18, fontFamily: 'sans-serif-light'}}>Already available</Text>
                <List>
                    {
                        this.state.topics.map((topic, i) => (
                            <ListItem key={i} style={{borderWidth: 2, borderColor: 'black', flexDirection: 'column'}}>
                                <Text>{topic.subject_name}  </Text>
                                <Button onPress={() => this.props.navigation.navigate('Questions', {
                                    id: topic.id,
                                    subject: topic,
                                    token: token
                                })} small transparent style={{borderColor: 'yellow', borderWidth: 1, margin: 5}}><Text>Measure
                                    Now</Text></Button>
                            </ListItem>
                        ))
                    }
                </List>
            </View> : <Spinner color='red'/>

    }

    render() {
        const {navigation} = this.props;
        const topic = navigation.getParam('topic', 'Unknown');
        const token = navigation.getParam('token', null);
        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name='arrow-back'/>
                        </Button>
                    </Left>
                    <Body>
                        <Title><Text>{topic}</Text></Title>
                    </Body>
                    <Right/>
                </Header>
                <Content>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        {this.state.subjects.length ? <List>
                            {
                                this.state.subjects.map((subject, i) => (
                                    <ListItem key={i}>
                                        <TouchableOpacity onPress={() => {
                                            if (subject.score === null || subject.score.attempts < 3) {
                                                this.props.navigation.navigate('Questions', {
                                                    id: subject.id,
                                                    subject: subject,
                                                    token: token
                                                })
                                            } else {
                                                Alert.alert(
                                                    'Sorry, Maximum Attempts!!',
                                                    'You have reached the maximum number of tries for this subject.Please check for more of our topics on the platform.',
                                                    [
                                                        {
                                                            text: 'Cancel',
                                                            onPress: () => console.log('Cancel Pressed'),
                                                            style: 'cancel',
                                                        },
                                                        {text: 'OK', onPress: () => console.log('OK Pressed')},
                                                    ],
                                                    {cancelable: true},
                                                );
                                            }
                                        }}>
                                            <Card style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                                <CardItem>
                                                    <Text style={{
                                                        fontFamily: 'sans-serif-medium',
                                                        fontSize: 18
                                                    }}>{subject.subject_name}</Text>
                                                </CardItem>
                                                <CardItem>
                                                    <Left>
                                                        <Button light onPress={() => this.like(subject)}>
                                                            {
                                                                this.state.loading ? <Icon active name="train"/> :
                                                                    <Icon active name="thumbs-up"/>
                                                            }

                                                            <Text>{subject.likes}</Text>
                                                        </Button>

                                                    </Left>
                                                    <Body>
                                                        <Button light onPress={() =>
                                                            this.props.navigation.navigate('Comments', {
                                                                token: token,
                                                                comments: subject.comments,
                                                                subject_id: subject.id
                                                            })
                                                        }>
                                                            <Icon active name="chatbubbles"/>
                                                            <Text>{subject.no_comments}</Text>
                                                        </Button>
                                                    </Body>
                                                    <Right>
                                                        <Button light onPress={() => this.dislike(subject)}>
                                                            {
                                                                this.state.loading ? <Icon active name="train"/> :
                                                                    <Icon active name="thumbs-down"/>
                                                            }
                                                            <Text>{subject.dislikes}</Text>
                                                        </Button>
                                                    </Right>
                                                </CardItem>
                                            </Card>
                                        </TouchableOpacity>
                                    </ListItem>
                                ))
                            }
                        </List> : this.state.empty ?
                            <ScrollView
                                contentContainerStyle={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                <Text
                                    style={{fontSize: 20}}>
                                    No Subjects found for this topic</Text>
                                <Emoji name="disappointed" style={{fontSize: 100}}/>
                                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                    {this.renderAvailable()}
                                </View>

                            </ScrollView> : <Spinner color='blue'/>}
                    </View>
                </Content>
            </Container>

        );
    }
}