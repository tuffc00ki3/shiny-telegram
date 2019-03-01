/**
 * Constructor function for the class Race
 * @constructor
 * @param {{title: string, numLaps: number, riderList:[Rider]} info
 */
function Race(info) {
  this.title = info.title;
  this.numLaps = info.numLaps;
  this.riderList = info.riderList;
}
