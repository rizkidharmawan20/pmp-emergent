# API Specification for Challenge Platform Backend (Node.js)

> **Note:**
> - Semua endpoint RESTful menggunakan konvensi plural dan resource-oriented.
> - Response selalu mengandung field `success` dan jika gagal, field `error` (string/array).
> - Status code HTTP dijelaskan di setiap endpoint.
> - Semua waktu dalam format ISO 8601 (UTC).
> - Field boolean menggunakan camelCase.
> - Model data diperjelas dan konsisten.
> - Endpoint list mendukung **pagination**, **filtering**, dan **sorting** (lihat penjelasan di bawah).

---

## Pagination, Filtering, and Sorting

Untuk endpoint list (challenges, submissions, transactions, notifications), gunakan query parameter berikut:

- `page` (number, default: 1): halaman ke berapa
- `limit` (number, default: 20, max: 100): jumlah item per halaman
- `sortBy` (string, default: "createdAt"): field untuk sorting
- `sortOrder` (string, default: "desc"): "asc" atau "desc"
- Filtering: gunakan query param sesuai field, misal `status=active`, `category=Fashion`, dsb

**Contoh:**
```
GET /api/challenges?page=2&limit=10&sortBy=startDate&sortOrder=asc&status=active&category=Fashion
```

**Response Pagination Format:**
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 2,
    "limit": 10,
    "totalItems": 35,
    "totalPages": 4
  }
}
```

---

## Authentication & User Management

### Register
- **POST** `/api/auth/register`
- **Description:** Register akun baru.
- **Status Code:** 201 Created (success), 400 Bad Request (validation error)
#### Request Body
```json
{
  "name": "Jane Smith",           // required, min 3 chars, max 50 chars
  "email": "jane@example.com",    // required, valid email format
  "password": "password123",      // required, min 6 chars
  "role": "clipper"               // required, enum: ["clipper", "creator"]
}
```
#### Success Response
```json
{
  "success": true,
  "user": { ...user object... },
  "token": "jwt-token"
}
```
#### Error Response (Validasi)
```json
{
  "success": false,
  "error": [
    "Name is required and must be at least 3 characters.",
    "Email must be a valid email address.",
    "Password must be at least 6 characters.",
    "Role must be either 'clipper' or 'creator'."
  ]
}
```

---

### Login
- **POST** `/api/auth/login`
- **Description:** Login user.
- **Status Code:** 200 OK (success), 401 Unauthorized (invalid credentials), 400 Bad Request (validasi)
#### Request Body
```json
{
  "email": "jane@example.com",    // required, valid email format
  "password": "password123"       // required
}
```
#### Success Response
```json
{
  "success": true,
  "user": { ...user object... },
  "token": "jwt-token"
}
```
#### Error Response (Validasi)
```json
{
  "success": false,
  "error": [
    "Email is required.",
    "Password is required."
  ]
}
```
#### Error Response (Auth)
```json
{
  "success": false,
  "error": "Invalid email or password"
}
```

---

### Get Profile
- **GET** `/api/users/me`
- **Headers:** `Authorization: Bearer <token>`
- **Description:** Mendapatkan profil user yang sedang login.
- **Status Code:** 200 OK, 401 Unauthorized
#### Success Response
```json
{ ...user object... }
```

---

### Update Profile
- **PUT** `/api/users/me`
- **Description:** Update profil user.
- **Status Code:** 200 OK, 400 Bad Request
#### Request Body
```json
{
  "name": "Jane Smith",           // optional, min 3 chars, max 50 chars
  "avatar": "https://..."         // optional, valid URL
}
```
#### Success Response
```json
{
  "success": true,
  "user": { ...user object... }
}
```
#### Error Response
```json
{
  "success": false,
  "error": [
    "Name must be at least 3 characters.",
    "Avatar must be a valid URL."
  ]
}
```

---

### Connect Social Account
- **POST** `/api/users/me/social`
- **Description:** Connect akun sosial media.
- **Status Code:** 200 OK, 400 Bad Request
#### Request Body
```json
{
  "platform": "instagram" // required, enum: ["instagram", "tiktok"]
}
```
#### Success Response
```json
{
  "success": true,
  "user": { ...user object... }
}
```
#### Error Response
```json
{
  "success": false,
  "error": ["Platform must be either 'instagram' or 'tiktok'."]
}
```

---

## Challenge Management

### List Challenges
- **GET** `/api/challenges`
- **Description:** List semua challenge. Mendukung pagination, filtering, dan sorting.
- **Query Params:** `page`, `limit`, `sortBy`, `sortOrder`, `status`, `category`, `creatorId`, dsb
- **Status Code:** 200 OK
#### Success Response
```json
{
  "success": true,
  "challenges": [ ...challenge object... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalItems": 35,
    "totalPages": 2
  }
}
```

---

### Create Challenge
- **POST** `/api/challenges`
- **Description:** Buat challenge baru (hanya creator).
- **Status Code:** 201 Created, 400 Bad Request
#### Request Body
```json
{
  "title": "Summer Fashion Challenge",   // required, min 5 chars, max 100 chars
  "description": "Show off your best...", // required, min 10 chars
  "rules": "Must include #SummerFashion...", // required
  "mediaUrl": "https://...",             // optional, valid URL
  "budget": 1000000,                      // required, min 1
  "rewardRate": 1000,                     // required, min 1
  "startDate": "2024-07-01",             // required, ISO 8601
  "endDate": "2024-07-31",               // required, ISO 8601
  "category": "Fashion"                  // required
}
```
#### Success Response
```json
{
  "success": true,
  "challenge": { ...challenge object... }
}
```
#### Error Response
```json
{
  "success": false,
  "error": [
    "Title is required and must be at least 5 characters.",
    "Budget must be greater than 0.",
    "Start date must be before end date."
  ]
}
```

---

### Get Challenge Detail
- **GET** `/api/challenges/{id}`
- **Description:** Detail challenge.
- **Status Code:** 200 OK, 404 Not Found
#### Success Response
```json
{
  "success": true,
  "challenge": { ...challenge object... }
}
```
#### Error Response
```json
{
  "success": false,
  "error": "Challenge not found"
}
```

---

### Join Challenge
- **POST** `/api/challenges/{id}/join`
- **Description:** Join challenge (hanya clipper).
- **Status Code:** 200 OK, 400 Bad Request
#### Success Response
```json
{
  "success": true,
  "message": "Joined challenge successfully"
}
```
#### Error Response
```json
{
  "success": false,
  "error": "Already joined"
}
```

---

### Submit to Challenge
- **POST** `/api/challenges/{id}/submissions`
- **Description:** Submit video ke challenge.
- **Status Code:** 201 Created, 400 Bad Request
#### Request Body
```json
{
  "videoUrl": "https://www.instagram.com/p/example1", // required, valid URL
  "platform": "instagram" // required, enum: ["instagram", "tiktok"]
}
```
#### Success Response
```json
{
  "success": true,
  "submission": { ...submission object... }
}
```
#### Error Response
```json
{
  "success": false,
  "error": [
    "Video URL must be a valid URL.",
    "Platform must be either 'instagram' or 'tiktok'."
  ]
}
```

---

### List Submissions for Challenge
- **GET** `/api/challenges/{id}/submissions`
- **Description:** List semua submission untuk challenge tertentu. Mendukung pagination, filtering, dan sorting.
- **Query Params:** `page`, `limit`, `sortBy`, `sortOrder`, `status`, `userId`, dsb
- **Status Code:** 200 OK
#### Success Response
```json
{
  "success": true,
  "submissions": [ ...submission object... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalItems": 100,
    "totalPages": 5
  }
}
```

---

## Wallet & Transactions

### Get Wallet Balance
- **GET** `/api/wallet/balance`
- **Description:** Mendapatkan saldo wallet user.
- **Status Code:** 200 OK
#### Success Response
```json
{
  "success": true,
  "balance": 250000,
  "payoutBalance": 0
}
```

---

### Top Up Wallet
- **POST** `/api/wallet/topup`
- **Description:** Top up saldo wallet.
- **Status Code:** 201 Created, 400 Bad Request
#### Request Body
```json
{
  "amount": 500000,           // required, min 10000
  "method": "bank_transfer"  // required, enum: ["bank_transfer", "credit_card"]
}
```
#### Success Response
```json
{
  "success": true,
  "transaction": { ...transaction object... },
  "balance": 750000
}
```
#### Error Response
```json
{
  "success": false,
  "error": [
    "Amount must be at least 10,000.",
    "Method must be either 'bank_transfer' or 'credit_card'."
  ]
}
```

---

### Request Payout
- **POST** `/api/wallet/payout`
- **Description:** Request payout ke rekening bank.
- **Status Code:** 201 Created, 400 Bad Request
#### Request Body
```json
{
  "amount": 125000,           // required, min 10000
  "bankAccount": "1234567890" // required, valid bank account format
}
```
#### Success Response
```json
{
  "success": true,
  "transaction": { ...transaction object... },
  "payoutBalance": 0
}
```
#### Error Response
```json
{
  "success": false,
  "error": [
    "Amount must be at least 10,000.",
    "Bank account is invalid.",
    "Payout amount exceeds payout balance."
  ]
}
```

---

### List Transactions
- **GET** `/api/wallet/transactions`
- **Description:** List semua transaksi wallet user. Mendukung pagination, filtering, dan sorting.
- **Query Params:** `page`, `limit`, `sortBy`, `sortOrder`, `type`, `status`, dsb
- **Status Code:** 200 OK
#### Success Response
```json
{
  "success": true,
  "transactions": [ ...transaction object... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalItems": 10,
    "totalPages": 1
  }
}
```

---

## Submissions & Analytics

### List My Submissions
- **GET** `/api/submissions`
- **Description:** List semua submission milik user. Mendukung pagination, filtering, dan sorting.
- **Query Params:** `page`, `limit`, `sortBy`, `sortOrder`, `status`, `challengeId`, dsb
- **Status Code:** 200 OK
#### Success Response
```json
{
  "success": true,
  "submissions": [ ...submission object... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalItems": 15,
    "totalPages": 1
  }
}
```

---

### Get Submission Detail
- **GET** `/api/submissions/{id}`
- **Description:** Detail submission.
- **Status Code:** 200 OK, 404 Not Found
#### Success Response
```json
{
  "success": true,
  "submission": { ...submission object... }
}
```
#### Error Response
```json
{
  "success": false,
  "error": "Submission not found"
}
```

---

### Update Submission Status (Admin/Creator)
- **PUT** `/api/submissions/{id}/status`
- **Description:** Update status submission (approve/reject).
- **Status Code:** 200 OK, 400 Bad Request
#### Request Body
```json
{
  "status": "approved" // required, enum: ["approved", "rejected"]
}
```
#### Success Response
```json
{
  "success": true,
  "submission": { ...updated submission object... }
}
```
#### Error Response
```json
{
  "success": false,
  "error": ["Status must be either 'approved' or 'rejected'."]
}
```

---

### Get Submission Analytics
- **GET** `/api/submissions/{id}/analytics`
- **Description:** Mendapatkan analytics submission.
- **Status Code:** 200 OK, 404 Not Found
#### Success Response
```json
{
  "success": true,
  "analytics": {
    "views": 15420,
    "likes": 892,
    "comments": 45,
    "earnings": 15420
  }
}
```
#### Error Response
```json
{
  "success": false,
  "error": "Submission not found"
}
```

---

## Notifications

### List Notifications
- **GET** `/api/notifications`
- **Description:** List semua notifikasi user. Mendukung pagination, filtering, dan sorting.
- **Query Params:** `page`, `limit`, `sortBy`, `sortOrder`, `type`, `read`, dsb
- **Status Code:** 200 OK
#### Success Response
```json
{
  "success": true,
  "notifications": [ ...notification object... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalItems": 5,
    "totalPages": 1
  }
}
```

---

### Mark Notification as Read
- **PUT** `/api/notifications/{id}/read`
- **Description:** Tandai notifikasi sebagai sudah dibaca.
- **Status Code:** 200 OK, 404 Not Found
#### Success Response
```json
{
  "success": true
}
```
#### Error Response
```json
{
  "success": false,
  "error": "Notification not found"
}
```

### Delete Notification
- **DELETE** `/api/notifications/{id}`
- **Description:** Hapus notifikasi.
- **Status Code:** 200 OK, 404 Not Found
#### Success Response
```json
{
  "success": true
}
```
#### Error Response
```json
{
  "success": false,
  "error": "Notification not found"
}
```

---

## Data Models (Reference)

### User
```json
{
  "id": "2",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "role": "clipper",
  "avatar": "https://...",
  "instagramConnected": true,
  "tiktokConnected": true,
  "balance": 0,
  "payoutBalance": 125000,
  "createdAt": "2024-07-01T09:00:00Z",
  "updatedAt": "2024-07-20T09:00:00Z"
}
```

### Challenge
```json
{
  "id": "1",
  "title": "Summer Fashion Challenge",
  "description": "Show off your best summer outfits...",
  "rules": "Must include #SummerFashion...",
  "mediaUrl": "https://...",
  "budget": 1000000,
  "budgetUsed": 350000,
  "rewardRate": 1000,
  "startDate": "2024-07-01",
  "endDate": "2024-07-31",
  "status": "active",
  "creatorId": "1",
  "creatorName": "John Doe",
  "participantCount": 25,
  "submissionCount": 18,
  "category": "Fashion",
  "createdAt": "2024-07-01T09:00:00Z",
  "updatedAt": "2024-07-20T09:00:00Z"
}
```

### Submission
```json
{
  "id": "1",
  "challengeId": "1",
  "userId": "2",
  "userName": "Jane Smith",
  "videoUrl": "https://www.instagram.com/p/example1",
  "platform": "instagram",
  "status": "approved",
  "views": 15420,
  "likes": 892,
  "comments": 45,
  "earnings": 15420,
  "createdAt": "2024-07-10T08:30:00Z",
  "lastTracked": "2024-07-20T14:22:00Z"
}
```

### Transaction
```json
{
  "id": "1",
  "type": "topup",
  "amount": 500000,
  "description": "Wallet Top-up via Bank Transfer",
  "status": "completed",
  "createdAt": "2024-07-01T09:00:00Z"
}
```

### Notification
```json
{
  "id": "1",
  "title": "Challenge Ending Soon",
  "message": "Summer Fashion Challenge ends in 3 days. Submit your entries now!",
  "type": "warning",
  "read": false,
  "createdAt": "2024-07-20T12:00:00Z"
}
``` 