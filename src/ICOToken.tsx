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
  const [closingTime, setClosingTime] = useState("0");
  const [amount, setAmount] = useState("1");

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
      .then((subtotal) => setSubTotal(BigNumber.from(subtotal).toString()))
      .catch(logger.error);
    // contract
    //   .closingTime()
    //   .then((time) => setClosingTime(BigNumber.from(time).toString()))
    //   .catch(logger.error);
  };
  useEffect(() => {
    try {
      fetchCrowdsaleTokenInfo();
    } catch (error) {
      logger.error(error);
    }
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

  const parseError = (ex: any) => {
    if (typeof ex == 'object')
      return (ex.data?.message ?? null) ? ex.data.message.replace('execution reverted: ', '') : ex.message
    return ex
  }

  return (
    <div className="relative pb-3 sm:max-w-5xl sm:mx-auto pt-10 bg-[#fdc514]">
      {chainId !== 97 && (
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
              <label>Please connect to the BSC testnet.</label>
            </div>
          </div>
        </>
      )}

      <div className="flex items-center w-full px-4 py-6 bg-cover card bg-[#fdc514]">
        {/* <TokenInfo tokenAddress={tokenAddress} /> */}
        
        <div className="text-center w-3/4">
          <div className="">
            <h2 className="text-5xl p-2 text-black mb-4">Private Sale</h2>
          </div>
          <div className="bg-black">
            <h2 className="text-xl p-2 text-[#f8e670]">My Contribution {Number(subTotal)/1e18} BNB</h2>
          </div>
          {!account && 
            <div>
              <h2 className="text-2xl p-2 text-black">Please connect your wallet to deposit</h2>
            </div>
          }
          <div>
            <h2 className="text-2xl p-2 text-black">{Number(totalSale)/1e18}/50 BNB Filled</h2>
          </div>
          <div className="mt-4 mb-8">
            <input
              type="number"
              min="0.1"
              max="2"
              step="0.1"
              value={amount}
              onChange={(evt) => setAmount(evt.target.valueAsNumber <=2 ? evt.target.valueAsNumber.toString():'')}
              className="bg-[#fdc514] border border-black p-1 w-[10rem] text-black text-2xl"
            />
          </div>
            {account && <div>
              <div className="justify-center card-actions my-4">
                <button onClick={buyTokens} type="button" className="btn btn-outline text-black text-xl">
                  BUY
                </button>
              </div>
            </div>
            }
            <div className="bg-black mb-2">
              <h2 className="text-xl p-2 text-[#f8e670]">Min/Max Contribution 0.1/2 BNB </h2>
            </div>
            <div className="bg-black">
              <h2 className="text-xl p-2 text-[#f8e670]">Hard Cap 50BNB</h2>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ICOToken;
