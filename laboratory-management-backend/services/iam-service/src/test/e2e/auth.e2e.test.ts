import { describe, it, beforeEach, expect, vi, afterEach } from "vitest";
import request from "supertest";
import express from "express";
import cookieParser from "cookie-parser";

import routes from "../../routes/index.js";

import bcrypt from "bcryptjs";
import * as JwtUtil from "../../utils/jwt.util.js";

import { UserService } from "../../services/user.service.js";
import patientServiceClient from "../../services/patientService.client.js";
import {
  errorHandler,
  notFoundHandler,
} from "../../middlewares/error.middleware.js";

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use("/api", routes);

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}

describe("Auth E2E - POST /api/login", () => {
  let app: express.Express;

  beforeEach(() => {
    app = makeApp();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("400 when missing credentials", async () => {
    const res = await request(app).post("/api/login").send({});
    expect(res.status).toBe(400);
    expect(res.body?.error?.message).toBe("Missing credentials");
  });

  it("400 when user not found (email)", async () => {
    vi.spyOn(UserService.prototype, "getUserByEmail").mockResolvedValue(
      null as any
    );
    const res = await request(app).post("/api/login").send({
      identifier: "nope@example.com",
      password: "x",
    });
    expect(res.status).toBe(400);
    expect(res.body?.error?.message).toBe("User not found!");
  });

  it("400 when invalid password", async () => {
    const fakeUser = {
      _id: "U-1",
      email: "u@example.com",
      passwordHash: "hashed",
      role: ["USER"],
    } as any;
    vi.spyOn(UserService.prototype, "getUserByEmail").mockResolvedValue(
      fakeUser
    );
    vi.spyOn(bcrypt, "compare").mockResolvedValue(false as any);

    const res = await request(app).post("/api/login").send({
      identifier: "u@example.com",
      password: "wrong",
    });

    expect(res.status).toBe(400);
    expect(res.body?.error?.message).toBe("Invalid password!");
  });

  it("200 when valid login (sets cookies and returns user)", async () => {
    const fakeUser = {
      _id: "U-1",
      email: "u@example.com",
      phoneNumber: "123",
      fullName: "User",
      passwordHash: "hashed",
      role: ["USER"],
    } as any;

    vi.spyOn(UserService.prototype, "getUserByEmail").mockResolvedValue(
      fakeUser
    );
    vi.spyOn(bcrypt, "compare").mockResolvedValue(true as any);

    vi.spyOn(JwtUtil, "generateJWT").mockImplementation((res: any) => {
      res.cookie("accessToken", "fake", { httpOnly: true });
      res.cookie("refreshToken", "fake", { httpOnly: true });
    });

    const res = await request(app).post("/api/login").send({
      identifier: "u@example.com",
      password: "correct",
    });

    expect(res.status).toBe(200);
    expect(res.body?.message).toBe("Login successful!");
    expect(res.body?.user?.email).toBe(fakeUser.email);
    const setCookieHeader = res.headers["set-cookie"];
    const setCookies: string[] = Array.isArray(setCookieHeader)
      ? setCookieHeader
      : setCookieHeader
      ? [setCookieHeader]
      : [];
    expect(setCookies.some((c) => c.startsWith("accessToken="))).toBe(true);
    expect(setCookies.some((c) => c.startsWith("refreshToken="))).toBe(true);
  });
});

describe("Auth E2E - POST /api/register", () => {
  let app: express.Express;

  beforeEach(() => {
    app = makeApp();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("400 when missing credentials", async () => {
    const res = await request(app).post("/api/register").send({});
    expect(res.status).toBe(400);
    expect(res.body?.error?.message).toSatisfy((m: string) =>
      [
        "Email is required",
        "Password is required",
        "Full name is required",
        "Identity number is required",
      ].includes(m)
    );
  });

  it("400 when user already exists (email)", async () => {
    const fakeUser = {
      _id: "U-1",
      email: "u@example.com",
      passwordHash: "hashed",
      role: ["USER"],
    } as any;

    const registerData = {
      email: "u@example.com",
      fullName: "User1",
      password: "x12234",
      identityNumber: "1234958687",
      dateOfBirth: "2002-02-13",
      gender: "Male",
      age: 12,
      phoneNumber: "1002939394",
      address: "123 Street",
    } as any;
    vi.spyOn(UserService.prototype, "getUserByEmail").mockResolvedValue(fakeUser);
    vi.spyOn(UserService.prototype, "getUserByPhoneNumber").mockResolvedValue(null as any);
    const res = await request(app).post("/api/register").send(registerData);
    expect(res.status).toBe(400);
    expect(res.body?.error?.message).toBe("Email already exists!");
  });

  it("200 when valid register", async () => {
    const registerData = {
      email: "new@example.com",
      fullName: "New User",
      password: "x12234",
      identityNumber: "1234958687",
      dateOfBirth: "2002-02-13",
      gender: "Male",
      age: 12,
      phoneNumber: "1002939394",
      address: "123 Street",
    } as any;

    vi.spyOn(UserService.prototype, "getUserByEmail").mockResolvedValue(null as any);
    vi.spyOn(UserService.prototype, "getUserByPhoneNumber").mockResolvedValue(null as any);
    vi.spyOn(UserService.prototype, "createUser").mockResolvedValue({
      _id: "U-2",
      email: registerData.email,
      fullName: registerData.fullName,
      phoneNumber: registerData.phoneNumber,
      role: ["USER"],
    } as any);
    vi.spyOn(patientServiceClient, "createPatientForUser").mockResolvedValue(undefined as any);

    const res = await request(app).post("/api/register").send(registerData);

    expect(res.status).toBe(200);
    expect(res.body?.message).toBe("User created successfully!");
  });
});
