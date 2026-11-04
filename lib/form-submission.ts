export const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
export type FormResult =
  | { kind: "success" }
  | { kind: "error"; message: string };
/** Browser-only public-key integration. Acceptance is not proof of inbox delivery. */
export async function submitWeb3Form(
  data: FormData,
  request: typeof fetch = fetch,
): Promise<FormResult> {
  if (!String(data.get("h-captcha-response") || "").trim())
    return {
      kind: "error",
      message: "Complete the verification before submitting.",
    };
  if (data.get("botcheck"))
    return {
      kind: "error",
      message: "Please leave the extra verification field empty.",
    };
  try {
    const response = await request(WEB3FORMS_ENDPOINT, {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" },
      redirect: "error",
      signal: AbortSignal.timeout(25000),
    });
    if (!(response.headers.get("content-type") || "").includes("json"))
      return {
        kind: "error",
        message:
          "The service returned an unexpected response. Your entries are still here; contact me by email before trying again.",
      };
    const body: unknown = await response.json();
    const record =
      body && typeof body === "object" ? (body as Record<string, unknown>) : {};
    if (response.ok && record.success === true) return { kind: "success" };
    if (response.status === 429)
      return {
        kind: "error",
        message:
          "The form has reached a temporary sending limit. Your entries are still here; please wait before trying again, or contact me by email.",
      };
    const nested =
      record.body && typeof record.body === "object"
        ? (record.body as Record<string, unknown>)
        : {};
    const message = [record.message, nested.message]
      .filter((v) => typeof v === "string")
      .join(" ");
    if (/captcha|verification|challenge/i.test(message))
      return {
        kind: "error",
        message:
          "Verification was not accepted. Complete a fresh verification and try again. Your entries are still here.",
      };
    return {
      kind: "error",
      message:
        response.status >= 500
          ? "The message service is temporarily unavailable. Your entries are still here; please try later or contact me by email."
          : "Your submission was not accepted. Your entries are still here; complete a fresh verification to retry, or contact me by email.",
    };
  } catch {
    // A lost response may follow an accepted send. Never repeat a request automatically.
    return {
      kind: "error",
      message:
        "We couldn’t confirm acceptance. Your entries are still here. Check your connection, or contact me by email before sending again.",
    };
  }
}
export function prepareForm(
  data: FormData,
  accessKey: string,
  token: string,
  workflow: "contact" | "review",
) {
  const payload = new FormData();
  for (const [key, value] of data) payload.append(key, value);
  payload.set("access_key", accessKey);
  payload.set("h-captcha-response", token);
  payload.set("from_name", "J0hnvexcoder Portfolio");
  payload.set("replyto", String(data.get("email") || "").trim());
  payload.set("workflow", workflow);
  return payload;
}
