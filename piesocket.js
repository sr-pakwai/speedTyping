let socket = null;
const username = `user_${Math.floor(Math.random() * 1000)}`

const piesocket = window.piesocket = {
    connect: () => {
        const channelId = prompt('What is your channelId?');
        if (channelId === '' || channelId == null)
            return;

        console.log('connecting...');
        piesocket.init(channelId);
    },
    init: (channelId) => {
        fetch('../config.json')
            .then(response => response.json())
            .then(data => connect(data, channelId))
            .catch(error => console.error('Error:', error));
    },

    send: (event, data) => {
        if (socket == null)
            return;

        socket.send(JSON.stringify({
            event: event,
            sender: username,
            data: data,
        }));
    },
};

async function connect(config, cid) {
    const apiKey = config.piesocket_apikey;
    const channelId = cid || 8080;

    socket = new WebSocket(`wss://connect.websocket.in/v3/${channelId}?api_key=${apiKey}`);

    socket.onopen = () => {
        console.log('connected to piesocket!');
        
        const _connectBtn = document.getElementById('connectBtn');
        _connectBtn.classList.remove('btn-secondary');
        _connectBtn.classList.add('btn-success');
        _connectBtn.setAttribute('disabled', true);

        const _channelId = document.getElementById('channelId');
        _channelId.innerHTML = channelId;

        socket.send(JSON.stringify({
            event: 'join',
            sender: username,
        }));
    }

    socket.onmessage = (message) => {
        var payload = JSON.parse(message.data);
        console.log(payload);
    
        if (payload.sender == username) {
            payload.sender = 'You';
        }

        console.log(payload);
    }
};
