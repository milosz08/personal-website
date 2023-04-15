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

import path from "path";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Utilities {

    getProjectRootPath(relativeDir: string): string {
        return path.join(__dirname, "..", relativeDir);
    };
}

export default new Utilities;
