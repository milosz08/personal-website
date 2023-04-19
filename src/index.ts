/*
 * Copyright (c) 2023 by MILOSZ GILGA <http://miloszgilga.pl>
 *
 * File name: index.ts
 * Last modified: 14/04/2023, 16:07
 * Project name: personal-website
 *
 * LICENSE NOT SPECIFIED.
 *
 * For more info about use this code in your project, make contact with
 * original author. Project created only for personal purposes.
 */

import express, { Express } from "express";
import expressEjsLayouts from "express-ejs-layouts";

import dbInit from "./db/db-config";
import router from "./routes/web-routes";

import config from "./utils/config";
import logger from "./utils/logger";
import utilities from "./utils/utilities";
import { DEFAULT_LAYOUT } from "./utils/constants";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const app: Express = express();
const port = config.PORT;

dbInit();

app.use(expressEjsLayouts);
app.set("layout", DEFAULT_LAYOUT);

app.set("view engine", "ejs");
app.set("views", utilities.getProjectRootPath("/views"));

app.use('/assets', express.static(utilities.getProjectRootPath("public")));
app.use(router);

app.listen(port, () => logger.info(`Server is up and running at @ http://127.0.0.1:${port}`));
