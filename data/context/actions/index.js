import { personPreLogin, personLogin, checkAuth } from "./handleAuth";
import { fetchCategories } from "./categories";
import {
  postProblem,
  fetchProblems,
  fetchProblemDetails,
  postAssisAnswer,
  sendScore,
  verifyFunc
} from "./problems";
import { postQuestions, fetchQuestions, getOneQuestions } from "./questions";
import {
  fetchProfile,
  putProfile,
  fetchNotifications,
  notifSeener,
  setLocation,
  postAssisLocation
} from "./profile";
import { upload, uploadUserImage, getUserImage } from "./upload";
import { introducePost, introduceGet, introduceDelete } from "./introduction";

export default {
  personPreLogin,
  personLogin,
  checkAuth,
  fetchCategories,
  postProblem,
  fetchProblems,
  postQuestions,
  fetchQuestions,
  fetchProfile,
  upload,
  putProfile,
  uploadUserImage,
  getUserImage,
  fetchProblemDetails,
  introducePost,
  introduceGet,
  introduceDelete,
  fetchNotifications,
  notifSeener,
  postAssisAnswer,
  sendScore,
  getOneQuestions,
  setLocation,
  postAssisLocation,
  verifyFunc
};
