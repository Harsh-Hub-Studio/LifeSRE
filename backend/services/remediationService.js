async function generateCancellationEmail(contract) {
  return `
Dear ${contract.vendor},

Please cancel my subscription immediately.
Do not auto-renew.

Thank you.
`;
}

module.exports = generateCancellationEmail;