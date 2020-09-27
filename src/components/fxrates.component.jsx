import React from 'react';
import Chip from '@material-ui/core/Chip';
import {Line} from 'react-chartjs-2';

import {getBaseCurrencies, getFxData} from '../ac/ac-data';

import './fxrates.style.scss';

const colors = ['lightgreen', 'pink'];

const dataSetOpts = {
    fill: false,
    lineTension: 0.1,
    backgroundColor: 'rgba(75,192,192,0.4)',
    borderCapStyle: 'butt',
    borderDash: [],
    borderDashOffset: 0.0,
    borderJoinStyle: 'miter',
    pointBackgroundColor: '#fff',
    pointBorderWidth: 1,
    pointHoverRadius: 5,
    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
    pointHoverBorderColor: 'rgba(220,220,220,1)',
    pointHoverBorderWidth: 2,
    pointRadius: 1,
    pointHitRadius: 10,
    responsive: true
}

class FxRates extends React.Component {

    constructor(props) {
        super(props);
        const baseCurrencies = getBaseCurrencies();
        this.state = {
            baseCurrencies: baseCurrencies,
            selectedBaseCurrency: baseCurrencies[0],
            quoteCurrencies: [],
            selectedQuoteCurrencies: new Map(),
            fxRates: {},
            tsData: {}
        };
    }

    componentDidMount() {
        this.retrieveFxData();
    }

    selectBaseCurrency(ccy) {
        this.setState({
            selectedBaseCurrency: ccy,
            selectedQuoteCurrencies: new Map(),
            tsData: {}
        }, () => this.retrieveFxData());
    }

    getDataSets(fxRates, baseCcy, quoteCcys) {
        return {
            labels: fxRates.data.adoByCcy1[0].timeseries.map(t => "" + t.date),
            datasets: quoteCcys.map((currency, index) => {
                    const dIndex = fxRates.data.adoByCcy1.findIndex(d => d.ccy2 === currency);
                    return {
                        ...dataSetOpts,
                        label: baseCcy + ' / ' + currency,
                        borderColor: colors[dIndex],
                        pointBorderColor: colors[dIndex],
                        data: fxRates.data.adoByCcy1[dIndex].timeseries.map(t => t.value)
                    };
                }
            )
        };
    }

    retrieveFxData() {
        getFxData(this.state.selectedBaseCurrency)
            .then(fxRates => {
                this.setState({
                    quoteCurrencies: fxRates.data.adoByCcy1.map(c => c.ccy2),
                    fxRates: fxRates
                }, () => console.log(this.state));
            });
    }

    selectQuoteCurrency(ccy) {
        this.setState(prevState => {
            let quoteCurrencies = new Map(prevState.selectedQuoteCurrencies);
            (quoteCurrencies.has(ccy)) ? quoteCurrencies.delete(ccy) : quoteCurrencies.set(ccy, 1);
            const plotData = this.getDataSets(
                this.state.fxRates
                , this.state.selectedBaseCurrency
                , [...quoteCurrencies.keys()])
            return {
                ...prevState,
                selectedQuoteCurrencies: quoteCurrencies,
                tsData: plotData
            };
        });
    }

    render() {
        return <div className='fx-data'>
            <div className='fx-selector'>
                <h4>Base currency</h4>
                <div>
                    {this.state.baseCurrencies
                        .map(currency => {
                            let opts = {
                                key: currency,
                                label: currency,
                                color: (currency === this.state.selectedBaseCurrency) ? 'primary' : 'default'
                            }
                            return <Chip {...opts} onClick={() => this.selectBaseCurrency(currency)}/>;
                        })}
                </div>
                <h4>Quote currency</h4>
                <div>
                    {this.state.quoteCurrencies
                        .map((currency, index) => {
                            let opts = {
                                key: currency,
                                label: currency,
                                color: 'default',
                                style: (this.state.selectedQuoteCurrencies.has(currency)) ? {backgroundColor: colors[index]} : {},
                            }
                            return <Chip {...opts} onClick={() => this.selectQuoteCurrency(currency)}/>;
                        })}
                </div>
            </div>
            <div className="chart">
                <Line height={100} data={this.state.tsData}/>
            </div>
        </div>
            ;
    }
}

export default FxRates;