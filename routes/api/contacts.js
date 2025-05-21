const express = require('express');
const router = express.Router();
const Joi = require('joi');

const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require('../../models/contacts');

const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

router.get('/', async (req, res) => {
  const contacts = await listContacts();
  res.status(200).json(contacts);
});

router.get('/:contactId', async (req, res) => {
  const contact = await getContactById(req.params.contactId);
  if (!contact) return res.status(404).json({ message: 'Not found' });
  res.status(200).json(contact);
});

router.post('/', async (req, res) => {
  const { error } = contactSchema.validate(req.body);
  if (error) return res.status(400).json({ message: 'missing required name field' });

  const contact = await addContact(req.body);
  res.status(201).json(contact);
});

router.delete('/:contactId', async (req, res) => {
  const removed = await removeContact(req.params.contactId);
  if (!removed) return res.status(404).json({ message: 'Not found' });
  res.status(200).json({ message: 'contact deleted' });
});

router.put('/:contactId', async (req, res) => {
  const body = req.body;
  if (!body.name && !body.email && !body.phone) {
    return res.status(400).json({ message: 'missing fields' });
  }

  const updated = await updateContact(req.params.contactId, body);
  if (!updated) return res.status(404).json({ message: 'Not found' });

  res.status(200).json(updated);
});

module.exports = router;
