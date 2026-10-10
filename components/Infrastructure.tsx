"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Server, HardDrive, Layers, Network } from "lucide-react";
import { profile } from "@/lib/content";
import Reveal from "./Reveal";
const tabs = [
  ["host", "Proxmox host", Server],
  ["guests", "Virtual machines", Layers],
  ["services", "Service layer", Network],
  ["backup", "Storage & backup", HardDrive],
] as const;
const services = [
  "Jellyfin",
  "Uptime Kuma",
  "MovieFlix",
  "Nexora Lab",
  "Plex",
  "AdGuard Home",
  "NFS",
  "LibrePhotos",
  "Home Assistant",
  "Nexora Agent",
];
export default function Infrastructure() {
  const [active, setActive] = useState("host");
  const item = profile.lab.find((l) => l.id === active)!;
  return (
    <section id="homelab" className="section infrastructure">
      <Reveal className="section-heading">
        <div>
          <p className="eyebrow">04 / INFRASTRUCTURE IN PRACTICE</p>
          <h2>
            The system
            <br />
            <span>beneath the surface.</span>
          </h2>
        </div>
        <p>
          A personal lab for virtualization, deployment, storage, and learning
          how the pieces connect.
        </p>
      </Reveal>
      <div className="lab-layout">
        <div
          data-motion-scene="infrastructure"
          data-lab-state={active}
          className="lab-diagram"
        >
          <div className="diagram-caption">
            <span>pve0 / DOCUMENTED ENVIRONMENT</span>
            <span>ILLUSTRATIVE TOPOLOGY</span>
          </div>
          <svg
            viewBox="0 0 700 440"
            role="img"
            aria-label={`${item.label} topology relationships`}
          >
            <g className="lab-routes">
              <path d="M350 46V132 M350 187V226 H130V263 M350 226V263 M350 226H570V263 M130 318V370H350 M350 318V370 M570 318V370H350 M350 370V406" />
              <path className="storage-route" d="M450 160H638V377H535" />
            </g>
            <g className="route-host">
              <path pathLength={1} d="M350 46V132" />
            </g>
            <g className="route-guests">
              <path
                pathLength={1}
                d="M350 187V226H130V263 M350 187V263 M350 187V226H570V263"
              />
            </g>
            <g className="route-services">
              <path
                pathLength={1}
                d="M130 318V370H350 M350 318V370 M570 318V370H350"
              />
            </g>
            <g className="route-backup">
              <path pathLength={1} d="M450 160H638V377H535" />
            </g>
            <g className="diagram-edge">
              <circle cx="350" cy="38" r="18" />
              <text x="350" y="42">
                WAN
              </text>
            </g>
            <g className="diagram-host">
              <rect x="235" y="132" width="230" height="66" rx="10" />
              <text x="350" y="158" className="node-main">
                pve0 / Proxmox VE
              </text>
              <text x="350" y="180">
                ThinkCentre M710q
              </text>
            </g>
            {[
              ["VM 01", "Debian", 130],
              ["VM 02", "Debian", 350],
              ["VM 03", "Ubuntu", 570],
            ].map(([name, os, x]) => (
              <g className="diagram-guest" key={name}>
                <rect
                  x={Number(x) - 80}
                  y="263"
                  width="160"
                  height="55"
                  rx="8"
                />
                <text x={x} y="285" className="node-main">
                  {name}
                </text>
                <text x={x} y="304">
                  {os}
                </text>
              </g>
            ))}
            <g className="diagram-services">
              <rect x="237" y="347" width="226" height="47" rx="8" />
              <text x="350" y="375" className="node-main">
                Services
              </text>
            </g>
            <g className="diagram-backup">
              <rect x="482" y="354" width="130" height="47" rx="8" />
              <text x="547" y="382" className="node-main">
                TrueNAS
              </text>
            </g>
          </svg>
          <div className="diagram-config">
            <span>i5-7500</span>
            <span>16 GB DDR4</span>
            <span>2 TB SSD</span>
          </div>
          {active === "services" && (
            <div className="service-names">
              {services.map((s, i) => (
                <span key={s} style={{ animationDelay: `${i * 0.06}s` }}>
                  {s}
                </span>
              ))}
            </div>
          )}
          {active === "backup" && (
            <p className="diagram-note">
              Host storage → NFS service environment → TrueNAS backup
              <br />
              Illustrative relationships; no guest-specific assignments assumed.
            </p>
          )}
          {active === "guests" && (
            <p className="diagram-note">
              Two Debian guests and one Ubuntu guest.
              <br />
              Service-to-VM assignments are not specified in the source.
            </p>
          )}
        </div>
        <div className="lab-reader">
          <div className="lab-tabs" aria-label="Infrastructure views">
            {tabs.map(([id, name, Icon]) => (
              <button
                key={id}
                onClick={() => setActive(id)}
                aria-pressed={active === id}
                aria-controls="lab-detail"
              >
                <Icon size={17} />
                {name}
                <ArrowUpRight size={13} />
              </button>
            ))}
          </div>
          <div
            id="lab-detail"
            key={active}
            className="state-reader"
            aria-live="polite"
          >
            <p className="eyebrow">{item.label}</p>
            <h3>{item.title}</h3>
            <p>{item.copy}</p>
          </div>
          <Link className="text-link" href="/work/homelab-os/">
            Explore Nexora Lab <ArrowUpRight size={14} />
          </Link>
          <small>
            Documented configuration. The diagram is illustrative and does not
            display live telemetry.
          </small>
        </div>
      </div>
    </section>
  );
}
