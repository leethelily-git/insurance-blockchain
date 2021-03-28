import React, { Component } from 'react';
import './User.css';
import Header from '../components/Header'
import Connection from '../Connection'
import Homepage from '../components/Homepage'

class App extends Component {

  state = {
    name: "finn",
    assets: [],
    user: {},
    insuranceOffers: [],
  }

  componentWillMount() {
    this.getAssets()
    this.getUserProfile()
    this.getInsuranceOffers()
  }

  componentDidUpdate() {
    this.getInsuranceOffers()
  }

  getAssets = () => {
    // Search for the users assets
    Connection.search('queries/selectAssetByPolicyholder?policyholder=resource%3Aorg.insurance.Policyholder%23' + this.state.name)
      .then(data => {
        console.log(data)
        //store the assets in the assets array
        this.setState({
          assets: data
        })
        // Retrieve the user object from the state
        let user = this.state.user
        // Add the number of assets to the object
        user.numAssets = this.state.assets.length
        // Update the state
        this.setState({
          user
        })

        let assets = this.state.assets
        for (let i = 0; i < assets.length; i++) {
          // Set insurance status
          if (assets[i].insuranceCompany == null) {
            assets[i].insured = false
          }
          else {
            assets[i].insured = true
          }
        }
        // Update the state
        this.setState({
          assets: assets
        })

      })
  }

  addAsset = (assetType, value, durationInMonths) => {
    // Create the data object
    const data = {
      "$class": "org.insurance.CreateNewAsset",
      "policyholder": "org.insurance.Policyholder#" + this.state.name,
      "assetType": assetType,
      "value": Number(value),
      "durationInMonths": Number(durationInMonths)
    }
    // Send this data to the Hyperledger Network
    Connection.create('CreateNewAsset', data)
      .then((err) => {
        if (err) {
          console.log(err)
        }
        // Get the new asset
        this.getAssets()
      })

  }

  getUserProfile = () => {
    // Send get request for user
    Connection.search('Policyholder/' + this.state.name)
      .then(data => {
        // Retrieve the user object from the state
        let user = this.state.user
        // Add details to the user object
        user.name = data.name
        user.balance = data.balance
        user.noClaimsYears = data.noClaimsYears
        // Update the state
        this.setState({
          user: user
        })
      })
  }

  newClaim = (assetID, claimValue, claimDescription) => {
    const data = {
      "$class": "org.insurance.CreateClaim",
      "privateAsset": "org.insurance.PrivateAsset#" + assetID,
      "policyholder": "org.insurance.Policyholder#" + this.state.name,
      "description": claimDescription,
      "claimValue": claimValue
    }

    Connection.create('CreateClaim', data)
      .then((err) => {
        if (err) {
          alert(err)
        }
        else {
          alert("Successfully submitted claim")
        }
      })
  }

  getInsuranceOffers = () => {
    Connection.search('queries/selectInsuranceOffersByPolicyholder?policyholder=resource%3Aorg.insurance.Policyholder%23' + this.state.name)
      .then((data) => {
        console.log(data)
        this.setState({
          insuranceOffers: data
        })
      })
  }

  acceptInsuranceOffer = (offerID) => {
    const data = {
      "$class": "org.insurance.AcceptInsuranceOffer",
      "offer": "resource:org.insurance.InsuranceOffer#" + offerID
    }
    Connection.create('AcceptInsuranceOffer', data)
      .then(() => {
        this.getAssets()
        this.getInsuranceOffers()
      })
  }

  render() {
    return (
      <React.Fragment>
        <Header />

        <h2>My Assets</h2>
        <Homepage assets={this.state.assets} addAsset={this.addAsset} user={this.state.user} newClaimFunc={this.newClaim}
          insuranceOffers={this.state.insuranceOffers}
          acceptInsuranceOfferFunc={this.acceptInsuranceOffer} />
      </React.Fragment>
    )
  }

}
export default App;