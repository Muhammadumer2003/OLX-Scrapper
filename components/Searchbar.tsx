"use client";
import { exportData, scrapeOlxProducts } from '@/actions/scrape-products';
import useStore from '@/hooks/olx-products';
import { log } from 'console';
import React, { useState } from 'react'

const Searchbar = () => {
    const [searchPrompt,setPrompt]=useState("");
    const [isLoading,setIsload]=useState(false);
    const addProduct = useStore((state: any) => state.addProduct);
    const products = useStore((state: any) => state.products);

    
    const handleSubmit=async(e: any)=>{
        e.preventDefault();
        setIsload(true);
        try{
            //scrrape logic
            const product = await scrapeOlxProducts(searchPrompt);
            console.log(product);
            addProduct(product);
            setPrompt("");

        }
        catch(err){
            console.log(err);
        }
        setIsload(false);
    }

    const exportProducts = async () => {
        try {
          await exportData(products);
          alert("Exported");
        } catch (error) {
          console.log(error);
        }
      };
  return (
    <div className="flex flex-col lg:flex-row w-full item-left gap-3">
      <input className="w-full p-3 border-4 border-neutral-200 rounded-lg text-gray-500"
      type='text'
      placeholder='Seach for an OLX product to scrape from the web'
      value={searchPrompt}
      onChange={(e)=>setPrompt(e.target.value)}
      ></input>

      <div className='flex gap-2 flex-2'>
        <button
        onClick={handleSubmit}
        disabled={searchPrompt=== "" || isLoading}
        className={`${searchPrompt!=="" && !isLoading? "cursor-pointer":""} bg-gray-800 w-[150px]  disabled:bg-gray-400 rounded-md px-5 py-3 text-white`}>
            {isLoading ? "Scraping...." : "Scrape" }
        </button>

        <button
          disabled={!products?.length || isLoading}
          onClick={exportProducts}
          className={`bg-gray-800 disabled:bg-gray-400 ${
            products?.length && !isLoading ? "cursor-pointer" : ""
          } rounded-md shadow-xs px-5 py-3 text-white`}
        >
          Export
        </button>
      </div>
    </div>
  )
}

export default Searchbar
