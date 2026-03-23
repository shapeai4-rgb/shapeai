# TEST-MODE QA

## WITHOUT_PAYMENT=true
1. Set `WITHOUT_PAYMENT=true` in `.env`.
2. Start the app with `npm run dev`.
3. Register a new account with a real test inbox.
4. Confirm the welcome email appears in the inbox and in the Resend dashboard logs.
5. Sign in and buy any token pack.
6. Confirm the dashboard balance increases immediately after the redirect.
7. Confirm the invoice email arrives in the inbox.
8. Open the invoice email attachment and confirm it is a PDF invoice.

## WITHOUT_PAYMENT=false
1. Set `WITHOUT_PAYMENT=false` in `.env`.
2. Restart the app.
3. Sign in with a test account.
4. Start a token purchase and complete it through the Transfermit sandbox.
5. Confirm the token balance does not change before payment success.
6. Confirm the successful webhook credits the tokens.
7. Confirm the invoice email arrives only after the success webhook.
8. Replay the success webhook and confirm no duplicate tokens or duplicate invoice are created.
