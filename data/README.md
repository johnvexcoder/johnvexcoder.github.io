# Approved client testimonials

`testimonials.json` is the public, manually approved source for the portfolio carousel. It starts as `[]` because no client review has been approved for publication yet. Never add a reviewer's private email address to this file.

1. A client submits the **Leave a Review** form. Web3Forms emails the submission privately; it does not edit this repository.
2. Verify the person and review, and confirm that the submission grants permission to publish.
3. Add an object to `testimonials.json` with `name`, `rating` (integer 1–5), and `review` (20–600 characters). Optional public fields: `role`, `company`, `project`, `date`, `projectUrl`, and `avatar`. Use a same-site URL for `avatar` or omit it to show initials. Do not include `email`.
4. Commit and push the change. GitHub Pages then serves the approved review automatically.

Example shape (illustrative only; do **not** publish as a real review):

```json
{
  "name": "Client Name",
  "role": "Business Owner",
  "company": "Business Name",
  "project": "Business Website",
  "rating": 5,
  "review": "Replace this sample with the client's verified, approved review.",
  "date": "September 2026",
  "projectUrl": "https://example.com/",
  "avatar": ""
}
```

The review form uses the public Web3Forms access key embedded in `index.html`, its free hCaptcha widget, and a browser `fetch` request. In the Web3Forms dashboard, open this form and set **hCaptcha** as its preferred captcha so that verification is required server-side. The portfolio also checks for a completed hCaptcha before sending.
