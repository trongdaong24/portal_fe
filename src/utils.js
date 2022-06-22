// Utilities
import { showAlertError } from "@/data/general_method.js";
import CONST from "@/data/CONST.js";

class Utils {
  constructor() {}

  parseJwt(token) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      this.b64DecodeUnicode(base64)
        .split("")
        .map(function(c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  }

  getBusinessDatesCount(startDate, endDate) {
    let count = 0;

    const curDate = new Date(startDate.getTime());
    while (curDate <= endDate) {
      const dayOfWeek = curDate.getDay();

      if (dayOfWeek !== 0 && dayOfWeek !== 6) count++;

      curDate.setDate(curDate.getDate() + 1);
    }

    return count;
  }

  handleError = function(response) {
    if (response.status == 404) {
      showAlertError("Not found");
    }

    if (response.status == 400) {
      if (typeof response.data === "string") {
        showAlertError(response.data);
      }

      if (response.data instanceof Object) {
        if (response.data.success === false) {
          showAlertError(response.data.message);
          return;
        }

        Object.keys(response.data).forEach(key => {
          if (typeof response.data[key] === "string") {
            showAlertError(response.data[key]);
          }

          if (response.data[key] instanceof Array) {
            response.data[key].forEach(e => {
              showAlertError(key + ": " + e);
            });
          }
        });
      }

      if (response.data instanceof Array) {
        response.data.forEach(element => {
          showAlertError(element);
        });
      }
    }

    console.log("There was an error: " + response.status);
  };

  b64DecodeUnicode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return Buffer.from(str, "base64").toString("utf-8");
  }

  htmlEntities(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  normalizePathData(paths) {
    paths.forEach((row, index) => {
      if (row.checked_at) {
        var date = new Date(row.checked_at);
        row.checked_at = date.toLocaleDateString();
      }

      if (row.reviewed_at) {
        var date = new Date(row.reviewed_at);
        row.reviewed_at = date.toLocaleDateString();
      }
    });
  }

  clamp(value, max) {
    return Math.max(0, Math.min(max, value));
  }

  moveItemInArray(array, fromIndex, toIndex) {
    const from = this.clamp(fromIndex, array.length - 1);
    const to = this.clamp(toIndex, array.length - 1);

    if (from === to) {
      return;
    }

    const target = array[from];
    const delta = to < from ? -1 : 1;

    for (let i = from; i !== to; i += delta) {
      array[i] = array[i + delta];
    }

    array[to] = target;
  }

  removeItemFromArray(arr, item) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] === item) {
        arr.splice(i, 1);
      }
    }
  }

  countPathStatus(pathList) {
    var count = {};

    pathList.forEach(e => {
      if (count[e.status]) {
        count[e.status] += 1;
      } else {
        count[e.status] = 1;
      }
    });

    // Init other status to 0 if not available
    CONST.ADMIN_PATH_STATUS_LIST.forEach(e => {
      if (!count[e]) {
        count[e] = 0;
      }
    });

    return count;
  }

  getRoundStatusChartData(pathList) {
    var result = {
      labels: [],
      series: []
    };

    var targetPaths = pathList.filter(e => {
      return e.target;
    });

    var totalTargetPath = targetPaths.length;
    var roundStatus = this.countPathStatus(targetPaths);

    CONST.ADMIN_PATH_STATUS_LIST.forEach(e => {
      result.labels.push(e);
      result.series.push(
        // Math.round((roundStatus[e] / totalTargetPath) * 1000) / 10
        roundStatus[e]
      );
    });

    return result.series;
  }

  getRoundProgressChartData(round_info, path_list) {
    var result = {
      labels: ["Current", "Expected"],
      series: []
    };

    var target_paths = path_list.filter(e => {
      return e.target;
    });

    var total_target_path = target_paths.length;
    var round_status = this.countPathStatus(target_paths);

    // Push current status
    result.series.push(
      Math.round(
        ((round_status["Reviewed"] + round_status["NotTarget"]) /
          total_target_path) *
          1000
      ) / 10
    );

    // Push expected status
    var round_start_date = new Date(round_info.round_start_date);
    var round_end_date = new Date(round_info.round_end_date);
    var today = new Date();

    var total_allocated_days = this.getBusinessDatesCount(
      round_start_date,
      round_end_date
    );
    var passed_days = this.getBusinessDatesCount(round_start_date, today);

    if (passed_days == 0) result.series.push(0);
    else {
      var progress_percent =
        Math.round((passed_days / total_allocated_days) * 1000) / 10;
      result.series.push(progress_percent > 100 ? 100 : progress_percent);
    }

    return result.series;
  }

  getMemberOverallData(round_info, path_list) {
    var result = [
      {
        name: "Finished",
        data: []
      },
      {
        name: "Remain",
        data: []
      }
    ];

    var user_count = {};

    round_info.round_members.forEach(user => {
      user_count[user] = {
        total: 0,
        finished: 0
      };
    });

    path_list.forEach(path => {
      // Don't count HIDDEN and MERGED path
      if (path.created_type == "HIDDEN" || path.created_type == "MERGED") {
        return;
      }

      // It has a chance where path owner is no longer in round_member list,
      // Check owner and init corresponding member
      if (!user_count[path.owner]) {
        user_count[path.owner] = {
          total: 0,
          finished: 0
        };
      }

      if (path.owner != "") {
        user_count[path.owner].total += 1;

        if (path.status == "Done" || path.status == "Reviewed") {
          user_count[path.owner].finished += 1;
        }
      }
    });

    round_info.round_members.forEach(user => {
      result[0].data.push(user_count[user].finished); // FINISHED
      result[1].data.push(user_count[user].total - user_count[user].finished); // REMAIN
    });

    return result;
  }

  getDatesBetweenDates(startDate, endDate) {
    let dates = [];
    //to avoid modifying the original date
    const theDate = new Date(startDate);
    while (theDate < new Date(endDate)) {
      dates = [...dates, new Date(theDate)];
      theDate.setDate(theDate.getDate() + 1);
    }
    dates = [...dates, new Date(endDate)];

    return dates;
  }

  getMemberDetailData(round_info, path_list, username) {
    var result = {
      label: [],
      series: [
        {
          name: "Request",
          data: []
        }
      ]
    };

    var count = {};

    path_list.forEach(path => {
      if (path.owner != username) return;
      if (!path.checked_at) return;

      var date = new Date(path.checked_at);
      var date_str = date.toLocaleDateString();
      if (count[date_str]) count[date_str] += 1;
      else count[date_str] = 1;
    });

    var round_working_dates = this.getDatesBetweenDates(
      round_info.round_start_date,
      round_info.round_end_date
    );
    round_working_dates.forEach(date => {
      var date_str = date.toLocaleDateString();

      result.label.push(date_str);
      if (count[date_str]) {
        result.series[0].data.push(count[date_str]);
      } else {
        result.series[0].data.push(0);
      }
    });

    return result.series;
  }

  checkFilterPath(field, val) {
    if (typeof val === "string") {
      // Return null mean can not check, process based on negative filter value
      if (val.length == 0) return null;

      if (field != val) {
        return false;
      }

      return true;
    }

    // OR || operator inside array of field value
    if (val instanceof Array) {
      // Return null mean can not check, process based on negative filter value
      if (val.length == 0) return null;

      var check = false;

      for (const subVal of val) {
        if (field == subVal) {
          check = true;
          break;
        }
      }

      return check;
    }

    console.log("Not support filter this value type of value: ");
    console.log(val);
    return false;
  }

  getPathAvailableValues(paths) {
    var result = {
      owner: [],
      target: [],
      status: [],
      checked_by: [],
      reviewed_by: []
    };

    paths.forEach(path => {
      for (const field in result) {
        if (path[field] && !result[field].includes(path[field])) {
          result[field].push(path[field]);
        }
      }
    });

    return result;
  }
}

const utils = new Utils();
export default utils;
