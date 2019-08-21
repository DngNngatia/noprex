import React, {Component} from 'react';
import {
    Container,
    Text,
    Spinner,
    Button,
    Content,
    Form,
    Item,
    Input,
    Label,
    Left, Icon, Body, Title, Right, Header
} from 'native-base';
import {Image, ScrollView, Alert} from 'react-native';
import axios from 'axios'
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
        error: '',
        spinner1: false,
        previewing: false
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
                    title: response.data.title === null ? '' : response.data.title,
                    profile_image: response.data.profile_image,
                    description: response.data.description === null ? '' : response.data.description,
                    address: response.data.address === null ? '' : response.data.address,
                    phone: response.data.phone === null ? '' : response.data.phone,
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

    delete() {
        Alert.alert(
            'Delete profile',
            '⚠️ Are you sure you want to delete your profile? This will delete all your app data and account. 👺',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'OK', onPress: () => {
                        this.setState({spinner1: true});
                        let config = {
                            headers: {'Authorization': "Bearer " + this.state.token}
                        };
                        axios.post('http://noprex.tk/api/profile/delete', null, config).then(response => {
                            this.setState({spinner1: false});
                            this.props.navigation.navigate('Login')
                        }).catch((error) => {
                            this.setState({spinner1: false});
                            console.log(error)
                        })

                    }
                },
            ],
            {cancelable: false},
        );
    }

    updateProfile() {
        if (this.state.name) {
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
            formData.append("profile_image", this.state.uri===null ? '' : {uri: this.state.uri.uri, name: this.state.uri.fileName, type: 'image/*'});
            formData.append('Content-Type', 'image/*');

            axios.post('http://noprex.tk/api/user/update', formData, config).then(response => {
                this.setState({previewing: false});
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
        } else {
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
                this.setState({previewing: true})
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
                <ScrollView>
                    <Content contentContainerStyle={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        {
                            this.state.error ? <Text>{this.state.error}</Text> : <Text/>
                        }
                        {
                            this.state.previewing ? <Image style={{
                                    height: 100,
                                    width: 100,
                                    borderRadius: 10,
                                    borderWidth: 3,
                                    borderColor: 'black'
                                }}
                                                           source={this.state.preview}/>
                                :
                                <Image style={{
                                    height: 100,
                                    width: 100,
                                    borderRadius: 10,
                                    borderWidth: 3,
                                    borderColor: 'black'
                                }}
                                       source={{uri: 'http://noprex.tk/' + this.state.profile_image}}/>
                        }
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
                                <Input value={this.state.address}
                                       onChangeText={(value) => this.setState({address: value})}
                                       placeholder="Address"/>
                            </Item>
                            {
                                this.state.spinner ? <Spinner/> :
                                    <Button block onPress={() => this.updateProfile()}>
                                        <Text>Update</Text>
                                    </Button>
                            }
                            {
                                this.state.spinner1 ? <Spinner/> :
                                    <Button style={{
                                        marginTop: 10,
                                        height: 50,
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginBottom: 20,
                                        borderRadius: 30,
                                    }} onPress={() => this.delete()} danger>
                                        <Text>Delete Profile</Text>
                                    </Button>
                            }
                        </Form>
                    </Content>
                </ScrollView>
            </Container>
        );
    }

}