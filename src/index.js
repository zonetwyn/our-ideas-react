import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const root = (
    <App />
)

ReactDOM.render(root, document.getElementById('root'));

serviceWorker.unregister();
