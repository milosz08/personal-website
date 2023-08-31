/*
 * Copyright (c) 2023 by MILOSZ GILGA <https://miloszgilga.pl>
 *
 *   File name: session.ts
 *   Created at: 2023-05-29, 01:50:56
 *   Last updated at: 2023-08-31, 19:53:23
 *   Project name: <<msph_projectName>>
 *
 *   LICENSE NOT SPECIFIED.
 *
 * For more info about use this code in your project, make contact with
 * original author. Project created only for personal purposes.
 */
import { SessionOptions } from 'express-session';
import config from './config';

export type AlertType = { type: string; message: string } | null;
export type UserType = {
  login: string;
  role: string;
  isFirstLogin: boolean;
} | null;

export enum AlertTypeId {
  LOGIN_PAGE = 'loginPageAlert',
  REQUEST_CHANGE_PASSWORD_PAGE = 'requestChangePasswordPageAlert',
  CMS_PROJECTS_PAGE = 'cmsProjectsPageAlert',
  CMS_PROJECT_UPDATE_PAGE = 'cmsProjectUpdatePageAlert',
  CMS_ACCOUNTS_PAGE = 'cmsAccountsPageAlert',
  CMS_PERSONAL_DATA_PAGE = 'cmsPersonalDataPageAlert',
  CMS_SOCIAL_LINKS_PAGE = 'cmsSocialLinksPageAlert',
}

declare module 'express-session' {
  interface SessionData {
    loggedUser: UserType;
    [AlertTypeId.LOGIN_PAGE]: AlertType;
    [AlertTypeId.CMS_PROJECTS_PAGE]: AlertType;
  }
}

class Session {
  configure(): SessionOptions {
    return {
      secret: config.SESSION_KEY,
      saveUninitialized: true,
      cookie: { maxAge: 1000 * 60 * 60 * 24 },
      resave: false,
    };
  }
}

export default new Session();
