import React from 'react';
import { Provider } from 'react-redux'
import { store } from './utils/store';
import { ApolloProvider } from '@apollo/client';

import { client } from './apollo/client';

import './App.css';
import Home from './views/Home/Home';

function App() {
	return (
		<ApolloProvider client={client}>
			<Provider store={ store }>
				<Home />
			</Provider>
		</ApolloProvider>
	);
}

export default App;
