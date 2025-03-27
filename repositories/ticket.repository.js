const Ticket = require("../Routes/ticket");

class TicketRepository {
  async createTicket(ticketData) {
    return await Ticket.create(ticketData);
  }

  async getTicketsByUser(userId) {
    return await Ticket.find({ user: userId }).populate("products.productId");
  }

  async getTicketById(ticketId) {
    return await Ticket.findById(ticketId).populate("products.productId");
  }

  async updateTicketStatus(ticketId, status) {
    return await Ticket.findByIdAndUpdate(ticketId, { status }, { new: true });
  }
}

module.exports = new TicketRepository();
