import { ColumnDef } from "@tanstack/react-table"

interface Notification {
  name: string; 
  email: string
  company: string
  notification: any
  details: any
  createdAt: any
  reminders: any
  lastReminded: any
}

export const columns: ColumnDef<Notification>[] = [
  {
    accessorKey: "name",
    header: () => <div className="text-right">Name</div>,
    cell: ({ row }) => {
      const nameValue: string = row.getValue("name");
      const name = nameValue

      return <div className="text-right font-medium">{name}</div>;
    },
  },
  {
    accessorKey: "email",
    header: () => <div className="text-right">Email</div>,
    cell: ({ row }) => {
      const emailValue: string = row.getValue("email");
      const email = emailValue

      return <div className="text-right font-medium">{email}</div>;
    },
  },
  {
    accessorKey: "company",
    header: () => <div className="text-right">Company</div>,
    cell: ({ row }) => {
      const companyValue: string = row.getValue("company");
      const company = companyValue

      return <div className="text-right font-medium">{company}</div>;
    },
  },
  {
    accessorKey: "notification",
    header: () => <div className="text-right">Notification</div>,
    cell: ({ row }) => {
      const notificationValue: string = row.getValue("notification");
      const notification = notificationValue

      return <div className="text-right font-medium">{notification}</div>;
    },
  },
  {
    accessorKey: "details",
    header: () => <div className="text-right">Details</div>,
    cell: ({ row }) => {
      const detailsValue: string = row.getValue("details");
      const details = detailsValue

      return <div className="text-right font-medium">{details}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: () => <div className="text-right">Created At</div>,
    cell: ({ row }) => {
      const createdAtValue: string = row.getValue("createdAt");
      const createdAt = createdAtValue

      return <div className="text-right font-medium">{createdAt}</div>;
    },
  },
  {
    accessorKey: "reminders",
    header: () => <div className="text-right">Reminders</div>,
    cell: ({ row }) => {
      const remindersValue: string = row.getValue("reminders");
      const reminders = remindersValue

      return <div className="text-right font-medium">{reminders}</div>;
    },
  },
  {
    accessorKey: "lastReminded",
    header: () => <div className="text-right">Last Reminded</div>,
    cell: ({ row }) => {
      const lastRemindedValue: string = row.getValue("lastReminded");
      const lastReminded = lastRemindedValue

      return <div className="text-right font-medium">{lastReminded}</div>;
    },
  },
];
