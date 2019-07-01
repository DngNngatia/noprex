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
    Text
} from 'native-base';
import axios from 'axios'
import {Image, TouchableOpacity, View, Alert} from 'react-native';
import SvgUri from 'react-native-svg-uri';
import Emoji from 'react-native-emoji';


export default class Subjects extends Component {

    state = {
        subjects: [],
        empty: false
    };

    componentWillMount() {
        const {navigation} = this.props;
        const itemId = navigation.getParam('id', null);
        const token = navigation.getParam('token', null);
        var config = {
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

    render() {
        const {navigation} = this.props;
        const topic = navigation.getParam('topic', 'Unknown');
        const token = navigation.getParam('token', null);
        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent>
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
                                            if (subject.score===null || subject.score.attempts < 3) {
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
                                                    <Text style={{fontSize: 18}}>{subject.subject_name}</Text>
                                                </CardItem>
                                                <CardItem>
                                                    <Text> {subject.created_at}</Text>
                                                </CardItem>
                                            </Card>
                                        </TouchableOpacity>
                                    </ListItem>
                                ))
                            }
                        </List> : this.state.empty ?
                            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}><Text
                                style={{fontSize: 20}}>No Subjects found for this topic</Text><Emoji name="disappointed"
                                                                                                     style={{fontSize: 100}}/><Emoji
                                name="rocket" style={{fontSize: 100}}/></View> : <Spinner color='blue'/>}
                    </View>
                </Content>
            </Container>

        );
    }
}