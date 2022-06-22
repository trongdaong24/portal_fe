import client from "@/services/client.js";
import URLs from "@/data/URL.js";
import utils from "@/utils.js";

class TrackingService {
  constructor() {}

  GetRoundList = function() {
    return client
      .get(URLs.ROUND_LIST_URL)
      .then(response => {
        return response.data;
      })
      .catch(({ response }) => {
        if (response) {
          utils.handleError(response);
        }

        return null;
      });
  };

  GetRoundDetail = function(round_id) {
    return client
      .get(URLs.ROUND_DETAIL_URL.replace(":round_id", round_id))
      .then(response => {
        return response.data;
      })
      .catch(({ response }) => {
        if (response) {
          utils.handleError(response);
        }

        return null;
      });
  };

  GetPathList = function(round_id, minimized = false) {
    var url = URLs.PATH_LIST_URL.replace(":round_id", round_id);
    if (minimized) {
      url += "?minimized=true";
    }

    return client
      .get(url)
      .then(response => {
        return response.data;
      })
      .catch(({ response }) => {
        if (response) {
          utils.handleError(response);
        }

        return null;
      });
  };

  GetPathDetail = function(round_id, path_id) {
    return client
      .get(
        URLs.PATH_DETAIL_URL.replace(":round_id", round_id).replace(
          ":path_id",
          path_id
        )
      )
      .then(response => {
        return response.data;
      })
      .catch(({ response }) => {
        if (response) {
          utils.handleError(response);
        }

        return null;
      });
  };

  // Update single path
  UpdatePath = function(round_id, path_id, field, value) {
    var data = {};
    data[field] = value;

    return client
      .patch(
        URLs.PATH_UPDATE_URL.replace(":round_id", round_id).replace(
          ":path_id",
          path_id
        ),
        data
      )
      .then(response => {
        return response.data;
      })
      .catch(({ response }) => {
        if (response) {
          utils.handleError(response);
        }

        return null;
      });
  };

  // Update multiple path
  UpdatePaths = function(round_id, path_ids, action, fields) {
    var data = {
      action: action,
      paths: path_ids
    };

    if (action === "update") {
      for (const key in fields) {
        if (fields[key] != null) {
          data[key] = fields[key];
        }
      }
    }

    return client
      .post(URLs.BULK_ACTION_URL.replace(":round_id", round_id), data)
      .then(response => {
        return response.data;
      })
      .catch(({ response }) => {
        if (response) {
          utils.handleError(response);
        }

        return null;
      });
  };

  RollbackPath = function(round_id, path_id) {
    return client
      .get(
        URLs.PATH_ROLLBACK_URL.replace(":round_id", round_id).replace(
          ":path_id",
          path_id
        )
      )
      .then(response => {
        return response.data;
      })
      .catch(({ response }) => {
        if (response) {
          utils.handleError(response);
        }

        return null;
      });
  };

  MergePath = function(round_id, main_path_id, sub_path_ids) {
    var data = {
      main_path: main_path_id,
      sub_paths: sub_path_ids
    };
    return client
      .post(URLs.MERGE_PATH_URL.replace(":round_id", round_id), data)
      .then(response => {
        return response.data;
      })
      .catch(({ response }) => {
        if (response) {
          utils.handleError(response);
        }

        return null;
      });
  };

  GetESRequests = function(round_id, path_id) {
    return client
      .get(
        URLs.ES_REQUESTS_URL.replace(":round_id", round_id).replace(
          ":path_id",
          path_id
        )
      )
      .then(response => {
        return response.data;
      })
      .catch(({ response }) => {
        if (response) {
          utils.handleError(response);
        }

        return null;
      });
  };

  GetESRequest = function(request_id) {
    return client
      .get(URLs.ES_REQUEST_URL.replace(":request_id", request_id))
      .then(response => {
        return response.data;
      })
      .catch(({ response }) => {
        if (response) {
          utils.handleError(response);
        }

        return null;
      });
  };

  MovePath = function(round, src_path_ids, des_path_id) {
    var data = {
      paths: src_path_ids,
      destination: des_path_id
    };

    return client
      .post(URLs.MOVE_PATH_URL.replace(":round_id", round), data)
      .then(response => {
        return response.data;
      })
      .catch(({ response }) => {
        if (response) {
          utils.handleError(response);
        }

        return null;
      });
  };

  AssignFunction = function(round_id, path_id, function_id, is_delete = false) {
    var data = {
      function_id: function_id,
      is_delete: is_delete
    };

    return client
      .post(
        URLs.ASSIGN_FUNCTION_URL.replace(":round_id", round_id).replace(
          ":path_id",
          path_id
        ),
        data
      )
      .then(response => {
        return response.data;
      })
      .catch(({ response }) => {
        if (response) {
          utils.handleError(response);
        }

        return null;
      });
  };

  ImportMBSDFile = function(round_id, file, sheet_name, include_sheet_name) {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("sheet_name", sheet_name);
    formData.append("include_sheet_name", include_sheet_name);
    formData.append("type", "mbsd_overall_progress_file");

    var headers = {};
    headers["Content-Type"] = "multipart/form-data";

    return client
      .post(URLs.IMPORT_URL.replace(":round_id", round_id), formData, {
        headers: headers
      })
      .then(response => {
        return response.data;
      })
      .catch(({ response }) => {
        if (response) {
          utils.handleError(response);
        }

        return null;
      });
  };

  ExportMemo = function(round_id) {
    return client
      .get(URLs.EXPORT_URL.replace(":round_id", round_id), {
        responseType: "blob"
      })
      .then(response => {
        return response.data;
      })
      .catch(({ response }) => {
        if (response) {
          utils.handleError(response);
        }

        return null;
      });
  };

  SetMainRequest = function(round_id, path_id, es_request_id) {
    return client
      .post(
        URLs.SET_MAIN_REQUEST_URL.replace(":round_id", round_id).replace(
          ":path_id",
          path_id
        ),
        { es_request_id: es_request_id }
      )
      .then(response => {
        return response.data;
      })
      .catch(({ response }) => {
        if (response) {
          utils.handleError(response);
        }

        return null;
      });
  };

  GetTestCases = function(round_id, path_id) {
    return client
      .get(
        URLs.TESTCASE_LIST_URL.replace(":round_id", round_id).replace(
          ":path_id",
          path_id
        )
      )
      .then(response => {
        return response.data;
      })
      .catch(({ response }) => {
        if (response) {
          utils.handleError(response);
        }

        return null;
      });
  };

  // Create testcase
  CreateTestcase = function(round_id, path_id, new_testcase) {
    return client
      .post(
        URLs.TESTCASE_CREATE_URL.replace(":round_id", round_id).replace(
          ":path_id",
          path_id
        ),
        new_testcase
      )
      .then(response => {
        return response.data;
      })
      .catch(({ response }) => {
        if (response) {
          utils.handleError(response);
        }

        return null;
      });
  };

  // Update single testcase
  UpdateTestcase = function(round_id, path_id, testcase) {
    return client
      .put(
        URLs.TESTCASE_UPDATE_URL.replace(":round_id", round_id)
          .replace(":path_id", path_id)
          .replace(":testcase_id", testcase.id),
        testcase
      )
      .then(response => {
        return response.data;
      })
      .catch(({ response }) => {
        if (response) {
          utils.handleError(response);
        }

        return null;
      });
  };

  // Delete testcase
  DeleteTestcase = function(round_id, path_id, testcase_id) {
    return client
      .delete(
        URLs.TESTCASE_DELETE_URL.replace(":round_id", round_id)
          .replace(":path_id", path_id)
          .replace(":testcase_id", testcase_id)
      )
      .then(response => {
        return response.data;
      })
      .catch(({ response }) => {
        if (response) {
          utils.handleError(response);
        }

        return null;
      });
  };
}

const tracking_service = new TrackingService();
export default tracking_service;
