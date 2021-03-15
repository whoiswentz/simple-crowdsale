//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.0;

import "./SimpleCoin.sol"

contract SimpleCrowdsale {
    uint256 public startTime;
    uint256 public endTime;

    uint256 public weiTokenPrice;
    uint256 public weiInvestimentObjective;

    bool public isFinalized;
    bool public isRefundingAllowed;

    address public owner;

    mapping(address => uint256) public investmentAmountOf;

    SimpleCoin public crowdSaleToken;

    constructor(
        uint256 _startTime,
        uint256 _endTime,
        uint256 _weiTokenPrice,
        uint256 _etherInvestmentObjective
    ) {
        require(_startTime >= block.timestamp);
        require(_endTime >= _startTime);
        require(_weiTimePrice > 0);
        require(_etherInvestmentObjective > 0);

        startTime = _startTime;
        endTime = _endTime;

        weiTokenPrice = _weiTokenPrice;
        weiInvestmentObjective = _etherInvestmentObjective * 1000000000000000000;

        crowdSaleToken = new SimpleCoin(0);

        isFinalized = false;
        isRefundAllowed = false;

        owner = msg.sender;
    }
}