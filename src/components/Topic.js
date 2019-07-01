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
import {Image, TouchableOpacity, View} from 'react-native';
import SvgUri from 'react-native-svg-uri';
import ViewMoreText from 'react-native-view-more-text';



export default class Topic extends Component {
    state = {
        topics: []
    };
    static renderViewMore(onPress){
        return(
            <Text style={{color: 'blue'}} onPress={onPress}>View more</Text>
        )
    }
    static renderViewLess(onPress){
        return(
            <Text style={{color: 'blue'}} onPress={onPress}>View less</Text>
        )
    }
    componentWillMount() {
        const {navigation} = this.props;
        const token = navigation.getParam('token', null);
        let config = {
            headers: {'Authorization': "Bearer " + token}
        };
        axios.get('http://noprex.tk/api/topics', config).
        then(response => this.setState({topics: response.data.data.data})).catch((error)=>{
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
                        <Button transparent onPress={() => this.props.navigation.openDrawer()}>
                            <Icon name='menu'/>
                        </Button>
                    </Left>
                    <Body>
                    <Title><Text>Topics</Text></Title>
                    </Body>
                    <Right/>
                </Header>
                <Content>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    {
                        this.state.topics.length ? <List>
                            {
                                this.state.topics.map((topic, i) => (
                                    <ListItem key={i}>
                                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Subjects', {
                                            id: topic.id,
                                            topic: topic.topic_name,
                                            topic_avatar: topic.topic_avatar_url,
                                            token: token
                                        })}>
                                            <Card>
                                                <CardItem>
                                                    <Text style={{fontSize: 23, flex: 1, alignItems: 'center', justifyContent: 'center'}}>{topic.topic_name}</Text>
                                                </CardItem>
                                                <CardItem cardBody>
                                                    <SvgUri
                                                        width="300"
                                                        height="200"
                                                        source={{
                                                            uri: 'http://noprex.tk'+topic.topic_avatar_url,
                                                        }}
                                                    />
                                                </CardItem>
                                                <CardItem>
                                                    <ViewMoreText
                                                        numberOfLines={1}
                                                        renderViewMore={Topic.renderViewMore}
                                                        renderViewLess={Topic.renderViewLess}
                                                        textStyle={{textAlign: 'center'}}
                                                    >
                                                        <Text>
                                                            {topic.description}
                                                        </Text>
                                                    </ViewMoreText>
                                                </CardItem>
                                            </Card>
                                        </TouchableOpacity>
                                    </ListItem>

                                ))
                            }
                        </List> : <Spinner color='red'/>
                    }

                </View>
                </Content>
            </Container>
        );
    }
}



