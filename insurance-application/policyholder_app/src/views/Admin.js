import React, { useEffect, useState } from 'react'
import Connection from '../Connection'
import Header from '../components/Header'

export default () => {
    const [privateAssets, setPrivateAssets] = useState([])
    const [claims, setClaims] = useState([])

    const getPrivateAssets = () => {
        Promise.all([
            Connection.search('PrivateAsset'),
            Connection.search('InsuranceOffer')
        ])
            .then(([privateAssets, insuranceOffers]) => {
                // Worst performance code.... but here we go for IS452!
                const pendingOfferIds = insuranceOffers.filter(({ status }) =>
                    status === "pending" || status === "accepted" || status === "rejected")
                    .map(({ privateAsset }) => privateAsset.split('#')[1])
                const assetsToshow = privateAssets.filter(asset => pendingOfferIds.indexOf(asset.id) === -1)

                setPrivateAssets(assetsToshow)
            })
            .catch(e => 'Unabled to load due to: ' + e.message)
    }

    const getClaims = () => {
        Connection.search('Claim')
            .then(claims => {
                const pendingClaims = claims.filter(({ status }) => status === "pending")
                setClaims(pendingClaims)
            })
            .catch(e => alert(e.message))
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
                alert('Successfully offered asset')
            })
            .catch(e => alert(e.message))
    }

    const processClaim = (claimId) => {
        const claimProcessPayload = {
            "$class": "org.insurance.ProcessClaim",
            "claim": `resource:org.insurance.Claim#${claimId}`,
            "status": "approved"
        }

        Connection.create('ProcessClaim', claimProcessPayload)
            .then(() => {
                getClaims()
                alert("Claim successfully processed.")
            })
            .catch(e => alert("Claim process failed due to: " + e.message))
    }

    const renderPrivateAssetRows = () => {
        return privateAssets
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

    const renderClaimRows = () => {
        return claims.map(({ id: claimId, description, claimValue }) => {
            const onProcessClaimClick = () => {
                processClaim(claimId)
            }

            return (
                <tr key={claimId}>
                    <td>{description}</td>
                    <td>{claimValue}</td>
                    <td>
                        <button onClick={onProcessClaimClick}>Process</button>
                    </td>
                </tr>
            )
        })
    }

    useEffect(() => {
        getPrivateAssets()
        getClaims()
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

            <h3>Manage claims</h3>
            <table border="1">
                <thead>
                    <tr>
                        <th>Description of claim</th>
                        <th>Claim value</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {renderClaimRows()}
                </tbody>
            </table>

        </React.Fragment>
    )
}