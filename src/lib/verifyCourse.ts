interface Course {
  url: string;
}

export const verifyCourse = async (course: Course) => {
  window.open(course.url, "_blank");
};
