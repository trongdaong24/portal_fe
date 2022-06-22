import client from "@/services/client.js";
import URLs from "@/data/URL.js";
import utils from "@/utils.js";

class StatisticService {
  constructor() {}

  GetOverallPathData = function(filter) {
    return client
      .get(URLs.OVERALL_DAILY_STAT_API, { params: filter })
      .then(response => {
        var data = response.data;
        var result = {
          detail: {},
          users: [],
          series: [
            {
              name: "Path",
              type: "column",
              data: []
            },
            {
              name: "Testcase",
              type: "line",
              data: []
            }
          ]
        };

        result.detail = data;

        for (const user in data) {
          try {
            var path = data[user].path_done;
            var testcase = data[user].testcase_done;
          } catch (error) {
            console.log("Cannot get path data of user " + user);
          }

          result.users.push(user);
          result.series[0].data.push(path);
          result.series[1].data.push(testcase);
        }

        return result;
      })
      .catch(({ response }) => {
        if (response) {
          utils.handleError(response);
        }

        return null;
      });
  };
}

const statistic_service = new StatisticService();
export default statistic_service;
