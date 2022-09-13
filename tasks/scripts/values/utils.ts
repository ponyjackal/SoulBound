import { config as dotenvConfig } from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenvConfig({ path: path.resolve(__dirname, "../../../.env") });

type ValueKey = "greeting";

export const ZERO_ADDRESS = "0x" + "0".repeat(40);

export const network = () => {
  const { DEPLOY_NETWORK } = process.env;

  return DEPLOY_NETWORK || "goerli";
};

export const writeValue = (key: ValueKey, value: any) => {
  const NETWORK = network();

  const rawData = fs.readFileSync(path.join(__dirname, `./${NETWORK}.json`));
  const info = JSON.parse(rawData.toString());

  fs.writeFileSync(
    path.join(__dirname, `./${NETWORK}.json`),
    JSON.stringify(
      {
        ...info,
        [key]: value,
      },
      null,
      2,
    ),
  );
};

export const readValue = (key: ValueKey): string => {
  const NETWORK = network();

  const rawData = fs.readFileSync(path.join(__dirname, `./${NETWORK}.json`));
  const info = JSON.parse(rawData.toString());

  return info[key];
};
