import type { NextPage } from 'next';
import Head from 'next/head';
import Image from "next/image";
import { useEffect, useState } from 'react';
import BaseLayout from 'components/BaseLayout';
import { useAppContext } from "context/state";
import Link from 'next/link';
import { useRouter } from 'next/router'
import { NFTMessageModel, NFTModel, NFTSaleModel, NFTBidModel, NFTBidSlotModel, NFTSlotModel, NFTRentSlotModel } from "types";
import ipfs, { get_ipfs_link, near_mars_get_ipfs_link_image } from 'utils/ipfs';
import { utils } from "near-api-js";
import { loading_screen } from "utils/loading";
import { new_json_file } from 'utils/file';
import Swal from 'sweetalert2';
import { truncate } from 'utils/format';

const NFTItem: NextPage = () => {
  const router = useRouter()
  const { id } = router.query;
  const { account, contractMarketplace, contractNFT } = useAppContext();

  const [message, setMessage] = useState<NFTMessageModel>();

  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [isDepositYet, setIsDepositYet] = useState<boolean>(false);

  const [isSale, setIsSale] = useState<boolean>(false);

  const [priceSale, setPriceSale] = useState<number>(0);

  const [transferAccountId, setTransferAccountId] = useState<string>("");

  const [anotherOffer, setAnotherOffer] = useState<NFTBidModel | null>(null);

  const [listBid, setListBid] = useState<Array<NFTBidModel>>([]);

  const [listBidSlot, setListBidSlot] = useState<Array<NFTBidSlotModel>>([]);

  const [listSlotRent, setListRent] = useState<Array<NFTSlotModel>>([]);

  const [owner_id, setOwnerID] = useState<string>("");


  useEffect(() => {
    async function getData() {
      if (!id) return;

      loading_screen(async () => {
        let data: NFTModel = await contractNFT.nft_token({
          "token_id": id?.toString()
        });

        console.log("nft: ", data);

        setOwnerID(data.owner_id);

        if (data?.approved_account_ids[contractMarketplace.contractId] > -1) {
          setIsSale(true);
          let price: NFTSaleModel = await contractMarketplace.get_sale({
            "nft_contract_token": contractNFT.contractId + "." + id?.toString(),
          });
          if (price != null) {
            setPriceSale(parseFloat(utils.format.formatNearAmount(price.sale_conditions)));
          } else {
            setIsSale(false);
          }
        }

        if (account?.accountId) {
          if (data.owner_id == account.accountId) {
            setIsOwner(true)

            let checkDeposit = await contractMarketplace.storage_balance_of({
              "account_id": account.accountId
            })
            if (checkDeposit >= 0.1) {
              setIsDepositYet(true);
            }

            let getListBid: Array<NFTBidModel> = await contractMarketplace.get_bid_token_by_token_id({
              "token_id": id?.toString(),
            });
            setListBid(getListBid);

            let bid_slot_list_resp: Array<NFTBidSlotModel> = await contractMarketplace.get_bid_rent_by_token_id({
              "token_id": id?.toString()
            });

            try {
              let bid_slot_list = await Promise.all(bid_slot_list_resp.map((bid) =>
                fetch(bid.message_url)
                  .then(e => e.json())
                  .then(ele => {
                    return {
                      ...bid,
                      ...ele,
                    }
                  })
              ))
              setListBidSlot(bid_slot_list);
            } catch (err) {
              console.log("get_bid_rent_by_token_id: ", err);
            }

          } else {
            let anotherOfferResp = await contractMarketplace.get_bid_token_on_nft_by_account_id({
              "account_id": account.accountId,
              "token_id": id?.toString(),
            });

            if (anotherOfferResp.length == 0) {
              anotherOfferResp = null
            } else {
              setAnotherOffer(anotherOfferResp[0]);
            }

            let bid_slot_list_resp: Array<NFTBidSlotModel> = await contractMarketplace.get_bid_rent_on_nft_by_account_id({
              "token_id": id?.toString(),
              "account_id": account.accountId,
            })

            try {
              let bid_slot_list = await Promise.all(bid_slot_list_resp.map((bid) =>
                fetch(bid.message_url)
                  .then(e => e.json())
                  .then(ele => {
                    return {
                      ...bid,
                      ...ele,
                    }
                  })
              ))

              setListBidSlot(bid_slot_list);
            } catch (err) {
              console.log("get_bid_rent_on_nft_by_account_id", err);
            }

          }
        }

        let message_data_resp = await fetch(data.message);
        let message_data: NFTMessageModel = await message_data_resp.json();

        setMessage(message_data);

        let rent_message_list: NFTRentSlotModel = await contractMarketplace.get_rent_by_token_id({
          "token_id": id?.toString()
        })

        if (rent_message_list != null) {
          let rented = rent_message_list.rented_slots;
          let slot = await Promise.all(
            rented.map(ele =>
              fetch(ele.rent_message)
                .then((e) => e.json())
                .then(e => {
                  return {
                    ...ele,
                    message: e?.rent_message,
                    message_created_date: e?.message_created_date,
                  }
                })));
          setListRent(slot);
        }
      })
    };
    getData();
  }, [account, contractMarketplace, contractNFT, id]);

  async function onDepositClick() {
    loading_screen(async () => {
      await contractMarketplace.storage_deposit({
        "account_id": account.accountId,
      }, 30000000000000, utils.format.parseNearAmount("0.1"))
      setIsDepositYet(true);
    }, "Mars is deposit");
  }

  async function onPutSaleClick() {
    loading_screen(async () => {
      let data = await contractNFT.nft_approve({
        "token_id": id?.toString(),
        "account_id": contractMarketplace.contractId,
        "msg": JSON.stringify({ "sale_conditions": utils.format.parseNearAmount(priceSale.toString()) }),
      }, 30000000000000, utils.format.parseNearAmount("0.01"));

      setIsSale(true);
    }, 'Mars is sale your NFT to marketplace');
  }

  async function onEditSaleClick() {
    Swal.fire({
      title: 'Update price',
      input: 'number',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Update',
      showLoaderOnConfirm: true,
    }).then((result) => {
      if (result.isConfirmed) {
        loading_screen(async () => {
          let data = await contractMarketplace.update_price({
            "nft_contract_id": contractNFT.contractId,
            "token_id": id?.toString(),
            "price": utils.format.parseNearAmount(result.value.toString()),
          }, 30000000000000, "1")
          setPriceSale(result.value);
        }, "Mars is updating your price sale");
      }
    })
  }

  async function onEditMessageClick() {
    Swal.fire({
      title: 'Update message',
      input: 'textarea',
      inputAttributes: {
        autocapitalize: 'off'
      },
      inputAutoTrim: true,
      showCancelButton: true,
      confirmButtonText: 'Update',
      showLoaderOnConfirm: true,
    }).then((result) => {
      if (result.isConfirmed) {
        loading_screen(async () => {
          const json_data: NFTMessageModel = {
            "id": id?.toString() || "",
            "message": result.value.toString(),
            "token_created_date": message?.token_created_date || Date.now(),
            "message_updated_date": Date.now(),
          };
          let file_name = `${id?.toString()}_update_${Date.now()}.json`;
          const file = new_json_file(json_data, file_name);
          let domain = await ipfs.put([file]);
          let ipfs_link_uploaded = get_ipfs_link(domain, file_name);

          let data = await contractNFT.nft_update({
            "token_id": id?.toString(),
            "message_url": ipfs_link_uploaded,
          }, 30000000000000, "1");

          setMessage(json_data);
        }, "Mars is updating message");
      }
    })
  }

  async function onCancelSaleClick() {
    loading_screen(async () => {
      let data = await contractMarketplace.remove_sale({
        "nft_contract_id": contractNFT.contractId,
        "token_id": id?.toString(),
      }, 30000000000000, "1");
      router.reload();
    })
  }

  async function onOfferSaleClick() {
    loading_screen(async () => {
      let data = await contractMarketplace.offer({
        "nft_contract_id": contractNFT.contractId,
        "token_id": id?.toString(),
      }, 30000000000000, utils.format.parseNearAmount(priceSale.toString()));

    }, "Mars is offering")
  }

  async function onCancelBidOfferClick() {
    loading_screen(async () => {
      if (!anotherOffer) return;
      let data = await contractMarketplace.bid_token_cancel_and_withdraw({
        "bid_id": anotherOffer.bid_id
      }, 30000000000000, "1");
      setAnotherOffer(null);
    })
  }

  async function onTransferClick() {
    loading_screen(async () => {
      let data = await contractNFT.nft_transfer({
        "receiver_id": transferAccountId,
        "token_id": id?.toString(),
        "memo": "NearDate NFT transfer",
      }, 30000000000000, "1")
      setIsOwner(false);
    }, "Mars is transfering")
  }

  async function onOfferAnotherSaleClick() {
    Swal.fire({
      title: 'Your offer price',
      input: 'number',
      inputAttributes: {
        autocapitalize: 'off',
        step: "0.01",
      },
      showCancelButton: true,
      confirmButtonText: 'Offer',
      showLoaderOnConfirm: true,
    }).then((result) => {
      if (result.isConfirmed) {
        loading_screen(async () => {
          let data = contractMarketplace.bid_token({
            "token_id": id?.toString(),
          }, 30000000000000, utils.format.parseNearAmount(result.value.toString()));

        }, "Mars is sending your offer request")
      }
    })
  }

  async function onAccepBidClick(bid_id: number) {
    Swal.fire({
      title: 'You confirm',
      showCancelButton: true,
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        loading_screen(async () => {
          let data = await contractMarketplace.accept_bid_token({
            "bid_id": bid_id,
            "token_id": id?.toString(),
            "nft_contract_id": contractNFT.contractId,
          }, 30000000000000, "1");

        }, "Mars is proccessing")
      }
    })
  }

  async function onRentSlotClick() {
    let messageSlot = "";
    Swal.fire({
      title: 'Your offer ',
      input: 'textarea',
      text: "Message",
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Next',
      showLoaderOnConfirm: true,
    })
      .then((result) => {
        if (!result.isConfirmed) {
          Swal.close();
          return;
        }
        messageSlot = result.value;
        return Swal.fire({
          title: 'Your offer',
          input: 'number',
          text: "Price",
          inputAttributes: {
            autocapitalize: 'off',
            step: "0.01",
          },
          showCancelButton: true,
          confirmButtonText: 'Offer',
          showLoaderOnConfirm: true,
        });
      })
      .then((resutl2) => {
        if (!resutl2) return;
        if (resutl2.isConfirmed) {
          loading_screen(async () => {
            const json_data = {
              "rent_message": messageSlot,
              "message_created_date": Date.now(),
            };
            let file_name = `${id?.toString()}_slot_${Date.now()}.json`;
            const file = new_json_file(json_data, file_name);
            let domain = await ipfs.put([file]);
            let ipfs_link_uploaded = get_ipfs_link(domain, file_name);

            let data = await contractMarketplace.bid_rent({
              "token_id": id?.toString(),
              "message": ipfs_link_uploaded,
              "start_at": Date.now(),
              "expire_at": Date.now() + 24 * 60 * 60 * 1000,
            }, 30000000000000, utils.format.parseNearAmount(resutl2.value.toString()));

          }, "Mars is proccessing")
        }
      })
  }

  async function onBidSlotClick(bid_id: number) {
    Swal.fire({
      title: 'You confirm',
      showCancelButton: true,
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        loading_screen(async () => {
          if (isOwner) {
            let data = await contractMarketplace.accept_bid_rent({
              "bid_id": bid_id,
              "token_id": id?.toString()
            }, 30000000000000, "1");
          } else {
            let data = await contractMarketplace.bid_rent_cancel_and_widthdraw({
              "bid_id": bid_id
            }, 30000000000000, "1")
          }
          setListBidSlot(listBidSlot.filter((e) => e.bid_id != bid_id));
        }, "Mars is proccessing")
      }
    })
  }

  return (
    <BaseLayout>
      <Head>
        <title>{id} | NearMars - Way To The Future</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className='container py-12 px-5 mx-auto'>
        <div className='grid grid-cols-3 gap-4'>
          <div className='col-span-1 flex flex-col justify-start items-center w-full px-10'>
            <div className="relative rounded-md w-full aspect-square">
              <div className="absolute w-full rounded-md aspect-square border-2 border-imageLight bg-black blur-sm"></div>
              {id && <Image alt="Mars" className="object-contain object-center rounded-md p-1" src={near_mars_get_ipfs_link_image(id.toString())} layout='fill' />}
              {
                isSale && (
                  <div className="absolute left-1 bottom-2 border-green-900/10 bg-green-50 rounded-sm px-2 py-1 font-semibold text-green-700">
                    {priceSale} NEAR
                    <span className="animate-ping w-2.5 h-2.5 bg-green-600/75 rounded-full absolute -top-1 -left-1"></span>
                    <span className="w-2.5 h-2.5 bg-green-600 rounded-full absolute -top-1 -left-1"></span>
                  </div>
                )
              }
            </div>
            <div className='flex justify-between items-center w-full pt-2'>
              <span className="text-primary text-sm font-semibold mt-2">
                {truncate(owner_id, 40)}
              </span>
              <span className="text-secondary text-sm mt-1">
                {`${new Date(message?.token_created_date || Date.now()).toLocaleString("en-US")}`}
              </span>
            </div>
            <div className="flex flex-col w-full justify-between">
              <div className="px-5 py-2 bg-backgroundLight rounded-3xl relative mt-2 w-full">
                <p className="text-center text-2xl text-white">{message?.message}</p>
                <div className="absolute top-0 left-0 h-0.5 w-6 bg-primary"></div>
                <div className="absolute top-0 left-0 h-3 w-0.5 bg-primary"></div>
                <div className="absolute top-0 right-0 h-0.5 w-6 bg-primary"></div>
                <div className="absolute top-0 right-0 h-3 w-0.5 bg-primary"></div>
                <div className="absolute bottom-0 left-0 h-0.5 w-6 bg-primary"></div>
                <div className="absolute bottom-0 left-0 h-3 w-0.5 bg-primary"></div>
                <div className="absolute bottom-0 right-0 h-0.5 w-6 bg-primary"></div>
                <div className="absolute bottom-0 right-0 h-3 w-0.5 bg-primary"></div>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full pt-10">
              {
                listSlotRent.map(e => {
                  return (
                    <div key={e.message} className="rounded-md bg-backgroundLight py-1 px-2">
                      <p className="text-primary">
                        {e.message}
                      </p>
                      <p className="text-secondary text-sm">
                        {e.renting_account_id}
                      </p>
                    </div>
                  );
                })
              }
            </div>
          </div>
          <div className='col-span-2'>
            <div className='flex flex-col justify-center items-start'>

              <div className='flex flex-row justify-center items-center mb-5'>
                <span className='text-white font-semibold text-2xl'>{message?.message}</span>

                {
                  isOwner && <button className='ml-2' onClick={onEditMessageClick}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                }
              </div>
              <p className='text-white text-xl mb-2'>Owner : <span className=' font-semibold'>{owner_id}</span></p>
              {
                isSale && <div className='flex flex-row justify-center items-center mb-5'>
                  <span className=' font-semibold text-xl'>Sale price: {priceSale} NEAR</span>
                  {/* <div className='w-12 h-12'><NearProtocolLogo /></div> */}
                  {
                    isOwner && <button className='ml-2' onClick={onEditSaleClick}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                  }
                </div>
              }
            </div>

            {
              (account?.accountId && !isOwner) &&
              <div className='flex flex-row justify-start gap-4 items-center'>
                {
                  isSale && (
                    <button className='bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-md'
                      onClick={onOfferSaleClick}
                    >
                      Buy
                    </button>
                  )
                }
                {
                  anotherOffer != null && <>
                    <button className='bg-blue-200 px-5 py-2 rounded-md cursor-default'
                    >
                      Your bid: {utils.format.formatNearAmount(anotherOffer.price)} NEAR
                    </button>
                    <button className='bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-md'
                      onClick={onCancelBidOfferClick}
                    >
                      Cancel Offer
                    </button>
                  </>
                }
                {
                  anotherOffer == null && (
                    <button className='bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-md'
                      onClick={onOfferAnotherSaleClick}
                    >
                      Make Offer
                    </button>
                  )
                }

                {
                  account?.accountId && (
                    <button className='ml-5 bg-yellow-500 px-5 py-2 font-semibold hover:bg-yellow-600 rounded-md'
                      onClick={onRentSlotClick}
                    >
                      Rent Slot
                    </button>
                  )
                }
              </div>
            }
            {
              (isOwner && !isSale) && (
                <>
                  {
                    !isDepositYet && (
                      <>
                        <span className='text-white'>You must approve before do sale</span>
                        <button className=' bg-yellow-400 ml-2 px-3 py-1 mb-5 rounded-md'
                          onClick={onDepositClick}
                        >Approve</button>
                      </>
                    )
                  }
                  <label className="relative block p-3 border-2 border-gray-200 rounded-lg" htmlFor="price">
                    <span className="text-xs font-medium text-primary">
                      Price
                    </span>
                    <input className="w-full p-0 text-sm border-none bg-transparent focus:ring-0" id="price" type="number" placeholder="5"
                      value={priceSale}
                      onChange={(e) => setPriceSale(parseFloat(e.target.value))}
                    />
                  </label>
                  <button className='mt-2 bg-blue-500 px-5 py-2 rounded-md'
                    onClick={onPutSaleClick}
                  >
                    Sell on Marketplace
                  </button>
                  <label className="mt-12 relative block p-3 border-2 border-gray-200 rounded-lg" htmlFor="transfer">
                    <span className="text-xs font-medium text-primary">
                      Account ID
                    </span>
                    <input className="w-full p-0 text-sm border-none bg-transparent focus:ring-0 outline-0" id="transfer" type="text" placeholder=""
                      value={transferAccountId}
                      onChange={(e) => setTransferAccountId(e.target.value)}
                    />
                  </label>
                  <button className='mt-2 bg-blue-500 px-5 py-2 rounded-md'
                    onClick={onTransferClick}
                  >
                    Transfer
                  </button>
                </>
              )
            }
            {
              isOwner && <>
                <h2 className='mt-12 text-xl font-semibold'>
                  Buy Offer
                </h2>
                <div className="mt-2 overflow-hidden overflow-x-auto rounded">
                  <table className="min-w-full text-sm divide-y divide-backgroundLight">
                    <thead>
                      <tr className=" bg-backgroundLight">
                        <th className="px-4 py-2 font-medium text-left text-primary whitespace-nowrap">ID</th>
                        <th className="px-4 py-2 font-medium text-left text-primary whitespace-nowrap">Account ID</th>
                        <th className="px-4 py-2 font-medium text-left text-primary whitespace-nowrap">Price</th>
                        <th className="px-4 py-2 font-medium text-left text-primary whitespace-nowrap">Accept</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-backgroundLight">
                      {
                        listBid.map((e, i) => {
                          return (
                            <tr key={e.bid_id}>
                              <td className="px-4 py-2 font-medium text-primary whitespace-nowrap">{e.bid_id}</td>
                              <td className="px-4 py-2 text-primary whitespace-nowrap">{e.bid_account_id}</td>
                              <td className="px-4 py-2 text-primary whitespace-nowrap">{utils.format.formatNearAmount(e.price)} NEAR</td>
                              <td className="px-4 py-2 text-blue-700 whitespace-nowrap hover:text-blue-900 cursor-pointer"
                                onClick={() => onAccepBidClick(e.bid_id)}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                                </svg>
                              </td>
                            </tr>
                          )
                        })
                      }
                    </tbody>
                  </table>
                </div>
              </>
            }
            {
              account?.accountId && (
                <>
                  <h2 className='mt-12 text-xl font-semibold'>
                    {!isOwner && "My  "} Rent Slot Bid
                  </h2>
                  <div className="mt-2 overflow-hidden overflow-x-auto rounded">
                    <table className="min-w-full text-sm divide-y divide-backgroundLight">
                      <thead>
                        <tr className=" bg-backgroundLight">
                          <th className="px-4 py-2 font-medium text-left text-primary whitespace-nowrap">ID</th>
                          <th className="px-4 py-2 font-medium text-left text-primary whitespace-nowrap">Message</th>
                          <th className="px-4 py-2 font-medium text-left text-primary whitespace-nowrap">Start At</th>
                          <th className="px-4 py-2 font-medium text-left text-primary whitespace-nowrap">Expires</th>
                          <th className="px-4 py-2 font-medium text-left text-primary whitespace-nowrap">Price</th>
                          <th className="px-4 py-2 font-medium text-left text-primary whitespace-nowrap">
                            {isOwner ? "Accept" : "Cancel"}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-backgroundLight">
                        {
                          listBidSlot.map((e, i) => {
                            return (
                              <tr key={i}>
                                <td className="px-4 py-2 font-medium text-primary whitespace-nowrap">{e.bid_id}</td>
                                <td className="px-4 py-2 text-primary whitespace-nowrap truncate">{e.rent_message}</td>
                                <td className="px-4 py-2 text-primary whitespace-nowrap">
                                  {`${new Date(e.starts_at || Date.now()).toLocaleString("en-US")}`}
                                </td>
                                <td className="px-4 py-2 text-primary whitespace-nowrap">
                                  {`${new Date(e.expires_at || Date.now()).toLocaleString("en-US")}`}
                                </td>
                                <td className="px-4 py-2 text-primary whitespace-nowrap truncate">{utils.format.formatNearAmount(e.price)}</td>
                                <td className="px-4 py-2 text-blue-700 whitespace-nowrap hover:text-blue-900 cursor-pointer"
                                  onClick={() => onBidSlotClick(e.bid_id)}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                                  </svg>
                                </td>
                              </tr>
                            )
                          })
                        }
                      </tbody>
                    </table>
                  </div>
                </>
              )
            }

            {
              (isOwner && isSale) && <button className='mt-12 bg-yellow-500 px-5 py-2 rounded-md'
                onClick={onCancelSaleClick}
              >
                Cancal sale
              </button>
            }
          </div>
        </div>
      </div>
    </BaseLayout >
  );
}

export default NFTItem
