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

import CloseIcon from "@/components/icons/x";
import Bell from "@/components/icons/bell";

const TasksTable = ({ notifications }: { notifications: any }) => {
    const [loading, setLoading] = useState<{ [key: number]: boolean }>({});
    const [lastReminded, setLastReminded] = useState<{ [key: number]: string | null }>({});
    const [notes, setNotes] = useState<{ [key: number]: string }>({});
    const [showConfig, setShowConfig] = useState<{ [key: number]: boolean }>({});
    const [priority, setPriority] = useState<{ [key: number]: string }>({});

    useEffect(() => {
        const savedRemindedTimes = JSON.parse(localStorage.getItem("lastReminded") || "{}");
        setLastReminded(savedRemindedTimes);
    }, []);

    const handleSendReminder = async (index: number, details: any) => {
        setLoading((prevLoading) => ({ ...prevLoading, [index]: true }));

        const { name, email, company, body, createdAt, notification } = details;
        const note = notes[index] || "";
        const selectedPriority = priority[index] || "none";

        try {
            const response = await fetch("/api/sendReminder", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    toName: name,
                    toEmail: email,
                    toCompany: company,
                    notification,
                    body,
                    createdAt,
                    note,
                    priority: selectedPriority,
                }),
            });

            if (response.ok) {
                alert("Reminder sent!");
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
                <TableRow className="">
                    <TableHead className="border-2">Name</TableHead>
                    <TableHead className="border-2">Email</TableHead>
                    <TableHead className="border-2">Company</TableHead>
                    <TableHead className="border-2">Notification Message</TableHead>
                    <TableHead className="border-2">Details</TableHead>
                    <TableHead className="border-2">Created At</TableHead>
                    <TableHead className="border-2">Read</TableHead>
                    <TableHead className="border-2">{ }</TableHead>
                    <TableHead className="border-2">Last Reminded</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {notifications.map((notification: any, index: number) => {
                    const taskName = notification.details?.match(/(?<=‘)(.*?)(?=’)/)?.[0];

                    return (
                        <React.Fragment key={index}>
                            <TableRow className="">
                                <TableCell>{notification.Name}</TableCell>
                                <TableCell>{notification.Email}</TableCell>
                                <TableCell>{notification.Company.name}</TableCell>
                                <TableCell>{notification.Notification}</TableCell>
                                <TableCell>{taskName || notification.details}</TableCell>
                                <TableCell>{notification.CreatedAt}</TableCell>
                                <TableCell>{notification.isRead ? "Read" : "Unread"}</TableCell>
                                <TableCell className="w-[10%]">

                                    {/* {showConfig[index] && */}
                                    {/* {!showConfig[index] && <Bell></Bell>} */}
                                    {/* {!showConfig[index] && */}
                                    <div className="flex flex-row gap-2">
                                        <div className="w-full">
                                            <Button
                                                variant="outline"
                                                onClick={() =>
                                                    handleSendReminder(index, {
                                                        name: notification.Name,
                                                        email: notification.Email,
                                                        notification: notification.Notification,
                                                        company: notification.Company.name,
                                                        body: taskName || notification.details,
                                                        createdAt: notification.CreatedAt,
                                                        priority: priority,
                                                        note: notes
                                                    })
                                                }
                                                disabled={loading[index]}
                                                className="w-full border-2"
                                            >
                                                {loading[index] ? "Sending..." : "Send Reminder"}
                                            </Button>
                                        </div>
                                        <div className="w-full">
                                            <Button
                                                variant="outline"
                                                onClick={() =>
                                                    setShowConfig((prevShowConfig) => ({
                                                        ...prevShowConfig,
                                                        [index]: !prevShowConfig[index],
                                                    }))
                                                }
                                                className="w-full border-2"
                                            >
                                                {showConfig[index] ? <CloseIcon></CloseIcon> : <Bell></Bell>}
                                            </Button>
                                        </div>

                                    </div>
                                    {/* } */}


                                    {showConfig[index] &&
                                        <div className="pt-2">
                                            <td colSpan={9} className="transition-all duration-300 ease-in-out">
                                                <div className="rounded-md space-y-3">
                                                    <Select onValueChange={(value) =>
                                                        setPriority((prev) => ({
                                                            ...prev,
                                                            [index]: value,
                                                        }))
                                                    }>
                                                        <SelectTrigger className="text-black">
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
                                                        value={notes[index] || ""}
                                                        onChange={(e) =>
                                                            setNotes((prevNotes) => ({
                                                                ...prevNotes,
                                                                [index]: e.target.value,
                                                            }))
                                                        }
                                                        className="w-full"
                                                    />
                                                </div>
                                            </td>
                                        </div>
                                    }
                                </TableCell>
                                <TableCell>{lastReminded[index] || "Not reminded yet"}</TableCell>
                            </TableRow>
                        </React.Fragment>
                    );
                })}
            </TableBody>
        </Table>
    );
};

export default TasksTable;
