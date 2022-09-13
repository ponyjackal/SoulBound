// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.4;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "hardhat/console.sol";

error GreeterError();

contract GreeterUpgradeable is Initializable, OwnableUpgradeable {
    string public greeting;

    function initialize(string memory _greeting) external initializer {
        __Context_init();
        __Ownable_init();

        console.log("Deploying a Greeter with greeting:", _greeting);
        greeting = _greeting;
    }

    function greet() public view returns (string memory) {
        return greeting;
    }

    function setGreeting(string memory _greeting) public {
        console.log("Changing greeting from '%s' to '%s'", greeting, _greeting);
        greeting = _greeting;
    }

    function newFunction() external pure returns (string memory) {
        return "newFunction";
    }

    function throwError() external pure {
        revert GreeterError();
    }
}
