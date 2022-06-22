class URL {
  constructor() {}

  // ROUND APIs
  ROUND_LIST_URL = "/tracking/round/";
  ROUND_DETAIL_URL = "/tracking/round/:round_id/";

  // PATH APIs
  PATH_LIST_URL = "/tracking/round/:round_id/path/";
  PATH_DETAIL_URL = "/tracking/round/:round_id/path/:path_id/";
  PATH_UPDATE_URL = "/tracking/round/:round_id/path/:path_id/";
  PATH_ROLLBACK_URL = "/tracking/round/:round_id/path/:path_id/rollback/";

  // PATH ACTIONS APIs
  ASSIGN_FUNCTION_URL =
    "/tracking/round/:round_id/path/:path_id/assign_function/";
  BULK_ACTION_URL = "/tracking/round/:round_id/path/bulk/";
  SET_MAIN_REQUEST_URL =
    "/tracking/round/:round_id/path/:path_id/set_main_request/";
  MOVE_PATH_URL = "/tracking/round/:round_id/path/move/";
  MERGE_PATH_URL = "/tracking/round/:round_id/path/merge/";

  ES_REQUEST_URL = "/tracking/es_request/:request_id/";
  ES_REQUESTS_URL = "/tracking/round/:round_id/path/:path_id/es_requests/";

  IMPORT_URL = "/tracking/round/:round_id/path/import/";
  EXPORT_URL = "/tracking/round/:round_id/path/export/";

  // TESTCASE APIs
  TESTCASE_LIST_URL = "/tracking/round/:round_id/path/:path_id/testcase/";
  TESTCASE_CREATE_URL = "/tracking/round/:round_id/path/:path_id/testcase/";
  TESTCASE_UPDATE_URL =
    "/tracking/round/:round_id/path/:path_id/testcase/:testcase_id/";
  TESTCASE_DELETE_URL =
    "/tracking/round/:round_id/path/:path_id/testcase/:testcase_id/";

  // MANAGEMENT APIs
  FUNCTION_LIST_URL = "/management/function/";
  TEMPLATE_LIST_API = "/management/template/";
  FUNCTION_DETAIL = "/management/function/:function_id/";
  URL_EDIT_FUNCTION_TESCASES =
    "/management/function/:function_id/set_testcase_template/";

  URL_TEMPLATE = "/management/template/";
  TEMPLATE_DETAIL = "/management/template/:template_id/";
  URL_EDIT_TEMPLATE_CHECKLIST =
    "/management/template/:template_id/set_checklist_standard/";

  URL_CHECKLIST = "/management/checklist/";
  CHECKLIST_DETAIL = "/management/checklist/:checklist_id/";

  URL_UPLOADTESTCASE = "/management/upload/";
  URL_EXPORT = "/management/template/export_data/";

  // STATISTIC APIs
  OVERALL_DAILY_STAT_API = "/statistic/daily/overall/";
}

const urls = new URL();
export default urls;
