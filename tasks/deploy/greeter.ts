import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import type { Greeter } from "../../src/types/contracts/Greeter";
import type { Greeter__factory } from "../../src/types/factories/contracts/Greeter__factory";
import { readContractAddress, writeContractAddress } from "./addresses/utils";
import cArguments from "./arguments/greeter";

task("deploy:Greeter").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const signers: SignerWithAddress[] = await ethers.getSigners();
  const greeterFactory: Greeter__factory = <Greeter__factory>await ethers.getContractFactory("Greeter");
  const greeter: Greeter = <Greeter>await greeterFactory.connect(signers[0]).deploy(cArguments.GREETING);
  await greeter.deployed();

  writeContractAddress("greeter", greeter.address);
  console.log("Greeter deployed to: ", greeter.address);
});

task("verify:Greeter").setAction(async function (taskArguments: TaskArguments, { run }) {
  const address = readContractAddress("greeter");

  try {
    await run("verify:verify", {
      address,
      constructorArguments: [cArguments.GREETING],
    });
  } catch (err) {
    console.log(err);
  }
});
