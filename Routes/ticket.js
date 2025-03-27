const express = require("express");
const passport = require("passport");
const TicketRepository = require("../repositories/ticket.repository");
const authorize = require("../middleware/auth");

const router = express.Router();

// Crear un ticket (compra de productos)
router.post("/", passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    const { products, totalPrice } = req.body;

    if (!products || !totalPrice) {
      return res.status(400).json({ message: "Faltan datos en la compra" });
    }

    const newTicket = await TicketRepository.createTicket({
      user: req.user._id,
      products,
      totalPrice
    });

    res.status(201).json({ message: "Compra registrada", ticket: newTicket });
  } catch (error) {
    console.error("🔴 Error al crear ticket:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Obtener los tickets de un usuario
router.get("/", passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    const tickets = await TicketRepository.getTicketsByUser(req.user._id);
    res.json({ tickets });
  } catch (error) {
    console.error("🔴 Error al obtener tickets:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Obtener un ticket por ID
router.get("/:id", passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    const ticket = await TicketRepository.getTicketById(req.params.id);

    if (!ticket) return res.status(404).json({ message: "Ticket no encontrado" });

    res.json({ ticket });
  } catch (error) {
    console.error("🔴 Error al obtener ticket:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Actualizar el estado de un ticket (requiere ser admin)
router.put("/:id/status", passport.authenticate("jwt", { session: false }), authorize(["admin"]), async (req, res) => {
  try {
    const { status } = req.body;
    const validStatus = ["pending", "paid", "cancelled"];

    if (!validStatus.includes(status)) {
      return res.status(400).json({ message: "Estado inválido" });
    }

    const updatedTicket = await TicketRepository.updateTicketStatus(req.params.id, status);

    if (!updatedTicket) return res.status(404).json({ message: "Ticket no encontrado" });

    res.json({ message: "Estado actualizado", ticket: updatedTicket });
  } catch (error) {
    console.error("🔴 Error al actualizar ticket:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

module.exports = router;

