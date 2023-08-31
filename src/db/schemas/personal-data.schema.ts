/*
 * Copyright (c) 2023 by MILOSZ GILGA <https://miloszgilga.pl>
 *
 *   File name: personal-data.schema.ts
 *   Created at: 2023-05-29, 01:50:56
 *   Last updated at: 2023-08-31, 19:48:39
 *   Project name: <<msph_projectName>>
 *
 *   LICENSE NOT SPECIFIED.
 *
 * For more info about use this code in your project, make contact with
 * original author. Project created only for personal purposes.
 */
import mongoose, { Model, Schema } from 'mongoose';
import dbValidators from '../validators.db';

export type PersonalData = {
  descriptionTop: string;
  descriptionBottom: string;
  mavenCentralLink: string;
  firstEmail: string;
  secondEmail: string;
  githubAccountLink: string;
  githubName: string;
  githubToken: string;
};

const PersonalDataSchema: Schema<PersonalData> = new Schema({
  descriptionTop: {
    type: String,
    required: [true, 'First description section is required.'],
    minlength: [
      10,
      'First description section must have at least 10 characters.',
    ],
    maxlength: [
      500,
      'First description section must have less or equal 500 characters.',
    ],
  },
  mavenCentralLink: {
    type: String,
    required: [true, 'Maven central link is required.'],
    validate: [dbValidators.validateLink, 'Link is invalid.'],
  },
  descriptionBottom: {
    type: String,
    required: [true, 'Second description section is required.'],
    minlength: [
      10,
      'Second description section must have at least 10 characters.',
    ],
    maxlength: [
      500,
      'Second description section must have less or equal 500 characters.',
    ],
  },
  firstEmail: {
    type: String,
    required: [true, 'First email is required.'],
    validate: [dbValidators.validateEmail, 'Email is invalid.'],
  },
  secondEmail: {
    type: String,
    required: [true, 'Alternative email is required.'],
    validate: [dbValidators.validateEmail, 'Alternative email is invalid.'],
  },
  githubAccountLink: {
    type: String,
    required: [true, 'Github account link is required.'],
    validate: [dbValidators.validateLink, 'Link is invalid.'],
  },
  githubName: {
    type: String,
    required: [true, 'Github name is required.'],
  },
  githubToken: {
    type: String,
  },
});

export const PersonalDataModel: Model<PersonalData> = mongoose.model(
  'PersonalData',
  PersonalDataSchema
);
