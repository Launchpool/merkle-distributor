require('dotenv').config()
require('@nomiclabs/hardhat-waffle')
require('@nomiclabs/hardhat-truffle5')
require('solidity-coverage')
require('hardhat-gas-reporter')
require('@nomiclabs/hardhat-solhint')
require('@nomiclabs/hardhat-etherscan')

const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID
const PRIVATE_KEY = process.env.LAUNCH_POOL_PRIVATE_KEY
const PRIVATE_TEST_KEY = process.env.PRIVATE_KEY

let nonDevelopmentNetworks = {}

// If we have a private key, we can setup non dev networks
if (PRIVATE_KEY) {
  nonDevelopmentNetworks = {
    mainnet: {
      gasPrice: 92000000000, // 20 gwei
      url: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: [`${PRIVATE_KEY}`]
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: [`0x${PRIVATE_TEST_KEY}`],
      gasPrice: 130000000000 // 13o gwei
    },
    testnetbsc: {
      url: `https://data-seed-prebsc-1-s1.binance.org:8545/`,
      accounts: [`${PRIVATE_KEY}`]
    },
    mainnetbsc: {
      url: `https://bsc-dataseed.binance.org/`,
      accounts: [`${PRIVATE_KEY}`]
    },
    mainnetfantom: {
      url: `https://rpc.ftm.tools/`,
      accounts: [`${PRIVATE_KEY}`]
    },
    testnetfantom: {
      url: `https://rpc.testnet.fantom.network/`,
      accounts: [`${PRIVATE_KEY}`]
    },
    mainnetpolygon: {
      url: `https://polygon-rpc.com/`,
      accounts: [`${PRIVATE_KEY}`]
    },
    testnetpolygon: {
      url: `https://rpc-mumbai.maticvigil.com`,
      accounts: [`${PRIVATE_KEY}`]
    },
    mainnetavax: {
      url: `https://api.avax.network/ext/bc/C/rpc`,
      accounts: [`${PRIVATE_KEY}`]
    },
    testnetavax: {
      url: `https://api.avax-test.network/ext/bc/C/rpc`,
      accounts: [`${PRIVATE_KEY}`]
    }
  }
}

module.exports = {
  solidity: {
    version: '0.6.11',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  gasReporter: {
    currency: 'USD',
    enabled: false,
    gasPrice: 50
  },
  networks: {
    ...nonDevelopmentNetworks,
    coverage: {
      url: 'http://localhost:8555'
    }
  },
  etherscan: {
    apiKey: process.env.BSCSCAN_KEY
  }
}
