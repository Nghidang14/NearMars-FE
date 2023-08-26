import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import BaseLayout from 'components/BaseLayout';
import { useAppContext } from "context/state";
import NearDate from "components/home/NearDate";
import NearDateV2 from "components/home/NearDateV2";
import RandomNFT from "components/home/RandomNFT";
import Contents from "components/home/Contents";
import OurTeam from "components/home/OurTeam";

const Home: NextPage = () => {
  const { account } = useAppContext()

  return (
    <BaseLayout>
      <Head>
        <title>Near Mars</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className='relative max-w-full z-10'>
        {/* <div className="absolute overflow-clip -top-36 right-36 w-80 h-72 bg-secondary bg-opacity-50 rounded-full filter blur-3xl opacity-70 animate-blob"></div> */}
        <div className="absolute overflow-hidden top-[50vh] right-[50vw] w-72 h-72 bg-imageLight bg-opacity-50 rounded-full filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute overflow-hidden top-[80vh] right-12 w-36 h-36 bg-opacity-40 bg-secondary rounded-full filter blur-2xl opacity-70 animate-blob animation-delay-4000"></div>
        <div className="absolute overflow-hidden top-0 left-8 w-48 h-48 bg-opacity-40 bg-secondary rounded-full filter blur-2xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
      {
        account?.accountId ?
        <NearDateV2 />
        :
        (
          <section className="py-24 flex justify-center flex-col items-center">   
            <div className="mt-4 max-w-xl mx-auto text-center">
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <button onClick={login}>
                  <a className="btn-whimsical sm:text-3xl text-2xl font-medium title-font mb-2 text-white">
                    Mint now
                  </a>
                </button>
              </div>
            </div>
          </section>
        )
      }
      <RandomNFT />
      <Contents />
      {/* <OurTeam /> */}
    </BaseLayout>
  )
}

export default Home
