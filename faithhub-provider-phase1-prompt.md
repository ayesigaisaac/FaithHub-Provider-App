FaithHub Provider Frontend (Phase 1)

Build the complete frontend experience for the FaithHub Provider journey inside the existing FaithHub Provider app.

This phase is UI/UX only.

Do not build:
- Backend logic
- Database schema
- APIs
- Authentication logic
- Payment logic
- Booking logic
- Settlement logic

Use mock data throughout.

Goal:
Create a complete FaithHub Provider experience from onboarding through go live, matching the existing FaithHub Provider shell, navigation patterns, approval states, and premium SaaS dashboard style already used in the app.

Brand direction:
- FaithHub Provider
- Clean
- Professional
- Modern
- Faith-focused
- Trustworthy
- Mobile responsive
- Minimalistic
- Soft shadows
- Rounded cards
- Clear status and approval indicators

Use:
- Tailwind CSS
- shadcn/ui components
- Lucide icons

Important:
- Keep the experience aligned with the existing FaithHub Provider codebase and routes.
- Do not introduce marketplace, wholesale, delivery, settlement, EVzone commerce, or buyer flows.
- Keep all labels, copy, and navigation FaithHub-native.

Provider Journey:
Provider Registration
→ Complete Provider Profile
→ Pending Approval
→ Provider Dashboard
→ Service Management
→ Create Service
→ Service Approval Status
→ Campaign Management
→ Create Campaign
→ Campaign Approval Status
→ Content Upload
→ Asset Library
→ Live Session Management
→ Create Live Session
→ Live Session Approval Status
→ Schedule Session
→ Waiting Room Preview
→ Go Live Screen

Build the following pages and states:

1. Provider Registration
Fields:
- Organization Name
- Provider Type
- Contact Person
- Email
- Phone Number
- Country
- City
- Website
- Password

Actions:
- Register
- Save Draft

2. Complete Provider Profile
Sections:
- Organization Information
  - Logo
  - Cover Image
  - Bio
  - Mission Statement
- Verification
  - Upload Documents
  - Upload Registration Certificate
  - Upload Identity Documents

Button:
- Submit Application

Status banner:
- Pending Review

3. Provider Dashboard
Show:
- Profile Status
- Services
- Campaigns
- Live Sessions
- Notifications

Quick Actions:
- Create Service
- Create Campaign
- Upload Content
- Create Live Session

4. Service Management
Service list page with:
- Service Image
- Service Name
- Category
- Status
- Created Date

Actions:
- View
- Edit
- Delete

Button:
- Create Service

5. Create Service
Fields:
- Service Title
- Description
- Category
- Price
- Duration
- Location
- Featured Image
- Gallery Images
- Video

Buttons:
- Save Draft
- Submit For Review

Statuses:
- Draft
- Pending Review
- Approved
- Rejected
- Published

6. Campaign Management
Campaign list with:
- Campaign Name
- Status
- Start Date
- End Date

Button:
- Create Campaign

7. Create Campaign
Fields:
- Campaign Name
- Objective
- Description
- Start Date
- End Date
- Banner
- Associated Services

Buttons:
- Save Draft
- Submit Campaign

Statuses:
- Pending Review
- Approved
- Active

8. Content Upload
Content types:
- Posters
- Videos
- Banners
- Thumbnails
- Flyers

Features:
- Drag and drop upload
- Preview assets
- Upload progress

Statuses:
- Pending Review
- Approved
- Rejected

9. Asset Library
Grid view showing:
- Asset Preview
- Asset Name
- Type
- Approval Status

Filters:
- Images
- Videos
- Posters
- Banners
- Thumbnails

Rule:
Only approved assets should be selectable for live sessions.

10. Live Session Management
Session list showing:
- Session Title
- Campaign
- Date
- Status

Button:
- Create Live Session

11. Create Live Session
Fields:
- Session Title
- Description
- Campaign
- Host
- Guest Speakers
- Featured Services
- Thumbnail
- Date
- Time
- Duration

Settings:
- Waiting Room Enabled
- Enable Countdown Timer
- Enable Reminders

Buttons:
- Save Draft
- Submit For Approval

12. Live Session Details
Display:
- Session Banner
- Host
- Guest Speakers
- Campaign
- Featured Services
- Session Status

Actions:
- Edit
- Duplicate
- Preview Waiting Room

13. Waiting Room Preview
Display:
- Session Banner
- Countdown Timer
- Host Information
- Session Description
- Featured Services
- Reminder Button

CTA:
- Session Starts Soon

14. Go Live Screen
Display:
- Session Information
- Host Panel
- Guest Speaker Panel
- Live Chat Area
- Viewer Counter

Actions:
- Start Session
- End Session

Use a livestream dashboard layout inspired by StreamYard or Riverside.

Global requirements:
- Full page layouts
- Reusable components
- Navigation
- Responsive design
- Empty states
- Loading states
- Success states
- Approval status indicators
- Mock data only
- FaithHub Provider branding throughout

Design tone:
- Premium SaaS
- Faith-centered
- Calm, modern, and trustworthy
- Strong hierarchy
- Clear call-to-action buttons
- Soft backgrounds and clean card surfaces

Focus entirely on the FaithHub Provider journey from registration to go live.
Keep the flow coherent with the existing provider shell and approval-driven workspace.
