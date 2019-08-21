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
import Comments from './Comments'
import {ScrollView, TouchableOpacity, View, Alert} from 'react-native';
import Emoji from 'react-native-emoji';
import Admob from "./Admob";


export default class Subjects extends Component {

    state = {
        subjects: [],
        empty: false,
        topics: [],
        loading: false,
        currentPage: null,
        nextPageUrl: null,
        prevPageUrl: null,
        total: null,
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

    nextPage() {
        this.setState({topics: []});
        const {navigation} = this.props;
        const token = navigation.getParam('token', null);
        let config = {
            headers: {'Authorization': "Bearer " + token}
        };
        axios.get(this.state.nextPageUrl, config).then(response => {
            this.setState({
                total: response.data.data.total,
                prevPageUrl: response.data.data.prev_page_url !== null ? response.data.data.prev_page_url : null,
                topics: response.data.data.data,
                currentPage: response.data.data.current_page,
                nextPageUrl: response.data.data.next_page_url !== null ? response.data.data.next_page_url : null
            })
        }).catch((error) => {
            console.log(error.response)
        })
    }

    previousPage() {
        this.setState({topics: []})
        const {navigation} = this.props;
        const token = navigation.getParam('token', null);
        let config = {
            headers: {'Authorization': "Bearer " + token}
        };
        axios.get(this.state.prevPageUrl, config).then(response => {
            this.setState({
                total: response.data.data.total,
                prevPageUrl: response.data.data.prev_page_url !== null ? response.data.data.prev_page_url : null,
                topics: response.data.data.data,
                currentPage: response.data.data.current_page,
                nextPageUrl: response.data.data.next_page_url !== null ? response.data.data.next_page_url : null
            })
        }).catch((error) => {
            console.log(error)
        })
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
        }).catch((error) => {
            this.props.navigation.navigate('Login');
        })
    }

    renderAvailable() {
        if (this.state.currentPage === null) {
            const {navigation} = this.props;
            const token = navigation.getParam('token', null);
            let config = {
                headers: {'Authorization': "Bearer " + token}
            };
            axios.get('http://noprex.tk/api/topics/available', config).then(response => {
                if (response.data.data.data.length === 0) {
                    let available = [{
                        subject_name: 'Congrats you have completed all quizzes',
                        id: 'xxyy'
                    }]
                    this.setState({topics: available})
                } else {
                    this.setState({
                        total: response.data.data.total,
                        prevPageUrl: response.data.data.prev_page_url !== null ? response.data.data.prev_page_url : null,
                        topics: response.data.data.data,
                        currentPage: response.data.data.current_page,
                        nextPageUrl: response.data.data.next_page_url !== null ? response.data.data.next_page_url : null
                    })
                }
            }).catch((error) => {
            })
            return this.state.topics.length ?
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{color: 'green', fontSize: 18, fontFamily: 'sans-serif-light'}}>Already
                        available</Text>
                    <List>
                        {
                            this.state.topics.map((topic, i) => (
                                <ListItem key={i} style={{flexDirection: 'column'}}>
                                    <Text>{topic.subject_name}  </Text>
                                    {topic.id === 'xxyy' ? <Text/> :
                                        <Button onPress={() => this.props.navigation.navigate('Questions', {
                                            id: topic.id,
                                            subject: topic,
                                            token: token
                                        })} style={{marginTop: 6}} small success><Text>Measure
                                            Now</Text></Button>
                                    }

                                </ListItem>
                            ))
                        }
                        <Footer>
                            <FooterTab>
                                {
                                    this.state.prevPageUrl != null ?
                                        <Button onPress={() => this.previousPage()} dark iconLeft>
                                            <Icon name="arrow-back"/>
                                            <Text>Previous</Text>
                                        </Button> : <Button disabled iconLeft light>
                                            <Icon name="arrow-back"/>
                                            <Text>Previous</Text>
                                        </Button>
                                }
                                <Text> </Text>
                                {
                                    this.state.nextPageUrl != null ?
                                        <Button onPress={() => this.nextPage()} iconRight dark>
                                            <Text>Next Page</Text>
                                            <Icon name="arrow-forward"/>
                                        </Button> : <Button disabled iconRight light>
                                            <Text>Next Page</Text>
                                            <Icon name="arrow-forward"/>
                                        </Button>

                                }
                            </FooterTab>
                        </Footer>
                    </List>
                </View> : <Spinner color='red'/>
        } else {
            const {navigation} = this.props;
            const token = navigation.getParam('token', null);
            return this.state.topics.length ?
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{color: 'green', fontSize: 18, fontFamily: 'sans-serif-light'}}>Already
                        available</Text>
                    <List>
                        {
                            this.state.topics.map((topic, i) => (
                                <ListItem key={i} style={{flexDirection: 'column'}}>
                                    <Text>{topic.subject_name}  </Text>
                                    {topic.id === 'xxyy' ? <Text/> :
                                        <Button onPress={() => this.props.navigation.navigate('Questions', {
                                            id: topic.id,
                                            subject: topic,
                                            token: token
                                        })} style={{marginTop: 6}} small success><Text>Measure
                                            Now</Text></Button>
                                    }

                                </ListItem>
                            ))
                        }
                        <Footer>
                            <FooterTab>
                                {
                                    this.state.prevPageUrl != null ?
                                        <Button onPress={() => this.previousPage()} dark iconLeft>
                                            <Icon name="arrow-back"/>
                                            <Text>Previous</Text>
                                        </Button> : <Button disabled iconLeft light>
                                            <Icon name="arrow-back"/>
                                            <Text>Previous</Text>
                                        </Button>
                                }
                                <Text> </Text>
                                {
                                    this.state.nextPageUrl != null ?
                                        <Button onPress={() => this.nextPage()} iconRight dark>
                                            <Text>Next Page</Text>
                                            <Icon name="arrow-forward"/>
                                        </Button> : <Button disabled iconRight light>
                                            <Text>Next Page</Text>
                                            <Icon name="arrow-forward"/>
                                        </Button>

                                }
                            </FooterTab>
                        </Footer>
                    </List>
                </View> : <Spinner color='red'/>
        }

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
                                            Alert.alert(
                                                'Assessment',
                                                'The countdown will start once you click start assessment 🕐🕐🕐🕐🕐🕐🕐🕐. Make sure you are in a quiet and peaceful location',
                                                [
                                                    {
                                                        text: 'Cancel',
                                                        onPress: () => console.log('Cancel Pressed'),
                                                        style: 'cancel',
                                                    },
                                                    {
                                                        text: 'Start assessment', onPress: () => {
                                                            this.props.navigation.navigate('Questions', {
                                                                id: subject.id,
                                                                subject: subject,
                                                                token: token
                                                            })
                                                        }
                                                    },
                                                ],
                                                {cancelable: true},
                                            );
                                        }}>
                                            <Card style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                                <CardItem>
                                                    <Text style={{
                                                        fontFamily: 'sans-serif-medium',
                                                        fontSize: 18
                                                    }}>{subject.subject_name}</Text>
                                                    <Admob/>
                                                </CardItem>
                                                <CardItem>
                                                    <Left>
                                                        <Button light onPress={() => this.like(subject)}>
                                                            {
                                                                this.state.loading ? <Icon active name="train"/> :
                                                                    <Icon color='blue' active name="thumbs-up"/>
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
                                                                    <Icon color='blue' active name="thumbs-down"/>
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