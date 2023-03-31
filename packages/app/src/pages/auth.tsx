/* eslint-disable camelcase */

// import { ethers } from "ethers";
// import { parseEther } from "ethers/lib/utils";
import { NextPage } from "next";
// import Image from 'next/image';
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

// import { useAccount, useSigner } from "wagmi";
import { DefaultLayout } from "@/components/layouts/Default";

// import { useFluxWallet } from "@/hooks/useFluxWallet";
// import { NULL_ADDRESS, NULL_BYTES } from "../../../contracts/lib/utils";
import { generateMerkleTree } from "../util";
// import { onwer } from './index'
// import { useDataContext } from "./index";

export interface PeerMeta {
    name: string;
    url: string;
}

const AuthPage: NextPage = () => {
    const [deployed, setDeployed] = useState(false);
    const [secret, setSecret] = useState("");
    const [uri, setURI] = useState("");
    const [auth, setAuth] = useState("")

    const router = useRouter();

    const deploy = async (event: any) => {
        event.preventDefault();
        setDeployed(false);

        const [_uri, _secret, root] = await generateMerkleTree();
        console.log(`root: ${root}`);
        setSecret(_secret);
        setURI(_uri);
        // console.log("URI" + _uri);
        // console.log("Secret", _secret);

        setDeployed(true);
        event.preventDefault();
    };

    console.log("Secret:", secret);
    // const [deployed, setDeployed] = useState(false);
    // const [scwAddress, setScwAddress] = useState("");
    // async function generateQR() {
    //     const [_uri, _secret, root] = await generateMerkleTree();
    //     console.log(`root: ${root}`)
    //     setSecret(_secret);
    //     setURI(_uri);
    // }


    // const [_uri, _secret, root] = await generateMerkleTree();
    // console.log("Seturi12:")
    // console.log(`root1: ${root}`)
    // setSecret(_secret);
    // setURI(_uri);

    // const { uri, address } = useDataContext() // using context api
    // console.log("uri:" + uri);
    // console.log("address:" + address);


    // useEffect(() => {
    //     async function MerkleTree() {
    //         const [_uri, _secret, root] = await generateMerkleTree();
    //         console.log(`root: ${root}`)
    //         setSecret(_secret);
    //         setURI(_uri);
    //     }
    // }, []);


    return (
        <DefaultLayout>
            <div className="appbox">
                {/* {fluxWalletAddress && (   )} */}
                <div id='header'>
                    <div className='pt-4 px-4'>
                        <h1 className="text-4xl text-white py-4  font-sans">
                            Hey ! 👋
                        </h1>
                        <h2 className="text-base text-white py-2 pb-10 font-sans "> Its time to secure you !</h2>
                    </div>

                    <div className='bg-white rounded-[16px] object-contain w-[320px] h-[480px] relative'>
                        <div className="flex h-full items-center justify-center px-4 inset-x-0 bottom-0">
                            <div className="w-full">
                                {/* <WalletAuth /> */}

                                {/* <button onClick={(e) => deploy(e)} className="btn" >
                                    Start Now 🚀
                                </button> */}

                                {deployed ? (
                                    <h2>Scan the QR code using Google Authenticator</h2>
                                ) : (
                                    <button onClick={(e) => deploy(e)} className="btn flex align-middle" >
                                        Generate Your QR Code
                                    </button>
                                )}

                                {/* // {deployed ? <h2>SCW Address: {scwAddress}</h2> : <div />} */}
                                {/* {deployed ? (
                                    //     <h2>Please send atleast 0.1 ETH to your SCW</h2>
                                    // ) : (
                                    //     <div />
                                    // )} */}

                                {deployed ? (
                                    <div>
                                        <img src={uri} width="100%" alt="flux wallet qr code" />
                                        <div className='px-6 text-center'>
                                            <input type="String" placeholder="Enter Verification Code" className="input input-bordered w-full max-w-xs" onChange={(e) => setAuth(e.target.value)} />
                                        </div>
                                        <div className='py-2 items-center justify-center text-center'>
                                            <label htmlFor="my-modal-6" className="btn" onClick={() => router.push("/send")} >Verify</label>
                                        </div>
                                    </div>)
                                    : (<div></div>)}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </DefaultLayout >
    );
};

export default AuthPage;
