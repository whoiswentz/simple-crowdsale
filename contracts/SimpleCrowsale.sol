//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.0;

import "./SimpleCoin.sol";

contract SimpleCrowdsale {
    uint256 public startTime;
    uint256 public endTime;

    uint256 public weiTokenPrice;
    uint256 public weiInvestimentObjective;

    uint256 public investmentReceived;
    uint256 public investmentRefunded;

    bool public isFinalized;
    bool public isRefundingAllowed;

    address public owner;

    mapping(address => uint256) public investmentAmountOf;

    SimpleCoin public crowdSaleToken;

    event LogInvestment(address indexed from, uint256 value);
    event LogTokenAssignment(address indexed from, uint256 numToken);

    constructor(
        uint256 _startTime,
        uint256 _endTime,
        uint256 _weiTokenPrice,
        uint256 _etherInvestmentObjective
    ) {
        require(_startTime >= block.timestamp);
        require(_endTime >= _startTime);
        require(_weiTokenPrice > 0);
        require(_etherInvestmentObjective > 0);

        startTime = _startTime;
        endTime = _endTime;

        weiTokenPrice = _weiTokenPrice;
        weiInvestimentObjective =
            _etherInvestmentObjective *
            1000000000000000000;

        crowdSaleToken = new SimpleCoin(0);

        isFinalized = false;
        isRefundingAllowed = false;

        owner = msg.sender;
    }

    function invest() public payable {
        address _investor = msg.sender;
        uint256 _investment = msg.value;

        require(isValidInvestment(_investment));

        investmentAmountOf[_investor] += _investment;
        investmentReceived += _investment;

        assignToken(_investor, _investment);

        emit LogInvestment(_investor, _investment);
    }

    function isValidInvestment(uint256 _investment)
        internal
        view
        returns (bool)
    {
        bool nonZeroInvestment = _investment != 0;
        bool withinCrowdSalePeriod = true;
        // bool withinCrowdSalePeriod =
        //     block.timestamp >= startTime && block.timestamp <= endTime;

        return nonZeroInvestment && withinCrowdSalePeriod;
    }

    function assignToken(address _beneficiary, uint256 _investment) internal {
        uint256 _numberOfTokens = calculateNumberOfToken(_investment);
        crowdSaleToken.mint(_beneficiary, _numberOfTokens);
    }

    function calculateNumberOfToken(uint256 _investment)
        internal
        view
        returns (uint256)
    {
        return _investment / weiTokenPrice;
    }
}
