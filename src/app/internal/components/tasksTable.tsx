"use client";

import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableHead,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

// Create the TasksTable component
const TasksTable = ({ notifications }: { notifications: any }) => {
    // Maintain loading state for each notification
    const [loading, setLoading] = useState<{ [key: number]: boolean }>({});

    const handleSendReminder = async (index: number, details: {}) => {
        // Set loading only for the current row
        setLoading((prevLoading) => ({ ...prevLoading, [index]: true }));

        const { name, email, company, body, createdAt, notification } = details;

        try {
            const response = await fetch("/api/sendReminder", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    toName: name,
                    toEmail: email,
                    toCompany: company,
                    notification: notification,
                    body: body,
                    createdAt: createdAt,
                }),
            });

            if (response.ok) {
                alert("Reminder sent!");
            } else {
                alert("Failed to send reminder.");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred.");
        } finally {
            // Reset loading for the current row
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
                    <TableHead className="border-2">Notification</TableHead>
                    <TableHead className="border-2">Details</TableHead>
                    <TableHead className="border-2">Created At</TableHead>
                    <TableHead className="border-2">Reminders</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {notifications.map((notification: any, index: number) => {
                    const taskName = notification.details?.match(/(?<=‘)(.*?)(?=’)/)?.[0];

                    return (
                        <TableRow key={index} className="">
                            <TableCell>{notification.Name}</TableCell>
                            <TableCell>{notification.Email}</TableCell>
                            <TableCell>{notification.Company.name}</TableCell>
                            <TableCell>{notification.Notification}</TableCell>
                            <TableCell>{taskName || notification.details}</TableCell>
                            <TableCell>{notification.CreatedAt}</TableCell>
                            <TableCell>
                                <Button
                                    onClick={() =>
                                        handleSendReminder(index, {
                                            name: notification.Name,
                                            email: notification.Email,
                                            notification: notification.Notification,
                                            company: notification.Company.name,
                                            body: taskName || notification.details,
                                            createdAt: notification.CreatedAt,
                                        })
                                    }
                                    disabled={loading[index]} // Disable only the clicked row's button
                                >
                                    {loading[index] ? "Sending..." : "Remind"}
                                </Button>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};

// Export the component
export default TasksTable;
