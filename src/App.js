import './App.css'
import { useState, useEffect } from 'react'
import { getCurrentWalletConnected } from './utils/interact'
import { ethers } from 'ethers'

function App() {
  const [Main_Page, setMain_Page] = useState('visible')
  const [Auction_Page, setAuction_Page] = useState('hidden')
  const [Time, setTime] = useState('4D3H22M')
  const [Wallet, setWallet] = useState()
  const [status, setstatus] = useState('Connect wallet')
  const [CurrentBid, setCurrentBid] = useState(100);
  const [Amount, setAmount] = useState(0);
  const [Amount_Ap, setAmount_Ap] = useState();

  const contractAddress = '0xB3818B57364a1cA2B3f6E2D1dd0DBE9CaA6C08bF' // your nft contract address  here 
  const contractABI = require('./contract/abi.json') // nft contract abi 
  const AVALANCHE_TESTNET_PARAMS = {
    chainId: '0xA869',
    chainName: 'Avalanche Testnet C-Chain',
    nativeCurrency: {
      name: 'Avalanche',
      symbol: 'AVAX',
      decimals: 18
    },
    rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
    blockExplorerUrls: ['https://testnet.snowtrace.io/']
  }

  useEffect(() => {
    async function onReload() {
      const { address } = await getCurrentWalletConnected()
      Timer()
      setWallet(address)
      addWalletListener();
      
    }
    onReload()
  }, [])

  const OnbuttonClick = async () => {
    const Account = await connectWallet()
    setWallet(Account.address)
    // setstatus(
    //   'Connected ' +
    //     Account.address.slice(0, 4) +
    //     '...' +
    //     Account.address.slice(-3),
    // )
  }

  const Auction_View = () => {
    setMain_Page('hidden')
    setAuction_Page('visible')
  }
  const Back_button = () => {
    setMain_Page('visible')
    setAuction_Page('hidden')
  }

  const Timer = () => {
    var countDownDate = new Date('Jul 28, 2022 15:37:25').getTime() 
    var x = setInterval(function () {
      var now = new Date().getTime()
      var distance = countDownDate - now
      var days = Math.floor(distance / (1000 * 60 * 60 * 24))
      var hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      )
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      var seconds = Math.floor((distance % (1000 * 60)) / 1000)
      setTime(days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's ')
      if (distance < 0) {
        clearInterval(x)
        setTime('Auction Closed')
      }
    }, 1000)
  }
  Timer()

  const SmartContract = async () => {
    const provider = new ethers.providers.JsonRpcProvider(
      'https://api.avax.network/ext/bc/C/rpc',
    )
    const token = new ethers.Contract(contractAddress, contractABI, provider)
       /* global BigInt */
    
    const HighestBid = await token.highestBid()
    const Sob_Amount = HighestBid/10**18; 
    setCurrentBid(Sob_Amount);
  }

 SmartContract();  

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0])
          setstatus(
            'Connected ' +
              accounts[0].slice(0, 4) +
              '...' +
              accounts[0].slice(-3),
          )
        } else {
        }
      })
    } else {
    }
  }

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const addressArray = await window.ethereum.request({
          method: 'eth_requestAccounts',
        })
        switchToAvalancheChain()
        const obj = {
          address: addressArray[0],
        }
        return obj
      } catch (err) {
        return {
          address: '',
        }
      }
    } else {
      return {
        address: '',
      }
    }
  }

  const Approve_sob = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contractAddress = "0x396b961098756f421B628E3180bA9dC24589250c";// your token contract address here 
    const Allowance_Ad = "0xB3818B57364a1cA2B3f6E2D1dd0DBE9CaA6C08bF";// your nft contract address here 
    const amount = Amount_Ap*1000000000000000000; /* global BigInt */
    const contractABI = require("./contract/abi2.json");
    const token = new ethers.Contract(contractAddress, contractABI,provider.getSigner());
    await token.approve(Allowance_Ad,BigInt(amount));

  }
 
  const Bid_sob = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const token = new ethers.Contract(contractAddress, contractABI,provider.getSigner());
    
    
    await token.bid(Amount);
  }

  const AVALANCHE_MAINNET_PARAMS = {
    chainId: '0xA86A',
    chainName: 'Avalanche Mainnet C-Chain',
    nativeCurrency: {
      name: 'Avalanche',
      symbol: 'AVAX',
      decimals: 18,
    },
    rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
    blockExplorerUrls: ['https://snowtrace.io/'],
  }

  function switchToAvalancheChain() {
    // Request to switch to the selected Avalanche network
    window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [AVALANCHE_MAINNET_PARAMS],
    })
  }

  return (
    <div className="min-h-screen h-full w-full overflow-hidden flex flex-col items-center justify-center bg-brand-background ">
      <div className="relative w-full min-h-screen items-center justify-center">
        <img
          src="/images/background.png"
          alt="cover"
          className=" aspect-[22/9] min-h-screen w-screen bg-center object-fill "
        />
        <div
          style={{ visibility: Main_Page }}
          className="flex flex-col items-center justify-center h-full w-full px-2  "
        >
          <div
            class="card w-96 bg-gray-700/90 absolute m-auto left-0 right-0 bottom-0 top-0 h-[450px]"
            onClick={Auction_View}
          >
            <figure>
              <img
                className="w-[400px] h-[275px] px-4 m-2 py-2 border"
                src="/images/image.png"
                alt="car!"
              />
            </figure>
            <div className="card-body">
              <div>
                <span className="bold text-white  text-sm font-bold ">
                  SMOL BEANZ #966
                </span>
                <span className="bold text-red-600 text-sm pl-20 font-bold">
                  {Time}
                </span>
              </div>
              <span className="mx-auto text-white">MINIMUM BID 1 $SOB</span>
              <span className="mx-auto text-white">CURRENT BID {CurrentBid} $SOB</span>
            </div>
          </div>
          <button
            style={{ visibility: Main_Page }}
            onClick={OnbuttonClick}
            className="absolute btn right-10 top-6 bg-gray-800/90 shadow-sm rounded-md text-white "
          >
            {status}
          </button>
          {/* starting auction ui from here */}
          <div
            className="md:flex md:w-[880px] md:h-[490px] px-2 py-6 max-h-auto absolute border top-0 w-screen left-0 right-0 bottom-0 m-auto rounded-xl bg-gray-900/90 space-x-2 "
            style={{ visibility: Auction_Page }}
          >
            <div className="flex md:p-2 md:border aspect-auto min-h-0 min-w-screen justify-center items-center h-auto w-auto  mx-10  ">
              <figure>
              <img
                className=" md:h-[420px] md:w-[280px] aspect-square h-[220px] border"
                src="/images/image.png"
                alt="car!"
              />
            </figure>
            </div>
            <div className="mx-2 h-full w-auto min-w-0 min-h-0 flex flex-col space-y-6 p-2 ">
              <div className=" flex justify-center items-center min-h-0 min-w-0">
                <button
                  className="border min-h-0 min-w-0 text-white ml-8 mr-6 w-44"
                  onClick={Back_button}
                >
                  {' '}
                  Back to main page
                </button>
                <button
                  className="border min-h-0 min-w-0 text-white w-44 mr-6"
                  onClick={OnbuttonClick}
                >
                  {status}
                </button>
              </div>
              <div className="flex min-h-0 min-w-0 flex-col justify-center items-center border py-6 rounded-lg  ">
                <h1 className="text-white font-bold">SMOL BEANZ #966</h1>
                <div className="flex">
                  <button
                    className="text-red-600 min-h-0 min-w-0 font-bold border text-[12px] bg-gray-700 rounded-lg px-4 mt-4 mx-3"
                    onClick={SmartContract}
                  >
                    {Time}
                  </button>
                  <button className="text-white min-h-0 min-w-0 font-bold border text-[12px] bg-gray-700 rounded-lg px-4 mt-4 mx-3">
                    CURRENT BID {CurrentBid} $SOB
                  </button>
                  <button className="text-white min-h-0 min-w-0 font-bold border text-[12px] bg-gray-700 rounded-lg px-4 mt-4 mx-3">
                    MIN BID 1 $SOB
                  </button>
                </div>
              </div>
              <div className="flex items-center min-h-0 min-w-0  justify-center p-4 space-x-4">
                <button className="text-white border rounded-sm w-36"
                onClick={Approve_sob}>
                  Approve
                </button>
                <input type={'number'} min={CurrentBid+1}
                onChange={event => setAmount_Ap(event.target.value)}></input>
              </div>
              <div className="flex items-center min-h-0 min-w-0 justify-center p-4 space-x-4">
                <button className="text-white border rounded-sm w-36"
                onClick={Bid_sob}>
                  Bid
                </button>
                <input type={'number'} min={CurrentBid+1}
                onChange={event => setAmount(event.target.value)}></input>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
