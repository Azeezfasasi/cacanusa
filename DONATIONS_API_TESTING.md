# Donation API - Testing Guide

## Overview

This guide provides examples for testing the Donation Management System API endpoints using curl, Postman, or any HTTP client.

## Base URL

```
http://localhost:3000 (development)
https://yourdomain.com (production)
```

## 1. Create a Donation

### POST /api/donations

#### cURL Example

```bash
curl -X POST http://localhost:3000/api/donations \
  -H "Content-Type: application/json" \
  -d '{
    "donorName": "John Doe",
    "donorEmail": "john@example.com",
    "donorPhone": "+1-555-123-4567",
    "amount": 100,
    "currency": "USD",
    "donationType": "general",
    "paymentMethod": "bank-transfer",
    "referenceNumber": "CHK-12345",
    "donorMessage": "God bless the ministry"
  }'
```

#### JavaScript/Fetch Example

```javascript
const createDonation = async () => {
  const response = await fetch("/api/donations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      donorName: "John Doe",
      donorEmail: "john@example.com",
      donorPhone: "+1-555-123-4567",
      amount: 100,
      currency: "USD",
      donationType: "general",
      paymentMethod: "bank-transfer",
      referenceNumber: "CHK-12345",
      donorMessage: "God bless the ministry",
    }),
  });

  const data = await response.json();
  console.log(data);
};
```

#### Axios Example

```javascript
import axios from "axios";

const createDonation = async () => {
  try {
    const response = await axios.post("/api/donations", {
      donorName: "John Doe",
      donorEmail: "john@example.com",
      donorPhone: "+1-555-123-4567",
      amount: 100,
      currency: "USD",
      donationType: "general",
      paymentMethod: "bank-transfer",
      referenceNumber: "CHK-12345",
      donorMessage: "God bless the ministry",
    });

    console.log("Donation created:", response.data);
  } catch (error) {
    console.error("Error:", error.response.data);
  }
};
```

#### Response Example (Success - 201)

```json
{
  "message": "Donation received successfully",
  "donation": {
    "_id": "507f1f77bcf86cd799439011",
    "donorName": "John Doe",
    "donorEmail": "john@example.com",
    "donorPhone": "+1-555-123-4567",
    "amount": 100,
    "currency": "USD",
    "donationType": "general",
    "paymentMethod": "bank-transfer",
    "transactionId": "DON-1672531200000-ABC12345",
    "referenceNumber": "CHK-12345",
    "status": "pending",
    "receiptSent": false,
    "createdAt": "2023-01-01T12:00:00Z",
    "updatedAt": "2023-01-01T12:00:00Z"
  }
}
```

#### Error Response Example (400)

```json
{
  "error": "Missing required fields"
}
```

---

## 2. Get All Donations (Admin)

### GET /api/donations

#### cURL Example - Get All Donations

```bash
curl -X GET http://localhost:3000/api/donations
```

#### cURL Example - With Filters

```bash
curl -X GET "http://localhost:3000/api/donations?page=1&limit=10&status=confirmed&donationType=general"
```

#### cURL Example - Get Statistics

```bash
curl -X GET "http://localhost:3000/api/donations?stats=true"
```

#### JavaScript Example

```javascript
const getDonations = async (filters = {}) => {
  const params = new URLSearchParams({
    page: filters.page || 1,
    limit: filters.limit || 10,
    ...filters,
  });

  const response = await fetch(`/api/donations?${params}`);
  const data = await response.json();
  console.log(data);
};

// Usage
getDonations({ status: "confirmed", donationType: "building-fund" });
```

#### Axios Example

```javascript
const getDonations = async (page = 1) => {
  try {
    const response = await axios.get("/api/donations", {
      params: {
        page,
        limit: 10,
        status: "confirmed",
      },
    });

    console.log("Donations:", response.data.donations);
    console.log("Pagination:", response.data.pagination);
  } catch (error) {
    console.error("Error:", error.response.data);
  }
};
```

#### Response Example

```json
{
  "donations": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "donorName": "John Doe",
      "donorEmail": "john@example.com",
      "amount": 100,
      "currency": "USD",
      "donationType": "general",
      "status": "pending",
      "createdAt": "2023-01-01T12:00:00Z"
    }
  ],
  "pagination": {
    "total": 15,
    "page": 1,
    "pages": 2,
    "limit": 10
  }
}
```

#### Statistics Response Example

```json
{
  "totalDonations": [
    {
      "_id": null,
      "total": 1500,
      "count": 5
    }
  ],
  "byType": [
    {
      "_id": "general",
      "total": 800,
      "count": 3
    },
    {
      "_id": "building-fund",
      "total": 700,
      "count": 2
    }
  ],
  "byCurrency": [
    {
      "_id": "USD",
      "total": 1500,
      "count": 5
    }
  ],
  "monthlyTrend": [
    {
      "_id": "2023-01",
      "total": 1500,
      "count": 5
    }
  ]
}
```

---

## 3. Get Donation by ID

### GET /api/donations/[id]

#### cURL Example

```bash
curl -X GET http://localhost:3000/api/donations/507f1f77bcf86cd799439011
```

#### JavaScript Example

```javascript
const getDonationById = async (id) => {
  const response = await fetch(`/api/donations/${id}`);
  const data = await response.json();
  console.log(data);
};
```

#### Response Example

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "donorName": "John Doe",
  "donorEmail": "john@example.com",
  "donorPhone": "+1-555-123-4567",
  "donorMessage": "God bless",
  "amount": 100,
  "currency": "USD",
  "donationType": "general",
  "paymentMethod": "bank-transfer",
  "transactionId": "DON-1672531200000-ABC12345",
  "referenceNumber": "CHK-12345",
  "status": "pending",
  "receiptSent": false,
  "createdAt": "2023-01-01T12:00:00Z",
  "updatedAt": "2023-01-01T12:00:00Z"
}
```

---

## 4. Update Donation Status

### PATCH /api/donations/[id]

#### cURL Example - Update Status

```bash
curl -X PATCH http://localhost:3000/api/donations/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "confirmed",
    "notes": "Donation confirmed and processed"
  }'
```

#### JavaScript Example

```javascript
const updateDonationStatus = async (id, status) => {
  const response = await fetch(`/api/donations/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status,
      notes: "Donation confirmed by admin",
    }),
  });

  const data = await response.json();
  console.log(data);
};
```

#### Axios Example

```javascript
const updateDonationStatus = async (id, status) => {
  try {
    const response = await axios.patch(`/api/donations/${id}`, {
      status,
      notes: "Donation confirmed",
    });

    console.log("Updated donation:", response.data);
  } catch (error) {
    console.error("Error:", error.response.data);
  }
};
```

#### Response Example

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "donorName": "John Doe",
  "amount": 100,
  "status": "confirmed",
  "notes": "Donation confirmed and processed",
  "processedAt": "2023-01-02T10:30:00Z"
}
```

---

## 5. Send Receipt Email

### PATCH /api/donations/[id] (with action parameter)

#### cURL Example

```bash
curl -X PATCH http://localhost:3000/api/donations/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "action": "send-receipt"
  }'
```

#### JavaScript Example

```javascript
const sendReceipt = async (id) => {
  const response = await fetch(`/api/donations/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "send-receipt",
    }),
  });

  const data = await response.json();
  console.log(data);
};
```

#### Response Example

```json
{
  "message": "Receipt email sent successfully"
}
```

---

## Common Error Codes

| Code | Message                 | Cause                       |
| ---- | ----------------------- | --------------------------- |
| 400  | Missing required fields | Required field not provided |
| 400  | Invalid email address   | Email format is incorrect   |
| 404  | Donation not found      | Donation ID doesn't exist   |
| 500  | Error creating donation | Server error                |
| 500  | Error sending receipt   | Email service issue         |

---

## Postman Collection

You can import this collection into Postman:

```json
{
  "info": {
    "name": "CANAN USA Donations API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Create Donation",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"donorName\": \"John Doe\",\n  \"donorEmail\": \"john@example.com\",\n  \"donorPhone\": \"+1-555-123-4567\",\n  \"amount\": 100,\n  \"currency\": \"USD\",\n  \"donationType\": \"general\",\n  \"paymentMethod\": \"bank-transfer\",\n  \"referenceNumber\": \"CHK-12345\",\n  \"donorMessage\": \"God bless\"\n}"
        },
        "url": {
          "raw": "{{base_url}}/api/donations",
          "host": ["{{base_url}}"],
          "path": ["api", "donations"]
        }
      }
    },
    {
      "name": "Get All Donations",
      "request": {
        "method": "GET",
        "url": {
          "raw": "{{base_url}}/api/donations?page=1&limit=10",
          "host": ["{{base_url}}"],
          "path": ["api", "donations"],
          "query": [
            {
              "key": "page",
              "value": "1"
            },
            {
              "key": "limit",
              "value": "10"
            }
          ]
        }
      }
    },
    {
      "name": "Get Donation by ID",
      "request": {
        "method": "GET",
        "url": {
          "raw": "{{base_url}}/api/donations/{{donation_id}}",
          "host": ["{{base_url}}"],
          "path": ["api", "donations", "{{donation_id}}"]
        }
      }
    },
    {
      "name": "Update Donation Status",
      "request": {
        "method": "PATCH",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"status\": \"confirmed\",\n  \"notes\": \"Donation confirmed\"\n}"
        },
        "url": {
          "raw": "{{base_url}}/api/donations/{{donation_id}}",
          "host": ["{{base_url}}"],
          "path": ["api", "donations", "{{donation_id}}"]
        }
      }
    },
    {
      "name": "Send Receipt Email",
      "request": {
        "method": "PATCH",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"action\": \"send-receipt\"\n}"
        },
        "url": {
          "raw": "{{base_url}}/api/donations/{{donation_id}}",
          "host": ["{{base_url}}"],
          "path": ["api", "donations", "{{donation_id}}"]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:3000"
    },
    {
      "key": "donation_id",
      "value": ""
    }
  ]
}
```

---

## Testing Checklist

- [ ] Test creating donation with all valid data
- [ ] Test creating donation with missing required fields
- [ ] Test creating donation with invalid email
- [ ] Test creating donation with invalid amount
- [ ] Test fetching all donations
- [ ] Test fetching donations with filters
- [ ] Test fetching statistics
- [ ] Test getting specific donation by ID
- [ ] Test updating donation status to confirmed
- [ ] Test updating donation status to cancelled
- [ ] Test sending receipt email
- [ ] Test pagination
- [ ] Test CSV export functionality
- [ ] Test email delivery

---

## Notes

- Always validate user input on both client and server
- Use HTTPS in production
- Implement rate limiting to prevent abuse
- Add authentication/authorization for admin endpoints
- Keep sensitive data (email passwords) in environment variables
- Monitor API response times and errors
- Regularly backup donation data
