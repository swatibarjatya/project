Set up Hyperledger test network on mac

https://dev.to/capriciousrebel/getting-started-with-hyperledger-fabric-on-macos-2937

To start the network, run following commands from folder fabric-samples/test-network

./network.sh down

./network.sh up createChannel -c movie -ca

./network.sh deployCC -c movie -ccn movie -ccp ../../../../../hackathon/project/ -ccl go

To start NodeJS application, run following commands from folder api/javascript

npm start

Hyperledger Express tutorial
https://burakcanekici.medium.com/an-implementation-of-a-rest-api-to-your-custom-network-with-expressjs-node-js-ff156a0c2c0d

Hyperledger read the docs
https://hyperledger-fabric.readthedocs.io/en/latest/write_first_app.html


Install Mongodb for Mac
https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/
