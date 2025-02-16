const prompt = require('prompt-sync')()
const ERC1155Metadata = require('../abi/LaunchPoolErc1155.json')
const LPOOL_ERC1155_ADDRESS = '0xDE508B1313367309360ddd5F0F416c42102a0eEf'
const LPOOL_ERC1155_BSC_ADDRESS = '0x7A3c1a95fF81819eAdB5b8D9Ca0D86891eD340Ed'
async function main () {
  const [deployer] = await ethers.getSigners()

  console.log('Deploying staking contract with guild using the account:', await deployer.getAddress())

  const tokenAddress = prompt('\nERC1155 address? ') // 0x7A3c1a95fF81819eAdB5b8D9Ca0D86891eD340Ed
  const merkleRoot = prompt('\nMerkle root? ') // 0x4c8deaee140b3ce151162f6742f11f7c0c4c0f58a536579d7f7dbd45bfa20143 copy from generated json
  const tokenId = prompt('\nToken Id? ') // 0x02
  const amount = prompt('\nAmount to mint? ') // 0x146a
  const amountToTransfer = prompt('\nAmount to transfer? ') // 0
  const timelockDays = prompt('\nTimelock days? ') // 0

  const tokenInstance = new ethers.Contract(tokenAddress, ERC1155Metadata.abi, deployer)

  console.log('ERC1155 address:', tokenAddress)

  console.log('\nMerkle root:', merkleRoot)
  console.log('\nToken Id:', tokenId)
  console.log('\nAmount to mint:', amount)
  console.log('\nAmount to transfer:', amountToTransfer)

  prompt('If happy, hit enter...')

  const MerkleDistributorFactory = await ethers.getContractFactory('MerkleErc1155Distributor')

  const merkleDistributorInstance = await MerkleDistributorFactory.deploy(tokenAddress, merkleRoot, timelockDays)

  await merkleDistributorInstance.deployed()

  console.log('Claim contract deployed at', merkleDistributorInstance.address)

  console.log('About to mint tokens to claim contract')

  prompt('\nIf happy, hit enter...\n')

  const deployerAddress = await deployer.getAddress()
  console.log('\nMinting tokens from ' + deployerAddress + ' to ' + merkleDistributorInstance.address)
  if (amount > 0) {
    const tx = await tokenInstance.mint(merkleDistributorInstance.address, tokenId, amount)
    await tx.wait()
  }

  if (amountToTransfer > 0) {
    const tx = await tokenInstance.safeTransferFrom(
      deployerAddress,
      merkleDistributorInstance.address,
      tokenId,
      amountToTransfer,
      0x0
    )
    await tx.wait()
  }

  console.log('Done!')

  console.log('Finished!')
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
