/* eslint-disable camelcase */

import { getAccount } from "@wagmi/core";
import { NextPage } from "next";
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import react, { useEffect, useState } from 'react'

import { DefaultLayout } from "@/components/layouts/Default";
import { useFluxWallet } from "@/hooks/useFluxWallet";

import { FluxWallet__factory } from "../../../contracts/typechain-types";
import { naiveProof } from "../contract";
import { generateInput } from "../util";
import profile from './../static/profile.webp'


export interface PeerMeta {
    name: string;
    url: string;
}


const Send: NextPage = () => {

    const [otp, setOTP] = useState("");
    const [otpDisable, setOtpDisable] = useState(true);
    const [amount, setAmount] = useState("");
    const [amountDisable, setAmountDisable] = useState(true);
    const [recepient, setRecepient] = useState("");
    const [recepientDisable, setRecepientDisable] = useState(true);

    const [confirmation, setConfirmation] = useState("");
    const [success, setSuccess] = useState(false);

    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [Verifying, setVerifying] = useState(false);
    const [userName, setUserName] = useState('0xshikhar')

    const { fluxWalletAddress, balance, ownerWallet } = useFluxWallet()
    const ethBalance = (parseInt(balance)) * 0.00000000000000001;
    console.log("Owner Wallet", ownerWallet)

    const scwAddress = fluxWalletAddress;

    const sendTrans = async () => {

        const contract = FluxWallet__factory.connect(fluxWalletAddress, signer);
        await contract.initiateRecovery(newOwner);
    };



    const naiveProve = async (event: any) => {
        event.preventDefault();
        setError(false);
        setSuccess(false);

        setVerifying(true);
        if (localStorage.getItem("OTPhashes")) {
            const INPUT = await generateInput(otp)
                .catch((error: any) => {
                    setErrorMsg(error.toString());
                    setError(true);
                    setVerifying(false);
                    throw error;
                });
            console.log(`INPUT:`)
            console.log(INPUT)
            // const res = await getAaParams()
            // const aaProvider = await res.aaProvier
            // const aaSigner = await aaProvider.getSigner()
            // scwAddress = await aaSigner.getAddress()
            console.log(`scw address: ${scwAddress}`)
            const tx = await naiveProof(INPUT, amount, recepient)
                .catch((error: any) => {
                    setErrorMsg(error.toString());
                    setError(true);
                    setVerifying(false);
                    throw error;
                });
            console.log(tx);
            // if(tx.hash){
            //     setConfirmation(tx.hash)
            //     setSuccess(true)

            // }
            // let txConfirmation = await tx.wait();
            // setConfirmation(txConfirmation.transactionHash);
            // setSuccess(true);
        } else {
            setErrorMsg("No OTP contract address found. Deploy first.");
            setError(true);
            setVerifying(false);
            throw error;
        }

        setVerifying(false);
        event.preventDefault();
    }

    const aHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value !== "") {
            setOTP(event.target.value);
            setOtpDisable(false);
        }
        else {
            setOtpDisable(true);
        }
    };

    const amountHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value !== "") {
            setAmount(event.target.value);
            setAmountDisable(false);
        }
        else {
            setAmountDisable(true);
        }
    };

    const recepientHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value !== "") {
            setRecepient(event.target.value);
            setRecepientDisable(false);
        }
        else {
            setRecepientDisable(true);
        }
    };

    // const enterHandler = async (event: any) => {
    //     if (event.which === "13") {
    //         event.preventDefault();
    //     }
    // };


    // const keyHandler = async (event: any) => {
    //     if (['e', 'E', '+', '.', 'Enter'].includes(event.key)) {
    //         event.preventDefault();
    //     }
    // };



    // old flux wallet 

    // const [loading, setLoading] = useState(true)
    // const [wallet, setWallet] = useState(false)
    // const [walletAddress, setWalletAddress] = useState('0x01ae785590807164')
    // const [walletBalance, setWalletBalance] = useState(0)
    // const [walletName, setWalletName] = useState('0xshikhar.eth')
    // const [transactions, setTransactions] = useState([])
    // const [nfts, setNfts] = useState([])
    // const router = useRouter();
    // useEffect(() => {
    //     setTimeout(() => { }, 1000)
    // }, [])

    return (
        <DefaultLayout>
            <div className='appbox bg-white h-full'>
                <div className="h-[600px]">

                    <div className='pt-8 px-4'>

                        <div className="relative flex row">
                            {/* <Image className="mask mask-squircle w-6 h-6 rounded-full ring-4 ring-gray-900 dark:ring-gray-900" src={profile} alt="profile image" /> */}
                            <div className="w-10 h-10 p-1 rounded-full border-2 border-indigo-500/100">
                                <Image src={profile} alt="profile image"
                                    style={{ objectFit: "cover" }} />
                                {/* <img className="w-10 h-10 rounded-full" src={profile} alt="" /> */}
                            </div>
                            <span className="top-0 left-7 absolute  w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
                            <div className='px-4 items-center'>
                                <h1 className='font-bold text-lg'>Welcome</h1>
                                <h1 className='text-[9px]'>{scwAddress}</h1>
                            </div>

                        </div>

                        <div className="relative my-5 w-full">
                            <h1 className="text-2xl pb-5 font-bold font-sans">Send Transaction</h1>

                            <form>
                                <div className="mb-6">
                                    <label htmlFor="text"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Recipient Address</label>
                                    <input type="text" id="input-recepient" onChange={recepientHandler} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="0xdeaa150597535Eed8c95Ad090757815F1B9Da15d" required />
                                </div>
                                <div className="mb-6">
                                    <label htmlFor="tokens" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter Amount To Transfer</label>
                                    <input type="tokens" onChange={amountHandler} id="input-amount" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="0 ETH" required />
                                </div>
                                <div className="mb-6">
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter Verfication Code</label>
                                    <input type="number" id="input-otp" onChange={aHandler}
                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="Code" required />
                                </div>
                                {/* <div className="flex items-start mb-6">
                                    <div className="flex items-center h-5">
                                        <input id="terms" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" required />
                                    </div>
                                    <label htmlFor="terms" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Verifying <a className="text-blue-600 hover:underline dark:text-blue-500">Transaction</a></label>
                                </div> */}
                                <button type="submit" onClick={naiveProve}
                                    disabled={otpDisable} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Send</button>
                            </form>

                        </div>

                        {/* dynamic transaction display */}
                        {Verifying ? <progress className="progress w-56"></progress> : <div />}
                        {error ? (
                            <p className="alert-error">
                                {errorMsg}
                            </p>
                        ) : (
                            <div />
                        )}
                        {success ? (
                            <p className="alert-success">
                                Please check your scw for confirmation {scwAddress}
                            </p>
                        ) : (
                            <div />
                        )}
                        {success ? <p>Tx hash: {confirmation}</p> : <div />}
                        {console.log({ otp })}

                    </div>
                </div>
                {/* </div>
            </div> */}

                {/* </div> */}

            </div >
        </DefaultLayout >

    )
}

export default Send