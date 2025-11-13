import { IAuditLog } from "../db/models/AuditLog.model.js";
import { auditLogRepository } from "../repositories/index.js";
import { AppError } from "../utils/error.util.js";
import { userRepository } from "../repositories/index.js";
import { transporter } from "../utils/email.util.js";
import { UserService } from "./user.service.js";
import jwt, { SignOptions } from "jsonwebtoken";

const userSerivce = new UserService();

export class EmailService {
  async requestPasswordReset(email: string): Promise<void> {
    try {
      if (!email) throw new AppError(400, "Email is required");

      const user = await userRepository.findOne({ email });
      if (!user) throw new AppError(400, "User with given email doesn't exist");
      

      const dedicatedToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: process.env.JWT_EXPIRY } as SignOptions
      );

      await transporter.verify();
      console.log("Email service is ready.");

      const link = `${process.env.WEB_URL}/reset-password?token=${dedicatedToken}`;
      await transporter.sendMail({
        from: "vuthienloct@gmail.com",
        to: user.email,
        subject: "Reset your password",
        text: `Reset your password using this link: ${link}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
            <h2 style="margin: 0 0 12px; color: #111;">Password reset requested</h2>
            <p style="margin: 0 0 16px;">We received a request to reset your password. Click the button below to set a new password.</p>
            <p style="margin: 0 0 16px;">If you did not request this, you can safely ignore this email.</p>
            <div style="margin: 24px 0;">
              <a href="${link}" style="background:#2563eb;color:#fff;padding:12px 18px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:600">Reset Password</a>
            </div>
            <p style="margin: 0 0 8px; color:#555;">Or copy and paste this link into your browser:</p>
            <p style="margin: 0; word-break: break-all; color:#2563eb;">
              <a href="${link}" style="color:#2563eb;">${link}</a>
            </p>
            <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
            <p style="font-size:12px; color:#666; margin:0;">This link may expire based on your security settings.</p>
          </div>
        `,
      });

      await this._logEvent(
        "E_00001",
        "CREATE",
        "Password reset link sent to your email account",
        user._id
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async confirmPasswordReset(token: string, password: string): Promise<void> {
    try {
      if (!token) throw new AppError(400, "Dedicated token is required");

      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as {
        userId: string;
      };

      const user = await userRepository.findById(decoded.userId);
      if (!user) throw new AppError(400, "User ID doesn't exist");

      await userSerivce.updateUser(
        user._id,
        {
          password: password,
        },
      );

      await this._logEvent(
        "E_00002",
        "UPDATE",
        "Password has been reset through reset link",
        user._id
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  private async _logEvent(
    eventCode: string,
    action: string,
    eventMessage: string,
    perfomedBy: string
  ): Promise<void> {
    await auditLogRepository.create({
      eventCode,
      action,
      eventMessage,
      userId: perfomedBy,
      performedAt: new Date(),
      serviceName: "Password Reset Service",
    });
  }
}
