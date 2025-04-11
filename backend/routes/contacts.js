const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

// GET all contacts
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find(req.p);  // Fetch all contacts from the database
    res.json(contacts);  // Send contacts as a JSON response
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Get Contact by ID
router.get("/:id", async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id); // Find contact by ID
    if (!contact) {
      return res.status(404).json({ msg: "Contact not found" });
    }
    res.json(contact); // Return the contact data
  } catch (err) {
    console.error("Error fetching contact:", err.message);
    res.status(500).send("Server Error");
  }
});


// POST a new contact
router.post("/", async (req, res) => {
  const { name, email, phone } = req.body;
  
  if (!name || !email || !phone) {
    return res.status(400).json({ msg: "Please provide all required fields" });
  }
  
  try {
    const newContact = new Contact({
      name,
      email,
      phone
    });
    
    await newContact.save();  // Save the new contact in the database
    res.json(newContact);  // Return the newly created contact
  } catch (err) {
    console.error(err.message);
    res.status(400).send("Error adding contact");
  }
});

// DELETE a contact by ID
router.delete("/:id", async (req, res) => {
  try {
    const contact = await Contact.findByIdAndRemove(req.params.id);  // Find and remove the contact by ID
    
    if (!contact) {
      return res.status(404).json({ msg: "Contact not found" });  // If contact doesn't exist
    }
    
    res.json({ msg: "Contact removed" });  // Successfully deleted
  } catch (err) {
    console.error(err.message);
    res.status(400).send("Error deleting contact");
  }
});

// PUT (Edit) a contact by ID
router.put("/:id", async (req, res) => {
  const { name, email, phone } = req.body;

  // Check if the required fields are provided
  if (!name || !email || !phone) {
    return res.status(400).json({ msg: "Please provide all required fields" });
  }

  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      { name, email, phone },  // Update fields
      { new: true }  // Return the updated contact
    );
    
    if (!updatedContact) {
      return res.status(404).json({ msg: "Contact not found" });
    }

    res.json(updatedContact);  // Return the updated contact
  } catch (err) {
    console.error(err.message);
    res.status(400).send("Error updating contact");
  }
});

module.exports = router;
