import React, { useEffect, useState } from 'react'
import { DataTableDemo } from './EmployeeTable'
import { AddOrgFunds } from './AddOrgFunds'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Button } from './ui/button'
import { CheckIcon, DotsHorizontalIcon } from '@radix-ui/react-icons'
import { ColumnDef } from '@tanstack/react-table'
import { RxCross2 } from 'react-icons/rx'
// import { AddEmployee } from './AddEmployee'
import { useAppDispatch, useAppSelector } from '@/state/hooks'
import { selectOrganization } from '@/state/selectors'
import { useQuery } from '@apollo/client'
// import { GET_EMPLOYEE_MOVE } from '@/utils/graph-queries'
import { Address } from '@/state/types'
import { setOrganization } from '@/state/app'
// import { getUserByAddress } from '@/api/api'
import { formatAddress } from '@/utils/helper'
import { IoCardSharp } from 'react-icons/io5'
// import { paySalaryMove } from '@/services/write-services'
// import { useWallet } from '@aptos-labs/wallet-adapter-react'
// import { fetchEmployeeIsVerified } from '@/services/read-services'
// import { useToast } from '@/hooks/use-toast'
import { Employee } from '@/state/types'
import { AddEmployee } from './AddEmployee'
import { Roboto_Mono } from '@next/font/google'
import { fetchEmployees } from '@/services/read-services'
import { formatUnits } from 'viem'
import { paySalary } from '@/services/write-services'

const roboto = Roboto_Mono({
    subsets: ['latin'],
    weight: ['300', '400', '500', '700',]
  })



type AddressProp = {
    address: Address
}

const EmployerGraphs = ({address}:AddressProp) => {
    // const { signAndSubmitTransaction } = useWallet()
    const [employees,setEmployees] = useState<Employee[]>()
    const dispatch = useAppDispatch()
    const org = useAppSelector(selectOrganization)
    // const {toast} = useToast()

    const columns: ColumnDef<Employee>[] = [

        {
            accessorKey: "address",
            header: "Address",
            cell: ({ row }) => (
                <div className="capitalize">{formatAddress(row.getValue("address"))}</div>
            ),
        },
        {
            accessorKey: "employeeName",
            header: "Name",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("employeeName")}</div>
            ),
        },
        // {
        //     accessorKey: "verified",
        //     header: "Verified",
        //     cell: ({ row }) => {
        //         const verified = row.getValue("verified") as boolean
                
        //         return (
        //             <div className="flex">
        //                 {verified ? (
        //                     <CheckIcon className="h-5 w-5 text-green-500" />
        //                 ) : (
        //                     <RxCross2 className="h-5 w-5 text-red-500" />
        //                 )}
        //                 <span className="ml-2 capitalize">
        //                     {verified ? "Yes" : "No"}
        //                 </span>
        //             </div>
        //         )
        //     },
        // },
        {
            accessorKey: "salary",
            header: () => <div className="text-center">Salary</div>,
            cell: ({ row }) => {
                const amount = parseFloat(row.getValue("salary"))
    
                return <div className="text-center font-medium">{amount} TEST</div>
            },
        },
        {
            accessorKey: "activity",
            header: () => <div className="text-center">Activity</div>,
            cell: ({ row }) => (
                <div className="capitalize text-center">{row.getValue("activity")}</div>
            ),
        },
        {
            accessorKey: "daysWorked",
            header: () => <div className="text-center">Days Worked</div>,
            cell: ({ row }) => (
                <div className="capitalize text-center">{row.getValue("daysWorked")}</div>
            ),
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const employee = row.original;
    
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <DotsHorizontalIcon className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                className='gap-2'
                                onClick={async () => {
                                    const tx = await paySalary(employee.address as `0x${string}`,employee.orgAddress as `0x${string}`)
                                    console.log(tx)
                                  }}
                            >
                             <IoCardSharp />   Pay Your Employee
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]
    

    // const data = fetchEmployees(["0x00151f0862C08c8BCde328ba0038CCad1454F455"])
    // console.log(data)

    useEffect(() => {
        if (org) {
            
            fetchEmployees(["0x00151f0862C08c8BCde328ba0038CCad1454F455","0xEEECB191550FAeF02DEb0329CE708e137D20F69C"]).then((data)=>{
                const employees = data.map((employee) => ({
                    address: employee.address,
                    employeeName: employee.employeeName,
                    orgAddress: employee.orgAddress,
                    activity: employee.activity,
                    salary: employee.salary,
                    daysWorked: Math.floor(
                      (Date.now() - Number(employee.daysWorked) * 1000) / (24 * 1000 * 60 * 60)
                    ),
                  }))
                setEmployees(employees)
                console.log(employees)
                dispatch(setOrganization({ ...org, employees }))
            })
            
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ dispatch])

    return (
        <div className="py-3">
            <div className="grid grid-cols-3 gap-10 md:gap-2 max-w-7xl mx-auto">
            <div className="absolute pointer-events-none inset-0 flex items-start justify-start bg-black-100 [mask-image:radial-gradient(ellipse_at_center,transparent_60%,black)]"></div>
                <div
                    className="relative p-6 overflow-hidden border  border-white/[0.6]  bg-[#18152217]/60 col-span-2"
                >
                    <div className='w-full flex justify-between items-center mb-2'>
                        <span className={`text-2xl font-bold text-purple-300 ${roboto.className}`}>Employees</span>
                        <AddEmployee />
                    </div> 
                    {employees && <DataTableDemo data={employees} columns={columns}/>}
                    
                </div>
                <div
                    className="relative p-6  overflow-hidden border  border-white/[0.6]  bg-[#181522]/60  col-span-1"
                >
                   <AddOrgFunds orgName={org?.orgName}/>
                </div>
            </div>
        </div>
    )
}

export default EmployerGraphs