import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";
import Navbar from "./navbar";

const EmployeeForm = () => {
  const [fields, setFields] = useState([{ label: "", type: "Text" }]); // Start with one default field
  const [savedFields, setSavedFields] = useState([]); // Saved form structure
  const [message, setMessage] = useState(""); // Form submission message

  // Add a new field
  const addField = () => {
    setFields([...fields, { label: "", type: "Text" }]);
  };

  // Update a field
  const updateField = (index, key, value) => {
    const updatedFields = fields.map((field, i) =>
      i === index ? { ...field, [key]: value } : field
    );
    setFields(updatedFields);
  };

  // Remove a field (from savedFields or new fields)
  const removeField = (index, isSaved = false) => {
    if (isSaved) {
      const updatedSavedFields = savedFields.filter((_, i) => i !== index);
      setSavedFields(updatedSavedFields);
    } else {
      const updatedFields = fields.filter((_, i) => i !== index);
      setFields(updatedFields);
    }
  };

  // Prevent duplicate labels
  const isDuplicateLabel = (label) => {
    const allLabels = [
      ...savedFields.map((field) => field.label.toLowerCase()),
      ...fields.map((field) => field.label.toLowerCase()),
    ];
    return allLabels.filter((existingLabel) => existingLabel === label.toLowerCase()).length > 1;
  };

  useEffect(() => {
    // Fetch dynamic fields from the backend API
    axios
      .get("http://127.0.0.1:8000/employee/forms/")
      .then((response) => {
        const fields = response.data.dynamic_data[0]?.dynamic_fields || [];
        setSavedFields(fields);
      })
      .catch((error) => {
        console.error("Error fetching dynamic fields:", error);
      });
  }, []);

  // Handle form structure submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedFields = [...savedFields, ...fields].filter(
      (field) => field.label.trim() !== ""
    );

    if (formattedFields.length === 0) {
      setMessage("Please add at least one valid field before saving.");
      return;
    }

    try {
      await axios.put("http://127.0.0.1:8000/employee/forms/", formattedFields);
      setMessage("Form structure saved successfully!");

      setSavedFields(formattedFields);
      setFields([{ label: "", type: "Text" }]); // Reset to one field after saving
    } catch (error) {
      console.error("Error saving form structure:", error);
      setMessage("Failed to save form structure.");
    }
  };

  // Handle drag-and-drop event
  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const reorderedFields = Array.from(savedFields);
    const [removed] = reorderedFields.splice(source.index, 1);
    reorderedFields.splice(destination.index, 0, removed);

    setSavedFields(reorderedFields);

    try {
      await axios.put("http://127.0.0.1:8000/employee/forms/", reorderedFields);
      setMessage("Form structure reordered and saved successfully!");
    } catch (error) {
      console.error("Error saving reordered form structure:", error);
      setMessage("Failed to save reordered form structure.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center space-y-8">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
          <h1 className="text-xl font-bold mb-4 text-center">Employee Form</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((field, index) => (
              <div key={index} className="flex items-center gap-4">
                <input
                  type="text"
                  value={field.label}
                  placeholder="Label"
                  onChange={(e) => {
                    updateField(index, "label", e.target.value);
                    if (isDuplicateLabel(e.target.value)) {
                      setMessage("Field labels must be unique.");
                    } else {
                      setMessage("");
                    }
                  }}
                  className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={field.type}
                  onChange={(e) => updateField(index, "type", e.target.value)}
                  className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Text">Text</option>
                  <option value="Number">Number</option>
                  <option value="Date">Date</option>
                  <option value="Password">Password</option>
                </select>
              </div>
            ))}

            <div className="mt-4 flex justify-between">
              <button
                type="button"
                onClick={addField}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add Field
              </button>
              <button
                type="submit"
                disabled={fields.every((field) => field.label.trim() === "")}
                className={`bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  fields.every((field) => field.label.trim() === "")
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                Save
              </button>
            </div>
          </form>

          {message && (
            <div
              className={`mt-4 p-2 text-center ${
                message.includes("successfully")
                  ? "text-green-600 bg-green-100"
                  : "text-red-600 bg-red-100"
              }`}
            >
              {message}
            </div>
          )}
        </div>

        {savedFields.length > 0 && (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
              <h2 className="text-lg font-bold mb-4 text-center">Saved Fields</h2>
              <Droppable droppableId="droppable">
                {(provided) => (
                  <div
                    className="space-y-4"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {savedFields.map((field, index) => (
                      <Draggable key={field.label} draggableId={field.label} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="flex items-center gap-4"
                            style={{
                              border: "1px solid #ccc",
                              padding: "10px",
                              borderRadius: "4px",
                              cursor: "move",
                              ...provided.draggableProps.style,
                            }}
                          >
                            <label className="font-medium">{field.label}</label>
                            <input
                              type={field.type.toLowerCase()}
                              placeholder={`Enter ${field.label}`}
                              className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                              type="button"
                              onClick={() => removeField(index, true)}
                              className="text-red-500 hover:text-red-700 font-bold"
                            >
                              X
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </DragDropContext>
        )}
      </div>
    </>
  );
};

export default EmployeeForm;
