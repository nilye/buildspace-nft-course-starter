import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import React, { useCallback, useEffect, useState, useMemo } from 'react'
import { ethers } from 'ethers';

// Constants
const TWITTER_HANDLE = '_buildspace';
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
    const CONTRACT_ADDRESS = "0x4a0469d024B88D6606383691Fede39b54C24E520"

    try {
      if (!ethereum) return
      const provider = new ethers.providers.Web3Provider(ethereum)
      const signer = provider.getSigner()
      const connectedContract = new ethers.Contract(CONTRAST_ADDRESS, myEpicNft.abi, signer)

      const nftTxn = await connectedContract.makeAnEpicNFT();
      await nftTxn.wait()

    } catch(err){
      console.log(err)
    }
  }, [])


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
