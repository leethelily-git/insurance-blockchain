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

    const makeClaimOffer = (assetId, policyHolder) => {
        // TODO: Implement offer claim
    }

    const renderPrivateAssetRows = () => {
        return privateAssets.map(({ id: assetId, assetType, value, policyholder }) => {
            const onOfferClaimClick = () => {
                makeClaimOffer(assetId, policyholder)
            }

            return (
                <tr key={assetId}>
                    <td>{assetId}</td>
                    <td>{assetType}</td>
                    <td>{value}</td>
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

            <table>
                <tr>
                    <th>ID</th>
                    <th>Asset Type</th>
                    <th>Issured Value</th>
                    <th></th>
                </tr>
                {renderPrivateAssetRows()}
            </table>
        </React.Fragment>
    )
}