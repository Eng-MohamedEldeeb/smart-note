# <p align='center'> Intelli Note - Smart Notes API </br> _With Integrated <b>AI</b>_ </br> </p> <div align="center">![Nodejs](https://img.shields.io/badge/Nodejs-v22.16.0-4DC71F?logo=nodedotjs&logoColor=4DC71F) ![Typescript](https://img.shields.io/badge/Typescript-v5.8.3-3178C6?logo=TypeScript&logoColor=3178C6) ![Ts-node](https://img.shields.io/badge/Tsnode-v10.9.2-3178C6?logo=ts-node&logoColor=3178C6) ![NPM](https://img.shields.io/badge/NPM-v11.4.2-CB3837?logo=npm&logoColor=CB3837) ![Nodemon](https://img.shields.io/badge/Nodemon-v3.1.10-76D04B?logo=nodemon&logoColor=76D04B) ![Express](https://img.shields.io/badge/Express-v5.1.0-000000?logo=express&logoColor=000000) ![Mongodb](https://img.shields.io/badge/Mongodb-v8.0.10-47A248?logo=mongodb&logoColor=47A248) ![Mongoose](https://img.shields.io/badge/Mongoose-v8.15.1-880000?logo=mongoose&logoColor=880000) ![JWT](https://img.shields.io/badge/JWT-v9.0.2-FC015D?logo=jsonwebtokens&logoColor=FC015D) ![Redis](https://img.shields.io/badge/Redis-v5.5.6-FF4438?logo=redis&logoColor=FF4438) </div> </br> Overview </br>

**Intelli Note** is a modern, secure, and modular **note-taking API**. It's designed to provide users with a structured way to create, organize, and manage personal notes — with advanced features like _OTP-based authentication_ and data caching with _Redis_.

Built with **Node.js**, **TypeScript**, and **MongoDB**, Intelli Note is more than a CRUD app — it's a scalable system that balances performance with clean design and privacy-focused architecture.

## Discussions

- [Features](#features--what-makes-intelli-note-smart)
- [Behind the Scenes of Intelli Note](#system-design-logic--behind-the-scenes-of-intelli-note)
- [Custom Guards](#custom-guards--securing-intelli-note-with-intelligence--foresight)
- [Building Custom Guards Based On NestJS Guards](#implementation-details--building-custom-guards)
  - [applyGuards](#applyguards--a-custom-decorator-for-guard-activation)
  - [GuardActivator](#guardactivator--the-abstract-blueprint)
  - [Example – IsAuthenticatedGuard](#example--isauthenticatedguard)
  - [Real Use Case – Chaining Multiple Guards for Route Protection](#real-use-case--chaining-multiple-guards-for-route-protection)
- [Installation & Running Locally](#installation--running-locally)
- [API Endpoints](#api-endpoints)

## Features – What Makes Intelli Note Smart?

### 1. User Authentication & OTP Verification

- Secure registration with email OTP confirmation.
- Password reset also requires OTP to prevent malicious actions.
- Smart flow for account protection and real users only.

### 2. JWT Access Tokens with Password Change Validation

- Automatically invalidates old tokens if the user updates their password or logged-out.

- Ensures no token remains valid after sensitive changes.

- ### 3. Search Across Notes

- Full-text search on note titles and body.

### 3. Redis Caching Layer

- Caches results of GET endpoints to boost performance.

- Smart cache invalidation when data is created or deleted.

- Reduces DB load while keeping UX fast and fresh.

### 4. Rate Limiting & Helmet Security

- Prevent brute force attacks using express-rate-limit on auth endpoints.

- Security headers applied using helmet, including noSniff protection.

### 5. Custom Error Handling & Logging

- Centralized error handler.

- Uses structured custom errors with flexible log levels.

- Logs meaningful request context for easier debugging.

### 6. Modular & Scalable Code Architecture

- Follows separation of concerns and SOLID principles.

- Easy to extend for future features like reminders, tags, or even collaboration.

## System Design Logic – Behind the Scenes of Intelli Note

### 1. Modular Architecture

- The project follows a modular, scalable architecture, where each domain (Auth, User, Note) is separated by layers:

- Controller: Handles the request and response cycle.

- Service: Contains business logic.

- Repository: Handles database interaction.

- Interfaces: For strong typing and input validation consistency.

### 2. Custom Error Handling System

- A structured throwError Function is used to throw a a human-readable instead of throwing plain strings.

- Maintained asyncHandler decorator handles all the catched errors.

- Centralized asyncHandler decorator handles all the catched errors.

- Errors are categorized by error cause, status, and a human-readable message.

<br/>

> [!NOTE]
> Know more about the **asyncHandler Decorator** [Here.](https://github.com/Eng-MohamedEldeeb/smart-note/tree/main/src/common/decorators/async-handler)

<br/>

### 3. Strong Routes Security Handling with Custom Guards

- A custom guard system that is inspired by NestJS's design pattern of using guards.

- Protecting routes and enforcing access rules.

- My Custom Guards are high flexible system using decorators and OOP principles.

- ### 4. Security Middleware Layer

- Applied middlewares:

- helmet: to secure headers.

- express-rate-limit: to prevent brute force on sensitive routes.

- cors: with controlled configuration.

### 5. Input Validation

- All request bodies and query parameters are validated using custom interfaces and middleware.

- Prevents malformed data from reaching the business logic layer.

### 6. Logging System

- Every error or key process logs:

- HTTP method, endpoint path, error message, and user context (if available).

- Helps during debugging or tracking production issues.

## Custom Guards – Securing Intelli Note with Intelligence & Foresight

- Intelli Note uses a layered custom guards system to ensure that every access point is secure, smart, and contextual.

### 1. JWT Authentication Guard

- Before accessing any protected endpoint:

- The request must include a valid JWT access token in the Authorization header.

### The Guard

- Decodes and verifies the token.

- Fetches the user associated with the token.

- Validates the user still exists and is not logged-out.

### 2. Credentials Change and Loggin-out Validation Guard

**This is where security meets elegance:**

- On each authenticated request, the guard compares:

#### token.iat (Issued At timestamp) with

- user.credentialsChangedAt (last time the password was changed)
- user.loggedOutAt (last time the user loggedOut)

• **If credentialsChangedAt || loggedOutAt > token.iat, the token is considered stale and access is denied.**

- Purpose: Instantly revoke old tokens when the password changes.

This prevents session hijacking and ensures that even if someone has an old token, it becomes useless the moment the user secures their account.

### 3. Action Guards Based on Note Ownership

Every note and label action is guarded by ownership:

The system fetches the entity **(Note)**.

Compares the createdBy field with the user.\_id from the token.

If mismatched, a 403 Forbidden is thrown.

## Why it’s Special

These guards are centralized, reusable, and context-aware.

They’re not just about protection—they express intention:

<br/>

> “You’re safe here, not because we trust everyone, but because we verify everything.”

<br>

### My Philosophy

Intelli Note’s guards don’t just restrict access…
They understand context, respect user security, and evolve with the app’s needs.
It’s not about locking doors—it’s about knowing when to open them, for who, and why.

<br/>

## Implementation Details – Building Custom Guards

My custom guard system is inspired by NestJS's design pattern of using guards for protecting routes and enforcing access rules. But instead of using Nest’s built-in @UseGuards(), I designed my own flexible system using decorators and OOP principles.

### applyGuards – A Custom Decorator for Guard Activation

- This utility allows any route to apply a chain of guards in a clean, reusable way:

```applyGuards.decrator.ts
// applyGuards.decrator.ts

export const applyGuards = (guards: GuardActivator[]) => {
  return asyncHandler(async (...params: any[]) => {
    const Ctx = ContextDetector.detect(params)
    if (Ctx.type === ContextType.httpContext) {
      return await httpContextGuardsActivator(Ctx, guards)
    }

    if (Ctx.type === ContextType.graphContext) {
      return await graphQlContextGuardsActivator(Ctx, guards)
    }
  })
}
```

</br>

```applyGuards.helper.ts
// applyGuards.helper.ts

export const httpContextGuardsActivator = async (
  Ctx: typeof ContextDetector,
  guards: GuardActivator[],
) => {
  const { req, res, next } = Ctx.switchToHTTP()

  for (const guard of guards) {
    const result = await guard.canActivate(req, res, next)
    if (!result) return throwError({ msg: 'forbidden request', status: 403 })
  }

  return next()
}

export const graphQlContextGuardsActivator = async (
  Ctx: typeof ContextDetector,
  guards: GuardActivator[],
) => {
  const { source, args, context, info } = Ctx.switchToGraphQL()

  for (const guard of guards) {
    await guard.canActivate(source, args, context, info)
    if (!context) return throwError({ msg: 'forbidden request', status: 403 })
  }

  return context
}
```

- Accepts a list of guard instances.

- Executes each guard’s canActivate() method sequentially.

<br/>

> [!NOTE]
> If any guard throws an error, the request will stop and the error will be handled globally.

## GuardActivator – The Abstract Blueprint

All guards in the app extend this abstract class to ensure consistency and enforce a unified structure:

```TS

export abstract class GuardActivator {
  abstract canActivate(req: IRequest): Promise<Boolean> | Boolean
}

```

Every guard must implement the canActivate() method.

This ensures polymorphism and allows guards to be applied dynamically.

### Example – IsAuthenticatedGuard

- This is a core guard that checks for a valid access token and attaches the payload to the request object:

```TS

class IsAuthenticatedGuard implements GuardActivator {
  canActivate(req: IRequest) {
    const { authorization } = req.headers

    if (!authorization) return throwError({ msg: 'missing token', status: 400 })

    const [bearer, token] = authorization.split(' ')

    if (!bearer || !token)
      return throwError({ msg: 'missing token', status: 400 })

    const tokenPayload = verifyToken(token)

    req.tokenPayload = tokenPayload

    return true
  }
}

```

- Ensures the presence of a valid JWT in the Authorization header.

- If valid, it attaches the token’s payload (userId, email, etc.) to req.tokenPayload.

- Used as the foundation for any protected route.

### Why This Matters

- Using this architecture:

- You can reuse and compose guards easily.

- Guards remain testable, modular, and extensible.

- You retain full control over error handling, response structure, and request enrichment.

<br/>

> It’s not just about security—it’s about writing code that respects intention.

## Real Use Case – Chaining Multiple Guards for Route Protection

- To illustrate how we use our applyGuardsActivator decorator in practice, here’s how we protect the `/note/:id editing route`:

```TS
// http.module.ts

router.use(
  '/notes',
  applyRateLimiter({ skipSuccessfulRequests: false }),
  applyGuards([
    isAuthenticatedGuard, // checks if the user has a valid token
    isAuthorizedGuard// checks if the token payload matches required data
  ]),
  noteModule, // routes to note router
)

// note.module.ts
router.delete(
  '/:id',
  validate(validators.deleteNoteValidator),
  applyGuards([
    noteExistenceGuard,  // checks if the note exists
    noteAuthorizationGuard // checks if the note belongs to the user
  ]),
  NoteController.delete,
)
```

## What's Happening Here?

```TS
validate(validators.deleteNoteValidator)
```

> - Validates the request id to ensure it's a valid database id.

<br/>

```TS
applyGuards(...)
```

> - Sequentially applies the following guards:

### 1. isAuthenticatedGuard

_-_ Ensures the user has a valid JWT token.

### 2. isAuthorizedGuard

_-_ Verifies that the user making the request is authorized (e.g., matches userId in token).

### 3. noteExistenceGuard and noteAuthorizationGuard

_-_ Confirms that the note exists, hasn’t been deleted, and is owned by the user.

### NoteController.delete

_-_ Gets executed only if all guards pass. Clean and safe.

## Benefit

- This model provides fine-grained control, clear separation of concerns, and easy reusability across multiple routes.

- No route is exposed unless it's passed through the proper layers of verification.

### But How The Guards Detects Which Context They're In ?

_-_ This is Where My **ContextDetector** Decorator Comes in handy

<br/>

> [!NOTE]
> Know More About **ContextDetector Class** [Here.](https://github.com/Eng-MohamedEldeeb/smart-note/blob/main/src/common/decorators/context/context-detector.decorator.ts).

## Installation & Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/Eng-MohamedEldeeb/smart-note.git
cd smart-note
```

### 2. Install dependencies

```bash
npm install
```

### 4. Run the app

**Install project dependencies and start a local server with the following terminal commands:**

```bash
npm run dev
```

<br/>

> [!NOTE] 
> **[Postman Link.](https://documenter.getpostman.com/view/37407571/2sB34oDdP5)**

## Auth Endpoints: `/auth`

### POST: `/confirm-email`

- Purpose: Receive OTP code for email confirmation.
- Body:

```json
{
  "email": "example@any.com"
}
```

### POST: `/register`

- Purpose: Register a new user.
- Body:

```json
{
  "fullName": "Full Name",
  "email": "example@any.com",
  "password": "password",
  "confirmPassword": "password",
  "birthDate": "MM-DD-YYYY",
  "otpCode": "0000"
}
```

### POST: `/login`

- Purpose: Authenticate and return an access token.
- Body:

```json
{
  "email": "example@any.com",
  "password": "password"
}
```

### POST: `/forgot-password`

- Purpose: Receive OTP code to reset password.
- Body:

```json
{
  "email": "example@any.com"
}
```

### PATCH: `/reset-password`

- Purpose: Reset the user password.
- Body:

```json
{
  "email": "example@any.com",
  "newPassword": "password123",
  "confirmPassword": "password123",
  "otpCode": "0000"
}
```

## User Endpoints: `/user`

- Required header: `Authorization: Bearer <accessToken>`

### PATCH: `/user/upload-profile-pic`

- Purpose: Upload And Update Uuer Profile Picture.

### POST: `/user/log-out`

## Note Endpoints: `/notes`

- Required header: `Authorization: Bearer <accessToken>`

### GET: `/`

- Purpose: Get user notes.
- Query Param: `search`, `sort`, `page`, `limit` ( `optional` )

### Examples on `search` Query For Searching Notes by:

- title:

> /notes?search=note title

- body content:

> /notes?search=note body

- task's name:

> /notes?search=note task name

### POST: `/`

- Purpose: Create a new note.

### Examples:

- Creating a normal note:
- Body:

```json
{
  "title": "note's title",
  "body": "note's body" // optional
}
```

### DELETE: `/:id`

- Purpose: Delete a note permanently.
- Query Params:

  - `id`: `noteId`
