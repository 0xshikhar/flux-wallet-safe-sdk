/* eslint-disable camelcase */
import { SafeOnRampEvent, SafeOnRampKit, SafeOnRampProviderType } from '@safe-global/onramp-kit';
import * as dotenv from "dotenv";
import { ethers } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAccount, useSigner } from "wagmi";

import { DefaultLayout } from "@/components/layouts/Default";
import { useFluxWallet } from "@/hooks/useFluxWallet";

import { NULL_ADDRESS, NULL_BYTES } from "../../../contracts/lib/utils";
import { FluxWallet__factory } from "../../../contracts/typechain-types";

// import WalletAuth from '../components/WalletAuth'
// import { generateMerkleTree } from "../util";

dotenv.config();

export interface PeerMeta {
  name: string;
  url: string;
}

export type GlobalContent = {
  uri: string
  address: string | undefined
}
export const dataContext = createContext<GlobalContent>({ uri: "", address: "" });
const isSessionValid = (sessionId: string) => sessionId.length === 28


const HomePage: NextPage = () => {
  const { fluxWalletAddress, entryPoint, fluxWalletAPI, isDeployed, balance, ownerWallet } = useFluxWallet();

  const router = useRouter();

  const { data: signer } = useSigner();
  const { address } = useAccount();
  const [isWalletConnectLoading] = useState(false);

  const [owner, setOwner] = useState("");
  const [wstatus, setwStatus] = useState("False");
  // for 2FA wallet auth
  const [secret, setSecret] = useState("");
  // const getUri = () => {
  //   return deploy3()
  // }
  const [uri, setURI] = useState("");

  const [walletAddress, setWalletAddress] = useState<string>("0xdeaa150597535Eed8c95Ad090757815F1B9Da15d")
  const [sessionId, setSessionId] = useState<string>('')
  const [onRampClient, setOnRampClient] = useState<SafeOnRampKit>()
  const stripeRootRef = useRef<HTMLDivElement>(null)

  const handleCreateSession = async () => {

    console.log("calling me again 3")

    // if (!isSessionValid(sessionId)) return
    if (stripeRootRef.current) {
      stripeRootRef.current.innerHTML = ''
    }
    console.log("calling me again 4")

    // setTimeout(function () {
    const sessionData = (onRampClient?.open({
      sessionId,
      walletAddress,
      networks: ['ethereum', 'polygon'],
      element: '#stripe-root',
      events: {
        onLoaded: () => console.log('onLoaded()'),
        onPaymentSuccessful: (eventData: SafeOnRampEvent) =>
          console.log('onPaymentSuccessful(): ', eventData),
        onPaymentProcessing: (eventData: SafeOnRampEvent) =>
          console.log('onPaymentProcessing(): ', eventData),
        onPaymentError: (eventData: SafeOnRampEvent) => console.log('onPaymentError(): ', eventData)
      }
    })) as any
    console.log("sessionData", sessionData)
    console.log("onRampClient", onRampClient)

    // }, 5000);

  }

  // async function stripeSession() {
  //   console.log("calling me again 1")

  //   const onRampClient = await SafeOnRampKit.init(SafeOnRampProviderType.Stripe, {
  //     onRampProviderConfig: {
  //       stripePublicKey: 'pk_test_51MZbmZKSn9ArdBimSyl5i8DqfcnlhyhJHD8bF2wKrGkpvNWyPvBAYtE211oHda0X3Ea1n4e9J9nh2JkpC7Sxm5a200Ug9ijfoO',
  //       onRampBackendUrl: 'https://aa-stripe.safe.global',
  //     }
  //   })

  //   setOnRampClient(onRampClient)
  //   console.log("onRampClient", onRampClient)
  //   console.log("calling me again 2 ")
  // }

  // useEffect(() => {
  //   ; (async () => {
  //     console.log('calling me again 1')

  //     const onRampClient = await SafeOnRampKit.init(SafeOnRampProviderType.Stripe, {
  //       onRampProviderConfig: {
  //         stripePublicKey: 'pk_test_51MZbmZKSn9ArdBimSyl5i8DqfcnlhyhJHD8bF2wKrGkpvNWyPvBAYtE211oHda0X3Ea1n4e9J9nh2JkpC7Sxm5a200Ug9ijfoO',
  //         onRampBackendUrl: 'https://aa-stripe.safe.global',
  //       }
  //     })

  //     setOnRampClient(onRampClient)
  //     console.log("calling me again 2")
  //     console.log(onRampClient)
  //   })()
  // }, [])


  // useEffect(() => {
  //   ; (async () => {
  //     console.log("calling me again 2")

  //     const onRampClient = await SafeOnRampKit.init(SafeOnRampProviderType.Stripe, {
  //       onRampProviderConfig: {
  //         stripePublicKey: 'pk_test_51MZbmZKSn9ArdBimSyl5i8DqfcnlhyhJHD8bF2wKrGkpvNWyPvBAYtE211oHda0X3Ea1n4e9J9nh2JkpC7Sxm5a200Ug9ijfoO',
  //         onRampBackendUrl: 'https://aa-stripe.safe.global',
  //       }
  //     })

  //     setOnRampClient(onRampClient)
  //   })()
  // }, [fluxWalletAddress])

  const deploy = async () => {
    if (!fluxWalletAPI || !entryPoint || !signer || !address) {
      return;
    }
    await signer.sendTransaction({
      to: fluxWalletAddress,
      value: parseEther("0.01"),
    });
  };

  const deploy2 = async () => {
    if (!fluxWalletAPI || !entryPoint || !signer || !address) {
      return;
    }
    const op = await fluxWalletAPI.createSignedUserOp({
      target: NULL_ADDRESS,
      data: NULL_BYTES,
    });

    await entryPoint.handleOps([op], address);
    // router.push("/auth");
  };

  const deploy3 = async (event: any) => {
    event.preventDefault();
    // setError(false);
    // setDeployed(false);

    // setDeploying(true);

    // console.log("Seturi11:")
    // console.log("Address", address)
    // const [_uri, _secret, root] = await generateMerkleTree();
    // console.log("Seturi12:")

    // console.log(`root1: ${root}`)
    // setSecret(_secret);
    // setURI(_uri);
    // console.log("Seturi :", setURI)
    // console.log("URI1" + uri)
    // console.log("URI2" + _uri)
    // console.log("Secret1", setSecret(_secret))
    // console.log("Secret2", _secret)


    // let {smartWalletAPI, httpRpcClient, aaProvier} = await getAaParams();
    // // await setRootAndVerifier(smartWalletAPI, aaProvier)
    // setScwAddress(await aaProvier.getSigner().getAddress())
    // console.log(`ScwAddress: ${scwAddress}`)
    // setDeploying(false);
    // setDeployed(true);
    // event.preventDefault();

    router.push("/auth");
  }

  useEffect(() => {
    if (!signer || !address || !fluxWalletAddress) {
      return;
    }
    if (isDeployed) {
      const contract = FluxWallet__factory.connect(fluxWalletAddress, signer);
      contract.owner().then((owner) => {
        setOwner(owner);
      });
    } else {
      setOwner(address);
    }

    ; (async () => {
      console.log('calling me again 1')

      const onRampClient = await SafeOnRampKit.init(SafeOnRampProviderType.Stripe, {
        onRampProviderConfig: {
          stripePublicKey: 'pk_test_51MZbmZKSn9ArdBimSyl5i8DqfcnlhyhJHD8bF2wKrGkpvNWyPvBAYtE211oHda0X3Ea1n4e9J9nh2JkpC7Sxm5a200Ug9ijfoO',
          onRampBackendUrl: 'https://aa-stripe.safe.global'
        }
      })

      setTimeout(function () {
        console.log("Fetching OnRampClient")
        console.log(onRampClient)
      }, 5000);

      setOnRampClient(onRampClient)
      console.log("calling me again 2")

    })()

  }, [signer, address, fluxWalletAddress, isDeployed]);


  return (
    <dataContext.Provider value={{ uri, address }}>
      <DefaultLayout>
        <div className="appbox">
          {fluxWalletAddress && (
            <div>
              <div className="pt-4 px-4">
                <h1 className="text-4xl text-white py-4  font-sans">Hey ! 👋</h1>
                <h2 className="text-base text-white py-2 pb-10 font-sans "> Welcome To Flux Smart Contract Wallet</h2>
                {/* <CircularProgress /> */}
              </div>

              <div className="bg-white rounded-[16px] object-contain w-[320px] h-[480px] relative">
                <div className="flex h-full items-center justify-center px-4 inset-x-0 bottom-0">
                  <div className="w-full">
                    <div>
                      <div className="overflow-visible absolute top-0 right-0">
                        {/* <div className="radial-progress bg-primary text-primary-content border-4 border-primary" style={{ "--value": 70, "--thickness": 10}}>70%</div> */}
                        {/* <div className="radial-progress text-primary" style={{"--value":70}}>70%</div> */}
                      </div>
                      <div className="py-4">
                        <h2 className="font-bold font-sans">AA Wallet Address </h2>
                        <p className="text-[11px]">{fluxWalletAddress}</p>
                        <p className="text-[10px]">* AA address is determined counterfactually by create2</p>
                      </div>
                      <div className="py-4">
                        <h2 className="font-bold font-sans">Owner Wallet Address </h2>
                        <p className="text-[11px]">{owner}</p>
                      </div>
                      <div className="py-4">
                        <h2 className="font-bold font-sans">
                          Deployed Status : {"  "}
                          {wstatus === "true" ? (
                            <div className="badge badge-success gap-2 text-[11px]">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="inline-block w-4 h-4 stroke-current"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"
                                ></path>
                              </svg>
                              success
                            </div>
                          ) : (
                            <div className="badge badge-error gap-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="inline-block w-4 h-4 stroke-current"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"
                                ></path>
                              </svg>
                              {wstatus}
                            </div>
                          )}
                        </h2>
                        <p className="text-[10px]">* no need to deploy to use acount abstraction wallet</p>
                      </div>
                      <div className="py-4">
                        <h2 className="font-bold font-sans flex">
                          Balance : {<p className="text-[14px]">{ethers.utils.formatEther(balance)} ETH</p>}
                        </h2>
                        <p className="text-[10px]">* deposit is required for demo</p>
                      </div>

                      {/* {isDeployed ? "Already deployed" : "Deploy"} */}
                      {/* <Button
                        w="full"
                        isLoading={isWalletConnectLoading}
                        onClick={deploy}
                        disabled={isDeployed}
                        colorScheme="brand"
                      >
                        Deposit 0.01ETH
                      </Button> */}
                      {/* {isDeployed ? "Already deployed" : "Deploy"} */}
                      {/* <Button w="full" isLoading={isWalletConnectLoading} onClick={deploy2} disabled={isDeployed}>
                        Deploy
                      
                      </Button> */}

                      <div className="w-screen">
                        <button
                          onClick={deploy}
                          disabled={isDeployed}
                          className="w-[280px] my-1 relative inline-flex items-center justify-center p-4 px-5 py-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out rounded-full shadow-xl group hover:ring-1 hover:ring-purple-500"
                        >
                          <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-700"></span>
                          <span className="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition duration-500 origin-bottom-left transform rotate-45 translate-x-24 bg-pink-500 rounded-full opacity-30 group-hover:rotate-90 ease"></span>
                          <span className="relative text-white">Deposit 0.1 ETH</span>
                        </button>

                      </div>
                      <div>
                        <label
                          htmlFor="my-modal-7"
                          className="btn w-[130px] mx-1 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-700 rounded-full shadow-xl group hover:ring-1 hover:ring-purple-500 transition duration-500 origin-bottom-left transform bg-pink-500"
                          onClick={handleCreateSession}
                        >
                          Via Stripe
                        </label>
                        <label
                          htmlFor="my-modal-6"
                          className="btn w-[130px] mx-1 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-700 rounded-full shadow-xl group hover:ring-1 hover:ring-purple-500 transition duration-500 origin-bottom-left transform bg-pink-500"
                        // onClick={ }
                        >
                          Via Gelato
                        </label>
                      </div>

                      <div>
                        <label
                          htmlFor="my-modal-6"
                          className="btn w-[280px] my-1 bg-gradient-to-br from-black via-grey-600 to-black rounded-full shadow-xl group hover:ring-1 hover:ring-purple-500 transition duration-500 origin-bottom-left transform bg-pink-500"
                          onClick={deploy2}
                        >
                          Deploy
                        </label>

                        {/* writing popup modal after deposit click */}
                        <input type="checkbox" id="my-modal-6" className="modal-toggle" />
                        <div className="modal modal-bottom sm:modal-middle">
                          <div className="modal-box relative">
                            <label htmlFor="my-modal-3" className="btn btn-sm btn-circle absolute right-2 top-2">
                              ✕
                            </label>

                            <h3 className="font-bold text-lg"> Deploying Your Smart Contract Wallet</h3>
                            <progress className="progress w-56"></progress>

                            <div
                              className="modal-action"
                            // onClick={() => {
                            //   router.push("/auth");
                            // }}
                            >
                              <label htmlFor="my-modal-6" className="btn" onClick={deploy3}>
                                Yay!
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* modal for stripe button */}
                        <input type="checkbox" id="my-modal-7" className="modal-toggle h-[600]" />
                        <div className="modal modal-bottom sm:modal-middle">
                          <div className="modal-box">
                            <div id="stripe-root" ref={stripeRootRef}></div>
                            <div className="modal-action">
                              <label htmlFor="my-modal-7" className="btn">Close</label>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DefaultLayout>

      {/* //   </div> */}
      {/* // </div> */}
    </dataContext.Provider >
  );
};

export default HomePage;
export const useDataContext = () => useContext(dataContext)