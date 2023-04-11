



import { Router } from 'express';
import { AddData, findByEmail, findByInSorted, findByIsbn, getAll } from '../controller/findall.js';

const dataRoute = Router();
dataRoute.get('/allData', getAll);
dataRoute.get('/allDataInSorted', findByInSorted);
dataRoute.patch('/findByEmail', findByEmail);
dataRoute.patch('/findByIsbn', findByIsbn);
dataRoute.patch('/addData', AddData);

export default dataRoute;