# StegIt Chat
STEGiT, a web-based chat system, built on top of social networks using steganography techniques.

# Components

## Chat Client

### Communication Interface

The communication interface used by the chat client has the following service contracts:

- *Query Available Rooms Service*

```javascript
  input:
    {
      facebook_account_url: url,
      facebook_graph_api_token: token
    }

  output:
    {
      available_rooms_list: [{
        room_name: string
        room_code: <SHA512>
        participants: [{
          code: <SHA512>
          name: string
        }]
      }, ...]
    }
```