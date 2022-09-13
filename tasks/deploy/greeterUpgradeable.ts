import { Signer } from "@ethersproject/abstract-signer";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { GreeterUpgradeable__factory } from "../../src/types/factories/contracts/GreeterUpgradeable__factory";
import { readContractAddress, writeContractAddress } from "./addresses/utils";
import cArguments from "./arguments/greeter";

task("deploy:GreeterUpgradeable").setAction(async function (taskArguments: TaskArguments, { ethers, upgrades }) {
  const accounts: Signer[] = await ethers.getSigners();

  // deploy GreeterUpgradeable
  const greeterFactory: GreeterUpgradeable__factory = <GreeterUpgradeable__factory>(
    await ethers.getContractFactory("GreeterUpgradeable", accounts[0])
  );
  const greeterProxy = await upgrades.deployProxy(greeterFactory, [cArguments.GREETING]);
  await greeterProxy.deployed();

  writeContractAddress("greeterProxy", greeterProxy.address);
  console.log("GreeterUpgradeable proxy deployed to: ", greeterProxy.address);

  const kittyKart = await upgrades.erc1967.getImplementationAddress(greeterProxy.address);
  writeContractAddress("greeter", kittyKart);
  console.log("GreeterUpgradeable deployed to: ", kittyKart);
});

task("upgrade:GreeterUpgradeable").setAction(async function (taskArguments: TaskArguments, { ethers, upgrades }) {
  console.log("--- start upgrading the GreeterUpgradeable Contract ---");
  const accounts: Signer[] = await ethers.getSigners();

  const greeterFactory: GreeterUpgradeable__factory = <GreeterUpgradeable__factory>(
    await ethers.getContractFactory("GreeterUpgradeable", accounts[0])
  );

  const greeterProxyAddress = readContractAddress("greeterProxy");

  const upgraded = await upgrades.upgradeProxy(greeterProxyAddress, greeterFactory);

  console.log("GreeterUpgradeable upgraded to: ", upgraded.address);

  const greeter = await upgrades.erc1967.getImplementationAddress(upgraded.address);
  writeContractAddress("greeter", greeter);
  console.log("Implementation :", greeter);
});

task("verify:GreeterUpgradeable").setAction(async function (taskArguments: TaskArguments, { run }) {
  const address = readContractAddress("greeter");

  try {
    await run("verify:verify", {
      address,
      constructorArguments: [],
    });
  } catch (err) {
    console.log(err);
  }
});
