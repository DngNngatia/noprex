import React, {Component} from 'react';
import {
    Container,
    Text,
    Spinner,
    Button,
    View,
    List,
    ListItem,
    Content,
    Form,
    Item,
    Input,
    Label,
    Left, Icon, Body, Title, Right, Header
} from 'native-base';
import {Image} from 'react-native';
import axios from 'axios'
import image from '../images/icons/boy.png';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-picker';


export default class Profile extends Component {
    state = {
        name: '',
        email: '',
        title: '',
        profile_image: '',
        description: '',
        address: '',
        phone: '',
        token: '',
        spinner: false,
        preview: null,
        uri: null,
        error: ''
    }
    retrieveData = async () => {
        try {
            const value = await AsyncStorage.getItem('token');
            if (value !== null) {
                let config = {
                    headers: {'Authorization': "Bearer " + value}
                };
                axios.get('http://noprex.tk/api/user', config).then(response => this.setState({
                    name: response.data.name,
                    email: response.data.email,
                    title: response.data.title,
                    profile_image: response.data.preview,
                    description: response.data.description,
                    address: response.data.address,
                    phone: response.data.phone,
                    token: value
                })).catch((error) => {
                    this.props.navigation.navigate('Login');
                })
            }
        } catch (error) {
            console.log(error)
        }
    };

    componentDidMount(): void {
        this.retrieveData();

    }

    logout() {
        let config = {
            headers: {'Authorization': "Bearer " + this.state.token}
        };
        axios.post('http://noprex.tk/api/logout', null, config).then(response => {
            this.props.navigation.navigate('Login')
        }).catch((error) => console.log(error))

    }

    updateProfile() {
        if(this.state.name) {
            this.setState({spinner: true});
            let formData = new FormData();
            let config = {
                headers: {'Authorization': "Bearer " + this.state.token, "Content-Type": "multipart/form-data"}
            };
            formData.append("name", this.state.name);
            formData.append("address", this.state.address);
            formData.append("title", this.state.title);
            formData.append("description", this.state.description);
            formData.append("phone", this.state.phone);
            formData.append("profile_image", {uri: this.state.uri.uri, name: this.state.uri.fileName, type: 'image/*'});
            formData.append('Content-Type', 'image/*');


            axios.post('http://noprex.tk/api/user/update', formData, config).then(response => {
                console.log(response.data.data)
                this.setState({
                    name: response.data.data.name,
                    email: response.data.data.email,
                    title: response.data.data.title,
                    profile_image: response.data.data.profile_image,
                    description: response.data.data.description,
                    address: response.data.data.address,
                    phone: response.data.data.phone,
                    spinner: false
                })
            }).catch((error) => {
                this.props.navigation.navigate('Login');
            })
        }else{
            this.setState({error: 'Name is required'})
        }
    }

    uploadImage() {
        const options = {
            title: 'Select Avatar',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        ImagePicker.launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                const source = {uri: response.uri};
                this.setState({
                    preview: source,
                    uri: response
                });
            }
        });
    }

    render() {
        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.openDrawer()}>
                            <Icon name='menu'/>
                        </Button>
                    </Left>
                    <Body>
                        <Title><Text>Profile Settings</Text></Title>
                    </Body>
                    <Right/>
                </Header>
                <Content contentContainerStyle={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    {
                        this.state.error ?? <Text>{this.state.error}</Text>
                    }
                    <Image style={{height: 100, width: 100, borderRadius: 10, borderWidth: 3, borderColor: 'black'}}
                           source={this.state.profile_image ? {uri: 'http://noprex.tk/' + this.state.profile_image }: this.state.preview ? this.state.preview : image}/>
                    <Form style={{width: 300, padding: 10, margin: 5}}>
                        <Item>
                            <Button onPress={() => this.uploadImage()} light>
                                <Text>Profile photo</Text>
                            </Button>
                        </Item>
                        <Item>
                            <Input value={this.state.name} onChangeText={(value) => this.setState({name: value})}
                                   placeholder="Name"/>
                        </Item>
                        <Item>
                            <Input value={this.state.title} onChangeText={(value) => this.setState({title: value})}
                                   placeholder="Title"/>
                        </Item>
                        <Item>
                            <Input value={this.state.description}
                                   onChangeText={(value) => this.setState({description: value})}
                                   placeholder="Description"/>
                        </Item>
                        <Item>
                            <Input value={this.state.phone} onChangeText={(value) => this.setState({phone: value})}
                                   placeholder="Phone"/>
                        </Item>
                        <Item>
                            <Input value={this.state.address} onChangeText={(value) => this.setState({address: value})}
                                   placeholder="Address"/>
                        </Item>
                        {
                            this.state.spinner ? <Spinner/> :
                                <Button block onPress={() => this.updateProfile()}>
                                    <Text>Update</Text>
                                </Button>
                        }
                        <Button onPress={() => this.logout()} iconLeft light>
                            <Icon name='home'/>
                            <Text>Logout</Text>
                        </Button>
                    </Form>
                </Content>
            </Container>
        );
    }

}