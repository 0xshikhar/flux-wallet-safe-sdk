/* eslint-disable camelcase */
import { SimpleWalletAPI } from "@account-abstraction/sdk";
import { hexConcat } from "ethers/lib/utils";

import {
  FluxWallet,
  FluxWallet__factory,
  FluxWalletDeployer__factory,
} from "../typechain-types";

export class FluxWalletAPI extends SimpleWalletAPI {
  walletContract?: FluxWallet;
  factory?: any;

  async _getWalletContract(): Promise<FluxWallet> {
    if (this.walletContract == null) {
      this.walletContract = FluxWallet__factory.connect(await this.getWalletAddress(), this.provider);
    }
    return this.walletContract;
  }

  async getWalletInitCode(): Promise<string> {
    if (this.factory == null) {
      if (this.factoryAddress != null && this.factoryAddress !== "") {
        this.factory = FluxWalletDeployer__factory.connect(this.factoryAddress, this.provider);
      } else {
        throw new Error("no factory to get initCode");
      }
    }
    const ownerAddress = await this.owner.getAddress();
    const data = this.factory.interface.encodeFunctionData("deployWallet", [
      this.entryPointAddress,
      ownerAddress,
      this.index,
      0
    ]);
    console.log(data);
    return hexConcat([this.factory.address, data]);
  }
}
