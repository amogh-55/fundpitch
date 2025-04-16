FundPitch is a real-time collaboration and funding platform designed to bridge the gap between startup founders and essential collaborators — from investors and advisors to consultants and service providers.

This platform enables early-stage startups to showcase their ideas, connect with relevant stakeholders, and initiate funding or advisory conversations in a streamlined and organized manner.

The core features include Expressions — a dynamic system that allows collaborators to express interest in real-time, send offers, or even record and send personalized audio messages; a secure document sharing system for uploading pitch decks, term sheets, and business plans; and a live collaboration dashboard to track engagement and maintain transparent communication.

Stakeholders can manage access levels, track touchpoints, and engage in structured interactions — all from one place.

---

## 🔧 Tech Stack

- **Frontend**: Next.js  
- **Styling**: Tailwind CSS  
- **Backend**: PostgreSQL  
- **ORMs**: Prisma, Drizzle  
- **Authentication**: NextAuth.js  
- **Email Services**: Amazon SES, Brevo SMTP  
- **File Storage**: Cloudflare R2  
- **Messaging Service**: mTalkz WhatsApp API  

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed on your machine:

- Node.js  
- pnpm (preferred) or npm  
- Any code editor (e.g., VS Code)

---

## 🚀 Installation and Setup

Clone the repository:

```bash
git clone https://github.com/your-username/fundpitch.git
cd fundpitch
```

Install dependencies using **pnpm**:

```bash
pnpm i
```

If `pnpm` is not installed, use **npm**:

```bash
npm install
```

Start the development server:

```bash
pnpm run dev
```

Or with npm:

```bash
npm run dev
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory and provide the following environment variables. Replace placeholder values with your actual credentials:

### PostgreSQL Database

```env
DATABASE_URL="postgresql://your_user:your_password@your_host/your_database"
```

### Amazon SES (for emails)

```env
SES_USER=your_ses_user
SES_PASSWORD=your_ses_password
```

### Cloudflare R2 (for file storage)

```env
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key_id
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_key
CLOUDFLARE_R2_ENDPOINT=your_endpoint_url
```

### mTalkz WhatsApp Messaging

```env
MTALKZ_API_KEY=your_mtalkz_api_key
WAP_SENDER_PHONE=your_registered_whatsapp_number
WAP_SENDER_NAME=your_business_name
WAP_KEY=your_wap_key
WAP_URL=your_wap_url
```

### Brevo SMTP

```env
BREVO_USER=your_email
BREVO_PASSWORD=your_brevo_password
```

> ⚠️ **Note**: After updating the `.env` file, restart your development server for the changes to take effect.

---

## 📄 License

This project is licensed under the **MIT License**.

---

Let me know if you’d like to include sections for features, usage, deployment, contribution guidelines, or screenshots!
