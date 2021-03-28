import React, { Component } from 'react'
import PropTypes from 'prop-types';

class UserAssetsItems extends Component {

    acceptOffer = () => {
        this.props.insuranceOffers.map((insuranceOffer) => (
            (insuranceOffer.privateAsset.includes(this.props.asset.id) && insuranceOffer.status === 'pending') ? 
                this.props.acceptInsuranceOfferFunc(insuranceOffer.id)
            : ''
            
        ))
    }

    render() {
        let assetStyle = {
            card: {
                display: 'inline-block',
                background: '#ccebff',
                width: '350px',
                height: '110px',
                textAlign: 'left',
                padding: '10px',
                margin: '20px',
                border: '5px solid #333',
                color: 'black'
            }
        }

        const style = {
            buttonStyle: {
                flex: '1',
                background: 'white',
                color: 'black',
                borderRadius: '4px',
                padding: '3px',
                margin: '3px',
                cursor: 'pointer',
                fontSize: '16px',
                marginLeft: '80%'
            },
            insuranceOffer: {
                borderBottom: '1px solid black',
                padding: '10px',
                color: 'black'
            },
            insureStyle: {
                color: 'red'
            }
        }

        return (
            <div style={ assetStyle.card }>
                <p>Description: {this.props.asset.assetType}</p>
                <p> Value: {this.props.asset.value}</p>
                {this.props.insuranceOffers.map((insuranceOffer) => (
                    (insuranceOffer.privateAsset.includes(this.props.asset.id) && insuranceOffer.status === 'pending') ?
                        (<div>
                            <p>Insurance Offer</p>
                            <button onClick={this.acceptOffer} style={style.buttonStyle}>Accept</button>
                        </div>) :
                        ('')
                ))}
                {this.props.asset.insured ? 
                    (<p style={style.insureStyle}>Insured</p>) :
                    ('')}
            </div>
        )
    }

}

//PropTypes
UserAssetsItems.propTypes = {
    asset: PropTypes.object.isRequired,
    insuranceOffers: PropTypes.array.isRequired,
    acceptInsuranceOfferFunc: PropTypes.func.isRequired
}

export default UserAssetsItems