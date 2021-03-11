//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.0;

contract SimpleCoin {
    address public owner;

    mapping(address => uint256) public coinBalance;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);

    modifier onlyOwner {
        if (msg.sender != owner) {
            revert("Only owner can call mint");
        }
        _;
    }

    constructor(uint256 _initialSupply) {
        owner = msg.sender;
        mint(msg.sender, _initialSupply);
    }

    function transfer(address _to, uint256 _amount) public {
        require(coinBalance[msg.sender] >= _amount);

        coinBalance[msg.sender] -= _amount;
        coinBalance[_to] += _amount;

        emit Transfer(msg.sender, _to, _amount);
    }

    function authorize(address _authorizedAccount, uint256 _allowance)
        public
        returns (bool)
    {
        allowance[msg.sender][_authorizedAccount] = _allowance;
        return true;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _amount
    ) public returns (bool) {
        require(coinBalance[_from] > _amount);
        require(coinBalance[_to] + _amount >= coinBalance[_to]);
        require(_amount <= allowance[_from][msg.sender]);

        coinBalance[_from] -= _amount;
        coinBalance[_to] += _amount;
        allowance[_from][msg.sender] -= _amount;
        emit Transfer(_from, _to, _amount);

        return true;
    }

    function mint(address _recipient, uint256 _mintedAmount) public onlyOwner {
        coinBalance[_recipient] += _mintedAmount;

        emit Transfer(msg.sender, _recipient, _mintedAmount);
    }
}
