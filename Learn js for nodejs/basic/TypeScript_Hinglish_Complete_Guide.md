# 🚀 TypeScript - Complete Guide (Hinglish) | Node.js Backend Job Ready

---

## 🎯 START YHA SE: TypeScript kya hai aur Backend ke liye kyu important hai?

### **TypeScript Kya Hai?**

TypeScript ek **superset of JavaScript** hai — matlab JavaScript + extra powers (Types).

**Simple Shabd Mein:**
- TypeScript = JavaScript + Type Safety
- Browser TypeScript directly nahi samajhta → pehle JavaScript mein compile hota hai
- Microsoft ne banaya, Node.js + React + Angular sab mein use hota hai

### **Real-Life Analogy:**

Imagine **Bank Locker System**:
- 🔓 **JavaScript** = Koi bhi locker mein kuch bhi daal sakta hai (paise, shoes, pizza — kuch bhi!)
- 🔒 **TypeScript** = Locker ke rules hain — "is locker mein sirf paise aayenge, pizza nahi!"

TypeScript aapko errors **run time se pehle** (compile time par) pakad leta hai.

### **Why TypeScript use karo?**

```
1. Type Safety    - Galat type ka data pass karo toh turant error milta hai
2. Better IDE     - VS Code mein auto-complete, hints, intellisense
3. Readable Code  - Team work mein dusre samajh sakte hain code
4. Fewer Bugs     - 15-20% bugs compile time par hi pakad leta hai
5. Industry Stan  - Bade companies (Microsoft, Google, Airbnb) use karti hain
```

### **JavaScript vs TypeScript Comparison:**

```javascript
// ❌ JavaScript - Runtime par pata chalta hai
function addNumbers(a, b) {
    return a + b;
}
addNumbers(5, "hello");  // "5hello" - koi error nahi! Bug silently aaya

// ✅ TypeScript - Compile time par hi error
function addNumbers(a: number, b: number): number {
    return a + b;
}
addNumbers(5, "hello");  // ❌ ERROR: Argument of type 'string' is not assignable to type 'number'
```

---

# 📚 STEP 1: TypeScript Setup

## Topic 1️⃣: Installation & Configuration

### **Install TypeScript:**

```bash
# Global install (ek baar karo)
npm install -g typescript

# Version check
tsc --version  # Version 5.x.x aana chahiye

# Project mein install (har project ke liye)
npm install -D typescript @types/node ts-node

# tsconfig file banao
npx tsc --init
```

### **tsconfig.json (Explained):**

```json
{
  "compilerOptions": {
    "target": "ES2020",         // Kaunsi JavaScript version mein compile karo
    "module": "commonjs",       // Node.js ke liye commonjs use karo
    "rootDir": "./src",         // TypeScript files kaha hain
    "outDir": "./dist",         // Compiled JS files kaha jaayengi
    "strict": true,             // Strict type checking ON (hamesha ON rakho!)
    "esModuleInterop": true,    // Import/export clean syntax
    "skipLibCheck": true,       // Library type errors skip karo
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### **package.json Scripts:**

```json
{
  "scripts": {
    "dev": "ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

### **First TypeScript File:**

```typescript
// src/index.ts
const message: string = "Hello TypeScript!";
console.log(message);

// Compile karo
// tsc → JS banta hai dist/index.js mein
// ya directly run karo:
// ts-node src/index.ts
```

---

# 📚 STEP 2: TypeScript Basics

## Topic 2️⃣: Type Annotations (Types Likhna)

### **Concept:**
Variables ke saath `: type` likhte hain — yahi TypeScript ka core hai.

### **Real-Life Analogy:**

**Hospital Form:**
```
Patient Name:  _____________ (string — sirf text)
Age:           _____________ (number — sirf number)
Is Diabetic:   Yes / No      (boolean — sirf true/false)
```

Form mein "Age" field mein "hello" likhoge toh form accept nahi karega. TypeScript bhi same karta hai!

### **Basic Types:**

```typescript
// ─────────────────────────────────────────
// PRIMITIVE TYPES
// ─────────────────────────────────────────

let userName: string = "Raj";
let userAge: number = 25;
let isLoggedIn: boolean = true;
let orderId: undefined = undefined;
let profilePic: null = null;

// ─────────────────────────────────────────
// TYPE INFERENCE (TypeScript khud guess karta hai)
// ─────────────────────────────────────────

let city = "Mumbai";       // TypeScript jaanta hai → string
let price = 299;           // TypeScript jaanta hai → number
let isVeg = true;          // TypeScript jaanta hai → boolean

city = 123;                // ❌ ERROR - city string hai, number nahi!
```

### **Line-by-Line Explanation:**

```typescript
let userName: string = "Raj";
//  ^^^^^^^^  ^^^^^^^^  ^^^^^
//  variable   type     value
//  naam    annotation

// Matlab: userName ek string hai jisme "Raj" store hai
// Agar baad mein number doge → error aayega
```

### **Real Backend Example - User Registration:**

```typescript
// User Registration ke liye variables
const userId: number = 1001;
const email: string = "raj@gmail.com";
const password: string = "hashed_password_here";
const isVerified: boolean = false;
const createdAt: Date = new Date();
let profileBio: string | null = null;    // null bhi ho sakta hai

console.log(`User ${email} created with ID ${userId}`);
```

### **Practice Questions:**

1. **Q1:** Type annotation aur type inference mein kya difference hai?
   <details>
   <summary>Answer dekho</summary>
   Annotation = aap khud likhte ho `: string`, Inference = TypeScript khud samajhta hai value dekh ke
   </details>

2. **Q2:** Yeh code chalega?
   ```typescript
   let age: number = 25;
   age = "twenty five";
   ```
   <details>
   <summary>Answer</summary>
   ❌ ERROR - age number hai, string assign nahi ho sakta
   </details>

3. **Q3:** Kab `null` use karte hain aur kab `undefined`?
   <details>
   <summary>Answer</summary>
   null = intentionally khali kiya (jaise profile pic remove ki), undefined = value abhi assign hi nahi hui
   </details>

### **Coding Task:**

```typescript
// Hospital Patient System banao:
// 1. patientName (string)
// 2. patientAge (number)
// 3. isDiabetic (boolean)
// 4. doctorAssigned (string ya null — initially null)
// 5. admissionDate (Date)
// Sab print karo
```

---

## Topic 3️⃣: Arrays & Tuples

### **Concept:**
Arrays mein ek hi type ka data store karte hain. Tuples mein fixed order mein mixed types.

### **Real-Life Analogy:**

**Zomato Cart:**
```
items[] = ["Pizza", "Coke", "Fries"]     ← sabhi string, array
prices[] = [299, 49, 99]                  ← sabhi number, array
orderInfo = ["Raj", 25, true]             ← mixed types, tuple
             string  number boolean
```

### **Code Example:**

```typescript
// ─────────────────────────────────────────
// ARRAYS
// ─────────────────────────────────────────

// Style 1: Type[]
const cartItems: string[] = ["Pizza", "Coke", "Fries"];
const prices: number[] = [299, 49, 99];
const flags: boolean[] = [true, false, true];

cartItems.push("Burger");   // ✅ OK
cartItems.push(123);        // ❌ ERROR - number nahi daal sakte

// Style 2: Array<Type> (same hi hai)
const userIds: Array<number> = [1001, 1002, 1003];

// ─────────────────────────────────────────
// TUPLES — fixed length, fixed types
// ─────────────────────────────────────────

// [name, age, isActive]
const userInfo: [string, number, boolean] = ["Raj", 25, true];

// Sahi order mein hona chahiye!
const wrong: [string, number, boolean] = [25, "Raj", true];  // ❌ ERROR

// Access karo index se
console.log(userInfo[0]);  // "Raj"
console.log(userInfo[1]);  // 25

// ─────────────────────────────────────────
// REAL BACKEND EXAMPLE
// ─────────────────────────────────────────

// Database se multiple users
const userEmails: string[] = [
    "raj@gmail.com",
    "priya@gmail.com",
    "amit@gmail.com"
];

// HTTP Response tuple: [statusCode, message, data]
type ApiResponse = [number, string, object | null];
const response: ApiResponse = [200, "Success", { id: 1 }];
const errorResponse: ApiResponse = [404, "Not Found", null];
```

### **Useful Array Methods with Types:**

```typescript
const numbers: number[] = [5, 3, 8, 1, 9, 2];

const sorted = numbers.sort((a, b) => a - b);
// TypeScript jaanta hai sorted bhi number[] hai

const doubled = numbers.map((n) => n * 2);
// TypeScript jaanta hai doubled bhi number[] hai

const big = numbers.filter((n) => n > 5);
// TypeScript jaanta hai big bhi number[] hai

const total = numbers.reduce((sum, n) => sum + n, 0);
// TypeScript jaanta hai total number hai
```

### **Coding Task:**

```typescript
// E-Commerce Cart System:
// 1. productNames: string array with 3 products
// 2. productPrices: number array same length
// 3. orderSummary tuple: [orderId: number, customerName: string, totalItems: number]
// 4. Total price calculate karo using reduce
// 5. Sab print karo
```

---

## Topic 4️⃣: Objects & Type Aliases

### **Concept:**
Objects ke liye types define karte hain — kaunse keys honge aur unka type kya hoga.

### **Real-Life Analogy:**

**Employee Form (Office):**
```
Name:      ____________  (required, string)
Age:       ____________  (required, number)
Dept:      ____________  (required, string)
Extension: ____________  (optional, string)
```

Form ka format pehle se fix hai. TypeScript mein bhi object ka "shape" fix karte hain.

### **Code Example - Type Alias:**

```typescript
// ─────────────────────────────────────────
// TYPE ALIAS - apna custom type banao
// ─────────────────────────────────────────

type User = {
    id: number;
    name: string;
    email: string;
    age: number;
    isActive: boolean;
    bio?: string;          // ? = optional field
};

// Ab User type use karo
const user1: User = {
    id: 1,
    name: "Raj Kumar",
    email: "raj@gmail.com",
    age: 25,
    isActive: true
    // bio optional hai, dena zaroori nahi
};

const user2: User = {
    id: 2,
    name: "Priya Sharma",
    email: "priya@gmail.com",
    age: 28,
    isActive: true,
    bio: "Software Developer"   // Optional diya bhi to chalega
};

// ─────────────────────────────────────────
// NESTED OBJECTS
// ─────────────────────────────────────────

type Address = {
    street: string;
    city: string;
    pincode: number;
};

type Employee = {
    id: number;
    name: string;
    salary: number;
    address: Address;       // Nested object
    skills: string[];       // Array of strings
};

const emp: Employee = {
    id: 101,
    name: "Amit Verma",
    salary: 75000,
    address: {
        street: "12 MG Road",
        city: "Mumbai",
        pincode: 400001
    },
    skills: ["TypeScript", "Node.js", "React"]
};

console.log(emp.address.city);   // "Mumbai"
console.log(emp.skills[0]);      // "TypeScript"
```

### **Line-by-Line Explanation:**

```typescript
type User = {
//   ^^^^ = apna custom type ka naam
    id: number;
//  ^^ = key naam, ^^^^^^ = is key ka type
    bio?: string;
//      ^ = ye question mark matlab "optional" — dena zaroori nahi
};
```

### **Readonly Fields:**

```typescript
type Config = {
    readonly apiKey: string;     // Change nahi ho sakta
    readonly dbUrl: string;
    timeout: number;             // Ye change ho sakta hai
};

const config: Config = {
    apiKey: "abc123",
    dbUrl: "mongodb://localhost",
    timeout: 5000
};

config.timeout = 10000;   // ✅ OK
config.apiKey = "new";    // ❌ ERROR - readonly hai!
```

### **Coding Task:**

```typescript
// Online Course Platform:
// Type banao:
// 1. Instructor type: id, name, expertise (string[]), rating (number), isVerified (boolean)
// 2. Course type: id, title, price, instructor (Instructor), 
//                totalLectures (number), tags (string[]), description? (optional)
// 3. Do alag courses ke objects banao with valid data
// 4. Print karo course title + instructor name + rating
```

---

## Topic 5️⃣: Interfaces

### **Concept:**
Interface bhi object ka type define karta hai — Type Alias se thoda alag hai.

### **Type Alias vs Interface:**

```typescript
// ─────────────────────────────────────────
// TYPE ALIAS (=)
// ─────────────────────────────────────────
type Animal = {
    name: string;
    sound: string;
};

// ─────────────────────────────────────────
// INTERFACE
// ─────────────────────────────────────────
interface Animal {
    name: string;
    sound: string;
}

// Dono same kaam karte hain for objects
// Difference:

// 1. Interface extend ho sakta hai (class-like)
interface Vehicle {
    brand: string;
    speed: number;
}

interface ElectricVehicle extends Vehicle {
    batteryCapacity: number;    // Extra field add kiya
}

const tesla: ElectricVehicle = {
    brand: "Tesla",
    speed: 250,
    batteryCapacity: 100    // Sub mein ye bhi chahiye
};

// 2. Type Alias union types bana sakta hai, Interface nahi
type ID = string | number;   // ✅ Type se ho sakta hai
// interface ID = string | number;  // ❌ Interface se nahi
```

### **Real Backend Example - Express + TypeScript:**

```typescript
// Backend API ke liye interfaces

interface LoginRequest {
    email: string;
    password: string;
}

interface LoginResponse {
    success: boolean;
    token?: string;
    message: string;
    user?: {
        id: number;
        name: string;
        role: string;
    };
}

// Function mein use karo
function loginUser(req: LoginRequest): LoginResponse {
    if (req.email === "admin@gmail.com") {
        return {
            success: true,
            token: "jwt_token_here",
            message: "Login successful",
            user: { id: 1, name: "Admin", role: "admin" }
        };
    }
    return {
        success: false,
        message: "Invalid credentials"
    };
}

const result = loginUser({ email: "admin@gmail.com", password: "pass123" });
console.log(result.message);
```

### **Kab kya use karo?**

```
Interface use karo jab:
✅ Object shapes define karna ho
✅ Class ke saath kaam karna ho
✅ Library/API types extend karne ho

Type Alias use karo jab:
✅ Union types chahiye (string | number)
✅ Primitive types rename karna ho
✅ Function types define karne ho
```

### **Coding Task:**

```typescript
// Payment System:
// Interface banao:
// 1. PaymentMethod: type ('card' | 'upi' | 'netbanking'), last4? (number)
// 2. Transaction: id, amount, currency, paymentMethod (PaymentMethod), 
//                status ('pending' | 'success' | 'failed'), timestamp (Date)
// 3. Do transactions banao — ek success, ek failed
// 4. Successful transaction ki amount print karo
```

---

## Topic 6️⃣: Union & Intersection Types

### **Concept:**
Union = "ya toh yeh ya woh". Intersection = "dono hone chahiye".

### **Real-Life Analogy:**

**Union (|) = OR:**
```
Restaurant accept karta hai: Cash OR Card OR UPI
→ Payment: string | number type hoga
```

**Intersection (&) = AND:**
```
Manager ko Employee qualities AND Manager qualities dono chahiye
→ Manager = Employee & LeaderSkills
```

### **Code Example:**

```typescript
// ─────────────────────────────────────────
// UNION TYPES — ek ya dusra
// ─────────────────────────────────────────

type StringOrNumber = string | number;

let userId: StringOrNumber = 1001;   // OK
userId = "user_abc";                  // OK
userId = true;                        // ❌ ERROR

// Real use case — API ID
type ID = string | number;
function getUserById(id: ID) {
    console.log(`Fetching user: ${id}`);
}
getUserById(123);       // number - OK
getUserById("abc123");  // string - OK

// ─────────────────────────────────────────
// LITERAL UNION — specific values only
// ─────────────────────────────────────────

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
type UserRole = "admin" | "user" | "moderator";

let status: OrderStatus = "pending";   // OK
status = "shipped";                     // OK
status = "lost";                        // ❌ ERROR - "lost" allowed nahi hai

// ─────────────────────────────────────────
// INTERSECTION TYPES — dono combine
// ─────────────────────────────────────────

type Employee = {
    id: number;
    name: string;
    department: string;
};

type ManagerSkills = {
    teamSize: number;
    canApproveLeave: boolean;
};

type Manager = Employee & ManagerSkills;  // Dono ka combination

const manager: Manager = {
    id: 101,
    name: "Amit Singh",
    department: "Engineering",
    teamSize: 12,
    canApproveLeave: true
    // Sab fields chahiye — dono types se
};
```

### **Real Backend Use:**

```typescript
// HTTP Status codes
type SuccessCode = 200 | 201 | 204;
type ClientErrorCode = 400 | 401 | 403 | 404;
type ServerErrorCode = 500 | 502 | 503;

type StatusCode = SuccessCode | ClientErrorCode | ServerErrorCode;

function sendResponse(code: StatusCode, message: string) {
    console.log(`${code}: ${message}`);
}

sendResponse(200, "OK");         // ✅
sendResponse(404, "Not Found");  // ✅
sendResponse(999, "Custom");     // ❌ ERROR - 999 allowed nahi
```

### **Coding Task:**

```typescript
// Delivery System:
// 1. type VehicleType = "bike" | "car" | "truck"
// 2. type DeliveryStatus = "pickup" | "in_transit" | "delivered" | "returned"
// 3. type Driver: id (number), name (string), vehicle (VehicleType)
// 4. type DeliveryDetails: distance (number), weight (number), fragile (boolean)
// 5. type Delivery = Driver & DeliveryDetails with extra field: status (DeliveryStatus)
// 6. Ek delivery object banao
```

---

## Topic 7️⃣: Functions in TypeScript

### **Concept:**
Functions mein parameters aur return type specify karte hain.

### **Real-Life Analogy:**

**ATM Machine Function:**
```
Input:  Card + PIN + Amount        (parameters with types)
Output: Cash ya Error message      (return type)
```

ATM accept nahi karega agar PIN letters mein ho — TypeScript bhi nahi karega!

### **Code Example:**

```typescript
// ─────────────────────────────────────────
// BASIC FUNCTION TYPES
// ─────────────────────────────────────────

// Parameters + Return type
function add(a: number, b: number): number {
    return a + b;
}

// Void — kuch return nahi karta
function logMessage(msg: string): void {
    console.log(msg);
    // return nahi karna (ya return; bhi chalega)
}

// Optional parameter (?)
function greet(name: string, title?: string): string {
    if (title) return `Hello, ${title} ${name}`;
    return `Hello, ${name}`;
}

greet("Raj");           // "Hello, Raj"
greet("Raj", "Mr.");    // "Hello, Mr. Raj"

// Default parameter
function createUser(name: string, role: string = "user") {
    return { name, role };
}

createUser("Priya");           // { name: "Priya", role: "user" }
createUser("Admin", "admin");  // { name: "Admin", role: "admin" }

// ─────────────────────────────────────────
// ARROW FUNCTIONS
// ─────────────────────────────────────────

const multiply = (a: number, b: number): number => a * b;

const getFullName = (first: string, last: string): string => {
    return `${first} ${last}`;
};

// ─────────────────────────────────────────
// FUNCTION TYPE (Type Alias for function)
// ─────────────────────────────────────────

type MathOperation = (a: number, b: number) => number;

const add2: MathOperation = (a, b) => a + b;
const sub2: MathOperation = (a, b) => a - b;
const mul2: MathOperation = (a, b) => a * b;

// ─────────────────────────────────────────
// REST PARAMETERS
// ─────────────────────────────────────────

function sumAll(...numbers: number[]): number {
    return numbers.reduce((total, n) => total + n, 0);
}

sumAll(1, 2, 3);           // 6
sumAll(10, 20, 30, 40);   // 100
```

### **Real Backend Example - Express Route Handler:**

```typescript
import { Request, Response } from 'express';

type CreateUserBody = {
    name: string;
    email: string;
    password: string;
};

async function createUserHandler(
    req: Request<{}, {}, CreateUserBody>,
    res: Response
): Promise<void> {
    const { name, email, password } = req.body;

    // Validation
    if (!email.includes("@")) {
        res.status(400).json({ error: "Invalid email" });
        return;
    }

    // Create user logic...
    res.status(201).json({ message: "User created", name });
}
```

### **Practice Questions:**

1. **Q1:** `void` aur `undefined` return type mein kya difference hai?
   <details>
   <summary>Answer</summary>
   void = function kuch return nahi karta | undefined = function explicitly undefined return karta hai
   </details>

2. **Q2:** Optional parameter aur default parameter mein kya difference hai?
   <details>
   <summary>Answer</summary>
   Optional (?) = parameter pass nahi kiya toh undefined milta hai | Default = pass nahi kiya toh default value milti hai
   </details>

### **Coding Task:**

```typescript
// Calculator Service:
// 1. add(a, b): number
// 2. subtract(a, b): number
// 3. multiply(a, b): number
// 4. divide(a, b): number — 0 se divide karne par Error throw karo
// 5. calculate(a, b, operation: "add" | "subtract" | "multiply" | "divide"): number
//    — switch/if se sahi function call karo
// Test karo sab operations
```

---

## Topic 8️⃣: Generics (TypeScript ka Superpower!)

### **Concept:**
Generic ek "type variable" hai — function ya class kisi bhi type ke saath kaam kar sake.

### **Real-Life Analogy:**

**Amazon Box (Generic Container):**
```
Box<T> — Box mein kuch bhi aa sakta hai:
- Box<Book>    = Books wala box
- Box<Shoes>   = Shoes wala box  
- Box<Laptop>  = Laptop wala box

Box same hai, content alag
```

### **Code Example:**

```typescript
// ─────────────────────────────────────────
// PROBLEM WITHOUT GENERICS
// ─────────────────────────────────────────

// Ye functions same kaam karte hain — duplication!
function getFirstString(arr: string[]): string {
    return arr[0];
}
function getFirstNumber(arr: number[]): number {
    return arr[0];
}

// ─────────────────────────────────────────
// SOLUTION: GENERICS
// ─────────────────────────────────────────

function getFirst<T>(arr: T[]): T {
    return arr[0];
}

// Ab ek hi function, sab types ke saath kaam karta hai!
getFirst<string>(["Raj", "Priya", "Amit"]);   // "Raj" — string
getFirst<number>([10, 20, 30]);                // 10 — number
getFirst([true, false]);                        // TypeScript khud samajhta hai — boolean

// ─────────────────────────────────────────
// GENERIC FUNCTION — Multiple types
// ─────────────────────────────────────────

function pair<A, B>(first: A, second: B): [A, B] {
    return [first, second];
}

pair<string, number>("Raj", 25);   // ["Raj", 25]
pair<boolean, string>(true, "OK"); // [true, "OK"]

// ─────────────────────────────────────────
// GENERIC INTERFACE — API Response wrapper
// ─────────────────────────────────────────

interface ApiResponse<T> {
    success: boolean;
    data: T;
    message: string;
    timestamp: Date;
}

// User response
const userResponse: ApiResponse<{ id: number; name: string }> = {
    success: true,
    data: { id: 1, name: "Raj" },
    message: "User fetched",
    timestamp: new Date()
};

// Array response
const usersResponse: ApiResponse<string[]> = {
    success: true,
    data: ["Raj", "Priya", "Amit"],
    message: "All users fetched",
    timestamp: new Date()
};

// ─────────────────────────────────────────
// GENERIC WITH CONSTRAINTS
// ─────────────────────────────────────────

// T mein id hona zaroori hai (constraint)
function getById<T extends { id: number }>(items: T[], id: number): T | undefined {
    return items.find(item => item.id === id);
}

const users = [
    { id: 1, name: "Raj" },
    { id: 2, name: "Priya" }
];

getById(users, 1);   // { id: 1, name: "Raj" }
getById(users, 99);  // undefined
```

### **Real Backend Use Case:**

```typescript
// Generic Repository Pattern (Database operations)
interface Repository<T> {
    findById(id: number): Promise<T | null>;
    findAll(): Promise<T[]>;
    create(data: Omit<T, 'id'>): Promise<T>;
    update(id: number, data: Partial<T>): Promise<T>;
    delete(id: number): Promise<void>;
}

type User = { id: number; name: string; email: string };
type Product = { id: number; title: string; price: number };

// User repository
class UserRepository implements Repository<User> {
    async findById(id: number): Promise<User | null> {
        // DB query yahan
        return { id, name: "Raj", email: "raj@gmail.com" };
    }
    async findAll(): Promise<User[]> { return []; }
    async create(data: Omit<User, 'id'>): Promise<User> { return { id: 1, ...data }; }
    async update(id: number, data: Partial<User>): Promise<User> { return { id, name: "", email: "", ...data }; }
    async delete(id: number): Promise<void> { console.log(`Deleted ${id}`); }
}
```

### **Coding Task:**

```typescript
// Generic Stack (Last In First Out):
// class Stack<T>:
// - items: T[] (private)
// - push(item: T): void
// - pop(): T | undefined
// - peek(): T | undefined (top item dekho, remove mat karo)
// - isEmpty(): boolean
// - size(): number

// Test karo:
// const numStack = new Stack<number>();
// numStack.push(1); numStack.push(2); numStack.push(3);
// console.log(numStack.pop()); // 3
// console.log(numStack.peek()); // 2

// const strStack = new Stack<string>();
// strStack.push("a"); strStack.push("b");
// console.log(strStack.pop()); // "b"
```

---

## Topic 9️⃣: Classes in TypeScript

### **Concept:**
TypeScript mein classes JavaScript se zyada powerful hain — access modifiers, abstract classes, implements.

### **Real-Life Analogy:**

**Bank Account (OOP):**
```
Class BankAccount:
  - accountNumber (private — sirf bank dekhega)
  - holderName    (public — sab dekhenge)
  - balance       (private — sirf bank dekhega)
  
  + deposit()     (public method)
  + withdraw()    (public method)
  + getBalance()  (public — readonly info)
```

### **Code Example:**

```typescript
// ─────────────────────────────────────────
// BASIC CLASS WITH ACCESS MODIFIERS
// ─────────────────────────────────────────

class BankAccount {
    // Access modifiers:
    // public    = bahar se access kar sakte ho (default)
    // private   = sirf class ke andar
    // protected = class aur subclass ke andar
    // readonly  = sirf read kar sakte ho, change nahi

    public readonly accountNumber: string;
    public holderName: string;
    private balance: number;
    private transactionHistory: string[] = [];

    constructor(accountNumber: string, holderName: string, initialBalance: number) {
        this.accountNumber = accountNumber;
        this.holderName = holderName;
        this.balance = initialBalance;
    }

    public deposit(amount: number): void {
        if (amount <= 0) throw new Error("Amount must be positive");
        this.balance += amount;
        this.transactionHistory.push(`Deposited: ₹${amount}`);
        console.log(`₹${amount} deposited. New balance: ₹${this.balance}`);
    }

    public withdraw(amount: number): void {
        if (amount > this.balance) throw new Error("Insufficient funds");
        this.balance -= amount;
        this.transactionHistory.push(`Withdrew: ₹${amount}`);
        console.log(`₹${amount} withdrawn. New balance: ₹${this.balance}`);
    }

    public getBalance(): number {
        return this.balance;  // Read-only access to private balance
    }

    public getHistory(): string[] {
        return [...this.transactionHistory];  // Copy return karo, original nahi
    }
}

const account = new BankAccount("ACC001", "Raj Kumar", 10000);
account.deposit(5000);           // ✅ OK
account.withdraw(2000);          // ✅ OK
// account.balance = 999999;     // ❌ ERROR - private!
console.log(account.getBalance()); // 13000

// ─────────────────────────────────────────
// SHORTHAND CONSTRUCTOR (clean way)
// ─────────────────────────────────────────

class Product {
    constructor(
        public readonly id: number,
        public name: string,
        public price: number,
        private stock: number
    ) {}
    // Automatically same hoga:
    // this.id = id; this.name = name; etc.

    isAvailable(): boolean {
        return this.stock > 0;
    }
}

const laptop = new Product(1, "Laptop", 75000, 10);
console.log(laptop.name);         // "Laptop"
console.log(laptop.isAvailable()); // true

// ─────────────────────────────────────────
// INHERITANCE
// ─────────────────────────────────────────

class Animal {
    constructor(public name: string) {}
    
    speak(): string {
        return `${this.name} makes a sound`;
    }
}

class Dog extends Animal {
    constructor(name: string, public breed: string) {
        super(name);  // Parent constructor call karo
    }

    speak(): string {
        return `${this.name} says: Woof!`;  // Override
    }

    fetch(): void {
        console.log(`${this.name} fetches the ball!`);
    }
}

const dog = new Dog("Bruno", "Labrador");
dog.speak();   // "Bruno says: Woof!"
dog.fetch();   // "Bruno fetches the ball!"

// ─────────────────────────────────────────
// INTERFACE IMPLEMENT KARO
// ─────────────────────────────────────────

interface Serializable {
    toJSON(): string;
    fromJSON(json: string): void;
}

class UserProfile implements Serializable {
    constructor(public id: number, public name: string) {}

    toJSON(): string {
        return JSON.stringify({ id: this.id, name: this.name });
    }

    fromJSON(json: string): void {
        const data = JSON.parse(json);
        this.id = data.id;
        this.name = data.name;
    }
}
```

### **Abstract Classes:**

```typescript
// Abstract = Directly instantiate nahi kar sakte, sirf extend kar sakte hain

abstract class Shape {
    abstract getArea(): number;    // Subclass mein implement karna zaroori
    abstract getPerimeter(): number;

    // Concrete method (sab subclasses use kar sakte hain)
    describe(): string {
        return `Area: ${this.getArea()}, Perimeter: ${this.getPerimeter()}`;
    }
}

class Circle extends Shape {
    constructor(private radius: number) { super(); }
    
    getArea(): number { return Math.PI * this.radius ** 2; }
    getPerimeter(): number { return 2 * Math.PI * this.radius; }
}

class Rectangle extends Shape {
    constructor(private width: number, private height: number) { super(); }
    
    getArea(): number { return this.width * this.height; }
    getPerimeter(): number { return 2 * (this.width + this.height); }
}

// const shape = new Shape();  // ❌ ERROR - abstract class
const circle = new Circle(5);
console.log(circle.describe());  // "Area: 78.53..., Perimeter: 31.41..."
```

### **Coding Task:**

```typescript
// Library System:
// abstract class LibraryItem:
//   - id: number (readonly)
//   - title: string
//   - abstract getInfo(): string
//   - isAvailable(): boolean (private isCheckedOut field se)
//   - checkout(): void
//   - return(): void

// class Book extends LibraryItem:
//   - author: string, pages: number
//   - getInfo(): string

// class DVD extends LibraryItem:
//   - director: string, duration: number (minutes)
//   - getInfo(): string

// Test karo both checkout/return flow
```

---

## Topic 🔟: Utility Types (TypeScript Built-in Types)

### **Concept:**
TypeScript ke built-in helper types jo existing types ko modify karte hain.

### **Real-Life Analogy:**

**Photocopy Machine:**
```
Original Document = Type
Partial copy    = Partial<Type>  (sirf kuch fields chahiye)
Read-only copy  = Readonly<Type> (sirf dekhne ke liye)
Required copy   = Required<Type> (sab fields mandatory)
```

### **Code Example:**

```typescript
type User = {
    id: number;
    name: string;
    email: string;
    age: number;
    bio?: string;
};

// ─────────────────────────────────────────
// Partial<T> — Sab fields optional ho jaate hain
// ─────────────────────────────────────────
type PartialUser = Partial<User>;
// { id?: number; name?: string; email?: string; age?: number; bio?: string }

// Update API mein useful — sirf changed fields bhejo
function updateUser(id: number, updates: Partial<User>): void {
    console.log(`Updating user ${id}:`, updates);
}
updateUser(1, { name: "New Name" });      // ✅ Sirf name update
updateUser(2, { email: "new@mail.com" }); // ✅ Sirf email update

// ─────────────────────────────────────────
// Required<T> — Sab fields required ho jaate hain (optional bhi)
// ─────────────────────────────────────────
type RequiredUser = Required<User>;
// { id: number; name: string; email: string; age: number; bio: string }
// bio bhi required ho gaya!

// ─────────────────────────────────────────
// Readonly<T> — Sab fields readonly ho jaate hain
// ─────────────────────────────────────────
type ReadonlyUser = Readonly<User>;

const frozenUser: ReadonlyUser = { id: 1, name: "Raj", email: "r@r.com", age: 25 };
// frozenUser.name = "Other";  // ❌ ERROR - readonly!

// ─────────────────────────────────────────
// Pick<T, Keys> — Sirf selected fields lo
// ─────────────────────────────────────────
type UserPreview = Pick<User, "id" | "name">;
// { id: number; name: string }  — bas do fields

// Public profile mein sensitive data mat dikhao
function getPublicProfile(user: User): UserPreview {
    return { id: user.id, name: user.name };
}

// ─────────────────────────────────────────
// Omit<T, Keys> — Kuch fields hata do
// ─────────────────────────────────────────
type UserWithoutPassword = Omit<User, "id">;
// { name: string; email: string; age: number; bio?: string }

// Create user form mein id nahi chahiye (DB auto-generate karega)
type CreateUserDto = Omit<User, "id">;

// ─────────────────────────────────────────
// Record<Keys, Type> — Key-value mapping
// ─────────────────────────────────────────
type RolePermissions = Record<"admin" | "user" | "moderator", string[]>;

const permissions: RolePermissions = {
    admin: ["read", "write", "delete", "manage"],
    user: ["read"],
    moderator: ["read", "write", "ban"]
};

// ─────────────────────────────────────────
// ReturnType<T> — Function ka return type nikalo
// ─────────────────────────────────────────
function getUser() {
    return { id: 1, name: "Raj", email: "raj@gmail.com" };
}

type UserReturn = ReturnType<typeof getUser>;
// { id: number; name: string; email: string }

// ─────────────────────────────────────────
// Parameters<T> — Function ke parameters ka type
// ─────────────────────────────────────────
function createOrder(userId: number, items: string[], total: number) {}

type OrderParams = Parameters<typeof createOrder>;
// [userId: number, items: string[], total: number]
```

### **Real Backend Patterns:**

```typescript
// DTO Pattern (Data Transfer Object)
type User = {
    id: number;
    name: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
};

// Create karte waqt (id aur createdAt auto-generate honge)
type CreateUserDto = Omit<User, 'id' | 'createdAt'>;

// Update karte waqt (sab optional, sirf jo change karna ho)
type UpdateUserDto = Partial<Omit<User, 'id' | 'createdAt' | 'passwordHash'>>;

// Response mein password nahi bhejna
type UserResponse = Omit<User, 'passwordHash'>;

function createUser(dto: CreateUserDto): UserResponse {
    const user: User = {
        id: Math.random(),
        createdAt: new Date(),
        ...dto
    };
    const { passwordHash, ...response } = user;
    return response;
}
```

### **Coding Task:**

```typescript
// E-Commerce Product System:
// type Product: id, name, price, stock, category, description?, images (string[])

// Create karo:
// 1. ProductPreview = Pick<> — sirf id, name, price, category
// 2. CreateProductDto = Omit<> — id nahi chahiye
// 3. UpdateProductDto = Partial<Omit<>> — id aur baaki optional
// 4. ReadonlyProduct = Readonly<Product>

// Functions:
// - listProducts(): ProductPreview[] — mock data return karo
// - createProduct(dto: CreateProductDto): Product
// - updateProduct(id: number, dto: UpdateProductDto): Product
```

---

## Topic 1️⃣1️⃣: Type Guards & Narrowing

### **Concept:**
Union type ke andar TypeScript ko batana ki "is point pe yeh specific type hai".

### **Real-Life Analogy:**

**Security Check at Airport:**
```
Person arrive karta hai (Union type: Passenger | Staff | Visitor)
→ ID card check karo (type guard)
→ Agar staff ID → Staff area allow
→ Agar ticket → Passenger gate allow
→ Agar visitor pass → Visitor area allow
```

### **Code Example:**

```typescript
// ─────────────────────────────────────────
// typeof GUARD — primitive types ke liye
// ─────────────────────────────────────────

function processInput(input: string | number): string {
    if (typeof input === "string") {
        // TypeScript jaanta hai: yahan input = string
        return input.toUpperCase();
    } else {
        // TypeScript jaanta hai: yahan input = number
        return input.toFixed(2);
    }
}

processInput("hello");  // "HELLO"
processInput(3.14159);  // "3.14"

// ─────────────────────────────────────────
// instanceof GUARD — classes ke liye
// ─────────────────────────────────────────

class NetworkError extends Error {
    constructor(public statusCode: number, message: string) {
        super(message);
    }
}

class ValidationError extends Error {
    constructor(public field: string, message: string) {
        super(message);
    }
}

function handleError(error: NetworkError | ValidationError | Error): string {
    if (error instanceof NetworkError) {
        return `Network Error ${error.statusCode}: ${error.message}`;
    }
    if (error instanceof ValidationError) {
        return `Validation Error on field '${error.field}': ${error.message}`;
    }
    return `Error: ${error.message}`;
}

// ─────────────────────────────────────────
// in GUARD — object property check
// ─────────────────────────────────────────

type Admin = { role: "admin"; permissions: string[] };
type RegularUser = { role: "user"; subscriptionLevel: string };

type UserType = Admin | RegularUser;

function describeUser(user: UserType): string {
    if ("permissions" in user) {
        // TypeScript jaanta hai: yahan user = Admin
        return `Admin with ${user.permissions.length} permissions`;
    } else {
        // TypeScript jaanta hai: yahan user = RegularUser
        return `User with ${user.subscriptionLevel} subscription`;
    }
}

// ─────────────────────────────────────────
// DISCRIMINATED UNION — best pattern
// ─────────────────────────────────────────

type Circle = { kind: "circle"; radius: number };
type Square = { kind: "square"; side: number };
type Triangle = { kind: "triangle"; base: number; height: number };

type Shape = Circle | Square | Triangle;

function getArea(shape: Shape): number {
    switch (shape.kind) {
        case "circle":
            return Math.PI * shape.radius ** 2;   // radius available hai
        case "square":
            return shape.side ** 2;                // side available hai
        case "triangle":
            return 0.5 * shape.base * shape.height; // base, height available
        default:
            // Exhaustiveness check — agar koi case miss hua toh error
            const _never: never = shape;
            throw new Error(`Unknown shape: ${_never}`);
    }
}

getArea({ kind: "circle", radius: 5 });       // 78.53
getArea({ kind: "square", side: 4 });         // 16
getArea({ kind: "triangle", base: 6, height: 8 }); // 24
```

### **Coding Task:**

```typescript
// Payment Processing:
// type CardPayment = { method: "card"; cardNumber: string; cvv: string }
// type UpiPayment  = { method: "upi"; upiId: string }
// type CashPayment = { method: "cash"; amount: number }
// type Payment = CardPayment | UpiPayment | CashPayment

// function processPayment(payment: Payment): string
//   Switch on method, return confirmation message
//   Card: mask card number (show last 4 digits only)
//   UPI: show upiId
//   Cash: show amount

// Test all 3 types
```

---

## Topic 1️⃣2️⃣: Async TypeScript (Promises & Async/Await)

### **Concept:**
Async operations mein TypeScript types Promise<T> se milte hain.

### **Code Example:**

```typescript
// ─────────────────────────────────────────
// PROMISE TYPES
// ─────────────────────────────────────────

type User = { id: number; name: string; email: string };

// Promise<User> = eventually User milega
function fetchUser(id: number): Promise<User> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (id > 0) {
                resolve({ id, name: "Raj", email: "raj@gmail.com" });
            } else {
                reject(new Error("Invalid user ID"));
            }
        }, 1000);
    });
}

// ─────────────────────────────────────────
// ASYNC/AWAIT (same types, cleaner syntax)
// ─────────────────────────────────────────

async function getUserProfile(userId: number): Promise<User> {
    const user = await fetchUser(userId);
    return user;
}

// Error handling
async function safeGetUser(userId: number): Promise<User | null> {
    try {
        const user = await fetchUser(userId);
        return user;
    } catch (error) {
        if (error instanceof Error) {
            console.error("Failed:", error.message);
        }
        return null;
    }
}

// ─────────────────────────────────────────
// REAL BACKEND: Database Operations
// ─────────────────────────────────────────

type CreateUserInput = { name: string; email: string; password: string };
type UserRecord = { id: number; name: string; email: string; createdAt: Date };

async function createUser(input: CreateUserInput): Promise<UserRecord> {
    // Simulate DB insert
    const newUser: UserRecord = {
        id: Date.now(),
        name: input.name,
        email: input.email,
        createdAt: new Date()
    };
    return newUser;
}

async function getAllUsers(): Promise<UserRecord[]> {
    // Simulate DB query
    return [
        { id: 1, name: "Raj", email: "raj@gmail.com", createdAt: new Date() },
        { id: 2, name: "Priya", email: "priya@gmail.com", createdAt: new Date() }
    ];
}

// ─────────────────────────────────────────
// Promise.all — Multiple async operations parallel
// ─────────────────────────────────────────

async function getDashboardData(userId: number) {
    const [user, posts, notifications] = await Promise.all([
        fetchUser(userId),                          // Promise<User>
        fetch(`/api/posts/${userId}`),              // Promise<Response>
        fetch(`/api/notifications/${userId}`)       // Promise<Response>
    ]);
    
    return { user, posts, notifications };
}
```

### **Coding Task:**

```typescript
// Blog API Simulation:
// type Post = { id: number, title: string, content: string, authorId: number, createdAt: Date }

// Async functions banao:
// 1. fetchPost(id: number): Promise<Post>
//    — setTimeout se 500ms delay, mock data return karo
// 2. fetchUserPosts(userId: number): Promise<Post[]>
//    — 3 mock posts return karo
// 3. createPost(title: string, content: string, authorId: number): Promise<Post>
//    — new post create karo
// 4. main() async function:
//    — Promise.all se ek user ke sab posts aur ek specific post parallel fetch karo
//    — Results print karo
```

---

# 📚 STEP 3: Advanced TypeScript

## Topic 1️⃣3️⃣: Enums

### **Concept:**
Named constants ka set — related values ko ek jagah group karte hain.

### **Code Example:**

```typescript
// ─────────────────────────────────────────
// NUMERIC ENUM (default)
// ─────────────────────────────────────────

enum Direction {
    Up,      // 0
    Down,    // 1
    Left,    // 2
    Right    // 3
}

let move: Direction = Direction.Up;
console.log(move);           // 0
console.log(Direction[0]);   // "Up" (reverse lookup)

// ─────────────────────────────────────────
// STRING ENUM (backend mein better)
// ─────────────────────────────────────────

enum OrderStatus {
    Pending    = "PENDING",
    Processing = "PROCESSING",
    Shipped    = "SHIPPED",
    Delivered  = "DELIVERED",
    Cancelled  = "CANCELLED"
}

let status: OrderStatus = OrderStatus.Pending;
console.log(status);  // "PENDING" — readable!

function updateOrderStatus(orderId: number, status: OrderStatus): void {
    console.log(`Order ${orderId} status: ${status}`);
}

updateOrderStatus(1001, OrderStatus.Shipped);

// ─────────────────────────────────────────
// CONST ENUM (performance — compile ho jaata hai)
// ─────────────────────────────────────────

const enum HttpMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
    PATCH = "PATCH"
}

function makeRequest(url: string, method: HttpMethod): void {
    console.log(`${method} ${url}`);
}

makeRequest("/api/users", HttpMethod.GET);
makeRequest("/api/users", HttpMethod.POST);
```

### **Enum vs Union Type — Kab kya use karo?**

```typescript
// String Union (simple cases mein prefer karo)
type Status = "pending" | "active" | "inactive";

// Enum (jab logic ke saath use karna ho ya group karna ho)
enum UserStatus {
    Pending = "PENDING",
    Active = "ACTIVE",
    Inactive = "INACTIVE"
}

// Rule: Simple strings → Union Type, Complex logic → Enum
```

---

## Topic 1️⃣4️⃣: Decorators (Advanced — NestJS mein use hota hai)

### **Concept:**
Class, method, property ke upar `@decorator` likhte hain — extra behavior add karna.

### **Enable karo tsconfig.json mein:**

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

### **Code Example:**

```typescript
// ─────────────────────────────────────────
// CLASS DECORATOR
// ─────────────────────────────────────────

function Logger(target: Function) {
    console.log(`Class created: ${target.name}`);
}

@Logger
class UserService {
    getUser(id: number) {
        return { id, name: "Raj" };
    }
}

// ─────────────────────────────────────────
// METHOD DECORATOR
// ─────────────────────────────────────────

function LogMethod(target: any, key: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    
    descriptor.value = function(...args: any[]) {
        console.log(`Calling ${key} with:`, args);
        const result = original.apply(this, args);
        console.log(`${key} returned:`, result);
        return result;
    };
    
    return descriptor;
}

class Calculator {
    @LogMethod
    add(a: number, b: number): number {
        return a + b;
    }
}

const calc = new Calculator();
calc.add(5, 3);
// Log: "Calling add with: [5, 3]"
// Log: "add returned: 8"

// ─────────────────────────────────────────
// NestJS Style (Real World)
// ─────────────────────────────────────────

// NestJS mein aise decorators use hote hain:
// @Controller('/users')
// @Get('/:id')
// @Injectable()
// @Body(), @Param(), @Query()
// Ye sab internally aise hi kaam karte hain
```

---

## Topic 1️⃣5️⃣: TypeScript + Node.js Backend (Complete Example)

### **Real-World Mini Project — User API:**

```typescript
// src/types/index.ts
export type User = {
    id: number;
    name: string;
    email: string;
    role: "admin" | "user";
    createdAt: Date;
};

export type CreateUserDto = Omit<User, 'id' | 'createdAt'>;
export type UpdateUserDto = Partial<Omit<User, 'id' | 'createdAt'>>;
export type UserResponse = Omit<User, 'role'> & { displayRole: string };

export type ApiResponse<T> = {
    success: boolean;
    data?: T;
    error?: string;
    total?: number;
};
```

```typescript
// src/services/userService.ts
import { User, CreateUserDto, UpdateUserDto } from '../types';

class UserService {
    private users: User[] = [
        { id: 1, name: "Raj Kumar", email: "raj@gmail.com", role: "admin", createdAt: new Date() },
        { id: 2, name: "Priya Sharma", email: "priya@gmail.com", role: "user", createdAt: new Date() }
    ];
    private nextId = 3;

    async findAll(): Promise<User[]> {
        return this.users;
    }

    async findById(id: number): Promise<User | null> {
        return this.users.find(u => u.id === id) ?? null;
    }

    async create(dto: CreateUserDto): Promise<User> {
        const newUser: User = {
            id: this.nextId++,
            ...dto,
            createdAt: new Date()
        };
        this.users.push(newUser);
        return newUser;
    }

    async update(id: number, dto: UpdateUserDto): Promise<User | null> {
        const index = this.users.findIndex(u => u.id === id);
        if (index === -1) return null;
        
        this.users[index] = { ...this.users[index], ...dto };
        return this.users[index];
    }

    async delete(id: number): Promise<boolean> {
        const index = this.users.findIndex(u => u.id === id);
        if (index === -1) return false;
        
        this.users.splice(index, 1);
        return true;
    }
}

export const userService = new UserService();
```

```typescript
// src/routes/userRoutes.ts
import { Router, Request, Response } from 'express';
import { userService } from '../services/userService';
import { ApiResponse, CreateUserDto, UpdateUserDto, User } from '../types';

const router = Router();

// GET /api/users
router.get('/', async (req: Request, res: Response<ApiResponse<User[]>>) => {
    const users = await userService.findAll();
    res.json({ success: true, data: users, total: users.length });
});

// GET /api/users/:id
router.get('/:id', async (req: Request<{ id: string }>, res: Response<ApiResponse<User>>) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ success: false, error: "Invalid ID" });
    }

    const user = await userService.findById(id);
    if (!user) {
        return res.status(404).json({ success: false, error: "User not found" });
    }

    res.json({ success: true, data: user });
});

// POST /api/users
router.post('/', async (req: Request<{}, {}, CreateUserDto>, res: Response<ApiResponse<User>>) => {
    const { name, email, role } = req.body;

    if (!name || !email) {
        return res.status(400).json({ success: false, error: "Name and email required" });
    }

    const newUser = await userService.create({ name, email, role: role || "user" });
    res.status(201).json({ success: true, data: newUser });
});

// PATCH /api/users/:id
router.patch('/:id', async (req: Request<{ id: string }, {}, UpdateUserDto>, res: Response<ApiResponse<User>>) => {
    const id = parseInt(req.params.id);
    const updated = await userService.update(id, req.body);

    if (!updated) {
        return res.status(404).json({ success: false, error: "User not found" });
    }

    res.json({ success: true, data: updated });
});

// DELETE /api/users/:id
router.delete('/:id', async (req: Request<{ id: string }>, res: Response<ApiResponse<null>>) => {
    const id = parseInt(req.params.id);
    const deleted = await userService.delete(id);

    if (!deleted) {
        return res.status(404).json({ success: false, error: "User not found" });
    }

    res.json({ success: true });
});

export default router;
```

```typescript
// src/index.ts
import express from 'express';
import userRoutes from './routes/userRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

app.use('/api/users', userRoutes);

app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
```

---

# 📚 STEP 4: Interview Questions & Quick Reference

## Topic 1️⃣6️⃣: Common TypeScript Interview Questions

### **Q1: TypeScript aur JavaScript mein main difference kya hai?**

```
JavaScript: Dynamically typed — runtime par type pata chalta hai
TypeScript: Statically typed — compile time par type check hota hai

TypeScript ek superset hai — sabhi valid JS code, valid TS code bhi hai.
TypeScript browser mein directly nahi chalta — pehle JS mein compile hota hai.
```

### **Q2: any vs unknown vs never — kya difference hai?**

```typescript
// any — TypeScript type checking band ho jaati hai (avoid karo!)
let a: any = "hello";
a = 42;           // OK
a.doAnything();   // OK (runtime pe fail ho sakta hai)

// unknown — safe version of any
let b: unknown = "hello";
// b.toUpperCase();  // ❌ ERROR — pehle type check karo!
if (typeof b === "string") {
    b.toUpperCase();  // ✅ OK — type guard ke baad
}

// never — yeh value kabhi exist nahi kar sakti
function throwError(msg: string): never {
    throw new Error(msg);   // Kabhi return nahi karta
}

function exhaustiveCheck(value: never): never {
    throw new Error(`Unexpected value: ${value}`);
}
```

### **Q3: Interface vs Type Alias — kab kya use karo?**

```typescript
// Interface: Objects/Classes ke liye, extend kar sakte hain
interface Vehicle { brand: string; }
interface Car extends Vehicle { doors: number; }

// Type Alias: Union types, tuples, primitives ke liye
type StringOrNumber = string | number;
type Point = [number, number];
type Callback = () => void;

// Object ke liye dono theek hain, zyada prefer: Interface for OOP, Type for everything else
```

### **Q4: Generic constraints kab use karte hain?**

```typescript
// T extends {} — T mein kuch toh properties honi chahiye
function merge<T extends object, U extends object>(obj1: T, obj2: U): T & U {
    return { ...obj1, ...obj2 };
}

// T extends keyof U — T, U ki koi property ka naam hona chahiye
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}

const user = { id: 1, name: "Raj" };
getProperty(user, "name");    // ✅ "Raj"
getProperty(user, "salary");  // ❌ ERROR - "salary" user mein nahi hai
```

### **Q5: keyof aur typeof kya karte hain?**

```typescript
type User = { id: number; name: string; email: string };

// keyof — type ki saari keys ka union
type UserKeys = keyof User;   // "id" | "name" | "email"

// typeof — value ka type nikalna
const config = { port: 3000, host: "localhost" };
type Config = typeof config;  // { port: number; host: string }
```

### **Q6: Conditional Types kya hain?**

```typescript
// T extends U ? X : Y — ternary operator for types
type IsString<T> = T extends string ? true : false;

type A = IsString<string>;   // true
type B = IsString<number>;   // false

// Real use case
type NonNullable<T> = T extends null | undefined ? never : T;
type UserOrNull = string | null | undefined;
type CleanUser = NonNullable<UserOrNull>;   // string
```

---

## Topic 1️⃣7️⃣: Quick Reference Cheatsheet

```typescript
// ═══════════════════════════════════════════
// TYPES QUICK REFERENCE
// ═══════════════════════════════════════════

// Primitives
let s: string = "hello";
let n: number = 42;
let b: boolean = true;
let u: undefined = undefined;
let nl: null = null;
let sym: symbol = Symbol();
let big: bigint = 100n;

// Arrays
let arr1: string[] = [];
let arr2: Array<number> = [];
let tuple: [string, number] = ["a", 1];

// Objects
type Obj = { key: string; value: number };

// Functions
type Fn = (a: string, b: number) => boolean;

// Union & Intersection
type U = string | number;
type I = TypeA & TypeB;

// Literal
type Status = "active" | "inactive";

// Generics
function identity<T>(value: T): T { return value; }

// Utility Types
Partial<T>         // Sab optional
Required<T>        // Sab required
Readonly<T>        // Sab readonly
Pick<T, "a"|"b">   // Sirf ye fields
Omit<T, "a">       // Ye field hatao
Record<K, V>       // Key-value map
ReturnType<F>      // Function return type
Parameters<F>      // Function parameter types
Awaited<T>         // Promise ke andar ka type

// Type Guards
typeof x === "string"
x instanceof MyClass
"key" in object

// Non-null assertion (use carefully!)
const el = document.getElementById("id")!; // null nahi hai guaranteed
```

---

## 🎯 Final Coding Project: TypeScript Todo API

```typescript
// Puri TypeScript Todo API banao with:

// Types:
type TodoStatus = "todo" | "in_progress" | "done";
type Priority = "low" | "medium" | "high";

type Todo = {
    id: number;
    title: string;
    description?: string;
    status: TodoStatus;
    priority: Priority;
    tags: string[];
    createdAt: Date;
    completedAt?: Date;
};

type CreateTodoDto = Omit<Todo, 'id' | 'createdAt' | 'completedAt' | 'status'> & {
    status?: TodoStatus;
};

type UpdateTodoDto = Partial<Omit<Todo, 'id' | 'createdAt'>>;

type ApiResponse<T> = {
    success: boolean;
    data?: T;
    error?: string;
    total?: number;
};

// TodoService class banao with:
// - findAll(status?: TodoStatus): Promise<Todo[]>
// - findById(id: number): Promise<Todo | null>
// - create(dto: CreateTodoDto): Promise<Todo>
// - update(id: number, dto: UpdateTodoDto): Promise<Todo | null>
// - delete(id: number): Promise<boolean>
// - markComplete(id: number): Promise<Todo | null>
// - getByPriority(priority: Priority): Promise<Todo[]>

// Express routes banao:
// GET    /api/todos          → all todos (optional ?status= filter)
// GET    /api/todos/:id      → single todo
// POST   /api/todos          → create
// PATCH  /api/todos/:id      → update
// DELETE /api/todos/:id      → delete
// POST   /api/todos/:id/complete → mark done

// Test karo Postman ya curl se
```

---

## 🚀 TypeScript Sikho — Order mein:

```
Week 1: Basic types, annotations, type inference, arrays, objects
Week 2: Interfaces, type aliases, union/intersection, functions
Week 3: Generics, utility types, type guards
Week 4: Classes, decorators basics, async TypeScript
Week 5: Real project — Express + TypeScript REST API
Week 6: NestJS (TypeScript-first framework) start karo
```

## 📦 Must-Know Packages:

```bash
@types/node           # Node.js types
@types/express        # Express types
@types/cors           # CORS types
ts-node               # TypeScript directly run karo
nodemon               # Auto restart dev mein
typescript            # Compiler
zod                   # Runtime type validation (TypeScript ke saath best combo)
```

---

**TypeScript seekhne ka best tarika: JavaScript code likh, phir types add karo.**
**Strict mode hamesha ON rakho — zyada types likhne padenge par bugs kam aayenge!**
