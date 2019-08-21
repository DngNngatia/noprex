import React, {Component} from 'react';
import {StyleSheet, Linking, View} from 'react-native';
import {
    Container,
    Header,
    Button,
    Content,
    CheckBox,
    Title,
    Right,
    Text,
    Left,
    Body,
    Icon,
    ListItem
} from 'native-base';


export default class GSettings extends Component {
    state = {
        checked: true
    }

    notify() {
        this.setState({
            checked: false
        })
    }

    openLink() {
        Linking.openURL('https://www.linkedin.com/in/derrick-ngatia-b6a98a169/').catch((err) => console.error('An error occurred', err));
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
                        <Title><Text>Settings</Text></Title>
                    </Body>
                    <Right/>
                </Header>
                <Content>
                    <View style={styles.container}>
                        <ListItem>
                            <CheckBox onPress={() => this.notify()} checked={true} color='green'/>
                            <Body>
                                <Text>Notify when new topics are uploaded</Text>
                            </Body>
                        </ListItem>
                        <Text style={styles.paragraph}>Developed by Derrick Ngatia.</Text>
                        <Button onPress={() => this.openLink()}>
                            <Icon name="link"/>
                            <Text>Visit developer Linkedin Profile</Text>
                        </Button>
                        <Text style={styles.paragraph}>Terms and Conditions</Text>
                        <Text style={styles.paragraph}>
                            You are specifically restricted from all of the following:
                            publishing any app material in any other media;
                            selling, sublicense and/or otherwise commercializing any app material;
                            publicly performing and/or showing any app material;
                            using this app in any way that is or may be damaging to this app;
                            using this app in any way that impacts user access to this app;
                            using this app contrary to applicable laws and regulations, or in any way may
                            cause harm to the app, or to any person or business entity;
                            engaging in any data mining, data harvesting, data extracting
                            or any other similar activity in relation to this app;
                            using this app to engage in any advertising or marketing.
                            Certain areas of this app are restricted from being access by
                            you and Company Name may further restrict access by you
                            to any areas of this app, at any time, in absolute discretion.
                            Any user ID and password
                            you may have for this app are confidential and you must maintain confidentiality
                            as well.
                        </Text>
                        <Text style={{borderRadius: 10, borderWidth: 1, borderColor: 'green', fontSize: 18}}>@noprex
                            serving developers all over the world</Text>
                    </View>
                </Content>
            </Container>
        )
    }


}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: 30,
        backgroundColor: '#ecf0f1',
        padding: 8,
    },
    paragraph: {
        margin: 24,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
