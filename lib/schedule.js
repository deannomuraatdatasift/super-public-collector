"use strict";
const CronJob = require('cron').CronJob;

const request = require('./request');
const db = require('./db');
const time = require('./helpers/time');


var job = new CronJob('1 * * * * *', function() {

        request
            .get()
            .then(function (spData) {
                console.log(time.ts() + " - DEBUG: Remaining: " + spData.remaining);
                console.log(time.ts() + " - DEBUG: Reset_at: " + time.unixToHuman(spData.reset_at));
                return db.add(spData.interactions);
            })
            .catch(function (err) {
                console.log("ERROR: ");
                console.log(err.error ? err.error : err);
                if(err.error.reset_at){
                    console.log("reset_at: " + time.unixToHuman(err.error.reset_at));
                }
                return;
            });

    }, function () {
        /* This function is executed when the job stops */
    },
    true /* Start the job right now */
);