// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
/**
 * @title Crowdsale
 * @dev Borrow from https://github.dev/OpenZeppelin/openzeppelin-contracts/blob/docs-v2.x/contracts/crowdsale/Crowdsale.ol and upgrade to solidity v0.8.0
 * @dev Crowdsale is a base contract for managing a token crowdsale,
 * allowing investors to purchase tokens with ether. This contract implements
 * such functionality in its most fundamental form and can be extended to provide additional
 * functionality and/or custom behavior.
 * The external interface represents the basic interface for purchasing tokens, and conforms
 * the base architecture for crowdsales. It is *not* intended to be modified / overridden.
 * The internal interface conforms the extensible and modifiable surface of crowdsales. Override
 * the methods to add functionality. Consider using 'super' where appropriate to concatenate
 * behavior.
 */
contract Crowdsale is Context, ReentrancyGuard, Ownable {
	using SafeERC20 for IERC20;

	// The token being sold
	IERC20 private _token;

	// Address where funds are collected
	address payable private _wallet;

	// How many token units a buyer gets per wei.
	// The rate is the conversion between wei and the smallest and indivisible token unit.
	// So, if you are using a rate of 1 with a ERC20Detailed token with 3 decimals called TOK
	// 1 wei will give you 1 unit, or 0.001 TOK.
	uint256 private _rate;

	// Amount of wei raised
	uint256 private _weiRaised;
	bool public enableTransferToken = false;
	uint256 public startTime = block.timestamp;  // + 30 days;
	uint32 public claimableRatePerDay = 333;  // 10000 is 100%
	uint256 public maxWeiAmountForHolder = 2 ether;
	uint256 public maxTotalWeiAmount = 50 ether;

	mapping(address => uint256) private _holdersWeiRaised;
	mapping(address => uint256) private _holderClaimedAmount;

	/**
	 * Event for token purchase logging
	 * @param purchaser who paid for the tokens
	 * @param beneficiary who got the tokens
	 * @param amount amount of tokens purchased
	 */
	event TokensPurchased(
		address indexed purchaser,
		address indexed beneficiary,
		uint256 amount
	);

	/**
	 * @param rate Number of token units a buyer gets per wei
	 * token unit. So, if you are using a rate of 1 with a ERC20Detailed token
	 * with 3 decimals called TOK, 1 wei will give you 1 unit, or 0.001 TOK.
	 * @param wallet Address where collected funds will be forwarded to
	 * @param token Address of the token being sold
	 */
	constructor(
		uint256 rate,
		address payable wallet,
		IERC20 token
	) public {
		require(rate > 0, "Crowdsale: rate is 0");
		require(wallet != address(0), "Crowdsale: wallet is the zero address");
		require(
			address(token) != address(0),
			"Crowdsale: token is the zero address"
		);

		_rate = rate;
		_wallet = wallet;
		_token = token;
	}

	/**
	 * @dev fallback function ***DO NOT OVERRIDE***
	 * Note that other contracts will transfer funds with a base gas stipend
	 * of 2300, which is not enough to call buyTokens. Consider calling
	 * buyTokens directly when purchasing tokens from a contract.
	 */
	receive() external payable {
		buyTokens(_msgSender());
	}

	/**
	 * @return the token being sold.
	 */
	function token() public view returns (IERC20) {
		return _token;
	}

	function updateToken(IERC20 tokenAddress) public onlyOwner {
		_token = tokenAddress;
	}

	function setEnableTransferToken(bool _status) public onlyOwner {
		enableTransferToken = _status;
	}

	/**
	 * @return the address where funds are collected.
	 */
	function wallet() public view returns (address payable) {
		return _wallet;
	}

	function updateWallet(address payable _account) public onlyOwner {
		_wallet =  _account;
	}

	/**
	 * @return the number of token units a buyer gets per wei.
	 */
	function rate() public view returns (uint256) {
		return _rate;
	}

	

	function updateRate(uint256 _value) public onlyOwner {
		_rate = _value;
	}

	/**
	 * @return the amount of wei raised.
	 */
	function weiRaised() public view returns (uint256) {
		return _weiRaised;
	}

	/**
	 * @return the amount of holders wei raised.
	 */
	function holderWeiRaised(address account) public view returns (uint256) {
		return _holdersWeiRaised[account];
	}

	function setMaxWeiAmountForHolder(uint256 _value) public onlyOwner() {
		maxWeiAmountForHolder = _value;
	}

	function setMaxTotalWeiAmount(uint256 _value) public onlyOwner() {
		maxTotalWeiAmount = _value;
	}

	/**
	 * @dev low level token purchase ***DO NOT OVERRIDE***
	 * This function has a non-reentrancy guard, so it shouldn't be called by
	 * another `nonReentrant` function.
	 * @param beneficiary Recipient of the token purchase
	 */
	function buyTokens(address beneficiary) public payable nonReentrant {
		uint256 weiAmount = msg.value;
		_preValidatePurchase(beneficiary, weiAmount);
		// update state
		_weiRaised = _weiRaised + weiAmount;
		_holdersWeiRaised[msg.sender] =  _holdersWeiRaised[msg.sender] + weiAmount;

		_forwardFunds();
		_postValidatePurchase();
	}

	/**
	 * @dev Validation of an incoming purchase. Use require statements to revert state when conditions are not met.
	 * Use `super` in contracts that inherit from Crowdsale to extend their validations.
	 * Example from CappedCrowdsale.sol's _preValidatePurchase method:
	 *     super._preValidatePurchase(beneficiary, weiAmount);
	 *     require(weiRaised().add(weiAmount) <= cap);
	 * @param beneficiary Address performing the token purchase
	 * @param weiAmount Value in wei involved in the purchase
	 */
	function _preValidatePurchase(address beneficiary, uint256 weiAmount)
		internal
		view
		virtual
	{
		require(
			beneficiary != address(0),
			"Crowdsale: beneficiary is the zero address"
		);
		require(weiAmount >= 0.1 ether, "Crowdsale: weiAmount must be bigger 0.1 BNB!");
		this; // silence state mutability warning without generating bytecode - see https://github.com/ethereum/solidity/issues/2691
	}

	/**
	 * @dev Validation of an executed purchase. Observe state and use revert statements to undo rollback when valid
	 * conditions are not met.
	 */
	function _postValidatePurchase()
		internal
		view
	{
		require(_holdersWeiRaised[msg.sender] <= maxWeiAmountForHolder, "Crowdsale: weiAmount must be less than 2 BNB!");
		this;
		// solhint-disable-previous-line no-empty-blocks
	}

	/**
	 * @dev Source of tokens. Override this method to modify the way in which the crowdsale ultimately gets and sends
	 * its tokens.
	 * @param beneficiary Address performing the token purchase
	 * @param tokenAmount Number of tokens to be emitted
	 */
	function _deliverTokens(address beneficiary, uint256 tokenAmount) internal virtual
	{
		_holderClaimedAmount[beneficiary] += tokenAmount;
		_token.safeTransfer(beneficiary, tokenAmount);
	}

	/**
	 * @dev Executed when a purchase has been validated and is ready to be executed. Doesn't necessarily emit/send
	 * tokens.
	 */
	function _processPurchase()	public
	{
		require(enableTransferToken, "Token Transfer disabled!");
		address beneficiary = msg.sender;
		require(_holdersWeiRaised[msg.sender] > 0, "Claimable Amount is zero");
		// calculate token amount to be created
		uint256 claimableTokenAmount = _getClaimableTokenAmount(beneficiary);
		_deliverTokens(beneficiary, claimableTokenAmount);
		
		emit TokensPurchased(_msgSender(), beneficiary, claimableTokenAmount);
	}

	/**
	 * @dev Override for extensions that require an internal state to check for validity (current user contributions,
	 * etc.)
	 * @param beneficiary Address receiving the tokens
	 * @param weiAmount Value in wei involved in the purchase
	 */
	function _updatePurchasingState(address beneficiary, uint256 weiAmount)
		internal
	{
		// solhint-disable-previous-line no-empty-blocks
	}

	/**
	 * @dev Override to extend the way in which ether is converted to tokens.
	 * @param account Address of claimable holder
	 * @return Number of tokens that can be purchased with the specified _weiAmount
	 */
	function _getClaimableTokenAmount(address account) public view returns (uint256)
	{
		uint256 weiAmount = _holdersWeiRaised[account];
		uint256 totalClaimableAmount = weiAmount * _rate;
		uint256 claimableAmount = totalClaimableAmount * claimableRatePerDay/10000 * (block.timestamp - startTime)/86400;
		return claimableAmount - _holderClaimedAmount[account];
	}

	/**
	 * @dev Determines how ETH is stored/forwarded on purchases.
	 */
	function _forwardFunds() internal {
		_wallet.transfer(msg.value);
	}

	function withdrawToken(address beneficiary, uint256 tokenAmount) public onlyOwner{
		_token.safeTransfer(beneficiary, tokenAmount);
	}

	function setStartTime (uint256 _startTime) public onlyOwner {
		startTime = _startTime;
	}
	function setClaimableRatePerDay(uint32 _value) public onlyOwner{
		// 10000 is 100%
		require(_value <= 10000, "Max rate is 10000!");
		claimableRatePerDay = _value;		
	}
}
