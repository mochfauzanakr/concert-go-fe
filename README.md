Lihat [daftar perubahan FE](docs/FRONTEND_FEATURES.md) dan [aturan satu fitur satu commit](CONTRIBUTING.md).

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Interactive frontend demo

The admin, user, and STAFF features work with local demo data and do not require or modify
the Go backend. Open `/` and use the Demo user, Demo admin, or Scanner STAFF buttons.

| Area | Routes and supported actions |
| --- | --- |
| Admin | `/admin/dashboard`: live demo metrics and confirmed demo reset |
| Users | `/admin/dashboard/users`: search/filter, detail, suspend/reactivate with reasons |
| Invitations | `/admin/dashboard/invitations`: role rules, duplicate checks, resend/token rotation, cancel, one-time activation |
| Events | `/admin/dashboard/events/approval` and `/admin/dashboard/concerts`: approve/reject with reasons, change schedule/venue, cancel an event |
| Transactions | `/admin/dashboard/finance/transactions` and its `/:id` details: shared checkout orders, payment status, issued tickets, history |
| Audit | `/admin/dashboard/activity`: searchable activity history and CSV export |
| Support | `/admin/dashboard/system/help` and `/user/help`: shared user/admin conversation, replies, resolve/reopen |
| Catalog | `/user/events` and `/:id`: city/search/sort, lineup, rundown, venue, terms and ticket availability |
| Checkout | `/user/checkout?event=...`: ticket tier, quantity, contact details, fees and payment-method selection |
| Orders | `/user/orders` and `/:id`: search/filter, 30-minute reservation, payment simulation and cancellation |
| Tickets | `/user/tickets` and `/:id`: actual QR generation, SVG download, print, used/unused status |
| Notifications | `/user/notifications`: category/unread filters, mark read, action links |
| Security | `/user/security`: demo device sessions, revoke one/all other sessions |
| Gate | `/staff/scanner`: camera QR decoding or manual code, event matching and rejection of repeated entry |

Demo data is persisted under `concertgo-interactive-demo-v1` in localStorage and synchronized
between tabs on the same origin. Only demo data is reset by the dashboard reset button; real
profiles and authentication tokens are preserved. Invitation activation validates a sample
password but never stores it. Invitations/QR codes exist only inside this browser demo.
No payments, emails, SMS, or real account restrictions are performed.

Use a sample ticket code `CG-DEMO-TICKET-001` with the first published event to try gate entry.
For the complete journey: select an event → checkout → simulate payment → open e-ticket →
copy its code → validate in the STAFF scanner → try scanning again to see duplicate rejection.
Camera scanning needs a browser with camera permission on localhost or HTTPS; manual entry
remains available when a camera is missing or permission is denied.

Validation commands:

```powershell
npm run test:demo
npm run test:auth
npm run build
```

Browser tests use Playwright Chromium. Install it once with
`npx playwright install chromium` (set `PLAYWRIGHT_BROWSERS_PATH=.next/playwright-browsers`
to use the workspace-local browser cache). With the frontend running, set
`DEMO_BASE_URL=http://localhost:3100` and run `npm run test:e2e`.
The suite covers complete workflows, persistence, viewport widths 360/390/1440,
mobile navigation, screenshots, and JavaScript runtime errors.

### Connect to the existing backend

The frontend uses the original backend API without modifying backend files or database settings.
Copy `.env.example` to `.env.local` and set `BACKEND_URL` to the running backend address supplied
by its owner. Both `http://server:8080` and `http://server:8080/api` are accepted. The default is
`http://127.0.0.1:8080`. Keep `NEXT_PUBLIC_API_URL=/api` so requests use the frontend's server-side proxy.
Restart the frontend after changing `.env.local`; a rebuild is not needed for `BACKEND_URL`.

For browsing without development compilation, run:

```powershell
npm install
npm run preview
```

This builds once and starts at `http://localhost:3100`. After a successful build, `npm start`
starts the same build directly. `npm run dev` enables hot reload at the same port; run one
server at a time. Production uses `.next-production` and development uses `.next` so they do
not overwrite each other's build output. Port 3000 is not used by this project.

Check `http://localhost:3100/api/connection` for frontend-to-backend connectivity. This frontend
endpoint probes the original `/api/roles` endpoint and reports 503 when the backend cannot be reached.
An accessible frontend page alone does not confirm the backend or its database is working.

Registration calls `/auth/register`, then `/auth/verify-otp` with `{email, otp}`. The backend has
no dedicated resend endpoint, so resending repeats registration with the pending form values held
only in memory. After a page reload, fill in registration again to request a new code. Password
recovery uses the existing backend endpoints; email delivery follows its existing SMTP configuration.
`/invite-user` now opens the frontend demo invitation flow. `/accept-invite?token=...` handles local
demo tokens; other tokens retain the existing backend activation flow. The original invitation email
contains a relative path; open that path on the frontend origin.

Google login follows the backend's existing redirect configuration. `/auth/callback` can complete
login when that configuration already sends the authorization code and state to this frontend page.
If the configured callback goes directly to the backend, it returns JSON there; this frontend does
not alter the backend or its Google configuration to change that behavior.

Run `npm run test:auth` to test the frontend contracts and proxy against an HTTP fixture.
These tests do not verify connectivity to the real backend or database.

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3100](http://localhost:3100) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
