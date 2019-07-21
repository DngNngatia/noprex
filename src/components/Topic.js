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
    Item,
    Body,
    Icon,
    Text,
    Input,
    Footer,
    FooterTab
} from 'native-base';
import axios from 'axios'
import {Linking, TouchableOpacity, View} from 'react-native';
import SvgUri from 'react-native-svg-uri';
import ViewMoreText from 'react-native-view-more-text';


export default class Topic extends Component {
    state = {
        search: '',
        topics: [],
        currentPage: 1,
        nextPageUrl: null,
        prevPageUrl: null,
        total: null,
        query: '',
        message: '',
        popup: false
    };

    openLink(url) {
        if (url) {
            Linking.openURL(url).catch((err) => console.error('An error occurred', err));
        }
    }

    static renderViewMore(onPress) {
        return (
            <Text style={{color: 'blue'}} onPress={onPress}>View more</Text>
        )
    }

    static renderViewLess(onPress) {
        return (
            <Text style={{color: 'blue'}} onPress={onPress}>View less</Text>
        )
    }

    nextPage() {
        this.setState({topics: []})
        const {navigation} = this.props;
        const token = navigation.getParam('token', null);
        let config = {
            headers: {'Authorization': "Bearer " + token}
        };
        axios.get(this.state.nextPageUrl, config).then(response => {
            console.log(response.data)
            if (response.data.message === "No results found" || response.data.message === "Search query is empty!!" || response.data.message === "success") {
                this.setState({
                    message: response.data.message,
                    total: response.data.data.total,
                    prevPageUrl: response.data.data.prev_page_url,
                    topics: response.data.data.data,
                    currentPage: response.data.data.current_page,
                    nextPageUrl: response.data.data.next_page_url
                })
            } else {
                this.setState({
                    message: response.data.message,
                    total: response.data.data.total,
                    prevPageUrl: response.data.data.prev_page_url !== null ? 'http://noprex.tk/api/search/topic/' + this.state.query + response.data.data.prev_page_url : null,
                    topics: response.data.data.data,
                    currentPage: response.data.data.current_page,
                    nextPageUrl: response.data.data.next_page_url !== null ? 'http://noprex.tk/api/search/topic/' + this.state.query + response.data.data.next_page_url : null
                })
            }
        }).catch((error) => {
            console.log(error.response)
            //this.props.navigation.navigate('Login');
        })
    }

    previousPage() {
        this.setState({topics: []})
        const {navigation} = this.props;
        const token = navigation.getParam('token', null);
        let config = {
            headers: {'Authorization': "Bearer " + token}
        };
        console.log(this.state.prevPageUrl)
        axios.get(this.state.prevPageUrl, config).then(response => {
            if (response.data.message === "No results found" || response.data.message === "Search query is empty!!") {
                this.setState({
                    message: response.data.message,
                    total: response.data.data.total,
                    prevPageUrl: response.data.data.prev_page_url,
                    topics: response.data.data.data,
                    currentPage: response.data.data.current_page,
                    nextPageUrl: response.data.data.next_page_url
                })
            } else {
                this.setState({
                    message: response.data.message,
                    total: response.data.data.total,
                    prevPageUrl: response.data.data.prev_page_url !== null ? 'http://noprex.tk/api/search/topic/' + this.state.query + response.data.data.prev_page_url : null,
                    topics: response.data.data.data,
                    currentPage: response.data.data.current_page,
                    nextPageUrl: response.data.data.next_page_url !== null ? 'http://noprex.tk/api/search/topic/' + this.state.query + response.data.data.next_page_url : null
                })
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    componentWillMount() {
        const {navigation} = this.props;
        const token = navigation.getParam('token', null);
        let config = {
            headers: {'Authorization': "Bearer " + token}
        };
        axios.get('http://noprex.tk/api/topics', config).then(response => this.setState({
            total: response.data.data.total,
            prevPageUrl: response.data.data.prev_page_url,
            topics: response.data.data.data,
            currentPage: response.data.data.current_page,
            nextPageUrl: response.data.data.next_page_url
        })).catch((error) => {
            this.props.navigation.navigate('Login');
        })
    }

    searchBar(value) {
        this.setState({query: value, message: ''})
        if (value === '') {
            this.setState({topics: []})
            const {navigation} = this.props;
            const token = navigation.getParam('token', null);
            let config = {
                headers: {'Authorization': "Bearer " + token}
            };
            axios.get('http://noprex.tk/api/topics', config).then(response => this.setState({
                total: response.data.data.total,
                prevPageUrl: response.data.data.prev_page_url,
                topics: response.data.data.data,
                currentPage: response.data.data.current_page,
                nextPageUrl: response.data.data.next_page_url
            })).catch((error) => {
                this.props.navigation.navigate('Login');
            })
        }

    }

    startSearch() {
        if (this.state.query !== '') {
            this.setState({topics: []})
            const {navigation} = this.props;
            const token = navigation.getParam('token', null);
            let config = {
                headers: {'Authorization': "Bearer " + token}
            };
            axios.get('http://noprex.tk/api/search/topic/' + this.state.query, config).then(response => {
                if (response.data.message === "No results found" || response.data.message === "Search query is empty!!") {
                    this.setState({
                        message: response.data.message,
                        total: response.data.data.total,
                        prevPageUrl: response.data.data.prev_page_url,
                        topics: response.data.data.data,
                        currentPage: response.data.data.current_page,
                        nextPageUrl: response.data.data.next_page_url
                    })
                } else {
                    this.setState({
                        message: response.data.message,
                        total: response.data.data.total,
                        prevPageUrl: response.data.data.prev_page_url !== null ? 'http://noprex.tk/api/search/topic/' + this.state.query + response.data.data.prev_page_url : null,
                        topics: response.data.data.data,
                        currentPage: response.data.data.current_page,
                        nextPageUrl: response.data.data.next_page_url !== null ? 'http://noprex.tk/api/search/topic/' + this.state.query + response.data.data.next_page_url : null
                    })
                }
            }).catch((error) => {
                this.props.navigation.navigate('Login');
            })
        }
    }


    render() {
        const {navigation} = this.props;
        const token = navigation.getParam('token', null);
        return (
            <Container>
                <Header searchBar rounded>
                    <Item style={{flex: 1, backgroundColor: 'white'}}>
                        <Button transparent onPress={() => this.props.navigation.openDrawer()}>
                            <Icon name='menu'/>
                        </Button>
                        <Input onChangeText={(value) => this.searchBar(value)} placeholder="Search here ..."/>
                        <Button style={{marginTop: 5, marginRight: 5}} small dark onPress={() => this.startSearch()}>
                            <Icon name="ios-search"/>
                        </Button>
                    </Item>
                </Header>
                <Content>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        {
                            this.state.message !== '' ? <Text style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 20
                            }}>{this.state.message}</Text> : <Text/>
                        }
                        {
                            this.state.topics.length ? <List>
                                {
                                    this.state.topics.map((topic, i) => (
                                        <ListItem key={i}>
                                            <TouchableOpacity
                                                onPress={() => this.props.navigation.navigate('Subjects', {
                                                    id: topic.id,
                                                    topic: topic.topic_name,
                                                    topic_avatar: topic.topic_avatar_url,
                                                    token: token
                                                })}>
                                                <Card>
                                                    <CardItem>
                                                        <Left>
                                                        <Text style={{
                                                            fontSize: 23,
                                                            flex: 1,
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}>{topic.topic_name}</Text>
                                                        </Left>
                                                        <Right>
                                                            <Button transparent onPress={() => this.openLink(topic.link)}>
                                                                <Icon name='link'/>
                                                            </Button>
                                                        </Right>
                                                    </CardItem>
                                                    <CardItem cardBody>
                                                        <SvgUri
                                                            width="300"
                                                            height="200"
                                                            source={{
                                                                uri: 'http://noprex.tk' + topic.topic_avatar_url,
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
                            </List> : <Spinner color='red'/>
                        }
                    </View>
                </Content>
            </Container>
        );

    }

}




