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


Save + Download Options

↳ Stored in Secure User Account

↳ Track under "Document History"

↓

Monthly Limit Check (based on plan)

↳ Notify if limit reached

↓

Log Activity + Timestamped

```

- 🔐 **Authentication**
  - Register & Login with JWT
  - Password reset via email (secure token)
  - Active session control (prevents multiple logins)
- **Forgot Password + Reset Password**
  - Users can reset password via email
  - Secure reset tokens (15 min expiry)
  - Email delivery handled with **Nodemailer + Gmail App Passwords**

- **Role-based Access**
  - Normal users: Access modules based on subscription
  - Admin: Can lock/unlock templates, manage users, and monitor document generation

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
    
- 🤖 **Gemini AI Integration (Core Engine)**

  PharmaDocs integrates Google’s Gemini AI to power intelligent automation:
  
  STP Parsing
  Reads uploaded Standard Testing Procedure (Word doc) and extracts key sections.
  
  Raw Data Analysis
  Processes uploaded CSV/Excel to calculate:
  
  Mean
  
  %RSD
  
  Linearity
  
  Graphs and Plots
  
  Compliance Alignment
  Suggests compliance with Pharmacopeias (USP/IP/BP)
  Flags missing/misaligned fields in reports.
  
  Template Mapping
  Auto-fills user’s chosen template (Protocol / Report / Raw Data Sheet) with structured data.
  
  AI-powered Error Detection
  Highlights inconsistencies (e.g., missing reviewer, wrong units).
  
  Preview before Commit
  AI-generated draft is shown to the user for review & editing before final generation.
  
- 📝 **Document Creation Workflow (with Gemini AI)**
  
  Select Module (e.g., AMV, Stability, PV)
  
  Upload Inputs (STP file, Raw Data, Company Info)
  
  Gemini AI Activated 🧠
  
  Extracts & maps data
  
  Auto-calculates stats
  
  Aligns with pharmacopeia standards
  
  Flags errors
  
  Preview Document (Word/PDF/Excel + Charts)
  
  Commit & Save → Stored in user history

- 💳 **Subscription Management**
  - **Basic Plan (₹2999/month)**
  - Access to **1 module only (AMV or Stability)**
  - **20 document downloads per month**
  - Single user session  

  - **Pro Plan (₹5999/month)**
  - Full access to all modules
  - Higher document limits
  - Single user session  

  - **Enterprise Plan (Custom Pricing)**
  - All Pro features
  - **Multi-user team access**
  - **Custom branding**
  - Admin can manage users under enterprise
    
⚙️ **Admin Panel Features**
- Manage users & subscriptions  
- Monitor document generation statistics  
- View uploaded documents  
- Approve or lock advanced templates  
- Enforce session control (logout a user)  


---

## 🛠 Tech Stack

- **Frontend**: React.js, TailwindCSS, Axios, React Router
- **Backend**: Node.js, Express.js, JWT, Multer, Bcrypt.js
- **Database**: MongoDB (Mongoose)
- **Payment**:Stripe 
- **Email Service**: Nodemailer (Gmail with App Passwords)
- **Authentication**: JWT-based auth with middleware

---
## Screenshots
<img width="1920" height="950" alt="Screenshot 2025-09-04 220554" src="https://github.com/user-attachments/assets/0074e18f-317a-4a65-9a8b-2ef970c44dec" />
<img width="1920" height="968" alt="Screenshot 2025-09-04 220803" src="https://github.com/user-attachments/assets/b6c1a43a-1fec-4821-b4a4-3b38aac06314" />
<img width="1920" height="972" alt="Screenshot 2025-09-04 221023" src="https://github.com/user-attachments/assets/b78201e2-4d14-4cf1-aee7-82ebf68aeb6f" />
<img width="1920" height="982" alt="Screenshot 2025-09-04 220954" src="https://github.com/user-attachments/assets/0fbf3695-27b9-41be-85fc-4345a24320d2" />
<img width="1920" height="966" alt="Screenshot 2025-09-04 221049" src="https://github.com/user-attachments/assets/57502292-6790-42c9-b4ba-4c110a164e49" />
<img width="1920" height="1020" alt="Screenshot 2025-09-04 221257" src="https://github.com/user-attachments/assets/d00fed74-9cca-4722-8b1f-0d1b7434e714" />





