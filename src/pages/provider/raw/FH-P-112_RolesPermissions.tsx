// @ts-nocheck

"use client";

import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  BellRing,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Eye,
  Filter,
  Fingerprint,
  Globe2,
  KeyRound,
  Lock,
  Plus,
  ScrollText,
  Search,
  Settings2,
  ShieldCheck,
  ShieldEllipsis,
  Sparkles,
  UserCog,
  Users,
  Video,
  WalletCards,
  Workflow,
  X,
} from "lucide-react";
import { KpiTile } from "../../../components/ui/KpiTile";
import { navigateWithRouter } from "@/navigation/routerNavigate";

/**
 * FaithHub — Roles & Permissions
 * Premium Provider-side RBAC control center for workspace access, role templates,
 * approval paths, scope control, and sensitive-action permissions.
 *
 * Primary CTAs
 * - + New Role
 * - Edit Permissions
 * - Review Access
 */

const EV_GREEN = "#03cd8c";
const EV_ORANGE = "#f77f00";
const EV_GREY = "#a6a6a6";
const EV_LIGHT = "#f2f2f2";
const EV_NAVY = "#1e2d6b";

const ROUTES = {
  providerDashboard: "/faithhub/provider/dashboard",
  newRole: "/faithhub/provider/roles-permissions/new",
  leadership: "/faithhub/provider/leadership",
  servingTeams: "/faithhub/provider/serving-teams",
  workspaceSettings: "/faithhub/provider/workspace-settings",
  auditLog: "/faithhub/provider/audit-log",
  reviewAccess: "/faithhub/provider/roles-permissions/review",
};

const cx = (...xs: Array<string | false | null | undefined>) => xs.filter(Boolean).join(" ");

function safeNav(url: string) {
  navigateWithRouter(url);
}

function fmtInt(n: number) {
  return Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function initials(text: string) {
  return text
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((x) => x[0]?.toUpperCase() || "")
    .join("");
}

type PreviewMode = "desktop" | "mobile";
type RoleStatus = "Healthy" | "Review due" | "Approval-heavy" | "Limited";
type ScopeMode = "All campuses" | "Selected campuses" | "Personal assignments";
type AccessState = "Allow" | "Review" | "Block";
type RiskLevel = "Medium" | "High" | "Critical";
type ApprovalMode = "Auto" | "Lead approval" | "Dual approval" | "Owner approval";
type AssignmentState = "Active" | "Pending review" | "Needs access";

type FeatureAccess = {
  id: string;
  label: string;
  group: string;
  hint: string;
  state: AccessState;
};

type SensitiveAction = {
  id: string;
  label: string;
  risk: RiskLevel;
  permission: AccessState;
  approval: ApprovalMode;
  note: string;
};

type ApprovalLane = {
  id: string;
  label: string;
  steps: string[];
  sla: string;
  active: boolean;
};

type AssignmentRecord = {
  id: string;
  name: string;
  title: string;
  campus: string;
  state: AssignmentState;
};

type RoleRecord = {
  id: string;
  name: string;
  summary: string;
  description: string;
  status: RoleStatus;
  templateFamily: string;
  scope: ScopeMode;
  assigned: number;
  seats: number;
  lastReviewedISO: string;
  childSafe: boolean;
  owner: string;
  campusScopes: string[];
  tags: string[];
  previewHeadline: string;
  previewBody: string;
  featureAccess: FeatureAccess[];
  sensitiveActions: SensitiveAction[];
  approvalLanes: ApprovalLane[];
  assignments: AssignmentRecord[];
};

type TemplateCard = {
  id: string;
  title: string;
  subtitle: string;
  accent: "green" | "orange" | "navy";
};

const TEMPLATE_CARDS: TemplateCard[] = [
  {
    id: "tpl-ops-admin",
    title: "Operations administrator",
    subtitle:
      "Broad dashboard, live, audience, and workspace controls with dual approval on sensitive actions.",
    accent: "green",
  },
  {
    id: "tpl-live-producer",
    title: "Live producer role",
    subtitle:
      "Go-live, studio, and post-live controls with finance and contact export protections already locked.",
    accent: "orange",
  },
  {
    id: "tpl-finance-steward",
    title: "Finance steward",
    subtitle:
      "Funds, wallet, campaign transparency, and payout review without access to production controls.",
    accent: "navy",
  },
  {
    id: "tpl-community-moderator",
    title: "Community moderator",
    subtitle:
      "Forum, testimonies, prayer response, and trust queues with child-safe guardrails by default.",
    accent: "green",
  },
];

const ROLE_RECORDS: RoleRecord[] = [
  {
    id: "role-001",
    name: "Executive Administrator",
    summary: "Institution-wide oversight with broad visibility and guarded sensitive actions.",
    description:
      "Owns institution-wide controls across dashboard, live operations, giving, and governance. This role can see nearly every surface, but high-risk actions remain protected by approval and audit requirements.",
    status: "Healthy",
    templateFamily: "Leadership",
    scope: "All campuses",
    assigned: 4,
    seats: 4,
    lastReviewedISO: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    childSafe: true,
    owner: "Workspace Owner",
    campusScopes: ["Central Campus", "East Campus", "North Campus", "Online"],
    tags: ["Full oversight", "Dual approvals", "Multi-campus"],
    previewHeadline: "Broad access with guarded critical actions",
    previewBody:
      "Dashboard, live, events, Beacon, and finance are visible. Critical changes still route through approval and audit.",
    featureAccess: [
      { id: "fa-1", label: "Provider Dashboard", group: "Workspace", hint: "Mission-control metrics and institution alerts.", state: "Allow" },
      { id: "fa-2", label: "Teachings & Series", group: "Content", hint: "Series, episodes, and standalone teachings.", state: "Allow" },
      { id: "fa-3", label: "Live Sessions", group: "Production", hint: "Live Builder, Live Dashboard, Studio, and schedule.", state: "Allow" },
      { id: "fa-4", label: "Audience & Outreach", group: "Audience", hint: "Notifications, segments, channels, and contact health.", state: "Review" },
      { id: "fa-5", label: "Events Manager", group: "Events", hint: "Event planning, logistics, and check-in readiness.", state: "Allow" },
      { id: "fa-6", label: "Donations & Wallet", group: "Finance", hint: "Funds, donor insights, wallet, and payout readiness.", state: "Review" },
      { id: "fa-7", label: "Beacon", group: "Promotion", hint: "Beacon Dashboard, Manager, Marketplace, and Builder.", state: "Allow" },
      { id: "fa-8", label: "Community & Counseling", group: "Community", hint: "Forum, testimonies, projects, care, and prayer workflows.", state: "Review" },
      { id: "fa-9", label: "Workspace Settings", group: "Settings", hint: "Brand, localization, moderation defaults, and integrations.", state: "Allow" },
      { id: "fa-10", label: "Audit Log & QA Center", group: "Settings", hint: "Operational history, QA scans, and preflight health.", state: "Allow" },
    ],
    sensitiveActions: [
      { id: "sa-1", label: "Edit roles & permissions", risk: "Critical", permission: "Review", approval: "Owner approval", note: "Role changes must be signed off by the workspace owner." },
      { id: "sa-2", label: "Change payout destination", risk: "Critical", permission: "Review", approval: "Dual approval", note: "Finance lead and owner sign-off required for payout changes." },
      { id: "sa-3", label: "Export full contact list", risk: "High", permission: "Review", approval: "Lead approval", note: "Contact exports remain logged and rate-limited." },
      { id: "sa-4", label: "Delete replay or clip asset", risk: "High", permission: "Review", approval: "Dual approval", note: "Removes public content and requires confirmation from content lead." },
      { id: "sa-5", label: "Override moderation ruling", risk: "High", permission: "Review", approval: "Owner approval", note: "Used only for escalated trust-and-safety cases." },
      { id: "sa-6", label: "Publish testimonies institution-wide", risk: "Medium", permission: "Allow", approval: "Auto", note: "Visible in review history with consent trace." },
    ],
    approvalLanes: [
      { id: "ap-1", label: "Finance changes", steps: ["Finance Lead", "Workspace Owner"], sla: "4h SLA", active: true },
      { id: "ap-2", label: "Access escalations", steps: ["Security Admin", "Workspace Owner"], sla: "2h SLA", active: true },
      { id: "ap-3", label: "Child-safe overrides", steps: ["Safeguarding Lead", "Workspace Owner"], sla: "24h SLA", active: true },
    ],
    assignments: [
      { id: "as-1", name: "Ayesigai921", title: "Provider Owner", campus: "Institution-wide", state: "Active" },
      { id: "as-2", name: "Rita N.", title: "Executive Assistant", campus: "Central Campus", state: "Active" },
      { id: "as-3", name: "Daniel Okoro", title: "Operations Director", campus: "Institution-wide", state: "Pending review" },
      { id: "as-4", name: "Grace Nansubuga", title: "Campus Admin", campus: "East Campus", state: "Active" },
    ],
  },
  {
    id: "role-002",
    name: "Live Producer",
    summary: "Production-first role for live readiness, studio control, and replay handoff.",
    description:
      "Designed for producers who run the stage, route scenes, manage readiness, and move cleanly into post-live publishing without needing finance or broad admin controls.",
    status: "Healthy",
    templateFamily: "Production",
    scope: "Selected campuses",
    assigned: 7,
    seats: 9,
    lastReviewedISO: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18).toISOString(),
    childSafe: true,
    owner: "Production Lead",
    campusScopes: ["Central Campus", "Online"],
    tags: ["Studio-ready", "Post-live handoff", "Campus-scoped"],
    previewHeadline: "Fast production control without finance exposure",
    previewBody:
      "Studio, schedule, and post-live are fully visible. Wallet, payouts, and raw contact exports remain blocked.",
    featureAccess: [
      { id: "fa-11", label: "Provider Dashboard", group: "Workspace", hint: "Operational hero, alerts, and quick-create surfaces.", state: "Allow" },
      { id: "fa-12", label: "Teachings & Series", group: "Content", hint: "Series, episodes, and teaching metadata.", state: "Allow" },
      { id: "fa-13", label: "Live Sessions", group: "Production", hint: "Builder, Schedule, Dashboard, Studio, and destinations.", state: "Allow" },
      { id: "fa-14", label: "Audience & Outreach", group: "Audience", hint: "Last-minute reminders and session-linked journeys.", state: "Review" },
      { id: "fa-15", label: "Events Manager", group: "Events", hint: "Event-linked live operations and stage logistics.", state: "Review" },
      { id: "fa-16", label: "Donations & Wallet", group: "Finance", hint: "Giving and payout settings remain locked.", state: "Block" },
      { id: "fa-17", label: "Beacon", group: "Promotion", hint: "Post-live boost actions and promo handoff.", state: "Review" },
      { id: "fa-18", label: "Community & Counseling", group: "Community", hint: "Community pages are not visible to this role.", state: "Block" },
      { id: "fa-19", label: "Workspace Settings", group: "Settings", hint: "May view limited stream defaults only.", state: "Review" },
      { id: "fa-20", label: "Audit Log & QA Center", group: "Settings", hint: "View operational traces and QA scans without deleting logs.", state: "Review" },
    ],
    sensitiveActions: [
      { id: "sa-7", label: "Go live with linked destinations", risk: "High", permission: "Allow", approval: "Auto", note: "Allowed when the session preflight is green." },
      { id: "sa-8", label: "Delete replay before publish", risk: "High", permission: "Review", approval: "Lead approval", note: "Requires content lead sign-off before removing replay assets." },
      { id: "sa-9", label: "Export session attendee list", risk: "High", permission: "Block", approval: "Owner approval", note: "Attendee export remains restricted to outreach and admins." },
      { id: "sa-10", label: "Override caption failure warning", risk: "Medium", permission: "Review", approval: "Lead approval", note: "Warns if accessibility checks are not complete." },
      { id: "sa-11", label: "Launch Beacon spend over threshold", risk: "High", permission: "Block", approval: "Dual approval", note: "Producer can hand off but not commit promo budget." },
      { id: "sa-12", label: "Pin live safety notices", risk: "Medium", permission: "Allow", approval: "Auto", note: "Supports immediate audience and moderation guidance." },
    ],
    approvalLanes: [
      { id: "ap-4", label: "Replay deletion path", steps: ["Content Lead"], sla: "30m SLA", active: true },
      { id: "ap-5", label: "Caption override path", steps: ["Production Lead"], sla: "15m SLA", active: true },
      { id: "ap-6", label: "Budget escalation", steps: ["Growth Lead", "Workspace Owner"], sla: "4h SLA", active: false },
    ],
    assignments: [
      { id: "as-5", name: "Daniel Okoro", title: "Production Lead", campus: "Central Campus", state: "Active" },
      { id: "as-6", name: "Naomi Mensah", title: "Live Producer", campus: "Online", state: "Active" },
      { id: "as-7", name: "Isaac K.", title: "Assistant Producer", campus: "Central Campus", state: "Active" },
      { id: "as-8", name: "Sarah B.", title: "Caption Operator", campus: "Online", state: "Needs access" },
    ],
  },
  {
    id: "role-003",
    name: "Finance Steward",
    summary: "Warm donor stewardship with stronger visibility into funds, wallet, and payout health.",
    description:
      "This role is optimized for giving, receipts, accountability notes, and wallet readiness while keeping live controls and community publishing outside scope.",
    status: "Review due",
    templateFamily: "Finance",
    scope: "All campuses",
    assigned: 3,
    seats: 5,
    lastReviewedISO: new Date(Date.now() - 1000 * 60 * 60 * 24 * 46).toISOString(),
    childSafe: false,
    owner: "Finance Lead",
    campusScopes: ["Central Campus", "East Campus", "North Campus", "Online"],
    tags: ["Recurring donor care", "Payout-ready", "Review due"],
    previewHeadline: "Finance access with strong trust controls",
    previewBody:
      "Funds, donor insights, and wallet are visible. Live Studio, counseling, and forum publishing remain outside scope.",
    featureAccess: [
      { id: "fa-21", label: "Provider Dashboard", group: "Workspace", hint: "Finance-weighted dashboard and campaign snapshot.", state: "Allow" },
      { id: "fa-22", label: "Teachings & Series", group: "Content", hint: "Content structure is visible but not editable.", state: "Review" },
      { id: "fa-23", label: "Live Sessions", group: "Production", hint: "Live controls remain hidden to protect production flow.", state: "Block" },
      { id: "fa-24", label: "Audience & Outreach", group: "Audience", hint: "View donor journeys without broad contact editing.", state: "Review" },
      { id: "fa-25", label: "Events Manager", group: "Events", hint: "Can view event-linked giving moments and sponsor notes.", state: "Review" },
      { id: "fa-26", label: "Donations & Wallet", group: "Finance", hint: "Funds, recurring giving, receipts, wallet, and payout status.", state: "Allow" },
      { id: "fa-27", label: "Beacon", group: "Promotion", hint: "May review campaign spend but not launch ads.", state: "Review" },
      { id: "fa-28", label: "Community & Counseling", group: "Community", hint: "Community care surfaces stay locked.", state: "Block" },
      { id: "fa-29", label: "Workspace Settings", group: "Settings", hint: "May view finance-linked settings only.", state: "Review" },
      { id: "fa-30", label: "Audit Log & QA Center", group: "Settings", hint: "Can inspect payout and receipt audit events.", state: "Allow" },
    ],
    sensitiveActions: [
      { id: "sa-13", label: "Issue payout transfer", risk: "Critical", permission: "Review", approval: "Dual approval", note: "Requires finance lead and workspace owner sign-off." },
      { id: "sa-14", label: "Pause active giving campaign", risk: "High", permission: "Review", approval: "Lead approval", note: "Preserves campaign trust and donor communication quality." },
      { id: "sa-15", label: "Edit receipt language", risk: "Medium", permission: "Allow", approval: "Auto", note: "Changes remain fully logged for transparency." },
      { id: "sa-16", label: "Access donor PII export", risk: "Critical", permission: "Block", approval: "Owner approval", note: "Raw donor export is restricted to compliance handlers." },
      { id: "sa-17", label: "Update accountability notes", risk: "Medium", permission: "Allow", approval: "Auto", note: "Useful for campaign transparency and public trust." },
      { id: "sa-18", label: "Launch emergency giving alert", risk: "High", permission: "Review", approval: "Lead approval", note: "Protects against accidental emergency messaging." },
    ],
    approvalLanes: [
      { id: "ap-7", label: "Payout release", steps: ["Finance Lead", "Workspace Owner"], sla: "6h SLA", active: true },
      { id: "ap-8", label: "Emergency giving alerts", steps: ["Finance Lead"], sla: "30m SLA", active: true },
      { id: "ap-9", label: "Receipt copy review", steps: ["Compliance Contact"], sla: "24h SLA", active: false },
    ],
    assignments: [
      { id: "as-9", name: "Rita N.", title: "Finance Manager", campus: "Institution-wide", state: "Active" },
      { id: "as-10", name: "Joel K.", title: "Campaign Accountant", campus: "Central Campus", state: "Pending review" },
      { id: "as-11", name: "Abena S.", title: "Wallet Reconciliation", campus: "Institution-wide", state: "Active" },
    ],
  },
  {
    id: "role-004",
    name: "Community Moderator",
    summary: "Trust, discussion, testimony, and moderation response with public quality controls.",
    description:
      "Built for community teams who watch conversation health, approve stories, respond to reports, and protect public trust without stepping into finance or production systems.",
    status: "Healthy",
    templateFamily: "Community",
    scope: "Personal assignments",
    assigned: 11,
    seats: 14,
    lastReviewedISO: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9).toISOString(),
    childSafe: true,
    owner: "Community Lead",
    campusScopes: ["Institution-wide"],
    tags: ["Trust center", "Testimony approvals", "Child-safe defaults"],
    previewHeadline: "High trust moderation without finance or live controls",
    previewBody:
      "Forum, testimonies, prayer intake, and reviews are visible. Wallet, Beacon budget, and production controls stay locked.",
    featureAccess: [
      { id: "fa-31", label: "Provider Dashboard", group: "Workspace", hint: "Shows trust queue and reputation cards only.", state: "Review" },
      { id: "fa-32", label: "Teachings & Series", group: "Content", hint: "May review comments and linked clip quality only.", state: "Review" },
      { id: "fa-33", label: "Live Sessions", group: "Production", hint: "Can open moderation surfaces, not production controls.", state: "Review" },
      { id: "fa-34", label: "Audience & Outreach", group: "Audience", hint: "Can view message context for moderation escalations.", state: "Review" },
      { id: "fa-35", label: "Events Manager", group: "Events", hint: "Event forums and review threads only.", state: "Review" },
      { id: "fa-36", label: "Donations & Wallet", group: "Finance", hint: "Finance pages stay locked.", state: "Block" },
      { id: "fa-37", label: "Beacon", group: "Promotion", hint: "May inspect campaign comments but not edit ads.", state: "Block" },
      { id: "fa-38", label: "Community & Counseling", group: "Community", hint: "Forum, testimonies, projects, prayer requests, and reviews.", state: "Allow" },
      { id: "fa-39", label: "Workspace Settings", group: "Settings", hint: "May review moderation defaults only.", state: "Review" },
      { id: "fa-40", label: "Audit Log & QA Center", group: "Settings", hint: "Can inspect action history for moderation fairness.", state: "Allow" },
    ],
    sensitiveActions: [
      { id: "sa-19", label: "Resolve reported forum thread", risk: "Medium", permission: "Allow", approval: "Auto", note: "Standard moderation action with full evidence trail." },
      { id: "sa-20", label: "Feature public testimony", risk: "High", permission: "Review", approval: "Lead approval", note: "Protects public trust and consent requirements." },
      { id: "sa-21", label: "Ban repeat offender account", risk: "High", permission: "Allow", approval: "Auto", note: "Logged instantly and open to appeal review." },
      { id: "sa-22", label: "Override child-safe restriction", risk: "Critical", permission: "Block", approval: "Owner approval", note: "Not available to moderators without escalation." },
      { id: "sa-23", label: "Edit moderation policies", risk: "High", permission: "Block", approval: "Owner approval", note: "Policy authoring lives in moderation settings." },
      { id: "sa-24", label: "Reply to public reviews", risk: "Medium", permission: "Allow", approval: "Auto", note: "Templates and tone guidance remain available." },
    ],
    approvalLanes: [
      { id: "ap-10", label: "Featured testimony approval", steps: ["Community Lead"], sla: "6h SLA", active: true },
      { id: "ap-11", label: "Child-safe escalation", steps: ["Safeguarding Lead", "Workspace Owner"], sla: "24h SLA", active: true },
      { id: "ap-12", label: "Policy change requests", steps: ["Workspace Owner"], sla: "48h SLA", active: false },
    ],
    assignments: [
      { id: "as-12", name: "Sarah B.", title: "Forum Moderator", campus: "Institution-wide", state: "Active" },
      { id: "as-13", name: "Kofi M.", title: "Reviews Responder", campus: "Institution-wide", state: "Active" },
      { id: "as-14", name: "Lydia T.", title: "Testimony Reviewer", campus: "Institution-wide", state: "Pending review" },
      { id: "as-15", name: "Adaeze J.", title: "Prayer Intake Moderator", campus: "Online", state: "Active" },
    ],
  },
  {
    id: "role-005",
    name: "Campus Lead",
    summary: "Local campus oversight for services, volunteers, events, and approved community actions.",
    description:
      "Supports campus-level leadership without giving full institution-wide control. Best for leaders who need visibility into local gatherings, teams, and next-step actions.",
    status: "Approval-heavy",
    templateFamily: "Campus",
    scope: "Selected campuses",
    assigned: 5,
    seats: 8,
    lastReviewedISO: new Date(Date.now() - 1000 * 60 * 60 * 24 * 33).toISOString(),
    childSafe: true,
    owner: "Leadership Team",
    campusScopes: ["East Campus"],
    tags: ["Local scope", "Volunteer oversight", "Approval-heavy"],
    previewHeadline: "Local leadership access with institution-wide limits",
    previewBody:
      "Events, serving teams, and local live health are visible. Global settings, payouts, and cross-campus promotion remain gated.",
    featureAccess: [
      { id: "fa-41", label: "Provider Dashboard", group: "Workspace", hint: "Campus-weighted dashboard widgets only.", state: "Allow" },
      { id: "fa-42", label: "Teachings & Series", group: "Content", hint: "May view series and campus-linked teaching plans.", state: "Review" },
      { id: "fa-43", label: "Live Sessions", group: "Production", hint: "Can monitor readiness and open live dashboards for local sessions.", state: "Review" },
      { id: "fa-44", label: "Audience & Outreach", group: "Audience", hint: "Segment views are limited to campus-level audiences.", state: "Review" },
      { id: "fa-45", label: "Events Manager", group: "Events", hint: "Can run local events and volunteer coverage.", state: "Allow" },
      { id: "fa-46", label: "Donations & Wallet", group: "Finance", hint: "Can view local campaign progress but not issue payouts.", state: "Review" },
      { id: "fa-47", label: "Beacon", group: "Promotion", hint: "May request local promotion but not own spend settings.", state: "Review" },
      { id: "fa-48", label: "Community & Counseling", group: "Community", hint: "Can view local prayer and testimony flows.", state: "Allow" },
      { id: "fa-49", label: "Workspace Settings", group: "Settings", hint: "Institution-wide settings remain locked.", state: "Block" },
      { id: "fa-50", label: "Audit Log & QA Center", group: "Settings", hint: "May view campus-scoped audit events.", state: "Review" },
    ],
    sensitiveActions: [
      { id: "sa-25", label: "Publish campus event", risk: "Medium", permission: "Allow", approval: "Auto", note: "Local event pages can be published directly." },
      { id: "sa-26", label: "Create campus fundraising appeal", risk: "High", permission: "Review", approval: "Lead approval", note: "Finance approval required for giving campaigns." },
      { id: "sa-27", label: "Request live session reschedule", risk: "Medium", permission: "Allow", approval: "Auto", note: "Conflicts still route to operations schedule review." },
      { id: "sa-28", label: "Invite cross-campus staff", risk: "High", permission: "Review", approval: "Lead approval", note: "Cross-campus access changes remain guarded." },
      { id: "sa-29", label: "Edit local role assignments", risk: "High", permission: "Review", approval: "Owner approval", note: "Role edits require institution-level oversight." },
      { id: "sa-30", label: "Publish local testimony highlight", risk: "Medium", permission: "Review", approval: "Lead approval", note: "Keeps public narrative aligned with review standards." },
    ],
    approvalLanes: [
      { id: "ap-13", label: "Campus fundraising requests", steps: ["Finance Lead"], sla: "1 business day", active: true },
      { id: "ap-14", label: "Cross-campus staffing", steps: ["Leadership Team"], sla: "8h SLA", active: true },
      { id: "ap-15", label: "Local testimony feature", steps: ["Community Lead"], sla: "6h SLA", active: false },
    ],
    assignments: [
      { id: "as-16", name: "Grace Nansubuga", title: "Campus Lead", campus: "East Campus", state: "Active" },
      { id: "as-17", name: "Samuel O.", title: "Assistant Campus Lead", campus: "East Campus", state: "Pending review" },
      { id: "as-18", name: "Naomi Mensah", title: "Weekend Service Oversight", campus: "East Campus", state: "Active" },
    ],
  },
  {
    id: "role-006",
    name: "Care & Counseling Lead",
    summary: "Private-first care access with strong confidentiality, routing, and safeguarding defaults.",
    description:
      "Gives pastoral care leaders the tools they need for counseling, prayer routing, and follow-up while tightly restricting public publishing, finance, and broad workspace controls.",
    status: "Healthy",
    templateFamily: "Care",
    scope: "Personal assignments",
    assigned: 6,
    seats: 8,
    lastReviewedISO: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
    childSafe: true,
    owner: "Care Pastor",
    campusScopes: ["Institution-wide"],
    tags: ["Confidential", "Safeguarding", "Case routing"],
    previewHeadline: "Private-first care access with safeguarding defaults",
    previewBody:
      "Prayer requests, counseling, and care cases are visible. Public publishing, payout actions, and promotion controls remain blocked.",
    featureAccess: [
      { id: "fa-51", label: "Provider Dashboard", group: "Workspace", hint: "Shows care queue, unresolved cases, and follow-up reminders.", state: "Review" },
      { id: "fa-52", label: "Teachings & Series", group: "Content", hint: "Teaching pages stay out of scope for care leads.", state: "Block" },
      { id: "fa-53", label: "Live Sessions", group: "Production", hint: "May view prayer and care intake from live sessions.", state: "Review" },
      { id: "fa-54", label: "Audience & Outreach", group: "Audience", hint: "Can view care-linked contacts and consent markers.", state: "Review" },
      { id: "fa-55", label: "Events Manager", group: "Events", hint: "May inspect care-linked events and counseling appointments.", state: "Review" },
      { id: "fa-56", label: "Donations & Wallet", group: "Finance", hint: "Finance and payout pages stay hidden.", state: "Block" },
      { id: "fa-57", label: "Beacon", group: "Promotion", hint: "Promotion controls are out of scope for care roles.", state: "Block" },
      { id: "fa-58", label: "Community & Counseling", group: "Community", hint: "Prayer requests, counseling, journals, and care routing.", state: "Allow" },
      { id: "fa-59", label: "Workspace Settings", group: "Settings", hint: "Can view safeguarding defaults but not edit global rules.", state: "Review" },
      { id: "fa-60", label: "Audit Log & QA Center", group: "Settings", hint: "Sees case-level access history for explainability.", state: "Allow" },
    ],
    sensitiveActions: [
      { id: "sa-31", label: "Assign counselor to private case", risk: "Medium", permission: "Allow", approval: "Auto", note: "Routing remains fully logged." },
      { id: "sa-32", label: "Mark care note as sensitive", risk: "Medium", permission: "Allow", approval: "Auto", note: "Strengthens privacy on selected cases." },
      { id: "sa-33", label: "Export confidential case history", risk: "Critical", permission: "Block", approval: "Owner approval", note: "Confidential export stays locked." },
      { id: "sa-34", label: "Override child-safe restriction", risk: "Critical", permission: "Block", approval: "Owner approval", note: "Escalates to safeguarding leadership only." },
      { id: "sa-35", label: "Share testimony from counseling outcome", risk: "High", permission: "Review", approval: "Lead approval", note: "Consent and safeguarding checks required before sharing." },
      { id: "sa-36", label: "Mute prayer intake route", risk: "High", permission: "Review", approval: "Lead approval", note: "Used only during incident or routing overload." },
    ],
    approvalLanes: [
      { id: "ap-16", label: "Sensitive testimony consent", steps: ["Care Pastor", "Community Lead"], sla: "24h SLA", active: true },
      { id: "ap-17", label: "Child-safe escalation", steps: ["Safeguarding Lead"], sla: "Immediate", active: true },
      { id: "ap-18", label: "Confidential export requests", steps: ["Workspace Owner"], sla: "48h SLA", active: false },
    ],
    assignments: [
      { id: "as-19", name: "Pastor Grace N.", title: "Care Pastor", campus: "Institution-wide", state: "Active" },
      { id: "as-20", name: "Martha K.", title: "Counseling Coordinator", campus: "Institution-wide", state: "Active" },
      { id: "as-21", name: "Emmanuel T.", title: "Prayer Route Lead", campus: "Online", state: "Pending review" },
      { id: "as-22", name: "Faith A.", title: "Case Follow-up", campus: "Institution-wide", state: "Active" },
    ],
  },
];

function MetricCard({
  label,
  value,
  hint,
  dot = "green",
}: {
  label: string;
  value: string;
  hint: string;
  dot?: "green" | "orange" | "navy" | "grey";
}) {
  return <KpiTile label={label} value={value} hint={hint} tone={dot === "grey" ? "gray" : dot} size="compact" />;
}

function TonePill({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "good" | "warn" | "danger" | "accent";
  children: React.ReactNode;
}) {
  const cls =
    tone === "good"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-300"
      : tone === "warn"
        ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-300"
        : tone === "danger"
          ? "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/20 dark:text-rose-300"
          : tone === "accent"
            ? "text-white"
            : "border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300";

  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
        cls,
      )}
      style={tone === "accent" ? { background: EV_ORANGE, borderColor: EV_ORANGE } : undefined}
    >
      {children}
    </span>
  );
}

function SectionCard({
  title,
  subtitle,
  right,
  children,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[15px] font-black text-slate-900 dark:text-slate-100">{title}</div>
          {subtitle ? (
            <div className="mt-1 text-[13px] text-slate-500 dark:text-slate-400">{subtitle}</div>
          ) : null}
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function accessTone(state: AccessState) {
  return state === "Allow" ? "good" : state === "Review" ? "warn" : "danger";
}

function riskTone(level: RiskLevel) {
  return level === "Critical" ? "danger" : level === "High" ? "warn" : "neutral";
}

function RoleListCard({
  role,
  active,
  onClick,
}: {
  role: RoleRecord;
  active?: boolean;
  onClick?: () => void;
}) {
  const tone =
    role.status === "Healthy"
      ? "good"
      : role.status === "Review due"
        ? "warn"
        : role.status === "Approval-heavy"
          ? "warn"
          : "danger";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "w-full rounded-[28px] border p-4 text-left transition-all",
        active
          ? "border-transparent text-white shadow-md"
          : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800",
      )}
      style={active ? { background: EV_NAVY } : undefined}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={cx(
              "grid h-14 w-14 shrink-0 place-items-center rounded-[20px] text-lg font-black",
              active
                ? "bg-white/10 text-white"
                : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100",
            )}
          >
            {initials(role.name)}
          </div>
          <div className="min-w-0">
            <div className={cx("truncate text-[15px] font-bold", active ? "text-white" : "text-slate-900 dark:text-slate-100")}>
              {role.name}
            </div>
            <div className={cx("mt-1 truncate text-[12px]", active ? "text-white/75" : "text-slate-500 dark:text-slate-400")}>
              {role.templateFamily} · {role.scope} · {role.owner}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <TonePill tone={tone}>{role.status}</TonePill>
              <TonePill tone={role.scope === "All campuses" ? "good" : role.scope === "Selected campuses" ? "warn" : "neutral"}>
                {role.scope}
              </TonePill>
              {role.childSafe ? (
                <TonePill tone="good">
                  <ShieldCheck className="h-3.5 w-3.5" /> Child-safe
                </TonePill>
              ) : null}
            </div>
          </div>
        </div>
        <div className={cx("shrink-0 text-right", active ? "text-white" : "text-slate-900 dark:text-slate-100")}>
          <div className="text-[12px] font-black">{role.assigned}/{role.seats}</div>
          <div className={cx("mt-1 text-[11px]", active ? "text-white/70" : "text-slate-500 dark:text-slate-400")}>assigned</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <div>
          <div className={cx("text-[10px] font-bold uppercase tracking-[0.16em]", active ? "text-white/60" : "text-slate-500 dark:text-slate-400")}>Allow</div>
          <div className={cx("mt-1 text-[14px] font-black", active ? "text-white" : "text-slate-900 dark:text-slate-100")}>
            {role.featureAccess.filter((f) => f.state === "Allow").length}
          </div>
        </div>
        <div>
          <div className={cx("text-[10px] font-bold uppercase tracking-[0.16em]", active ? "text-white/60" : "text-slate-500 dark:text-slate-400")}>Review</div>
          <div className={cx("mt-1 text-[14px] font-black", active ? "text-white" : "text-slate-900 dark:text-slate-100")}>
            {role.featureAccess.filter((f) => f.state === "Review").length}
          </div>
        </div>
        <div>
          <div className={cx("text-[10px] font-bold uppercase tracking-[0.16em]", active ? "text-white/60" : "text-slate-500 dark:text-slate-400")}>Blocked</div>
          <div className={cx("mt-1 text-[14px] font-black", active ? "text-white" : "text-slate-900 dark:text-slate-100")}>
            {role.featureAccess.filter((f) => f.state === "Block").length}
          </div>
        </div>
      </div>
    </button>
  );
}

function TemplateTile({ card }: { card: TemplateCard }) {
  const accent =
    card.accent === "green"
      ? EV_GREEN
      : card.accent === "orange"
        ? EV_ORANGE
        : EV_NAVY;

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[14px] font-black text-slate-900 dark:text-slate-100">{card.title}</div>
          <div className="mt-2 text-[12px] leading-6 text-slate-500 dark:text-slate-400">{card.subtitle}</div>
        </div>
        <div className="h-10 w-10 rounded-full" style={{ background: accent }} />
      </div>
      <div className="mt-4 inline-flex items-center gap-2 text-[12px] font-black" style={{ color: accent }}>
        <Plus className="h-4 w-4" />
        Use template
      </div>
    </div>
  );
}

function FeatureAccessTile({
  feature,
  editMode,
  onCycle,
}: {
  feature: FeatureAccess;
  editMode?: boolean;
  onCycle?: () => void;
}) {
  const tone = accessTone(feature.state);
  return (
    <button
      type="button"
      disabled={!editMode}
      onClick={editMode ? onCycle : undefined}
      className={cx(
        "w-full rounded-[24px] border p-4 text-left transition-all",
        editMode
          ? "hover:bg-slate-50 dark:hover:bg-slate-950"
          : "cursor-default",
        tone === "good"
          ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900/40 dark:bg-emerald-900/20"
          : tone === "warn"
            ? "border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-900/20"
            : "border-rose-200 bg-rose-50 dark:border-rose-900/40 dark:bg-rose-900/20",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
            {feature.group}
          </div>
          <div className="mt-1 text-[14px] font-black text-slate-900 dark:text-slate-100">{feature.label}</div>
          <div className="mt-2 text-[12px] leading-5 text-slate-600 dark:text-slate-400">{feature.hint}</div>
        </div>
        <TonePill tone={tone}>{feature.state}</TonePill>
      </div>
      {editMode ? (
        <div className="mt-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          Click to cycle access state
        </div>
      ) : null}
    </button>
  );
}

function SensitiveActionCard({
  action,
  editMode,
  onCycle,
}: {
  action: SensitiveAction;
  editMode?: boolean;
  onCycle?: () => void;
}) {
  return (
    <button
      type="button"
      disabled={!editMode}
      onClick={editMode ? onCycle : undefined}
      className={cx(
        "w-full rounded-[24px] border border-slate-200 bg-white p-4 text-left shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-950",
        editMode ? "hover:bg-slate-50 dark:hover:bg-slate-900" : "cursor-default",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-[14px] font-black text-slate-900 dark:text-slate-100">{action.label}</div>
            <TonePill tone={riskTone(action.risk)}>{action.risk}</TonePill>
          </div>
          <div className="mt-2 text-[12px] leading-5 text-slate-600 dark:text-slate-400">{action.note}</div>
        </div>
        <TonePill tone={accessTone(action.permission)}>{action.permission}</TonePill>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <TonePill tone="neutral">
          <Workflow className="h-3.5 w-3.5" />
          {action.approval}
        </TonePill>
        {editMode ? (
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Click to cycle permission state
          </span>
        ) : null}
      </div>
    </button>
  );
}

function ApprovalLaneCard({ lane }: { lane: ApprovalLane }) {
  return (
    <div
      className={cx(
        "rounded-[24px] border p-4 transition-colors",
        lane.active
          ? "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
          : "border-slate-200/70 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/70",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="text-[14px] font-black text-slate-900 dark:text-slate-100">{lane.label}</div>
        <TonePill tone={lane.active ? "good" : "warn"}>{lane.active ? "Active" : "On demand"}</TonePill>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {lane.steps.map((step, idx) => (
          <React.Fragment key={`${lane.id}-${step}-${idx}`}>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              {step}
            </span>
            {idx < lane.steps.length - 1 ? <ChevronRight className="h-4 w-4 text-slate-400" /> : null}
          </React.Fragment>
        ))}
      </div>
      <div className="mt-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
        {lane.sla}
      </div>
    </div>
  );
}

function AssignmentCard({ item }: { item: AssignmentRecord }) {
  const tone =
    item.state === "Active"
      ? "good"
      : item.state === "Pending review"
        ? "warn"
        : "danger";

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[14px] font-black text-slate-900 dark:text-slate-100">{item.name}</div>
          <div className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">{item.title} · {item.campus}</div>
        </div>
        <TonePill tone={tone}>{item.state}</TonePill>
      </div>
    </div>
  );
}

function PreviewSurface({
  role,
  previewMode,
}: {
  role: RoleRecord;
  previewMode: PreviewMode;
}) {
  const previewGroups = [
    { key: "workspace", label: "Dashboard", state: role.featureAccess.find((f) => f.label === "Provider Dashboard")?.state || "Block" },
    { key: "content", label: "Teachings", state: role.featureAccess.find((f) => f.group === "Content")?.state || "Block" },
    { key: "production", label: "Live Sessions", state: role.featureAccess.find((f) => f.group === "Production")?.state || "Block" },
    { key: "audience", label: "Audience", state: role.featureAccess.find((f) => f.group === "Audience")?.state || "Block" },
    { key: "events", label: "Events & Giving", state: role.featureAccess.find((f) => f.label === "Events Manager" || f.label === "Donations & Wallet")?.state || "Block" },
    { key: "community", label: "Community", state: role.featureAccess.find((f) => f.group === "Community")?.state || "Block" },
    { key: "beacon", label: "Beacon", state: role.featureAccess.find((f) => f.label === "Beacon")?.state || "Block" },
    { key: "settings", label: "Settings", state: role.featureAccess.find((f) => f.group === "Settings")?.state || "Block" },
  ] as Array<{ key: string; label: string; state: AccessState }>;

  const makeStateClasses = (state: AccessState) =>
    state === "Allow"
      ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-900/40 dark:text-emerald-300"
      : state === "Review"
        ? "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-900/40 dark:text-amber-300"
        : "bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-600";

  if (previewMode === "mobile") {
    return (
      <div className="mx-auto w-full max-w-[340px] md:max-w-[380px] rounded-[34px] border border-slate-200 bg-slate-950 p-3 shadow-xl dark:border-slate-700">
        <div className="rounded-[28px] bg-white p-4 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                Mobile companion view
              </div>
              <div className="mt-1 text-[13px] font-black text-slate-900 dark:text-slate-100">{role.name}</div>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100">
              {initials(role.name)}
            </div>
          </div>

          <div className="mt-4 rounded-[22px] border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
            <div className="text-[11px] font-black text-slate-900 dark:text-slate-100">What this role sees</div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {previewGroups.map((item) => (
                <div
                  key={item.key}
                  className={cx(
                    "rounded-2xl border px-3 py-2 text-[11px] font-semibold transition-colors",
                    makeStateClasses(item.state),
                  )}
                >
                  {item.label}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-[22px] border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
            <div className="text-[11px] font-black text-slate-900 dark:text-slate-100">Sensitive action sheet</div>
            <div className="mt-3 space-y-2">
              {role.sensitiveActions.slice(0, 3).map((action) => (
                <div key={action.id} className="rounded-2xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
                  <div className="text-[11px] font-bold text-slate-900 dark:text-slate-100">{action.label}</div>
                  <div className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">
                    {action.permission} · {action.approval}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-[22px] border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
            <div className="text-[11px] font-black text-slate-900 dark:text-slate-100">Scope summary</div>
            <div className="mt-2 text-[11px] leading-5 text-slate-500 dark:text-slate-400">
              {role.scope} · {role.campusScopes.join(" · ")}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[30px] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
              Desktop access preview
            </div>
            <div className="mt-1 text-[18px] font-black text-slate-900 dark:text-slate-100">{role.name}</div>
            <div className="mt-1 max-w-[340px] text-[12px] leading-5 text-slate-500 dark:text-slate-400">
              {role.previewBody}
            </div>
          </div>
          <div className="grid h-12 w-12 place-items-center rounded-[20px] bg-slate-900 text-white dark:bg-white dark:text-slate-900">
            {initials(role.name)}
          </div>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[24px] border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
            <div className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
              Sidebar visibility
            </div>
            <div className="mt-3 space-y-2">
              {previewGroups.map((item) => (
                <div
                  key={item.key}
                  className={cx(
                    "flex items-center justify-between rounded-2xl border px-3 py-2 text-[12px] font-semibold transition-colors",
                    makeStateClasses(item.state),
                  )}
                >
                  <span>{item.label}</span>
                  <span className="text-[11px] font-black">{item.state}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-[24px] border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
              <div className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                Approval path preview
              </div>
              <div className="mt-3 space-y-2">
                {role.approvalLanes.slice(0, 2).map((lane) => (
                  <div key={lane.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-950">
                    <div className="text-[12px] font-bold text-slate-900 dark:text-slate-100">{lane.label}</div>
                    <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      {lane.steps.join(" ? ")} · {lane.sla}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
              <div className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                Review health
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-950">
                  <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">Last reviewed</div>
                  <div className="mt-1 text-[12px] font-black text-slate-900 dark:text-slate-100">{fmtDate(role.lastReviewedISO)}</div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-950">
                  <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">Assignments</div>
                  <div className="mt-1 text-[12px] font-black text-slate-900 dark:text-slate-100">{role.assigned}/{role.seats}</div>
                </div>
              </div>
              <div className="mt-3 text-[11px] leading-5 text-slate-500 dark:text-slate-400">
                Scope: {role.scope} · {role.campusScopes.join(" · ")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewDrawer({
  open,
  onClose,
  role,
  previewMode,
  setPreviewMode,
}: {
  open: boolean;
  onClose: () => void;
  role: RoleRecord | null;
  previewMode: PreviewMode;
  setPreviewMode: (mode: PreviewMode) => void;
}) {
  if (!open || !role) return null;

  return (
    <div className="fixed inset-0 z-[120]">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 w-full max-w-[860px] overflow-y-auto border-l border-slate-200 bg-slate-50 p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-950">
        <div className="sticky top-0 z-10 rounded-[26px] border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[14px] font-black text-slate-900 dark:text-slate-100">
                Access preview · {role.name}
              </div>
              <div className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">
                Role visibility, approval flow, and mobile/desktop companion surfaces.
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setPreviewMode("desktop")}
            className={cx(
              "rounded-full px-3 py-1.5 text-[12px] font-bold transition-colors",
              previewMode === "desktop"
                ? "text-white"
                : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-800",
            )}
            style={previewMode === "desktop" ? { background: EV_GREEN } : undefined}
          >
            Desktop preview
          </button>
          <button
            type="button"
            onClick={() => setPreviewMode("mobile")}
            className={cx(
              "rounded-full px-3 py-1.5 text-[12px] font-bold transition-colors",
              previewMode === "mobile"
                ? "text-white"
                : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-800",
            )}
            style={previewMode === "mobile" ? { background: EV_ORANGE } : undefined}
          >
            Mobile preview
          </button>
        </div>

        <div className="mt-4">
          <PreviewSurface role={role} previewMode={previewMode} />
        </div>
      </div>
    </div>
  );
}

export default function FH_P_112_RolesPermissionsPage() {
  const [roles, setRoles] = useState<RoleRecord[]>(ROLE_RECORDS);
  const [query, setQuery] = useState("");
  const [templateFilter, setTemplateFilter] = useState("All templates");
  const [scopeFilter, setScopeFilter] = useState("All scopes");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState(ROLE_RECORDS[0]?.id || "");

  const templates = useMemo(
    () => ["All templates", ...Array.from(new Set(ROLE_RECORDS.map((role) => role.templateFamily)))],
    [],
  );
  const scopes = useMemo(
    () => ["All scopes", ...Array.from(new Set(ROLE_RECORDS.map((role) => role.scope)))],
    [],
  );
  const statuses = useMemo(
    () => ["All statuses", ...Array.from(new Set(ROLE_RECORDS.map((role) => role.status)))],
    [],
  );

  const filteredRoles = useMemo(() => {
    const q = query.trim().toLowerCase();
    return roles.filter((role) => {
      const matchesQuery =
        !q ||
        [
          role.name,
          role.summary,
          role.templateFamily,
          role.scope,
          role.owner,
          ...role.tags,
          ...role.campusScopes,
        ]
          .join(" ")
          .toLowerCase()
          .includes(q);

      const matchesTemplate =
        templateFilter === "All templates" || role.templateFamily === templateFilter;
      const matchesScope = scopeFilter === "All scopes" || role.scope === scopeFilter;
      const matchesStatus = statusFilter === "All statuses" || role.status === statusFilter;

      return matchesQuery && matchesTemplate && matchesScope && matchesStatus;
    });
  }, [roles, query, templateFilter, scopeFilter, statusFilter]);

  const selectedRole = useMemo(() => {
    return (
      filteredRoles.find((role) => role.id === selectedRoleId) ||
      roles.find((role) => role.id === selectedRoleId) ||
      filteredRoles[0] ||
      roles[0] ||
      null
    );
  }, [filteredRoles, roles, selectedRoleId]);

  const stats = useMemo(() => {
    const activeRoles = roles.length;
    const assigned = roles.reduce((sum, role) => sum + role.assigned, 0);
    const sensitiveGates = roles.reduce(
      (sum, role) => sum + role.sensitiveActions.filter((action) => action.permission !== "Allow").length,
      0,
    );
    const approvalPaths = roles.reduce((sum, role) => sum + role.approvalLanes.filter((lane) => lane.active).length, 0);
    const reviewsDue = roles.filter((role) => role.status === "Review due" || role.status === "Approval-heavy").length;
    const avgRestricted = Math.round(
      roles.reduce((sum, role) => sum + role.featureAccess.filter((f) => f.state !== "Allow").length, 0) /
        Math.max(1, roles.length),
    );

    return { activeRoles, assigned, sensitiveGates, approvalPaths, reviewsDue, avgRestricted };
  }, [roles]);

  const reviewSignals = useMemo(() => {
    if (!selectedRole) return [] as Array<{ title: string; hint: string; tone: "good" | "warn" | "danger" }>;

    return [
      {
        title:
          selectedRole.status === "Healthy"
            ? "Role health is stable"
            : selectedRole.status === "Review due"
              ? "This role is due for an access review"
              : selectedRole.status === "Approval-heavy"
                ? "This role is approval-heavy and may slow operations"
                : "This role is currently limited",
        hint:
          selectedRole.status === "Healthy"
            ? "Assigned teammates and approvals look healthy for the current workspace posture."
            : selectedRole.status === "Review due"
              ? "Check whether assigned teammates still need the current scope, especially after team or campus changes."
              : selectedRole.status === "Approval-heavy"
                ? "Consider whether some actions can move from manual review to lighter approval without reducing trust."
                : "A limited role is useful when onboarding or when access should remain intentionally narrow.",
        tone:
          selectedRole.status === "Healthy"
            ? "good"
            : selectedRole.status === "Limited"
              ? "danger"
              : "warn",
      },
      {
        title:
          selectedRole.sensitiveActions.some((action) => action.permission === "Block")
            ? "Critical actions are intentionally locked"
            : "Most sensitive actions remain available with controls",
        hint:
          selectedRole.sensitiveActions.some((action) => action.permission === "Block")
            ? "Some actions cannot be performed by this role at all, which reduces accidental risk."
            : "High-trust actions are still protected through approval lanes and audit history.",
        tone:
          selectedRole.sensitiveActions.some((action) => action.permission === "Block")
            ? "warn"
            : "good",
      },
      {
        title:
          selectedRole.childSafe
            ? "Child-safe defaults are active for this role"
            : "Child-safe escalation remains outside this role",
        hint:
          selectedRole.childSafe
            ? "This role keeps stronger visibility, routing, and approval defaults where children or sensitive cases are involved."
            : "The role is not configured with child-facing defaults, so those escalations stay with safeguarding leads.",
        tone: selectedRole.childSafe ? "good" : "warn",
      },
    ];
  }, [selectedRole]);

  function cycleAccessState(roleId: string, featureId: string) {
    setRoles((prev) =>
      prev.map((role) => {
        if (role.id !== roleId) return role;
        return {
          ...role,
          featureAccess: role.featureAccess.map((feature) => {
            if (feature.id !== featureId) return feature;
            const next =
              feature.state === "Allow"
                ? "Review"
                : feature.state === "Review"
                  ? "Block"
                  : "Allow";
            return { ...feature, state: next };
          }),
        };
      }),
    );
  }

  function cycleSensitiveAction(roleId: string, actionId: string) {
    setRoles((prev) =>
      prev.map((role) => {
        if (role.id !== roleId) return role;
        return {
          ...role,
          sensitiveActions: role.sensitiveActions.map((action) => {
            if (action.id !== actionId) return action;
            const next =
              action.permission === "Allow"
                ? "Review"
                : action.permission === "Review"
                  ? "Block"
                  : "Allow";
            return { ...action, permission: next };
          }),
        };
      }),
    );
  }

  function handleReviewAccess() {
    const nextRole =
      roles.find((role) => role.status === "Review due") ||
      roles.find((role) => role.status === "Approval-heavy") ||
      roles[0];
    if (nextRole) {
      setSelectedRoleId(nextRole.id);
      setPreviewOpen(true);
    }
  }

  return (
    <div className="min-h-screen bg-[#f2f2f2] text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-[1600px] px-5 py-5 md:px-6 lg:px-8 lg:py-6">
        <div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-4">
                <div
                  className="grid h-12 w-12 place-items-center rounded-[18px] text-white"
                  style={{ background: EV_GREEN }}
                >
                  <UserCog className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    Team governance
                  </div>
                  <div className="text-[28px] font-black leading-[1.04] tracking-[-0.03em] text-slate-900 dark:text-slate-100 sm:text-[34px] lg:text-[40px]">
                    Roles & Permissions
                  </div>
                  <div className="mt-1.5 text-[14px] leading-6 text-slate-500 dark:text-slate-400">
                    Premium Provider RBAC surface for workspace access, role templates, approval paths, scope control, and sensitive-action permissions.
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <TonePill tone="accent">Sensitive gates {stats.sensitiveGates}</TonePill>
                <TonePill tone="good">Active roles {stats.activeRoles}</TonePill>
                <TonePill tone="warn">Reviews due {stats.reviewsDue}</TonePill>
                <TonePill tone="neutral">Approval paths {stats.approvalPaths}</TonePill>
              </div>
            </div>

            <div className="flex flex-col items-start gap-3 xl:items-end">
              <div className="flex flex-wrap gap-2">
                <TonePill tone="neutral">Workspace access</TonePill>
                <TonePill tone="neutral">Scope control</TonePill>
                <TonePill tone="neutral">Sensitive-action permissions</TonePill>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => safeNav(ROUTES.newRole)}
                  className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-[12px] font-bold text-white"
                  style={{ background: EV_GREEN }}
                >
                  <Plus className="h-4 w-4" /> + New Role
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode((v) => !v)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <KeyRound className="h-4 w-4" /> {editMode ? "Stop Editing" : "Edit Permissions"}
                </button>
                <button
                  type="button"
                  onClick={handleReviewAccess}
                  className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-[12px] font-bold text-white"
                  style={{ background: EV_ORANGE }}
                >
                  <ClipboardCheck className="h-4 w-4" /> Review Access
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-[26px] border border-slate-200 bg-white px-4 py-3 text-[13px] text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-amber-700 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-300">
                Premium RBAC
              </span>
              <span className="ml-3 align-middle">
                Finance changes still require dual approval · Two teammate assignments are waiting for scope review · Child-safe overrides remain locked behind safeguarding leadership.
              </span>
            </div>
            <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
              Workspace security system
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-6">
          <MetricCard
            label="Active roles"
            value={fmtInt(stats.activeRoles)}
            hint="Role records currently in use across the workspace."
            dot="green"
          />
          <MetricCard
            label="Assigned teammates"
            value={fmtInt(stats.assigned)}
            hint="People currently mapped into a role or pending scope review."
            dot="green"
          />
          <MetricCard
            label="Sensitive gates"
            value={fmtInt(stats.sensitiveGates)}
            hint="Sensitive actions still blocked or approval-gated."
            dot="orange"
          />
          <MetricCard
            label="Approval paths"
            value={fmtInt(stats.approvalPaths)}
            hint="Active approval lanes protecting critical actions."
            dot="navy"
          />
          <MetricCard
            label="Access reviews due"
            value={fmtInt(stats.reviewsDue)}
            hint="Roles needing formal review or lighter approval tuning."
            dot="orange"
          />
          <MetricCard
            label="Avg restricted"
            value={fmtInt(stats.avgRestricted)}
            hint="Average non-Allow access surfaces per role."
            dot="grey"
          />
        </div>

        <div className="mt-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="text-[14px] font-bold text-slate-900 dark:text-slate-100">Search and filter</div>
          <div className="mt-1 text-[13px] text-slate-500 dark:text-slate-400">
            Find roles, templates, campus scope, approval posture, and high-risk permissions faster.
          </div>
          <div className="mt-4 grid gap-3 xl:grid-cols-[1.4fr_0.55fr_0.55fr_0.55fr]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search role name, owner, template, scope, or tags"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-[13px] outline-none transition focus:border-transparent focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-emerald-900/40"
              />
            </div>
            <select
              value={templateFilter}
              onChange={(e) => setTemplateFilter(e.target.value)}
              className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-[13px] font-semibold text-slate-700 outline-none transition focus:border-transparent focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:focus:ring-slate-800"
            >
              {templates.map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
            <select
              value={scopeFilter}
              onChange={(e) => setScopeFilter(e.target.value)}
              className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-[13px] font-semibold text-slate-700 outline-none transition focus:border-transparent focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:focus:ring-slate-800"
            >
              {scopes.map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-[13px] font-semibold text-slate-700 outline-none transition focus:border-transparent focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:focus:ring-slate-800"
            >
              {statuses.map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_0.95fr_0.78fr] xl:items-start">
          <div className="space-y-4">
            <SectionCard
              title="Roles catalog"
              subtitle="Premium role library with template family, campus scope, role health, and assigned teammate visibility."
              right={<TonePill tone="neutral">{filteredRoles.length} roles</TonePill>}
            >
              <div className="mb-4 flex flex-wrap gap-2">
                <TonePill tone="neutral">All roles</TonePill>
                <TonePill tone="good">Healthy</TonePill>
                <TonePill tone="warn">Review due</TonePill>
                <TonePill tone="warn">Approval-heavy</TonePill>
                <TonePill tone="neutral">Child-safe</TonePill>
              </div>

              <div className="space-y-3">
                {filteredRoles.length ? (
                  filteredRoles.map((role) => (
                    <RoleListCard
                      key={role.id}
                      role={role}
                      active={selectedRole?.id === role.id}
                      onClick={() => setSelectedRoleId(role.id)}
                    />
                  ))
                ) : (
                  <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-950">
                    <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                      <Search className="h-6 w-6" />
                    </div>
                    <div className="mt-4 text-[15px] font-bold text-slate-900 dark:text-slate-100">
                      No roles match this filter
                    </div>
                    <div className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">
                      Try changing the template, scope, or status filters.
                    </div>
                  </div>
                )}
              </div>
            </SectionCard>

            <SectionCard
              title="Quick-create role templates"
              subtitle="Premium RBAC templates for leadership, production, finance, moderation, and campus operations."
              right={
                <button
                  type="button"
                  onClick={() => safeNav(ROUTES.newRole)}
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-300"
                >
                  <Plus className="h-3.5 w-3.5" /> + New Role lives here
                </button>
              }
            >
              <div className="grid gap-4 md:grid-cols-2">
                {TEMPLATE_CARDS.map((card) => (
                  <TemplateTile key={card.id} card={card} />
                ))}
              </div>
            </SectionCard>
          </div>

          <div className="space-y-4">
            <SectionCard
              title="Selected role workspace"
              subtitle="Role summary, feature access, scope control, and sensitive-action guardrails for the currently selected role."
            >
              {selectedRole ? (
                <>
                  <div className="flex items-start gap-4">
                    <div
                      className="grid h-16 w-16 shrink-0 place-items-center rounded-[24px] text-2xl font-black text-white"
                      style={{ background: EV_NAVY }}
                    >
                      {initials(selectedRole.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                        {selectedRole.name}
                      </div>
                      <div className="mt-1 text-[13px] text-slate-500 dark:text-slate-400">
                        {selectedRole.templateFamily} · {selectedRole.scope} · Owner: {selectedRole.owner}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <TonePill tone={selectedRole.status === "Healthy" ? "good" : selectedRole.status === "Limited" ? "danger" : "warn"}>
                          {selectedRole.status}
                        </TonePill>
                        <TonePill tone={selectedRole.scope === "All campuses" ? "good" : selectedRole.scope === "Selected campuses" ? "warn" : "neutral"}>
                          {selectedRole.scope}
                        </TonePill>
                        <TonePill tone="neutral">
                          <Users className="h-3.5 w-3.5" /> {selectedRole.assigned}/{selectedRole.seats} assigned
                        </TonePill>
                        {selectedRole.childSafe ? (
                          <TonePill tone="good">
                            <ShieldCheck className="h-3.5 w-3.5" /> Child-safe
                          </TonePill>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 rounded-[24px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                    <div className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                      Role description
                    </div>
                    <div className="mt-2 text-[13px] leading-6 text-slate-600 dark:text-slate-300">
                      {selectedRole.description}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div className="rounded-[24px] border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                      <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                        Last review
                      </div>
                      <div className="mt-1 text-[15px] font-black text-slate-900 dark:text-slate-100">
                        {fmtDate(selectedRole.lastReviewedISO)}
                      </div>
                    </div>
                    <div className="rounded-[24px] border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                      <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                        Campus scope
                      </div>
                      <div className="mt-1 text-[15px] font-black text-slate-900 dark:text-slate-100">
                        {selectedRole.campusScopes.length}
                      </div>
                    </div>
                    <div className="rounded-[24px] border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                      <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                        Active approval lanes
                      </div>
                      <div className="mt-1 text-[15px] font-black text-slate-900 dark:text-slate-100">
                        {selectedRole.approvalLanes.filter((lane) => lane.active).length}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedRole.tags.map((tag) => (
                      <TonePill key={tag} tone="neutral">{tag}</TonePill>
                    ))}
                  </div>
                </>
              ) : null}
            </SectionCard>

            <SectionCard
              title="Feature access matrix"
              subtitle={editMode ? "Edit mode is active — click any tile to cycle Allow ? Review ? Block." : "Permission states across premium Provider surfaces and operational clusters."}
              right={
                <TonePill tone={editMode ? "accent" : "neutral"}>
                  {editMode ? "Editing" : "View mode"}
                </TonePill>
              }
            >
              {selectedRole ? (
                <div className="grid gap-3 md:grid-cols-2">
                  {selectedRole.featureAccess.map((feature) => (
                    <FeatureAccessTile
                      key={feature.id}
                      feature={feature}
                      editMode={editMode}
                      onCycle={() => cycleAccessState(selectedRole.id, feature.id)}
                    />
                  ))}
                </div>
              ) : null}
            </SectionCard>

            <SectionCard
              title="Sensitive-action permissions"
              subtitle={editMode ? "While editing, click any action card to cycle its permission state." : "High-risk action controls with approval requirements and audit-friendly notes."}
            >
              {selectedRole ? (
                <div className="grid gap-3">
                  {selectedRole.sensitiveActions.map((action) => (
                    <SensitiveActionCard
                      key={action.id}
                      action={action}
                      editMode={editMode}
                      onCycle={() => cycleSensitiveAction(selectedRole.id, action.id)}
                    />
                  ))}
                </div>
              ) : null}
            </SectionCard>

            <SectionCard
              title="Approval paths & member assignments"
              subtitle="Shared review lanes, role ownership, and currently assigned teammates."
            >
              {selectedRole ? (
                <div className="space-y-4">
                  <div className="grid gap-3">
                    {selectedRole.approvalLanes.map((lane) => (
                      <ApprovalLaneCard key={lane.id} lane={lane} />
                    ))}
                  </div>

                  <div className="grid gap-3">
                    {selectedRole.assignments.map((assignment) => (
                      <AssignmentCard key={assignment.id} item={assignment} />
                    ))}
                  </div>
                </div>
              ) : null}
            </SectionCard>
          </div>

          <div className="space-y-4">
            <SectionCard
              title="Access preview rail"
              subtitle="Role-aware desktop/mobile view showing visibility, approval prompts, and review health."
              right={
                <button
                  type="button"
                  onClick={() => setPreviewOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 xl:hidden"
                >
                  <Eye className="h-3.5 w-3.5" /> Open preview
                </button>
              }
            >
              <div className="mb-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewMode("desktop")}
                  className={cx(
                    "rounded-full px-3 py-1.5 text-[12px] font-bold transition-colors",
                    previewMode === "desktop"
                      ? "text-white"
                      : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-800",
                  )}
                  style={previewMode === "desktop" ? { background: EV_GREEN } : undefined}
                >
                  Desktop preview
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode("mobile")}
                  className={cx(
                    "rounded-full px-3 py-1.5 text-[12px] font-bold transition-colors",
                    previewMode === "mobile"
                      ? "text-white"
                      : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-800",
                  )}
                  style={previewMode === "mobile" ? { background: EV_ORANGE } : undefined}
                >
                  Mobile preview
                </button>
              </div>

              <div className="hidden xl:block xl:sticky xl:top-5">
                {selectedRole ? <PreviewSurface role={selectedRole} previewMode={previewMode} /> : null}
              </div>
              <div className="xl:hidden">
                <div className="rounded-[26px] border border-dashed border-slate-300 bg-slate-50 p-5 text-center dark:border-slate-700 dark:bg-slate-950">
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                    <Eye className="h-5 w-5" />
                  </div>
                  <div className="mt-3 text-[14px] font-black text-slate-900 dark:text-slate-100">
                    Open the preview rail
                  </div>
                  <div className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">
                    See how the selected role looks on desktop and mobile companion surfaces.
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => setPreviewOpen(true)}
                      className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-[12px] font-bold text-white"
                      style={{ background: EV_ORANGE }}
                    >
                      <Eye className="h-4 w-4" /> Open preview
                    </button>
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="Review signals"
              subtitle="What deserves the next access review or policy follow-up for the selected role."
            >
              <div className="space-y-3">
                {reviewSignals.map((signal) => (
                  <div
                    key={signal.title}
                    className={cx(
                      "rounded-[24px] border p-4 transition-colors",
                      signal.tone === "good"
                        ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900/40 dark:bg-emerald-900/20"
                        : signal.tone === "warn"
                          ? "border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-900/20"
                          : "border-rose-200 bg-rose-50 dark:border-rose-900/40 dark:bg-rose-900/20",
                    )}
                  >
                    <div className="text-[13px] font-black text-slate-900 dark:text-slate-100">{signal.title}</div>
                    <div className="mt-2 text-[12px] leading-5 text-slate-600 dark:text-slate-400">{signal.hint}</div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard
              title="Cross-links"
              subtitle="Move quickly into the most relevant adjacent Provider workflows."
            >
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => safeNav(ROUTES.providerDashboard)}
                  className="flex w-full items-center justify-between rounded-[22px] border border-slate-200 bg-white px-4 py-3 text-left text-[12px] font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <span className="inline-flex items-center gap-2"><Sparkles className="h-4 w-4" /> Provider Dashboard</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => safeNav(ROUTES.leadership)}
                  className="flex w-full items-center justify-between rounded-[22px] border border-slate-200 bg-white px-4 py-3 text-left text-[12px] font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <span className="inline-flex items-center gap-2"><Users className="h-4 w-4" /> Leadership</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => safeNav(ROUTES.servingTeams)}
                  className="flex w-full items-center justify-between rounded-[22px] border border-slate-200 bg-white px-4 py-3 text-left text-[12px] font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <span className="inline-flex items-center gap-2"><Video className="h-4 w-4" /> Serving Teams</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => safeNav(ROUTES.workspaceSettings)}
                  className="flex w-full items-center justify-between rounded-[22px] border border-slate-200 bg-white px-4 py-3 text-left text-[12px] font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <span className="inline-flex items-center gap-2"><Settings2 className="h-4 w-4" /> Workspace Settings</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => safeNav(ROUTES.auditLog)}
                  className="flex w-full items-center justify-between rounded-[22px] border border-slate-200 bg-white px-4 py-3 text-left text-[12px] font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <span className="inline-flex items-center gap-2"><ScrollText className="h-4 w-4" /> Audit Log</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </SectionCard>
          </div>
        </div>
      </div>

      <PreviewDrawer
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        role={selectedRole}
        previewMode={previewMode}
        setPreviewMode={setPreviewMode}
      />
    </div>
  );
}










