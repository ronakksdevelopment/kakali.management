/* ============================================================
   I18N.JS — English / Bengali / Hindi translation dictionary
   ============================================================ */

const I18N = {
  en: {
    appName: "Kakali Enterprise",
    tagline: "Turn your shop notebook into a simple digital business system.",
    dashboard: "Dashboard", sales: "Sales", products: "Products", khata: "Khata", more: "More",
    purchases: "Purchases", customers: "Customers", suppliers: "Suppliers",
    expenses: "Expenses", income: "Income", payments: "Payments", reports: "Reports",
    reminders: "Reminders", settings: "Settings", search: "Search", about: "About",
    newSale: "New Sale", bills: "Bills", stock: "Stock", backupRestore: "Backup & Restore",

    today: "Today", yesterday: "Yesterday", thisWeek: "This Week", thisMonth: "This Month", custom: "Custom",
    salesLabel: "Sales", received: "Received", customerDue: "Customer Due", supplierDue: "Supplier Due",
    net: "Net", profitEst: "Profit (est.)",

    quickActions: "Quick Actions",
    sale: "Sale", expense: "Expense", purchase: "Purchase", customer: "Customer",
    product: "Product", paymentReceived: "Receive", paymentGiven: "Give",

    insights: "Insights",
    noInsightsYet: "Start recording sales to see your business insights.",

    addProduct: "Add Product", editProduct: "Edit Product", productName: "Product Name",
    sku: "SKU / Code", category: "Category", purchasePrice: "Purchase Price", sellPrice: "Selling Price",
    currentStock: "Current Stock", minStock: "Minimum Stock Level", unit: "Unit", supplier: "Supplier",
    taxRate: "Tax / GST Rate (%)", notes: "Notes", noProductsYet: "No products yet.",
    addFirstProduct: "Add your first product to start managing stock.",
    lowStock: "Low Stock", lowStockItems: "Low Stock Items", outOfStock: "Out of Stock",
    piece: "Piece", kg: "Kg", gram: "Gram", litre: "Litre", meter: "Meter", box: "Box", pack: "Pack", dozen: "Dozen", other: "Other",

    addCustomer: "Add Customer", editCustomer: "Edit Customer", customerName: "Customer Name",
    phone: "Phone", address: "Address", noCustomersYet: "No customers yet.",
    addCustomersHint: "Add customers to keep track of payments and dues.",
    youWillReceive: "You will receive", youWillGive: "You need to give", allSettled: "All settled",

    addSupplier: "Add Supplier", editSupplier: "Edit Supplier", supplierName: "Supplier Name",
    noSuppliersYet: "No suppliers yet.",

    cash: "Cash", upi: "UPI", card: "Card", bank: "Bank",
    paid: "Paid", due: "Due", fullyPaid: "Fully Paid", partiallyPaid: "Partially Paid",
    markDue: "Mark as Due", selectCustomer: "Select Customer", selectProduct: "Select Product",
    qty: "Qty", price: "Price", discount: "Discount", tax: "Tax", subtotal: "Subtotal", total: "Total",
    grandTotal: "Grand Total", addItem: "Add Item", saveBill: "Save Bill", shareBill: "Share Bill",
    printBill: "Print", downloadBill: "Download", noSalesYet: "No sales yet.",
    recordFirstSale: "Record your first sale and your business dashboard will come alive.",
    walkInCustomer: "Walk-in Customer",

    recordPurchase: "Record Purchase", noPurchasesYet: "No purchases recorded yet.",

    recordExpense: "Record Expense", expenseCategory: "Category", amount: "Amount",
    description: "Description", noExpensesYet: "No expenses recorded yet.",
    rent: "Rent", electricity: "Electricity", transport: "Transport", salary: "Salary",
    packaging: "Packaging", maintenance: "Maintenance", food: "Food",

    recordIncome: "Record Other Income", noIncomeYet: "No other income recorded yet.",

    receive: "Receive", give: "Give", ledgerFor: "Ledger for", relatedPerson: "Person",
    noLedgerYet: "No transactions yet.",

    dailyReport: "Daily", weeklyReport: "Weekly", monthlyReport: "Monthly", customRange: "Custom Range",
    topProducts: "Top Products", stockMovement: "Stock Movement", transactionSummary: "Transaction Summary",

    addReminder: "Add Reminder", reminderTitle: "Title", dueDate: "Due Date",
    noRemindersYet: "No reminders yet.", markDone: "Mark Done", callSupplier: "Call supplier",
    restockItem: "Restock item", collectDue: "Collect customer due", paySupplier: "Pay supplier",

    businessProfile: "Business Profile", businessName: "Business Name", ownerName: "Owner Name",
    language: "Language", currency: "Currency", gstSettings: "GST Settings", invoiceSettings: "Invoice Settings",
    paymentMethods: "Payment Methods", pinLock: "PIN Lock", exportData: "Export Data", importData: "Import Data",
    whatsappTemplates: "WhatsApp Templates", lowStockSettings: "Low Stock Settings", appearance: "Appearance",
    resetData: "Reset Data", enablePin: "Enable PIN", changePin: "Change PIN", disablePin: "Disable PIN",
    gstBusiness: "GST Registered Business", nonGst: "Non-GST Business",
    darkMode: "Dark Mode",

    save: "Save", cancel: "Cancel", delete: "Delete", edit: "Edit", close: "Close", confirm: "Confirm",
    yes: "Yes", no: "No", back: "Back", next: "Next", done: "Done", skip: "Skip", getStarted: "Get Started",
    add: "Add", update: "Update", share: "Share", print: "Print", download: "Download", duplicate: "Duplicate",
    undo: "Undo", exportBackup: "Export Backup", importBackup: "Import Backup", exportCsv: "Export CSV",

    welcomeTitle: "Welcome to Kakali Enterprise",
    shopReady: "Your shop is ready.",
    dataStoredLocally: "Your data is stored on this device.",
    somethingWrong: "Something went wrong. Please try again.",
    confirmDelete: "Are you sure you want to delete this? This cannot be undone.",
    confirmReset: "This will permanently delete all business data from this device. This cannot be undone.",
    restoreWarning: "This will replace all current data with the backup file. Continue?",
    itemDeleted: "Item deleted",
    savedSuccessfully: "Saved successfully",
    noResultsFound: "No results found",
    installAppTitle: "Install Kakali Enterprise",
    installAppDesc: "Install on your phone for faster access, even offline.",
    install: "Install", notNow: "Not now",
    enterPin: "Enter your PIN",
    createPin: "Create a 4-digit PIN",
    confirmPin: "Confirm your PIN",
    wrongPin: "Incorrect PIN. Try again.",
    forgotPin: "Forgot PIN? Reset from Settings after reinstall, or restore a backup.",
    insightSalesHigher: "Sales are {pct}% higher than yesterday.",
    insightSalesLower: "Sales are {pct}% lower than yesterday.",
    insightLowStockPlural: "{n} products are running low.",
    insightLowStockSingle: "1 product is running low.",
    insightCustomerDue: "{amount} is pending from customers.",
    insightSupplierDue: "{amount} is payable to suppliers.",
    insightTopProduct: "Your top-selling product today is {name}.",
    insightHighExpense: "Today's expenses are higher than your average.",
  },

  bn: {
    appName: "কাকলি এন্টারপ্রাইজ",
    tagline: "আপনার দোকানের খাতাকে একটি সহজ ডিজিটাল ব্যবসা ব্যবস্থাপনা সিস্টেমে রূপান্তর করুন।",
    dashboard: "ড্যাশবোর্ড", sales: "বিক্রয়", products: "পণ্য", khata: "খাতা", more: "আরও",
    purchases: "ক্রয়", customers: "গ্রাহক", suppliers: "সরবরাহকারী",
    expenses: "খরচ", income: "আয়", payments: "পেমেন্ট", reports: "রিপোর্ট",
    reminders: "রিমাইন্ডার", settings: "সেটিংস", search: "খুঁজুন", about: "সম্পর্কে",
    newSale: "নতুন বিক্রয়", bills: "বিল", stock: "স্টক", backupRestore: "ব্যাকআপ ও পুনরুদ্ধার",

    today: "আজ", yesterday: "গতকাল", thisWeek: "এই সপ্তাহ", thisMonth: "এই মাস", custom: "কাস্টম",
    salesLabel: "বিক্রয়", received: "প্রাপ্ত", customerDue: "গ্রাহক বাকি", supplierDue: "সরবরাহকারী বাকি",
    net: "নীট", profitEst: "লাভ (আনুমানিক)",

    quickActions: "দ্রুত কাজ",
    sale: "বিক্রয়", expense: "খরচ", purchase: "ক্রয়", customer: "গ্রাহক",
    product: "পণ্য", paymentReceived: "গ্রহণ", paymentGiven: "প্রদান",

    insights: "অন্তর্দৃষ্টি",
    noInsightsYet: "আপনার ব্যবসার অন্তর্দৃষ্টি দেখতে বিক্রয় রেকর্ড শুরু করুন।",

    addProduct: "পণ্য যোগ করুন", editProduct: "পণ্য সম্পাদনা", productName: "পণ্যের নাম",
    sku: "SKU / কোড", category: "ক্যাটাগরি", purchasePrice: "ক্রয় মূল্য", sellPrice: "বিক্রয় মূল্য",
    currentStock: "বর্তমান স্টক", minStock: "সর্বনিম্ন স্টক লেভেল", unit: "একক", supplier: "সরবরাহকারী",
    taxRate: "ট্যাক্স / জিএসটি হার (%)", notes: "নোট", noProductsYet: "এখনো কোনো পণ্য নেই।",
    addFirstProduct: "স্টক পরিচালনা শুরু করতে আপনার প্রথম পণ্য যোগ করুন।",
    lowStock: "কম স্টক", lowStockItems: "কম স্টক আইটেম", outOfStock: "স্টক শেষ",
    piece: "পিস", kg: "কেজি", gram: "গ্রাম", litre: "লিটার", meter: "মিটার", box: "বক্স", pack: "প্যাক", dozen: "ডজন", other: "অন্যান্য",

    addCustomer: "গ্রাহক যোগ করুন", editCustomer: "গ্রাহক সম্পাদনা", customerName: "গ্রাহকের নাম",
    phone: "ফোন", address: "ঠিকানা", noCustomersYet: "এখনো কোনো গ্রাহক নেই।",
    addCustomersHint: "পেমেন্ট এবং বাকি ট্র্যাক রাখতে গ্রাহক যোগ করুন।",
    youWillReceive: "আপনি পাবেন", youWillGive: "আপনাকে দিতে হবে", allSettled: "সব পরিশোধিত",

    addSupplier: "সরবরাহকারী যোগ করুন", editSupplier: "সরবরাহকারী সম্পাদনা", supplierName: "সরবরাহকারীর নাম",
    noSuppliersYet: "এখনো কোনো সরবরাহকারী নেই।",

    cash: "নগদ", upi: "ইউপিআই", card: "কার্ড", bank: "ব্যাংক",
    paid: "পরিশোধিত", due: "বাকি", fullyPaid: "সম্পূর্ণ পরিশোধিত", partiallyPaid: "আংশিক পরিশোধিত",
    markDue: "বাকি হিসেবে চিহ্নিত করুন", selectCustomer: "গ্রাহক নির্বাচন করুন", selectProduct: "পণ্য নির্বাচন করুন",
    qty: "পরিমাণ", price: "মূল্য", discount: "ছাড়", tax: "ট্যাক্স", subtotal: "উপমোট", total: "মোট",
    grandTotal: "সর্বমোট", addItem: "আইটেম যোগ করুন", saveBill: "বিল সংরক্ষণ করুন", shareBill: "বিল শেয়ার করুন",
    printBill: "প্রিন্ট", downloadBill: "ডাউনলোড", noSalesYet: "এখনো কোনো বিক্রয় নেই।",
    recordFirstSale: "আপনার প্রথম বিক্রয় রেকর্ড করুন এবং আপনার ব্যবসার ড্যাশবোর্ড জীবন্ত হয়ে উঠবে।",
    walkInCustomer: "সাধারণ গ্রাহক",

    recordPurchase: "ক্রয় রেকর্ড করুন", noPurchasesYet: "এখনো কোনো ক্রয় রেকর্ড করা হয়নি।",

    recordExpense: "খরচ রেকর্ড করুন", expenseCategory: "ক্যাটাগরি", amount: "পরিমাণ",
    description: "বিবরণ", noExpensesYet: "এখনো কোনো খরচ রেকর্ড করা হয়নি।",
    rent: "ভাড়া", electricity: "বিদ্যুৎ", transport: "পরিবহন", salary: "বেতন",
    packaging: "প্যাকেজিং", maintenance: "রক্ষণাবেক্ষণ", food: "খাবার",

    recordIncome: "অন্যান্য আয় রেকর্ড করুন", noIncomeYet: "এখনো কোনো অন্যান্য আয় রেকর্ড করা হয়নি।",

    receive: "গ্রহণ", give: "প্রদান", ledgerFor: "খাতা", relatedPerson: "ব্যক্তি",
    noLedgerYet: "এখনো কোনো লেনদেন নেই।",

    dailyReport: "দৈনিক", weeklyReport: "সাপ্তাহিক", monthlyReport: "মাসিক", customRange: "কাস্টম সময়সীমা",
    topProducts: "শীর্ষ পণ্য", stockMovement: "স্টক আন্দোলন", transactionSummary: "লেনদেন সারাংশ",

    addReminder: "রিমাইন্ডার যোগ করুন", reminderTitle: "শিরোনাম", dueDate: "নির্ধারিত তারিখ",
    noRemindersYet: "এখনো কোনো রিমাইন্ডার নেই।", markDone: "সম্পন্ন চিহ্নিত করুন", callSupplier: "সরবরাহকারীকে কল করুন",
    restockItem: "আইটেম পুনরায় স্টক করুন", collectDue: "গ্রাহকের বাকি সংগ্রহ করুন", paySupplier: "সরবরাহকারীকে পরিশোধ করুন",

    businessProfile: "ব্যবসার প্রোফাইল", businessName: "ব্যবসার নাম", ownerName: "মালিকের নাম",
    language: "ভাষা", currency: "মুদ্রা", gstSettings: "জিএসটি সেটিংস", invoiceSettings: "চালান সেটিংস",
    paymentMethods: "পেমেন্ট পদ্ধতি", pinLock: "পিন লক", exportData: "ডেটা এক্সপোর্ট", importData: "ডেটা ইম্পোর্ট",
    whatsappTemplates: "হোয়াটসঅ্যাপ টেমপ্লেট", lowStockSettings: "কম স্টক সেটিংস", appearance: "চেহারা",
    resetData: "ডেটা রিসেট", enablePin: "পিন সক্ষম করুন", changePin: "পিন পরিবর্তন করুন", disablePin: "পিন নিষ্ক্রিয় করুন",
    gstBusiness: "জিএসটি নিবন্ধিত ব্যবসা", nonGst: "নন-জিএসটি ব্যবসা",
    darkMode: "ডার্ক মোড",

    save: "সংরক্ষণ", cancel: "বাতিল", delete: "মুছুন", edit: "সম্পাদনা", close: "বন্ধ", confirm: "নিশ্চিত করুন",
    yes: "হ্যাঁ", no: "না", back: "পেছনে", next: "পরবর্তী", done: "সম্পন্ন", skip: "এড়িয়ে যান", getStarted: "শুরু করুন",
    add: "যোগ করুন", update: "আপডেট", share: "শেয়ার", print: "প্রিন্ট", download: "ডাউনলোড", duplicate: "প্রতিলিপি",
    undo: "পূর্বাবস্থায় ফেরান", exportBackup: "ব্যাকআপ এক্সপোর্ট", importBackup: "ব্যাকআপ ইম্পোর্ট", exportCsv: "CSV এক্সপোর্ট",

    welcomeTitle: "কাকলি এন্টারপ্রাইজে স্বাগতম",
    shopReady: "আপনার দোকান প্রস্তুত।",
    dataStoredLocally: "আপনার ডেটা এই ডিভাইসে সংরক্ষিত আছে।",
    somethingWrong: "কিছু ভুল হয়েছে। আবার চেষ্টা করুন।",
    confirmDelete: "আপনি কি নিশ্চিত এটি মুছে ফেলতে চান? এটি পূর্বাবস্থায় ফেরানো যাবে না।",
    confirmReset: "এটি এই ডিভাইস থেকে সমস্ত ব্যবসার ডেটা স্থায়ীভাবে মুছে ফেলবে। এটি পূর্বাবস্থায় ফেরানো যাবে না।",
    restoreWarning: "এটি সমস্ত বর্তমান ডেটা ব্যাকআপ ফাইল দিয়ে প্রতিস্থাপন করবে। চালিয়ে যাবেন?",
    itemDeleted: "আইটেম মুছে ফেলা হয়েছে",
    savedSuccessfully: "সফলভাবে সংরক্ষিত হয়েছে",
    noResultsFound: "কোনো ফলাফল পাওয়া যায়নি",
    installAppTitle: "কাকলি এন্টারপ্রাইজ ইনস্টল করুন",
    installAppDesc: "দ্রুত অ্যাক্সেসের জন্য আপনার ফোনে ইনস্টল করুন, অফলাইনেও।",
    install: "ইনস্টল", notNow: "এখন নয়",
    enterPin: "আপনার পিন লিখুন",
    createPin: "৪-সংখ্যার পিন তৈরি করুন",
    confirmPin: "আপনার পিন নিশ্চিত করুন",
    wrongPin: "ভুল পিন। আবার চেষ্টা করুন।",
    forgotPin: "পিন ভুলে গেছেন? পুনরায় ইনস্টলের পর সেটিংস থেকে রিসেট করুন, অথবা ব্যাকআপ পুনরুদ্ধার করুন।",
    insightSalesHigher: "বিক্রয় গতকালের চেয়ে {pct}% বেশি।",
    insightSalesLower: "বিক্রয় গতকালের চেয়ে {pct}% কম।",
    insightLowStockPlural: "{n}টি পণ্যের স্টক কম।",
    insightLowStockSingle: "১টি পণ্যের স্টক কম।",
    insightCustomerDue: "গ্রাহকদের কাছ থেকে {amount} বাকি আছে।",
    insightSupplierDue: "সরবরাহকারীদের {amount} প্রদান করতে হবে।",
    insightTopProduct: "আজকের সর্বাধিক বিক্রিত পণ্য {name}।",
    insightHighExpense: "আজকের খরচ আপনার গড়ের চেয়ে বেশি।",
  },

  hi: {
    appName: "काकली एंटरप्राइज़",
    tagline: "अपनी दुकान की नोटबुक को एक सरल डिजिटल व्यवसाय प्रबंधन प्रणाली में बदलें।",
    dashboard: "डैशबोर्ड", sales: "बिक्री", products: "उत्पाद", khata: "खाता", more: "अधिक",
    purchases: "खरीद", customers: "ग्राहक", suppliers: "आपूर्तिकर्ता",
    expenses: "खर्च", income: "आय", payments: "भुगतान", reports: "रिपोर्ट",
    reminders: "रिमाइंडर", settings: "सेटिंग्स", search: "खोजें", about: "बारे में",
    newSale: "नई बिक्री", bills: "बिल", stock: "स्टॉक", backupRestore: "बैकअप और पुनर्स्थापना",

    today: "आज", yesterday: "कल", thisWeek: "इस सप्ताह", thisMonth: "इस महीने", custom: "कस्टम",
    salesLabel: "बिक्री", received: "प्राप्त", customerDue: "ग्राहक बकाया", supplierDue: "आपूर्तिकर्ता बकाया",
    net: "शुद्ध", profitEst: "लाभ (अनुमानित)",

    quickActions: "त्वरित कार्य",
    sale: "बिक्री", expense: "खर्च", purchase: "खरीद", customer: "ग्राहक",
    product: "उत्पाद", paymentReceived: "प्राप्त करें", paymentGiven: "दें",

    insights: "जानकारी",
    noInsightsYet: "अपने व्यवसाय की जानकारी देखने के लिए बिक्री रिकॉर्ड करना शुरू करें।",

    addProduct: "उत्पाद जोड़ें", editProduct: "उत्पाद संपादित करें", productName: "उत्पाद का नाम",
    sku: "SKU / कोड", category: "श्रेणी", purchasePrice: "खरीद मूल्य", sellPrice: "विक्रय मूल्य",
    currentStock: "वर्तमान स्टॉक", minStock: "न्यूनतम स्टॉक स्तर", unit: "इकाई", supplier: "आपूर्तिकर्ता",
    taxRate: "टैक्स / जीएसटी दर (%)", notes: "नोट्स", noProductsYet: "अभी तक कोई उत्पाद नहीं है।",
    addFirstProduct: "स्टॉक प्रबंधन शुरू करने के लिए अपना पहला उत्पाद जोड़ें।",
    lowStock: "कम स्टॉक", lowStockItems: "कम स्टॉक आइटम", outOfStock: "स्टॉक समाप्त",
    piece: "पीस", kg: "किलो", gram: "ग्राम", litre: "लीटर", meter: "मीटर", box: "बॉक्स", pack: "पैक", dozen: "दर्जन", other: "अन्य",

    addCustomer: "ग्राहक जोड़ें", editCustomer: "ग्राहक संपादित करें", customerName: "ग्राहक का नाम",
    phone: "फ़ोन", address: "पता", noCustomersYet: "अभी तक कोई ग्राहक नहीं है।",
    addCustomersHint: "भुगतान और बकाया पर नज़र रखने के लिए ग्राहक जोड़ें।",
    youWillReceive: "आपको मिलेगा", youWillGive: "आपको देना होगा", allSettled: "सब चुकता",

    addSupplier: "आपूर्तिकर्ता जोड़ें", editSupplier: "आपूर्तिकर्ता संपादित करें", supplierName: "आपूर्तिकर्ता का नाम",
    noSuppliersYet: "अभी तक कोई आपूर्तिकर्ता नहीं है।",

    cash: "नकद", upi: "यूपीआई", card: "कार्ड", bank: "बैंक",
    paid: "भुगतान किया गया", due: "बकाया", fullyPaid: "पूर्ण भुगतान", partiallyPaid: "आंशिक भुगतान",
    markDue: "बकाया के रूप में चिह्नित करें", selectCustomer: "ग्राहक चुनें", selectProduct: "उत्पाद चुनें",
    qty: "मात्रा", price: "मूल्य", discount: "छूट", tax: "टैक्स", subtotal: "उप-योग", total: "कुल",
    grandTotal: "कुल योग", addItem: "आइटम जोड़ें", saveBill: "बिल सहेजें", shareBill: "बिल साझा करें",
    printBill: "प्रिंट", downloadBill: "डाउनलोड", noSalesYet: "अभी तक कोई बिक्री नहीं है।",
    recordFirstSale: "अपनी पहली बिक्री रिकॉर्ड करें और आपका व्यवसाय डैशबोर्ड जीवंत हो जाएगा।",
    walkInCustomer: "सामान्य ग्राहक",

    recordPurchase: "खरीद रिकॉर्ड करें", noPurchasesYet: "अभी तक कोई खरीद रिकॉर्ड नहीं है।",

    recordExpense: "खर्च रिकॉर्ड करें", expenseCategory: "श्रेणी", amount: "राशि",
    description: "विवरण", noExpensesYet: "अभी तक कोई खर्च रिकॉर्ड नहीं है।",
    rent: "किराया", electricity: "बिजली", transport: "परिवहन", salary: "वेतन",
    packaging: "पैकेजिंग", maintenance: "रखरखाव", food: "भोजन",

    recordIncome: "अन्य आय रिकॉर्ड करें", noIncomeYet: "अभी तक कोई अन्य आय रिकॉर्ड नहीं है।",

    receive: "प्राप्त करें", give: "दें", ledgerFor: "खाता", relatedPerson: "व्यक्ति",
    noLedgerYet: "अभी तक कोई लेनदेन नहीं है।",

    dailyReport: "दैनिक", weeklyReport: "साप्ताहिक", monthlyReport: "मासिक", customRange: "कस्टम सीमा",
    topProducts: "शीर्ष उत्पाद", stockMovement: "स्टॉक मूवमेंट", transactionSummary: "लेनदेन सारांश",

    addReminder: "रिमाइंडर जोड़ें", reminderTitle: "शीर्षक", dueDate: "नियत तारीख",
    noRemindersYet: "अभी तक कोई रिमाइंडर नहीं है।", markDone: "पूर्ण चिह्नित करें", callSupplier: "आपूर्तिकर्ता को कॉल करें",
    restockItem: "आइटम पुनः स्टॉक करें", collectDue: "ग्राहक बकाया एकत्र करें", paySupplier: "आपूर्तिकर्ता को भुगतान करें",

    businessProfile: "व्यवसाय प्रोफ़ाइल", businessName: "व्यवसाय का नाम", ownerName: "मालिक का नाम",
    language: "भाषा", currency: "मुद्रा", gstSettings: "जीएसटी सेटिंग्स", invoiceSettings: "चालान सेटिंग्स",
    paymentMethods: "भुगतान के तरीके", pinLock: "पिन लॉक", exportData: "डेटा निर्यात", importData: "डेटा आयात",
    whatsappTemplates: "व्हाट्सएप टेम्पलेट", lowStockSettings: "कम स्टॉक सेटिंग्स", appearance: "रूप",
    resetData: "डेटा रीसेट", enablePin: "पिन सक्षम करें", changePin: "पिन बदलें", disablePin: "पिन अक्षम करें",
    gstBusiness: "जीएसटी पंजीकृत व्यवसाय", nonGst: "गैर-जीएसटी व्यवसाय",
    darkMode: "डार्क मोड",

    save: "सहेजें", cancel: "रद्द करें", delete: "हटाएं", edit: "संपादित करें", close: "बंद करें", confirm: "पुष्टि करें",
    yes: "हाँ", no: "नहीं", back: "पीछे", next: "अगला", done: "पूर्ण", skip: "छोड़ें", getStarted: "शुरू करें",
    add: "जोड़ें", update: "अपडेट", share: "साझा करें", print: "प्रिंट", download: "डाउनलोड", duplicate: "प्रतिलिपि",
    undo: "पूर्ववत करें", exportBackup: "बैकअप निर्यात", importBackup: "बैकअप आयात", exportCsv: "CSV निर्यात",

    welcomeTitle: "काकली एंटरप्राइज़ में आपका स्वागत है",
    shopReady: "आपकी दुकान तैयार है।",
    dataStoredLocally: "आपका डेटा इस डिवाइस पर संग्रहीत है।",
    somethingWrong: "कुछ गलत हो गया। कृपया पुनः प्रयास करें।",
    confirmDelete: "क्या आप वाकई इसे हटाना चाहते हैं? इसे पूर्ववत नहीं किया जा सकता।",
    confirmReset: "यह इस डिवाइस से सभी व्यावसायिक डेटा को स्थायी रूप से हटा देगा। इसे पूर्ववत नहीं किया जा सकता।",
    restoreWarning: "यह सभी मौजूदा डेटा को बैकअप फ़ाइल से बदल देगा। जारी रखें?",
    itemDeleted: "आइटम हटा दिया गया",
    savedSuccessfully: "सफलतापूर्वक सहेजा गया",
    noResultsFound: "कोई परिणाम नहीं मिला",
    installAppTitle: "काकली एंटरप्राइज़ इंस्टॉल करें",
    installAppDesc: "तेज़ पहुंच के लिए अपने फोन पर इंस्टॉल करें, ऑफ़लाइन भी।",
    install: "इंस्टॉल करें", notNow: "अभी नहीं",
    enterPin: "अपना पिन दर्ज करें",
    createPin: "4 अंकों का पिन बनाएं",
    confirmPin: "अपने पिन की पुष्टि करें",
    wrongPin: "गलत पिन। पुनः प्रयास करें।",
    forgotPin: "पिन भूल गए? पुनः इंस्टॉल के बाद सेटिंग्स से रीसेट करें, या बैकअप पुनर्स्थापित करें।",
    insightSalesHigher: "बिक्री कल से {pct}% अधिक है।",
    insightSalesLower: "बिक्री कल से {pct}% कम है।",
    insightLowStockPlural: "{n} उत्पादों का स्टॉक कम है।",
    insightLowStockSingle: "1 उत्पाद का स्टॉक कम है।",
    insightCustomerDue: "ग्राहकों से {amount} बकाया है।",
    insightSupplierDue: "आपूर्तिकर्ताओं को {amount} देना बाकी है।",
    insightTopProduct: "आज का सबसे ज़्यादा बिकने वाला उत्पाद {name} है।",
    insightHighExpense: "आज का खर्च आपके औसत से अधिक है।",
  },
};

let currentLang = 'en';

function t(key) {
  return (I18N[currentLang] && I18N[currentLang][key]) || I18N.en[key] || key;
}

function setLang(lang) {
  currentLang = I18N[lang] ? lang : 'en';
  document.documentElement.setAttribute('lang', currentLang);
}
