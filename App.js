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
import {Image, TouchableOpacity} from 'react-native';
import {createStackNavigator, createAppContainer} from "react-navigation";
import Subjects from './src/components/Subjects'
import Questions from './src/components/Questions'
import Score from './src/components/Score'
import Login from './src/components/Auth/Login'
import Register from './src/components/Auth/Register'

class App extends Component {
    state = {
        topics: []
    };

    componentWillMount() {
        const {navigation} = this.props;
        const token = navigation.getParam('token', null);
        var config = {
            headers: {'Authorization': "Bearer " + token}
        };
        axios.get('https://b41f7b32.ngrok.io/api/topics', config).
        then(response => this.setState({topics: response.data.data})).catch((error)=>{
            this.props.navigation.navigate('Login');
        })
    }

    render() {
        const {navigation} = this.props;
        const token = navigation.getParam('token', null);
        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent>
                            <Icon name='menu'/>
                        </Button>
                    </Left>
                    <Body>
                    <Title>Novice, Proficient, Expert</Title>
                    </Body>
                    <Right/>
                </Header>
                <Content>
                    {
                        this.state.topics.length ? <List>
                            {
                                this.state.topics.map((topic, i) => (
                                    <ListItem key={i}>
                                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Subjects', {
                                            id: topic.id,
                                            topic: topic.topic_name,
                                            token: token
                                        })}>
                                            <Card>
                                                <CardItem>
                                                    <Text>{topic.topic_name}</Text>
                                                </CardItem>
                                                <CardItem cardBody>
                                                    <Image source={{uri: topic.topic_avatar_url}}
                                                           style={{height: 200, width: null, flex: 1}}/>
                                                </CardItem>
                                                <CardItem>
                                                    <Text> {topic.created_at}</Text>
                                                </CardItem>
                                            </Card>
                                        </TouchableOpacity>
                                    </ListItem>

                                ))
                            }
                        </List> : <Spinner color='red'/>
                    }

                </Content>
            </Container>
        );
    }
}

const AppNavigator = createStackNavigator({
        Home: App,
        Subjects: Subjects,
        Questions: Questions,
        Score: Score,
        Login: Login,
        Register: Register
    },
    {
        initialRouteName: "Login",
        headerMode: 'none',
        navigationOptions: {
            headerVisible: false,
        },
    }
);

export default createAppContainer(AppNavigator);


