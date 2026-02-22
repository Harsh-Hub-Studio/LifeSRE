function generateCompetitorQuote(contract) {
  const reduction = Math.floor(contract.renewalAmount * 0.15);
  const bestAlternative = contract.renewalAmount - reduction;

  return {
    bestAlternative,
    potentialSavings: reduction,
    confidence: reduction > 300 ? "High" : "Medium",
  };
}

module.exports = generateCompetitorQuote;