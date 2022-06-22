import client from "@/services/client.js";
import URLs from "@/data/URL.js";
import utils from "@/utils.js";

import { getHeader } from "@/services/config.js";

class ManagementService {
  constructor() {}

  GetFunctionList = function() {
    return client
      .get(URLs.FUNCTION_LIST_URL)
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

  GetTestcaseTemplateList = function() {
    return client
      .get(URLs.TEMPLATE_LIST_API)
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

  GetFunctionListManage = function() {
    return client
      .get(URLs.FUNCTION_LIST_URL + "?limit=100000&offset=0")
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

  UpdateTestcase = function(template_id, template_detail) {
    console.log(template_id);
    return client
      .put(
        URLs.TEMPLATE_DETAIL.replace(":template_id", template_id),
        template_detail
      )
      .then(response => {
        return response;
      })
      .catch(({ response }) => {
        if (response) {
          utils.handleError(response);
        }

        return null;
      });
  };

  DeleteTestcase = function(template_id) {
    return client
      .delete(URLs.TEMPLATE_DETAIL.replace(":template_id", template_id))
      .then(response => {
        return response;
      })
      .catch(({ response }) => {
        if (response) {
          utils.handleError(response);
        }

        return null;
      });
  };

  InsertTestcase = function(template_detail) {
    return client
      .post(URLs.URL_TEMPLATE, template_detail)
      .then(response => {
        return response;
      })
      .catch(({ response }) => {
        if (response) {
          utils.handleError(response);
        }

        return null;
      });
  };

  GetStadardList = function() {
    return client
      .get(URLs.URL_CHECKLIST + "?limit=100000&offset=0")
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

  UpdateChecklist = function(checklist_standard_id, checklist_detail) {
    return client
      .put(
        URLs.CHECKLIST_DETAIL.replace(":checklist_id", checklist_standard_id),
        checklist_detail
      )
      .then(response => {
        return response;
      })
      .catch(({ response }) => {
        if (response) {
          utils.handleError(response);
        }

        return null;
      });
  };

  DeleteChecklist = function(checklist_standard_id) {
    return client
      .delete(
        URLs.CHECKLIST_DETAIL.replace(":checklist_id", checklist_standard_id)
      )
      .then(response => {
        return response;
      })
      .catch(({ response }) => {
        if (response) {
          utils.handleError(response);
        }

        return null;
      });
  };

  InsertChecklist = function(checklist_detail) {
    return client
      .post(URLs.URL_CHECKLIST, checklist_detail)
      .then(response => {
        return response;
      })
      .catch(({ response }) => {
        if (response) {
          utils.handleError(response);
        }

        return null;
      });
  };

  UpdateFunction = function(function_id, function_detail) {
    return client
      .put(
        URLs.FUNCTION_DETAIL.replace(":function_id", function_id),
        function_detail
      )
      .then(response => {
        return response;
      })
      .catch(({ response }) => {
        if (response) {
          utils.handleError(response);
        }

        return null;
      });
  };

  DeleteFunction = function(function_id) {
    return client
      .delete(URLs.FUNCTION_DETAIL.replace(":function_id", function_id))
      .then(response => {
        return response;
      })
      .catch(({ response }) => {
        if (response) {
          utils.handleError(response);
        }

        return null;
      });
  };

  InsertFunction = function(function_detail) {
    return client
      .post(URLs.FUNCTION_LIST_URL, function_detail)
      .then(response => {
        return response;
      })
      .catch(({ response }) => {
        if (response) {
          utils.handleError(response);
        }

        return null;
      });
  };

  ImportFileTemplate = function(formData) {
    var headers = getHeader();
    headers["Content-Type"] = "multipart/form-data";
    return client
      .post(URLs.URL_UPLOADTESTCASE, formData, {
        headers: headers
      })
      .then(response => {
        return response;
      })
      .catch(({ response }) => {
        if (response) {
          utils.handleError(response);
        }

        return null;
      });
  };

  ExportTestcase = function() {
    return client
      .get(URLs.URL_EXPORT)
      .then(response => {
        return response;
      })
      .catch(({ response }) => {
        if (response) {
          utils.handleError(response);
        }

        return null;
      });
  };

  // change template_checklists in testcasetemplate

  EditTemplateStandardOnTemplate = function(id, input_edit) {
    return client
      .post(
        URLs.URL_EDIT_TEMPLATE_CHECKLIST.replace(":template_id", id),
        input_edit
      )
      .then(response => {
        return response;
      })
      .catch(({ response }) => {
        if (response) {
          utils.handleError(response);
        }

        return null;
      });
  };

  EditFunctionTestcasesOnFunction = function(id, input_edit) {
    return client
      .post(
        URLs.URL_EDIT_FUNCTION_TESCASES.replace(":function_id", id),
        input_edit
      )
      .then(response => {
        return response;
      })
      .catch(({ response }) => {
        if (response) {
          utils.handleError(response);
        }

        return null;
      });
  };
}

const management_service = new ManagementService();
export default management_service;
