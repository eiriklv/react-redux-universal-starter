import qs from 'qs';
import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import configureStore from '../store/configureStore'

import App from '../containers/App';
import { fetchCounter } from '../api/counter';

export default function(req, res) {

  // Query our mock API asynchronously
  fetchCounter(apiResult => {

    // Read the counter from the request, if provided
    const params = qs.parse(req.query);
    const counter = parseInt(params.counter) || apiResult || 0;

    // Compile an initial state
    let initialState = { counter };

    // Create a new Redux store instance
    const store = configureStore(initialState);

    // Render the component to a string
    const html = React.renderToString(
      <Provider store={store}>
        { () => <App/> }
      </Provider>
    );

    // Grab the initial state from our Redux store
    const finalState = store.getState();

    // Send the rendered page back to the client
    res.send(renderFullPage(html, finalState));
  });
}

function renderFullPage(html, initialState) {
  return `
    <!doctype html>
    <html>
      <head>
        <title>Redux Universal Example</title>
      </head>
      <body>
        <div id="app">${html}</div>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
        </script>
        <script src="/bundle.js"></script>
      </body>
    </html>
  `;
}
