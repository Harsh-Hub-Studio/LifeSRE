const mongoose = require("mongoose");

const auditSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  contractId: mongoose.Schema.Types.ObjectId,
  action: String,
  metadata: Object,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("AuditLog", auditSchema);