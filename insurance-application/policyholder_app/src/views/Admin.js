import React, { useEffect, useState } from 'react'
import Connection from '../Connection'
import Header from '../components/Header'

export default () => {
    const [privateAssets, setPrivateAssets] = useState([])

    const getPrivateAssets = () => {
        Connection.search('PrivateAsset')
            .then(data => {
                setPrivateAssets(data)
            })
            .catch(console.error)
    }

    const makeClaimOffer = (assetId, policyHolder, monthlyCost) => {
        const claimOfferPayload = {
            monthlyCost,
            "$class": "org.insurance.MakeInsuranceOffer",
            "policyholder": policyHolder,
            "insuranceCompany": "resource:org.insurance.InsuranceCompany#awesomeInsurance", // TODO: Replace this dynamically to the first insurance company
            "privateAsset": `resource:org.insurance.PrivateAsset#${assetId}`
        }

        Connection.create('MakeInsuranceOffer', claimOfferPayload)
            .then(() => {
                getPrivateAssets()
                console.log('Successfully offered')
            })
            .catch(e => alert(e.message))
    }

    const renderPrivateAssetRows = () => {
        return privateAssets
            .filter(({insuranceCompany}) => insuranceCompany === undefined)
            .map(({ id: assetId, assetType, value, policyholder }) => {
                let monthlyOffer = '100'
                const onOfferClaimClick = () => {
                    makeClaimOffer(assetId, policyholder, monthlyOffer)
                }

                return (
                    <tr key={assetId}>
                        <td>{assetId}</td>
                        <td>{assetType}</td>
                        <td>{value}</td>
                        <td>
                            <input type="number" placeholder="100" onChange={e => monthlyOffer = e.target.value} />
                        </td>
                        <td>
                            <button onClick={onOfferClaimClick}>Make offer</button>
                        </td>
                    </tr>
                )
            })
    }

    useEffect(() => {
        getPrivateAssets()
    }, [])

    return (
        <React.Fragment>
            <Header />

            <h2>Admin</h2>

            <h3>Private Assets</h3>

            {/* TODO: Ensure that a single insurance company exists and we will use that */}

            <table border="1">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Asset Type</th>
                        <th>Issured Value</th>
                        <th>Monthly Cost</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {renderPrivateAssetRows()}
                </tbody>
            </table>
        </React.Fragment>
    )
}