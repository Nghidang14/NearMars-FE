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
        <div className="mt-5 wrapper rounded shadow w-full ">
            <div className="header flex justify-between border-b p-2">
                <span className="text-lg font-bold">
                    {selectYear} {MONTH_NAMES[selectMonth]}
                </span>
                <div >
                    <button className="p-1 hover:scale-125 transition-all ease-in-out duration-150" onClick={previousMonth}>
                        <svg width="1em" fill="gray" height="1em" viewBox="0 0 16 16" className="bi bi-arrow-left-circle" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                            <path fillRule="evenodd" d="M8.354 11.354a.5.5 0 0 0 0-.708L5.707 8l2.647-2.646a.5.5 0 1 0-.708-.708l-3 3a.5.5 0 0 0 0 .708l3 3a.5.5 0 0 0 .708 0z" />
                            <path fillRule="evenodd" d="M11.5 8a.5.5 0 0 0-.5-.5H6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 .5-.5z" />
                        </svg>
                    </button>
                    <button className="p-1 hover:scale-125 transition-all ease-in-out duration-150" onClick={nextMonth}>
                        <svg width="1em" fill="gray" height="1em" viewBox="0 0 16 16" className="bi bi-arrow-right-circle" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                            <path fillRule="evenodd" d="M7.646 11.354a.5.5 0 0 1 0-.708L10.293 8 7.646 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0z" />
                            <path fillRule="evenodd" d="M4.5 8a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5z" />
                        </svg>
                    </button>
                </div>
            </div>
            <div className="relative overflow-x-auto">            
                <table className="table-auto">
                    <thead>
                        <tr>
                            <th className="p-2 border-r border-l h-10 xl:text-sm text-xs">
                                <span className="sm:block hidden">Mars01</span>
                                <span className="sm:hidden block">Mars01</span>
                            </th>
                            <th className="p-2 border-r h-10 xl:text-sm text-xs">
                                <span className="sm:block hidden">Mars02</span>
                                <span className="sm:hidden block">Mars02</span>
                            </th>
                            <th className="p-2 border-r h-10 xl:text-sm text-xs">
                                <span className="sm:block hidden">Mars03</span>
                                <span className="sm:hidden block">Mars03</span>
                            </th>
                            <th className="p-2 border-r h-10 xl:text-sm text-xs">
                                <span className="sm:block hidden">Mars04</span>
                                <span className="sm:hidden block">Mars04</span>
                            </th>
                            <th className="p-2 border-r h-10 xl:text-sm text-xs">
                                <span className="sm:block hidden">Mars05</span>
                                <span className="sm:hidden block">Mars05</span>
                            </th>
                            <th className="p-2 border-r h-10 xl:text-sm text-xs">
                                <span className="sm:block hidden">Mars06</span>
                                <span className="sm:hidden block">Mars06</span>
                            </th>
                            <th className="p-2 border-r h-10 xl:text-sm text-xs">
                                <span className="sm:block hidden">Mars07</span>
                                <span className="sm:hidden block">Mars07</span>
                            </th>
                            <th className="p-2 border-r border-l h-10 xl:text-sm text-xs">
                                <span className="sm:block hidden">Mars08</span>
                                <span className="sm:hidden block">Mars08</span>
                            </th>
                            <th className="p-2 border-r h-10 xl:text-sm text-xs">
                                <span className="sm:block hidden">Mars09</span>
                                <span className="sm:hidden block">Mars09</span>
                            </th>
                            <th className="p-2 border-r h-10 xl:text-sm text-xs">
                                <span className="sm:block hidden">Mars10</span>
                                <span className="sm:hidden block">Mars10</span>
                            </th>
                            <th className="p-2 border-r h-10 xl:text-sm text-xs">
                                <span className="sm:block hidden">Mars11</span>
                                <span className="sm:hidden block">Mars11</span>
                            </th>
                            <th className="p-2 border-r h-10 xl:text-sm text-xs">
                                <span className="sm:block hidden">Mars12</span>
                                <span className="sm:hidden block">Mars12</span>
                            </th>
                            <th className="p-2 border-r h-10 xl:text-sm text-xs">
                                <span className="sm:block hidden">Mars13</span>
                                <span className="sm:hidden block">Mars13</span>
                            </th>
                            <th className="p-2 border-r h-10 xl:text-sm text-xs">
                                <span className="sm:block hidden">Mars14</span>
                                <span className="sm:hidden block">Mars14</span>
                            </th>
                            <th className="p-2 border-r border-l h-10 xl:text-sm text-xs">
                                <span className="sm:block hidden">Mars15</span>
                                <span className="sm:hidden block">Mars15</span>
                            </th>
                            <th className="p-2 border-r h-10 xl:text-sm text-xs">
                                <span className="sm:block hidden">Mars16</span>
                                <span className="sm:hidden block">Mars16</span>
                            </th>
                            <th className="p-2 border-r h-10 xl:text-sm text-xs">
                                <span className="sm:block hidden">Mars17</span>
                                <span className="sm:hidden block">Mars17</span>
                            </th>
                            <th className="p-2 border-r h-10 xl:text-sm text-xs">
                                <span className="sm:block hidden">Mars18</span>
                                <span className="sm:hidden block">Mars18</span>
                            </th>
                            <th className="p-2 border-r h-10 xl:text-sm text-xs">
                                <span className="sm:block hidden">Mars19</span>
                                <span className="sm:hidden block">Mars19</span>
                            </th>
                            <th className="p-2 border-r h-10 xl:text-sm text-xs">
                                <span className="sm:block hidden">Mars20</span>
                                <span className="sm:hidden block">Mars20</span>
                            </th>
                            <th className="p-2 border-r h-10 xl:text-sm text-xs">
                                <span className="sm:block hidden">Mars21</span>
                                <span className="sm:hidden block">Mars21</span>
                            </th>
                            <th className="p-2 border-r border-l h-10 xl:text-sm text-xs">
                                <span className="sm:block hidden">Mars22</span>
                                <span className="sm:hidden block">Mars22</span>
                            </th>
                            <th className="p-2 border-r h-10 xl:text-sm text-xs">
                                <span className="sm:block hidden">Mars23</span>
                                <span className="sm:hidden block">Mars23</span>
                            </th>
                            <th className="p-2 border-r h-10 xl:text-sm text-xs">
                                <span className="sm:block hidden">Mars24</span>
                                <span className="sm:hidden block">Mars24</span>
                            </th>
                            <th className="p-2 border-r h-10 xl:text-sm text-xs">
                                <span className="sm:block hidden">Mars25</span>
                                <span className="sm:hidden block">Mars25</span>
                            </th>
                            <th className="p-2 border-r h-10 xl:text-sm text-xs">
                                <span className="sm:block hidden">Mars26</span>
                                <span className="sm:hidden block">Mars26</span>
                            </th>
                            <th className="p-2 border-r h-10 xl:text-sm text-xs">
                                <span className="sm:block hidden">Mars27</span>
                                <span className="sm:hidden block">Mars27</span>
                            </th>
                            <th className="p-2 border-r h-10 xl:text-sm text-xs">
                                <span className="sm:block hidden">Mars28</span>
                                <span className="sm:hidden block">Mars28</span>
                            </th>
                            <th className="p-2 border-r h-10 xl:text-sm text-xs">
                                <span className="sm:block hidden">Mars29</span>
                                <span className="sm:hidden block">Mars29</span>
                            </th>
                            <th className="p-2 border-r h-10 xl:text-sm text-xs">
                                <span className="sm:block hidden">Mars30</span>
                                <span className="sm:hidden block">Mars30</span>
                            </th>
                        </tr>
                    </thead>
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