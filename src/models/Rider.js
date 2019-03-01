/**
 * Constructor function for the class Rider
 * @constructor
 * @param {{num: number, name: string, }} info - Object creation slots.
 */
function Rider(info) {
  this.num = info.num;
  this.name = info.name;
  this.lapTimes = info.lapTimes;
  this.totalTime = info.totalTime;
}
