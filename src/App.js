import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import React, { useCallback, useEffect, useState, useMemo } from 'react'
import { ethers } from 'ethers';
import myEpicNft from "./util/MyEpicNFT.json"

// Constants
const TWITTER_HANDLE = 'EntaroNil';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 20;

const App = () => {

  const ethereum = useMemo(() => {
    const { ethereum } = window 
    return ethereum
  }, [])

  const [account, setAccount] = useState("")
  useEffect(() => {
    if (!ethereum){
      return
    }
    ethereum.request({ method: "eth_accounts" }).then((accounts) => {
      if (accounts.length !== 0){
        const account = accounts[0];
        setAccount(account)
        console.log("Found an account: ", account)
      }
    })
  }, [])


  const connectWallet = useCallback(
    () => {
      if (!ethereum) return

      ethereum.request({ method: "eth_requestAccounts" }).then((accounts) => {
        if (accounts.length !== 0){
          const account = accounts[0];
          setAccount(account)
          console.log("Found an account: ", account)
        }
      })
    },
    [],
  );

  const askContractToMintNft = useCallback(async () => {
    const CONTRACT_ADDRESS = "0x694681f1b3175D3cb608462B6527EdcbBf1b5616"

    try {
      if (!ethereum) return

      let chainId = await ethereum.request({ method: "eth_chainId" })
      console.log("Connected to chain " + chainId)
      const rinkebyChainId = "0x4"
      if (chainId !== rinkebyChainId){
        alert("You are not connected to the rinkeby test network!")
      }

      const provider = new ethers.providers.Web3Provider(ethereum)
      const signer = provider.getSigner()
      const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer)

      console.log("Going to pop wallet now to pay gas...")
      const nftTxn = await connectedContract.makeAnEpicNFT();

      console.log("Mining...please wait.")
      await nftTxn.wait()

      console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
      connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
        console.log(from, tokenId.toNumber())
        alert(`Hey there! We've minted your NFT. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: <https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}>`)
      });

    } catch(err){
      console.log(err)
    }
  }, [ethereum])


  // Render Methods
  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  const renderMintButton = () => (
    <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
      Mint NFT
    </button>
  );

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          {account ? renderMintButton() : renderNotConnectedContainer()}
          <button className="cta-button connect-wallet-button" style={{marginLeft: "32px"}}>
          🌊 View Collection on OpenSea
          </button>
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
