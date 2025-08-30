# 💊 PharmaDocsAI

PharmaDocsAI is a **MERN-stack application** built for managing pharmaceutical documents like STPs, AMVs, stability records, raw data, and more.  
It supports **user authentication, subscriptions, password reset, secure document creation, and role-based module access**.

---

## 🚀 Features
## Dashboard View ##
```

↳ [Select Module]

• AMV

  • PV

  • Stability

  • Degradation

  • Raw Data Templates

↓

Select: "Create New Document"

↓

Upload Inputs:

↳ Company Header Info (Logo, Name, Address, Date)

↳ Footer Info (Reviewer, Checker, Analyst)

↳ Standard Testing Procedure (STP) File (Word)

↳ Raw Data (CSV/Excel)

↓

Choose Document Type:

↳ Protocol / Report / Raw Data Sheet

↓

AI Engine Activated 🧠

↳ Extracts and maps data to selected template

↳ Auto-fills compliance sections

↳ Auto-calculates: Mean, %RSD, Linearity, etc.

↳ Suggests Pharmacopeia Alignment (USP/IP/BP)

↳ Flags Missing Fields or Errors

↓

Auto-Generate:

↳ Word + PDF of Report

↳ Excel Raw Data Sheet

↳ Graphs and Plots (if needed)

↓

Preview Document(s)

↳ Accept or Edit Fields

↓

Save + Download Options

↳ Stored in Secure User Account

↳ Track under "Document History"

↓

Monthly Limit Check (based on plan)

↳ Notify if limit reached

↓

Log Activity + Timestamped

↓ dashboard view module selection to create new document is this what we have build tillor wodee have to add module selection if so please give step by step code

```

- 🔐 **Authentication**
  - Register & Login with JWT
  - Password reset via email (secure token)
  - Active session control (prevents multiple logins)

- 📚 **Modules by Subscription**
  - **Basic Plan**: AMV, Stability
  - **Pro Plan**: AMV, Stability, PV, Degradation, Raw Data Templates
  - **Enterprise Plan**: All Pro features + team features

- 📝 **Document Features**
  - Create & Preview documents
  - Document history with logging
  - Template locking (Admin only)

- 📤 **File Upload**
  - STP Upload
  - Raw Data Upload

- 💳 **Subscription Management**
  - Switch between Basic, Pro, Enterprise
  - Module availability changes automatically

- 🌐 **Frontend**
  - Professional UI with TailwindCSS
  - Homepage with Navbar, Banner, Slider, Footer
  - About & Contact Us pages
  - Protected routes (Dashboard, Modules, etc.)

---

## 🛠 Tech Stack

- **Frontend**: React.js, TailwindCSS, Axios, React Router
- **Backend**: Node.js, Express.js, JWT, Multer, Bcrypt.js
- **Database**: MongoDB (Mongoose)
- **Email Service**: Nodemailer (Gmail with App Passwords)
- **Authentication**: JWT-based auth with middleware

---

