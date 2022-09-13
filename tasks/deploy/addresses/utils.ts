import { config as dotenvConfig } from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenvConfig({ path: path.resolve(__dirname, "../../../.env") });

type FileName = "greeter" | "greeterProxy";

export const network = () => {
  const { DEPLOY_NETWORK } = process.env;

  return DEPLOY_NETWORK || "goerli";
};

export const writeContractAddress = (contractFileName: FileName, address: string) => {
  const NETWORK = network();

  fs.writeFileSync(
    path.join(__dirname, `${NETWORK}/${contractFileName}.json`),
    JSON.stringify(
      {
        address,
      },
      null,
      2,
    ),
  );
};

export const readContractAddress = (contractFileName: FileName): string => {
  const NETWORK = network();

  const rawData = fs.readFileSync(path.join(__dirname, `${NETWORK}/${contractFileName}.json`));
  const info = JSON.parse(rawData.toString());

  return info.address;
};
