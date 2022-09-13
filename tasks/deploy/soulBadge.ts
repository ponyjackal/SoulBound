import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import type { SoulBadge } from "../../src/types/contracts/SoulBadge";
import type { SoulBadge__factory } from "../../src/types/factories/contracts/SoulBadge__factory";
import { readContractAddress, writeContractAddress } from "./addresses/utils";
import cArguments from "./arguments/soulBadge";

task("deploy:SoulBadge").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const signers: SignerWithAddress[] = await ethers.getSigners();
  const soulBadgeFactory: SoulBadge__factory = <SoulBadge__factory>await ethers.getContractFactory("SoulBadge");
  const soulBadge: SoulBadge = <SoulBadge>(
    await soulBadgeFactory
      .connect(signers[0])
      .deploy(cArguments.NAME, cArguments.SYMBOL, cArguments.COLLECTION_URI, cArguments.TOKEN_IMAGE_URI)
  );
  await soulBadge.deployed();

  writeContractAddress("soulBadge", soulBadge.address);
  console.log("SoulBadge deployed to: ", soulBadge.address);
});

task("verify:SoulBadge").setAction(async function (taskArguments: TaskArguments, { run }) {
  const address = readContractAddress("soulBadge");

  try {
    await run("verify:verify", {
      address,
      constructorArguments: [cArguments.NAME, cArguments.SYMBOL, cArguments.COLLECTION_URI, cArguments.TOKEN_IMAGE_URI],
    });
  } catch (err) {
    console.log(err);
  }
});
