const {
  getAllLaunches,
  addNewLaunch,
  abortLaunch,
  launchExist,
} = require("../../modules/launches.module");
const getPagination = require("../../services/getPagination");

async function httpGetAllLaunches(req, res) {
  const {skip, limit} = getPagination(req.query);
  const launch = await getAllLaunches(skip, limit);
  return res.status(200).json(launch);
}

async function httpAddNewLaunch(req, res) {
  launch = req.body;

  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      error: "launch property missing!",
    });
  }

  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "launch date is invalid",
    });
  }

  await addNewLaunch(launch);
  return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id);
  const launchExistById = await launchExist(launchId);

  if (!launchExistById) {
    return res.status(404).json({error: "launch not found"});
  }
  const abort = await abortLaunch(launchId);
  return res.status(200).json(abort);
}

module.exports = {httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch};
