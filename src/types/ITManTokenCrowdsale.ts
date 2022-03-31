/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "./common";

export interface ITManTokenCrowdsaleInterface extends utils.Interface {
  contractName: "ITManTokenCrowdsale";
  functions: {
    "buyTokens(address)": FunctionFragment;
    "closingTime()": FunctionFragment;
    "hasClosed()": FunctionFragment;
    "holderWeiRaised(address)": FunctionFragment;
    "isOpen()": FunctionFragment;
    "openingTime()": FunctionFragment;
    "owner()": FunctionFragment;
    "rate()": FunctionFragment;
    "remainingTokens()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "token()": FunctionFragment;
    "tokenWallet()": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "updateRate(uint256)": FunctionFragment;
    "updateToken(address)": FunctionFragment;
    "updateWallet(address)": FunctionFragment;
    "wallet()": FunctionFragment;
    "weiRaised()": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "buyTokens", values: [string]): string;
  encodeFunctionData(
    functionFragment: "closingTime",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "hasClosed", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "holderWeiRaised",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "isOpen", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "openingTime",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(functionFragment: "rate", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "remainingTokens",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "token", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "tokenWallet",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "updateRate",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "updateToken", values: [string]): string;
  encodeFunctionData(
    functionFragment: "updateWallet",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "wallet", values?: undefined): string;
  encodeFunctionData(functionFragment: "weiRaised", values?: undefined): string;

  decodeFunctionResult(functionFragment: "buyTokens", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "closingTime",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "hasClosed", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "holderWeiRaised",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "isOpen", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "openingTime",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "rate", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "remainingTokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "token", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "tokenWallet",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "updateRate", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "updateToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateWallet",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "wallet", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "weiRaised", data: BytesLike): Result;

  events: {
    "OwnershipTransferred(address,address)": EventFragment;
    "TimedCrowdsaleExtended(uint256,uint256)": EventFragment;
    "TokensPurchased(address,address,uint256,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TimedCrowdsaleExtended"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TokensPurchased"): EventFragment;
}

export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  { previousOwner: string; newOwner: string }
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export type TimedCrowdsaleExtendedEvent = TypedEvent<
  [BigNumber, BigNumber],
  { prevClosingTime: BigNumber; newClosingTime: BigNumber }
>;

export type TimedCrowdsaleExtendedEventFilter =
  TypedEventFilter<TimedCrowdsaleExtendedEvent>;

export type TokensPurchasedEvent = TypedEvent<
  [string, string, BigNumber, BigNumber],
  {
    purchaser: string;
    beneficiary: string;
    value: BigNumber;
    amount: BigNumber;
  }
>;

export type TokensPurchasedEventFilter = TypedEventFilter<TokensPurchasedEvent>;

export interface ITManTokenCrowdsale extends BaseContract {
  contractName: "ITManTokenCrowdsale";
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: ITManTokenCrowdsaleInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    buyTokens(
      beneficiary: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    closingTime(overrides?: CallOverrides): Promise<[BigNumber]>;

    hasClosed(overrides?: CallOverrides): Promise<[boolean]>;

    holderWeiRaised(
      account: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    isOpen(overrides?: CallOverrides): Promise<[boolean]>;

    openingTime(overrides?: CallOverrides): Promise<[BigNumber]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    rate(overrides?: CallOverrides): Promise<[BigNumber]>;

    remainingTokens(overrides?: CallOverrides): Promise<[BigNumber]>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    token(overrides?: CallOverrides): Promise<[string]>;

    tokenWallet(overrides?: CallOverrides): Promise<[string]>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    updateRate(
      _value: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    updateToken(
      token: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    updateWallet(
      _account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    wallet(overrides?: CallOverrides): Promise<[string]>;

    weiRaised(overrides?: CallOverrides): Promise<[BigNumber]>;
  };

  buyTokens(
    beneficiary: string,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  closingTime(overrides?: CallOverrides): Promise<BigNumber>;

  hasClosed(overrides?: CallOverrides): Promise<boolean>;

  holderWeiRaised(
    account: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  isOpen(overrides?: CallOverrides): Promise<boolean>;

  openingTime(overrides?: CallOverrides): Promise<BigNumber>;

  owner(overrides?: CallOverrides): Promise<string>;

  rate(overrides?: CallOverrides): Promise<BigNumber>;

  remainingTokens(overrides?: CallOverrides): Promise<BigNumber>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  token(overrides?: CallOverrides): Promise<string>;

  tokenWallet(overrides?: CallOverrides): Promise<string>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  updateRate(
    _value: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  updateToken(
    token: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  updateWallet(
    _account: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  wallet(overrides?: CallOverrides): Promise<string>;

  weiRaised(overrides?: CallOverrides): Promise<BigNumber>;

  callStatic: {
    buyTokens(beneficiary: string, overrides?: CallOverrides): Promise<void>;

    closingTime(overrides?: CallOverrides): Promise<BigNumber>;

    hasClosed(overrides?: CallOverrides): Promise<boolean>;

    holderWeiRaised(
      account: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isOpen(overrides?: CallOverrides): Promise<boolean>;

    openingTime(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<string>;

    rate(overrides?: CallOverrides): Promise<BigNumber>;

    remainingTokens(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    token(overrides?: CallOverrides): Promise<string>;

    tokenWallet(overrides?: CallOverrides): Promise<string>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    updateRate(_value: BigNumberish, overrides?: CallOverrides): Promise<void>;

    updateToken(token: string, overrides?: CallOverrides): Promise<void>;

    updateWallet(_account: string, overrides?: CallOverrides): Promise<void>;

    wallet(overrides?: CallOverrides): Promise<string>;

    weiRaised(overrides?: CallOverrides): Promise<BigNumber>;
  };

  filters: {
    "OwnershipTransferred(address,address)"(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;

    "TimedCrowdsaleExtended(uint256,uint256)"(
      prevClosingTime?: null,
      newClosingTime?: null
    ): TimedCrowdsaleExtendedEventFilter;
    TimedCrowdsaleExtended(
      prevClosingTime?: null,
      newClosingTime?: null
    ): TimedCrowdsaleExtendedEventFilter;

    "TokensPurchased(address,address,uint256,uint256)"(
      purchaser?: string | null,
      beneficiary?: string | null,
      value?: null,
      amount?: null
    ): TokensPurchasedEventFilter;
    TokensPurchased(
      purchaser?: string | null,
      beneficiary?: string | null,
      value?: null,
      amount?: null
    ): TokensPurchasedEventFilter;
  };

  estimateGas: {
    buyTokens(
      beneficiary: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    closingTime(overrides?: CallOverrides): Promise<BigNumber>;

    hasClosed(overrides?: CallOverrides): Promise<BigNumber>;

    holderWeiRaised(
      account: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isOpen(overrides?: CallOverrides): Promise<BigNumber>;

    openingTime(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    rate(overrides?: CallOverrides): Promise<BigNumber>;

    remainingTokens(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    token(overrides?: CallOverrides): Promise<BigNumber>;

    tokenWallet(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    updateRate(
      _value: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    updateToken(
      token: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    updateWallet(
      _account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    wallet(overrides?: CallOverrides): Promise<BigNumber>;

    weiRaised(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    buyTokens(
      beneficiary: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    closingTime(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    hasClosed(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    holderWeiRaised(
      account: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isOpen(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    openingTime(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    rate(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    remainingTokens(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    token(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    tokenWallet(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    updateRate(
      _value: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    updateToken(
      token: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    updateWallet(
      _account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    wallet(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    weiRaised(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
