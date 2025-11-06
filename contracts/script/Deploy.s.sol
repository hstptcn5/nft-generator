// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {IdentityNFT} from "../src/IdentityNFT.sol";

contract DeployScript is Script {
    function run() external returns (IdentityNFT) {
        vm.startBroadcast();
        
        IdentityNFT nft = new IdentityNFT(msg.sender);
        
        vm.stopBroadcast();
        return nft;
    }
}

