import { Web3ReactProvider } from "@web3-react/core";
import React from "react";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import "./App.css";
import ICOToken from "./ICOToken";
import Demo from "./components/Demo";
import { getLibrary } from "./components/Demo";

const crowdsaleAddress = import.meta.env.VITE_CROWDSALE_ADDRESS;

const queryClient = new QueryClient();
function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <QueryClientProvider client={queryClient}>
        <div className="App" >
          <Demo />
          <ICOToken crowdsaleAddress={crowdsaleAddress} />
        </div>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        <Toaster position="top-right" />
      </QueryClientProvider>
    </Web3ReactProvider>
  );
}

export default App;
