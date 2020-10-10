import {ApolloClient, InMemoryCache, gql} from '@apollo/client';

const client = new ApolloClient({
    uri: 'http://localhost:8084/graphql',
    cache: new InMemoryCache(),
});

export function getBaseCurrencies() {
  return [ 'EUR', 'GBP', 'USD' ];
}

export function getFxData(baseCurrency) {
    return client.query({
        variables: {baseCurrency: baseCurrency},
        query: gql`
            query FX($baseCurrency: String) {
                fxRatesByBaseCurrency(baseCurrency: $baseCurrency) {
                    quoteCurrency
                    timeseries {
                        date
                        rate
                    }
                }
            }
        `
    });
}
