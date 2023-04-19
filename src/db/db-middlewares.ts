/*
 * Copyright (c) 2023 by MILOSZ GILGA <http://miloszgilga.pl>
 *
 * File name: db-middlewares.ts
 * Last modified: 19/04/2023, 16:08
 * Project name: personal-website
 *
 * LICENSE NOT SPECIFIED.
 *
 * For more info about use this code in your project, make contact with
 * original author. Project created only for personal purposes.
 */

import bcrypt from "bcrypt";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class DbMiddlewares {

    hashPassword(rawPassword: string): string {
        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(rawPassword, salt)
    };
}

export default new DbMiddlewares;
