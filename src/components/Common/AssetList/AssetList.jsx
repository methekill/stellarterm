import React from 'react';
import PropTypes from 'prop-types';
import Driver from '../../../lib/Driver';
import images from '../../../images';
import Loading from '../Loading/Loading';
import Ellipsis from '../Ellipsis/Ellipsis';
import AssetListRows from './AssetListRows/AssetListRows';
import TopVolumeAssets from '../../Markets/TopVolumeAssets/TopVolumeAssets';


export default class AssetList extends React.Component {
    constructor(props) {
        super(props);
        this.dTicker = props.d.ticker;
        this.listenId = this.dTicker.event.listen(() => {
            this.forceUpdate();
        });

        // Default sorting by 24h volume
        this.state = {
            sortBy: 'volume24h',
            sortType: false, // false: 'desc', true 'asc'
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.fromStellarTicker !== prevProps.fromStellarTicker) {
            this.resetSort();
        }
    }

    componentWillUnmount() {
        this.dTicker.event.unlisten(this.listenId);
    }

    resetSort() {
        this.setState({
            sortBy: 'volume24h',
            sortType: false,
        });
    }

    handleSorting(sortName) {
        const { sortBy } = this.state;

        if (sortBy === null) {
            this.setState({
                sortBy: sortName,
                sortType: true,
            });
        } else if (sortBy !== sortName) {
            this.setState({
                sortBy: sortName,
                sortType: true,
            });
        } else {
            this.setState({
                sortBy: sortName,
                sortType: !this.state.sortType,
            });
        }
    }

    generateRowTitle(text, sortName) {
        return (
            <div className={'AssetList_head_cell'} onClick={() => this.handleSorting(sortName)}>
                <span>{text}</span>
                {this.state.sortBy !== sortName ? (
                    <img src={images['sort-arrow']} alt="sortBy" />
                ) : (
                    <img
                        src={images['sort-arrow-act']}
                        alt="sortBy"
                        className={this.state.sortType !== true ? 'revert' : ''} />
                )}
            </div>
        );
    }

    render() {
        const loadingMarket = (
            <Loading size="large">
                Loading Stellar market data
                <Ellipsis />
            </Loading>
        );

        if (!this.dTicker.ready) {
            return loadingMarket;
        }

        const { d, limit, showLowTradable, fromStellarTicker } = this.props;
        const { sortBy, sortType } = this.state;

        return (
            <div className="AssetList">
                <div className="AssetList_head_row">
                    {this.generateRowTitle('Asset', 'assetName')}
                    {this.generateRowTitle('Price (XLM)', 'priceXLM')}
                    {this.generateRowTitle('Price (USD)', 'priceUSD')}
                    {this.generateRowTitle('Volume (24h)', 'volume24h')}
                    {this.generateRowTitle('Change (24h)', 'change24h')}
                </div>
                {!fromStellarTicker ? (
                    <AssetListRows
                        d={d}
                        ticker={d.ticker}
                        limit={limit}
                        sortBy={sortBy}
                        sortType={sortType}
                        showLowTradable={showLowTradable} />
                ) : (
                    <TopVolumeAssets d={d} sortBy={sortBy} sortType={sortType} />
                )}
            </div>
        );
    }
}

AssetList.propTypes = {
    d: PropTypes.instanceOf(Driver).isRequired,
    limit: PropTypes.number,
    showLowTradable: PropTypes.bool,
    fromStellarTicker: PropTypes.bool,
};
