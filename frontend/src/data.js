// data.js
// A simple data source for "features" with associated arrays.
// Suitable for use in React projects (e.g., mapping to UI cards, lists, or feature toggles).

export const features = [
    {
        "id": "easy_file_upload",
        "name": "Easy File Upload",
        "icon": "icon_document",
        "description": "Quickly upload your files with our intuitive drag-and-drop interface.",
        "color": "#6C5CE7"  // purple accent
    },
    {
        "id": "secure_storage",
        "name": "Secure Storage",
        "icon": "icon_shield",
        "description": "Your files are encrypted and stored securely in our cloud infrastructure.",
        "color": "#1ABC9C"  // teal/green accent
    },
    {
        "id": "simple_sharing",
        "name": "Simple Sharing",
        "icon": "icon_share",
        "description": "Share files with anyone using secure links that you control.",
        "color": "#3498DB"  // blue accent
    },
    {
        "id": "flexible_credits",
        "name": "Flexible Credits",
        "icon": "icon_credit_card",
        "description": "Pay only for what you use with our credit-based system.",
        "color": "#E67E22"  // orange accent
    },
    {
        "id": "file_management",
        "name": "File Management",
        "icon": "icon_file",
        "description": "Organize, preview, and manage your files from any device.",
        "color": "#9B59B6"  // purple-pink accent
    },
    {
        "id": "transaction_history",
        "name": "Transaction History",
        "icon": "icon_clock",
        "description": "Keep track of all your credit purchases and usage.",
        "color": "#2ECC71"  // green accent
    }
];

// Optional: a default export if you prefer
export default features;