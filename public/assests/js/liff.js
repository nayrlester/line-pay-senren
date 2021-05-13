let myLiffId = '1655984655-zW7dO29M',
    myliffPath = 'https://liff.line.me/1655984655-zW7dO29M';

function initializeLiff(myLiffId) {
    
    liff
        .init({
            liffId: myLiffId
        })
        .then(() => {
            location.replace(myliffPath);
        })
        .catch((err) => {
            document.getElementById("liffAppContent").classList.add('hidden');
            document.getElementById("liffInitErrorMessage").classList.remove('hidden');
        });
}

function displayLiffData() {
    document.getElementById('browserLanguage').textContent = liff.getLanguage();
    document.getElementById('sdkVersion').textContent = liff.getVersion();
    document.getElementById('isInClient').textContent = liff.isInClient();
    document.getElementById('isLoggedIn').textContent = liff.isLoggedIn();
    document.getElementById('deviceOS').textContent = liff.getOS();
    document.getElementById('lineVersion').textContent = liff.getLineVersion();
}

document.getElementById('liffLogoutButton').addEventListener('click', function() {
    if (liff.isLoggedIn()) {
        liff.logout();
        window.location.reload();
    }
});

document.getElementById('openWindowButton').addEventListener('click', function() {
    liff.openWindow({
        url: 'https://line.me',
        external: true
    });
});

document.getElementById('scanQrCodeButton').addEventListener('click', function() {
    if (!liff.isInClient()) {
        sendAlertIfNotInClient();
    } else {
        if (liff.scanCode) {
            liff.scanCode().then(result => {
                // e.g. result = { value: "Hello LIFF app!" }
                const stringifiedResult = JSON.stringify(result);
                document.getElementById('scanQrField').textContent = stringifiedResult;
                toggleQrCodeReader();
            }).catch(err => {
                document.getElementById('scanQrField').textContent = "scanCode failed!";
            });
        }
    }
});

document.getElementById('getAccessToken').addEventListener('click', function() {
    if (!liff.isLoggedIn() && !liff.isInClient()) {
        alert('To get an access token, you need to be logged in. Please tap the "login" button below and try again.');
    } else {
        const accessToken = liff.getAccessToken();
        document.getElementById('accessTokenField').textContent = accessToken;
        toggleAccessToken();
    }
});

document.getElementById('sendMessageButton').addEventListener('click', function() {
    if (!liff.isInClient()) {
        sendAlertIfNotInClient();
    } else {
        liff.sendMessages([{
            'type': 'text',
            'text': "Hello, World!"
        }]).then(function() {
            window.alert('Message sent');
        }).catch(function(error) {
            window.alert('Error sending message: ' + error);
        });
    }
});

document.getElementById('closeWindowButton').addEventListener('click', function() {
    if (!liff.isInClient()) {
        sendAlertIfNotInClient();
    } else {
        liff.closeWindow();
    }
});

document.getElementById('sendMessageButton').addEventListener('click', function() {
    if (!liff.isInClient()) {
        sendAlertIfNotInClient();
    } else {
        liff.sendMessages([{
            'type': 'text',
            'text': "Hello, World!"
        }]).then(function() {
            window.alert('Message sent');
        }).catch(function(error) {
            window.alert('Error sending message: ' + error);
        });
    }
});
