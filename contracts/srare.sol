pragma solidity ^0.8.0;

import {VennFirewallConsumer} from "@ironblocks/firewall-consumer/contracts/consumers/VennFirewallConsumer.sol";

contract Rare is VennFirewallConsumer {
    uint256 public value;

    function myMethod() external firewallProtected {
        value = 42; // Simple implementation
    }
}