/*
 * Copyright (c) 2023 by MILOSZ GILGA <http://miloszgilga.pl>
 *
 * File name: cms-projects.controller.ts
 * Last modified: 19/04/2023, 12:08
 * Project name: personal-website
 *
 * LICENSE NOT SPECIFIED.
 *
 * For more info about use this code in your project, make contact with
 * original author. Project created only for personal purposes.
 */

import { Request, Response } from "express";
import mongoose from "mongoose";

import logger from "../utils/logger";
import utilities from "../utils/utilities";
import githubApi from "../utils/github-api";
import * as Constant from "../utils/constants";
import { AlertTypeId } from "../utils/session";

import { ProjectModel } from "../db/schemas/project.schema";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class CmsProjectsController {

    async getProjectsPage(req: Request, res: Response): Promise<void> {
        const { path, title, layout } = Constant.CMS_PROJECTS_EJS;
        const { q, page, total } = req.query;

        let selectedPage = Number(page) || 1;
        const totalPerPage = Number(total) || Constant.PAGINATION_STATES[0];
        const paginationUrl = q ? `/cms/projects?q=${q}&` : "/cms/projects?";

        const regex = { $regex: q || "", $options: "i" };
        const where = { $or: [ { name: regex }, { alternativeName: regex } ] };
        let query = ProjectModel.find(where);

        const resultsCount = await ProjectModel.find(where).count();
        const pagesCount = Math.ceil(resultsCount / totalPerPage);

        const retUrl = utilities.validatePaginationDataAndGetUrl(paginationUrl, selectedPage, pagesCount, totalPerPage);
        if (retUrl) {
            res.redirect(retUrl);
            return;
        }
        query = query.skip((selectedPage - 1) * totalPerPage);
        query = query.limit(totalPerPage);
        const projects = await query.exec();

        res.render(path, { title, layout,
            pageAlert: utilities.extractAlertAndDestroy(req, AlertTypeId.CMS_PROJECTS_PAGE),
            projects,
            page: selectedPage,
            pagesCount,
            resultsCount,
            totalPerPage,
            paginationUrl,
        });
    };

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    async getAddProjectPage(req: Request, res: Response): Promise<void> {
        const { path, title, layout } = Constant.CMS_ADD_PROJECT_EJS;
        const notPersistProjects = await githubApi.getAllParsedNotPersistedProject();

        res.render(path, { title, layout,
            projectAction: "Add",
            projects: notPersistProjects,
            techStacks: JSON.stringify([ { name: "", error: false, errorMess: "" } ]),
        });
    };

    async postAddProjectPage(req: Request, res: Response): Promise<void> {
        const { path, title, layout } = Constant.CMS_ADD_PROJECT_EJS;
        const { ghProject, altName, detDesc, techStacks } = req.body;

        const notPersistProjects = await githubApi.getAllParsedNotPersistedProject();
        try {
            const newProject = new ProjectModel({
                id: await githubApi.getRepoId(ghProject),
                name: ghProject,
                alternativeName: altName,
                detailsDescription: detDesc,
                techStackPositions: techStacks.map((s: string, i: number) => ({ pos: i, name: s })),
            });
            await newProject.save();

            req.session[AlertTypeId.CMS_PROJECTS_PAGE] = {
                type: Constant.ALERT_SUCCESS,
                message: `Project <strong>${newProject.name}</strong> was successfully created.`,
            };
            logger.info(`Successfull created project. Project: ${JSON.stringify(newProject)}`);
            res.redirect("/cms/projects");
        } catch (ex: any) {
            logger.error(`Failure created project. Cause: ${ex.message}`);

            const techStacksWithErrors = techStacks.map((s: string, i: number) => {
                const error = ex.errors["techStackPositions." + String(i) + ".name"];
                return { name: s, error, errorMess: error?.message }
            });
            res.render(path, { title, layout,
                projectAction: "Add",
                errors: ex.errors,
                projects: notPersistProjects,
                form: req.body,
                techStacks: JSON.stringify(techStacksWithErrors),
            });
        }
    };

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    async getUpdateProjectPage(req: Request, res: Response): Promise<void> {
        const { path, title, layout } = Constant.CMS_UPDATE_PROJECT_EJS;
        const { projectId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            res.redirect("/cms/projects");
            return;
        }
        const project = await ProjectModel.findById(projectId);
        if (!project) {
            res.redirect("/cms/projects");
            return;
        }
        const notPersistProjects = await githubApi.getAllParsedNotPersistedProject(project.name);
        const { name, alternativeName, detailsDescription } = project;
        const techStacks = project.techStackPositions.map(e => ({ name: e.name, error: false, errorMess: "" }));

        res.render(path, { title, layout,
            projectAction: "Update",
            projects: notPersistProjects,
            form: { ghProject: name, altName: alternativeName, detDesc: detailsDescription },
            techStacks: JSON.stringify(techStacks),
        });
    };

    async postUpdateProjectPage(req: Request, res: Response): Promise<void> {
        const { path, title, layout } = Constant.CMS_UPDATE_PROJECT_EJS;
        const { ghProject, altName, detDesc, techStacks } = req.body;
        const { projectId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            res.redirect("/cms/projects");
            return;
        }
        const updatedProject = await ProjectModel.findById(projectId);
        if (!updatedProject) {
            res.redirect("/cms/projects");
            return;
        }
        const notPersistProjects = await githubApi.getAllParsedNotPersistedProject(updatedProject.name);
        try {
            updatedProject.id = notPersistProjects.find(e => e.name === ghProject)?.id;
            updatedProject.name = ghProject;
            updatedProject.alternativeName = altName;
            updatedProject.detailsDescription = detDesc;
            updatedProject.techStackPositions = techStacks.map((s: string, i: number) => ({ pos: i, name: s }));

            await updatedProject.save();

            req.session[AlertTypeId.CMS_PROJECTS_PAGE] = {
                type: Constant.ALERT_SUCCESS,
                message: `Project <strong>${updatedProject.name}</strong> was successfully updated.`,
            };
            logger.info(`Successfull updated project. Project: ${JSON.stringify(updatedProject)}`);
            res.redirect("/cms/projects");
        } catch (ex: any) {
            logger.error(`Failure updated project. Cause: ${ex.message}`);

            const techStacksWithErrors = techStacks.map((s: string, i: number) => {
                const error = ex.errors["techStackPositions." + String(i) + ".name"];
                return { name: s, error, errorMess: error?.message }
            });
            res.render(path, { title, layout,
                projectAction: "Update",
                errors: ex.errors,
                projects: notPersistProjects,
                form: req.body,
                techStacks: JSON.stringify(techStacksWithErrors),
            });
        }
    };

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    async getDeleteProjectRedirect(req: Request, res: Response): Promise<void> {
        const { projectId } = req.params;

        let alertType: string = Constant.ALERT_SUCCESS;
        let alertMessage: string = "";

        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            res.redirect("/cms/projects");
            return;
        }
        try {
            const project = await ProjectModel.findById(projectId);
            if (!project) {
                res.redirect("/cms/projects");
                return;
            }
            await ProjectModel.findByIdAndRemove(projectId);

            alertMessage = `Project <strong>${project.name}</strong> was successfully removed.`;
            logger.info(`Successfull delete project: ${JSON.stringify(project)}.`);
        } catch (ex: any) {
            alertType = Constant.ALERT_DANGER;
            alertMessage = ex.message;
            logger.error(`Failure delete project. Cause: ${ex.message}`);
        }
        req.session[AlertTypeId.CMS_PROJECTS_PAGE] = {
            type: alertType,
            message: alertMessage,
        };
        res.redirect("/cms/projects");
    };
}

export default new CmsProjectsController;
