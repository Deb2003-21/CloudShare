import { BanknoteArrowDown, CreditCard, Files, LayoutDashboard, Upload } from "lucide-react";

// side menu bar options
export const SIDE_MENU_DATA = [
    {
        id: "01",
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/dashboard",
    },
    {
        id: "02",
        label: "Upload",
        icon: Upload,
        path: "/upload",
    },
    {
        id: "03",
        label: "My Files",
        icon: Files,
        path: "/myfiles",
    },
    {
        id: "04",
        label: "Subscriptions",
        icon: CreditCard,
        path: "/subscription",
    },
    {
        id: "05",
        label: "Transactions",
        icon: BanknoteArrowDown,
        path: "/transactions",
    },
];