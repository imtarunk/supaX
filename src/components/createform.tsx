import { useState } from "react";

interface FormData {
  icon: string;
  task: string;
  points: number;
}

interface SubmitStatus {
  type: "success" | "error";
  message: string;
}

interface FormErrors {
  icon?: string;
  task?: string;
  points?: string;
}

export default function TaskForm() {
  const [formData, setFormData] = useState<FormData>({
    icon: "",
    task: "",
    points: 10,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "points" ? Number(value) : value,
    });
  };

  const validateForm = () => {
    const errors: FormErrors = {};
    if (!formData.icon.trim()) {
      errors.icon = "Icon is required";
    }
    if (!formData.task.trim()) {
      errors.task = "Task is required";
    }
    if (formData.points < 0) {
      errors.points = "Points must be positive";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const saveTaskToDatabase = async (taskData: FormData) => {
    // This is where you would implement your database connection
    // Example using fetch to a hypothetical API endpoint
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      throw new Error("Failed to save task");
    }

    return await response.json();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    if (!validateForm()) {
      setSubmitStatus({
        type: "error",
        message: "Please fill in all required fields.",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      await saveTaskToDatabase(formData);
      setSubmitStatus({ type: "success", message: "Task saved successfully!" });
      setFormData({ icon: "", task: "", points: 10 }); // Reset form
    } catch {
      setSubmitStatus({
        type: "error",
        message: "Failed to save task. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Create New Task</h2>

      {submitStatus && (
        <div
          className={`p-3 mb-4 rounded ${
            submitStatus.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {submitStatus.message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="icon"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Icon
          </label>
          <input
            type="text"
            id="icon"
            name="icon"
            value={formData.icon}
            onChange={handleChange}
            placeholder="🏆, 📝, 🔍, etc."
            className={`w-full px-3 py-2 border rounded-md ${
              errors.icon ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.icon && (
            <p className="mt-1 text-sm text-red-500">{errors.icon}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="task"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Task Description
          </label>
          <input
            type="text"
            id="task"
            name="task"
            value={formData.task}
            onChange={handleChange}
            placeholder="Complete daily challenge"
            className={`w-full px-3 py-2 border rounded-md ${
              errors.task ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.task && (
            <p className="mt-1 text-sm text-red-500">{errors.task}</p>
          )}
        </div>

        <div className="mb-6">
          <label
            htmlFor="points"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Points (1-100)
          </label>
          <input
            type="number"
            id="points"
            name="points"
            min="1"
            max="100"
            value={formData.points}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.points ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.points && (
            <p className="mt-1 text-sm text-red-500">{errors.points}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
        >
          {isSubmitting ? "Saving..." : "Save Task"}
        </button>
      </form>
    </div>
  );
}
