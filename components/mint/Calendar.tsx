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

            let daysInMonth = new Date(selectYear, selectMonth + 1, 0).getDate();

            // find where to start calendar day of week
            let dayOfWeek = new Date(selectYear, selectMonth).getDay();
            let daysArray = [];

            for (let i = 1; i <= dayOfWeek; i++) {
                daysArray.push(null);
            }

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
            setNoOfDay(daysArray.concat(data));
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
        loading_screen(getNearmars);
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

    return (
        <div className="mt-5 wrapper rounded shadow w-full">           
            <div className="relative overflow-x-auto">            
                <table className="table-auto">                    
                    <tbody>
                        {noOfDay.map((item, index) => {
                            return (
                                <tr className="text-center" key={index}>
                                    <td className="border transition duration-500 ease-in aspect-square cursor-pointer hover:bg-secondary hover:bg-opacity-10 group">                          
                                        {
                                            <Image alt="nearmars"
                                            width={68} height={39}
                                            src={near_mars_get_ipfs_link_image(`image_part_${item[0]}`)}
                                            />
                                        }
                                    </td>
                                    <td className="border transition duration-500 ease-in aspect-square cursor-pointer hover:bg-secondary hover:bg-opacity-10 group">
                                        {
                                            <Image alt="nearmars"
                                            width={68} height={39}
                                            src={near_mars_get_ipfs_link_image(`image_part_${item[1]}`)}
                                            />
                                        }
                                    </td>
                                    <td className="border transition duration-500 ease-in aspect-square cursor-pointer hover:bg-secondary hover:bg-opacity-10 group">
                                        {
                                            <Image alt="nearmars"
                                            width={68} height={39}
                                            src={near_mars_get_ipfs_link_image(`image_part_${item[2]}`)}
                                            />
                                        }
                                    </td>
                                    <td className="border transition duration-500 ease-in aspect-square cursor-pointer hover:bg-secondary hover:bg-opacity-10 group">
                                        {
                                            <Image alt="nearmars"
                                            width={68} height={39}
                                            src={near_mars_get_ipfs_link_image(`image_part_${item[3]}`)}
                                            />
                                        }
                                    </td>
                                    <td className="border transition duration-500 ease-in aspect-square cursor-pointer hover:bg-secondary hover:bg-opacity-10 group">
                                        {
                                            <Image alt="nearmars"
                                            width={68} height={39}
                                            src={near_mars_get_ipfs_link_image(`image_part_${item[4]}`)}
                                            />
                                        }
                                    </td>
                                    <td className="border transition duration-500 ease-in aspect-square cursor-pointer hover:bg-secondary hover:bg-opacity-10 group">
                                        {
                                            <Image alt="nearmars"
                                            width={68} height={39}
                                            src={near_mars_get_ipfs_link_image(`image_part_${item[5]}`)}
                                            />
                                        }
                                    </td>
                                    <td className="border transition duration-500 ease-in aspect-square cursor-pointer hover:bg-secondary hover:bg-opacity-10 group">                        
                                        {
                                            <Image alt="nearmars"
                                            width={68} height={39}
                                            src={near_mars_get_ipfs_link_image(`image_part_${item[6]}`)}
                                            />
                                        }
                                    </td>
                                    <td className="border transition duration-500 ease-in aspect-square cursor-pointer hover:bg-secondary hover:bg-opacity-10 group">
                                        {
                                            <Image alt="nearmars"
                                            width={68} height={39}
                                            src={near_mars_get_ipfs_link_image(`image_part_${item[7]}`)}
                                            />
                                        }
                                    </td>
                                    <td className="border transition duration-500 ease-in aspect-square cursor-pointer hover:bg-secondary hover:bg-opacity-10 group">
                                        {
                                            <Image alt="nearmars"
                                            width={68} height={39}
                                            src={near_mars_get_ipfs_link_image(`image_part_${item[8]}`)}
                                            />
                                        }
                                    </td>
                                    <td className="border transition duration-500 ease-in aspect-square cursor-pointer hover:bg-secondary hover:bg-opacity-10 group">
                                        {
                                            <Image alt="nearmars"
                                            width={68} height={39}
                                            src={near_mars_get_ipfs_link_image(`image_part_${item[9]}`)}
                                            />
                                        }
                                    </td>
                                    <td className="border transition duration-500 ease-in aspect-square cursor-pointer hover:bg-secondary hover:bg-opacity-10 group">
                                        {
                                            <Image alt="nearmars"
                                            width={68} height={39}
                                            src={near_mars_get_ipfs_link_image(`image_part_${item[10]}`)}
                                            />
                                        }
                                    </td>
                                    <td className="border transition duration-500 ease-in aspect-square cursor-pointer hover:bg-secondary hover:bg-opacity-10 group">
                                        {
                                            <Image alt="nearmars"
                                            width={68} height={39}
                                            src={near_mars_get_ipfs_link_image(`image_part_${item[11]}`)}
                                            />
                                        }
                                    </td>
                                    <td className="border transition duration-500 ease-in aspect-square cursor-pointer hover:bg-secondary hover:bg-opacity-10 group">
                                        {
                                            <Image alt="nearmars"
                                            width={68} height={39}
                                            src={near_mars_get_ipfs_link_image(`image_part_${item[12]}`)}
                                            />
                                        }
                                    </td>
                                    <td className="border transition duration-500 ease-in aspect-square cursor-pointer hover:bg-secondary hover:bg-opacity-10 group">
                                        {
                                            <Image alt="nearmars"
                                            width={68} height={39}
                                            src={near_mars_get_ipfs_link_image(`image_part_${item[13]}`)}
                                            />
                                        }
                                    </td>
                                    <td className="border transition duration-500 ease-in aspect-square cursor-pointer hover:bg-secondary hover:bg-opacity-10 group">
                                        {
                                            <Image alt="nearmars"
                                            width={68} height={39}
                                            src={near_mars_get_ipfs_link_image(`image_part_${item[14]}`)}
                                            />
                                        }
                                    </td>
                                    <td className="border transition duration-500 ease-in aspect-square cursor-pointer hover:bg-secondary hover:bg-opacity-10 group">
                                        {
                                            <Image alt="nearmars"
                                            width={68} height={39}
                                            src={near_mars_get_ipfs_link_image(`image_part_${item[15]}`)}
                                            />
                                        }
                                    </td>
                                    <td className="border transition duration-500 ease-in aspect-square cursor-pointer hover:bg-secondary hover:bg-opacity-10 group">
                                        {
                                            <Image alt="nearmars"
                                            width={68} height={39}
                                            src={near_mars_get_ipfs_link_image(`image_part_${item[16]}`)}
                                            />
                                        }
                                    </td>
                                    <td className="border transition duration-500 ease-in aspect-square cursor-pointer hover:bg-secondary hover:bg-opacity-10 group">
                                        {
                                            <Image alt="nearmars"
                                            width={68} height={39}
                                            src={near_mars_get_ipfs_link_image(`image_part_${item[17]}`)}
                                            />
                                        }
                                    </td>
                                    <td className="border transition duration-500 ease-in aspect-square cursor-pointer hover:bg-secondary hover:bg-opacity-10 group">
                                        {
                                            <Image alt="nearmars"
                                            width={68} height={39}
                                            src={near_mars_get_ipfs_link_image(`image_part_${item[18]}`)}
                                            />
                                        }
                                    </td>
                                    <td className="border transition duration-500 ease-in aspect-square cursor-pointer hover:bg-secondary hover:bg-opacity-10 group">
                                        {
                                            <Image alt="nearmars"
                                            width={68} height={39}
                                            src={near_mars_get_ipfs_link_image(`image_part_${item[19]}`)}
                                            />
                                        }
                                    </td>
                                    <td className="border transition duration-500 ease-in aspect-square cursor-pointer hover:bg-secondary hover:bg-opacity-10 group">
                                        {
                                            <Image alt="nearmars"
                                            width={68} height={39}
                                            src={near_mars_get_ipfs_link_image(`image_part_${item[20]}`)}
                                            />
                                        }
                                    </td>
                                    <td className="border transition duration-500 ease-in aspect-square cursor-pointer hover:bg-secondary hover:bg-opacity-10 group">
                                        {
                                            <Image alt="nearmars"
                                            width={68} height={39}
                                            src={near_mars_get_ipfs_link_image(`image_part_${item[21]}`)}
                                            />
                                        }
                                    </td>
                                    <td className="border transition duration-500 ease-in aspect-square cursor-pointer hover:bg-secondary hover:bg-opacity-10 group">
                                        {
                                            <Image alt="nearmars"
                                            width={68} height={39}
                                            src={near_mars_get_ipfs_link_image(`image_part_${item[22]}`)}
                                            />
                                        }
                                    </td>
                                    <td className="border transition duration-500 ease-in aspect-square cursor-pointer hover:bg-secondary hover:bg-opacity-10 group">                       
                                        {
                                            <Image alt="nearmars"
                                            width={68} height={39}
                                            src={near_mars_get_ipfs_link_image(`image_part_${item[23]}`)}
                                            />
                                        }
                                    </td>
                                    <td className="border transition duration-500 ease-in aspect-square cursor-pointer hover:bg-secondary hover:bg-opacity-10 group">                       
                                        {
                                            <Image alt="nearmars"
                                            width={68} height={39}
                                            src={near_mars_get_ipfs_link_image(`image_part_${item[24]}`)}
                                            />
                                        }
                                    </td>        
                                    <td className="border transition duration-500 ease-in aspect-square cursor-pointer hover:bg-secondary hover:bg-opacity-10 group">
                                        {
                                            <Image alt="nearmars"
                                            width={68} height={39}
                                            src={near_mars_get_ipfs_link_image(`image_part_${item[25]}`)}
                                            />
                                        }
                                    </td>
                                    <td className="border transition duration-500 ease-in aspect-square cursor-pointer hover:bg-secondary hover:bg-opacity-10 group">
                                        {
                                            <Image alt="nearmars"
                                            width={68} height={39}
                                            src={near_mars_get_ipfs_link_image(`image_part_${item[26]}`)}
                                            />
                                        }
                                    </td>
                                    <td className="border transition duration-500 ease-in aspect-square cursor-pointer hover:bg-secondary hover:bg-opacity-10 group">
                                        {
                                            <Image alt="nearmars"
                                            width={68} height={39}
                                            src={near_mars_get_ipfs_link_image(`image_part_${item[27]}`)}
                                            />
                                        }
                                    </td>   
                                    <td className="border transition duration-500 ease-in aspect-square cursor-pointer hover:bg-secondary hover:bg-opacity-10 group">
                                        {
                                            <Image alt="nearmars"
                                            width={68} height={39}
                                            src={near_mars_get_ipfs_link_image(`image_part_${item[28]}`)}
                                            />
                                        }
                                    </td>
                                    <td className="border transition duration-500 ease-in aspect-square cursor-pointer hover:bg-secondary hover:bg-opacity-10 group">
                                        {
                                            <Image alt="nearmars"
                                            width={68} height={39}
                                            src={near_mars_get_ipfs_link_image(`image_part_${item[29]}`)}
                                            />
                                        }
                                    </td>                                              
                                </tr>
                            );
                        })}        
                    </tbody>
                </table>
            </div>
        </div>
    );
}