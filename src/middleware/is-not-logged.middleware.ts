/*
 * Copyright (c) 2023 by MILOSZ GILGA <http://miloszgilga.pl>
 *
 * File name: variables.middleware.ts
 * Last modified: 20/04/2023, 21:36
 * Project name: personal-website
 *
 * LICENSE NOT SPECIFIED.
 *
 * For more info about use this code in your project, make contact with
 * original author. Project created only for personal purposes.
 */

import { Request, Response } from "express";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function isNotLoggedAdminMiddleware(req: Request, res: Response, next: CallableFunction) {
    const user = req.session.loggedUser;
    if (user) {
        res.redirect("/cms/projects");
        return;
    }
    next();
}