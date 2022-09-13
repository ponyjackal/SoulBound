import { Signer } from "@ethersproject/abstract-signer";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import type { Greeter } from "../../src/types/Greeter";
import type { Greeter__factory } from "../../src/types/factories/Greeter__factory";
import { readContractAddress } from "../deploy/addresses/utils";
import { readValue, writeValue } from "./values/utils";

task("Greeter:setGreeting").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const accounts: Signer[] = await ethers.getSigners();
  const greetingAddress = readContractAddress("greeter");
  const greeting = readValue("greeting");

  const greeterFactory: Greeter__factory = <Greeter__factory>await ethers.getContractFactory("Greeter", accounts[0]);
  // attatch Greeter
  const greeter: Greeter = await greeterFactory.attach(greetingAddress);

  try {
    await greeter.setGreeting(greeting);
    console.log("Greeter:setGreeting success", greeting);
  } catch (err) {
    console.log("Greeter:setGreeting error", err);
  }
});
