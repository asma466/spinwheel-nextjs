# Birthday Spinwheel Integration Guide

## Overview
Successfully integrated the React.js birthday spinwheel project into the Next.js dashboard. The application now has a complete birthday gift distribution system with email notifications and wheel spinning mechanics.

## Files Created

### 1. Components
- **[src/component/common/wheelanimation.tsx](src/component/common/wheelanimation.tsx)** - Canvas-based wheel component with spin animation
- **[src/component/common/windialog.tsx](src/component/common/windialog.tsx)** - Radix UI dialog component for displaying prize results
- **[src/component/common/windialog.css](src/component/common/windialog.css)** - Styling for dialog component

### 2. Pages
- **[app/(app)/birthday-spin/page.tsx](app/(app)/birthday-spin/page.tsx)** - Main birthday spin page with wheel interface

### 3. API Routes
- **[app/api/birthday/route.ts](app/api/birthday/route.ts)** - POST endpoint to create birthday record and send birthday email
- **[app/api/spinwheel/route.ts](app/api/spinwheel/route.ts)** - POST endpoint to validate and fetch birthday record with random prize
- **[app/api/finish/route.ts](app/api/finish/route.ts)** - POST endpoint to complete spin, mark record as finished, and send winning email

### 4. Utilities
- **[lib/email.ts](lib/email.ts)** - Email configuration and sending functions using nodemailer

## Database Schema Updates

The existing Prisma schema supports the birthday flow:

```prisma
model BirthdayRecord {
  id              Int       @id @default(autoincrement())
  year            Int
  emailSent       Boolean   @default(false)
  spinCompleted   Boolean   @default(false)
  employeeId      Int
  employee        Employee  @relation(fields: [employeeId], references: [id], onDelete: Cascade)
  giftReceivedId  Int?
  giftReceived    Gift?     @relation(fields: [giftReceivedId], references: [id])
  giftReceivedAt  DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  @@unique([employeeId, year])
}
```

## API Endpoints

### POST /api/birthday
Creates a birthday record and sends birthday email
```json
Request:
{
  "name": "John Doe",
  "email": "john@example.com"
}

Response:
{
  "success": true,
  "message": "Birthday record created and email sent successfully",
  "recordId": 1
}
```

### POST /api/spinwheel
Validates birthday record and returns random prize
```json
Request:
{
  "id": 1
}

Response:
{
  "id": 1,
  "employee": "John Doe",
  "prize": "Planter"
}
```

### POST /api/finish
Completes the spin and sends winning email
```json
Request:
{
  "id": 1,
  "prize": "Planter"
}

Response:
{
  "success": true,
  "message": "Spin completed successfully",
  "record": { ... }
}
```

## Features

✅ **Canvas-based Wheel Animation** - Smooth spinning animation with customizable segments and colors
✅ **Prize Distribution** - Random prize selection from predefined list
✅ **Email Notifications** - Birthday invitation email and winning notification email
✅ **Database Integration** - Persistent record keeping with Prisma ORM
✅ **One-Time Spin** - Validates that each employee can only spin once per year
✅ **Confetti Animation** - Celebratory confetti effect when prize is won
✅ **Responsive Dialog** - Elegant prize display dialog using Radix UI

## Configuration

### Environment Variables
Add to `.env.local`:
```
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Email Configuration
Update email credentials in [lib/email.ts](lib/email.ts):
- For production: Update `peopleoperations@zetatech.com.pk` credentials
- For development: Use fallback Gmail configuration

## Gifts Available
- Planter
- Scented Candles
- Fidget Toys
- Vase
- Table Lamp
- Photo Frame

## Installation & Setup

1. Install dependencies:
```bash
npm install --legacy-peer-deps
```

2. Set up Prisma:
```bash
npx prisma generate
npx prisma migrate dev
```

3. Start development server:
```bash
npm run dev
```

4. Access the birthday spin page:
```
http://localhost:3000/birthday-spin?x=recordId
```

## Key Implementation Details

### Wheel Component
- Uses HTML5 Canvas API for rendering
- Implements physics-based rotation with deceleration
- Automatically detects needle position for prize selection
- Prevents multiple spins when `isOnlyOnce` is true

### Email Sending
- Primary: mail.zetatech.com.pk SMTP server
- Fallback: Gmail SMTP for development
- HTML templates with Zeta Technologies branding
- Includes logo from https://zetatech.com.pk

### Database Flow
1. Employee birthday is detected (via cron job from Express.js)
2. Birthday record created via `/api/birthday`
3. Employee receives email with spin link
4. Employee clicks link and opens birthday spin page
5. System validates record on page load via `/api/spinwheel`
6. Employee spins wheel and wins prize
7. Finish endpoint marks record complete and sends winning email

## Dependencies Added
- `react-confetti` - Confetti animation
- `@mui/joy` - Snackbar notifications
- `nodemailer` - Email sending
- `@radix-ui/themes` - UI theming
- `@radix-ui/react-icons` - Icon components

## Testing

### Manual Testing Endpoints
```bash
# Create birthday record
curl -X POST http://localhost:3000/api/birthday \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com"}'

# Get spin record
curl -X POST http://localhost:3000/api/spinwheel \
  -H "Content-Type: application/json" \
  -d '{"id":1}'

# Complete spin
curl -X POST http://localhost:3000/api/finish \
  -H "Content-Type: application/json" \
  -d '{"id":1,"prize":"Planter"}'
```

## Notes

- The wheel animation uses JavaScript timing events for smooth rendering
- Prize selection is truly random from the available prizes list
- Database records prevent duplicate spins per employee per year
- Email fallback mechanism ensures notifications are sent even if primary server fails
- The system is designed for internal company birthday celebrations

## Future Enhancements

- [ ] Add employee bulk import from Excel (birthdays.js functionality)
- [ ] Implement cron job for automatic birthday detection
- [ ] Add admin dashboard for managing gifts and viewing spin history
- [ ] Implement analytics for most popular prizes
- [ ] Add customizable email templates
- [ ] Multi-language support for emails
