# CabinFit

CabinFit is a full-stack e-commerce application for browsing and purchasing luggage. It combines a React frontend with an ASP.NET Core Web API and a SQL Server database.

## Features

- User registration and authentication using JWT
- Product filtering by category, size, color, and price
- Product sorting and pagination
- Shopping cart and wishlist
- Product ratings
- Discount vouchers
- Stripe payment integration
- Product and inventory management
- Order management and delivery workflows

## Application UI

### Home Page
<img width="1905" height="740" alt="Home Page" src="https://github.com/user-attachments/assets/865bfa5c-d94f-4fa4-af8e-926a80211837" />
<img width="1905" height="869" alt="Home Page" src="https://github.com/user-attachments/assets/0deb3ca9-d1bb-4c95-9eef-94a23cf298f5" />

### About Us
<img width="1903" height="919" alt="About Us" src="https://github.com/user-attachments/assets/ed71d1c1-8f84-4962-84f0-755cab68419b" />
<img width="1895" height="860" alt="About Us" src="https://github.com/user-attachments/assets/5f70eae4-3495-4773-a45c-efaa1a40a333" />

### Product Catalog
<img width="1908" height="916" alt="image" src="https://github.com/user-attachments/assets/7cb17d4f-ff83-4562-b627-d75d7133c2d1" />

### Product Details
<img width="1906" height="897" alt="CabinFit product catalog" src="https://github.com/user-attachments/assets/ff146ec0-c160-4e40-a382-e196f8047fa1" />
<img width="1900" height="917" alt="image" src="https://github.com/user-attachments/assets/38633774-6d88-420f-a045-854e1ea8992d" />

### Shopping Cart
<img width="1656" height="658" alt="Shopping Cart" src="https://github.com/user-attachments/assets/22fb55a9-3ddf-4451-a04b-fcfddc7f7912" />
<img width="1902" height="905" alt="Shopping Cart" src="https://github.com/user-attachments/assets/63951162-4ad9-48e3-91ea-dfaeb2b7b37a" />
<img width="1895" height="914" alt="image" src="https://github.com/user-attachments/assets/5e9b20b5-d4b3-4b3d-ab76-b0e56374a60b" />

### Order Management
<img width="1907" height="895" alt="Order Management" src="https://github.com/user-attachments/assets/0610cd71-1b56-4a6a-a863-e3e5ac1f6da0" />
<img width="1905" height="615" alt="Order Management" src="https://github.com/user-attachments/assets/5d686706-8b70-4ac1-9dd2-cfe5a9900ce1" />

## Technologies

**Frontend:** React, Vite, Bootstrap, Axios, React Router  
**Backend:** ASP.NET Core Web API (.NET 8), Entity Framework Core, ASP.NET Core Identity  
**Database:** SQL Server  
**Payments:** Stripe

## Project Structure

```text
TravelBagApp/
├── Backend/
│   └── CabinFit/
│       ├── CabinFit.sln
│       └── CabinFit.Api/
└── Frontend/
    └── cabinfit/
```

## Getting Started

### Prerequisites

- .NET 8 SDK
- Node.js compatible with Vite 7
- SQL Server
- A Stripe test account for testing payments

### Backend Setup

1. Clone this repository and open `Backend/CabinFit/CabinFit.sln`.
2. Configure the application settings described below.
3. Restore the NuGet packages.
4. In Visual Studio's Package Manager Console, select `CabinFit.Api` as the default project and run:

   ```powershell
   Update-Database
   ```

5. Start the API using the HTTPS launch profile.

### Configuration

The credential-containing `appsettings.json` is excluded from version control. Supply the following settings through local configuration, .NET User Secrets, or environment variables:

- `ConnectionStrings:CabinFitDb`
- `Jwt:Key`
- `Jwt:Issuer`
- `Jwt:Audience`
- `Jwt:TokenValidityInMinutes`
- `Jwt:RefreshTokenValidityInDays`
- `Stripe:SecretKey`
- `Stripe:PublishableKey`
- `EmailConfiguration:Host`
- `EmailConfiguration:Port`
- `EmailConfiguration:EnableSsl`
- `EmailConfiguration:User`
- `EmailConfiguration:Password`

Use your own credentials and Stripe test keys for local development.

### Frontend Setup

From `Frontend/cabinfit`, run:

```bash
npm ci
npm run dev
```

Ensure the frontend API URL matches the running backend. Configure any local HTTPS certificates referenced by `vite.config.js`; local certificates and private keys are excluded from version control.

## Product Images

Uploaded product images are stored in:

```text
Backend/CabinFit/CabinFit.Api/wwwroot/images/
```

Database migrations create the schema. Existing product records and other local database content must be supplied separately.

**Author:** Aleksandra Petkovska Banak
