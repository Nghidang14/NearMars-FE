import Link from 'next/link'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useAppContext } from 'context/state';
import { login, logout } from "utils/near";
import { truncate } from "utils/format";
import { Menu, Transition, Dialog } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'
import { useRouter } from 'next/router';
import Image from 'next/image';
interface HeaderProps {

}

export default function Header({ }: HeaderProps) {
  const router = useRouter();
  const { asPath } = router;
  const { account, balance } = useAppContext();

  return (
    <header className="text-gray-600 body-font">
      <div className="container mx-auto flex justify-between p-5 flex-col md:flex-row items-center lg:pt-8">
        <Link href="/">
          <a className='flex space-x-3 items-center md:pl-8'>
            <Image className="bg-white rounded-full p-50" src="/logo.png" alt="Mars" width="104" height="104"  />
            <span className=' text-2xl text-primary font-semibold'>
              Way to the Future
            </span>
          </a>
        </Link>
        <nav className="md:mx-auto md:py-1 md:pl-4 flex gap-2 md:gap-10 items-center text-base justify-center w-full">
          <Link href="/">
            <a className={`flex py-2 space-x-2 items-center hover:bg-background
              ${(asPath == "/" || asPath.indexOf("/?") == 0) ? "bg-background text-primary" : "text-secondary"}
            `}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              <span className='text-md hidden lg:block'>
                Home
              </span>
            </a>
          </Link>
          {
            account?.accountId && <Link href="/mint">
              <a className={`flex py-2 space-x-2 items-center hover:bg-background
              ${asPath == "/mint" || asPath.indexOf("/mint?") == 0 ? "bg-background text-primary" : "text-secondary"}
            `}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
                <span className='text-md hidden lg:block'>
                  Mint
                </span>
              </a>
            </Link>
          }
          <Link href="/marketplace">
            <a className={`flex py-2 space-x-2 items-center hover:bg-background
              ${asPath == "/marketplace" || asPath.indexOf("/marketplace?") == 0 ? "bg-background text-primary" : "text-secondary"}
            `}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              <span className='text-md hidden lg:block'>
                Marketplace
              </span>
            </a>
          </Link>
          {
            account?.accountId && <Link href="/my-mars">
              <a className={`flex py-2 space-x-2 items-center hover:bg-background
              ${asPath == "/my-mars" || asPath.indexOf("/my-mars?") == 0 ? "bg-background text-primary" : "text-secondary"}
            `}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                <span className='text-md hidden lg:block'>
                  My Mars
                </span>
              </a>
            </Link>
          }
        </nav>
        {
          account?.accountId ?
            (<div className="flex items-center w-full justify-center max-w-fit">
              <div className="text-right top-16">
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-primary rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                      {truncate(account?.accountId, 20)}
                      <ChevronDownIcon
                        className="w-5 h-5 ml-2 -mr-1 text-violet-200 hover:text-violet-100"
                        aria-hidden="true"
                      />
                    </Menu.Button>
                  </div>
                  <Menu.Items className="absolute z-10 right-0 w-56 mt-4 origin-top-right bg-backgroundLight divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-1 py-1 ">
                      <Menu.Item>
                        {({ active }) => (
                          <a href={`https://explorer.testnet.near.org/accounts/${account?.accountId}`} target="_blank" rel="noreferrer" >
                            <button
                              className={`${active ? ' bg-secondary bg-opacity-50' : 'bg-transparent'
                                } group flex rounded-md items-center w-full px-2 py-2 text-sm text-white`}
                            >

                              {account?.accountId}
                            </button>
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => {
                              router.push('/'); setTimeout(() => {
                                logout()
                              }, 1000);
                            }}
                            className={`${active ? ' bg-secondary bg-opacity-50' : 'bg-transparent'
                              } group flex rounded-md items-center w-full px-2 py-2 text-sm text-white`}
                          >

                            Disconnect
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Menu>
              </div>
            </div>)
            :
            (
              <div className="flex items-center w-full justify-center">
                <button className="bg-secondary px-6 py-2 rounded-md font-bold" onClick={login}>Connect wallet</button>
              </div>
            )
        }
      </div>
    </header>
  )
}
