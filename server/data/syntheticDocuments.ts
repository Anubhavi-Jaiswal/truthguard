import { Document } from '../../shared/types';

export const SYNTHETIC_DOCUMENTS: Document[] = [
  // --- Category A: HR Policies ---
  {
    id: 'hr-leave-v1',
    title: 'HR Policy: Annual and Casual Leave Guidelines (v1.0)',
    category: 'HR',
    version: '1.0',
    publishedAt: '2024-01-10',
    effectiveFrom: '2024-01-15',
    effectiveTo: '2024-10-31',
    sourceType: 'synthetic',
    content: `HR Policy: Annual and Casual Leave Guidelines
Document Version: 1.0
Effective Date: January 15, 2024

Section 1: Casual Leave Entitlement
Full-time permanent employees receive 12 casual leave days per calendar year. Casual leave cannot be carried forward to the following calendar year. Any unused casual leave days at the end of December 31 will automatically lapse without financial encashment.

Section 2: Application Procedure
Casual leave requests must be submitted at least 2 working days in advance via the HR portal. For medical or emergency absences exceeding 2 consecutive days, a doctor's certificate is required upon return.

Section 3: Probationary Employees
Probationary employees accrue casual leave on a pro-rata basis of 1 day per completed month of service during their 6-month probationary period.`
  },
  {
    id: 'hr-leave-v2',
    title: 'HR Policy: Annual and Casual Leave Guidelines (v2.0)',
    category: 'HR',
    version: '2.0',
    publishedAt: '2024-10-25',
    effectiveFrom: '2024-11-01',
    effectiveTo: '2025-03-31',
    supersedes: ['hr-leave-v1'],
    sourceType: 'synthetic',
    content: `HR Policy: Annual and Casual Leave Guidelines
Document Version: 2.0
Effective Date: November 01, 2024
Supersedes: HR Policy v1.0 (January 2024)

Section 1: Casual Leave Entitlement
To support employee wellbeing and work-life balance, full-time permanent employees receive 15 casual leave days per calendar year. Unused casual leave cannot be carried forward to the following calendar year and will lapse on December 31.

Section 2: Notice Period
Casual leave of up to 2 days may be requested with 24 hours notice. Requests for 3 or more consecutive casual leave days require 5 business days advance notification and department head approval.

Section 3: Carry-Over Restrictions
Casual leave cannot be encashed or transferred. Unused leave balances expire at midnight on December 31.`
  },
  {
    id: 'hr-leave-amendment-2025',
    title: 'Executive HR Amendment: Revised Leave Entitlement 2025',
    category: 'HR',
    version: '2025-A1',
    publishedAt: '2025-03-15',
    effectiveFrom: '2025-04-01',
    supersedes: ['hr-leave-v1', 'hr-leave-v2'],
    sourceType: 'synthetic',
    content: `Executive HR Amendment: Revised Leave Entitlement
Document Version: 2025-A1
Effective Date: April 01, 2025
Target: Annual Casual Leave Quota

Section 1: Revised Casual Leave Quota
Effective April 1, 2025, the annual casual leave entitlement becomes 18 days for all permanent full-time personnel. This amendment explicitly supersedes and invalidates all earlier casual leave entitlement provisions outlined in HR Policy v1.0 and HR Policy v2.0.

Section 2: Mid-Year Transition Rule
For the period from January 1, 2025 through March 31, 2025, the governing entitlement remains 15 days on an annualized basis under Policy v2.0. The additional 3 days will be credited to active employee accounts on April 1, 2025.

Section 3: Emergency Leave Provisions
Employees may utilize up to 4 days of their 18-day entitlement without prior notice in documented family or personal medical emergencies.`
  },
  {
    id: 'hr-remote-work',
    title: 'HR Policy: Hybrid and Remote Work Arrangements',
    category: 'HR',
    version: '1.2',
    publishedAt: '2024-06-01',
    effectiveFrom: '2024-06-15',
    sourceType: 'synthetic',
    content: `HR Policy: Hybrid and Remote Work Arrangements
Document Version: 1.2
Effective Date: June 15, 2024

Section 1: Hybrid Work Schedule
Eligible employees in corporate roles may work remotely up to two days per week, subject to direct manager approval. Core in-office collaboration days are Tuesday and Thursday.

Section 2: Equipment Allowance
Remote employees are provided with an ergonomic home-office stipend of ₹25,000 as a one-time reimbursement upon completion of 90 days of employment.

Section 3: Working Hours and Availability
Remote workers must be reachable and available on company communication channels (Slack and email) during standard core business hours: 10:00 AM to 5:00 PM IST.`
  },

  // --- Category B: IT Security Policies ---
  {
    id: 'it-sec-pwd-2023',
    title: 'IT Security Standard: User Authentication and Password Policy',
    category: 'IT_SECURITY',
    version: '2.4',
    publishedAt: '2023-08-10',
    effectiveFrom: '2023-09-01',
    sourceType: 'synthetic',
    content: `IT Security Standard: User Authentication and Password Policy
Document Version: 2.4
Effective Date: September 01, 2023

Section 1: Password Rotation Schedule
Password rotation is required every 90 days for all domain accounts, service accounts, and administrative users. Automated notification emails are triggered at 14 days, 7 days, and 1 day prior to expiration.

Section 2: Password Complexity Requirements
Passwords must be a minimum of 12 characters in length. Passwords must contain at least one numeral (0-9) and at least one special character (!@#$%^&*). Passwords cannot match any of the previous 6 historical passwords used.
Note: While uppercase letters are recommended as best practice, uppercase character enforcement is not mandated in this standard.

Section 3: Account Lockout
Accounts are automatically locked after 5 consecutive failed login attempts within a 15-minute window. Account unlock requires an IT Helpdesk ticket or manager verification.`
  },
  {
    id: 'it-sec-laptop-2024',
    title: 'IT Asset Management: Device Encryption and Endpoint Protection',
    category: 'IT_SECURITY',
    version: '3.1',
    publishedAt: '2024-09-12',
    effectiveFrom: '2024-10-01',
    sourceType: 'synthetic',
    content: `IT Asset Management: Device Encryption and Endpoint Protection
Document Version: 3.1
Effective Date: October 01, 2024

Section 1: Full Disk Encryption
All corporate laptops, workstations, and mobile devices containing company data must have full disk encryption enabled using BitLocker (Windows) with AES-256 or FileVault (macOS). Recovery keys are managed centrally via Microsoft Intune.

Section 2: Endpoint Detection and Response (EDR)
CrowdStrike Falcon endpoint sensor must remain installed and active at all times on all corporate devices. Users are strictly prohibited from disabling or tampering with security agents.

Section 3: Device Disposal and Decommissioning
Prior to disposal or reassignment, all storage drives must undergo cryptographic erasure complying with NIST SP 800-88 standards followed by an IT asset management signoff.`
  },
  {
    id: 'it-sec-access-cloud',
    title: 'Cloud Infrastructure and VPN Access Security Policy',
    category: 'IT_SECURITY',
    version: '1.5',
    publishedAt: '2024-04-18',
    effectiveFrom: '2024-05-01',
    sourceType: 'synthetic',
    content: `Cloud Infrastructure and VPN Access Security Policy
Document Version: 1.5
Effective Date: May 01, 2024

Section 1: Multi-Factor Authentication (MFA)
MFA via hardware security keys (FIDO2/WebAuthn) or time-based one-time password (TOTP) apps is mandatory for all access to AWS, Azure, Google Workspace, and company VPNs. SMS-based OTP verification is strictly prohibited.

Section 2: Session Lifetime and Timeout
Administrative cloud console sessions expire automatically after 60 minutes of inactivity. CLI access tokens must not exceed an 8-hour maximum lifetime before re-authentication is enforced.

Section 3: Zero Trust Network Access
All remote engineering access to staging and production clusters must route through the enterprise Zero Trust Network Access (ZTNA) gateway. Direct public IP exposure is forbidden.`
  },
  {
    id: 'it-sec-data-retention',
    title: 'Data Classification and Document Retention Guideline',
    category: 'IT_SECURITY',
    version: '2.0',
    publishedAt: '2023-11-20',
    effectiveFrom: '2023-12-01',
    sourceType: 'synthetic',
    content: `Data Classification and Document Retention Guideline
Document Version: 2.0
Effective Date: December 01, 2023

Section 1: Data Classification Tiers
Corporate information is classified into four tiers: Public, Internal, Confidential, and Highly Restricted. Customer personally identifiable information (PII) is classified as Highly Restricted.

Section 2: Financial and Audit Records Retention
Financial transaction records, audit trails, and tax filings must be retained for a mandatory statutory period of 7 years following the close of the corresponding financial fiscal year.

Section 3: Secure Destruction
Physical documents containing Confidential or Highly Restricted data must be cross-shredded (DIN 66399 Level P-4 or higher). Digital storage media must be degaussed or physically destroyed.`
  },

  // --- Category C: Expense Reimbursement Policies (Deliberate Contradictions & Limits) ---
  {
    id: 'expense-corp-2024a',
    title: 'Corporate Travel and Entertainment Expense Policy (Operations Manual A)',
    category: 'EXPENSE',
    version: '4.2',
    publishedAt: '2024-02-14',
    effectiveFrom: '2024-03-01',
    sourceType: 'synthetic',
    content: `Corporate Travel and Entertainment Expense Policy (Operations Manual A)
Document Version: 4.2
Effective Date: March 01, 2024

Section 1: Daily Meal Allowance
Meal reimbursement is capped at ₹800 per day for domestic business travel within tier-1 and tier-2 cities. Itemized receipts detailing food items and taxes must accompany every expense claim. Alcohol is not reimbursable under any circumstances.

Section 2: Lodging Allowances
Hotel accommodation reimbursement is capped at ₹4,500 per night for standard business travel. Bookings must be made through the approved corporate travel booking portal.

Section 3: Mileage and Local Transport
Personal vehicle usage for business meetings is reimbursable at ₹10 per kilometer for four-wheelers and ₹5 per kilometer for two-wheelers, supported by odometer readings.`
  },
  {
    id: 'expense-field-2024b',
    title: 'Travel, Lodging and Sustenance Guidelines (Field Staff Manual B)',
    category: 'EXPENSE',
    version: '3.0',
    publishedAt: '2024-04-10',
    effectiveFrom: '2024-05-01',
    sourceType: 'synthetic',
    content: `Travel, Lodging and Sustenance Guidelines (Field Staff Manual B)
Document Version: 3.0
Effective Date: May 01, 2024

Section 1: Daily Sustenance and Meal Caps
Meal reimbursement is capped at ₹1,200 per day for all personnel traveling on commercial client engagements. Claims must be submitted within 15 days of the travel date with original merchant receipts.

Section 2: Incidental Allowances
A flat incidental expense of ₹300 per day is permitted for laundry and local communications on business trips lasting longer than 4 consecutive nights.

Section 3: Submission Deadlines
All expense reports must be submitted via the finance portal by the 25th of the month following travel. Failure to submit within 30 days forfeits reimbursement.`
  },
  {
    id: 'expense-flight-policy',
    title: 'Air Travel Class and Booking Pre-Approval Directive',
    category: 'EXPENSE',
    version: '1.8',
    publishedAt: '2024-07-01',
    effectiveFrom: '2024-07-15',
    sourceType: 'synthetic',
    content: `Air Travel Class and Booking Pre-Approval Directive
Document Version: 1.8
Effective Date: July 15, 2024

Section 1: Domestic Air Travel
All domestic flights must be booked in Economy Class at the lowest logical fare available within a 2-hour window of the requested departure time. Premium Economy or Business Class bookings require prior written authorization from the Chief Financial Officer.

Section 2: International Air Travel
For continuous international flight durations exceeding 8 hours, travelers at Director level and above are permitted to book Business Class. All other international travel must be booked in Economy or Premium Economy.

Section 3: Advance Booking Requirement
Flight reservations must be booked at least 14 days in advance for domestic travel and 21 days for international travel. Last-minute bookings incur an audit flag requiring Department Head justification.`
  },
  {
    id: 'expense-mobile-broadband',
    title: 'Telecommunication and Home Broadband Subsidy Policy',
    category: 'EXPENSE',
    version: '2.1',
    publishedAt: '2023-10-05',
    effectiveFrom: '2023-11-01',
    sourceType: 'synthetic',
    content: `Telecommunication and Home Broadband Subsidy Policy
Document Version: 2.1
Effective Date: November 01, 2023

Section 1: Mobile Phone Reimbursement
Employees designated in on-call, sales, or managerial roles are eligible for monthly mobile bill reimbursement capped at ₹1,500 per billing cycle. Claims must include the service provider's GST invoice.

Section 2: High-Speed Internet Subsidy
Full-time remote staff approved under HR Hybrid arrangements may claim up to ₹1,000 per month towards residential high-speed fiber broadband.

Section 3: Hardware Accessories
Headsets, webcams, and mobile handsets are not eligible for monthly recurring reimbursement and must be procured directly through corporate IT procurement channels.`
  }
];
