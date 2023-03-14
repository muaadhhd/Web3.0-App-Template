// https://eth-goerli.g.alchemy.com/v2/7GiYDrK6jylg--82WMPFOkfhOmafgpIy

require("@nomiclabs/hardhat-waffle");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.0",
  networks: {
    goerli: {
      url: 'https://eth-goerli.g.alchemy.com/v2/7GiYDrK6jylg--82WMPFOkfhOmafgpIy',
      accounts: ['9b93e70bdf29d265d58621e1bf111dbf68751515a0a571d747be17afc3d6b7a9']
    }
  }
};
