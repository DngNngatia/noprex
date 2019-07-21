import React, {Component} from 'react';
import {
    Spinner,
    Container, Header, Title, Content, Card, CardItem, Button, Left, Right, Body, Icon, Text
} from 'native-base';
import {GiftedChat} from 'react-native-gifted-chat'
import axios from "axios";

export default class Comments extends Component {
    state = {
        messages: [],
        user: null
    }

    componentWillMount() {
        const {navigation} = this.props;
        const comments = navigation.getParam('comments', []);
        const token = navigation.getParam('token', null);
        let config = {
            headers: {'Authorization': "Bearer " + token}
        };
        axios.get('http://noprex.tk/api/user', config).then(response => this.setState({
            user: response.data
        })).catch((error) => {
            this.props.navigation.navigate('Login');
        })
        let items =[1,2];
        let messages = comments.map(function (comment) {
            return {
                _id: "" + comment.id,
                text: comment.comment,
                createdAt: comment.created_at,
                user: {
                    _id: items[Math.floor(Math.random()*items.length)],
                    name: comment.user.id,
                    avatar: 'http://noprex.tk/' + comment.user.profile_image,
                },
            }
        })
        this.setState({
            messages: messages,
        })
    }

    onSend(messages = []) {
        const {navigation} = this.props;
        const subject_id = navigation.getParam('subject_id', null);
        const token = navigation.getParam('token', null);
        messages.push(messages[0]);
        this.setState(previousState => ({
            messages: messages,
        }))
        let config = {
            headers: {'Authorization': "Bearer " + token}
        };
        axios.post('http://noprex.tk/api/comment/' + subject_id, {
            comment: messages[0].text
        }, config).then((response) => {
        }).catch((error) => {
            console.log(error)
        })
    }

    render() {
        let items =[1,2];
        return (
            this.state.user ?
                <Container>
                    <Header>
                        <Left>
                            <Button transparent onPress={() => this.props.navigation.goBack()}>
                                <Icon name='arrow-back'/>
                            </Button>
                        </Left>
                        <Body>
                            <Title><Text>Comments</Text></Title>
                        </Body>
                        <Right/>
                    </Header>
                    <GiftedChat

                        messages={this.state.messages}
                        onSend={messages => this.onSend(messages)}
                        isAnimated
                        keyboardShouldPersistTaps="never"
                        user={{
                            __id: items[Math.floor(Math.random()*items.length)],
                            avatar: 'http://noprex.tk/' + this.state.user.profile_image,
                        }}
                        showUserAvatar
                    />
                </Container>
                : <Spinner color='red'/>

        )
    }

}

