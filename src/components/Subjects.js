import React, { Component } from 'react';
import {  Container,List,Spinner, ListItem, Header, Title, Content, Card, CardItem, Button, Left, Right, Body, Icon, Text } from 'native-base';
import axios from 'axios'
import { Image,TouchableOpacity } from 'react-native';

export default class Subjects extends Component{

    state={
        subjects: []
    };
    componentWillMount(){
        const { navigation } = this.props;
        const itemId = navigation.getParam('id', null);
        const token = navigation.getParam('token', null);
        var config = {
            headers: {'Authorization': "Bearer " + token}
        };
        axios.get('https://b41f7b32.ngrok.io/api/subjects/'+itemId,config).
        then(response=>this.setState({subjects: response.data.data}))
            .catch((error)=>{
                this.props.navigation.navigate('Login');
            })
    }
    render(){
        const { navigation } = this.props;
        const topic = navigation.getParam('topic', 'Unknown');
        const token = navigation.getParam('token', null);
        return(
            <Container>
                <Header>
                    <Left>
                        <Button transparent>
                            <Icon name='menu' />
                        </Button>
                    </Left>
                    <Body>
                    <Title><Text>{topic} Subjects</Text></Title>
                    </Body>
                    <Right />
                </Header>
                <Content>
                    {this.state.subjects.length ?  <List>
                        {
                            this.state.subjects.map((subject,i)=>(
                                <ListItem key={i}>
                                <TouchableOpacity onPress={()=>this.props.navigation.navigate('Questions',{id: subject.id,subject: subject,token: token})}>
                                    <Card >
                                        <CardItem>
                                            <Text>{subject.subject_name}</Text>
                                        </CardItem>
                                        <CardItem cardBody>
                                            <Image source={{uri: subject.subject_avatar_url}} style={{height: 200, width: null, flex: 1}}/>
                                        </CardItem>
                                        <CardItem>
                                            <Text> {subject.created_at}</Text>
                                        </CardItem>
                                    </Card>
                                </TouchableOpacity>
                                </ListItem>
                            ))
                        }
                    </List> : <Spinner color='blue' />}

                </Content>
            </Container>

        );
    }
}