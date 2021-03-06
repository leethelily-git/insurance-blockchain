/**
 * Create a new asset
 * @param {org.insurance.CreateNewAsset} asset
 * @transaction
 */
async function createNewAsset(asset) {
    let assetRegistry = await getAssetRegistry('org.insurance.PrivateAsset');
    var factory = getFactory()

    num_id = (Math.floor(Math.random() * ( 999999 - 100000) + 100000)).toString(10)

    var assetID = asset.policyholder.id + num_id;
    var newAsset = factory.newResource('org.insurance', 'PrivateAsset', assetID)
    newAsset.policyholder = asset.policyholder;
    newAsset.assetType = asset.assetType;
    newAsset.value = asset.value;
    newAsset.durationInMonths = asset.durationInMonths;

    await assetRegistry.add(newAsset)
}

// /**
//  * Risk Analysis
//  * @param {org.insurance.RiskAnalysis} asset
//  * @transaction
//  */
//  async function riskAnalysis(asset) {
//     let assetRegistry = await getAssetRegistry('org.insurance.PrivateAsset');
//     let score = 0

//     if (asset.privateAsset.policyholder.noClaimsYears == 1) {
//         score += 1
//     }

//     if (asset.privateAsset.policyholder.noClaimsYears == 2) {
//         score += 2
//     }

//     if (asset.privateAsset.policyholder.noClaimsYears > 2) {
//         score += 4
//     }

//     if (asset.privateAsset.description == 'Phone') {
//         score +=2
//     }

//     if (asset.privateAsset.description == 'House') {
//         score +=3
//     }

//     if (asset.privateAsset.description == 'Car') {
//         score +=2
//     }

//     if (asset.privateAsset.value < 10000.0) {
//         score += 1
//     }

//     if (asset.privateAsset.value < 1000.0) {
//         score += 1
//     }

//     asset.privateAsset.riskAnalysisScore = score

//     assetRegistry.update(asset.privateAsset)

// }


/**
 * Make an insurance offer
 * @param {org.insurance.MakeInsuranceOffer} insurance
 * @transaction
 */

 async function makeInsuranceOffer(insurance) {
    let assetRegistry = await getAssetRegistry('org.insurance.InsuranceOffer');

    num_id = (Math.floor(Math.random() * ( 999999 - 100000) + 100000)).toString(10)

    var factory = getFactory()
    var insuranceId = insurance.policyholder.id + '' + num_id
    var insuranceOfferAsset = factory.newResource('org.insurance', 'InsuranceOffer', insuranceId)
    insuranceOfferAsset.policyholder = insurance.policyholder
    insuranceOfferAsset.insuranceCompany = insurance.insuranceCompany
    insuranceOfferAsset.privateAsset = insurance.privateAsset
    insuranceOfferAsset.durationInMonths = insurance.privateAsset.durationInMonths
    insuranceOfferAsset.monthlyCost = insurance.monthlyCost

    await assetRegistry.add(insuranceOfferAsset)
}

/**
 * Accepting an insurance offer
 * @param {org.insurance.AcceptInsuranceOffer} offer
 * @transaction
 */

 async function acceptInsuranceOffer(offer) {
    let insuranceOfferAssetRegistry = await getAssetRegistry('org.insurance.InsuranceOffer');
    let policyholderParticipantRegistry = await getParticipantRegistry('org.insurance.Policyholder');
    let privateAssetParticipantRegistry = await getAssetRegistry('org.insurance.PrivateAsset');
    let insuranceCompanyParticipantRegistry = await getParticipantRegistry('org.insurance.InsuranceCompany');

    var costToDebit = offer.offer.monthlyCost;
    let insuranceCompany = "resource:org.insurance.InsuranceCompany#" + offer.offer.insuranceCompany.id;

    if (offer.offer.policyholder.balance < costToDebit) {
        throw new Error('Not enough funds in balance')
    }
    offer.offer.policyholder.balance -= costToDebit
    offer.offer.insuranceCompany.balance += costToDebit
    offer.offer.insuranceCompany.insuranceContracts += 1
    offer.offer.status = "accepted";
    offer.offer.privateAsset.insuranceCompany = offer.offer.insuranceCompany;

    await insuranceOfferAssetRegistry.update(offer.offer);
    await policyholderParticipantRegistry.update(offer.offer.policyholder)
    await insuranceCompanyParticipantRegistry.update(offer.offer.insuranceCompany)
    await privateAssetParticipantRegistry.update(offer.offer.privateAsset)

}

/**
 * Create a claim
 * @param {org.insurance.CreateClaim} claim
 * @transaction
 */

 async function makeClaim(claim) {
    let assetResource = "resource:org.insurance.PrivateAsset#" + claim.privateAsset.id;
    let assetInsuranceOffer = await query('selectInsuranceCompanyByInsuredAsset', { privateAsset: assetResource });

    num_id = (Math.floor(Math.random() * ( 999999 - 100000) + 100000)).toString(10)


    let assetRegistry = await getAssetRegistry('org.insurance.Claim');

    var factory = getFactory()
    var claimId = claim.policyholder.id + '' + num_id
    var newClaim = factory.newResource('org.insurance', 'Claim', claimId)
    newClaim.policyholder = claim.policyholder
    newClaim.privateAsset = claim.privateAsset
    newClaim.insuranceCompany = assetInsuranceOffer[0].insuranceCompany
    newClaim.description = claim.description
    newClaim.claimValue = claim.claimValue

    await assetRegistry.add(newClaim)
}

/**
* Approve or deny a claim
* @param {org.insurance.ProcessClaim} handleClaim
* @transaction
*/
async function processClaim(handleClaim) {
    let claimsAssetRegistry = await getAssetRegistry('org.insurance.Claim');
    let policyholderParticipantRegistry = await getParticipantRegistry('org.insurance.Policyholder');

    if ( handleClaim.status === "denied" ) {
        handleClaim.claim.status = handleClaim.status
        await claimsAssetRegistry.update( handleClaim.claim )
        return true
    }

    var costToPay = handleClaim.claim.claimValue;
    handleClaim.claim.policyholder.balance += costToPay;
    handleClaim.claim.status = handleClaim.status

    await claimsAssetRegistry.update(handleClaim.claim);
    await policyholderParticipantRegistry.update(handleClaim.claim.policyholder);

}



