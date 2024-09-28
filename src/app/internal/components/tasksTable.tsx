import React from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button"


// Create the TasksTable component
const TasksTable = ({ notifications }: { notifications: any }) => {

    return (
        <Table className="">
            <TableHeader>
                <TableRow className="">
                    {/* <TableHead className="border-2">Client</TableHead> */}
                    <TableHead className="border-2">Name</TableHead>
                    <TableHead className="border-2">Email</TableHead>
                    <TableHead className="border-2">Company</TableHead>
                    <TableHead className="border-2">Notification</TableHead>
                    <TableHead className="border-2">Details</TableHead>
                    <TableHead className="border-2">Created At</TableHead>
                    <TableHead className="border-2">Reminders</TableHead>
                    {/* LETS GET COMPANY NAME TOO */}
                </TableRow>
            </TableHeader>
            <TableBody>
                {notifications.map((notification: any, index: number) => {
                    // Use regex to extract the task name from notification.details
                    const taskName = notification.details?.match(/(?<=‘)(.*?)(?=’)/)?.[0];

                    return (
                        <TableRow key={index} className="">
                            <TableCell>{notification.Name}</TableCell>
                            <TableCell>{notification.Email}</TableCell>
                            <TableCell>{notification.Company.name}</TableCell>
                            <TableCell>{notification.Notification}</TableCell>
                            <TableCell>{taskName || notification.details}</TableCell> {/* Display taskName if found, otherwise show full details */}
                            <TableCell>{notification.CreatedAt}</TableCell>
                            <TableCell>
                                <Button>Remind</Button>
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
