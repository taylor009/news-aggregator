"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { Mail, Clock } from "lucide-react";

const TOPICS = [
  "Technology",
  "Science",
  "Business",
  "Health",
  "Entertainment",
  "Sports",
  "Politics",
  "Environment",
];

const FREQUENCIES = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

interface SubscriptionData {
  email: string;
  preferredTopics: string[];
  frequency: string;
  preferredTime?: string;
  receiveBreakingNews: boolean;
}

export function NewsletterSubscription() {
  const [formData, setFormData] = useState<SubscriptionData>({
    email: "",
    preferredTopics: [],
    frequency: "daily",
    preferredTime: "09:00",
    receiveBreakingNews: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleTopicToggle = (topic: string) => {
    setFormData((prev) => ({
      ...prev,
      preferredTopics: prev.preferredTopics.includes(topic)
        ? prev.preferredTopics.filter((t) => t !== topic)
        : [...prev.preferredTopics, topic],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/newsletter/subscribe",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to subscribe");
      }

      toast.success("Successfully subscribed to newsletter!");
      setFormData({
        email: "",
        preferredTopics: [],
        frequency: "daily",
        preferredTime: "09:00",
        receiveBreakingNews: true,
      });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to subscribe. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
        Subscribe to Our Newsletter
      </h2>
      <p className="mb-4 text-gray-600 dark:text-gray-300">
        Get personalized news updates delivered to your inbox.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-200"
          >
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="Enter your email"
            required
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-200">
            Preferred Topics
          </label>
          <div className="flex flex-wrap gap-2">
            {TOPICS.map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => handleTopicToggle(topic)}
                className={`rounded-full px-3 py-1 text-sm transition-colors ${
                  formData.preferredTopics.includes(topic)
                    ? "bg-blue-600 text-white dark:bg-blue-500"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="frequency"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-200"
            >
              Frequency
            </label>
            <select
              id="frequency"
              value={formData.frequency}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, frequency: e.target.value }))
              }
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              {FREQUENCIES.map((freq) => (
                <option key={freq.value} value={freq.value}>
                  {freq.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="preferredTime"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-200"
            >
              Preferred Time
            </label>
            <input
              id="preferredTime"
              type="time"
              value={formData.preferredTime}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  preferredTime: e.target.value,
                }))
              }
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            id="breakingNews"
            type="checkbox"
            checked={formData.receiveBreakingNews}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                receiveBreakingNews: e.target.checked,
              }))
            }
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
          />
          <label
            htmlFor="breakingNews"
            className="ml-2 text-sm text-gray-900 dark:text-gray-200"
          >
            Receive breaking news alerts
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          {isLoading ? "Subscribing..." : "Subscribe"}
        </button>
      </form>
    </div>
  );
}
