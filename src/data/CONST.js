class CONST {
  constructor() {}

  PENTESTER_PATH_STATUS_LIST = [
    "NotFound",
    "NotTarget",
    "Todo",
    "Doing",
    "Done",
    "Pending"
  ];
  ADMIN_PATH_STATUS_LIST = [
    "NotFound",
    "NotTarget",
    "Todo",
    "Doing",
    "Done",
    "Pending",
    "Recheck",
    "Reviewed"
  ];

  ADMIN_PATH_STATUS_COLOR = [
    "#FFC000",
    "#A5A5A5",
    "#bdd7ee",
    "#2e75b6",
    "#70AD47",
    "#ed7d31",
    "#ff5050",
    "#335ba3"
  ];
}

const constant = new CONST();
export default constant;
