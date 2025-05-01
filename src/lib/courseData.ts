interface CoursePurchase {
  email: string;
  transactionId: string;
  courseUrl: string;
  platform: "udemy" | "coursera";
  purchaseDate: string;
  amount: number;
  status: "completed" | "pending" | "failed";
}

export const coursePurchases: CoursePurchase[] = [
  {
    email: "student1@example.com",
    transactionId: "TRX-UD-2024-001",
    courseUrl: "https://www.udemy.com/course/react-the-complete-guide",
    platform: "udemy",
    purchaseDate: "2024-03-15T10:30:00Z",
    amount: 19.99,
    status: "completed",
  },
  {
    email: "student2@example.com",
    transactionId: "TRX-CR-2024-001",
    courseUrl: "https://www.coursera.org/learn/machine-learning",
    platform: "coursera",
    purchaseDate: "2024-03-16T14:45:00Z",
    amount: 49.99,
    status: "completed",
  },
  {
    email: "student3@example.com",
    transactionId: "TRX-UD-2024-002",
    courseUrl: "https://www.udemy.com/course/advanced-javascript-concepts",
    platform: "udemy",
    purchaseDate: "2024-03-17T09:15:00Z",
    amount: 24.99,
    status: "pending",
  },
  {
    email: "student4@example.com",
    transactionId: "TRX-CR-2024-002",
    courseUrl: "https://www.coursera.org/learn/data-science",
    platform: "coursera",
    purchaseDate: "2024-03-18T16:20:00Z",
    amount: 39.99,
    status: "failed",
  },
];

export const getCoursePurchaseByEmail = (
  email: string
): CoursePurchase | undefined => {
  return coursePurchases.find((purchase) => purchase.email === email);
};

export const getCoursePurchaseByTransactionId = (
  transactionId: string
): CoursePurchase | undefined => {
  return coursePurchases.find(
    (purchase) => purchase.transactionId === transactionId
  );
};
