"use client";

import React, { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableHead,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    ColumnDef,
    SortingState,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import CloseIcon from "@/components/icons/x";
import Bell from "@/components/icons/bell";
import Sortdown from "@/components/icons/sortDown";
import Sortup from "@/components/icons/sortUp";
import Checkmark from "@/components/icons/checkmark";

const TasksTable = ({ notifications }: { notifications: any }) => {
    const [loading, setLoading] = useState<{ [key: number]: boolean }>({});
    const [lastReminded, setLastReminded] = useState<{ [key: number]: string | null }>({});
    const [notes, setNotes] = useState<{ [key: number]: string }>({});
    const [showConfig, setShowConfig] = useState<{ [key: number]: boolean }>({});
    const [priority, setPriority] = useState<{ [key: number]: string }>({});
    const [sent, setSent] = useState<{ [key: number]: boolean }>({});
    const [sorting, setSorting] = useState<SortingState>([]);

    useEffect(() => {
        const savedRemindedTimes = JSON.parse(localStorage.getItem("lastReminded") || "{}");
        setLastReminded(savedRemindedTimes);
    }, []);

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: 'Name',
            header: 'Name',
            cell: info => info.getValue(),
        },
        {
            accessorKey: 'Email',
            header: 'Email',
            cell: info => info.getValue(),
        },
        {
            accessorKey: 'Company.name',
            header: 'Company',
            cell: info => info.getValue(),
        },
        {
            accessorKey: 'Notification',
            header: 'Notification Message',
            cell: info => info.getValue(),
        },
        {
            accessorKey: 'details',
            header: 'Details',
            cell: info => info.getValue(),
        },
        {
            accessorKey: 'CreatedAt',
            header: 'Created At',
            cell: info => info.getValue(),
        },
        {
            accessorKey: 'isRead',
            header: 'Read',
            cell: info => (info.getValue() ? "Read" : "Unread"),
        },
        {
            accessorKey: 'lastReminded',
            header: 'Last Reminded',
            cell: info => lastReminded[info.row.index] || "Not reminded yet",
        }
    ];

    const table = useReactTable({
        data: notifications,
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    const handleSendReminder = async (index: number, details: any) => {
        setLoading((prevLoading) => ({ ...prevLoading, [index]: true }));
        console.log('details', details.Notification)

        const { Name, Email, Company, NotificationEmailBody, CreatedAt, Notification, TimeSinceCreation } = details;
        console.log('not', Notification)
        const note = notes[index] || "";
        const selectedPriority = priority[index] || "none";

        try {
            const response = await fetch("/api/sendReminder", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    toName: Name,
                    toEmail: Email,
                    toCompany: Company.name,
                    Notification: Notification,
                    NotificationEmailBody: NotificationEmailBody,
                    CreatedAt: CreatedAt,
                    TimeSinceCreation: TimeSinceCreation,
                    note,
                    priority: selectedPriority,
                }),
            });
            // const response = {}

            if (response.ok) {
                // alert("Reminder sent!");
                setSent((prevShowConfig) => ({ ...prevShowConfig, [index]: true }))
                setTimeout(() => {
                    setSent((prevShowConfig) => ({ ...prevShowConfig, [index]: false }))
                }, 1500)
                const now = new Date().toLocaleString();

                setLastReminded((prevLastReminded) => {
                    const updatedLastReminded = { ...prevLastReminded, [index]: now };
                    localStorage.setItem("lastReminded", JSON.stringify(updatedLastReminded));
                    return updatedLastReminded;
                });
                setNotes((prevNotes) => ({ ...prevNotes, [index]: "" }));
                setPriority((prevPriority) => ({ ...prevPriority, [index]: "normal" }));
                setShowConfig((prevShowConfig) => ({ ...prevShowConfig, [index]: false }));
            } else {
                alert("Failed to send reminder.");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred.");
        } finally {
            setLoading((prevLoading) => ({ ...prevLoading, [index]: false }));
        }
    };

    return (
        <Table className="">
            <TableHeader>
                {table.getHeaderGroups().map(headerGroup => (
                    <TableRow key={headerGroup.id} className="hover:">
                        {headerGroup.headers.map(header => (
                            <TableHead
                                key={header.id}
                                className="cursor-pointer text-white hover:underline"
                                onClick={header.column.getToggleSortingHandler()}
                            >
                                {flexRender(header.column.columnDef.header, header.getContext())}
                                {{
                                    asc: <Sortup></Sortup>,
                                    desc: <Sortdown></Sortdown>,
                                }[header.column.getIsSorted() as string] ?? null}
                            </TableHead>
                        ))}
                    </TableRow>
                ))}
            </TableHeader>
            <TableBody>
                {table.getRowModel().rows.map(row => (
                    <TableRow key={row.id} className="">
                        {row.getVisibleCells().map(cell => (
                            <TableCell key={cell.id} className="text-slate-300">
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                        ))}
                        <TableCell className="w-[10%]">
                            <div className="flex flex-row gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => handleSendReminder(row.index, notifications[row.index])}
                                    disabled={loading[row.index]}
                                >
                                    {loading[row.index] ? "Sending..." : sent[row.index] ? <div className="pl-9 w-24"><Checkmark/></div> : "Send Reminder"}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        setShowConfig((prevShowConfig) => ({
                                            ...prevShowConfig,
                                            [row.index]: !prevShowConfig[row.index],
                                        }))
                                    }
                                >
                                    {showConfig[row.index] ? <CloseIcon /> : <Bell />}

                                </Button>
                            </div>
                            {showConfig[row.index] && (
                                <div className="pt-2">
                                    <div className="rounded-md space-y-3">
                                        <Select onValueChange={(value) =>
                                            setPriority((prev) => ({
                                                ...prev,
                                                [row.index]: value,
                                            }))
                                        }>
                                            <SelectTrigger className="text-slate-300">
                                                <SelectValue placeholder="Select a Priority" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Importance</SelectLabel>
                                                    <SelectItem value="none">None</SelectItem>
                                                    <SelectItem value="low">Low</SelectItem>
                                                    <SelectItem value="medium">Medium</SelectItem>
                                                    <SelectItem value="high">High</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <Input
                                            type="text"
                                            placeholder="Add a note"
                                            value={notes[row.index] || ""}
                                            onChange={(e) =>
                                                setNotes((prevNotes) => ({
                                                    ...prevNotes,
                                                    [row.index]: e.target.value,
                                                }))
                                            }
                                            className="w-full text-slate-300"
                                        />
                                    </div>
                                </div>
                            )}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default TasksTable;
