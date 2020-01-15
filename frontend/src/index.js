import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import './css/style.scss';
import './css/navigation.scss';

ReactDOM.render(<App />, document.getElementById('root'));
// Unregister Service Workers
navigator.serviceWorker.getRegistrations().then(
    function(registrations) {
        for(let registration of registrations) {  
            registration.unregister();
        }
});
