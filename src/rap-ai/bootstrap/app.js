/**
 * @file app.js
 * @author xxx
 */

/* globals App swan */

/* eslint-disable babel/new-cap */


import {config} from './include/config';

let env = '';
// removeIf(!development)
env = 'dev';
// endRemoveIf(!development)
// removeIf(!production)
env = 'pro';
// endRemoveIf(!production)
// removeIf(!test)
env = 'qa';
// endRemoveIf(!test)
let envConfig = config[env];

App({
    globalData: {},

    onLaunch() {},

    onShow() {},

    onHide() {},

    onError() {}
});
