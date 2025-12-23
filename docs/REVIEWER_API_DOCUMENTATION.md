# Reviewer API Documentation

## Overview
This documentation covers all APIs available for **Reviewers** (employees with `REVIEWER` or `MANAGER` role) in the KWSC Backend system. Reviewers can manage site verifications, support tickets, and user data.

**Base URL**: `http://localhost:3000` (or your server URL)

---

## Table of Contents
1. [Authentication](#authentication)
2. [Site Verification & Review Module](#site-verification--review-module)
3. [Support Ticket Management Module](#support-ticket-management-module)
4. [User Management Module](#user-management-module)
5. [Dashboard Module](#dashboard-module)
6. [Error Handling](#error-handling)
7. [Enums & Constants](#enums--constants)

---

## Authentication

### Employee Login
**POST** `/employee/login`

Authenticate as a reviewer/employee to get access token.

**Request Body:**
```json
{
  "username": "reviewer@kwsc.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "role": "REVIEWER",
    "employee": {
      "id": "uuid",
      "fullName": "John Doe",
      "email": "reviewer@kwsc.com",
      "role": "REVIEWER",
      "status": "ACTIVE"
    }
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid credentials
- `400 Bad Request`: Missing username or password

**Usage:**
```javascript
// Store token for subsequent requests
const response = await fetch('/employee/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password })
});
const { data } = await response.json();
localStorage.setItem('reviewerToken', data.token);
```

**Note:** Include the token in all subsequent requests:
```
Authorization: Bearer <token>
```

---

## Site Verification & Review Module

### 1. Get Pending Reviews
**GET** `/employee/reviews/pending`

Get all pending site verification cases that need review.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "case-uuid",
      "siteId": "site-uuid",
      "status": "PENDING_REVIEW",
      "priority": "NORMAL",
      "createdAt": "2025-01-15T10:00:00Z",
      "site": {
        "id": "site-uuid",
        "houseNo": "123",
        "street": "Main Street",
        "area": { "id": 1, "name": "Gulshan-e-Iqbal" },
        "block": { "id": 1, "name": "Block 1" }
      }
    }
  ]
}
```

---

### 2. Get Review Details
**GET** `/employee/reviews/:reviewId`

Get complete details of a specific review case including all user data, documents, and bills.

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `reviewId` (string, required): Review case ID

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "case-uuid",
    "siteId": "site-uuid",
    "status": "UNDER_REVIEW",
    "priority": "HIGH",
    "currentAssigneeEmployeeId": "employee-uuid",
    "site": {
      "id": "site-uuid",
      "houseNo": "123",
      "street": "Main Street",
      "area": { "id": 1, "name": "Gulshan-e-Iqbal" },
      "block": { "id": 1, "name": "Block 1" },
      "documents": [
        {
          "id": "doc-uuid",
          "type": "SSGC_BILL",
          "fileUri": "https://storage.googleapis.com/...",
          "uploadedBy": { "id": "user-uuid", "firstName": "John" }
        }
      ],
      "memberships": [
        {
          "id": "membership-uuid",
          "isActive": true,
          "user": {
            "id": "user-uuid",
            "firstName": "John",
            "lastName": "Doe",
            "email": "john@example.com",
            "primaryPhone": "+923001234567",
            "cnic": "42101-1234567-1",
            "documents": [
              {
                "id": "doc-uuid",
                "type": "KE_BILL",
                "fileUri": "https://storage.googleapis.com/..."
              }
            ],
            "currentSite": {
              "id": "site-uuid",
              "houseNo": "123",
              "documents": [...]
            }
          }
        }
      ],
      "createdBy": {
        "id": "user-uuid",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com"
      }
    },
    "assignee": {
      "id": "employee-uuid",
      "fullName": "Reviewer Name"
    },
    "events": [
      {
        "id": "event-uuid",
        "action": "SUBMIT_FOR_REVIEW",
        "fromStatus": null,
        "toStatus": "PENDING_REVIEW",
        "note": "Submitted for review",
        "createdAt": "2025-01-15T10:00:00Z"
      }
    ]
  }
}
```

**Error Responses:**
- `404 Not Found`: Review case not found
- `401 Unauthorized`: Invalid or missing token

---

### 3. Get Assigned Reviews
**GET** `/employee/reviews/assigned`

Get all reviews assigned to the current reviewer.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "case-uuid",
      "siteId": "site-uuid",
      "status": "UNDER_REVIEW",
      "currentAssigneeEmployeeId": "employee-uuid",
      "site": {
        "id": "site-uuid",
        "houseNo": "123",
        "area": { "name": "Gulshan-e-Iqbal" },
        "block": { "name": "Block 1" }
      }
    }
  ]
}
```

---

### 4. Assign Review to Self
**POST** `/employee/reviews/:reviewId/assign`

Assign a review case to yourself.

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `reviewId` (string, required): Review case ID

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "case-uuid",
    "currentAssigneeEmployeeId": "employee-uuid",
    "status": "UNDER_REVIEW"
  }
}
```

**Error Responses:**
- `404 Not Found`: Review case not found
- `400 Bad Request`: Case already assigned

---

### 5. Unassign Review
**POST** `/employee/reviews/:reviewId/unassign`

Unassign a review case from yourself.

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `reviewId` (string, required): Review case ID

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "case-uuid",
    "currentAssigneeEmployeeId": null,
    "status": "PENDING_REVIEW"
  }
}
```

---

### 6. Review Action (Approve/Reject)
**POST** `/employee/reviews/:reviewId/action`

Approve or reject a site verification case.

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `reviewId` (string, required): Review case ID

**Request Body:**
```json
{
  "action": "approve",  // or "reject"
  "notes": "All documents verified. Site approved."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "case-uuid",
    "status": "APPROVED",
    "site": {
      "id": "site-uuid",
      "status": "APPROVED"
    }
  }
}
```

**Error Responses:**
- `404 Not Found`: Review case not found
- `400 Bad Request`: Invalid action (must be "approve" or "reject")

---

### 7. Get Review History
**GET** `/employee/reviews/history`

Get review history with complete user data including bills and documents.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `siteId` (string, optional): Filter by site ID
- `employeeId` (string, optional): Filter by employee ID
- `status` (string, optional): Filter by status (PENDING_REVIEW, UNDER_REVIEW, APPROVED, REJECTED)
- `limit` (number, optional): Number of results (default: 50)
- `offset` (number, optional): Pagination offset (default: 0)

**Example:**
```
GET /employee/reviews/history?status=APPROVED&limit=20&offset=0
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "case-uuid",
      "siteId": "site-uuid",
      "status": "APPROVED",
      "site": {
        "id": "site-uuid",
        "houseNo": "123",
        "documents": [
          {
            "id": "doc-uuid",
            "type": "SSGC_BILL",
            "fileUri": "https://storage.googleapis.com/...",
            "createdAt": "2025-01-15T10:00:00Z"
          }
        ],
        "memberships": [
          {
            "user": {
              "id": "user-uuid",
              "firstName": "John",
              "lastName": "Doe",
              "documents": [
                {
                  "id": "doc-uuid",
                  "type": "KE_BILL",
                  "fileUri": "https://storage.googleapis.com/..."
                }
              ],
              "currentSite": {
                "documents": [...]
              }
            }
          }
        ]
      },
      "assignee": {
        "id": "employee-uuid",
        "fullName": "Reviewer Name"
      }
    }
  ]
}
```

---

### 8. Get Review Statistics
**GET** `/employee/reviews/stats`

Get statistics about reviews.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "total": 150,
    "pending": 25,
    "approved": 100,
    "rejected": 20,
    "underReview": 5
  }
}
```

---

### 9. Get Reviewer KPIs
**GET** `/employee/reviews/kpis`

Get personal performance metrics for the current reviewer.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalAssigned": 50,
    "totalReviewed": 45,
    "approved": 40,
    "rejected": 5,
    "todayReviewed": 5,
    "weekReviewed": 20,
    "monthReviewed": 45,
    "averageReviewTime": 3600,  // seconds
    "pendingReviews": 5
  }
}
```

---

## Support Ticket Management Module

### 1. Get Support Ticket Details
**GET** `/employee/supports/:supportId`

Get complete details of a support ticket.

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `supportId` (string, required): Support ticket ID

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "support-uuid",
    "ticketNumber": "COMP-ABC123-XYZ",
    "status": "PENDING",
    "priority": "NORMAL",
    "complaintType": "ADDRESS_ISSUE",
    "grievance": "Wrong address",
    "description": "User entered incorrect address",
    "address": "123 Main Street",
    "user": {
      "id": "user-uuid",
      "firstName": "John",
      "lastName": "Doe",
      "primaryPhone": "+923001234567"
    },
    "site": {
      "id": "site-uuid",
      "houseNo": "123",
      "street": "Main Street"
    },
    "area": { "id": 1, "name": "Gulshan-e-Iqbal" },
    "block": { "id": 1, "name": "Block 1" },
    "createdAt": "2025-01-15T10:00:00Z"
  }
}
```

---

### 2. Update Support Ticket Status
**POST** `/employee/supports/:supportId/update-status`

Update support ticket status. Reviewers can close/open tickets with proper close reason.

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `supportId` (string, required): Support ticket ID

**Request Body:**
```json
{
  "status": "CLOSED",  // PENDING, IN_PROGRESS, RESOLVED, CLOSED, REJECTED
  "closeReason": "RESOLVED",  // Required if status is CLOSED or RESOLVED
  "priority": "HIGH"  // Optional: LOW, NORMAL, HIGH, URGENT
}
```

**Valid Status Values:**
- `PENDING`: Ticket is pending
- `IN_PROGRESS`: Ticket is being worked on
- `RESOLVED`: Ticket has been resolved
- `CLOSED`: Ticket is closed
- `REJECTED`: Ticket is rejected

**Valid Close Reason Values:**
- `RESOLVED`: Issue has been resolved
- `DUPLICATE`: Duplicate ticket
- `INVALID`: Invalid ticket
- `OUT_OF_SCOPE`: Out of scope
- `USER_REQUESTED`: User requested closure
- `NO_RESPONSE`: No response from user
- `RESOLVED_EXTERNALLY`: Resolved externally
- `OTHER`: Other reason

**Valid Priority Values:**
- `LOW`: Low priority
- `NORMAL`: Normal priority (default)
- `HIGH`: High priority
- `URGENT`: Urgent priority

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "support-uuid",
    "status": "CLOSED",
    "closeReason": "RESOLVED",
    "priority": "HIGH",
    "resolvedBy": "employee-uuid",
    "resolvedAt": "2025-01-15T10:00:00Z",
    "user": {
      "id": "user-uuid",
      "firstName": "John",
      "lastName": "Doe"
    }
  }
}
```

**Error Responses:**
- `404 Not Found`: Support ticket not found
- `400 Bad Request`: Invalid status or missing closeReason when required
- `400 Bad Request`: Invalid closeReason or priority value

**Example:**
```javascript
// Close a ticket
await fetch(`/employee/supports/${supportId}/update-status`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    status: 'CLOSED',
    closeReason: 'RESOLVED',
    priority: 'HIGH'
  })
});
```

---

### 3. Get Support Ticket Statistics
**GET** `/employee/supports/stats`

Get statistics about support tickets.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "total": 200,
    "pending": 50,
    "inProgress": 30,
    "resolved": 100,
    "closed": 15,
    "rejected": 5
  }
}
```

---

## User Management Module

### 1. Get All Users
**GET** `/employee/users`

Get list of all users (with pagination).

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit` (number, optional): Number of results (default: 50)
- `offset` (number, optional): Pagination offset (default: 0)
- `status` (string, optional): Filter by user status
- `userType` (string, optional): Filter by user type (CONSUMER, NON_CONSUMER)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "user-uuid",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "primaryPhone": "+923001234567",
      "userType": "CONSUMER",
      "onboardingStage": "A2",
      "status": "ACTIVE",
      "createdAt": "2025-01-15T10:00:00Z"
    }
  ]
}
```

---

### 2. Get User Details
**GET** `/employee/users/:userId`

Get complete details of a specific user.

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `userId` (string, required): User ID

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "primaryPhone": "+923001234567",
    "cnic": "42101-1234567-1",
    "userType": "CONSUMER",
    "onboardingStage": "A2",
    "status": "ACTIVE",
    "consumerNo": "123456",
    "createdAt": "2025-01-15T10:00:00Z"
  }
}
```

---

### 3. Get User's Sites
**GET** `/employee/users/:userId/sites`

Get all sites associated with a user.

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `userId` (string, required): User ID

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "site-uuid",
      "houseNo": "123",
      "street": "Main Street",
      "status": "APPROVED",
      "area": { "id": 1, "name": "Gulshan-e-Iqbal" },
      "block": { "id": 1, "name": "Block 1" }
    }
  ]
}
```

---

### 4. Get User's Support Tickets
**GET** `/employee/users/:userId/support-tickets`

Get all support tickets created by a user.

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `userId` (string, required): User ID

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "support-uuid",
      "ticketNumber": "COMP-ABC123-XYZ",
      "status": "PENDING",
      "complaintType": "ADDRESS_ISSUE",
      "description": "Wrong address",
      "createdAt": "2025-01-15T10:00:00Z"
    }
  ]
}
```

---

### 5. Get User's Documents
**GET** `/employee/users/:userId/documents`

Get all documents uploaded by a user.

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `userId` (string, required): User ID

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "doc-uuid",
      "type": "SSGC_BILL",
      "fileUri": "https://storage.googleapis.com/...",
      "createdAt": "2025-01-15T10:00:00Z"
    }
  ]
}
```

---

## Dashboard Module

### 1. Get Dashboard Metrics
**GET** `/employee/dashboard/metrics`

Get dashboard metrics for reviewers.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "pendingReviews": 25,
    "assignedReviews": 10,
    "pendingTickets": 15,
    "resolvedToday": 5,
    "totalUsers": 1000,
    "activeUsers": 800
  }
}
```

---

### 2. Get Recent Activity
**GET** `/employee/dashboard/recent-activity`

Get recent activity feed.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit` (number, optional): Number of results (default: 20)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "type": "REVIEW_APPROVED",
      "message": "Site verification approved",
      "siteId": "site-uuid",
      "createdAt": "2025-01-15T10:00:00Z"
    }
  ]
}
```

---

## Error Handling

All APIs return errors in the following format:

```json
{
  "success": false,
  "error": "ERROR_CODE",
  "message": "Human-readable error message"
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or missing authentication token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `DATABASE_ERROR` | 500 | Database operation failed |
| `BAD_REQUEST` | 400 | Invalid request |

### Example Error Response:
```json
{
  "success": false,
  "error": "NOT_FOUND",
  "message": "Review case not found"
}
```

---

## Enums & Constants

### Support Complaint Types
- `ADDRESS_ISSUE`: User entered wrong address
- `SITE_INFORMATION_ERROR`: Site information is incorrect
- `AREA_BLOCK_NOT_FOUND`: Area or block doesn't exist
- `REGISTRATION_ISSUE`: Registration-related issue
- `DOCUMENT_VERIFICATION_ISSUE`: Document verification problem
- `SITE_CLAIM_ISSUE`: Site claim issue
- `LOCATION_CORRECTION`: Location needs correction
- `OTHER`: Other issues

### Support Status
- `PENDING`: Ticket is pending
- `IN_PROGRESS`: Ticket is being worked on
- `RESOLVED`: Ticket has been resolved
- `CLOSED`: Ticket is closed
- `REJECTED`: Ticket is rejected

### Support Priority
- `LOW`: Low priority
- `NORMAL`: Normal priority (default)
- `HIGH`: High priority
- `URGENT`: Urgent priority

### Support Close Reason
- `RESOLVED`: Issue has been resolved
- `DUPLICATE`: Duplicate ticket
- `INVALID`: Invalid ticket
- `OUT_OF_SCOPE`: Out of scope
- `USER_REQUESTED`: User requested closure
- `NO_RESPONSE`: No response from user
- `RESOLVED_EXTERNALLY`: Resolved externally
- `OTHER`: Other reason

### Site Status
- `SUBMITTED`: Site submitted
- `PENDING_REVIEW`: Pending review
- `UNDER_REVIEW`: Under review
- `APPROVED`: Approved
- `REJECTED`: Rejected
- `SUSPENDED`: Suspended
- `ARCHIVED`: Archived

### Document Types
- `SSGC_BILL`: SSGC utility bill
- `KE_BILL`: K-Electric utility bill
- `CNIC_FRONT`: CNIC front side
- `CNIC_BACK`: CNIC back side
- `OTHER`: Other document

---

## Quick Reference

### Authentication Flow
1. **Login**: `POST /employee/login` → Get token
2. **Use Token**: Include `Authorization: Bearer <token>` in all requests

### Common Workflows

#### Review a Site
1. Get pending reviews: `GET /employee/reviews/pending`
2. Assign to self: `POST /employee/reviews/:reviewId/assign`
3. Get review details: `GET /employee/reviews/:reviewId`
4. Approve/Reject: `POST /employee/reviews/:reviewId/action`

#### Manage Support Ticket
1. Get ticket details: `GET /employee/supports/:supportId`
2. Update status: `POST /employee/supports/:supportId/update-status`

#### View User Data
1. Get user details: `GET /employee/users/:userId`
2. Get user documents: `GET /employee/users/:userId/documents`
3. Get user sites: `GET /employee/users/:userId/sites`

---

## Notes for Frontend Developers

1. **Token Storage**: Store the JWT token securely (localStorage/sessionStorage) after login
2. **Token Expiry**: Handle token expiry (401 errors) and redirect to login
3. **Error Handling**: Always check `success` field in response before accessing `data`
4. **Pagination**: Use `limit` and `offset` for paginated endpoints
5. **Loading States**: Show loading indicators for async operations
6. **Form Validation**: Validate enums (status, priority, closeReason) on frontend before submission
7. **File URLs**: Document `fileUri` fields contain GCS URLs - use them directly in `<img>` or `<a>` tags

---

## Support

For questions or issues, contact the backend team.

**Last Updated**: January 2025

