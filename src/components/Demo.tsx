import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector";
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from "@web3-react/walletconnect-connector";
import React from "react";

import { injected, POLLING_INTERVAL } from "../dapp/connectors";
import { useEagerConnect, useInactiveListener } from "../dapp/hooks";
import logger from "../logger";
import { Header } from "./Header";

function getErrorMessage(error: Error) {
  if (error instanceof NoEthereumProviderError) {
    return "No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.";
  } else if (error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network.";
  } else if (
    error instanceof UserRejectedRequestErrorInjected ||
    error instanceof UserRejectedRequestErrorWalletConnect
  ) {
    return "Please authorize this website to access your Ethereum account.";
  } else {
    logger.error(error);
    return "An unknown error occurred. Check the console for more details.";
  }
}

export function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = POLLING_INTERVAL;
  return library;
}

export default function Demo() {
  const context = useWeb3React<Web3Provider>();
  const { connector, activate, deactivate, active, error, account } = context;

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = React.useState<any>();
  React.useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector);

  const activating = injected === activatingConnector;
  const connected = injected === connector;
  const disabled = !triedEager || !!activatingConnector || connected || !!error;
  return (
    <Header>
      <div className="flex flex-row w-full ml-4 mr-4 justify-center items-center">
        <img src="/dogecapone.png" alt="logo"/>
        {/* <span className="text-6xl">Doge Capone</span> */}
        
          {connected?
            <button
              className="btn bg-yellow-400 hover:bg-yellow-300 text-black border-inherit"
              onClick={() => {
                deactivate();
              }}
            >
              {account === null
              ? "-"
              : account
              ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}`
              : ""}
            </button>
            :<button
            className="btn bg-yellow-400 hover:bg-yellow-300 text-black border-inherit"
            disabled={disabled}
            onClick={() => {
              setActivatingConnector(injected);
              activate(injected);
            }}
            >
            Connect Wallet
          </button>}
      </div>
    </Header>
  );
}
