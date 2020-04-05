const auth = { token: "", role: "", mobile: "", isFetching: false };
const categories = { list: [], isFetching: false };
const categories2 = { list: [], isFetching: false };
const userLocation = { lat: null, lng: null };
const questions = {
  list: [],
  isFetching: false,
  PageNumber: 1,
  PageCount: 10,
  hasMore: true
};
const singleQuestion = { item: {}, isFetching: false };
const notification = {
  assistantProblemsCount: 0,
  categoryTime: "",
  personProblemsCount: 0,
  personQuestionCount: 0,
  version: {
    id: 1,
    link: "",
    title: "1.0.0"
  },
  isFetching: false
};
const problems = { list: [], isFetching: false, PageNumber: 1, PageCount: 10 };
const profile = {
  family: "",
  mobile: "",
  name: "",
  nationalCode: "",
  statusId: 0,
  isFetching: false,
  birthday: "",
  acceptedLatitude: 0,
  acceptedLongitude: 0,
  requestedLatitude: 0,
  requestedLongitude: 0,
  introduceCount: 0
};
const userPic = "";
const problemDetails = {
  isFetching: false,
  item: {
    title: "",
    detailed: ""
  }
};
const introList = [];
const askLocation = false;

export default {
  auth,
  categories,
  categories2,
  userLocation,
  questions,
  problems,
  profile,
  userPic,
  problemDetails,
  introList,
  notification,
  singleQuestion,
  askLocation
};
