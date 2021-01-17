import React from 'react';
import App from './App';
import {
  ApolloClient,
  HttpLink,
  ApolloLink,
  InMemoryCache,
  ApolloProvider,
  concat,
} from '@apollo/client';
const dotenv = require('dotenv').config();

const httpLink = new HttpLink({
  uri:
    process.env.NODE_ENV === 'production'
      ? process.env.BACKEND_URL_PROD
      : process.env.BACKEND_URL_DEV,
});

const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext(() => {
    const token = localStorage.getItem('jwtToken');
    return {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    };
  });
  return forward(operation);
});
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware, httpLink),
});

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
