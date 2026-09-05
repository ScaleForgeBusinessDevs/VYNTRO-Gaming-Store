# 🛡️ VYNTRO Admin Dashboard — Access & Credential Instructions

This document provides instructions on how to access the VYNTRO Admin Dashboard, create new admin accounts, and reset or manage passwords.

---

## 1. How to Access the Admin Dashboard

The admin login button has been **completely removed from the public storefront navbar** so that ordinary visitors cannot see or access it.

To access the admin dashboard, open your browser and directly type the URL:

- **Direct Admin URL:**  
  [http://localhost:3000/admin](http://localhost:3000/admin) (or `https://yourdomain.com/admin` in production)
- **Direct Login URL:**  
  [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

> **Note:** If you are not currently signed in, visiting `/admin` will automatically redirect you to `/admin/login`.

---

## 2. How to Create a New Admin Account

All demo bypasses and hardcoded passwords have been removed. You must log in with a genuine Supabase-authenticated admin account.

### Method A: Using the CLI Script (Fastest & Recommended)

We have provided a built-in credentials management tool in your project. Open your terminal in the project root and run:

```bash
node scripts/admin-user.mjs create <your-email> <your-password>
```

**Example:**
```bash
node scripts/admin-user.mjs create admin@vyntro.com SuperSecretPassword2026!
```

**Output:**
```
🛡️  VYNTRO Admin Credentials Manager
====================================
⏳ Creating user: admin@vyntro.com...
✅ Admin user created successfully!
   Email: admin@vyntro.com
   User ID: a1b2c3d4-...

You can now log in at: http://localhost:3000/admin/login
```

*This command automatically confirms the email address, allowing you to log in immediately without waiting for confirmation emails.*

---

### Method B: Via Supabase Web Dashboard

1. Open your Supabase Dashboard:
   [https://supabase.com/dashboard/project/yjesqvzwugzdtkjjqcew/auth/users](https://supabase.com/dashboard/project/yjesqvzwugzdtkjjqcew/auth/users)
2. In the left sidebar, navigate to **Authentication** → **Users**.
3. Click the **Add user** button in the top right and select **Create user**.
4. Enter your desired **Email** and **Password**.
5. Ensure **"Auto Confirm User?"** is checked (`ON`).
6. Click **Create user**.
7. Navigate to `http://localhost:3000/admin/login` and sign in.

---

## 3. How to Reset or Change an Admin Password

### Method A: Using the CLI Script (Instant — No Email Required)

If you forgot your password or wish to update it immediately from the terminal:

```bash
node scripts/admin-user.mjs reset <your-email> <new-password>
```

**Example:**
```bash
node scripts/admin-user.mjs reset admin@vyntro.com BrandNewPassword2026!
```

**Output:**
```
🛡️  VYNTRO Admin Credentials Manager
====================================
⏳ Searching for user: admin@vyntro.com...
✅ Password reset successfully for: admin@vyntro.com
You can now log in with your new password at: http://localhost:3000/admin/login
```

---

### Method B: Via the Admin Login Screen ("Forgot Password?")

1. Navigate to: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
2. Click the **Forgot Password?** link above the password input.
3. Enter your registered email address and click **Send Recovery Link →**.
4. Check your inbox for the password reset email sent from Supabase.
5. Click the link to be directed to `/admin/reset-password`, where you can enter and save your new password.

*(Note: Email sending requires SMTP/Email provider configuration in your Supabase Auth settings).*

---

### Method C: Via Supabase Dashboard

1. Go to [Supabase Authentication → Users](https://supabase.com/dashboard/project/yjesqvzwugzdtkjjqcew/auth/users).
2. Find your admin email in the list.
3. Click the three dots menu (**`···`**) on the right of the row.
4. Select **Send password reset** (or delete and recreate the account with a new password).

---

## 4. Managing Admin Users (CLI Utility Summary)

| Action | Terminal Command |
| :--- | :--- |
| **List All Users** | `node scripts/admin-user.mjs list` |
| **Create User** | `node scripts/admin-user.mjs create <email> <password>` |
| **Reset Password** | `node scripts/admin-user.mjs reset <email> <newPassword>` |
| **Delete User** | `node scripts/admin-user.mjs delete <email>` |

---

## 5. Security & Session Handling

- **Protected Routes:** All routes under `/admin/*` (except `/admin/login` and `/admin/reset-password`) are strictly guarded by Next.js middleware and verify active authentication tokens.
- **Session Duration:** Once authenticated, your session is stored securely in an encrypted cookie valid for 24 hours.
- **Logging Out:** To end your session, click the **Log Out** button at the bottom of the Admin Sidebar. This immediately clears your browser session cookie and terminates the Supabase auth session.
