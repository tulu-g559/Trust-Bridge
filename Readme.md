# TrustBridge

![Frontend](https://img.shields.io/badge/Frontend-React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Backend](https://img.shields.io/badge/Backend-Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![Firebase](https://img.shields.io/badge/Auth_&_DB-Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Web3](https://img.shields.io/badge/Wallet-Wagmi_%2B_Viem-36B37E?style=for-the-badge&logo=ethereum&logoColor=white)
![AI](https://img.shields.io/badge/AI-Gemini-8E75B2?style=for-the-badge&logo=google%20gemini&logoColor=white)

**Reimagining Trust. Unlocking Opportunities.**
*A decentralized, AI-powered lending protocol bridging the gap between underserved borrowers and global liquidity.*

---

## 🚀 What is TrustBridge?

TrustBridge is a **P2P micro-lending platform** that eliminates the need for traditional credit scores. By leveraging **Generative AI (Gemini)** for alternative data analysis and **Web3** for settlement, we create verifiable on-chain reputations (**TrustScores**) from off-chain real-world assets (utility bills, tax returns, government IDs).

We empower individuals to own their financial identity and provide lenders with transparent, high-yield opportunities in a permissionless environment.

---

## 🌍 Core Ecosystem

Traditional banking excludes millions due to lack of formal credit history. TrustBridge solves the trilemma of **Identity, Trust, and Access**:

### 🤖 1. AI-Native Verification
* **Document Vision:** Uses `Gemini 1.5 Flash` to extract financial health indicators from non-standard documents (ITR, Gas/Electricity Bills, Rent Receipts).
* **Biometric Liveness:** Compares live camera selfies with government ID (PAN/Aadhaar) to prevent fraud using advanced computer vision.

### ⛓️ 2. Decentralized Settlement
* **Smart Contract Escrow:** Loans are requested, funded, and repaid directly on the **Sepolia Testnet**, ensuring immutability.
* **Web3 Integration:** Seamless wallet connection via **Wagmi + RainbowKit** creates a frictionless "Login with Ethereum" experience.

### 📊 3. The TrustScore Protocol
* **Dynamic Reputation:** A 0-100 score calculated in real-time based on verified identity (+15 pts), financial doc validity (+60 pts), and on-chain repayment history (+25 pts).
* **Portable Identity:** Your score lives on-chain, allowing you to carry your reputation across the DeFi ecosystem.

### 🔐 4. Enterprise-Grade Security
* **Hybrid RBAC:** Strict separation between **Borrower** (Request/Repay) and **Lender** (Invest/Track) dashboards using Firebase Auth + Custom Claims.
* **Secure Storage:** Sensitive PII is encrypted and stored off-chain (Cloudinary/Firestore), while only transaction hashes and scores are committed to the blockchain.
---

## 🛠 Tech Stack

### ⚙️ Frontend
- React (Vite)
- Tailwind CSS
- Wagmi + Viem (Ethereum wallet integration)

### ⚙️ Backend
- Flask (Python REST API)
- Firebase (Authentication + Firestore)

### ⚙️ AI Integration
- Gemini Vision – document parsing
- Gemini 2.5 Flash – TrustScore computation

### ⚙️ Blockchain
- Ethereum Sepolia Testnet
- Wagmi library (wallet connection)
- ⚠️ No smart contracts in MVP — payments are simulated

---

## 📊 Features

### ✅ TrustScore Generation
- Upload income or bill documents (PDF/images)
- AI extracts data and computes a score (0–100)
- Score improves with on-time repayments

### 👤 Borrower Workflow
1. Sign up and upload KYC
2. Get TrustScore
3. Apply for loan
4. Receive ETH via Sepolia wallet
5. Repay within 30 days

### 🧑‍💼 Lender Workflow
1. Register and post loan offers
2. Review borrower requests and TrustScore
3. Approve or reject requests
4. Access documents if borrower defaults (after 2+ months)

---

## 📸 Screenshots  

| **Home Page** | **Dashboard** | **Trust Score Calculation** | **Profile** |
|:------------:|:------------:|:------------:|:------------:|
| ![Home](https://github.com/user-attachments/assets/559d0609-a958-4f58-ae53-caec6729e133) | ![Dashboard](https://github.com/user-attachments/assets/d5ffff21-d624-40a1-92b4-f61798fbbb41) | ![Trust Score Calculation](https://github.com/user-attachments/assets/2421ad54-1b96-4409-a11a-f7d51db0d6ad) | ![Dashboard](https://github.com/user-attachments/assets/dce9cef9-7f70-4699-a723-58a331b48e94)


## 🔒 Privacy & Security

- 🔐 KYC and loan data stored in Firestore (not on-chain)
- 🔐 AI scoring processed server-side
- 🔐 Borrower docs shared only after default

---

## 🔁 User Journey

### Borrower:
`Register → Upload Docs → Get TrustScore → Apply for Loan → Connect Wallet → Receive ETH → Repay`

### Lender:
`Register → Post Offer → View Requests → Review TrustScore → Approve/Reject → Track Loan`

---

## 🧪 API Endpoints

### 📄 Document Parsing
- `POST /vision/first-trustscore` – Upload docs and generate TrustScore

### 📈 Trust Score Update
- `POST /trustscore/update/<uid>` – Update score post-repayment

### 💸 Loan Routes
- `POST /loan/request` – Request a loan
- `GET /loan/user/<uid>` – Fetch all user loans
- `GET /loan/status/<uid>/<loan_id>` – Get loan status
- `POST /loan/decision/<uid>/<loan_id>` – Lender approves/rejects

### 🏦 Lender Routes
- `POST /lender/register` – Register lender
- `POST /lender/offer` – Post a loan offer
- `GET /lender/offers/<uid>` – View own offers
- `GET /lender/borrowers` – View pending borrowers

---

## 🗂 Firestore Structure

```
users/
  └── {uid}/
        ├── loans/             # Subcollection: stores all loans requested by this borrower
        │     └── {loan_id}    # Individual loan documents with amount, purpose, status, etc.
        ├── trust_score/       # Subcollection: stores TrustScore records
        │     └── {score_id}   # Contains score value, explanation, and timestamp
        └── profile/           # Subcollection (or a document if simpler)
              └── metadata     # Contains user info like name, email, KYC flags, wallet

```
```
lenders/
  └── {lender_id}/
        ├── info/              # Subcollection: stores registration info of the lender
        │     └── metadata     # Contains PAN, interest preference, email, phone, etc.
        └── offers/            # Subcollection: list of loan offers posted
              └── {offer_id}   # Offer details like max amount, interest rate, wallet, etc.

```

---

## 🚀 Deployment

- **Frontend**: Vercel
- **Backend**: Render
- **Testing**: Firebase Emulator + SepoliaETH

---

## 🧠 Future Vision

- NFT-based identity badges
- Full loan escrow via smart contracts
- Android-first mobile app
- Real-world pilot (e.g., rural areas)

---

## 📮 Contact

- 📧 Email: [Arnab Ghosh](garnab559@gmail.com)
- 🤝 LinkdIn: [Arnab Ghosh](https://www.linkedin.com/in/arnab-g)
- 🛠 GitHub: [Trust-Bridge](https://github.com/tulu-g559/Trust-Bridge)
- 💬 Discord: *Coming Soon*
