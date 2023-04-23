/*
 * Copyright (c) 2023 by MILOSZ GILGA <http://miloszgilga.pl>
 *
 * File name: utilities.ts
 * Last modified: 14/04/2023, 16:54
 * Project name: personal-website
 *
 * LICENSE NOT SPECIFIED.
 *
 * For more info about use this code in your project, make contact with
 * original author. Project created only for personal purposes.
 */

import { Request } from "express";
import path from "path";

import { PASSWORD_REGEX } from "./constants";
import { IUser } from "../db/schemas/user-schema";
import { AlertType, AlertTypeId } from "./session";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Utilities {

    private readonly CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    getProjectRootPath(relativeDir: string): string {
        return path.join(__dirname, "..", relativeDir);
    };

    extractAlertAndDestroy(req: Request, alertId: AlertTypeId): AlertType {
        let pageAlert = null;
        if (req.session[alertId]) {
            pageAlert = JSON.parse(JSON.stringify(req.session[alertId]));
        }
        req.session[alertId] = null;
        return pageAlert;
    };

    otaTokenGenerator(length: number = 10): string {
        let token: string = "";
        for (let i = 0; i < length; i++) {
            token += this.CHARS.charAt(Math.random() * this.CHARS.length);
        }
        return token;
    };

    nowPlusNminutes(minutes: number): Date {
        const date: Date = new Date;
        date.setMinutes(date.getMinutes() + minutes);
        return date;
    };

    validatePassword(user: IUser, newPassword: string, repeatNewPassword: string): void {
        if (!PASSWORD_REGEX.test(newPassword)) {
            throw new Error("Password must have at least 8 characters, one big letter, one number and one " +
                "special character.");
        }
        if (user.compareHash(newPassword)) {
            throw new Error("New password must be different from actual.");
        }
        if (newPassword !== repeatNewPassword) {
            throw new Error("Password and repeat password fields are not the same.");
        }
    };

    getFullUrl(req: Request): string {
        return req.protocol + '://' + req.get('host');
    };
}

export default new Utilities;
