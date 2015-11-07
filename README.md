# StegIt Chat
STEGiT, a web-based chat system, built on top of social networks using steganography techniques.

# Components

Description of the modules that compose the **StegIt Chat** application, including service contracts, and UI functionalities.

## Chat Client

The chat client is a simple console interface where the user can interact with the system an use some of the services specified in the **Communication Interface**. The client uses the console application to get connected with other users using the our app capability to communicate secretly via social networks. Our application security is based on manual key distribution via a secure physical channel, i.e, envelope delivered in hand.

### Communication Interface

The communication interface used by the chat client has the following public service contracts:

+ **List Channels**, a service that list all the channels currently registered. This service output is 
 
```js
 [
  {
    channel_uri: string,
    channel_password: string,

    // the users get disconnected after 1 min of inactivity (configurable)
    connected_users: [ username1:string, ..., usernameN: string ]
  },
  ...
  {
    // channel N
  }
 ]
```

+ **Register Channel**, a service that receives as input `{ channel_uri: string, channel_secret: string }` and registers the channel into the user channels queue. When registering a channel a validation does occur, that consists in fetching an album where its description contains the `SHA512(channel_secret)`. This ensures that only an user owning a channel's secret key can registered it in order to read its messages or post new ones.

+ **Select Channel**, a service that selects a given channel as the current one, i.e, the channel where the messages will be sent by default. This service input is `{ channel_uri: string }`. This service automatically calls `Sync Messages` service to ensure it is up to date with the current conservation history.

+ **Send Message**, sends a message to the currently selected channel. Receives as input `{ msg: string }`. Internally the service will pickup an image from the image pool available in the clients library and is going to use the channels previously configured password to cypher the message an hide it in the randomly selected picture. The final message saved in the image has the following structure `{ timestamp: UTC+00:00, msg: string, username: string, service_message: boolean }`. The field `service_message` is used by the system to enable it to determine where a message is generate by the system or by the user. For instance the action of a users first message on a given channel can be seen as a being connected to it. Therefore the system could post that onto the channel automatically.

+ **Sync Messages**, this service syncs the messages of a given channel from the social network provider of the channel to the users client application. This service is invoked every 2 seconds automatically to keep the messages up to date.

+ **Generate Channel Credentials**, a service that creates a channel for two or more parties to communicate. This channel creation involves creating an album with a random name, a channel secret and a description containing the `SHA512(channel_secret)`.

+ **Update User Profile**, this service simply updates the info about the user using the client application. This service input is `{ username: string }`.