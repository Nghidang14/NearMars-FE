import { useAppContext } from "context/state";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { format_number_2_digit } from "utils/format";
import { loading_screen } from "utils/loading";
import Image from 'next/image';
import ipfs, { near_mars_get_ipfs_link_image } from "utils/ipfs";
interface CalendarProps {
    setDayMonthYear: Function
}

export default function Calendar({ setDayMonthYear }: CalendarProps) {
    const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const { contractNFT } = useAppContext();

    let today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();

    const [selectMonth, setSelectMonth] = useState<number>(month);
    const [selectYear, setSelectYear] = useState<number>(year);
    const [noOfDay, setNoOfDay] = useState<Array<any>>([]);



    useEffect(() => {
        async function getNoOfDays() {
            if (!contractNFT) return;

            let daysInMonth = 900;           

            let data = await Promise.all(new Array(daysInMonth).fill(0).map((_, i) =>
                contractNFT.nft_token({
                    "token_id": `${selectYear}${format_number_2_digit(selectMonth + 1)}${format_number_2_digit(i + 1)}`
                }).then((e: any) => {
                    return {
                        key: i + 1,
                        ...e
                    }
                })
            ));           
            data.sort((a, b) => a.key - b.key);
            setNoOfDay(data);            
        }
        async function getNearmars() {             
            let arr : any[] = [];
            let rows = 30;
            let columns = 30;    
            let value = 1;
            for (let i = 0; i < rows; i++) {
              arr[i] = [];
              for (let j = 0; j < columns; j++) {
                if (value < 10 ) {
                    arr[i][j] = "00" + value++;
                } else if (value < 100 ) {
                    arr[i][j] = "0" + value++;
                } else {
                    arr[i][j] = value++;
                }        
              }
            }
            setNoOfDay(arr);
        }
        loading_screen(getNoOfDays);
    }, [selectMonth, selectYear, contractNFT]);
    function previousMonth() {
        if (selectMonth == 0) {
            setSelectMonth(11);
            setSelectYear(selectYear - 1);
        } else {
            setSelectMonth(selectMonth - 1);
        }
    }
    function nextMonth() {
        if (selectMonth == 11) {
            setSelectMonth(0);
            setSelectYear(selectYear + 1);
        } else {
            setSelectMonth(selectMonth + 1);
        }
    }
    console.log(noOfDay);
    return (
        <div className="mt-5 wrapper rounded shadow w-full">            
            <table className="w-full">                
                <tbody>
                    {   
                        noOfDay.map((e, i) => {
                            if (i == 0 || i % 30 == 0) {
                                return (
                                    <tr className="text-center" key={i}>
                                        {
                                            Array(30).fill(0).map((_, no) => {
                                                let ele = noOfDay[i + no];
                                                
                                                return (
                                                    <td key={i + no} className={`border transition duration-500 ease-in aspect-square
                                                    ${(ele && ele.token_id == null) ? "cursor-pointer hover:bg-secondary hover:bg-opacity-10 group " : " bg-backgroundLight"}`}>
                                                        <div className="flex flex-col aspect-square xl:w-10 md:w-10 sm:w-10 mx-auto w-1 overflow-hidden items-center justify-center relative">
                                                            {
                                                                ele != null && (
                                                                    <>
                                                                        <span className="font-semibold absolute text-primary">{ele.key}</span>
                                                                        {
                                                                            ele.token_id != null && (
                                                                                <div className="group transition-all ease-in-out duration-200">
                                                                                    <span className="bg-purple-400 text-white rounded-sm px-2 p-1 sm:rounded sm:p-1 sm:px-3 text-sm group-hover:hidden"><span className="hidden sm:inline-block">Minted</span></span>
                                                                                    <Link href={`/nft/${ele.token_id}`} passHref>
                                                                                        <a className="bg-purple-400 text-white rounded p-1 px-3 text-sm group-hover:block hidden cursor-pointer">View</a>
                                                                                    </Link>
                                                                                </div>
                                                                            )
                                                                        }
                                                                        <span className=" bg-imageLight text-white rounded p-1 px-3 text-sm hidden group-hover:block hover:scale-110 transition-all duration-150 ease-in-out"
                                                                            onClick={() => setDayMonthYear(parseInt(ele.key, 10), selectMonth, selectYear)}
                                                                        >Mint</span>                                                                      
                                                                    </>
                                                                )                                                                 
                                                            }
                                                         
                                                        </div>
                                                    </td>
                                                );
                                            })
                                        }
                                    </tr>
                                );
                            }
                        })
                    }
                </tbody>
            </table>
        </div>
    );
}