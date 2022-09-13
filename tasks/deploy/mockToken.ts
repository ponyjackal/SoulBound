import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import type { MockToken } from "../../src/types/contracts/MockToken";
import type { MockToken__factory } from "../../src/types/factories/contracts/MockToken__factory";
import { readContractAddress, writeContractAddress } from "./addresses/utils";

task("deploy:MockToken").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const signers: SignerWithAddress[] = await ethers.getSigners();
  const mockTokenFactory: MockToken__factory = <MockToken__factory>await ethers.getContractFactory("MockToken");
  const mockToken: MockToken = <MockToken>await mockTokenFactory.connect(signers[0]).deploy();
  await mockToken.deployed();

  writeContractAddress("mockToken", mockToken.address);
  console.log("MockToken deployed to: ", mockToken.address);
});

task("verify:MockToken").setAction(async function (taskArguments: TaskArguments, { run }) {
  const address = readContractAddress("mockToken");

  try {
    await run("verify:verify", {
      address,
      constructorArguments: [],
    });
  } catch (err) {
    console.log(err);
  }
});
