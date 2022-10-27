//jshint esversion:6
module.exports = function (time1, time2) {

    let ms = Math.abs(time1 - time2);
    let days = Math.floor(ms/1000/60/60/24);
    ms -= days*60*60*1000*24;
    let hrs = Math.floor(ms/1000/60/60);
    ms -= hrs*60*60*1000;
    let min = Math.floor(ms/1000/60);
    ms -= min*60*1000;
    let sec = Math.floor(ms/1000);

    return [days,hrs,min,sec];
};