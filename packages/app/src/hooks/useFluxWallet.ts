/* eslint-disable camelcase */
import { EntryPoint, EntryPoint__factory } from "@account-abstraction/contracts";
import { useEffect, useState } from "react";
import { useAccount, useNetwork, useSigner } from "wagmi";

// import { generateMerkleTree } from "@/util";
import { FluxWalletAPI } from "../../../contracts/lib/FluxWalletAPI";
import { FluxWallet, FluxWallet__factory } from "../../../contracts/typechain-types";

// console.log(generateMerkleTree)

export const useFluxWallet = () => {
  const { data: signer } = useSigner();
  const { isConnected, address } = useAccount();

  const network = useNetwork();
  const [fluxWalletAPI, setFluxWalletAPI] = useState<FluxWalletAPI>();
  const [fluxWalletAddress, setFluxWalletAddress] = useState("");
  const [isDeployed, setIsDeployed] = useState(false);
  const [entryPoint, setEntryPoint] = useState<EntryPoint>();
  const [contract, setContract] = useState<FluxWallet>();
  const [ownerWallet, setOwnerWallet] = useState("");

  const [balance, setBalance] = useState("0");
  // console.log("Signer:", ownerWallet);

  useEffect(() => {
    if (!signer || !isConnected) {
      setFluxWalletAPI(undefined);
      setFluxWalletAddress("");
      return;
    }

    window.localStorage.setItem("debug", "aa*");

    const connectedNetwork = network.chain?.network ? network.chain.network : "goerli";
    if (connectedNetwork !== "localhost" && connectedNetwork !== "goerli") {
      alert("please connect goerli network!");
      return;
    }
    import(`../../../contracts/deployments/${connectedNetwork}.json`).then((deployments) => {
      const fluxWalletAPI = new FluxWalletAPI({
        // assuming if signer is not null, provider is also not null
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        provider: signer.provider!,
        entryPointAddress: deployments.entryPoint,
        owner: signer,
        factoryAddress: deployments.factory,
      });
      setFluxWalletAPI(fluxWalletAPI);
      console.log(fluxWalletAPI.provider)

      // eslint-disable-next-line no-use-before-define
      const fluxWalletAddress = window.localStorage.getItem(`${address}:connectedNetwork`);

      if (!fluxWalletAddress) {
        // get create2 address when init the app
        fluxWalletAPI.getWalletAddress().then((fluxWalletAddress) => {
          window.localStorage.setItem(`${address}:connectedNetwork`, fluxWalletAddress);
          setFluxWalletAddress(fluxWalletAddress);
          signer.provider!.getCode(fluxWalletAddress).then((code) => setIsDeployed(code !== "0x"));
          const contract = FluxWallet__factory.connect(fluxWalletAddress, signer);
          setContract(contract);
          signer.provider?.getBalance(fluxWalletAddress).then((balance) => setBalance(balance.toString()));
        });
      } else {
        setFluxWalletAddress(fluxWalletAddress);
        signer.provider!.getCode(fluxWalletAddress).then((code) => setIsDeployed(code !== "0x"));
        const contract = FluxWallet__factory.connect(fluxWalletAddress, signer);
        setContract(contract);
        signer?.getAddress().then(result => setOwnerWallet(result));


        signer.provider?.getBalance(fluxWalletAddress).then((balance) => setBalance(balance.toString()));
      }

      // assuming if signer is not null, provider is also not null
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const entryPoint = EntryPoint__factory.connect(deployments.entryPoint, signer);
      setEntryPoint(entryPoint);
    });
  }, [signer, network.chain, isConnected]);

  return { entryPoint, fluxWalletAPI, fluxWalletAddress, isDeployed, contract, balance, ownerWallet };
};

// export const useQrCode = () => {
//   const [_uri, _secret, root] = await generateMerkleTree();
//   console.log("Seturi12:")

//   console.log(`root1: ${root}`)
//   setSecret(_secret);
//   setURI(_uri);
//   console.log("Seturi :", setURI)
//   console.log()
//   console.log("URI" + uri)

//   return { uri }
// }

