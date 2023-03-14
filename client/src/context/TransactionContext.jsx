import React, { useState, useEffect } from "react";
import { ethers } from 'ethers';

import { contractABI, contractAddress } from '../utils/constants';

export const TransactionContext = React.createContext();

// const { ethereum } = window;

const getEtherumContract = () => {
    const provider = new ethers.providers.Web3Proivder(window.ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);

    return transactionContract; 
}

export const TransactionProvider = ({children}) => {
    const [formData, setFormData] = useState({addressTo: "", amount: "",
        keyword: "", message: ""})
    const [currentAccount, setCurrentAccount] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));
    
    const handleChange = (e, name) => {
        setFormData((prevState) => ({...prevState, [name]: e.target.value}));
    }

    const checkIfWalletisConnected = async () => {
        try {
          if (!ethereum) return alert("Please install MetaMask.");
    
          const accounts = await ethereum.request({ method: "eth_accounts" });
    
          if (accounts.length) {
            setCurrentAccount(accounts[0]);
    
            // getAllTransactions();
          } else {
            console.log("No accounts found");
          }
        } catch (error) {
          console.log(error);
        }
      }

    const connectWallet = async () => {
        try {
            if (!ethereum) return alert("Please install MetaMask.");

            const accounts = await ethereum.request({method:"eth_requestAccounts", });
            setCurrentAccount(accounts[0]);

        } catch (error) {
            console.log(error);
            
            throw new Error("No ethereum object");
            
        }
    }

    const sendTransaction = async () =>{
        try {
          if (!ethereum) return alert("Please install MetaMask.");
          const {addressTo, amount, keyword, message} = formData;
          const transactionContract = getEtherumContract();
          const parsedAmount = ethers.utils.parseEther(amount);

          await ethereum.request({
            method: 'eth_sendTransaction', 
            params: [{
                from: currentAccount,
                to: addressTo,
                gas: '0x5208', // 21000 Gwei
                value: parsedAmount._hex,
            }]
          });

          const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword);

          setIsLoading(true);
          console.log(`Loading - ${transactionHash.hash}`);

          await transactionHash.wait();

          console.log(`Success - ${transactionHash.hash}`);
          setIsLoading(false);

          const transactionCount = await transactionContract.getTransactionCount();

          setTransactionCount(transactionCount.toNumber());
          window.location.reload();

          
        } catch (error) {
            console.log(error);
            throw new Error("No ethereum object");
            
        }
    }

    useEffect(() => {
        checkIfWalletisConnected()
    }, []);

    return (
    <TransactionContext.Provider value = {{connectWallet, currentAccount, formData, setFormData, handleChange,
        sendTransaction}}>
        {children}
    </TransactionContext.Provider>
    );
}
