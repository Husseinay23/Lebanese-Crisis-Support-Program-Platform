import React, { useEffect, useState, useContext } from "react";
import { useUser } from "../contexts/UserContext";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import PostNeedForm from "@/components/PostNeedForm";
import { formatCurrency } from "@/lib/utils";

const LoggedInUser = ({ userId }) => {
  return (
    <p className="mb-8">
      {userId ? `Logged in as: User #${userId}` : "You are not logged in."}
    </p>
  );
};

export default function NeedsWants() {
  const { userId, loading } = useUser();
  const [needs, setNeeds] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNeeds = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/servicerequests/");
        if (response.ok) {
          const data = await response.json();
          setNeeds(data);
        } else {
          throw new Error("Failed to fetch needs.");
        }
      } catch (err) {
        console.error("Error fetching needs:", err);
        setError("Failed to fetch needs from the database.");
      }
    };

    fetchNeeds();
  }, []);

  const handleAddNeed = async (newNeed) => {
    if (!userId) {
      setError("You must be logged in to post a need.");
      return;
    }

    try {
      const csrfToken = getCsrfToken();
      const response = await fetch("http://127.0.0.1:8000/api/servicerequests/create/", {
        method: "POST",
        body: JSON.stringify({
          ...newNeed,
          contact: newNeed.contact || `User#${userId}`,
          date: newNeed.date ? new Date(newNeed.date).toISOString() : new Date().toISOString(),
        }),
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
      });

      if (response.ok) {
        const newNeedData = await response.json();
        setNeeds((prevNeeds) => [...prevNeeds, newNeedData]);
        setIsOpen(false);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || "Failed to add your need.");
      }
    } catch (err) {
      setError("Failed to add your need.");
      console.error("Error adding need:", err);
    }
  };

  const handleCall = (contact) => {
    if (/^\+?[0-9]{10,15}$/.test(contact)) {
      window.location.href = `tel:${contact}`;
    } else {
      alert("No valid contact number available.");
    }
  };

  const getCsrfToken = () => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken="))
      ?.split("=")[1] || "";
  };

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Needs & Wants</h1>
        {userId && <Button onClick={() => setIsOpen(true)}>Post a Need</Button>}
      </div>
      <h3 className="text-gray-500">Connect with people offering or seeking assistance.</h3>

      <LoggedInUser userId={userId} />

      {error && <p className="text-red-600">{error}</p>}

      <div className="grid gap-6 md:grid-cols-2">
        {needs.map((need) => (
          <Card key={need.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{need.title}</CardTitle>
                <time className="text-sm text-muted-foreground">{new Date(need.date).toLocaleDateString()}</time>
              </div>
              <CardDescription>{need.location}</CardDescription>
              <CardDescription>
                <span className="font-medium">Contact: </span>
                {need.contact_number || "Not provided"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{need.description}</p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium">Estimated Cost:</span>
                <span className="font-semibold">{formatCurrency(need.price)}</span>
              </div>
              <Button className="w-full" onClick={() => handleCall(need.contact)}>
                Contact Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <PostNeedForm
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onAddNeed={handleAddNeed}
      />
    </div>
  );
}
