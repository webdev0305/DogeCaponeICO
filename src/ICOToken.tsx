import { formatUnits, formatEther, parseEther } from "@ethersproject/units";
import { useWeb3React } from "@web3-react/core";
import { BigNumber, ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useQuery } from "react-query";

import TokenArtifacts from "./artifacts/contracts/DogeCaponeToken.sol/DogeCaponecoin.json";
import CrowdsaleArtifacts from "./artifacts/contracts/Crowdsale.sol/Crowdsale.json";
import logger from "./logger";
import { DogeCaponecoin } from "./types/DogeCaponecoin";
import { Crowdsale } from "./types/Crowdsale";

interface Props {
  crowdsaleAddress: string;
}

declare global {
  interface Window {
    ethereum: ethers.providers.ExternalProvider;
  }
}

const providerUrl = import.meta.env.VITE_PROVIDER_URL;

const TokenInfo = ({ tokenAddress }: { tokenAddress: string }) => {
  const { library } = useWeb3React();

  const fetchTokenInfo = async () => {
    logger.warn("fetchTokenInfo");
    const provider = library || new ethers.providers.Web3Provider(window.ethereum || providerUrl);
    const tokenContract = new ethers.Contract(tokenAddress, TokenArtifacts.abi, provider) as DogeCaponecoin;
    const name = await tokenContract.name();
    const symbol = await tokenContract.symbol();
    const decimals = await tokenContract.decimals();
    const totalSupply = await tokenContract.totalSupply();
    logger.warn("token info", { name, symbol, decimals });
    return {
      name,
      symbol,
      decimals,
      totalSupply,
    };
  };
  const { error, isLoading, data } = useQuery(["token-info", tokenAddress], fetchTokenInfo, {
    enabled: tokenAddress !== "",
  });

  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  return (
    <div className="flex flex-col">
      <button className="btn">
        {data?.name}
        <div className="ml-2 badge">{data?.symbol}</div>
        <div className="ml-2 badge badge-info">{data?.decimals}</div>
      </button>

      <div className="shadow stats">
        <div className="stat">
          <div className="stat-title">Total Supply</div>
          <div className="stat-value">{formatUnits(data?.totalSupply ?? 0)}</div>
        </div>
      </div>
    </div>
  );
};

async function requestAccount() {
  if (window.ethereum?.request) return window.ethereum.request({ method: "eth_requestAccounts" });

  throw new Error("Missing install Metamask. Please access https://metamask.io/ to install extension on your browser");
}

const ICOToken = ({ crowdsaleAddress }: Props) => {
  const { library, chainId, account } = useWeb3React();
  const [tokenAddress, setTokenAddress] = useState("");
  const [totalSale, settotalSale] = useState("0");
  const [subTotal, setSubTotal] = useState("0");
  const [enableClaime, setEnableClaim] = useState(false);
  const [amount, setAmount] = useState("1");
  const [claimableAmount, setClaimableAmount] = useState("0")

  const handleSetSubTotal = (subtotal:any) =>{
    setSubTotal(BigNumber.from(subtotal).toString())
  }
  // fetch crowdsale token info
  const fetchCrowdsaleTokenInfo = () => {
    logger.warn("fetchCrowdsaleTokenInfo");
    const provider = library || new ethers.providers.Web3Provider(window.ethereum || providerUrl);
    const contract = new ethers.Contract(
      crowdsaleAddress,
      CrowdsaleArtifacts.abi,
      provider
    ) as Crowdsale;
    contract.token().then(setTokenAddress).catch(logger.error);
    contract
      .weiRaised()
      .then((total) => settotalSale(BigNumber.from(total).toString()))
      .catch(logger.error);
    contract
      .holderWeiRaised(String(account))
      .then((subtotal) => {
        // handleSetSubTotal(subtotal)
        setSubTotal(BigNumber.from(subtotal).toString())
      })
      .catch(logger.error);
    contract
      .enableTransferToken()
      .then((status) => setEnableClaim(status))
      .catch(logger.error);
    contract
      ._getClaimableTokenAmount(String(account))
      .then((amount) => {setClaimableAmount(BigNumber.from(amount).toString()), console.log(amount)})
      .catch(logger.error);
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      if (library) {
        fetchCrowdsaleTokenInfo();
        console.log(claimableAmount)
      }
    }, 1000)
    return () => clearInterval(interval)
    // try {
    //   fetchCrowdsaleTokenInfo();
    //   console.log(claimableAmount)
    // } catch (error) {
    //   logger.error(error);
    // }
  }, [library]);

  // buy token base on quantity
  const buyTokens = async () => {
    const provider = library || new ethers.providers.Web3Provider(window.ethereum || providerUrl);
    const signer = provider.getSigner();
    try {
      if (!account) {
        await requestAccount();
        return;
      }
      const txPrams = {
        to: crowdsaleAddress,
        value: ethers.BigNumber.from(parseEther(String(amount))),
      };
      logger.warn({ txPrams });
      const transaction = await signer.sendTransaction(txPrams);
      toast.promise(transaction.wait(), {
        loading: `Transaction submitted. Wait for confirmation...`,
        success: <b>Transaction confirmed!</b>,
        error: <b>Transaction failed!.</b>,
      });

      // refetch total token after processing
      transaction
        .wait()
        .then(() => fetchCrowdsaleTokenInfo())
        .catch(logger.error);
    } catch (error) {
      toast.error(parseError(error))
      logger.error(error);
    }
  };

  // claim token base on quantity
  const claimTokens = async () => {
    const provider = library || new ethers.providers.Web3Provider(window.ethereum || providerUrl);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      crowdsaleAddress,
      CrowdsaleArtifacts.abi,
      signer
    ) as Crowdsale;
    try {
      if (!account) {
        await requestAccount();
        return;
      }
      
      const transaction = await contract._processPurchase()
      console.log(transaction)
      toast.promise(transaction.wait(), {
        loading: `Transaction submitted. Wait for confirmation...`,
        success: <b>Transaction confirmed!</b>,
        error: <b>Transaction failed!.</b>,
      });
      
    } catch (error) {
      toast.error(parseError(error))
      logger.error(error);
    }
  };

  const parseError = (ex: any) => {
    if (typeof ex == 'object')
      return (ex.data?.message ?? null) ? ex.data.message.replace('execution reverted: ', '') : ex.message
    return ex
  }

  return (
    <div className="relative pb-3 sm:max-w-5xl sm:mx-auto pt-10 bg-[#fdc514]">
      {chainId !== 56 && (
        <>
          <div className="alert mb-2">
            <div className="flex-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#ff5722"
                className="w-6 h-6 mx-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                />
              </svg>
              <label>Please connect to the BSC mainnet.</label>
            </div>
          </div>
        </>
      )}

      <div className="flex items-center w-full px-4 py-10 bg-cover card border-black rounded-none bg-[#fdc514]">
        {/* <TokenInfo tokenAddress={tokenAddress} /> */}
        <div className="mb-8">
            <h2 className="text-4xl font-medium text-black uppercase text-bold">Private Sale</h2>
          </div>
        <div className="text-center w-3/4">
          <div className="bg-black">
            <h2 className="text-2xl font-medium p-2 text-[#f8e670] uppercase">My Contribution {Number(subTotal)/1e18} BNB</h2>
          </div>
          {/* <div className="">
            <h2 className="text-2xl p-2 text-black uppercase">Doge Capone Private Sale</h2>
          </div> */}
          {!account && 
            <div> 
              <h2 className="text-2xl p-2 text-black uppercase">Please connect your wallet to deposit</h2>
            </div>
          }

          <div className="">
            <h2 className="text-2xl p-2 text-black uppercase">{Number(totalSale)/1e18}/50 BNB Filled</h2>
          </div>
            <input
              type="number"
              min="0.1"
              max="2"
              step="0.1"
              value={amount}
              onChange={(evt) => setAmount(evt.target.valueAsNumber <=2 ? evt.target.valueAsNumber.toString():'')}
              className="bg-[#fdc514] border border-black p-1 w-[10rem] text-black text-2xl"
            />
            <div>
              <div className="justify-center card-actions my-2">
                {!enableClaime?
                <button onClick={buyTokens} type="button" className="btn btn-outline border-black border-2 text-black text-xl hover:bg-[#fdc510]">
                  BUY
                </button>
                : 
                <button onClick={claimTokens} type="button" className="btn btn-outline border-black border-2 text-black text-xl hover:bg-[#fdc510]">
                  {(Number(claimableAmount)/1e18).toFixed(2)} CLAIM
                </button>
                }
              </div>
              {/* <div className="badge badge-md">Total: {totalCost} ETH</div> */}
            </div>
            
            <div className="bg-black">
              <h2 className="text-2xl font-medium p-2 text-[#f8e670] uppercase">Min/Max Contribution 0.1/2 BNB </h2>
            </div>
            <div className="bg-black my-2">
              <h2 className="text-2xl font-medium p-2 text-[#f8e670] uppercase">Hard Cap 50BNB</h2>
            </div>
        </div>

        {/* <div className="divider"></div>

        <div className="items-center justify-center max-w-2xl px-4 py-4 mx-auto text-xl border-orange-500 lg:flex md:flex">
          <div className="p-2 font-semibold">
            <a
              href={`https://ropsten.etherscan.io/address/${tokenAddress}`}
              target="_blank"
              className="px-4 py-1 ml-2 text-white bg-orange-500 rounded-full shadow focus:outline-none"
              rel="noreferrer"
            >
              View Token on Etherscan
            </a>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default ICOToken;
