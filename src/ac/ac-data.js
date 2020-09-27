import {ApolloClient, InMemoryCache, gql} from '@apollo/client';

const client = new ApolloClient({
    uri: 'http://localhost:8084/graphql',
    cache: new InMemoryCache(),
});

export function getBaseCurrencies() {
  return [ 'EUR', 'GBP', 'USD' ];
}

export function getFxData(baseCcy) {
    return client.query({
        variables: {baseCcy: baseCcy},
        query: gql`
            query FX($baseCcy: String) {
                adoByCcy1(ccy1: $baseCcy) {
                    id
                    name
                    ccy1
                    ccy2
                    timeseries {
                        date
                        value
                    }
                }
            }
        `
    });
}
