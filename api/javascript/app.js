/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const fs = require('fs');

const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('./CAUtil.js');
const { buildCCPOrg2, buildWallet, buildCCPOrg } = require('./AppUtil.js');

const channelName = process.env.CHANNEL_NAME || 'movie';
//const chaincodeName = process.env.CHAINCODE_NAME || 'movie';
const chaincodeToken = process.env.CHAINCODE_NAME || 'token1155';

//const for org1
const orgName = 'org1';
const mspOrg = 'Org1MSP';
//org1 wallet
const walletPath = path.join('/Users/adityabarjatya/hackathon/project/wallet', 'org1');
const orgUserToken = 'tokenMinterOrg1';
const department = 'org1.department1';
const caOrgName = "ca.org1.example.com";

//const for org2
/*const orgName = 'org2';
const mspOrg = 'Org2MSP';*/
//org2 wallet
/*const walletPath = path.join('/Users/adityabarjatya/hackathon/project', 'wallet');
const orgUserToken = 'person1';
const department = 'org2.department1';
const caOrgName = "ca.org2.example.com";*/

//user producer
const tokenMinterOrg1Base64Address = "eDUwOTo6Q049dG9rZW5NaW50ZXJPcmcxLE9VPW9yZzErT1U9Y2xpZW50K09VPWRlcGFydG1lbnQxOjpDTj1jYS5vcmcxLmV4YW1wbGUuY29tLE89b3JnMS5leGFtcGxlLmNvbSxMPUR1cmhhbSxTVD1Ob3J0aCBDYXJvbGluYSxDPVVT";
//user investor
const tokenRecieverBase64Address = "eDUwOTo6Q049dG9rZW5SZWNpZXZlcixPVT1vcmcyK09VPWNsaWVudCtPVT1kZXBhcnRtZW50MTo6Q049Y2Eub3JnMi5leGFtcGxlLmNvbSxPPW9yZzIuZXhhbXBsZS5jb20sTD1IdXJzbGV5LFNUPUhhbXBzaGlyZSxDPVVL";
// user pvr
const person1Org2Base64Address = "eDUwOTo6Q049cGVyc29uMSxPVT1vcmcyK09VPWNsaWVudCtPVT1kZXBhcnRtZW50MTo6Q049Y2Eub3JnMi5leGFtcGxlLmNvbSxPPW9yZzIuZXhhbXBsZS5jb20sTD1IdXJzbGV5LFNUPUhhbXBzaGlyZSxDPVVL";
//user client
const person2Org2Base64Address = "eDUwOTo6Q049cGVyc29uMSxPVT1vcmcyK09VPWNsaWVudCtPVT1kZXBhcnRtZW50MTo6Q049Y2Eub3JnMi5leGFtcGxlLmNvbSxPPW9yZzIuZXhhbXBsZS5jb20sTD1IdXJzbGV5LFNUPUhhbXBzaGlyZSxDPVVL";

//This will be used to store the contract object
var movieContract;

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}

exports.init = async function () {

	try {
		// for org1 build an in memory object with the network configuration (also known as a connection profile)
		const ccp = buildCCPOrg(orgName);

		// for org2 build an in memory object with the network configuration (also known as a connection profile)
		//const ccp2 = buildCCPOrg2();

		// build an instance of the fabric ca services client based on
		// for org1 the information in the network configuration
		const caClient = buildCAClient(FabricCAServices, ccp, caOrgName);

		// for org2 the information in the network configuration
		//const caClient2 = buildCAClient(FabricCAServices, ccp2, 'ca.org2.example.com');

		// setup the wallet to hold the credentials of the application user
		const wallet = await buildWallet(Wallets, walletPath);
		//console.log("wallet path: " + walletPath);
		
		//console.log("wallet: " + wallet.toString());
		//save the wallet to the file system

		/*fs.writeFile('/Users/adityabarjatya/hackathon/project/api/admin.id', wallet, err => {
			if (err) {
			  console.error(err);
			}
			// file written successfully
		  });
		console.log("wallet json path " + wallet);
		*/

		  console.log("enroll admin");
		// in a real application this would be done on an administrative flow, and only once
		//await enrollAdmin(caClient, wallet, mspOrg1);

		// in a real application this would be done only when a new user was required to be added
		// and would be part of an administrative flow
		try {
			console.log("register and enroll user");
			//for org1 user
			await registerAndEnrollUser(caClient, wallet, mspOrg, orgUserToken, department);
		} catch (error) {
			console.error(`Failed to register user : ${error}`);
		}
		

		// Create a new gateway instance for interacting with the fabric network.
		// In a real application this would be done as the backend server session is setup for
		// a user that has been verified.
		const gateway = new Gateway();

		try {
			// setup the gateway instance
			// The user will now be able to create connections to the fabric network and be able to
			// submit transactions and query. All transactions submitted by this gateway will be
			// signed by this user using the credentials stored in the wallet.
			await gateway.connect(ccp, {
				wallet,
				identity: orgUserToken,
				discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
			});

			// Build a network instance based on the channel where the smart contract is deployed
			const network = await gateway.getNetwork(channelName);

			// Get the contract from the network.
			const contract  = network.getContract(chaincodeToken);
			movieContract = contract;

			const clientAccountID = await movieContract.submitTransaction('ClientAccountID');
			console.log(clientAccountID.toString());

			const balance = await movieContract.submitTransaction('BalanceOf', tokenMinterOrg1Base64Address, "101");
			console.log(balance.toString());

			// Initialize a set of asset data on the channel using the chaincode 'InitLedger' function.
			// This type of transaction would only be run once by an application the first time it was started after it
			// deployed the first time. Any updates to the chaincode deployed later would likely not need to run
			// an "init" type function.
			//console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger');
			
			//Initialize movie chaincode
			//await contract.submitTransaction('InitLedger');

			//Initialize token chaincode
			//await contract.submitTransaction('Initialize', "DDLJ-Token", "DDLJ-T");

			//Initialize ERC1155 token chaincode
			//await contract.submitTransaction('Initialize', "sit", "SIT");

			
			
			//let result2 = await contract.evaluateTransaction('ClientAccountBalance');
			//console.log(`*** Result: ${prettyJSONString(result2.toString())}`);

			//"function":"MintWithTokenURI","Args":["101", "https://example.com/nft101.json"]
			//let result1 = await contract.submitTransaction('MintWithTokenURI', "101", "https://example.com/nft101.json");
			//console.log(`*** Result: ${prettyJSONString(result1.toString())}`);

			//"function":"ClientAccountBalance","Args":[]
			//let result = await contract.evaluateTransaction('ClientAccountBalance');
			//console.log(`*** Result: ${prettyJSONString(result.toString())}`);

			//"function":"OwnerOf","Args":["101"]
			//let result3 = await contract.evaluateTransaction('OwnerOf', "101");
			//console.log(`*** Result: ${result3}`);


			//console.log('*** Result: committed');

		}catch(error){
			console.log("Inner Error catch block");
			console.log(error);
		}
	}catch(e){
		console.log("Outer Error catch block");
		console.log(e);
	}		

};

exports.queryAllMovies = async function () {
	try{
		console.log('\n--> Evaluate Transaction: QueryAllMovies, function returns all the current movies on the ledger');
		let result = await movieContract.evaluateTransaction('QueryAllMovies');
		console.log(`*** Result: ${prettyJSONString(result.toString())}`);
		return result.toString();
	}catch(e){
		console.log("Error in queryAllMovies");
		console.log(e);
	}
	
};

exports.QueryMovieByName = async function (title) {
	try{
		console.log('\n--> Evaluate Transaction: QueryMovieByName, function returns the search movies on the ledger');
		let result = await movieContract.evaluateTransaction('QueryMovieByName', title);
		console.log(`*** Result: ${prettyJSONString(result.toString())}`);
		return result.toString();
	}catch(e){
		console.log("Error in QueryMovieByName");
		console.log(e);
	}

	
};

exports.CreateMovie = async function (movieNumber, title, durationInMin, language, releaseDate, country, genre) {
	try{
		console.log('\n--> Evaluate Transaction: CreateMovie, function creates a new movie on the ledger');
		let result = await movieContract.submitTransaction('CreateMovie', movieNumber, title, durationInMin, language, releaseDate, country, genre);
		console.log(`*** Result: ${prettyJSONString(result.toString())}`);
		return result.toString();
	}catch(e){
		console.log("Error in CreateMovie");
		console.log(e);
	}
	
};
//\"function\":\"MintBatch\",\"Args\":[\"$P1\",\"[1,2,3,4,5,6]\",\"[100,200,300,150,100,100]\
exports.MintBatch = async function (id, amount) {
	try{
		//get client account ID for UserMinter in org1
		const minterAccount = await movieContract.submitTransaction('ClientAccountID');
		console.log('\n--> Evaluate Transaction: MintBatch, function mint a new token on the ledger');
		console.log(id);
		console.log(minterAccount);

		let result = await movieContract.submitTransaction('MintBatch', tokenMinterOrg1Base64Address, id, amount);
		console.log(result.toString());

		const balance = await movieContract.submitTransaction('BalanceOf', tokenMinterOrg1Base64Address, "104");
		console.log(balance.toString());

		return result.toString();
	}catch(e){
		console.log("Error in MintBatch");
		console.log(e);
	}
};

//"function\":\"BatchTransferFrom\",\"Args\":[\"$P1\",\"$P2\",\"[3,4,2]\",\"[6,3,1]\"
exports.BatchTransferFrom = async function (id, amount) {
	try{
		//get client account ID for UserMinter in org1
		const minterAccount = await movieContract.submitTransaction('ClientAccountID');

		console.log('\n--> Evaluate Transaction: BatchTransferFrom, function transfer token from one account to another');
		let result = await movieContract.submitTransaction('BatchTransferFrom', tokenMinterOrg1Base64Address, tokenRecieverBase64Address, id, amount);
		
		let balance = await movieContract.submitTransaction('BalanceOf', tokenMinterOrg1Base64Address, "101");
		console.log("balance of minter for 101" + balance.toString());

		balance = await movieContract.submitTransaction('BalanceOf', tokenRecieverBase64Address, "101");
		console.log("balance of receiver for 101" + balance.toString());

		return result.toString();
	}
	catch(e){
		console.log("Error in BatchTransferFrom");
		console.log(e);
	}
};

// function Burn(ctx contractapi.TransactionContextInterface, account string, id uint64, amount uint64)
exports.Burn = async function (id, amount) {
	try{
		//burn token tokenRecieverBase64Address from org2
		let balance = await movieContract.submitTransaction('BalanceOf', tokenRecieverBase64Address, "103");
		console.log("balance of receiver for 101" + balance.toString());

		console.log('\n--> Evaluate Transaction: Burn, function burn token from an account');
		let result = await movieContract.submitTransaction('BurnBatch', tokenRecieverBase64Address, id, amount);
		console.log(result.toString());
		balance = await movieContract.submitTransaction('BalanceOf', tokenRecieverBase64Address, "103");
		console.log("balance of receiver for 101" + balance.toString());

	}
	catch(e){
		console.log("Error in Burn");
		console.log(e);
	}
};

// Gives the balance of logged in user for a token
exports.GetBalance = async function (userId, tokenId) {
	try{
		console.log('\n--> Evaluate Transaction: BalanceOf, function returns the balance of an account');
		let userAddress;
		if(userId == "producer"){
			userAddress = tokenMinterOrg1Base64Address;
		}else if(userId == "investor"){
			userAddress = tokenRecieverBase64Address;
		}else if(userId == "pvr"){
			userAddress = person1Org2Base64Address;
		}else if(userId == "client"){
			userAddress = person2Org2Base64Address;
		}

		let res = await movieContract.submitTransaction('BalanceOf', userAddress, tokenId);
		console.log(res);
		return res;

	}
	catch(e){
		console.log("Error in BalanceOf");
		console.log(e);
	}
};


		



// pre-requisites:
// - fabric-sample two organization test-network setup with two peers, ordering service,
//   and 2 certificate authorities
//         ===> from directory /fabric-samples/test-network
//         ./network.sh up createChannel -ca
// - Use any of the asset-transfer-basic chaincodes deployed on the channel "mychannel"
//   with the chaincode name of "basic". The following deploy command will package,
//   install, approve, and commit the javascript chaincode, all the actions it takes
//   to deploy a chaincode to a channel.
//         ===> from directory /fabric-samples/test-network
//         ./network.sh deployCC -ccn basic -ccp ../asset-transfer-basic/chaincode-javascript/ -ccl javascript
// - Be sure that node.js is installed
//         ===> from directory /fabric-samples/asset-transfer-basic/application-javascript
//         node -v
// - npm installed code dependencies
//         ===> from directory /fabric-samples/asset-transfer-basic/application-javascript
//         npm install
// - to run this test application
//         ===> from directory /fabric-samples/asset-transfer-basic/application-javascript
//         node app.js

// NOTE: If you see  kind an error like these:
/*
    2020-08-07T20:23:17.590Z - error: [DiscoveryService]: send[mychannel] - Channel:mychannel received discovery error:access denied
    ******** FAILED to run the application: Error: DiscoveryService: mychannel error: access denied

   OR

   Failed to register user : Error: fabric-ca request register failed with errors [[ { code: 20, message: 'Authentication failure' } ]]
   ******** FAILED to run the application: Error: Identity not found in wallet: appUser
*/
// Delete the /fabric-samples/asset-transfer-basic/application-javascript/wallet directory
// and retry this application.
//
// The certificate authority must have been restarted and the saved certificates for the
// admin and application user are not valid. Deleting the wallet store will force these to be reset
// with the new certificate authority.
//

/**
 *  A test application to show basic queries operations with any of the asset-transfer-basic chaincodes
 *   -- How to submit a transaction
 *   -- How to query and check the results
 *
 * To see the SDK workings, try setting the logging to show on the console before running
 *        export HFC_LOGGING='{"debug":"console"}'
 */
async function main() {
	try {
		// build an in memory object with the network configuration (also known as a connection profile)
		const ccp = buildCCPOrg1();

		// build an instance of the fabric ca services client based on
		// the information in the network configuration
		const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');

		// setup the wallet to hold the credentials of the application user
		//const wallet = await buildWallet(Wallets, walletPath);
		const wallet = await buildWallet(Wallets, null);

		// in a real application this would be done on an administrative flow, and only once
		await enrollAdmin(caClient, wallet, mspOrg1);

		// in a real application this would be done only when a new user was required to be added
		// and would be part of an administrative flow
		await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');

		// Create a new gateway instance for interacting with the fabric network.
		// In a real application this would be done as the backend server session is setup for
		// a user that has been verified.
		const gateway = new Gateway();

		try {
			// setup the gateway instance
			// The user will now be able to create connections to the fabric network and be able to
			// submit transactions and query. All transactions submitted by this gateway will be
			// signed by this user using the credentials stored in the wallet.
			await gateway.connect(ccp, {
				wallet,
				identity: org1UserId,
				discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
			});

			// Build a network instance based on the channel where the smart contract is deployed
			const network = await gateway.getNetwork(channelName);

			// Get the contract from the network.
			const contract  = network.getContract(chaincodeName);
			movieContract = contract;

			// Initialize a set of asset data on the channel using the chaincode 'InitLedger' function.
			// This type of transaction would only be run once by an application the first time it was started after it
			// deployed the first time. Any updates to the chaincode deployed later would likely not need to run
			// an "init" type function.
			console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger');
			await contract.submitTransaction('InitLedger');
			console.log('*** Result: committed');

			// Let's try a query type operation (function).
			// This will be sent to just one peer and the results will be shown.
			console.log('\n--> Evaluate Transaction: GetAllAssets, function returns all the current assets on the ledger');
			let result = await contract.evaluateTransaction('GetAllAssets');
			console.log(`*** Result: ${prettyJSONString(result.toString())}`);

			// Now let's try to submit a transaction.
			// This will be sent to both peers and if both peers endorse the transaction, the endorsed proposal will be sent
			// to the orderer to be committed by each of the peer's to the channel ledger.
			console.log('\n--> Submit Transaction: CreateAsset, creates new asset with ID, color, owner, size, and appraisedValue arguments');
			result = await contract.submitTransaction('CreateAsset', 'asset313', 'yellow', '5', 'Tom', '1300');
			console.log('*** Result: committed');
			if (`${result}` !== '') {
				console.log(`*** Result: ${prettyJSONString(result.toString())}`);
			}

			console.log('\n--> Evaluate Transaction: ReadAsset, function returns an asset with a given assetID');
			result = await contract.evaluateTransaction('ReadAsset', 'asset313');
			console.log(`*** Result: ${prettyJSONString(result.toString())}`);

			console.log('\n--> Evaluate Transaction: AssetExists, function returns "true" if an asset with given assetID exist');
			result = await contract.evaluateTransaction('AssetExists', 'asset1');
			console.log(`*** Result: ${prettyJSONString(result.toString())}`);

			console.log('\n--> Submit Transaction: UpdateAsset asset1, change the appraisedValue to 350');
			await contract.submitTransaction('UpdateAsset', 'asset1', 'blue', '5', 'Tomoko', '350');
			console.log('*** Result: committed');

			console.log('\n--> Evaluate Transaction: ReadAsset, function returns "asset1" attributes');
			result = await contract.evaluateTransaction('ReadAsset', 'asset1');
			console.log(`*** Result: ${prettyJSONString(result.toString())}`);

			try {
				// How about we try a transactions where the executing chaincode throws an error
				// Notice how the submitTransaction will throw an error containing the error thrown by the chaincode
				console.log('\n--> Submit Transaction: UpdateAsset asset70, asset70 does not exist and should return an error');
				await contract.submitTransaction('UpdateAsset', 'asset70', 'blue', '5', 'Tomoko', '300');
				console.log('******** FAILED to return an error');
			} catch (error) {
				console.log(`*** Successfully caught the error: \n    ${error}`);
			}

			console.log('\n--> Submit Transaction: TransferAsset asset1, transfer to new owner of Tom');
			await contract.submitTransaction('TransferAsset', 'asset1', 'Tom');
			console.log('*** Result: committed');

			console.log('\n--> Evaluate Transaction: ReadAsset, function returns "asset1" attributes');
			result = await contract.evaluateTransaction('ReadAsset', 'asset1');
			console.log(`*** Result: ${prettyJSONString(result.toString())}`);
		} finally {
			// Disconnect from the gateway when the application is closing
			// This will close all connections to the network
			gateway.disconnect();
		}
	} catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
		process.exit(1);
	}
}


//main();
