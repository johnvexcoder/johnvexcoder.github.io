"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
const HCaptcha = dynamic(() => import("@hcaptcha/react-hcaptcha"), {
  ssr: false,
  loading: () => <p className="captcha-note">Preparing verification…</p>,
});
/** All widgets share the official loader; no second Web3Forms proxy/SDK script. */
export default function FormCaptcha({
  resetKey,
  onVerify,
  onExpire,
  onError,
  onOpen,
  onClose,
}: {
  resetKey: number;
  onVerify: (token: string) => void;
  onExpire: () => void;
  onError: () => void;
  onOpen?: () => void;
  onClose?: () => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!root.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "240px" },
    );
    observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={root}
      className="captcha"
      tabIndex={-1}
      aria-label="Spam verification"
    >
      {visible ? (
        <HCaptcha
          key={resetKey}
          sitekey="50b2fe65-b00b-4b9e-ad62-3ba471098be2"
          reCaptchaCompat={false}
          cleanup={false}
          theme="dark"
          onVerify={(token) => {
            onClose?.();
            onVerify(token);
          }}
          onExpire={onExpire}
          onChalExpired={() => {
            onClose?.();
            onExpire();
          }}
          onError={() => {
            onClose?.();
            onError();
          }}
          onOpen={onOpen}
          onClose={onClose}
        />
      ) : (
        <p className="captcha-note">Verification loads here before sending.</p>
      )}
    </div>
  );
}
